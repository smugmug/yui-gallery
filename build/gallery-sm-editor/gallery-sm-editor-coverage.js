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
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].code=["YUI.add('gallery-sm-editor', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides `Y.Editor`, a simple but powerful WYSIWYG editor.","","@module gallery-sm-editor","@main gallery-sm-editor","**/","","/**","A simple but powerful WYSIWYG editor.","","@class Editor","@constructor","@extends Editor.Base","@uses Editor.Keys","@uses Editor.Link","@uses Editor.Style","@uses Editor.Undo","**/","(function () {","    var extensions = [","        Y.Editor.Keys,","        Y.Editor.Link,","        Y.Editor.Queue,","        Y.Editor.Block,","        Y.Editor.Style,","        Y.Editor.Format","//        Y.Editor.Undo","    ];","","    if (Y.UA.chrome) {","        extensions.push(Y.Editor.Delete);","    }","","    Y.Editor = Y.mix(","        Y.Base.create('editor', Y.Editor.Base, extensions, {}),","        Y.Editor","    );","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-block\",","        \"gallery-sm-editor-delete\",","        \"gallery-sm-editor-format\",","        \"gallery-sm-editor-keys\",","        \"gallery-sm-editor-link\",","        \"gallery-sm-editor-queue\",","        \"gallery-sm-editor-style\",","        \"gallery-sm-editor-undo\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].lines = {"1":0,"23":0,"24":0,"34":0,"35":0,"38":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].functions = {"(anonymous 2):23":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredLines = 6;
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredFunctions = 2;
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
@uses Editor.Keys
@uses Editor.Link
@uses Editor.Style
@uses Editor.Undo
**/
_yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 23);
(function () {
    _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 2)", 23);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 24);
var extensions = [
        Y.Editor.Keys,
        Y.Editor.Link,
        Y.Editor.Queue,
        Y.Editor.Block,
        Y.Editor.Style,
        Y.Editor.Format
//        Y.Editor.Undo
    ];

    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 34);
if (Y.UA.chrome) {
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 35);
extensions.push(Y.Editor.Delete);
    }

    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 38);
Y.Editor = Y.mix(
        Y.Base.create('editor', Y.Editor.Base, extensions, {}),
        Y.Editor
    );
}());


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
