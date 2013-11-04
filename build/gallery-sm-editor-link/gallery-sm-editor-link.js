YUI.add('gallery-sm-editor-link', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Link` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-link
**/

/**
Extension for `Editor.Base` that enables inserting links

Provides support for the following commands:

- createLink
- unlink

@class Editor.Link
@extends Base
@extensionfor Editor.Base
**/

(function() {
var EditorLink = Y.Base.create('editorLink', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of link commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} linkCommands
        @param {Function|String} commandFn
        @param {Function|String} [queryFn]
    **/
    linkCommands: {
        createLink: {
            commandFn: '_createLink',
            queryFn:   'isLink'
        },

        unlink: {
            commandFn: '_unlink',
            queryFn:   'isLink'
        }
    },

    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} supportedTags
    **/
    linkTags: 'a',

    /**
    HTML Template for building an anchor node

    @property {Object} linkTemplate
    **/
    linkTemplate: '<a href="{href}" target="{target}"></a>',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        this.commands = Y.merge(this.commands, this.linkCommands);

        if (this.supportedTags) {
            this.supportedTags += ',' + this.linkTags;
        } else {
            this.supportedTags = this.linkTags;
        }
    },


    // -- Public Methods -------------------------------------------------------

    /**
    Returns whether or not the current range is entirely in an anchor element

    @method isLink
    @return {boolean} `true` if the range is contained in an anchor element,
      `false` otherwise
    **/
    isLink: function () {
        return !!this._getAnchorNode();
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Returns the nearest ancestor anchor that entirely contains
    the current range

    @method _getAnchorNode
    @return {Node} The containing anchor element
    @protected
    **/
    _getAnchorNode: function() {
        this.focus();

        var parentNode = this.selection.range().shrink().parentNode();

        return parentNode.ancestor(this.linkTags, true);
    },


    /**
    Implementation for the `createLink` command

    Wraps the currently selected range in an anchor `<a>` tag

    @method _createLink
    @param {Object} options
        @param {String} options.href
        @param {String} [options.target=_self]
        @param {String} [options.text]
    @protected
    **/
    _createLink: function(options){
        var range = this.selection.range(),
            anchorNode, styleNodes;

        if (!range) {
            return;
        }

        if (this.isLink()) {
            this._unlink();
            range = this.selection.range();
        }

        options || (options = {});
        options.href = encodeURI(options.href || '');
        options.target = encodeURIComponent(options.target || '_self');

        anchorNode = Y.Node.create(Y.Lang.sub(this.linkTemplate, options));
        styleNodes = this._getStyleNodes(range);

        anchorNode.append(styleNodes);

        range.insertNode(anchorNode);

        if (options.text && options.text !== range.toString()) {
            var firstChild = anchorNode.get('firstChild');

            if (this._isStyleNode(firstChild)) {
                firstChild.set('text', options.text);
                anchorNode.setHTML(firstChild);
            } else {
                anchorNode.set('text', options.text);
            }
        }

        range.selectNode(anchorNode).collapse();

        this.selection.select(range);
    },


    /**
    Removes link by replacing the anchor element with the child nodes
    of the anchor

    The anchor element will be removed from the DOM and destroyed.

    @method _unlink
    @protected
    **/
    _unlink: function() {
        var selection = this.selection,
            anchorNode;

        // we can use the native unlink command once we have bookmarking
        // in place, but firefox selects adjacent text nodes after unlink

        if (anchorNode = this._getAnchorNode()) {
            var firstChild = anchorNode.get('firstChild'),
                lastChild = anchorNode.get('lastChild'),
                range = selection.range();

            // only need to unwrap one of the children to unwrap the
            // whole anchorNode
            firstChild.unwrap();

            anchorNode.destroy();

            range.startNode(firstChild, 0);
            range.endNode(lastChild, 'after');

            selection.select(range.shrink({trim: true}));
        }
    }
});

Y.namespace('Editor').Link = EditorLink;

}());


}, '@VERSION@', {"requires": ["base-build", "gallery-sm-editor-base", "node-base"]});
