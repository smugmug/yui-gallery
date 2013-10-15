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
@uses Editor.Undo
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
