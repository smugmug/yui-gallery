/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Link` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-link
**/

/**
Extension for `Editor.Base` that enables inserting links

@class Editor.Link
@constructor
@extends Base
@extensionfor Editor.Base
**/

(function() {
var EDOM = Y.Editor.DOM;

var EditorLink = Y.Base.create('editorLink', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    linkCommands: {
        createLink: {
            fn: '_createLink'
        },

        unlink: {
            fn: '_unlink'
        }
    },

    /**
    Key commands related to creating hyperlinks.

    @property {Object} linkKeyCommands
    **/
    linkKeyCommands: {
        // Create a link.
        'alt+ctrl+l'      : {fn: '_linkPrompt', allowDefault: false}
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
        if (this.supportedTags) {
            this.supportedTags += ',' + this.linkTags;
        } else {
            this.supportedTags = this.linkTags;
        }

        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);
        }

        this._attachLinkEvents();
    },


    destructor: function () {
        this._detachLinkEvents();
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
    Attaches block events.

    @method _attachLinkEvents
    @protected
    **/
    _attachLinkEvents: function () {
        if (this._linkEvents) {
            return;
        }

        this._linkEvents = [
            Y.Do.before(this._linkBeforeExecCommand, this, '_execCommand', this)
        ];
    },


    /**
    Detaches link events.

    @method _detachBlockEvents
    @protected
    **/
    _detachLinkEvents: function () {
        if (this._linkEvents) {
            new Y.EventHandle(this._linkEvents).detach();
            this._linkEvents = null;
        }
    },


    /**
    @method _execLinkCommand
    @param {String} name
    @param {Function|Number|String} value
    @protected
    **/
    _execLinkCommand: function (name, value) {
        var command = this.linkCommands[name],
            range = this.selection.range(),
            fn;

        if (!range || !command) {
            return;
        }

        fn = command.fn;

        if ('string' === typeof fn) {
            fn = this[fn];
        }

        fn && fn.call(this, value);
    },


    /**
    Returns the nearest ancestor anchor that entirely contains
    the current range

    @method _getAnchorNode
    @returns {Node} The containing anchor element
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
        options.target || (options.target = '_self');
        options.href || (options.href = '');

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
    @method _linkPrompt
    @protected
    **/
    _linkPrompt: function() {
        var href = Y.config.win.prompt('Enter a url');

        if (href) {
            this.command('createLink', {href: href});
        }
    },


    /**
    Removes link by replacing the anchor element with the child nodes
    of the anchor

    The anchor element will be removed from the DOM and destroyed.

    @method _unlink
    @protected
    **/
    _unlink: function() {
        var anchorNode = this._getAnchorNode(),
            range;

        if (anchorNode) {
            range = EDOM.unwrap(anchorNode);

            this.selection.select(range.shrink({trim: true}));
        }
    },


    // -- Protected Event Handlers ---------------------------------------------

    /**
    AOP wrapper for `Editor.Base#_execCommand()`.

    @method _linkBeforeExecCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _linkBeforeExecCommand: function (name, value) {
        if (this.linkCommands[name]) {
            var ret = this._execLinkCommand(name, value);
            return new Y.Do.Halt('Editor.Link prevented _execCommand', ret);
        }
    }
});

Y.namespace('Editor').Link = EditorLink;

}());
