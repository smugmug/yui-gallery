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

var EDOM = Y.Editor.DOM;

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
    Traverses the children of a given node, removing empty nodes and
    clearing out any given css properties

    Note: rootNode may get destroyed during the cleaning process

    @method _cleanNode
    @param {Range} range
    @param {String|Array} properties
    @return {Range}
    @protected
    **/
    _cleanRange: function(range, properties) {
        var rootNode = range.parentNode(),
            styleCommands = this.styleCommands;

        properties = Y.Array(properties);

        function hasStyles(node) {
            return Y.Object.some(styleCommands, function(cmd) {
                return '' !== node._node.style[cmd.property];
            });
        }

        function clean(node) {
            if (!EDOM.isElementNode(node)) {
                return;
            }

            if ('' === node.get('text')) {
                // the node is empty, remove it
                node.remove(true);
            } else {
                // clear out the properties
                Y.Array.each(properties, function(style) {
                    node.setStyle(style, '');
                });

                node.get('children').each(clean);

                if (!hasStyles(node)) {
                    EDOM.unwrap(node);
                }
            }
        }

        rootNode.get('children').each(clean);

        if (!hasStyles(rootNode)) {
            range = EDOM.unwrap(rootNode);
        } else {
            range.selectNodeContents(rootNode);
        }

        return range;
    },


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
            parentNode, styleNode;

        if (!command) {
            return Y.Editor.Base.prototype._execCommand.call(this, name, value);
        }

        if (!range) {
            return;
        }

        // range.parentNode() may return a text node
        // so make sure we actually have an element
        parentNode = EDOM.getAncestorElement(range.parentNode());

        if (parentNode !== this._inputNode &&
            parentNode.get('text') === range.toString()) {
            // if the entire text of a node is selected, just apply
            // styles to that node, as long as its not the input node
            styleNode = parentNode;
        } else {
            // otherwise, wrap the selection in a new node
            styleNode = range.wrap('<span>');
        }

        if (this.boolCommands[name]) {
            if (this._queryCommandValue(name)) {
                // already set, disable
                // determine whether an ancestor has this property set
                // or not so we can simply unset the value instead of
                // setting it to `none` or `normal` or whatever
                value = this._getStyledAncestor(styleNode, command.property) ? command.valueOff : '';
            } else {
                // need to enable, set appropriate value
                value = command.valueOn || value;
            }
        }

        styleNode.setStyle(command.property, value);

        range.selectNodeContents(styleNode);

        range = this._cleanRange(range, command.property);

        this.selection.select(range);
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

            if (this.boolCommands[name]) {
                value = (value === command.valueOn);
            }
        }

        return value;
    }
});

Y.namespace('Editor').Style = EditorStyle;

}());
