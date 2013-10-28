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
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].code=["YUI.add('gallery-sm-editor-link', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Link` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-link","**/","","/**","Extension for `Editor.Base` that enables inserting links","","@class Editor.Link","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","var EditorLink = Y.Base.create('editorLink', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of link commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} linkCommands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    linkCommands: {","        createLink: {","            commandFn: '_createLink',","            queryFn:   'isLink'","        },","","        unlink: {","            commandFn: '_unlink',","            queryFn:   'isLink'","        }","    },","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} supportedTags","    **/","    linkTags: 'a',","","    /**","    HTML Template for building an anchor node","","    @property {Object} linkTemplate","    **/","    linkTemplate: '<a href=\"{href}\" target=\"{target}\"></a>',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.commands = Y.merge(this.commands, this.linkCommands);","","        if (this.supportedTags) {","            this.supportedTags += ',' + this.linkTags;","        } else {","            this.supportedTags = this.linkTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);","        }","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns whether or not the current range is entirely in an anchor element","","    @method isLink","    @return {boolean} `true` if the range is contained in an anchor element,","      `false` otherwise","    **/","    isLink: function () {","        return !!this._getAnchorNode();","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Returns the nearest ancestor anchor that entirely contains","    the current range","","    @method _getAnchorNode","    @returns {Node} The containing anchor element","    @protected","    **/","    _getAnchorNode: function() {","        this.focus();","","        var parentNode = this.selection.range().shrink().parentNode();","","        return parentNode.ancestor(this.linkTags, true);","    },","","","    /**","    Implementation for the `createLink` command","","    Wraps the currently selected range in an anchor `<a>` tag","","    @method _createLink","    @param {Object} options","        @param {String} options.href","        @param {String} [options.target=_self]","        @param {String} [options.text]","    @protected","    **/","    _createLink: function(options){","        var range = this.selection.range(),","            anchorNode, styleNodes;","","        if (!range) {","            return;","        }","","        if (this.isLink()) {","            this._unlink();","            range = this.selection.range();","        }","","        options || (options = {});","        options.href = encodeURI(options.href || '');","        options.target = encodeURIComponent(options.target || '_self');","","        anchorNode = Y.Node.create(Y.Lang.sub(this.linkTemplate, options));","        styleNodes = this._getStyleNodes(range);","","        anchorNode.append(styleNodes);","","        range.insertNode(anchorNode);","","        if (options.text && options.text !== range.toString()) {","            var firstChild = anchorNode.get('firstChild');","","            if (this._isStyleNode(firstChild)) {","                firstChild.set('text', options.text);","                anchorNode.setHTML(firstChild);","            } else {","                anchorNode.set('text', options.text);","            }","        }","","        range.selectNode(anchorNode).collapse();","","        this.selection.select(range);","    },","","","    /**","    Removes link by replacing the anchor element with the child nodes","    of the anchor","","    The anchor element will be removed from the DOM and destroyed.","","    @method _unlink","    @protected","    **/","    _unlink: function() {","        var selection = this.selection,","            anchorNode;","","        // we can use the native unlink command once we have bookmarking","        // in place, but firefox selects adjacent text nodes after unlink","","        if (anchorNode = this._getAnchorNode()) {","            var firstChild = anchorNode.get('firstChild'),","                lastChild = anchorNode.get('lastChild'),","                range = selection.range();","","            // only need to unwrap one of the children to unwrap the","            // whole anchorNode","            firstChild.unwrap();","","            anchorNode.destroy();","","            range.startNode(firstChild, 0);","            range.endNode(lastChild, 'after');","","            selection.select(range.shrink({trim: true}));","        }","    }","});","","Y.namespace('Editor').Link = EditorLink;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-dom\"]});"];
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].lines = {"1":0,"21":0,"22":0,"66":0,"68":0,"69":0,"71":0,"74":0,"75":0,"90":0,"105":0,"107":0,"109":0,"126":0,"129":0,"130":0,"133":0,"134":0,"135":0,"138":0,"139":0,"140":0,"142":0,"143":0,"145":0,"147":0,"149":0,"150":0,"152":0,"153":0,"154":0,"156":0,"160":0,"162":0,"176":0,"182":0,"183":0,"189":0,"191":0,"193":0,"194":0,"196":0,"201":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].functions = {"initializer:65":0,"isLink:89":0,"_getAnchorNode:104":0,"_createLink:125":0,"_unlink:175":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-link/gallery-sm-editor-link.js"].coveredLines = 43;
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "initializer", 65);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 66);
this.commands = Y.merge(this.commands, this.linkCommands);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 68);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 69);
this.supportedTags += ',' + this.linkTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 71);
this.supportedTags = this.linkTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 74);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 75);
this.keyCommands = Y.merge(this.keyCommands, this.linkKeyCommands);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "isLink", 89);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 90);
return !!this._getAnchorNode();
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_getAnchorNode", 104);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 105);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 107);
var parentNode = this.selection.range().shrink().parentNode();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 109);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_createLink", 125);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 126);
var range = this.selection.range(),
            anchorNode, styleNodes;

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 129);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 130);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 133);
if (this.isLink()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 134);
this._unlink();
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 135);
range = this.selection.range();
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 138);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 139);
options.href = encodeURI(options.href || '');
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 140);
options.target = encodeURIComponent(options.target || '_self');

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 142);
anchorNode = Y.Node.create(Y.Lang.sub(this.linkTemplate, options));
        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 143);
styleNodes = this._getStyleNodes(range);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 145);
anchorNode.append(styleNodes);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 147);
range.insertNode(anchorNode);

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 149);
if (options.text && options.text !== range.toString()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 150);
var firstChild = anchorNode.get('firstChild');

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 152);
if (this._isStyleNode(firstChild)) {
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 153);
firstChild.set('text', options.text);
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 154);
anchorNode.setHTML(firstChild);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 156);
anchorNode.set('text', options.text);
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 160);
range.selectNode(anchorNode).collapse();

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 162);
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
        _yuitest_coverfunc("build/gallery-sm-editor-link/gallery-sm-editor-link.js", "_unlink", 175);
_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 176);
var selection = this.selection,
            anchorNode;

        // we can use the native unlink command once we have bookmarking
        // in place, but firefox selects adjacent text nodes after unlink

        _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 182);
if (anchorNode = this._getAnchorNode()) {
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 183);
var firstChild = anchorNode.get('firstChild'),
                lastChild = anchorNode.get('lastChild'),
                range = selection.range();

            // only need to unwrap one of the children to unwrap the
            // whole anchorNode
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 189);
firstChild.unwrap();

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 191);
anchorNode.destroy();

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 193);
range.startNode(firstChild, 0);
            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 194);
range.endNode(lastChild, 'after');

            _yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 196);
selection.select(range.shrink({trim: true}));
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-link/gallery-sm-editor-link.js", 201);
Y.namespace('Editor').Link = EditorLink;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-dom"]});
