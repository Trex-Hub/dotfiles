# dotfiles

Universal configs for my machines.

## Contents


| Path                             | Source                     | Notes                                                                                              |
| -------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| `.zshrc`                         | `~/.zshrc`                 | oh-my-zsh, kubectl aliases, tmux helper                                                            |
| `.tmux.conf`                     | `~/.tmux.conf`             | Tmux config                                                                                        |
| `ghostty/config`                 | `~/.config/ghostty/config` | Cmd+V paste keybind                                                                                |
| `to-pdf/to-pdf`                  | `~/.local/bin/to-pdf`      | Convert Markdown to a styled PDF                                                                   |
| `to-pdf/style.css`               | `~/.config/to-pdf/style.css` | Editable PDF stylesheet                                                                          |
| `herdr-app/keys.json`            | `~/.config/herdr-app/keys.json` | Herdr app shortcuts (see `herdr-app/README.md`)                                          |
| `herdr-app/settings.json`        | `~/.config/herdr-app/settings.json` | Herdr app settings                                                                   |
| `herdr-app/themes/gruvbox.json`  | `~/.config/herdr-app/themes/gruvbox.json` | Gruvbox theme for Herdr app                                                    |
| `herdr-app/mods/spaces-gruvbox/`, `herdr-app/mods/tabs-gruvbox/`, `herdr-app/layouts/main-gruvbox.json` | `~/.config/herdr-app/` | Gruvbox space tiles and tab bar (see `herdr-app/README.md`) |
| `coding-agents/AGENTS.md`        | `~/.pi/agent/AGENTS.md`    | Global Agent instructions for any/every coding agent.                                              |
| `coding-agents/pi/settings.json` | Pi settings                | Global config file containing curated list of extensions I hand picked and continue using everyday |
| `coding-agents/pi/slash-exit.ts` | Custom slash command       | Something I stiched together because I'm lazy to type the default 'quit'. Bite me                  |


## Usage

```bash
# Symlink or copy into place
ln -sf ~/path/to/dotfiles/.zshrc ~/.zshrc
ln -sf ~/path/to/dotfiles/.tmux.conf ~/.tmux.conf
ln -sf ~/path/to/dotfiles/ghostty/config ~/.config/ghostty/config
ln -sf ~/path/to/dotfiles/to-pdf/to-pdf ~/.local/bin/to-pdf
mkdir -p ~/.config/to-pdf
ln -sf ~/path/to/dotfiles/to-pdf/style.css ~/.config/to-pdf/style.css
mkdir -p ~/.config/herdr-app/themes
cp herdr-app/keys.json herdr-app/settings.json ~/.config/herdr-app/
cp herdr-app/themes/gruvbox.json ~/.config/herdr-app/themes/
mkdir -p ~/.config/herdr-app/mods ~/.config/herdr-app/layouts
cp -r herdr-app/mods/spaces-gruvbox herdr-app/mods/tabs-gruvbox ~/.config/herdr-app/mods/
cp herdr-app/layouts/main-gruvbox.json ~/.config/herdr-app/layouts/
```

`to-pdf docs/file.md` creates `./file.pdf` in the current directory; pass a second argument for another output path. Edit `to-pdf/style.css` and re-run to iterate. Install the converter once with `npm install -g md-to-pdf`.

Agent configs live at `~/.pi/agent/` — check that path for placement.