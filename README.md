# dotfiles

Universal configs for my machines.

## Contents


| Path                             | Source                     | Notes                                                                                              |
| -------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| `.zshrc`                         | `~/.zshrc`                 | oh-my-zsh, kubectl aliases, tmux helper                                                            |
| `.tmux.conf`                     | `~/.tmux.conf`             | Tmux config                                                                                        |
| `ghostty/config`                 | `~/.config/ghostty/config` | Cmd+V paste keybind                                                                                |
| `coding-agents/AGENTS.md`        | `~/.pi/agent/AGENTS.md`    | Global Agent instructions for any/every coding agent.                                              |
| `coding-agents/pi/settings.json` | Pi settings                | Global config file containing curated list of extensions I hand picked and continue using everyday |
| `coding-agents/pi/slash-exit.ts` | Custom slash command       | Something I stiched together because I'm lazy to type the default 'quit'. Bite me                  |


## Usage

```bash
# Symlink or copy into place
ln -sf ~/path/to/dotfiles/.zshrc ~/.zshrc
ln -sf ~/path/to/dotfiles/.tmux.conf ~/.tmux.conf
ln -sf ~/path/to/dotfiles/ghostty/config ~/.config/ghostty/config
```

Agent configs live at `~/.pi/agent/` — check that path for placement.