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
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-link/gallery-sm-editor-link.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].code=["YUI.add('gallery-sm-editor-link', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Link` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-link","**/","","/**","Extension for `Editor.Base` that enables inserting links","","@class Editor.Link","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","var EDOM = Y.Editor.DOM;","","var EditorLink = Y.Base.create('editorLink', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    template: '<a href=\"{href}\" target=\"{target}\"></a>',","","    // -- Public Methods -------------------------------------------------------","","    /**","    Wraps the currently selected range in an anchor element","","    @method link","    @param {Object} options","      @param {String} [options.target=_self]","      @param {String} [options.text=range.toString()]","      @param {String} options.href","    @chainable","    **/","    link: function (options) {","        return this.command(this._link, options);","    },","","","    /**","    Returns whether or not the current range is entirely in an anchor element","","    @method isLink","    @return {boolean} `true` if the range is contained in an anchor element,","      `false` otherwise","    **/","    isLink: function () {","        return !!this._getAnchorNode();","    },","","","    /**","    Removes link by replacing the anchor element with the child nodes","    of the anchor","","    The anchor element will be removed from the DOM and destroyed.","","    @method unlink","    @chainable","    **/","    unlink: function() {","        var anchorNode = this._getAnchorNode(),","            range;","","        if (anchorNode) {","            range = EDOM.unwrap(anchorNode);","","            this.selection.select(range.shrink({trim: true}));","        }","","        return this;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Returns the nearest ancestor anchor that entirely contains","    the current range","","    @method _getAnchorNode","    @returns {Node} The containing anchor element","    @protected","    **/","    _getAnchorNode: function() {","        this.focus();","","        var parentNode = this.selection.range().shrink().parentNode();","","        return EDOM.getAncestorElement(parentNode, 'a');","    },","","","    /**","    Implementation for the public `link` method","","    @method _link","    @param {Object} options","      @param {String} [options.target=_self]","      @param {String} [options.text=range.toString()]","      @param {String} options.href","    @chainable","    @protected","    **/","    _link: function(options){","        var range = this.selection.range();","","        if (!range) {","            return;","        }","","        options || (options = {});","        options.target || (options.target = '_self');","        //options.text || (options.text = range.toString());","        options.href || (options.href = '');","","        range.wrap(Y.Lang.sub(this.template, options));","","        return this;","    }","});","","Y.namespace('Editor').Link = EditorLink;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-dom\"]});"];
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].lines = {"1":0,"21":0,"22":0,"24":0,"42":0,"54":0,"68":0,"71":0,"72":0,"74":0,"77":0,"92":0,"94":0,"96":0,"112":0,"114":0,"115":0,"118":0,"119":0,"121":0,"123":0,"125":0,"129":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].functions = {"link:41":0,"isLink:53":0,"unlink:67":0,"_getAnchorNode:91":0,"_link:111":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredLines = 23;
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredFunctions = 7;
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 1);
YUI.add('gallery-sm-editor-link', function (Y, NAME) {

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

_yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 21);
(function() {
_yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "(anonymous 2)", 21);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 22);
var EDOM = Y.Editor.DOM;

_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 24);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "link", 41);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 42);
return this.command(this._link, options);
    },


    /**
    Returns whether or not the current range is entirely in an anchor element

    @method isLink
    @return {boolean} `true` if the range is contained in an anchor element,
      `false` otherwise
    **/
    isLink: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "isLink", 53);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 54);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "unlink", 67);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 68);
var anchorNode = this._getAnchorNode(),
            range;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 71);
if (anchorNode) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 72);
range = EDOM.unwrap(anchorNode);

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 74);
this.selection.select(range.shrink({trim: true}));
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 77);
return this;
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Returns the nearest ancestor anchor that entirely contains
    the current range

    @method _getAnchorNode
    @returns {Node} The containing anchor element
    @protected
    **/
    _getAnchorNode: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_getAnchorNode", 91);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 92);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 94);
var parentNode = this.selection.range().shrink().parentNode();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 96);
return EDOM.getAncestorElement(parentNode, 'a');
    },


    /**
    Implementation for the public `link` method

    @method _link
    @param {Object} options
      @param {String} [options.target=_self]
      @param {String} [options.text=range.toString()]
      @param {String} options.href
    @chainable
    @protected
    **/
    _link: function(options){
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_link", 111);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 112);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 114);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 115);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 118);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 119);
options.target || (options.target = '_self');
        //options.text || (options.text = range.toString());
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 121);
options.href || (options.href = '');

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 123);
range.wrap(Y.Lang.sub(this.template, options));

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 125);
return this;
    }
});

_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 129);
Y.namespace('Editor').Link = EditorLink;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-dom"]});
