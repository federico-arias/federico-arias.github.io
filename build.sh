#!/bin/bash
source ~/.nvm/nvm.sh
cd themes/3acres-theme
nvm install
npm install
cd ../..
hugo

