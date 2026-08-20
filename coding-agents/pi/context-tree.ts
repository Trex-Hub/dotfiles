/**
 * context-tree-gauge.ts
 *
 * The ambient context-health gauge from pi-context-tree
 * (https://github.com/navbytes/pi-context-tree), extracted into one
 * self-contained file — no @pi-context-tree/core, no chalk, no branch/
 * merge/crop machinery. Just the bar.
 *
 * Faithfully reproduces, from the original source:
 *   - packages/tui/src/gauge.ts    → renderGauge()  (band ticks, fill bar,
 *                                     honest "estimating" state, fmtTokens)
 *   - packages/extension/src/ambient.ts → refreshAmbient() / registerAmbient()
 *                                     (hook wiring, trend arrow, red-band
 *                                     one-time nudge)
 *
 * Deliberately dropped (this is what made it "not a single file" upstream):
 *   - Per-tool consumer attribution via their branch/fork tree model
 *     (aggregateConsumers/contextSlice in @pi-context-tree/core) — replaced
 *     below with a much simpler approximation: whichever tool ran just
 *     before a >=5pt jump gets named. Same spirit, no tree dependency.
 *   - chars/4 manual token estimation — pi's own ctx.getContextUsage()
 *     already estimates trailing messages when there's no exact usage yet,
 *     so that logic isn't reimplemented here.
 *   - /branch, /merge, /crop, /panel, pitree — unrelated to the gauge.
 *
 * Install: drop in your extensions dir alongside your /exit alias and
 * register it the same way.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// ---------------------------------------------------------------------------
// Bands — identical thresholds to upstream (F5.2): low <5 · healthy 5–15 ·
// filling 15–40 · red >40
// ---------------------------------------------------------------------------

type Band = "low" | "healthy" | "filling" | "red";
const BAND_THRESHOLDS = { healthy: 5, filling: 15, red: 40 } as const;

function band(percent: number): Band {
  if (percent < BAND_THRESHOLDS.healthy) return "low";
  if (percent < BAND_THRESHOLDS.filling) return "healthy";
  if (percent <= BAND_THRESHOLDS.red) return "filling";
  return "red";
}

/** 950 → "950" · 19400 → "19.4k" · 200000 → "200k" (upstream fmtTokens) */
function fmtTokens(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

// theme.fg("success"|"warning"|"error"|"dim", text) — mapped onto the
// low/healthy/filling/red bands. Uses pi's own theme instead of chalk.
function bandColor(b: Band, theme: any): (s: string) => string {
  const key = b === "low" || b === "healthy" ? "success" : b === "filling" ? "warning" : "error";
  return (s: string) => theme.fg(key, s);
}

// ---------------------------------------------------------------------------
// Gauge rendering — port of packages/tui/src/gauge.ts renderGauge()
// ---------------------------------------------------------------------------

function renderGauge(tokens: number | null, window: number | undefined, theme: any, barWidth = 28): string {
  const dim = (s: string) => theme.fg("dim", s);

  if (tokens === null || !window || window <= 0) {
    return `${dim("CONTEXT")} ${dim("░".repeat(barWidth))} ${dim("estimating… (awaiting next turn)")}`;
  }

  const pct = (tokens / window) * 100;
  const b = band(pct);
  const color = bandColor(b, theme);
  const fill = Math.max(0, Math.min(barWidth, Math.round((pct / 100) * barWidth)));

  // Band-boundary ticks at 5/15/40%, same as upstream.
  const ticks = new Set(
    [BAND_THRESHOLDS.healthy, BAND_THRESHOLDS.filling, BAND_THRESHOLDS.red].map((p) =>
      Math.min(barWidth - 1, Math.round((p / 100) * barWidth)),
    ),
  );

  let bar = "";
  for (let i = 0; i < barWidth; i++) {
    const ch = i < fill ? "█" : ticks.has(i) ? "┊" : "░";
    bar += i < fill ? color(ch) : dim(ch);
  }

  const label = `${fmtTokens(tokens)} / ${fmtTokens(window)} · ${color(`${pct.toFixed(1)}% ${b}`)}`;
  return `${dim("CONTEXT")} ${bar} ${label}`;
}

// ---------------------------------------------------------------------------
// Ambient wiring — port of packages/extension/src/ambient.ts
// ---------------------------------------------------------------------------

const TREND_PTS = 3; // ▲ when context rose >= this many points since last check
const ATTRIBUTE_PTS = 5; // …and name the tool that just ran, at >= this jump

let lastPct: number | null = null;
let lastTool: string | null = null;
let warnedRed = false;

function resetAmbient(): void {
  lastPct = null;
  lastTool = null;
  warnedRed = false;
}

function trendMarker(pct: number, theme: any): string {
  if (lastPct === null) {
    lastPct = pct;
    return "";
  }
  const delta = pct - lastPct;
  lastPct = pct;
  if (delta < TREND_PTS) return "";
  if (delta >= ATTRIBUTE_PTS && lastTool) {
    return theme.fg("warning", ` ▲ +${Math.round(delta)}% (${lastTool})`);
  }
  return theme.fg("warning", " ▲");
}

function nudgeOnRed(ctx: any, b: Band): void {
  if (b === "red" && !warnedRed) {
    warnedRed = true;
    ctx.ui.notify("context crossed 40% of the window — consider trimming or branching off", "warning");
  }
  if (b !== "red") warnedRed = false;
}

function refreshAmbient(ctx: any): void {
  const usage = ctx.getContextUsage?.();
  const window: number | undefined = usage?.contextWindow ?? ctx.model?.contextWindow;
  // pi reports 0 tokens until a fresh assistant turn lands — treat that as
  // "estimating" the same way upstream does.
  const tokens: number | null = usage && usage.tokens > 0 ? usage.tokens : null;

  const theme = ctx.ui.theme;
  const gauge = renderGauge(tokens, window, theme);

  let trend = "";
  if (tokens !== null && window) {
    const pct = (tokens / window) * 100;
    trend = trendMarker(pct, theme);
    nudgeOnRed(ctx, band(pct));
  }

  // Passing a plain string array to setWidget wraps each line in a Text
  // component with its default paddingX=1/paddingY=1 — that's the leftover
  // 1-column indent and the blank line above/below the bar. Passing a factory
  // that returns a bare { render, invalidate } skips that wrapper entirely,
  // so the line sits flush at column 0 like every other status line.
  const line = `${gauge}${trend}`;
  ctx.ui.setWidget(
    "ctree-gauge",
    () => ({
      render: () => [line],
      invalidate: () => {},
    }),
    { placement: "aboveEditor" },
  );
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
    resetAmbient();
    refreshAmbient(ctx);
  });

  pi.on("turn_end", (_event, ctx) => refreshAmbient(ctx));

  pi.on("tool_result", (event: any, ctx) => {
    lastTool = event.toolName ?? lastTool;
    refreshAmbient(ctx);
  });
}