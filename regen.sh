#!/bin/bash
#
# Run this script to regenerate API docs. It assumes you have the SmugMug
# yui-gallery repo checked out at ../yui-gallery.
#

DOC_ROOT=$PWD

cd ../yui-gallery
yuidoc -c "$DOC_ROOT"/yuidoc.json -o "$DOC_ROOT"/api src
