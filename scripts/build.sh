#!/bin/sh

mkdir -p dist
./node_modules/browserify/bin/cmd.js src/index.js -t [ babelify --presets [@babel/preset-env] ] -t es3ify -t browserify-shim -o dist/Control.Geocoder.HerePlaces.js
