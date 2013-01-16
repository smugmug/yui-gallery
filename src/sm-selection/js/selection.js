/*jshint expr:true, onevar:false */

/**
Provides the `Selection` class, which normalizes text selection functionality
across browsers.

@module gallery-sm-selection
@main gallery-sm-selection
**/

/**
Normalizes text selection functionality across browsers.

@class Selection
@constructor
**/

var doc = Y.config.doc,
    win = Y.config.win,

    isHTML5 = !!(win && win.getSelection);

var Selection = isHTML5 ? function () {
    this._selection = win.getSelection();
} : function () {
    this._selection = doc.selection;
};

Selection.prototype = {
    // -- Public Methods -------------------------------------------------------

    // addRange

    anchorNode: isHTML5 ? function () {
        return this._selection.anchorNode;
    } : function () {
        throw new Error('Not yet implemented.');
    },

    anchorOffset: function () {},

    // collapse (toStart/toEnd)
    // containsNode
    // deleteFromDocument
    // extend

    focusNode: function () {},

    focusOffset: function () {},

    isCollapsed: function () {},

    // modify

    rangeCount: isHTML5 ? function () {
        return this._selection.rangeCount;
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Returns the `Range` instance at the specified _index_, or the first range in
    this selection if no index is specified.

    @method range
    @param {Number} [index=0] Range index.
    @return {Range} Range instance at the specified _index_.
    **/
    range: isHTML5 ? function (index) {
        return new Y.Range(this._selection.getRangeAt(index || 0));
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Returns an array containing all the ranges in this selection.

    @method ranges
    @return {Range[]} Array containing all the ranges in this selection.
    **/
    ranges: function () {
        var ranges = [];

        for (var i = 0, len = this.rangeCount(); i < len; i++) {
            ranges.push(this.range(i));
        }

        return ranges;
    },

    // removeRange
    // removeAllRanges
    // selectAllChildren
    // selectionLanguageChange?

    /**
    Returns a string representation of the combined text content of all the
    ranges in this selection.

    @method toString
    @return {String} String representation of the combined text content of all
        the ranges in this selection.
    **/
    toString: function () {
        var ranges = this.ranges(),
            string = '';

        for (var i = 0, len = ranges.length; i < len; i++) {
            string += ranges[i].toString();
        }

        return string;
    }
};

Y.Selection = Selection;
