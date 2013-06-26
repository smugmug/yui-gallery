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
Finds the nearest ancestor with a given tagName

@param {Node} node
@param {String} [tagName] Optional tagName. If not provided, the nearest
  ancestor element node will be returned
@return {Node}
@static
**/
EditorDOM.getAncestorElement = function(node, tagName) {
    tagName && (tagName = tagName.toUpperCase());

    function tagFn(node) {
        var nodeTag = node.get('tagName');

        return nodeTag && tagName === nodeTag.toUpperCase();
    }

    return node.ancestor(tagName ? tagFn : EditorDOM.isElementNode, true);
};


/**
@method isElementNode
@param {Node} node
@return {Boolean}
@static
**/
EditorDOM.isElementNode = function(node) {
    return 1 === node.get('nodeType');
};


/**
@method isTextNode
@param {Node} node
@return {Boolean}
@static
**/
EditorDOM.isTextNode = function(node) {
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
Unwraps a node

@method unwrap
@param {Node} node
@return {Range} Range containing the unwrapped child nodes
@static
**/
EditorDOM.unwrap = function (node) {
    var parent, child, range, startNode, endNode;

    parent = node.get('parentElement');

    while (child = node.get('firstChild')) {
        parent.insertBefore(child, node);

        if (!startNode) {
            startNode = child;
        }

        endNode = child;
    }

    node.remove(true);

    range = new Y.Range();
    range.startNode(startNode);
    range.endNode(endNode, EditorDOM.maxOffset(endNode));

    return range;
};


Y.namespace('Editor').DOM = EditorDOM;
