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

var EditorDOM = function() {};

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
EditorDOM.getAncestorElement = function(node, tagName) {
    var fn;

    function tagFn(node) {
        var nodeTag = node.get('tagName');
        return nodeTag && tagName === nodeTag.toUpperCase();
    }

    if ('function' === typeof tagName) {
        fn = tagName;
    } else if ('string' === typeof tagName) {
        tagName = tagName.toUpperCase();
        fn = tagFn;
    }

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
EditorDOM.getStyledAncestor = function(startNode, property, self) {
    return startNode.ancestor(function(node) {
        if (!EDOM.isElementNode(node)) {
            return false;
        }

        // don't use node.getStyle() because it will return
        // computedStyle for empty string values like `property: ""`
        // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
        return !!node._node.style[property];
    }, self, this.selectors.input);
};


/**
Returns true if the given node is a block element, false otherwise

@method isBlockElement
@param {HTMLElement|Node} node
@return {Boolean} true if the given node is a block element, false otherwise
@static
**/
EditorDOM.isBlockElement = function(node) {
    node = Y.one(node);

    return EditorDOM.isElementNode(node) &&
        'block' === node.getStyle('display');
};


/**
Returns true if the given node is an element node, false otherwise

@method isElementNode
@param {HTMLElement|Node} node
@return {Boolean} true if the given node is an element node, false otherwise
@static
**/
EditorDOM.isElementNode = function(node) {
    node = Y.one(node);

    return 1 === node.get('nodeType');
};


/**
Returns true if the given node is an inline element node, false otherwise

@method isInlineElement
@param {HTMLElement|Node} node
@return {Boolean} true if the given node is an inline element node, false otherwise
@static
**/
EditorDOM.isInlineElement = function(node) {
    node = Y.one(node);

    return EditorDOM.isElementNode(node) &&
        /^inline/.test(node.getStyle('display'));
};


/**
Returns true if the given node is a text node, false otherwise

@method isTextNode
@param {HTMLElement|Node} node
@return {Boolean} true if the given node is a text node, false otherwise
@static
**/
EditorDOM.isTextNode = function(node) {
    node = Y.one(node);

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
EditorDOM.maxOffset = function(node) {
    node = Y.one(node);

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
EditorDOM.split = function(node, offset) {
    var childNodes = node.get('childNodes'),
        splitNode;

    node = Y.one(node);

    if (offset && offset._node) {
        offset = childNodes.indexOf(offset);
    } else {
        offset = parseInt(offset, 10);
    }

    if (isNaN(offset) || offset < 0 || offset > EditorDOM.maxOffset(node)) {
        return node;
    }

    if (EditorDOM.isTextNode(node)) {
        return Y.one(node._node.splitText(offset));
    } else {
        splitNode = node.cloneNode(false).append(childNodes.splice(offset));
        node.insert(splitNode, 'after');

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
EditorDOM.unwrap = function (node) {
    var range, startNode, endNode;

    startNode = node.get('firstChild');
    endNode = node.get('lastChild');

    startNode.unwrap();

    range = new Y.Range();
    range.startNode(startNode);
    range.endNode(endNode, EditorDOM.maxOffset(endNode));

    return range;
};


Y.namespace('Editor').DOM = EditorDOM;
