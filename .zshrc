export ZSH="$HOME/.oh-my-zsh"
export PATH="$HOME/.local/bin:$PATH"

# Set "random" for a new theme everytime.
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"


plugins=(git kubectl zsh-autosuggestions)

ZSH_AUTOSUGGEST_STRATEGY=(history completion)

source $ZSH/oh-my-zsh.sh

alias kctl=kubectl
alias kctx='kubectl config use-context'
alias pkctl='kubectl -n prod'
alias skctl='kubectl -n staging'
alias python=python3
alias run-help=man
alias which-command=whence
alias refresh='source ~/.zshrc'

# Custom Functions
tns() {
  if [ -z "$1" ]; then
    echo "Usage: tns <session-name>"
    return 1
  fi

  if [ -n "$TMUX" ]; then
    # Already inside tmux — create detached, then switch client to it
    tmux new-session -d -s "$1" 2>/dev/null
    tmux switch-client -t "$1"
  else
    # Outside tmux — attach if it exists, else create and attach directly
    tmux new-session -A -s "$1"
  fi
}

copy() {
  local copy_cmd

  if [[ "$OSTYPE" == darwin* ]] && command -v pbcopy >/dev/null 2>&1; then
    copy_cmd="pbcopy"
  elif [[ -n "$WAYLAND_DISPLAY" ]] && command -v wl-copy >/dev/null 2>&1; then
    copy_cmd="wl-copy"
  elif command -v xclip >/dev/null 2>&1; then
    copy_cmd="xclip -selection clipboard"
  elif command -v xsel >/dev/null 2>&1; then
    copy_cmd="xsel --clipboard --input"
  elif command -v clip.exe >/dev/null 2>&1; then
    copy_cmd="clip.exe"   # WSL
  else
    echo "copy: no clipboard utility found (install xclip, xsel, or wl-clipboard)" >&2
    "$@"
    return 1
  fi

  "$@" 2>&1 | tee /dev/tty | eval "$copy_cmd"
}

# Completions
# pnpm
if command -v pnpm &>/dev/null; then
  eval "$(pnpm completion zsh)"
fi

# npm (via bashcompinit bridge)
autoload -U +X bashcompinit && bashcompinit
if command -v npm &>/dev/null; then
  eval "$(npm completion --loglevel error 2>/dev/null)"
fi
