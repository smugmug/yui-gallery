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
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].code=["YUI.add('gallery-sm-editor-dom', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.DOM` utility class.","","@module gallery-sm-editor","@submodule gallery-sm-editor-dom","**/","","/**","DOM utility methods for `Editor.Base`","","@class Editor.DOM","**/","","var EditorDOM = {};","","EditorDOM.inlineElements = 'b, em, i, span, strong, u';","","/**","Copies styles from a node to another node","@param {HTMLElement|Node} from","@param {HTMLElement|Node} to","@param {Array} styles","@param {Object} [options]","    @param {Boolean} [options.explicit=false] When set to `true` copy only","        explicitly set properties from the source node. IOW, don't use","        computedStyle.","    @param {Boolean} [options.overwrite=false] When set to `true`","        properties from the source node will overwrite the same property","        set on the destination node.","**/","EditorDOM.copyStyles = function(from, to, styles, options) {","    var newStyles = {},","        explicit = options && options.explicit,","        overwrite = options && options.overwrite;","","    from = Y.one(from);","    to = Y.one(to);","","    if (!EditorDOM.isElementNode(from) || !EditorDOM.isElementNode(to)) {","        return;","    }","","    Y.Array.each(styles, function(prop) {","        var newVal = explicit ? from._node.style[prop] : from.getStyle(prop);","","        if ('' !== newVal && (overwrite || '' === to._node.style[prop])) {","            newStyles[prop] = newVal;","        }","    });","","    to.setStyles(newStyles);","};","","","/**","Finds the nearest ancestor element node.","","@param {Node} node","@param {Function|String} [tagName] Optional tagName or function. If a tagName","  is provided, the nearest ancestor with that tag will be returned. If a","  function is provided, it will be used for the comparision. It will receive","  a node as its only argument and should return a boolean. If nothing is","  provided, the nearest ancestor element node will be returned","@return {Node}","@static","**/","EditorDOM.getAncestorElement = function(node, tagName) {","    var fn;","","    function tagFn(node) {","        var nodeTag = node.get('tagName');","        return nodeTag && tagName === nodeTag.toUpperCase();","    }","","    if ('function' === typeof tagName) {","        fn = tagName;","    } else if ('string' === typeof tagName) {","        tagName = tagName.toUpperCase();","        fn = tagFn;","    }","","    return node.ancestor(fn || EditorDOM.isElementNode, true);","};","","","/**","Walks the ancestor tree of a given node until a node that has","the css property set is found","","@method getStyledAncestor","@param {Node} startNode","@param {String} property","@param {Boolean} [self] Whether or not to include `startNode` in the scan","@return {Node} The node having `property` set, or null if no node was found","@static","**/","EditorDOM.getStyledAncestor = function(startNode, property, self) {","    return startNode.ancestor(function(node) {","        if (!EDOM.isElementNode(node)) {","            return false;","        }","","        // don't use node.getStyle() because it will return","        // computedStyle for empty string values like `property: \"\"`","        // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106","        return !!node._node.style[property];","    }, self, this.selectors.input);","};","","","/**","Returns true if the given node is a container element, false otherwise","A container element is defined as a non-inline element","","@method isContainer","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is a container element, false otherwise","@static","**/","EditorDOM.isContainer = function(node) {","    node = Y.one(node);","","    // isElementNode() will exclude document fragments, which are valid","    // containers, use !isTextNode() instead","    return !EditorDOM.isTextNode(node) && !EditorDOM.isInlineElement(node);","};","","","/**","Returns true if the given node is an element node, false otherwise","","@method isElementNode","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is an element node, false otherwise","@static","**/","EditorDOM.isElementNode = function(node) {","    node = Y.one(node);","","    return node._node && 1 === node._node.nodeType;","};","","","/**","Returns true if the given node is empty","","Nodes containing only returns, tabs or linefeeds are considered empty","Nodes containing only whitespace are not considered empty","","@method isEmptyNode","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is a empty, false otherwise","@static","**/","EditorDOM.isEmptyNode = function(node) {","    node = Y.one(node);","","    var text = node ? node.get('text') : '';","","    return (/^[^\\S ]*$/).test(text);","};","","","/**","Returns true if the given node is an inline element node, false otherwise","","@method isInlineElement","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is an inline element node, false otherwise","@static","**/","EditorDOM.isInlineElement = function(node) {","    node = Y.one(node);","","    return node && node.test(EditorDOM.inlineElements);","};","","","/**","Returns true if the given node is a text node, false otherwise","","@method isTextNode","@param {HTMLNode|Node} node","@return {Boolean} true if the given node is a text node, false otherwise","@static","**/","EditorDOM.isTextNode = function(node) {","    node = Y.one(node);","","    return node._node && 3 === node._node.nodeType;","};","","","/**","Returns the maximum offset of a given node as determined by the type of node.","","Element nodes will return the number of childNodes","Text nodes will return the length of the text","","@method maxOffset","@param {HTMLNode|Node} node","@return {Number} Number of child nodes or length of text","@static","**/","EditorDOM.maxOffset = function(node) {","    node = Y.one(node);","","    return node.get('childNodes').size() || node.get('length');","};","","","/**","Replace spaces in text with a replacement string.","","Primarily to workaround a webkit issue where it won't put the caret after","trailing whitespace at the end of a node","","@param {String} text The source text that will have spaces replaced","@param {String} [replacement=\\u00a0] The string to use as the replacement for","    spaces in _text_. Defaults to a nonblank space","@returns {String} _text_ with spaces replaced","**/","EditorDOM.replaceSpaces = function(text, replacement) {","    replacement || (replacement = '\\u00a0');","","    return text.replace(/ /g, replacement);","};","","","/**","Splits the given node at the specified offset","","@method split","@param {Node} node The node to split","@param {Number|Node} offset Position to split the node.","    For text nodes this is numerical offset, for element nodes can be a","    a number referencing a childNode of `node` or a childNode reference.","@returns {Node} Node reference to the node created after splitting. It will","    be the nextSibling of `node`. If offset is not valid, the original `node`","    is returned.","**/","EditorDOM.split = function(node, offset) {","    var childNodes = node.get('childNodes'),","        splitNode;","","    node = Y.one(node);","","    if (offset && offset._node) {","        offset = childNodes.indexOf(offset);","    } else {","        offset = parseInt(offset, 10);","    }","","    if (isNaN(offset) || offset < 0 || offset > EditorDOM.maxOffset(node)) {","        return node;","    }","","    if (EditorDOM.isTextNode(node)) {","        return Y.one(node._node.splitText(offset));","    } else {","        splitNode = node.cloneNode(false).append(childNodes.splice(offset));","        node.insert(splitNode, 'after');","","        return splitNode;","    }","};","","","/**","Unwraps a node","","@method unwrap","@param {Node} node","@return {Range} Range containing the unwrapped child nodes","@static","**/","EditorDOM.unwrap = function (node) {","    var range, startNode, endNode;","","    startNode = node.get('firstChild') || node;","    endNode = node.get('lastChild') || node;","","    startNode.unwrap();","","    range = new Y.Range();","    range.startNode(startNode);","    range.endNode(endNode, EditorDOM.maxOffset(endNode));","","    return range;","};","","","Y.namespace('Editor').DOM = EditorDOM;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-range\", \"node\"]});"];
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].lines = {"1":0,"18":0,"20":0,"35":0,"36":0,"40":0,"41":0,"43":0,"44":0,"47":0,"48":0,"50":0,"51":0,"55":0,"71":0,"72":0,"74":0,"75":0,"76":0,"79":0,"80":0,"81":0,"82":0,"83":0,"86":0,"101":0,"102":0,"103":0,"104":0,"110":0,"124":0,"125":0,"129":0,"141":0,"142":0,"144":0,"159":0,"160":0,"162":0,"164":0,"176":0,"177":0,"179":0,"191":0,"192":0,"194":0,"209":0,"210":0,"212":0,"227":0,"228":0,"230":0,"246":0,"247":0,"250":0,"252":0,"253":0,"255":0,"258":0,"259":0,"262":0,"263":0,"265":0,"266":0,"268":0,"281":0,"282":0,"284":0,"285":0,"287":0,"289":0,"290":0,"291":0,"293":0,"297":0};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].functions = {"(anonymous 2):47":0,"copyStyles:35":0,"tagFn:74":0,"getAncestorElement:71":0,"(anonymous 3):102":0,"getStyledAncestor:101":0,"isContainer:124":0,"isElementNode:141":0,"isEmptyNode:159":0,"isInlineElement:176":0,"isTextNode:191":0,"maxOffset:209":0,"replaceSpaces:227":0,"split:246":0,"unwrap:281":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].coveredLines = 75;
_yuitest_coverage["build/gallery-sm-editor-dom/gallery-sm-editor-dom.js"].coveredFunctions = 16;
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

_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 20);
EditorDOM.inlineElements = 'b, em, i, span, strong, u';

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
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 35);
EditorDOM.copyStyles = function(from, to, styles, options) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "copyStyles", 35);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 36);
var newStyles = {},
        explicit = options && options.explicit,
        overwrite = options && options.overwrite;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 40);
from = Y.one(from);
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 41);
to = Y.one(to);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 43);
if (!EditorDOM.isElementNode(from) || !EditorDOM.isElementNode(to)) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 44);
return;
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 47);
Y.Array.each(styles, function(prop) {
        _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "(anonymous 2)", 47);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 48);
var newVal = explicit ? from._node.style[prop] : from.getStyle(prop);

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 50);
if ('' !== newVal && (overwrite || '' === to._node.style[prop])) {
            _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 51);
newStyles[prop] = newVal;
        }
    });

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 55);
to.setStyles(newStyles);
};


/**
Finds the nearest ancestor element node.

@param {Node} node
@param {Function|String} [tagName] Optional tagName or function. If a tagName
  is provided, the nearest ancestor with that tag will be returned. If a
  function is provided, it will be used for the comparision. It will receive
  a node as its only argument and should return a boolean. If nothing is
  provided, the nearest ancestor element node will be returned
@return {Node}
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 71);
EditorDOM.getAncestorElement = function(node, tagName) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "getAncestorElement", 71);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 72);
var fn;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 74);
function tagFn(node) {
        _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "tagFn", 74);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 75);
var nodeTag = node.get('tagName');
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 76);
return nodeTag && tagName === nodeTag.toUpperCase();
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 79);
if ('function' === typeof tagName) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 80);
fn = tagName;
    } else {_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 81);
if ('string' === typeof tagName) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 82);
tagName = tagName.toUpperCase();
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 83);
fn = tagFn;
    }}

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 86);
return node.ancestor(fn || EditorDOM.isElementNode, true);
};


/**
Walks the ancestor tree of a given node until a node that has
the css property set is found

@method getStyledAncestor
@param {Node} startNode
@param {String} property
@param {Boolean} [self] Whether or not to include `startNode` in the scan
@return {Node} The node having `property` set, or null if no node was found
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 101);
EditorDOM.getStyledAncestor = function(startNode, property, self) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "getStyledAncestor", 101);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 102);
return startNode.ancestor(function(node) {
        _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "(anonymous 3)", 102);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 103);
if (!EDOM.isElementNode(node)) {
            _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 104);
return false;
        }

        // don't use node.getStyle() because it will return
        // computedStyle for empty string values like `property: ""`
        // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 110);
return !!node._node.style[property];
    }, self, this.selectors.input);
};


/**
Returns true if the given node is a container element, false otherwise
A container element is defined as a non-inline element

@method isContainer
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a container element, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 124);
EditorDOM.isContainer = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isContainer", 124);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 125);
node = Y.one(node);

    // isElementNode() will exclude document fragments, which are valid
    // containers, use !isTextNode() instead
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 129);
return !EditorDOM.isTextNode(node) && !EditorDOM.isInlineElement(node);
};


/**
Returns true if the given node is an element node, false otherwise

@method isElementNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is an element node, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 141);
EditorDOM.isElementNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isElementNode", 141);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 142);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 144);
return node._node && 1 === node._node.nodeType;
};


/**
Returns true if the given node is empty

Nodes containing only returns, tabs or linefeeds are considered empty
Nodes containing only whitespace are not considered empty

@method isEmptyNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a empty, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 159);
EditorDOM.isEmptyNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isEmptyNode", 159);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 160);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 162);
var text = node ? node.get('text') : '';

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 164);
return (/^[^\S ]*$/).test(text);
};


/**
Returns true if the given node is an inline element node, false otherwise

@method isInlineElement
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is an inline element node, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 176);
EditorDOM.isInlineElement = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isInlineElement", 176);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 177);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 179);
return node && node.test(EditorDOM.inlineElements);
};


/**
Returns true if the given node is a text node, false otherwise

@method isTextNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a text node, false otherwise
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 191);
EditorDOM.isTextNode = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "isTextNode", 191);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 192);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 194);
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
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 209);
EditorDOM.maxOffset = function(node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "maxOffset", 209);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 210);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 212);
return node.get('childNodes').size() || node.get('length');
};


/**
Replace spaces in text with a replacement string.

Primarily to workaround a webkit issue where it won't put the caret after
trailing whitespace at the end of a node

@param {String} text The source text that will have spaces replaced
@param {String} [replacement=\u00a0] The string to use as the replacement for
    spaces in _text_. Defaults to a nonblank space
@returns {String} _text_ with spaces replaced
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 227);
EditorDOM.replaceSpaces = function(text, replacement) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "replaceSpaces", 227);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 228);
replacement || (replacement = '\u00a0');

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 230);
return text.replace(/ /g, replacement);
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
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 246);
EditorDOM.split = function(node, offset) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "split", 246);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 247);
var childNodes = node.get('childNodes'),
        splitNode;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 250);
node = Y.one(node);

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 252);
if (offset && offset._node) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 253);
offset = childNodes.indexOf(offset);
    } else {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 255);
offset = parseInt(offset, 10);
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 258);
if (isNaN(offset) || offset < 0 || offset > EditorDOM.maxOffset(node)) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 259);
return node;
    }

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 262);
if (EditorDOM.isTextNode(node)) {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 263);
return Y.one(node._node.splitText(offset));
    } else {
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 265);
splitNode = node.cloneNode(false).append(childNodes.splice(offset));
        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 266);
node.insert(splitNode, 'after');

        _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 268);
return splitNode;
    }
};


/**
Unwraps a node

@method unwrap
@param {Node} node
@return {Range} Range containing the unwrapped child nodes
@static
**/
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 281);
EditorDOM.unwrap = function (node) {
    _yuitest_coverfunc("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", "unwrap", 281);
_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 282);
var range, startNode, endNode;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 284);
startNode = node.get('firstChild') || node;
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 285);
endNode = node.get('lastChild') || node;

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 287);
startNode.unwrap();

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 289);
range = new Y.Range();
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 290);
range.startNode(startNode);
    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 291);
range.endNode(endNode, EditorDOM.maxOffset(endNode));

    _yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 293);
return range;
};


_yuitest_coverline("build/gallery-sm-editor-dom/gallery-sm-editor-dom.js", 297);
Y.namespace('Editor').DOM = EditorDOM;


}, '@VERSION@', {"requires": ["gallery-sm-range", "node"]});
