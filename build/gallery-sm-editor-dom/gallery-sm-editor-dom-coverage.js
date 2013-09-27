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
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].code=["YUI.add('gallery-sm-editor-dom', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.DOM` utility class.","","@module gallery-sm-editor","@submodule gallery-sm-editor-dom","**/","","/**","DOM utility methods for `Editor.Base`","","@class Editor.DOM","**/","","var EditorDOM = {};","","/**","Copies styles from a node to another node","@param {HTMLElement|Node} from","@param {HTMLElement|Node} to","@param {Array} styles","@param {Object} [options]","    @param {Boolean} [options.explicit=false] When set to `true` copy only","        explicitly set properties from the source node. IOW, don't use","        computedStyle.","    @param {Boolean} [options.overwrite=false] When set to `true`","        properties from the source node will overwrite the same property","        set on the destination node.","**/","EditorDOM.copyStyles = function(from, to, styles, options) {","    var newStyles = {},","        explicit = options && options.explicit,","        overwrite = options && options.overwrite;","","    from = Y.one(from);","    to = Y.one(to);","","    if (!EditorDOM.isElementNode(from) || !EditorDOM.isElementNode(to)) {","        return;","    }","","    Y.Array.each(styles, function(prop) {","        var newVal = explicit ? from._node.style[prop] : from.getStyle(prop);","","        if ('' !== newVal && (overwrite || '' === to._node.style[prop])) {","            newStyles[prop] = newVal;","        }","    });","","    to.setStyles(newStyles);","};","","","/**","Returns true if the given node is an element node, false otherwise","","@method isElementNode","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is an element node, false otherwise","@static","**/","EditorDOM.isElementNode = function(node) {","    node = Y.one(node);","","    return node._node && 1 === node._node.nodeType;","};","","","/**","Returns true if the given node is empty","","Nodes containing only returns, tabs or linefeeds are considered empty","Nodes containing only whitespace or breaks (br) are not considered empty","","@method isEmptyNode","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is a empty, false otherwise","@static","**/","EditorDOM.isEmptyNode = function(node) {","    node = Y.one(node);","","    if (node && node.test('br')) {","        return false;","    } else {","        return (/^[^\\S ]*$/).test(node ? node.get('text') : '') && !node.one('br');","    }","};","","","/**","Returns true if the given node is a text node, false otherwise","","@method isTextNode","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is a text node, false otherwise","@static","**/","EditorDOM.isTextNode = function(node) {","    node = Y.one(node);","","    return node._node && 3 === node._node.nodeType;","};","","","/**","Returns the maximum offset of a given node as determined by the type of node.","","Element nodes will return the number of childNodes","Text nodes will return the length of the text","","@method maxOffset","@param {HTMLNode|Node} node","@return {Number} Number of child nodes or length of text","@static","**/","EditorDOM.maxOffset = function(node) {","    node = Y.one(node);","","    return node.get('childNodes').size() || node.get('length');","};","","","/**","Splits the given node at the specified offset","","@method split","@param {Node} node The node to split","@param {Number|Node} offset Position to split the node.","    For text nodes this is numerical offset, for element nodes can be a","    a number referencing a childNode of `node` or a childNode reference.","@returns {Node} Node reference to the node created after splitting. It will","    be the nextSibling of `node`. If offset is not valid, the original `node`","    is returned.","**/","EditorDOM.split = function(node, offset) {","    var childNodes = node.get('childNodes'),","        splitNode;","","    node = Y.one(node);","","    if (offset && offset._node) {","        offset = childNodes.indexOf(offset);","    } else {","        offset = parseInt(offset, 10);","    }","","    if (isNaN(offset) || offset < 0 || offset > EditorDOM.maxOffset(node)) {","        return node;","    }","","    if (EditorDOM.isTextNode(node)) {","        return Y.one(node._node.splitText(offset));","    } else {","        splitNode = node.cloneNode(false).append(childNodes.splice(offset));","        node.insert(splitNode, 'after');","","        return splitNode;","    }","};","","","Y.namespace('Editor').DOM = EditorDOM;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-range\", \"node\"]});"];
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].lines = {"1":0,"18":0,"33":0,"34":0,"38":0,"39":0,"41":0,"42":0,"45":0,"46":0,"48":0,"49":0,"53":0,"65":0,"66":0,"68":0,"83":0,"84":0,"86":0,"87":0,"89":0,"102":0,"103":0,"105":0,"120":0,"121":0,"123":0,"139":0,"140":0,"143":0,"145":0,"146":0,"148":0,"151":0,"152":0,"155":0,"156":0,"158":0,"159":0,"161":0,"166":0};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].functions = {"(anonymous 2):45":0,"copyStyles:33":0,"isElementNode:65":0,"isEmptyNode:83":0,"isTextNode:102":0,"maxOffset:120":0,"split:139":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].coveredLines = 41;
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].coveredFunctions = 8;
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
var EditorDOM = {};

/**
Copies styles from a node to another node
@param {HTMLElement|Node} from
@param {HTMLElement|Node} to
@param {Array} styles
@param {Object} [options]
    @param {Boolean} [options.explicit=false] When set to `true` copy only
        explicitly set properties from the source node. IOW, don't use
        computedStyle.
    @param {Boolean} [options.overwrite=false] When set to `true`
        properties from the source node will overwrite the same property
        set on the destination node.
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 33);
EditorDOM.copyStyles = function(from, to, styles, options) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "copyStyles", 33);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 34);
var newStyles = {},
        explicit = options && options.explicit,
        overwrite = options && options.overwrite;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 38);
from = Y.one(from);
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 39);
to = Y.one(to);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 41);
if (!EditorDOM.isElementNode(from) || !EditorDOM.isElementNode(to)) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 42);
return;
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 45);
Y.Array.each(styles, function(prop) {
        _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "(anonymous 2)", 45);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 46);
var newVal = explicit ? from._node.style[prop] : from.getStyle(prop);

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 48);
if ('' !== newVal && (overwrite || '' === to._node.style[prop])) {
            _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 49);
newStyles[prop] = newVal;
        }
    });

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 53);
to.setStyles(newStyles);
};


/**
Returns true if the given node is an element node, false otherwise

@method isElementNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is an element node, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 65);
EditorDOM.isElementNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isElementNode", 65);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 66);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 68);
return node._node && 1 === node._node.nodeType;
};


/**
Returns true if the given node is empty

Nodes containing only returns, tabs or linefeeds are considered empty
Nodes containing only whitespace or breaks (br) are not considered empty

@method isEmptyNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a empty, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 83);
EditorDOM.isEmptyNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isEmptyNode", 83);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 84);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 86);
if (node && node.test('br')) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 87);
return false;
    } else {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 89);
return (/^[^\S ]*$/).test(node ? node.get('text') : '') && !node.one('br');
    }
};


/**
Returns true if the given node is a text node, false otherwise

@method isTextNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a text node, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 102);
EditorDOM.isTextNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isTextNode", 102);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 103);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 105);
return node._node && 3 === node._node.nodeType;
};


/**
Returns the maximum offset of a given node as determined by the type of node.

Element nodes will return the number of childNodes
Text nodes will return the length of the text

@method maxOffset
@param {HTMLNode|Node} node
@return {Number} Number of child nodes or length of text
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 120);
EditorDOM.maxOffset = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "maxOffset", 120);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 121);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 123);
return node.get('childNodes').size() || node.get('length');
};


/**
Splits the given node at the specified offset

@method split
@param {Node} node The node to split
@param {Number|Node} offset Position to split the node.
    For text nodes this is numerical offset, for element nodes can be a
    a number referencing a childNode of `node` or a childNode reference.
@returns {Node} Node reference to the node created after splitting. It will
    be the nextSibling of `node`. If offset is not valid, the original `node`
    is returned.
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 139);
EditorDOM.split = function(node, offset) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "split", 139);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 140);
var childNodes = node.get('childNodes'),
        splitNode;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 143);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 145);
if (offset && offset._node) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 146);
offset = childNodes.indexOf(offset);
    } else {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 148);
offset = parseInt(offset, 10);
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 151);
if (isNaN(offset) || offset < 0 || offset > EditorDOM.maxOffset(node)) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 152);
return node;
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 155);
if (EditorDOM.isTextNode(node)) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 156);
return Y.one(node._node.splitText(offset));
    } else {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 158);
splitNode = node.cloneNode(false).append(childNodes.splice(offset));
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 159);
node.insert(splitNode, 'after');

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 161);
return splitNode;
    }
};


_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 166);
Y.namespace('Editor').DOM = EditorDOM;


}, '@VERSION@', {"requires": ["gallery-sm-range", "node"]});
