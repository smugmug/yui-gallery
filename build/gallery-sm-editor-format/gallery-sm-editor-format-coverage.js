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
_yuitest_coverage["build/gallery-sm-editor-format/gallery-sm-editor-format.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-format/gallery-sm-editor-format.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-format/gallery-sm-editor-format.js"].code=["YUI.add('gallery-sm-editor-format', function (Y, NAME) {","","/**"," * User: lee"," * Date: 9/30/13"," */","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that formats html","","@class Editor.Format","@constructor","@extends Base","@extensionfor Editor.Format","**/","","(function () {","","var doc = Y.config.doc,","    EDOM = Y.Editor.DOM,","    STYLENODE = '<span></span>';","","var EditorFormat = Y.Base.create('editorFormat', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.supportedStyles = [];","","        Y.Object.each(this.styleCommands, function (cmd) {","            this.supportedStyles.push(cmd.style.property);","        }, this);","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Reformats html to the proper style","","    TODO: put this in its own extension.  doesnt belong here.","","    <span>blah blah</span>","    @param {HTML} html HTML string to format","    @return {Node} Node instance containing a document fragment with the","        formatted _html_","    @protected","    **/","    _formatHTML: function (html) {","        function flatten (node) {","            var childNodes = node.get('childNodes')._nodes;","","            Y.Array.each(childNodes.reverse(), function (node) {","                var parentNode;","","                node = Y.one(node);","                parentNode = node.get('parentNode');","","                if (EDOM.isTextNode(node)) {","                    if (this._isBlockNode(parentNode)) {","                        node.wrap(STYLENODE);","                    } else if (node.get('previousSibling')) {","                        EDOM.split(parentNode, node);","                    }","                } else {","                    // TODO: replace b, em, i, strong, u nodes with spans","                    if (!node.test(this.supportedTags)) {","                        node.replace(node.get('text'));","                    } else if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {","                        parentNode.insert(node, 'after');","","                        if (!this._isBlockNode(node)) {","                            node.addClass(parentNode.get('className'));","","                            EDOM.copyStyles(parentNode, node, this.supportedStyles, {","                                explicit: true,","                                overwrite: false","                            });","                        }","                    } else {","                        // TODO: clear styles on containers","                    }","","                    flatten.call(this, node);","","                    if (EDOM.isEmptyNode(node)) {","                        node.remove(true);","                    }","","                    node.removeAttribute('id');","                }","            }, this);","        }","","        var frag = Y.one(doc.createDocumentFragment()).setHTML(html);","","        flatten.call(this, frag);","","        return frag;","    },","","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        value = Y.Editor.Base.prototype._getHTML.call(this, value);","","        return this.get('formatFn')(value).getHTML();","    },","","","    /**","    Returns true if the given node is a container element, false otherwise","    A container element is defined as a non-inline element","","    @method _isBlockNode","    @param {HTMLNode|Node} node","    @return {Boolean} true if the given node is a container element, false otherwise","    @protected","    **/","    _isBlockNode: function (node) {","        node = Y.one(node);","","        // isElementNode() will exclude document fragments, which are valid","        // containers, use !isTextNode() instead","        return !EDOM.isTextNode(node) && (node.get('nodeName') === '#document-fragment' || node.test(this.blockTags));","    },","","","    /**","    Returns true if the given node is an inline element node, false otherwise","","    @method _isStyleNode","    @param {HTMLNode|Node} node","    @return {Boolean} true if the given node is an inline element node, false otherwise","    @protected","    **/","    _isStyleNode: function (node) {","        node = Y.one(node);","","        return node && !EDOM.isTextNode(node) && node.test(this.styleTags);","    },","","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        value = this.get('formatFn')(value).getHTML();","","        return Y.Editor.Base.prototype._setHTML.call(this, value);","    }","}, {","    ATTRS: {","        /**","        Function for formatting editor html","","        One day allow custom formatting. Today is not that day.","        **/","        formatFn: {","            readOnly: true,","            setter: function (val) {","                return Y.bind(val, this);","            },","            validator: Y.Lang.isFunction,","            valueFn: function () {","                return this._formatHTML;","            }","        }","    }","});","","Y.namespace('Editor').Format = EditorFormat;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\"]});"];
_yuitest_coverage["build/gallery-sm-editor-format/gallery-sm-editor-format.js"].lines = {"1":0,"25":0,"27":0,"31":0,"38":0,"40":0,"41":0,"60":0,"61":0,"63":0,"64":0,"66":0,"67":0,"69":0,"70":0,"71":0,"72":0,"73":0,"77":0,"78":0,"79":0,"80":0,"82":0,"83":0,"85":0,"94":0,"96":0,"97":0,"100":0,"105":0,"107":0,"109":0,"122":0,"124":0,"138":0,"142":0,"155":0,"157":0,"170":0,"172":0,"184":0,"188":0,"194":0};
_yuitest_coverage["build/gallery-sm-editor-format/gallery-sm-editor-format.js"].functions = {"(anonymous 3):40":0,"initializer:37":0,"(anonymous 4):63":0,"flatten:60":0,"_formatHTML:59":0,"_getHTML:121":0,"_isBlockNode:137":0,"_isStyleNode:154":0,"_setHTML:169":0,"setter:183":0,"valueFn:187":0,"(anonymous 2):25":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-format/gallery-sm-editor-format.js"].coveredLines = 43;
_yuitest_coverage["build/gallery-sm-editor-format/gallery-sm-editor-format.js"].coveredFunctions = 13;
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 1);
YUI.add('gallery-sm-editor-format', function (Y, NAME) {

/**
 * User: lee
 * Date: 9/30/13
 */
/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Style` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-style
**/

/**
Extension for `Editor.Base` that formats html

@class Editor.Format
@constructor
@extends Base
@extensionfor Editor.Format
**/

_yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 25);
(function () {

_yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "(anonymous 2)", 25);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 27);
var doc = Y.config.doc,
    EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 31);
var EditorFormat = Y.Base.create('editorFormat', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "initializer", 37);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 38);
this.supportedStyles = [];

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 40);
Y.Object.each(this.styleCommands, function (cmd) {
            _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "(anonymous 3)", 40);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 41);
this.supportedStyles.push(cmd.style.property);
        }, this);
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Reformats html to the proper style

    TODO: put this in its own extension.  doesnt belong here.

    <span>blah blah</span>
    @param {HTML} html HTML string to format
    @return {Node} Node instance containing a document fragment with the
        formatted _html_
    @protected
    **/
    _formatHTML: function (html) {
        _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "_formatHTML", 59);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 60);
function flatten (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "flatten", 60);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 61);
var childNodes = node.get('childNodes')._nodes;

            _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 63);
Y.Array.each(childNodes.reverse(), function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "(anonymous 4)", 63);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 64);
var parentNode;

                _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 66);
node = Y.one(node);
                _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 67);
parentNode = node.get('parentNode');

                _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 69);
if (EDOM.isTextNode(node)) {
                    _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 70);
if (this._isBlockNode(parentNode)) {
                        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 71);
node.wrap(STYLENODE);
                    } else {_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 72);
if (node.get('previousSibling')) {
                        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 73);
EDOM.split(parentNode, node);
                    }}
                } else {
                    // TODO: replace b, em, i, strong, u nodes with spans
                    _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 77);
if (!node.test(this.supportedTags)) {
                        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 78);
node.replace(node.get('text'));
                    } else {_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 79);
if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {
                        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 80);
parentNode.insert(node, 'after');

                        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 82);
if (!this._isBlockNode(node)) {
                            _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 83);
node.addClass(parentNode.get('className'));

                            _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 85);
EDOM.copyStyles(parentNode, node, this.supportedStyles, {
                                explicit: true,
                                overwrite: false
                            });
                        }
                    } else {
                        // TODO: clear styles on containers
                    }}

                    _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 94);
flatten.call(this, node);

                    _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 96);
if (EDOM.isEmptyNode(node)) {
                        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 97);
node.remove(true);
                    }

                    _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 100);
node.removeAttribute('id');
                }
            }, this);
        }

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 105);
var frag = Y.one(doc.createDocumentFragment()).setHTML(html);

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 107);
flatten.call(this, frag);

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 109);
return frag;
    },


    /**
    Getter for the `html` attribute.

    @method _getHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _getHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "_getHTML", 121);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 122);
value = Y.Editor.Base.prototype._getHTML.call(this, value);

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 124);
return this.get('formatFn')(value).getHTML();
    },


    /**
    Returns true if the given node is a container element, false otherwise
    A container element is defined as a non-inline element

    @method _isBlockNode
    @param {HTMLNode|Node} node
    @return {Boolean} true if the given node is a container element, false otherwise
    @protected
    **/
    _isBlockNode: function (node) {
        _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "_isBlockNode", 137);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 138);
node = Y.one(node);

        // isElementNode() will exclude document fragments, which are valid
        // containers, use !isTextNode() instead
        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 142);
return !EDOM.isTextNode(node) && (node.get('nodeName') === '#document-fragment' || node.test(this.blockTags));
    },


    /**
    Returns true if the given node is an inline element node, false otherwise

    @method _isStyleNode
    @param {HTMLNode|Node} node
    @return {Boolean} true if the given node is an inline element node, false otherwise
    @protected
    **/
    _isStyleNode: function (node) {
        _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "_isStyleNode", 154);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 155);
node = Y.one(node);

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 157);
return node && !EDOM.isTextNode(node) && node.test(this.styleTags);
    },


    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "_setHTML", 169);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 170);
value = this.get('formatFn')(value).getHTML();

        _yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 172);
return Y.Editor.Base.prototype._setHTML.call(this, value);
    }
}, {
    ATTRS: {
        /**
        Function for formatting editor html

        One day allow custom formatting. Today is not that day.
        **/
        formatFn: {
            readOnly: true,
            setter: function (val) {
                _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "setter", 183);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 184);
return Y.bind(val, this);
            },
            validator: Y.Lang.isFunction,
            valueFn: function () {
                _yuitest_coverfunc("build/gallery-sm-editor-format/gallery-sm-editor-format.js", "valueFn", 187);
_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 188);
return this._formatHTML;
            }
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-format/gallery-sm-editor-format.js", 194);
Y.namespace('Editor').Format = EditorFormat;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base"]});
