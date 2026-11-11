# herdr-app

Config for the new Herdr app (`herdr-app`). The old Herdr config lives in `../herdr/config.toml` and is not used by this app.

## Contents

| Path                  | Destination                                  | Notes                                                           |
| --------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `keys.json`           | `~/.config/herdr-app/keys.json`              | Shortcuts. Includes my `ctrl-t` / `ctrl-y` / `ctrl-x` pane keys |
| `settings.json`       | `~/.config/herdr-app/settings.json`          | Zoom, sounds, appearance, `"theme": "gruvbox"`, `"telemetry": false` |
| `themes/gruvbox.json` | `~/.config/herdr-app/themes/gruvbox.json`    | Gruvbox dark: terminal palette plus explicit panel `colors`     |
| `mods/spaces-gruvbox/` | `~/.config/herdr-app/mods/spaces-gruvbox/` | Clone of the shipped `spaces` mod with Gruvbox space-tile colors (`main.js:39`) |
| `mods/tabs-gruvbox/` | `~/.config/herdr-app/mods/tabs-gruvbox/` | Clone of the shipped `tabs` mod: the new-tab `+` sits after the last tab pill (`main.js:107`) |
| `layouts/main-gruvbox.json` | `~/.config/herdr-app/layouts/main-gruvbox.json` | Clone of the `main` layout using `spaces-gruvbox` and `tabs-gruvbox` |

## Setup

```bash
mkdir -p ~/.config/herdr-app/themes
cp keys.json settings.json ~/.config/herdr-app/
cp themes/gruvbox.json ~/.config/herdr-app/themes/
mkdir -p ~/.config/herdr-app/mods ~/.config/herdr-app/layouts
cp -r mods/spaces-gruvbox mods/tabs-gruvbox ~/.config/herdr-app/mods/
cp layouts/main-gruvbox.json ~/.config/herdr-app/layouts/
```

Herdr writes `gpui-kit.d.ts` and `jsconfig.json` into every mod folder; they are machine-generated and not kept here.

The app rewrites these files, so they are copied rather than symlinked. Re-copy from `~/.config/herdr-app/` into this folder after changing them.

## Key bindings I added

| Key            | Action                                             |
| -------------- | -------------------------------------------------- |
| `ctrl-t`       | `pane.split:right`                                 |
| `ctrl-y`       | `pane.split:down`                                  |
| `ctrl-x`       | `pane.close`                                       |
| `cmd-e`        | Split right with the `files` mod (file viewer)     |
| `cmd-shift-e`  | New tab with the `files` mod                       |

These globally bind `ctrl-t`, `ctrl-y` and `ctrl-x`, so the shell no longer receives them (readline transpose, yank, `ctrl-x` prefix).

## Space tiles

The shipped `spaces` mod hard-codes its tile colors and Herdr restores edits to shipped mods, so `mods/spaces-gruvbox/` is a clone (`mod.clone`) with Gruvbox colors and dark tile text, and `layouts/main-gruvbox.json` is a clone of `main` pointing at it. Switch with `ctrl-shift-l`.

## Tab bar

Herdr's tab bar already has a `+`, but at the far right end, next to `Files` / `Changes`. `mods/tabs-gruvbox/` is a clone (`mod.clone`) with that one button moved inside the tab strip, so the `+` sits immediately after the last tab pill and scrolls with the tabs. It still opens the shipped `new-menu` popup (new terminal or any installed agent), i.e. a new **tab**; panes are still `ctrl-t` / `cmd-d` (right) and `ctrl-y` / `cmd-shift-d` (down). `layouts/main-gruvbox.json` points its `tabs` block at the clone. Re-clone and re-apply with:

```bash
herdr-app do mod.clone '{"name":"tabs","as":"tabs-gruvbox"}'   # then move the button at main.js:107
```

## Theme

Pick it in Settings → Look → Dark → gruvbox, or set `"theme": "gruvbox"` in `settings.json`. The `colors` block in `themes/gruvbox.json` sets the sidebar and tab bar (`chrome`, `canvas`), panels, accent and agent status colors. Without it, Herdr derives panel colors from the terminal palette and the sidebar stays neutral grey.

## Not migrated from the old config

Herdr has no equivalent for: modal `prefix` key, `mouse_capture`, `copy_on_select`, `mouse_scroll_lines`, `agent_panel_sort`, `show_agent_labels_on_pane_borders`, `ui.toast.delivery`, `experimental.*`. The `herdr-file-viewer` plugin is replaced by the shipped `files` mod.
