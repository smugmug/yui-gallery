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
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].code=["YUI.add('gallery-sm-editor-link', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Link` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-link","**/","","/**","Extension for `Editor.Base` that enables inserting links","","@class Editor.Link","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","var EDOM = Y.Editor.DOM;","","var EditorLink = Y.Base.create('editorLink', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    linkCommands: {","        createLink: {","            fn: '_createLink'","        },","","        unlink: {","            fn: '_unlink'","        }","    },","","    /**","    Key commands related to creating hyperlinks.","","    @property {Object} linkKeyCommands","    **/","    linkKeyCommands: {","        // Create a link.","        'alt+ctrl+l'      : {fn: '_linkPrompt', allowDefault: false}","    },","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} supportedTags","    **/","    linkTags: 'a',","","    /**","    HTML Template for building an anchor node","","    @property {Object} linkTemplate","    **/","    linkTemplate: '<a href=\"{href}\" target=\"{target}\"></a>',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        if (this.supportedTags) {","            this.supportedTags += ',' + this.linkTags;","        } else {","            this.supportedTags = this.linkTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);","        }","","        this._attachLinkEvents();","    },","","","    destructor: function () {","        this._detachLinkEvents();","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns whether or not the current range is entirely in an anchor element","","    @method isLink","    @return {boolean} `true` if the range is contained in an anchor element,","      `false` otherwise","    **/","    isLink: function () {","        return !!this._getAnchorNode();","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches block events.","","    @method _attachLinkEvents","    @protected","    **/","    _attachLinkEvents: function () {","        if (this._linkEvents) {","            return;","        }","","        this._linkEvents = [","            Y.Do.before(this._linkBeforeExecCommand, this, '_execCommand', this)","        ];","    },","","","    /**","    Detaches link events.","","    @method _detachBlockEvents","    @protected","    **/","    _detachLinkEvents: function () {","        if (this._linkEvents) {","            new Y.EventHandle(this._linkEvents).detach();","            this._linkEvents = null;","        }","    },","","","    /**","    @method _execLinkCommand","    @param {String} name","    @param {Function|Number|String} value","    @protected","    **/","    _execLinkCommand: function (name, value) {","        var command = this.linkCommands[name],","            range = this.selection.range(),","            fn;","","        if (!range || !command) {","            return;","        }","","        fn = command.fn;","","        if ('string' === typeof fn) {","            fn = this[fn];","        }","","        fn && fn.call(this, value);","    },","","","    /**","    Returns the nearest ancestor anchor that entirely contains","    the current range","","    @method _getAnchorNode","    @returns {Node} The containing anchor element","    @protected","    **/","    _getAnchorNode: function() {","        this.focus();","","        var parentNode = this.selection.range().shrink().parentNode();","","        return parentNode.ancestor(this.linkTags, true);","    },","","","    /**","    Implementation for the `createLink` command","","    Wraps the currently selected range in an anchor `<a>` tag","","    @method _createLink","    @param {Object} options","        @param {String} options.href","        @param {String} [options.target=_self]","        @param {String} [options.text]","    @protected","    **/","    _createLink: function(options){","        var range = this.selection.range(),","            anchorNode, styleNodes;","","        if (!range) {","            return;","        }","","        if (this.isLink()) {","            this._unlink();","            range = this.selection.range();","        }","","        options || (options = {});","        options.target || (options.target = '_self');","        options.href || (options.href = '');","","        anchorNode = Y.Node.create(Y.Lang.sub(this.linkTemplate, options));","        styleNodes = this._getStyleNodes(range);","","        anchorNode.append(styleNodes);","","        range.insertNode(anchorNode);","","        if (options.text && options.text !== range.toString()) {","            var firstChild = anchorNode.get('firstChild');","","            if (this._isStyleNode(firstChild)) {","                firstChild.set('text', options.text);","                anchorNode.setHTML(firstChild);","            } else {","                anchorNode.set('text', options.text);","            }","        }","","        range.selectNode(anchorNode).collapse();","","        this.selection.select(range);","    },","","","    /**","    @method _linkPrompt","    @protected","    **/","    _linkPrompt: function() {","        var href = Y.config.win.prompt('Enter a url');","","        if (href) {","            this.command('createLink', {href: href});","        }","    },","","","    /**","    Removes link by replacing the anchor element with the child nodes","    of the anchor","","    The anchor element will be removed from the DOM and destroyed.","","    @method _unlink","    @protected","    **/","    _unlink: function() {","        var anchorNode = this._getAnchorNode(),","            range;","","        if (anchorNode) {","            range = EDOM.unwrap(anchorNode);","","            this.selection.select(range.shrink({trim: true}));","        }","    },","","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    AOP wrapper for `Editor.Base#_execCommand()`.","","    @method _linkBeforeExecCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _linkBeforeExecCommand: function (name, value) {","        if (this.linkCommands[name]) {","            var ret = this._execLinkCommand(name, value);","            return new Y.Do.Halt('Editor.Link prevented _execCommand', ret);","        }","    }","});","","Y.namespace('Editor').Link = EditorLink;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-dom\"]});"];
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].lines = {"1":0,"21":0,"22":0,"24":0,"66":0,"67":0,"69":0,"72":0,"73":0,"76":0,"81":0,"95":0,"108":0,"109":0,"112":0,"125":0,"126":0,"127":0,"139":0,"143":0,"144":0,"147":0,"149":0,"150":0,"153":0,"166":0,"168":0,"170":0,"187":0,"190":0,"191":0,"194":0,"195":0,"196":0,"199":0,"200":0,"201":0,"203":0,"204":0,"206":0,"208":0,"210":0,"211":0,"213":0,"214":0,"215":0,"217":0,"221":0,"223":0,"232":0,"234":0,"235":0,"250":0,"253":0,"254":0,"256":0,"272":0,"273":0,"274":0,"279":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].functions = {"initializer:65":0,"destructor:80":0,"isLink:94":0,"_attachLinkEvents:107":0,"_detachLinkEvents:124":0,"_execLinkCommand:138":0,"_getAnchorNode:165":0,"_createLink:186":0,"_linkPrompt:231":0,"_unlink:249":0,"_linkBeforeExecCommand:271":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredLines = 60;
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredFunctions = 13;
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "initializer", 65);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 66);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 67);
this.supportedTags += ',' + this.linkTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 69);
this.supportedTags = this.linkTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 72);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 73);
this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 76);
this._attachLinkEvents();
    },


    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "destructor", 80);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 81);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "isLink", 94);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 95);
return !!this._getAnchorNode();
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches block events.

    @method _attachLinkEvents
    @protected
    **/
    _attachLinkEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_attachLinkEvents", 107);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 108);
if (this._linkEvents) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 109);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 112);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_detachLinkEvents", 124);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 125);
if (this._linkEvents) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 126);
new Y.EventHandle(this._linkEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 127);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_execLinkCommand", 138);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 139);
var command = this.linkCommands[name],
            range = this.selection.range(),
            fn;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 143);
if (!range || !command) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 144);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 147);
fn = command.fn;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 149);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 150);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 153);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_getAnchorNode", 165);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 166);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 168);
var parentNode = this.selection.range().shrink().parentNode();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 170);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_createLink", 186);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 187);
var range = this.selection.range(),
            anchorNode, styleNodes;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 190);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 191);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 194);
if (this.isLink()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 195);
this._unlink();
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 196);
range = this.selection.range();
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 199);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 200);
options.target || (options.target = '_self');
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 201);
options.href || (options.href = '');

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 203);
anchorNode = Y.Node.create(Y.Lang.sub(this.linkTemplate, options));
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 204);
styleNodes = this._getStyleNodes(range);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 206);
anchorNode.append(styleNodes);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 208);
range.insertNode(anchorNode);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 210);
if (options.text && options.text !== range.toString()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 211);
var firstChild = anchorNode.get('firstChild');

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 213);
if (this._isStyleNode(firstChild)) {
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 214);
firstChild.set('text', options.text);
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 215);
anchorNode.setHTML(firstChild);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 217);
anchorNode.set('text', options.text);
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 221);
range.selectNode(anchorNode).collapse();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 223);
this.selection.select(range);
    },


    /**
    @method _linkPrompt
    @protected
    **/
    _linkPrompt: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_linkPrompt", 231);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 232);
var href = Y.config.win.prompt('Enter a url');

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 234);
if (href) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 235);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_unlink", 249);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 250);
var anchorNode = this._getAnchorNode(),
            range;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 253);
if (anchorNode) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 254);
range = EDOM.unwrap(anchorNode);

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 256);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_linkBeforeExecCommand", 271);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 272);
if (this.linkCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 273);
var ret = this._execLinkCommand(name, value);
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 274);
return new Y.Do.Halt('Editor.Link prevented _execCommand', ret);
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 279);
Y.namespace('Editor').Link = EditorLink;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-dom"]});
