#!/bin/bash -e

USER="$(whoami)"
[ -e "/societies/cucats/web.sock" ] && rm "/societies/cucats/web.sock"
umask 0

. /societies/cucats/.config/.nvm/nvm.sh
nvm use --lts
node --env-file=/societies/cucats/public_html/website/.env /societies/cucats/public_html/website/build

