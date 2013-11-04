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

var EditorDOM = {};

/**
Copies styles from a node to another node

@method copyStyles
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
Nodes containing only whitespace or breaks (br) are not considered empty

@method isEmptyNode
@param {HTMLNode|Node} node
@return {Boolean} true if the given node is a empty, false otherwise
@static
**/
EditorDOM.isEmptyNode = function(node) {
    node = Y.one(node);

    if (node && node.test('br')) {
        return false;
    } else {
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
Splits the given node at the specified offset

@method split
@param {Node} node The node to split
@param {Number|Node} offset Position to split the node.
    For text nodes this is numerical offset, for element nodes can be a
    a number referencing a childNode of `node` or a childNode reference.
@return {Node} Node reference to the node created after splitting. It will
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


Y.namespace('Editor').DOM = EditorDOM;


}, '@VERSION@', {"requires": ["node-base", "node-style"]});
