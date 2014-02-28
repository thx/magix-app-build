#!/bin/bash
echo "begin packaging"
npm install
echo "let's rock!"
grunt pack --appDir=../../public/app/ --destDir=../../public/build/app/ --compress=normal --c2u=false
echo "end packaging"