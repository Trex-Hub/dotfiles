export ZSH="$HOME/.oh-my-zsh"

# Set "random" for a new theme everytime.
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"


plugins=(git)

source $ZSH/oh-my-zsh.sh

alias kctl=kubectl
alias kctx='kubectl config use-context'
alias pkctl='kubectl -n prod'
alias skctl='kubectl -n staging'
alias python=python3
alias run-help=man
alias which-command=whence

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
