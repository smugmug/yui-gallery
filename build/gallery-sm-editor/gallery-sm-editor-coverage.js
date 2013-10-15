if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor/gallery-sm-editor.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].code=["YUI.add('gallery-sm-editor', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides `Y.Editor`, a simple but powerful WYSIWYG editor.","","@module gallery-sm-editor","@main gallery-sm-editor","**/","","/**","A simple but powerful WYSIWYG editor.","","@class Editor","@constructor","@extends Editor.Base","@uses Editor.Delete","@uses Editor.Keys","@uses Editor.Link","@uses Editor.Queue","@uses Editor.Block","@uses Editor.Style","@uses Editor.Format","@uses Editor.Undo","**/","Y.Editor = Y.mix(","    Y.Base.create('editor', Y.Editor.Base, [","        Y.Editor.Delete,","        Y.Editor.Keys,","        Y.Editor.Link,","        Y.Editor.Queue,","        Y.Editor.Block,","        Y.Editor.Style,","        Y.Editor.Format","//        Y.Editor.Undo","    ], {}),","    Y.Editor",");","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-block\",","        \"gallery-sm-editor-delete\",","        \"gallery-sm-editor-format\",","        \"gallery-sm-editor-keys\",","        \"gallery-sm-editor-link\",","        \"gallery-sm-editor-queue\",","        \"gallery-sm-editor-style\",","        \"gallery-sm-editor-undo\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].lines = {"1":0,"27":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredLines = 2;
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredFunctions = 1;
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 1);
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
@uses Editor.Undo
**/
_yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 27);
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
    "requires": [
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
