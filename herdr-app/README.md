# herdr-app

Config for the new Herdr app (`herdr-app`). The old Herdr config lives in `../herdr/config.toml` and is not used by this app.

## Contents

| Path                  | Destination                                  | Notes                                                           |
| --------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `keys.json`           | `~/.config/herdr-app/keys.json`              | Shortcuts. Includes my `ctrl-t` / `ctrl-y` / `ctrl-x` pane keys |
| `settings.json`       | `~/.config/herdr-app/settings.json`          | Zoom, sounds, appearance, `"theme": "gruvbox"`                  |
| `themes/gruvbox.json` | `~/.config/herdr-app/themes/gruvbox.json`    | Gruvbox dark: terminal palette plus explicit panel `colors`     |
| `mods/spaces-gruvbox/` | `~/.config/herdr-app/mods/spaces-gruvbox/` | Clone of the shipped `spaces` mod with Gruvbox space-tile colors (`main.js:39`) |
| `layouts/main-gruvbox.json` | `~/.config/herdr-app/layouts/main-gruvbox.json` | Clone of the `main` layout using `spaces-gruvbox` |

## Setup

```bash
mkdir -p ~/.config/herdr-app/themes
cp keys.json settings.json ~/.config/herdr-app/
cp themes/gruvbox.json ~/.config/herdr-app/themes/
mkdir -p ~/.config/herdr-app/mods ~/.config/herdr-app/layouts
cp -r mods/spaces-gruvbox ~/.config/herdr-app/mods/
cp layouts/main-gruvbox.json ~/.config/herdr-app/layouts/
```

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

## Theme

Pick it in Settings → Look → Dark → gruvbox, or set `"theme": "gruvbox"` in `settings.json`. The `colors` block in `themes/gruvbox.json` sets the sidebar and tab bar (`chrome`, `canvas`), panels, accent and agent status colors. Without it, Herdr derives panel colors from the terminal palette and the sidebar stays neutral grey.

## Not migrated from the old config

Herdr has no equivalent for: modal `prefix` key, `mouse_capture`, `copy_on_select`, `mouse_scroll_lines`, `agent_panel_sort`, `show_agent_labels_on_pane_borders`, `ui.toast.delivery`, `experimental.*`. The `herdr-file-viewer` plugin is replaced by the shipped `files` mod.
