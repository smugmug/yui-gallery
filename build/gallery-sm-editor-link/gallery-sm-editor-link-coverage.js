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
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].code=["YUI.add('gallery-sm-editor-link', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Link` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-link","**/","","/**","Extension for `Editor.Base` that enables inserting links","","@class Editor.Link","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","var EDOM = Y.Editor.DOM;","","var EditorLink = Y.Base.create('editorLink', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Key commands related to creating hyperlinks.","","    @property {Object} linkKeyCommands","    **/","    linkKeyCommands: {","        // Create a link.","        'ctrl+h'      : {fn: '_linkPrompt', allowDefault: false}","    },","","    /**","    HTML Template for building an anchor node","","    @property {Object} linkTemplate","    **/","    linkTemplate: '<a href=\"{href}\" target=\"{target}\"></a>',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","//        if (this.keyCommands) {","//            this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);","//        }","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Wraps the currently selected range in an anchor element","","    @method link","    @param {Object} options","        @param {String} options.href","        @param {String} [options.target=_self]","        @param {String} [options.text]","    @chainable","    **/","    link: function (options) {","        return this.command(this._link, options);","    },","","","    /**","    Returns whether or not the current range is entirely in an anchor element","","    @method isLink","    @return {boolean} `true` if the range is contained in an anchor element,","      `false` otherwise","    **/","    isLink: function () {","        return !!this._getAnchorNode();","    },","","","    /**","    Removes link by replacing the anchor element with the child nodes","    of the anchor","","    The anchor element will be removed from the DOM and destroyed.","","    @method unlink","    @chainable","    **/","    unlink: function() {","        var anchorNode = this._getAnchorNode(),","            range;","","        if (anchorNode) {","            range = EDOM.unwrap(anchorNode);","","            this.selection.select(range.shrink({trim: true}));","        }","","        return this;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Returns the nearest ancestor anchor that entirely contains","    the current range","","    @method _getAnchorNode","    @returns {Node} The containing anchor element","    @protected","    **/","    _getAnchorNode: function() {","        this.focus();","","        var parentNode = this.selection.range().shrink().parentNode();","","        return EDOM.getAncestorElement(parentNode, 'a');","    },","","","    /**","    Implementation for the public `link` method.","","    Wraps the currently selected range in an anchor `<a>` tag","","    @method _link","    @param {Object} options","        @param {String} options.href","        @param {String} [options.target=_self]","        @param {String} [options.text]","    @chainable","    @protected","    **/","    _link: function(options){","        var range = this.selection.range(),","            anchorNode;","","        if (!range) {","            return;","        }","","        if (this.isLink()) {","            range = this.unlink().selection.range();","        }","","        options || (options = {});","        options.target || (options.target = '_self');","        options.href || (options.href = '');","","        // expanding the range before deleting contents makes sure","        // the entire node is wrapped, if possible.","        range.expand(this._inputNode);","","        anchorNode = Y.Lang.sub(this.linkTemplate, options);","        anchorNode = range.wrap(anchorNode);","","        if (options.text && options.text !== range.toString()) {","            var firstChild = anchorNode.get('firstChild');","","            if (EDOM.isInlineElement(firstChild)) {","                firstChild.set('text', options.text);","                anchorNode.setHTML(firstChild);","            } else {","                anchorNode.set('text', options.text);","            }","        }","","        range.endNode(anchorNode, 'after');","","        this.selection.select(range.collapse());","","        return this;","    },","","","    /**","    @method _linkPrompt","    @protected","    **/","    _linkPrompt: function() {","        var href = Y.config.win.prompt('Enter a url');","","        if (href) {","            this.link({href: href});","        }","    }","});","","Y.namespace('Editor').Link = EditorLink;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-dom\"]});"];
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].lines = {"1":0,"21":0,"22":0,"24":0,"67":0,"79":0,"93":0,"96":0,"97":0,"99":0,"102":0,"117":0,"119":0,"121":0,"139":0,"142":0,"143":0,"146":0,"147":0,"150":0,"151":0,"152":0,"156":0,"158":0,"159":0,"161":0,"162":0,"164":0,"165":0,"166":0,"168":0,"172":0,"174":0,"176":0,"185":0,"187":0,"188":0,"193":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].functions = {"link:66":0,"isLink:78":0,"unlink:92":0,"_getAnchorNode:116":0,"_link:138":0,"_linkPrompt:184":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredLines = 38;
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredFunctions = 8;
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

    /**
    Key commands related to creating hyperlinks.

    @property {Object} linkKeyCommands
    **/
    linkKeyCommands: {
        // Create a link.
        'ctrl+h'      : {fn: '_linkPrompt', allowDefault: false}
    },

    /**
    HTML Template for building an anchor node

    @property {Object} linkTemplate
    **/
    linkTemplate: '<a href="{href}" target="{target}"></a>',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
//        if (this.keyCommands) {
//            this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);
//        }
    },


    // -- Public Methods -------------------------------------------------------

    /**
    Wraps the currently selected range in an anchor element

    @method link
    @param {Object} options
        @param {String} options.href
        @param {String} [options.target=_self]
        @param {String} [options.text]
    @chainable
    **/
    link: function (options) {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "link", 66);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 67);
return this.command(this._link, options);
    },


    /**
    Returns whether or not the current range is entirely in an anchor element

    @method isLink
    @return {boolean} `true` if the range is contained in an anchor element,
      `false` otherwise
    **/
    isLink: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "isLink", 78);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 79);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "unlink", 92);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 93);
var anchorNode = this._getAnchorNode(),
            range;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 96);
if (anchorNode) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 97);
range = EDOM.unwrap(anchorNode);

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 99);
this.selection.select(range.shrink({trim: true}));
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 102);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_getAnchorNode", 116);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 117);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 119);
var parentNode = this.selection.range().shrink().parentNode();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 121);
return EDOM.getAncestorElement(parentNode, 'a');
    },


    /**
    Implementation for the public `link` method.

    Wraps the currently selected range in an anchor `<a>` tag

    @method _link
    @param {Object} options
        @param {String} options.href
        @param {String} [options.target=_self]
        @param {String} [options.text]
    @chainable
    @protected
    **/
    _link: function(options){
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_link", 138);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 139);
var range = this.selection.range(),
            anchorNode;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 142);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 143);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 146);
if (this.isLink()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 147);
range = this.unlink().selection.range();
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 150);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 151);
options.target || (options.target = '_self');
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 152);
options.href || (options.href = '');

        // expanding the range before deleting contents makes sure
        // the entire node is wrapped, if possible.
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 156);
range.expand(this._inputNode);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 158);
anchorNode = Y.Lang.sub(this.linkTemplate, options);
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 159);
anchorNode = range.wrap(anchorNode);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 161);
if (options.text && options.text !== range.toString()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 162);
var firstChild = anchorNode.get('firstChild');

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 164);
if (EDOM.isInlineElement(firstChild)) {
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 165);
firstChild.set('text', options.text);
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 166);
anchorNode.setHTML(firstChild);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 168);
anchorNode.set('text', options.text);
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 172);
range.endNode(anchorNode, 'after');

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 174);
this.selection.select(range.collapse());

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 176);
return this;
    },


    /**
    @method _linkPrompt
    @protected
    **/
    _linkPrompt: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_linkPrompt", 184);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 185);
var href = Y.config.win.prompt('Enter a url');

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 187);
if (href) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 188);
this.link({href: href});
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 193);
Y.namespace('Editor').Link = EditorLink;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-dom"]});
