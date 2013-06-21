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
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].code=["YUI.add('gallery-sm-editor-style', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that normalizes style commands into css properties","","@class Editor.Style","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","","var ELEMENT_NODE = 1;","","var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} styleCommands","      @param {String} property The name of the CSS property in camelCase form","      @param {String} [valueOn] The `on` value of the property. eg. `bold`","      @param {String} [valueOff] The `off` value of the property. eg. `none`","    **/","    styleCommands: {","        bold: {","            property: 'fontWeight',","            valueOn: 'bold',","            valueOff: 'normal'","        },","","        fontName: {","            property: 'fontFamily'","        },","","        fontSize: {","            property: 'fontSize'","        },","","        italic: {","            property: 'fontStyle',","            valueOn: 'italic',","            valueOff: 'normal'","        },","","//        justifyCenter: {","//            property: 'textAlign',","//            value: 'center'","//        },","//","//        justifyLeft: {","//            property: 'textAlign',","//            value: 'left'","//        },","//","//        justifyRight: {","//            property: 'textAlign',","//            value: 'right'","//        },","","        underline: {","            property: 'textDecoration',","            valueOn: 'underline',","            valueOff: 'none'","        }","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Bolds or unbolds the current selection.","","    @method bold","    @chainable","    **/","    bold: function () {","        this.command('bold', 'toggle');","        return this;","    },","","    /**","    Italicizes or unitalicizes the current selection.","","    @method italic","    @chainable","    **/","    italic: function () {","        this.command('italic', 'toggle');","        return this;","    },","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.command(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    /**","    Toggles underline on the current selection.","","    @method underline","    @chainable","    **/","    underline: function () {","        this.command('underline', 'toggle');","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Traverses the children of a given node, removing empty nodes and","    clearing out any given css properties","","    @method _cleanNode","    @param {Node} rootNode","    @param {String|Array} properties","    @return {Node} The cleaned node","    @protected","    **/","    _cleanNode: function(rootNode, properties) {","        var styleCommands = this.styleCommands;","","        properties = Y.Array(properties);","","        function clean(node) {","            if (ELEMENT_NODE !== node.get('nodeType')) {","                return;","            }","","            node.get('children').each(clean);","","            if ('' === node.get('text')) {","                // the node is empty, remove it","                node.remove(true);","            } else {","                if (node !== rootNode) {","                    // clear out the properties","                    Y.Array.each(properties, function(style) {","                        node.setStyle(style, '');","                    });","                }","","                // if this node doesn't have any other valid style properties","                // on it, we can unwrap it into a text node.","                // chrome likes to randomly add line-height for example.","                var hasStyles = Y.Object.some(styleCommands, function(cmd) {","                    return '' !== node._node.style[cmd.property];","                });","","                if (!hasStyles) {","                    var newNode = Y.Node.create(node.getHTML());","                    node.replace(newNode).remove(true);","                    node = newNode;","                }","            }","","            return node;","        }","","        return clean(rootNode);","    },","","","    /**","    Duckpunch Editor.Base._execCommand to build css styled nodes instead of","    relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function(name, value) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            parentNode, styleNode;","","        if (!command) {","            return Y.Editor.Base.prototype._execCommand.call(this, name, value);","        }","","        if (!range) {","            return;","        }","","        parentNode = range.parentNode();","","        if (ELEMENT_NODE !== parentNode.get('nodeType')) {","            // range.parentNode() may return a text node","            // so make sure we actually have an element","            parentNode = parentNode.ancestor();","        }","","        if (parentNode !== this._inputNode &&","            parentNode.get('text') === range.toString()) {","            // if the entire text of a node is selected, just apply","            // styles to that node, as long as its not the input node","            styleNode = parentNode;","        } else {","            // otherwise, wrap the selection in a new node","            styleNode = range.wrap('<span>');","        }","","        if (this.boolCommands[name]) {","            if (this._queryCommandValue(name)) {","                // already set, disable","                // determine whether an ancestor has this property set","                // or not so we can simply unset the value instead of","                // setting it to `none` or `normal` or whatever","                value = this._getStyledAncestor(styleNode, command.property) ? command.valueOff : '';","            } else {","                // need to enable, set appropriate value","                value = command.valueOn || value;","            }","        }","","        styleNode.setStyle(command.property, value);","","        styleNode = this._cleanNode(styleNode, command.property);","","        // when cleaning nodes the selection may get lost if the styleNode","        // gets unwrapped into a text node or has children unwrapped","        // so we need to rebuild the range and select it to give the","        // appearance the selection never changed","        range.startNode(styleNode);","        range.endNode(styleNode);","","        // set the endOffset based on the node type","        if (ELEMENT_NODE === styleNode.get('nodeType')) {","            range.endOffset(styleNode.get('childNodes').size());","        } else {","            range.endOffset(styleNode.get('text').length);","        }","","        this.selection.select(range);","    },","","    /**","    Walks the ancestor tree of a given node until a node that has","    the css property set is found","","    @method _getStyledAncestor","    @param {Node} startNode","    @param {String} property","    @param {Boolean} [self] Whether or not to include `startNode` in the scan","    @return {Node} The node having `property` set, or null if no node was found","    @protected","    **/","    _getStyledAncestor: function(startNode, property, self) {","        return startNode.ancestor(function(node) {","            if (ELEMENT_NODE !== node._node.nodeType) {","                return false;","            }","","            // don't use node.getStyle() because it will return","            // computedStyle for empty string values like `property: \"\"`","            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106","            return !!node._node.style[property];","        }, self, this.selectors.input);","    },","","    /**","    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes","    instead of relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function(name) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            styleNode, value;","","        if (!command) {","            return Y.Editor.Base.prototype._queryCommandValue.call(this, name);","        }","","        if (range) {","            styleNode = this._getStyledAncestor(range.shrink().parentNode(), command.property, true);","","            if (styleNode) {","                value = styleNode.getStyle(command.property);","            }","","            if (this.boolCommands[name]) {","                value = (value === command.valueOn);","            }","        }","","        return value;","    }","});","","Y.namespace('Editor').Style = EditorStyle;","","}());","","","}, '@VERSION@', {\"requires\": [\"node-style\", \"gallery-sm-editor-base\"]});"];
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].lines = {"1":0,"21":0,"23":0,"25":0,"92":0,"93":0,"103":0,"104":0,"121":0,"124":0,"125":0,"126":0,"127":0,"131":0,"133":0,"134":0,"135":0,"140":0,"150":0,"151":0,"167":0,"169":0,"171":0,"172":0,"173":0,"176":0,"178":0,"180":0,"182":0,"184":0,"185":0,"192":0,"193":0,"196":0,"197":0,"198":0,"199":0,"203":0,"206":0,"223":0,"227":0,"228":0,"231":0,"232":0,"235":0,"237":0,"240":0,"243":0,"247":0,"250":0,"253":0,"254":0,"259":0,"262":0,"266":0,"268":0,"274":0,"275":0,"278":0,"279":0,"281":0,"284":0,"299":0,"300":0,"301":0,"307":0,"324":0,"328":0,"329":0,"332":0,"333":0,"335":0,"336":0,"339":0,"340":0,"344":0,"348":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].functions = {"bold:91":0,"italic:102":0,"styles:120":0,"underline:149":0,"(anonymous 3):184":0,"(anonymous 4):192":0,"clean:171":0,"_cleanNode:166":0,"_execCommand:222":0,"(anonymous 5):299":0,"_getStyledAncestor:298":0,"_queryCommandValue:323":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredLines = 77;
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredFunctions = 14;
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
var ELEMENT_NODE = 1;

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

    @method _cleanNode
    @param {Node} rootNode
    @param {String|Array} properties
    @return {Node} The cleaned node
    @protected
    **/
    _cleanNode: function(rootNode, properties) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_cleanNode", 166);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 167);
var styleCommands = this.styleCommands;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 169);
properties = Y.Array(properties);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 171);
function clean(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "clean", 171);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 172);
if (ELEMENT_NODE !== node.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 173);
return;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 176);
node.get('children').each(clean);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 178);
if ('' === node.get('text')) {
                // the node is empty, remove it
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 180);
node.remove(true);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 182);
if (node !== rootNode) {
                    // clear out the properties
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 184);
Y.Array.each(properties, function(style) {
                        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 3)", 184);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 185);
node.setStyle(style, '');
                    });
                }

                // if this node doesn't have any other valid style properties
                // on it, we can unwrap it into a text node.
                // chrome likes to randomly add line-height for example.
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 192);
var hasStyles = Y.Object.some(styleCommands, function(cmd) {
                    _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 4)", 192);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 193);
return '' !== node._node.style[cmd.property];
                });

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 196);
if (!hasStyles) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 197);
var newNode = Y.Node.create(node.getHTML());
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 198);
node.replace(newNode).remove(true);
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 199);
node = newNode;
                }
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 203);
return node;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 206);
return clean(rootNode);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_execCommand", 222);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 223);
var command = this.styleCommands[name],
            range = this.selection.range(),
            parentNode, styleNode;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 227);
if (!command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 228);
return Y.Editor.Base.prototype._execCommand.call(this, name, value);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 231);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 232);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 235);
parentNode = range.parentNode();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 237);
if (ELEMENT_NODE !== parentNode.get('nodeType')) {
            // range.parentNode() may return a text node
            // so make sure we actually have an element
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 240);
parentNode = parentNode.ancestor();
        }

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
styleNode = this._cleanNode(styleNode, command.property);

        // when cleaning nodes the selection may get lost if the styleNode
        // gets unwrapped into a text node or has children unwrapped
        // so we need to rebuild the range and select it to give the
        // appearance the selection never changed
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 274);
range.startNode(styleNode);
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 275);
range.endNode(styleNode);

        // set the endOffset based on the node type
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 278);
if (ELEMENT_NODE === styleNode.get('nodeType')) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 279);
range.endOffset(styleNode.get('childNodes').size());
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 281);
range.endOffset(styleNode.get('text').length);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 284);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyledAncestor", 298);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 299);
return startNode.ancestor(function(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 5)", 299);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 300);
if (ELEMENT_NODE !== node._node.nodeType) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 301);
return false;
            }

            // don't use node.getStyle() because it will return
            // computedStyle for empty string values like `property: ""`
            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 307);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_queryCommandValue", 323);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 324);
var command = this.styleCommands[name],
            range = this.selection.range(),
            styleNode, value;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 328);
if (!command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 329);
return Y.Editor.Base.prototype._queryCommandValue.call(this, name);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 332);
if (range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 333);
styleNode = this._getStyledAncestor(range.shrink().parentNode(), command.property, true);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 335);
if (styleNode) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 336);
value = styleNode.getStyle(command.property);
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 339);
if (this.boolCommands[name]) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 340);
value = (value === command.valueOn);
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 344);
return value;
    }
});

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 348);
Y.namespace('Editor').Style = EditorStyle;

}());


}, '@VERSION@', {"requires": ["node-style", "gallery-sm-editor-base"]});
