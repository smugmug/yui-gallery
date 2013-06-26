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

    template: '<a href="{href}" target="{target}"></a>',

    // -- Public Methods -------------------------------------------------------

    /**
    Wraps the currently selected range in an anchor element

    @method link
    @param {Object} options
      @param {String} [options.target=_self]
      @param {String} [options.text=range.toString()]
      @param {String} options.href
    @chainable
    **/
    link: function (options) {
        this.focus();

        var range = this.selection.range();

        if (!range) {
            return;
        }

        options || (options = {});
        options.target || (options.target = '_self');
        options.text || (options.text = range.toString());
        options.href || (options.href = '');

        range.wrap(Y.Lang.sub(this.template, options));

        return this;
    },


    /**
    Returns whether or not the current range is entirely in an anchor element

    @method isLink
    @return {boolean} `true` if the range is contained in an anchor element,
      `false` otherwise
    **/
    isLink: function () {
        return !!this._getAnchorNode();
    },


    /**
    Removes link by replacing the anchor element with the child nodes
    of the anchor

    The anchor element will be removed from the DOM and destroyed.

    @method unlink
    @chainable
    **/
    unlink: function() {
        var anchorNode = this._getAnchorNode(),
            range;

        if (anchorNode) {
            range = EDOM.unwrap(anchorNode);

            this.selection.select(range.shrink({trim: true}));
        }

        return this;
    },


    // -- Protected Methods ----------------------------------------------------

    _getAnchorNode: function() {
        this.focus();

        var parentNode = this.selection.range().shrink().parentNode();

        return EDOM.getAncestorElement(parentNode, 'a');
    }
});

Y.namespace('Editor').Link = EditorLink;

}());
