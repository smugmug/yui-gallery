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
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-style/gallery-sm-editor-style.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].code=["YUI.add('gallery-sm-editor-style', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that normalizes style commands into css properties","","@class Editor.Style","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","","var EDOM = Y.Editor.DOM;","","var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} styleCommands","      @param {String} property The name of the CSS property in camelCase form","      @param {String} [valueOn] The `on` value of the property. eg. `bold`","      @param {String} [valueOff] The `off` value of the property. eg. `none`","    **/","    styleCommands: {","        bold: {","            property: 'fontWeight',","            valueOn: 'bold',","            valueOff: 'normal'","        },","","        fontName: {","            property: 'fontFamily'","        },","","        fontSize: {","            property: 'fontSize'","        },","","        italic: {","            property: 'fontStyle',","            valueOn: 'italic',","            valueOff: 'normal'","        },","","//        justifyCenter: {","//            property: 'textAlign',","//            value: 'center'","//        },","//","//        justifyLeft: {","//            property: 'textAlign',","//            value: 'left'","//        },","//","//        justifyRight: {","//            property: 'textAlign',","//            value: 'right'","//        },","","        underline: {","            property: 'textDecoration',","            valueOn: 'underline',","            valueOff: 'none'","        }","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Bolds or unbolds the current selection.","","    @method bold","    @chainable","    **/","    bold: function () {","        this.command('bold', 'toggle');","        return this;","    },","","    /**","    Italicizes or unitalicizes the current selection.","","    @method italic","    @chainable","    **/","    italic: function () {","        this.command('italic', 'toggle');","        return this;","    },","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.command(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    /**","    Toggles underline on the current selection.","","    @method underline","    @chainable","    **/","    underline: function () {","        this.command('underline', 'toggle');","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Traverses the children of a given node, removing empty nodes and","    clearing out any given css properties","","    Note: rootNode may get destroyed during the cleaning process","","    @method _cleanNode","    @param {Range} range","    @param {String|Array} properties","    @return {Range}","    @protected","    **/","    _cleanRange: function(range, properties) {","        var rootNode = range.parentNode(),","            styleCommands = this.styleCommands;","","        properties = Y.Array(properties);","","        function hasStyles(node) {","            return Y.Object.some(styleCommands, function(cmd) {","                return '' !== node._node.style[cmd.property];","            });","        }","","        function clean(node) {","            if (!EDOM.isElementNode(node)) {","                return;","            }","","            if ('' === node.get('text')) {","                // the node is empty, remove it","                node.remove(true);","            } else {","                // clear out the properties","                Y.Array.each(properties, function(style) {","                    node.setStyle(style, '');","                });","","                node.get('children').each(clean);","","                if (!hasStyles(node)) {","                    EDOM.unwrap(node);","                }","            }","        }","","        rootNode.get('children').each(clean);","","        if (!hasStyles(rootNode)) {","            range = EDOM.unwrap(rootNode);","        } else {","            range.selectNodeContents(rootNode);","        }","","        return range;","    },","","","    /**","    Duckpunch Editor.Base._execCommand to build css styled nodes instead of","    relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function(name, value) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            parentNode, styleNode;","","        if (!command) {","            return Y.Editor.Base.prototype._execCommand.call(this, name, value);","        }","","        if (!range) {","            return;","        }","","        // range.parentNode() may return a text node","        // so make sure we actually have an element","        parentNode = EDOM.getAncestorElement(range.parentNode());","","        if (parentNode !== this._inputNode &&","            parentNode.get('text') === range.toString()) {","            // if the entire text of a node is selected, just apply","            // styles to that node, as long as its not the input node","            styleNode = parentNode;","        } else {","            // otherwise, wrap the selection in a new node","            styleNode = range.wrap('<span>');","        }","","        if (this.boolCommands[name]) {","            if (this._queryCommandValue(name)) {","                // already set, disable","                // determine whether an ancestor has this property set","                // or not so we can simply unset the value instead of","                // setting it to `none` or `normal` or whatever","                value = this._getStyledAncestor(styleNode, command.property) ? command.valueOff : '';","            } else {","                // need to enable, set appropriate value","                value = command.valueOn || value;","            }","        }","","        styleNode.setStyle(command.property, value);","","        range.selectNodeContents(styleNode);","","        range = this._cleanRange(range, command.property);","","        this.selection.select(range);","    },","","    /**","    Walks the ancestor tree of a given node until a node that has","    the css property set is found","","    @method _getStyledAncestor","    @param {Node} startNode","    @param {String} property","    @param {Boolean} [self] Whether or not to include `startNode` in the scan","    @return {Node} The node having `property` set, or null if no node was found","    @protected","    **/","    _getStyledAncestor: function(startNode, property, self) {","        return startNode.ancestor(function(node) {","            if (!EDOM.isElementNode(node)) {","                return false;","            }","","            // don't use node.getStyle() because it will return","            // computedStyle for empty string values like `property: \"\"`","            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106","            return !!node._node.style[property];","        }, self, this.selectors.input);","    },","","    /**","    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes","    instead of relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function(name) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            parentNode, styleNode, value;","","        if (!command) {","            return Y.Editor.Base.prototype._queryCommandValue.call(this, name);","        }","","        if (range) {","            parentNode = range.shrink().parentNode();","","            // first attempt to get any explicitly styled ancestor for","            // the given property. Need to do this first because browsers","            // sometimes return different values for explicit style vs.","            // computed style. `font-weight: bold;` for example will return","            // `bold` in all browsers when explicitly set but `700` in","            // Firefox and Internet Explorer with computedStyle.","            styleNode = this._getStyledAncestor(parentNode, command.property, true);","","            if (!styleNode) {","                // no explicitly styled ancestor found. walk the","                // ancestor tree to find the closest element","                // node ancestor, inclusive of the parentNode","                styleNode = EDOM.getAncestorElement(parentNode);","            }","","            // getStyle will fall back to computedStyle if the","            // property isn't explicitly set","            value = styleNode.getStyle(command.property);","","            if (this.boolCommands[name]) {","                value = (value === command.valueOn);","            }","        }","","        return value;","    }","});","","Y.namespace('Editor').Style = EditorStyle;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-dom\", \"node-style\"]});"];
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].lines = {"1":0,"21":0,"23":0,"25":0,"92":0,"93":0,"103":0,"104":0,"121":0,"124":0,"125":0,"126":0,"127":0,"131":0,"133":0,"134":0,"135":0,"140":0,"150":0,"151":0,"169":0,"172":0,"174":0,"175":0,"176":0,"180":0,"181":0,"182":0,"185":0,"187":0,"190":0,"191":0,"194":0,"196":0,"197":0,"202":0,"204":0,"205":0,"207":0,"210":0,"227":0,"231":0,"232":0,"235":0,"236":0,"241":0,"243":0,"247":0,"250":0,"253":0,"254":0,"259":0,"262":0,"266":0,"268":0,"270":0,"272":0,"287":0,"288":0,"289":0,"295":0,"312":0,"316":0,"317":0,"320":0,"321":0,"329":0,"331":0,"335":0,"340":0,"342":0,"343":0,"347":0,"351":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].functions = {"bold:91":0,"italic:102":0,"styles:120":0,"underline:149":0,"(anonymous 3):175":0,"hasStyles:174":0,"(anonymous 4):190":0,"clean:180":0,"_cleanRange:168":0,"_execCommand:226":0,"(anonymous 5):287":0,"_getStyledAncestor:286":0,"_queryCommandValue:311":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredLines = 74;
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredFunctions = 15;
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 1);
YUI.add('gallery-sm-editor-style', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Style` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-style
**/

/**
Extension for `Editor.Base` that normalizes style commands into css properties

@class Editor.Style
@constructor
@extends Base
@extensionfor Editor.Base
**/

_yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 21);
(function() {

_yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 2)", 21);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 23);
var EDOM = Y.Editor.DOM;

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 25);
var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of style commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} styleCommands
      @param {String} property The name of the CSS property in camelCase form
      @param {String} [valueOn] The `on` value of the property. eg. `bold`
      @param {String} [valueOff] The `off` value of the property. eg. `none`
    **/
    styleCommands: {
        bold: {
            property: 'fontWeight',
            valueOn: 'bold',
            valueOff: 'normal'
        },

        fontName: {
            property: 'fontFamily'
        },

        fontSize: {
            property: 'fontSize'
        },

        italic: {
            property: 'fontStyle',
            valueOn: 'italic',
            valueOff: 'normal'
        },

//        justifyCenter: {
//            property: 'textAlign',
//            value: 'center'
//        },
//
//        justifyLeft: {
//            property: 'textAlign',
//            value: 'left'
//        },
//
//        justifyRight: {
//            property: 'textAlign',
//            value: 'right'
//        },

        underline: {
            property: 'textDecoration',
            valueOn: 'underline',
            valueOff: 'none'
        }
    },


    // -- Public Methods -------------------------------------------------------

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "bold", 91);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 92);
this.command('bold', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 93);
return this;
    },

    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "italic", 102);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 103);
this.command('italic', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 104);
return this;
    },

    /**
    Gets and/or sets the values of multiple editor style commands.

    When called without an argument, the current values of all supported style
    commands will be returned. When called with a _styles_ object, the specified
    style commands will be set to their given values, and the resulting new
    values will be returned.

    @method styles
    @param {Object} [styles] Hash of style names and values to set.
    @return {Object} Hash of style names and values that were set, or all styles
        if no _styles_ parameter was specified.
    **/
    styles: function (styles) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "styles", 120);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 121);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 124);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 125);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 126);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 127);
results[name] = this.command(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 131);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 133);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 134);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 135);
results[name] = this._queryCommandValue(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 140);
return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "underline", 149);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 150);
this.command('underline', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 151);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Traverses the children of a given node, removing empty nodes and
    clearing out any given css properties

    Note: rootNode may get destroyed during the cleaning process

    @method _cleanNode
    @param {Range} range
    @param {String|Array} properties
    @return {Range}
    @protected
    **/
    _cleanRange: function(range, properties) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_cleanRange", 168);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 169);
var rootNode = range.parentNode(),
            styleCommands = this.styleCommands;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 172);
properties = Y.Array(properties);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 174);
function hasStyles(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "hasStyles", 174);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 175);
return Y.Object.some(styleCommands, function(cmd) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 3)", 175);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 176);
return '' !== node._node.style[cmd.property];
            });
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 180);
function clean(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "clean", 180);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 181);
if (!EDOM.isElementNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 182);
return;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 185);
if ('' === node.get('text')) {
                // the node is empty, remove it
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 187);
node.remove(true);
            } else {
                // clear out the properties
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 190);
Y.Array.each(properties, function(style) {
                    _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 4)", 190);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 191);
node.setStyle(style, '');
                });

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 194);
node.get('children').each(clean);

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 196);
if (!hasStyles(node)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 197);
EDOM.unwrap(node);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 202);
rootNode.get('children').each(clean);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 204);
if (!hasStyles(rootNode)) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 205);
range = EDOM.unwrap(rootNode);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 207);
range.selectNodeContents(rootNode);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 210);
return range;
    },


    /**
    Duckpunch Editor.Base._execCommand to build css styled nodes instead of
    relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands`

    @method _execCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execCommand: function(name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_execCommand", 226);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 227);
var command = this.styleCommands[name],
            range = this.selection.range(),
            parentNode, styleNode;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 231);
if (!command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 232);
return Y.Editor.Base.prototype._execCommand.call(this, name, value);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 235);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 236);
return;
        }

        // range.parentNode() may return a text node
        // so make sure we actually have an element
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 241);
parentNode = EDOM.getAncestorElement(range.parentNode());

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 243);
if (parentNode !== this._inputNode &&
            parentNode.get('text') === range.toString()) {
            // if the entire text of a node is selected, just apply
            // styles to that node, as long as its not the input node
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 247);
styleNode = parentNode;
        } else {
            // otherwise, wrap the selection in a new node
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 250);
styleNode = range.wrap('<span>');
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 253);
if (this.boolCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 254);
if (this._queryCommandValue(name)) {
                // already set, disable
                // determine whether an ancestor has this property set
                // or not so we can simply unset the value instead of
                // setting it to `none` or `normal` or whatever
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 259);
value = this._getStyledAncestor(styleNode, command.property) ? command.valueOff : '';
            } else {
                // need to enable, set appropriate value
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 262);
value = command.valueOn || value;
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 266);
styleNode.setStyle(command.property, value);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 268);
range.selectNodeContents(styleNode);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 270);
range = this._cleanRange(range, command.property);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 272);
this.selection.select(range);
    },

    /**
    Walks the ancestor tree of a given node until a node that has
    the css property set is found

    @method _getStyledAncestor
    @param {Node} startNode
    @param {String} property
    @param {Boolean} [self] Whether or not to include `startNode` in the scan
    @return {Node} The node having `property` set, or null if no node was found
    @protected
    **/
    _getStyledAncestor: function(startNode, property, self) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyledAncestor", 286);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 287);
return startNode.ancestor(function(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 5)", 287);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 288);
if (!EDOM.isElementNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 289);
return false;
            }

            // don't use node.getStyle() because it will return
            // computedStyle for empty string values like `property: ""`
            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 295);
return !!node._node.style[property];
        }, self, this.selectors.input);
    },

    /**
    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes
    instead of relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands`

    @method _queryCommandValue
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryCommandValue: function(name) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_queryCommandValue", 311);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 312);
var command = this.styleCommands[name],
            range = this.selection.range(),
            parentNode, styleNode, value;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 316);
if (!command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 317);
return Y.Editor.Base.prototype._queryCommandValue.call(this, name);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 320);
if (range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 321);
parentNode = range.shrink().parentNode();

            // first attempt to get any explicitly styled ancestor for
            // the given property. Need to do this first because browsers
            // sometimes return different values for explicit style vs.
            // computed style. `font-weight: bold;` for example will return
            // `bold` in all browsers when explicitly set but `700` in
            // Firefox and Internet Explorer with computedStyle.
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 329);
styleNode = this._getStyledAncestor(parentNode, command.property, true);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 331);
if (!styleNode) {
                // no explicitly styled ancestor found. walk the
                // ancestor tree to find the closest element
                // node ancestor, inclusive of the parentNode
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 335);
styleNode = EDOM.getAncestorElement(parentNode);
            }

            // getStyle will fall back to computedStyle if the
            // property isn't explicitly set
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 340);
value = styleNode.getStyle(command.property);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 342);
if (this.boolCommands[name]) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 343);
value = (value === command.valueOn);
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 347);
return value;
    }
});

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 351);
Y.namespace('Editor').Style = EditorStyle;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-dom", "node-style"]});
