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

var doc = Y.config.doc,
    win = Y.config.win,
    EDOM = Y.Editor.DOM,
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

        underline: {
            property: 'textDecoration',
            valueOn: 'underline',
            valueOff: 'none'
        }
    },

    /**
    Key commands related to style functionality.

    @property {Object} styleKeyCommands
    **/
    styleKeyCommands: {
        'backspace': {fn: '_afterDelete', allowDefault: true, async: true},
        'delete'   : {fn: '_afterDelete', allowDefault: true, async: true}
    },


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);
        }
    },

    destructor: function () {
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
            styleNodes, style;

        if (!range) {
            return;
        }

        if (!command) {
            return Y.Editor.Base.prototype._execCommand.call(this, name, value);
        }

        styleNodes = this._getStyleNodes(range);

        // These nodes aren't in the DOM, getStyle() won't work...at least on
        // any windows browser.  works fine on OSX. weird.
        style = styleNodes.item(0)._node.style[command.property];

        if (this.boolCommands[name] && 'toggle' === value) {
            if (style && '' !== style) {
                style = '';
            } else {
                style = command.valueOn;
            }
        } else if (value) {
            style = command.valueOn || value;
        } else {
            style = '';
        }

        styleNodes.setStyle(command.property, style);

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        range.expand(this._inputNode).deleteContents();

        this._splitAfterRange(range, styleNodes);

        range.startNode(styleNodes.item(0), 0);
        range.endNode(styleNodes.item(styleNodes.size() - 1));
        range.endOffset(EDOM.maxOffset(range.endNode()));

        this.selection.select(range);
    },


    /**
    Reformats html to the proper style

    <span>blah blah</span>
    @param {HTML} html HTML string to format
    @return {Node} Node instance containing a document fragment with the
        formatted _html_
    @protected
    **/
    _formatHTML: function(html) {
        function flatten(node) {
            var childNodes = node.get('childNodes')._nodes;

            Y.Array.each(childNodes.reverse(), function(node) {
                var parentNode;

                node = Y.one(node);
                parentNode = node.get('parentNode');

                if (EDOM.isTextNode(node)) {
                    if (EDOM.isContainer(parentNode)) {
                        node.wrap(STYLENODE);
                    } else if (node.get('previousSibling')) {
                        EDOM.split(parentNode, node);
                    }
                } else {
                    // TODO: replace b, em, i, strong, u nodes with spans

                    if (!EDOM.isContainer(parentNode)) {
                        parentNode.insert(node, 'after');

                        node.addClass(parentNode.get('className'));

                        EDOM.copyStyles(parentNode, node, supportedStyles, {
                            explicit: true,
                            overwrite: false
                        });
                    } else {
                        // TODO: clear styles on containers
                    }

                    flatten(node);

                    if (!EDOM.isContainer(node) && EDOM.isEmptyNode(node)) {
                        node.remove(true);
                    }

                    node.removeAttribute('id');
                }
            });
        }

        var frag, supportedStyles = [];

        Y.Object.each(this.styleCommands, function(cmd) {
            supportedStyles.push(cmd.property);
        });

        frag = Y.one(doc.createDocumentFragment()).setHTML(html);

        flatten(frag);

        return frag;
    },


    /**
    Getter for the `html` attribute.

    @method _getHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _getHTML: function (value) {
        value = Y.Editor.Base.prototype._getHTML.call(this, value);

        return this.get('formatFn')(value).getHTML();
    },


    /**
    Walks the ancestor tree of a given node until a node that has
    the css property set is found

    @method _getStyledAncestor
    @param {Node} startNode
    @param {String} property
    @param {Boolean} [self] Whether or not to include `startNode` in the scan
    @return {Node} The node having `property` set, or null if no node was found
    @protected
    **/
    _getStyledAncestor: function(startNode, property, self) {
        return startNode.ancestor(function(node) {
            if (!EDOM.isElementNode(node)) {
                return false;
            }

            // don't use node.getStyle() because it will return
            // computedStyle for empty string values like `property: ""`
            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
            return !!node._node.style[property];
        }, self, this.selectors.input);
    },


    /**
    Parses inline elements from a given range. Partially selected nodes will
    be split and text nodes will be wrapped in `<span>` tags if necessary.

    The range will not be modified.

    @method _getStyleNodes
    @param {Range} range
    @return {NodeList} NodeList of inline elements within the given `range`
    @protected
    **/
    _getStyleNodes: function(range) {
        var inlineParent, styleContext, contents;

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        range.expand(this._inputNode);

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

            // wrap textnodes in clones of the inline parent node
            // to maintain existing styles
            styleContext = inlineParent;
        } else {
            styleContext = Y.Node.create(STYLENODE);
        }

        contents = range.cloneContents().get('childNodes');

        contents.each(function(node, ix) {
            if (EDOM.isTextNode(node)) {
                // wrap any text nodes in a style context
                contents.splice(ix, 1, styleContext.cloneNode(false).append(node));
            }
        });

        return contents;
    },


    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        value = this.get('formatFn')(value).getHTML();

        return Y.Editor.Base.prototype._setHTML.call(this, value);
    },


    /**
    Splits the node at the end of the selection

    @method _splitAfterRange
    @param {Range} range
    @param {HTMLCollection|HTMLElement|Node|NodeList|String} [contents] Contents
        to be inserted after the split
    @return {Node} Node reference of the node created after splitting. Any
        _contents_ will have been inserted as previous siblings of this node.
    **/
    _splitAfterRange: function(range, contents) {
        var endNode, endOffset;

        endNode = range.endNode();
        endOffset = range.endOffset();

        while (!EDOM.isContainer(endNode) && endOffset === EDOM.maxOffset(endNode)) {
            endOffset = range.endOffset('after');
            endNode = range.endNode();
        }

        while (!EDOM.isContainer(endNode)) {
            endOffset = EDOM.split(endNode, endOffset);
            endNode = endOffset.get('parentNode');
        }

        if (contents) {
            endNode.insert(contents, endOffset);
        }

        if (!endOffset._node) {
            endOffset = endNode.get('childNodes').item(endOffset);
        }

        return endOffset;
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
            parentNode, styleNode, value;

        if (!command) {
            return Y.Editor.Base.prototype._queryCommandValue.call(this, name);
        }

        if (range) {
            parentNode = range.shrink().parentNode();

            // first attempt to get any explicitly styled ancestor for
            // the given property. Need to do this first because browsers
            // sometimes return different values for explicit style vs.
            // computed style. `font-weight: bold;` for example will return
            // `bold` in all browsers when explicitly set but `700` in
            // Firefox and Internet Explorer with computedStyle.
            styleNode = this._getStyledAncestor(parentNode, command.property, true);

            if (!styleNode) {
                // no explicitly styled ancestor found. walk the
                // ancestor tree to find the closest element
                // node ancestor, inclusive of the parentNode
                styleNode = EDOM.getAncestorElement(parentNode);
            }

            // getStyle will fall back to computedStyle if the
            // property isn't explicitly set
            value = styleNode.getStyle(command.property);
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
    Handles `delete` events on the editor

    @method _afterDelete
    @protected
    **/
    _afterDelete: function() {
        this._clearCommandQueue();
        this._updateSelection({force: true});
    }
}, {
    ATTRS: {
        /**
        Function for formatting editor html

        One day allow custom formatting. Today is not that day.
        **/
        formatFn: {
            readOnly: true,
            setter: function(val) {
                return Y.bind(val, this);
            },
            validator: Y.Lang.isFunction,
            valueFn: function() {
                return this._formatHTML;
            }
        }
    }
});

Y.namespace('Editor').Style = EditorStyle;

}());
