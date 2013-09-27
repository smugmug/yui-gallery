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
    EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of style commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} styleCommands
        @param {Function|String} commandFn
        @param {Function|String} [queryFn]
        @param {Object} style
            @param {String} style.property The name of the CSS property in
            camelCase form
            @param {String} [style.value] For boolean commands, the `on` value
            of the property. eg. `bold`
    **/
    styleCommands: {
        bold: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontWeight',
                value: 'bold'
            }
        },

        fontName: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontFamily'
            }
        },

        fontSize: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontSize'
            }
        },

        italic: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontStyle',
                value: 'italic'
            }
        },

        justifyCenter: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: 'center'
            },
            type: 'block'
        },

        justifyFull: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: 'justify'
            },
            type: 'block'
        },

        justifyLeft: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: ''
            },
            type: 'block'
        },

        justifyRight: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: 'right'
            },
            type: 'block'
        },

        strikeThrough: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textDecoration',
                value: 'line-through'
            }
        },

        underline: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textDecoration',
                value: 'underline'
            }
        }
    },


    /**
    Key commands related to style functionality.

    @property {Object} styleKeyCommands
    **/
    styleKeyCommands: {
        'ctrl+b': 'bold',
        'ctrl+i': 'italic',
        'ctrl+u': 'underline'
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} supportedTags
    **/
    styleTags: 'span',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        this.commands = Y.merge(this.commands, this.styleCommands);

        if (this.supportedTags) {
            this.supportedTags += ',' + this.styleTags;
        } else {
            this.supportedTags = this.styleTags;
        }

        this.supportedStyles = [];

        Y.Object.each(this.styleCommands, function (cmd) {
            this.supportedStyles.push(cmd.style.property);
        }, this);

        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);
        }
    },


    // -- Public Methods -------------------------------------------------------

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
                    results[name] = this.query(name);
                }
            }
        }

        return results;
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Executes a `style` command by adding/removing css properties

    @method _execStyleCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execStyleCommand: function (name, value) {
        var command = this.commands[name],
            range = this.selection.range(),
            styleNodes, style;

        if (!range || !command || !command.style) {
            return;
        }

        if ('block' === command.type) {
            styleNodes = this._getNodes(range, this.blockTags);
        } else {
            styleNodes = this._getStyleNodes(range);
        }

        // use the first node because blah blah
        // dont use getStyle blah blah
        style = styleNodes.item(0)._node.style[command.style.property];

        if (Y.Lang.isValue(command.style.value)) {
            if (style && style === command.style.value) {
                style = '';
            } else {
                style = command.style.value;
            }
        } else if (value) {
            style = command.style.value || value;
        } else {
            style = '';
        }

        styleNodes.setStyle(command.style.property, style);

        if ('block' !== command.type) {
            range.startNode(styleNodes.item(0));
            range.endNode(styleNodes.item(styleNodes.size() - 1), 'after');

            this.selection.select(range.shrink());
        }
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

                            EDOM.copyStyles(parentNode, node, this.supportedStyles, {
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

        var frag = Y.one(doc.createDocumentFragment()).setHTML(html);

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
    Returns the value of a `style` command by querying css properties

    @method _queryStyleCommand
    @param {String} name Command name.
    @return {Boolean|String} Boolean style commands will return true/false, other commands will
    return the property value, or null if the property doesnt exist.
    @protected
    **/
    _queryStyleCommand: function (name) {
        var command = this.commands[name],
            range = this.selection.range().clone(),
            selector = 'span', values = [], value;

        if (range && command.style) {
            if ('block' === command.type) {
                selector = this.blockTags;
            }

            this._getNodes(range, selector).each(function (node) {
                var value;

                if (command.style.computed) {
                    value = node.getStyle(command.style.property);
                } else {
                    value = node._node.style[command.style.property];
                }

                values.push(value || '');
            });

            values = Y.Array.dedupe(values);

            if (1 === values.length) {
                value = values[0];
            }

            if (Y.Lang.isValue(command.style.value)) {
                value = (value == command.style.value);
            } else if ('' === value) {
                value = null;
            }
        }

        return value;
    }

    // -- Protected Event Handlers ---------------------------------------------

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
