#!/bin/bash
echo "begin packaging"
npm install
echo "let's rock!"
grunt --src=../../public/app/ --dest=../../public/build/app/ --compress=normal --c2u=false --minSuffix=no
echo "end packaging"