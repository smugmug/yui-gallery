YUI.add('gallery-sm-editor', function (Y, NAME) {

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
@uses Editor.Delete
@uses Editor.Keys
@uses Editor.Link
@uses Editor.Queue
@uses Editor.Block
@uses Editor.Style
@uses Editor.Format
**/
Y.Editor = Y.mix(
    Y.Base.create('editor', Y.Editor.Base, [
        Y.Editor.Delete,
        Y.Editor.Keys,
        Y.Editor.Link,
        Y.Editor.Queue,
        Y.Editor.Block,
        Y.Editor.Style,
        Y.Editor.Format
//        Y.Editor.Undo
    ], {}),
    Y.Editor
);


}, '@VERSION@', {
    "use": [
        "gallery-sm-editor-base",
        "gallery-sm-editor-block",
        "gallery-sm-editor-delete",
        "gallery-sm-editor-format",
        "gallery-sm-editor-keys",
        "gallery-sm-editor-link",
        "gallery-sm-editor-queue",
        "gallery-sm-editor-style",
        "gallery-sm-editor-undo"
    ],
    "skinnable": true
});
