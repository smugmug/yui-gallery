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
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-dom/gallery-sm-editor-dom.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].code=["YUI.add('gallery-sm-editor-dom', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.DOM` utility class.","","@module gallery-sm-editor","@submodule gallery-sm-editor-dom","**/","","/**","DOM utility methods for `Editor.Base`","","@class Editor.DOM","**/","","var EditorDOM = function() {};","","/**","Finds the nearest ancestor with a given tagName","","@param {Node} node","@param {String} [tagName] Optional tagName. If not provided, the nearest","  ancestor element node will be returned","@return {Node}","@static","**/","EditorDOM.getAncestorElement = function(node, tagName) {","    tagName && (tagName = tagName.toUpperCase());","","    function tagFn(node) {","        var nodeTag = node.get('tagName');","","        return nodeTag && tagName === nodeTag.toUpperCase();","    }","","    return node.ancestor(tagName ? tagFn : EditorDOM.isElementNode, true);","};","","","/**","@method isElementNode","@param {Node} node","@return {Boolean}","@static","**/","EditorDOM.isElementNode = function(node) {","    return 1 === node.get('nodeType');","};","","","/**","@method isTextNode","@param {Node} node","@return {Boolean}","@static","**/","EditorDOM.isTextNode = function(node) {","    return 3 === node.get('nodeType');","};","","","/**","Returns the maximum offset of a given node as determined by the type of node.","","Element nodes will return the number of childNodes","Text nodes will return the length of the text","","@method maxOffset","@param {HTMLElement|Node} node","@return {Number} Number of child nodes or length of text","@static","**/","EditorDOM.maxOffset = function(node) {","    node = Y.one(node);","","    return node.get('childNodes').size() || node.get('length');","};","","","/**","Unwraps a node","","@method unwrap","@param {Node} node","@return {Range} Range containing the unwrapped child nodes","@static","**/","EditorDOM.unwrap = function (node) {","    var parent, child, range, startNode, endNode;","","    parent = node.get('parentElement');","","    while (child = node.get('firstChild')) {","        parent.insertBefore(child, node);","","        if (!startNode) {","            startNode = child;","        }","","        endNode = child;","    }","","    node.remove(true);","","    range = new Y.Range();","    range.startNode(startNode);","    range.endNode(endNode, EditorDOM.maxOffset(endNode));","","    return range;","};","","","Y.namespace('Editor').DOM = EditorDOM;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-range\", \"node\"]});"];
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].lines = {"1":0,"18":0,"29":0,"30":0,"32":0,"33":0,"35":0,"38":0,"48":0,"49":0,"59":0,"60":0,"75":0,"76":0,"78":0,"90":0,"91":0,"93":0,"95":0,"96":0,"98":0,"99":0,"102":0,"105":0,"107":0,"108":0,"109":0,"111":0,"115":0};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].functions = {"tagFn:32":0,"getAncestorElement:29":0,"isElementNode:48":0,"isTextNode:59":0,"maxOffset:75":0,"unwrap:90":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].coveredLines = 29;
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].coveredFunctions = 7;
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 1);
YUI.add('gallery-sm-editor-dom', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.DOM` utility class.

@module gallery-sm-editor
@submodule gallery-sm-editor-dom
**/

/**
DOM utility methods for `Editor.Base`

@class Editor.DOM
**/

_yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 18);
var EditorDOM = function() {};

/**
Finds the nearest ancestor with a given tagName

@param {Node} node
@param {String} [tagName] Optional tagName. If not provided, the nearest
  ancestor element node will be returned
@return {Node}
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 29);
EditorDOM.getAncestorElement = function(node, tagName) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "getAncestorElement", 29);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 30);
tagName && (tagName = tagName.toUpperCase());

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 32);
function tagFn(node) {
        _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "tagFn", 32);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 33);
var nodeTag = node.get('tagName');

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 35);
return nodeTag && tagName === nodeTag.toUpperCase();
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 38);
return node.ancestor(tagName ? tagFn : EditorDOM.isElementNode, true);
};


/**
@method isElementNode
@param {Node} node
@return {Boolean}
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 48);
EditorDOM.isElementNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isElementNode", 48);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 49);
return 1 === node.get('nodeType');
};


/**
@method isTextNode
@param {Node} node
@return {Boolean}
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 59);
EditorDOM.isTextNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isTextNode", 59);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 60);
return 3 === node.get('nodeType');
};


/**
Returns the maximum offset of a given node as determined by the type of node.

Element nodes will return the number of childNodes
Text nodes will return the length of the text

@method maxOffset
@param {HTMLElement|Node} node
@return {Number} Number of child nodes or length of text
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 75);
EditorDOM.maxOffset = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "maxOffset", 75);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 76);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 78);
return node.get('childNodes').size() || node.get('length');
};


/**
Unwraps a node

@method unwrap
@param {Node} node
@return {Range} Range containing the unwrapped child nodes
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 90);
EditorDOM.unwrap = function (node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "unwrap", 90);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 91);
var parent, child, range, startNode, endNode;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 93);
parent = node.get('parentElement');

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 95);
while (child = node.get('firstChild')) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 96);
parent.insertBefore(child, node);

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 98);
if (!startNode) {
            _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 99);
startNode = child;
        }

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 102);
endNode = child;
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 105);
node.remove(true);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 107);
range = new Y.Range();
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 108);
range.startNode(startNode);
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 109);
range.endNode(endNode, EditorDOM.maxOffset(endNode));

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 111);
return range;
};


_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 115);
Y.namespace('Editor').DOM = EditorDOM;


}, '@VERSION@', {"requires": ["gallery-sm-range", "node"]});
