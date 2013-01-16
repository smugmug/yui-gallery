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
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].code=["YUI.add('gallery-sm-selection', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Selection` class, which normalizes text selection functionality","across browsers.","","@module gallery-sm-selection","@main gallery-sm-selection","**/","","/**","Normalizes text selection functionality across browsers.","","@class Selection","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.getSelection);","","var Selection = isHTML5 ? function () {","    this._selection = win.getSelection();","} : function () {","    this._selection = doc.selection;","};","","Selection.prototype = {","    // -- Public Methods -------------------------------------------------------","","    // addRange","","    anchorNode: isHTML5 ? function () {","        return this._selection.anchorNode;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    anchorOffset: function () {},","","    // collapse (toStart/toEnd)","    // containsNode","    // deleteFromDocument","    // extend","","    focusNode: function () {},","","    focusOffset: function () {},","","    isCollapsed: function () {},","","    // modify","","    rangeCount: isHTML5 ? function () {","        return this._selection.rangeCount;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the `Range` instance at the specified _index_, or the first range in","    this selection if no index is specified.","","    @method range","    @param {Number} [index=0] Range index.","    @return {Range} Range instance at the specified _index_.","    **/","    range: isHTML5 ? function (index) {","        return new Y.Range(this._selection.getRangeAt(index || 0));","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns an array containing all the ranges in this selection.","","    @method ranges","    @return {Range[]} Array containing all the ranges in this selection.","    **/","    ranges: function () {","        var ranges = [];","","        for (var i = 0, len = this.rangeCount(); i < len; i++) {","            ranges.push(this.range(i));","        }","","        return ranges;","    },","","    // removeRange","    // removeAllRanges","    // selectAllChildren","    // selectionLanguageChange?","","    /**","    Returns a string representation of the combined text content of all the","    ranges in this selection.","","    @method toString","    @return {String} String representation of the combined text content of all","        the ranges in this selection.","    **/","    toString: function () {","        var ranges = this.ranges(),","            string = '';","","        for (var i = 0, len = ranges.length; i < len; i++) {","            string += ranges[i].toString();","        }","","        return string;","    }","};","","Y.Selection = Selection;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-range\"]});"];
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].lines = {"1":0,"20":0,"25":0,"26":0,"28":0,"31":0,"37":0,"39":0,"58":0,"60":0,"72":0,"74":0,"84":0,"86":0,"87":0,"90":0,"107":0,"110":0,"111":0,"114":0,"118":0};
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].functions = {"(anonymous 2):25":0,"}:27":0,"(anonymous 3):36":0,"}:38":0,"(anonymous 4):57":0,"}:59":0,"(anonymous 5):71":0,"}:73":0,"ranges:83":0,"toString:106":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].coveredLines = 21;
_yuitest_coverage["build/gallery-sm-selection/gallery-sm-selection.js"].coveredFunctions = 11;
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

    // addRange

    anchorNode: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 3)", 36);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 37);
return this._selection.anchorNode;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 38);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 39);
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
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 4)", 57);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 58);
return this._selection.rangeCount;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 59);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 60);
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
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "(anonymous 5)", 71);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 72);
return new Y.Range(this._selection.getRangeAt(index || 0));
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "}", 73);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 74);
throw new Error('Not yet implemented.');
    },

    /**
    Returns an array containing all the ranges in this selection.

    @method ranges
    @return {Range[]} Array containing all the ranges in this selection.
    **/
    ranges: function () {
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "ranges", 83);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 84);
var ranges = [];

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 86);
for (var i = 0, len = this.rangeCount(); i < len; i++) {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 87);
ranges.push(this.range(i));
        }

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 90);
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
        _yuitest_coverfunc("build/gallery-sm-selection/gallery-sm-selection.js", "toString", 106);
_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 107);
var ranges = this.ranges(),
            string = '';

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 110);
for (var i = 0, len = ranges.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 111);
string += ranges[i].toString();
        }

        _yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 114);
return string;
    }
};

_yuitest_coverline("build/gallery-sm-selection/gallery-sm-selection.js", 118);
Y.Selection = Selection;


}, '@VERSION@', {"requires": ["gallery-sm-range"]});
