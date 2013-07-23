/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Style` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-style
**/

/**
Extension for `Editor.Base` that normalizes style commands into css properties

@class Editor.Style
@constructor
@extends Base
@extensionfor Editor.Base
**/

(function() {

var EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of style commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} styleCommands
      @param {String} property The name of the CSS property in camelCase form
      @param {String} [valueOn] The `on` value of the property. eg. `bold`
      @param {String} [valueOff] The `off` value of the property. eg. `none`
    **/
    styleCommands: {
        bold: {
            property: 'fontWeight',
            valueOn: 'bold',
            valueOff: 'normal'
        },

        fontName: {
            property: 'fontFamily'
        },

        fontSize: {
            property: 'fontSize'
        },

        italic: {
            property: 'fontStyle',
            valueOn: 'italic',
            valueOff: 'normal'
        },

//        justifyCenter: {
//            property: 'textAlign',
//            value: 'center'
//        },
//
//        justifyLeft: {
//            property: 'textAlign',
//            value: 'left'
//        },
//
//        justifyRight: {
//            property: 'textAlign',
//            value: 'right'
//        },

        underline: {
            property: 'textDecoration',
            valueOn: 'underline',
            valueOff: 'none'
        }
    },


    // -- Public Methods -------------------------------------------------------

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        this.command('bold', 'toggle');
        return this;
    },

    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        this.command('italic', 'toggle');
        return this;
    },

    /**
    Gets and/or sets the values of multiple editor style commands.

    When called without an argument, the current values of all supported style
    commands will be returned. When called with a _styles_ object, the specified
    style commands will be set to their given values, and the resulting new
    values will be returned.

    @method styles
    @param {Object} [styles] Hash of style names and values to set.
    @return {Object} Hash of style names and values that were set, or all styles
        if no _styles_ parameter was specified.
    **/
    styles: function (styles) {
        var results = {},
            name;

        if (styles) {
            for (name in styles) {
                if (styles.hasOwnProperty(name)) {
                    results[name] = this.command(name, styles[name]);
                }
            }
        } else {
            var commands = this.styleCommands;

            for (name in commands) {
                if (commands.hasOwnProperty(name)) {
                    results[name] = this._queryCommandValue(name);
                }
            }
        }

        return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        this.command('underline', 'toggle');
        return this;
    },

    // -- Protected Methods ----------------------------------------------------


    /**
    Duckpunch Editor.Base._execCommand to build css styled nodes instead of
    relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands`

    @method _execCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execCommand: function(name, value) {
        var command = this.styleCommands[name],
            range = this.selection.range(),
            styleNodes;

        if (!range) {
            return;
        }

        if (!command) {
            return Y.Editor.Base.prototype._execCommand.call(this, name, value);
        }

        if (this.boolCommands[name] && 'toggle' === value) {
            if (this._queryCommandValue(name)) {
                // already enabled, turn it off
                value = '';
            } else {
                // need to enable, set appropriate value
                value = command.valueOn || value;
            }
        }

        styleNodes = this._extractStyleNodes(range);

        styleNodes.each(function(styleNode) {
            styleNode.setStyle(command.property, value);
        }, this);

        range.startNode(styleNodes.item(0), 0);
        range.endNode(styleNodes.item(styleNodes.size() - 1));
        range.endOffset(EDOM.maxOffset(range.endNode()));

        this.selection.select(range);
    },


    /**
    Parses inline elements from a given range. Partially selected nodes will
    be split and text nodes will be wrapped in `<span>` tags if necessary.

    The initial range will not be updated to reflect any changes, however
    selecting the contents of the resulting NodeList will be identical to the
    initial range.

    @method _extractStyleNodes
    @param {Range} range
    @return {NodeList} NodeList of inline elements within the given `range`
    @protected
    **/
    _extractStyleNodes: function(range) {
        var inlineParent, styleContext, contents,
            startNode, startOffset;

        range.shrink();

        // see if the range is contained in an inline element
        inlineParent = EDOM.getAncestorElement(
            range.parentNode(),
            EDOM.isInlineElement
        );

        if (inlineParent) {
            if (range.toString() === inlineParent.get('text')) {
                // the entire node is selected, just return the node
                return new Y.NodeList([inlineParent]);
            }

            // any text nodes extracted from the range will be wrapped in
            // clones of the parent node to maintain existing styles
            styleContext = inlineParent;
        } else {
            // the default style context for any text nodes in the range
            styleContext = Y.Node.create(STYLENODE);
        }

        // extract the contents and wrap any text nodes in the
        // appropriate style context
        contents = range.extractContents().get('childNodes');
        contents.each(function(node, ix) {
            if (EDOM.isTextNode(node)) {
                // wrap any text nodes in a style context
                contents.splice(ix, 1, styleContext.cloneNode(false).append(node));
            }
        });

        // after extracting the contents, we will have a collapsed range
        // at the position where we extracted the contents
        startNode = range.startNode();
        startOffset = range.startOffset();

        if (EDOM.isBlockElement(startNode)) {
            // If the common element containing the range is a block level
            // element it is not necessary to split that container.
            // Insert the contents back in as the next sibling of the node
            // they were extracted from
            startNode.insert(contents, startOffset);
        } else {
            // The range was entirely contained in an inline element or
            // text node. Split that node and insert the contents in between
            // the split nodes
            var splitNode = EDOM.split(startNode, startOffset),
                splitParent = splitNode.get('parentNode');

            if (EDOM.isTextNode(splitNode) && !EDOM.isBlockElement(splitParent)) {
                splitNode = EDOM.split(splitParent, splitNode);
            }

            splitNode.insert(contents, 'before');
        }

        return contents;
    },


    /**
    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes
    instead of relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands`

    @method _queryCommandValue
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryCommandValue: function(name) {
        var command = this.styleCommands[name],
            range = this.selection.range(),
            styleNode, value;

        if (!command) {
            return Y.Editor.Base.prototype._queryCommandValue.call(this, name);
        }

        if (range) {
            styleNode = EDOM.getAncestorElement(range.startNode(), EDOM.isInlineElement);
            value = styleNode && styleNode._node.style[command.property];

            range.traverse(function(node) {
                if (EDOM.isInlineElement(node)) {
                    if (node._node.style[command.property] !== value) {
                        value = null;
                        return true;
                    }
                }
            });
        }

        if (this.boolCommands[name]) {
            value = (value === command.valueOn);
        } else if ('' === value) {
            value = null;
        }

        return value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        var clipboard = e._event.clipboardData || window.clipboardData,
            contents = clipboard.getData('text'),
            range = this.selection.range(),
            endNode, endOffset;

        e.preventDefault();

        // convert contents to a nodeList so after the contents are
        // inserted into the proper position in the DOM, the range
        // can be positioned properly after the pasted content
        contents = Y.one(document.createDocumentFragment())
                    .setHTML(contents).get('childNodes');

        range.expand().deleteContents();

        endNode = range.endNode();
        endOffset = range.endOffset();

        if (EDOM.isBlockElement(endNode)) {
            endNode.insert(contents, endOffset);
        } else if (endOffset === EDOM.maxOffset(endNode)) {
            // if already at the end of a node insert contents after
            endNode.insert(contents, 'after');
        } else {
            // somewhere in an inline or text node (but not at the end)
            // split the node and insert the contents in between
            EDOM.split(endNode, endOffset).insert(contents, 'before');
        }

        // set the endNode to the last pasted node
        range.endNode(contents.item(contents.size() - 1), 'after');

        // collapse the range after the pasted text
        this.selection.select(range.collapse());
    }
});

Y.namespace('Editor').Style = EditorStyle;

}());
