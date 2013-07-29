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

var EditorDOM = {};

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
EditorDOM.copyStyles = function(from, to, styles, options) {
    var newStyles = {},
        explicit = options && options.explicit,
        overwrite = options && options.overwrite;

    from = Y.one(from);
    to = Y.one(to);

    if (!EditorDOM.isElementNode(from) || !EditorDOM.isElementNode(to)) {
        return;
    }

    Y.Array.each(styles, function(prop) {
        var newVal = explicit ? from._node.style[prop] : from.getStyle(prop);

        if ('' !== newVal && (overwrite || '' === to._node.style[prop])) {
            newStyles[prop] = newVal;
        }
    });

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
Returns true if the given node is a container element, false otherwise
A container element is defined as a non-inline element

@method isContainer
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a container element, false otherwise
@static
**/
EditorDOM.isContainer = function(node) {
    node = Y.one(node);

    // isElementNode() will exclude document fragments, which are valid
    // containers, use !isTextNode() instead
    return !EditorDOM.isTextNode(node) && !EditorDOM.isInlineElement(node);
};


/**
Returns true if the given node is an element node, false otherwise

@method isElementNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is an element node, false otherwise
@static
**/
EditorDOM.isElementNode = function(node) {
    node = Y.one(node);

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
EditorDOM.isEmptyNode = function(node) {
    node = Y.one(node);

    var text = node ? node.get('text') : '';

    return /^[^\S ]*$/.test(text);
};


/**
Returns true if the given node is an inline element node, false otherwise

@method isInlineElement
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is an inline element node, false otherwise
@static
**/
EditorDOM.isInlineElement = function(node) {
    node = Y.one(node);

    return node && node.test(EditorDOM.inlineElements);
};


/**
Returns true if the given node is a text node, false otherwise

@method isTextNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a text node, false otherwise
@static
**/
EditorDOM.isTextNode = function(node) {
    node = Y.one(node);

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
EditorDOM.maxOffset = function(node) {
    node = Y.one(node);

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
EditorDOM.replaceSpaces = function(text, replacement) {
    replacement || (replacement = '\u00a0');

    return text.replace(/ /g, replacement)
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

    startNode = node.get('firstChild') || node;
    endNode = node.get('lastChild') || node;

    startNode.unwrap();

    range = new Y.Range();
    range.startNode(startNode);
    range.endNode(endNode, EditorDOM.maxOffset(endNode));

    return range;
};


Y.namespace('Editor').DOM = EditorDOM;
