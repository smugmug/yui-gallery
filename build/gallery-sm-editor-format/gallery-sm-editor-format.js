YUI.add('gallery-sm-editor-format', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Format` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-format
**/

/**
Extension for `Editor.Base` that provides formatting support for editor output

@class Editor.Format
@extends Base
@extensionfor Editor.Base
**/

(function () {

var doc = Y.config.doc,
    EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

var EditorFormat = Y.Base.create('editorFormat', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        this.supportedStyles = [];

        Y.Object.each(this.styleCommands, function (cmd) {
            this.supportedStyles.push(cmd.style.property);
        }, this);
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Reformats html to the proper style

    TODO: put this in its own extension.  doesn't belong here.

    @method _formatHTML
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
    }
}, {
    ATTRS: {
        /**
        Function for formatting editor html

        One day allow custom formatting. Today is not that day.

        @attribute {Function}
        @readOnly
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

Y.namespace('Editor').Format = EditorFormat;

}());


}, '@VERSION@', {"requires": ["base-build", "gallery-sm-editor-base", "gallery-sm-editor-dom", "node-base"]});
