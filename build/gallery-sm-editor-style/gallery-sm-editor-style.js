YUI.add('gallery-sm-editor-style', function (Y, NAME) {

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

(function () {

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
        @param {String} [value] For boolean commands, the `on` value of the
        property. eg. `bold`
    **/
    styleCommands: {
        bold: {
            property: 'fontWeight',
            value: 'bold'
        },

        fontName: {
            property: 'fontFamily'
        },

        fontSize: {
            property: 'fontSize'
        },

        italic: {
            property: 'fontStyle',
            value: 'italic'
        },

        underline: {
            property: 'textDecoration',
            value: 'underline'
        }
    },


    /**
    Key commands related to style functionality.

    @property {Object} styleKeyCommands
    **/
    styleKeyCommands: {
//        'backspace':  {fn: '_afterDelete', allowDefault: true, async: true},
//        'delete':     {fn: '_afterDelete', allowDefault: true, async: true}
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} supportedTags
    **/
    styleTags: 'span',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        if (this.supportedTags) {
            this.supportedTags += ',' + this.styleTags;
        } else {
            this.supportedTags = this.styleTags;
        }

        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);
        }

        this._attachStyleEvents();
    },

    destructor: function () {
        this._detachStyleEvents();
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
    Attaches style events.

    @method _attachStyleEvents
    @protected
    **/
    _attachStyleEvents: function () {
        if (this._styleEvents) {
            return;
        }

        this._styleEvents = [
            Y.Do.before(this._styleBeforeExecCommand, this, '_execCommand', this),
            Y.Do.before(this._styleBeforeQueryCommand, this, '_queryCommandValue', this)
        ];
    },


    /**
    Detaches style events.

    @method _detachStyleEvents
    @protected
    **/
    _detachStyleEvents: function () {
        if (this._styleEvents) {
            new Y.EventHandle(this._styleEvents).detach();
            this._styleEvents = null;
        }
    },


    /**
    Duckpunch Editor.Base._execCommand to build css styled nodes instead of
    relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands` or `this.blockCommands`

    @method _execStyleCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execStyleCommand: function (name, value) {
        var command = this.styleCommands[name],
            range = this.selection.range(),
            styleNodes, style;

        if (!range || !command) {
            return;
        }

        styleNodes = this._getStyleNodes(range);

        // use the first node because blah blah
        // dont use getStyle blah blah
        style = styleNodes.item(0)._node.style[command.property];

        if (this.boolCommands[name] && 'toggle' === value) {
            if (style && '' !== style) {
                style = '';
            } else {
                style = command.value;
            }
        } else if (value) {
            style = command.value || value;
        } else {
            style = '';
        }

        styleNodes.setStyle(command.property, style);
    },


    /**
    Reformats html to the proper style

    TODO: put this in its own extension.  doesnt belong here.

    <span>blah blah</span>
    @param {HTML} html HTML string to format
    @return {Node} Node instance containing a document fragment with the
        formatted _html_
    @protected
    **/
    _formatHTML: function (html) {
        function flatten (node) {
            var childNodes = node.get('childNodes')._nodes;

            Y.Array.each(childNodes.reverse(), function (node) {
                var parentNode;

                node = Y.one(node);
                parentNode = node.get('parentNode');

                if (EDOM.isTextNode(node)) {
                    if (this._isBlockNode(parentNode)) {
                        node.wrap(STYLENODE);
                    } else if (node.get('previousSibling')) {
                        EDOM.split(parentNode, node);
                    }
                } else {
                    // TODO: replace b, em, i, strong, u nodes with spans
                    if (!node.test(this.supportedTags)) {
                        node.replace(node.get('text'));
                    } else if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {
                        parentNode.insert(node, 'after');

                        if (!this._isBlockNode(node)) {
                            node.addClass(parentNode.get('className'));

                            EDOM.copyStyles(parentNode, node, supportedStyles, {
                                explicit: true,
                                overwrite: false
                            });
                        }
                    } else {
                        // TODO: clear styles on containers
                    }

                    flatten.call(this, node);

                    if (EDOM.isEmptyNode(node)) {
                        node.remove(true);
                    }

                    node.removeAttribute('id');
                }
            }, this);
        }

        var frag, supportedStyles = [], supportedTags = this.supportedTags;

        Y.Object.each(this.styleCommands, function (cmd) {
            supportedStyles.push(cmd.property);
        });

        frag = Y.one(doc.createDocumentFragment()).setHTML(html);

        flatten.call(this, frag);

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
    @return {Node} The node having `property` set, or null if no node was found
    @protected
    **/
    _getStyledAncestor: function (startNode, property) {
        return startNode.ancestor(function (node) {
            if (!EDOM.isElementNode(node)) {
                return false;
            }

            // don't use node.getStyle() because it will return
            // computedStyle for empty string values like `property: ""`
            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
            return !!node._node.style[property];
        }, true, this.selectors.input);
    },


    /**
    Parses inline elements from a given range. Partially selected nodes will
    be split and text nodes will be wrapped in `<span>` tags if necessary.

    @method _getStyleNodes
    @param {Range} range
    @return {NodeList} NodeList of inline elements within the given `range`
    @protected
    **/
    _getStyleNodes: function (range) {
        var styleNode, styleNodes = [];

        range.shrink();

        // see if the range is contained in an existing styleNode
        styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);

        if (styleNode) {
            if (range.toString() === styleNode.get('text')) {
                // the entire node is selected, just return the node
                return new Y.NodeList([styleNode]);
            }
        } else {
            styleNode = Y.Node.create(STYLENODE);
        }

        var startNode = range.startNode(),
            startOffset = range.startOffset(),
            endNode = range.endNode(),
            endOffset = range.endOffset();

        range.traverse(function (node) {
            if (!EDOM.isTextNode(node)) {
                return;
            }

            if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {
                node = EDOM.split(node, endOffset).get('previousSibling');
            }

            if (startNode === node && startOffset) {
                node = EDOM.split(node, startOffset);
            }

            if (this._isStyleNode(node.get('parentNode'))) {
                if (node.get('nextSibling')) {
                    EDOM.split(node.get('parentNode'), node.get('nextSibling'));
                }

                if (node.get('previousSibling')) {
                    EDOM.split(node.get('parentNode'), node);
                }

                styleNodes.push(node.get('parentNode'));
            } else {
                styleNodes.push(node.wrap(styleNode).get('parentNode'));
            }
        }, this);

        return new Y.NodeList(styleNodes);
    },


    /**
    Returns true if the given node is a container element, false otherwise
    A container element is defined as a non-inline element

    @method _isBlockNode
    @param {HTMLNode|Node} node
    @return {Boolean} true if the given node is a container element, false otherwise
    @protected
    **/
    _isBlockNode: function (node) {
        node = Y.one(node);

        // isElementNode() will exclude document fragments, which are valid
        // containers, use !isTextNode() instead
        return !EDOM.isTextNode(node) && (node.get('nodeName') === '#document-fragment' || node.test(this.blockTags));
    },


    /**
    Returns true if the given node is an inline element node, false otherwise

    @method _isStyleNode
    @param {HTMLNode|Node} node
    @return {Boolean} true if the given node is an inline element node, false otherwise
    @protected
    **/
    _isStyleNode: function (node) {
        node = Y.one(node);

        return node && !EDOM.isTextNode(node) && node.test(this.styleTags);
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
    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes
    instead of relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands`

    @method _queryStyleCommand
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryStyleCommand: function (name) {
        var command = this.styleCommands[name],
            range = this.selection.range().clone(),
            parentNode, styleNode, value;

        if (range) {
            parentNode = range.shrink().parentNode();

            // first attempt to get any explicitly styled ancestor for
            // the given property. Need to do this first because browsers
            // sometimes return different values for explicit style vs.
            // computed style. `font-weight: bold;` for example will return
            // `bold` in all browsers when explicitly set but `700` in
            // Firefox and Internet Explorer with computedStyle.
            styleNode = this._getStyledAncestor(parentNode, command.property);

            if (!styleNode) {
                // no explicitly styled ancestor found. walk the
                // ancestor tree to find the closest element
                // node ancestor, inclusive of the parentNode
                styleNode = parentNode.ancestor(EDOM.isElementNode, true);
            }

            // getStyle will fall back to computedStyle if the
            // property isn't explicitly set
            value = styleNode.getStyle(command.property);
        }

        if (this.boolCommands[name]) {
            value = (value === command.value);
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
    _afterDelete: function () {
        this._clearCommandQueue();
        this._updateSelection({force: true});
    },


    /**
    AOP wrapper for `Editor.Base#_execCommand()`.

    @method _styleBeforeExecCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _styleBeforeExecCommand: function (name, value) {
        if (this.styleCommands[name]) {
            var ret = this._execStyleCommand(name, value);
            return new Y.Do.Halt('Editor.Style prevented _execCommand', ret);
        }
    },


    /**
    AOP wrapper for `Editor.Base#_queryCommand()`.

    @method _styleBeforeQueryCommand
    @param {String} name Command name.
    @protected
    **/
    _styleBeforeQueryCommand: function (name) {
        if (this.styleCommands[name]) {
            var ret = this._queryStyleCommand(name);
            return new Y.Do.Halt('Editor.Style prevented _queryCommand', ret);
        }
    }
}, {
    ATTRS: {
        /**
        Function for formatting editor html

        One day allow custom formatting. Today is not that day.
        **/
        formatFn: {
            readOnly: true,
            setter: function (val) {
                return Y.bind(val, this);
            },
            validator: Y.Lang.isFunction,
            valueFn: function () {
                return this._formatHTML;
            }
        }
    }
});

Y.namespace('Editor').Style = EditorStyle;

}());


}, '@VERSION@', {
    "requires": [
        "gallery-sm-editor-base",
        "gallery-sm-editor-dom",
        "gallery-sm-editor-keys",
        "gallery-sm-editor-queue",
        "node-style"
    ]
});
