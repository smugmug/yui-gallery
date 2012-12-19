#!/bin/bash
#
# Run this script to copy built files into this repo and regenerate API docs. It
# assumes you have the master branch of the yui-gallery repo checked out at
# ../yui-gallery.
#

DOC_ROOT=$PWD

rm -rf ./build
cp -R ../yui-gallery/build ./

cd ../yui-gallery
yuidoc -c "$DOC_ROOT"/yuidoc.json -o "$DOC_ROOT"/api src
