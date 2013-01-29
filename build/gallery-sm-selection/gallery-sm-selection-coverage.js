if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-selection/gallery-sm-selection.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].code=["YUI.add('gallery-sm-selection', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Selection` class, which normalizes text selection functionality","across browsers.","","@module gallery-sm-selection","@main gallery-sm-selection","**/","","/**","Normalizes text selection functionality across browsers.","","@class Selection","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.getSelection);","","var Selection = isHTML5 ? function () {","    this._selection = win.getSelection();","} : function () {","    this._selection = doc.selection;","};","","Selection.prototype = {","    // -- Public Methods -------------------------------------------------------","","    anchorNode: isHTML5 ? function () {","        return this._selection.anchorNode;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    // anchorOffset: function () {},","","    // collapse (toStart/toEnd)","    // containsNode","    // deleteFromDocument","    // extend","","    // focusNode: function () {},","","    // focusOffset: function () {},","","    // isCollapsed: function () {},","","    // modify","","    rangeCount: isHTML5 ? function () {","        return this._selection.rangeCount;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the `Range` instance at the specified _index_, or the first range in","    this selection if no index is specified. If no ranges are selected, returns","    `null`.","","    @method range","    @param {Number} [index=0] Range index.","    @return {Range} Range instance at the specified _index_, or the first range","        in this selection if no index is specified. If no ranges are selected,","        returns `null`.","    **/","    range: isHTML5 ? function (index) {","        return this.rangeCount() ?","            new Y.Range(this._selection.getRangeAt(index || 0)) : null;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns an array containing all the ranges in this selection.","","    @method ranges","    @return {Range[]} Array containing all the ranges in this selection.","    **/","    ranges: function () {","        var ranges = [];","","        for (var i = 0, len = this.rangeCount(); i < len; i++) {","            ranges.push(this.range(i));","        }","","        return ranges;","    },","","    /**","    Selects the specified _range_.","","    By default, this will result in only this range being selected. If","    `options.multi` is truthy, then the _range_ will be added to the current","    selection without first unselecting any other selected ranges.","","    @method select","    @param {Range} range Range to select.","    @param {Object} [options] Options.","        @param {Boolean} [options.multi=false] If `true`, the specified _range_","            will be added to the current list of selected ranges instead of","            replacing the current selection.","    @chainable","    **/","    select: isHTML5 ? function (range, options) {","        if (!options || !options.multi) {","            this.unselect();","        }","","        this._selection.addRange(range._range);","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Removes the specified _range_ from this selection, or unselects all ranges","    if no _range_ is specified.","","    @method unselect","    @param {Range} [range] Range to unselect.","    @chainable","    **/","    unselect: isHTML5 ? function (range) {","        if (range) {","            this._selection.removeRange(range._range);","        } else {","            this._selection.removeAllRanges();","        }","","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    // selectAllChildren","    // selectionLanguageChange?","","    /**","    Returns a string representation of the combined text content of all the","    ranges in this selection.","","    @method toString","    @return {String} String representation of the combined text content of all","        the ranges in this selection.","    **/","    toString: function () {","        var ranges = this.ranges(),","            string = '';","","        for (var i = 0, len = ranges.length; i < len; i++) {","            string += ranges[i].toString();","        }","","        return string;","    }","};","","Y.Selection = Selection;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-range\"]});"];
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].lines = {"1":0,"20":0,"25":0,"26":0,"28":0,"31":0,"35":0,"37":0,"56":0,"58":0,"73":0,"76":0,"86":0,"88":0,"89":0,"92":0,"111":0,"112":0,"115":0,"116":0,"118":0,"130":0,"131":0,"133":0,"136":0,"138":0,"153":0,"156":0,"157":0,"160":0,"164":0};
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].functions = {"(anonymous 2):25":0,"}:27":0,"(anonymous 3):34":0,"}:36":0,"(anonymous 4):55":0,"}:57":0,"(anonymous 5):72":0,"}:75":0,"ranges:85":0,"(anonymous 6):110":0,"}:117":0,"(anonymous 7):129":0,"}:137":0,"toString:152":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].coveredLines = 31;
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].coveredFunctions = 15;
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 1);
YUI.add('gallery-sm-selection', function (Y, NAME) {

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

_yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 20);
var doc = Y.config.doc,
    win = Y.config.win,

    isHTML5 = !!(win && win.getSelection);

_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 25);
var Selection = isHTML5 ? function () {
    _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 2)", 25);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 26);
this._selection = win.getSelection();
} : function () {
    _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 27);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 28);
this._selection = doc.selection;
};

_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 31);
Selection.prototype = {
    // -- Public Methods -------------------------------------------------------

    anchorNode: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 3)", 34);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 35);
return this._selection.anchorNode;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 36);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 37);
throw new Error('Not yet implemented.');
    },

    // anchorOffset: function () {},

    // collapse (toStart/toEnd)
    // containsNode
    // deleteFromDocument
    // extend

    // focusNode: function () {},

    // focusOffset: function () {},

    // isCollapsed: function () {},

    // modify

    rangeCount: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 4)", 55);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 56);
return this._selection.rangeCount;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 57);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 58);
throw new Error('Not yet implemented.');
    },

    /**
    Returns the `Range` instance at the specified _index_, or the first range in
    this selection if no index is specified. If no ranges are selected, returns
    `null`.

    @method range
    @param {Number} [index=0] Range index.
    @return {Range} Range instance at the specified _index_, or the first range
        in this selection if no index is specified. If no ranges are selected,
        returns `null`.
    **/
    range: isHTML5 ? function (index) {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 5)", 72);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 73);
return this.rangeCount() ?
            new Y.Range(this._selection.getRangeAt(index || 0)) : null;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 75);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 76);
throw new Error('Not yet implemented.');
    },

    /**
    Returns an array containing all the ranges in this selection.

    @method ranges
    @return {Range[]} Array containing all the ranges in this selection.
    **/
    ranges: function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "ranges", 85);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 86);
var ranges = [];

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 88);
for (var i = 0, len = this.rangeCount(); i < len; i++) {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 89);
ranges.push(this.range(i));
        }

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 92);
return ranges;
    },

    /**
    Selects the specified _range_.

    By default, this will result in only this range being selected. If
    `options.multi` is truthy, then the _range_ will be added to the current
    selection without first unselecting any other selected ranges.

    @method select
    @param {Range} range Range to select.
    @param {Object} [options] Options.
        @param {Boolean} [options.multi=false] If `true`, the specified _range_
            will be added to the current list of selected ranges instead of
            replacing the current selection.
    @chainable
    **/
    select: isHTML5 ? function (range, options) {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 6)", 110);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 111);
if (!options || !options.multi) {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 112);
this.unselect();
        }

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 115);
this._selection.addRange(range._range);
        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 116);
return this;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 117);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 118);
throw new Error('Not yet implemented.');
    },

    /**
    Removes the specified _range_ from this selection, or unselects all ranges
    if no _range_ is specified.

    @method unselect
    @param {Range} [range] Range to unselect.
    @chainable
    **/
    unselect: isHTML5 ? function (range) {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 7)", 129);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 130);
if (range) {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 131);
this._selection.removeRange(range._range);
        } else {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 133);
this._selection.removeAllRanges();
        }

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 136);
return this;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 137);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 138);
throw new Error('Not yet implemented.');
    },

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
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "toString", 152);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 153);
var ranges = this.ranges(),
            string = '';

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 156);
for (var i = 0, len = ranges.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 157);
string += ranges[i].toString();
        }

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 160);
return string;
    }
};

_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 164);
Y.Selection = Selection;


}, '@VERSION@', {"requires": ["gallery-sm-range"]});
