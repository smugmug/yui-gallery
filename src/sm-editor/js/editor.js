/*jshint expr:true, onevar:false */

/**
Provides `Y.Editor`, a simple but powerful WYSIWYG editor.

@module gallery-sm-editor
@main gallery-sm-editor
**/

/**
A simple but powerful WYSIWYG editor.

@class Editor
@constructor
@extends Editor.Base
@uses Editor.Keys
@uses Editor.Style
@uses Editor.Undo
**/

Y.Editor = Y.mix(
    Y.Base.create('editor', Y.Editor.Base, [Y.Editor.Keys, Y.Editor.Style, Y.Editor.Undo], {}),
    Y.Editor
);
