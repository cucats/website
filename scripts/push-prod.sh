#!/bin/bash

# Stop running if error
set -e

socsudo () {
    soc=$1
    shift
    sudo -Hu $soc XDG_RUNTIME_DIR=/run/user/$(id -u $soc) XDG_CONFIG_HOME=/societies/$soc/.config "$@"
}

cd /societies/cucats/public_html/website
. /societies/cucats/.config/.nvm/nvm.sh
git pull
npm i
socsudo cucats systemctl --user stop website
rm -rf build
npx vite build
socsudo cucats systemctl --user start website
echo "Successfully pushed changes"

