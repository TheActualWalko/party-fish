#!/bin/bash
rm -r ./testbuild;
if tsc --module commonjs --outDir testbuild --sourceMap; then
  mocha testbuild/tests/dependencies.js testbuild/tests/**/*.js testbuild/tests/**/**/*.js testbuild/tests/**/**/**/*.js
else
  echo "Could not compile"
fi