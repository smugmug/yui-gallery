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
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].code=["YUI.add('gallery-sm-editor-style', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that normalizes style commands into css properties","","@class Editor.Style","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var EDOM = Y.Editor.DOM,","    STYLENODE = '<span></span>';","","var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} styleCommands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","        @param {Object} style","            @param {String} style.property The name of the CSS property in","            camelCase form","            @param {String} [style.value] For boolean commands, the `on` value","            of the property. eg. `bold`","    **/","    styleCommands: {","        bold: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontWeight',","                value: 'bold'","            }","        },","","        fontName: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontFamily'","            }","        },","","        fontSize: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontSize'","            }","        },","","        italic: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontStyle',","                value: 'italic'","            }","        },","","        justifyCenter: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: 'center'","            },","            type: 'block'","        },","","        justifyFull: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: 'justify'","            },","            type: 'block'","        },","","        justifyLeft: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: ''","            },","            type: 'block'","        },","","        justifyRight: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: 'right'","            },","            type: 'block'","        },","","        strikeThrough: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textDecoration',","                value: 'line-through'","            }","        },","","        underline: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textDecoration',","                value: 'underline'","            }","        }","    },","","","    /**","    Key commands related to style functionality.","","    @property {Object} styleKeyCommands","    **/","    styleKeyCommands: {","        'ctrl+b': 'bold',","        'ctrl+i': 'italic',","        'ctrl+u': 'underline'","    },","","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} supportedTags","    **/","    styleTags: 'span',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.commands = Y.merge(this.commands, this.styleCommands);","","        if (this.supportedTags) {","            this.supportedTags += ',' + this.styleTags;","        } else {","            this.supportedTags = this.styleTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);","        }","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.command(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this.query(name);","                }","            }","        }","","        return results;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Executes a `style` command by adding/removing css properties","","    @method _execStyleCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execStyleCommand: function (name, value) {","        var command = this.commands[name],","            range = this.selection.range(),","            styleNodes, style;","","        if (!range || !command || !command.style) {","            return;","        }","","        if ('block' === command.type) {","            styleNodes = this._getNodes(range, this.blockTags);","        } else {","            styleNodes = this._getStyleNodes(range);","        }","","        // use the first node because blah blah","        // dont use getStyle blah blah","        style = styleNodes.item(0)._node.style[command.style.property];","","        if (Y.Lang.isValue(command.style.value)) {","            if (style && style === command.style.value) {","                style = '';","            } else {","                style = command.style.value;","            }","        } else if (value) {","            style = command.style.value || value;","        } else {","            style = '';","        }","","        styleNodes.setStyle(command.style.property, style);","","        if ('block' !== command.type) {","            range.startNode(styleNodes.item(0));","            range.endNode(styleNodes.item(styleNodes.size() - 1), 'after');","","            this.selection.select(range.shrink());","        }","    },","","","    /**","    Parses inline elements from a given range. Partially selected nodes will","    be split and text nodes will be wrapped in `<span>` tags if necessary.","","    @method _getStyleNodes","    @param {Range} range","    @return {NodeList} NodeList of inline elements within the given `range`","    @protected","    **/","    _getStyleNodes: function (range) {","        var styleNode, styleNodes = [];","","        range.shrink();","","        // see if the range is contained in an existing styleNode","        styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);","","        if (styleNode) {","            if (range.toString() === styleNode.get('text')) {","                // the entire node is selected, just return the node","                return new Y.NodeList([styleNode]);","            }","        } else {","            styleNode = Y.Node.create(STYLENODE);","        }","","        var startNode = range.startNode(),","            startOffset = range.startOffset(),","            endNode = range.endNode(),","            endOffset = range.endOffset();","","        range.traverse(function (node) {","            if (!EDOM.isTextNode(node)) {","                return;","            }","","            if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {","                node = EDOM.split(node, endOffset).get('previousSibling');","            }","","            if (startNode === node && startOffset) {","                node = EDOM.split(node, startOffset);","            }","","            if (this._isStyleNode(node.get('parentNode'))) {","                if (node.get('nextSibling')) {","                    EDOM.split(node.get('parentNode'), node.get('nextSibling'));","                }","","                if (node.get('previousSibling')) {","                    EDOM.split(node.get('parentNode'), node);","                }","","                styleNodes.push(node.get('parentNode'));","            } else {","                styleNodes.push(node.wrap(styleNode).get('parentNode'));","            }","        }, this);","","        return new Y.NodeList(styleNodes);","    },","","","    /**","    Returns the value of a `style` command by querying css properties","","    @method _queryStyleCommand","    @param {String} name Command name.","    @return {Boolean|String} Boolean style commands will return true/false, other commands will","    return the property value, or null if the property doesnt exist.","    @protected","    **/","    _queryStyleCommand: function (name) {","        var command = this.commands[name],","            range = this.selection.range().clone(),","            selector = 'span', values = [], value;","","        if (range && command.style) {","            if ('block' === command.type) {","                selector = this.blockTags;","            }","","            this._getNodes(range, selector).each(function (node) {","                var value;","","                if (command.style.computed) {","                    value = node.getStyle(command.style.property);","                } else {","                    value = node._node.style[command.style.property];","                }","","                values.push(value || '');","            });","","            values = Y.Array.dedupe(values);","","            if (1 === values.length) {","                value = values[0];","            }","","            if (Y.Lang.isValue(command.style.value)) {","                value = (value == command.style.value);","            } else if ('' === value) {","                value = null;","            }","        }","","        return value;","    }","});","","Y.namespace('Editor').Style = EditorStyle;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"gallery-sm-editor-queue\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].lines = {"1":0,"21":0,"23":0,"26":0,"163":0,"165":0,"166":0,"168":0,"171":0,"172":0,"193":0,"196":0,"197":0,"198":0,"199":0,"203":0,"205":0,"206":0,"207":0,"212":0,"227":0,"231":0,"232":0,"235":0,"236":0,"238":0,"243":0,"245":0,"246":0,"247":0,"249":0,"251":0,"252":0,"254":0,"257":0,"259":0,"260":0,"261":0,"263":0,"278":0,"280":0,"283":0,"285":0,"286":0,"288":0,"291":0,"294":0,"299":0,"300":0,"301":0,"304":0,"305":0,"308":0,"309":0,"312":0,"313":0,"314":0,"317":0,"318":0,"321":0,"323":0,"327":0,"341":0,"345":0,"346":0,"347":0,"350":0,"351":0,"353":0,"354":0,"356":0,"359":0,"362":0,"364":0,"365":0,"368":0,"369":0,"370":0,"371":0,"375":0,"379":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].functions = {"initializer:162":0,"styles:192":0,"_execStyleCommand:226":0,"(anonymous 3):299":0,"_getStyleNodes:277":0,"(anonymous 4):350":0,"_queryStyleCommand:340":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredLines = 81;
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredFunctions = 9;
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
(function () {

_yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 2)", 21);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 23);
var EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 26);
var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of style commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} styleCommands
        @param {Function|String} commandFn
        @param {Function|String} [queryFn]
        @param {Object} style
            @param {String} style.property The name of the CSS property in
            camelCase form
            @param {String} [style.value] For boolean commands, the `on` value
            of the property. eg. `bold`
    **/
    styleCommands: {
        bold: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontWeight',
                value: 'bold'
            }
        },

        fontName: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontFamily'
            }
        },

        fontSize: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontSize'
            }
        },

        italic: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'fontStyle',
                value: 'italic'
            }
        },

        justifyCenter: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: 'center'
            },
            type: 'block'
        },

        justifyFull: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: 'justify'
            },
            type: 'block'
        },

        justifyLeft: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: ''
            },
            type: 'block'
        },

        justifyRight: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textAlign',
                value: 'right'
            },
            type: 'block'
        },

        strikeThrough: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textDecoration',
                value: 'line-through'
            }
        },

        underline: {
            commandFn: '_execStyleCommand',
            queryFn: '_queryStyleCommand',
            style: {
                property: 'textDecoration',
                value: 'underline'
            }
        }
    },


    /**
    Key commands related to style functionality.

    @property {Object} styleKeyCommands
    **/
    styleKeyCommands: {
        'ctrl+b': 'bold',
        'ctrl+i': 'italic',
        'ctrl+u': 'underline'
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} supportedTags
    **/
    styleTags: 'span',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "initializer", 162);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 163);
this.commands = Y.merge(this.commands, this.styleCommands);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 165);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 166);
this.supportedTags += ',' + this.styleTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 168);
this.supportedTags = this.styleTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 171);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 172);
this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);
        }
    },


    // -- Public Methods -------------------------------------------------------

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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "styles", 192);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 193);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 196);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 197);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 198);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 199);
results[name] = this.command(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 203);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 205);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 206);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 207);
results[name] = this.query(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 212);
return results;
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Executes a `style` command by adding/removing css properties

    @method _execStyleCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execStyleCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_execStyleCommand", 226);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 227);
var command = this.commands[name],
            range = this.selection.range(),
            styleNodes, style;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 231);
if (!range || !command || !command.style) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 232);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 235);
if ('block' === command.type) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 236);
styleNodes = this._getNodes(range, this.blockTags);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 238);
styleNodes = this._getStyleNodes(range);
        }

        // use the first node because blah blah
        // dont use getStyle blah blah
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 243);
style = styleNodes.item(0)._node.style[command.style.property];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 245);
if (Y.Lang.isValue(command.style.value)) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 246);
if (style && style === command.style.value) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 247);
style = '';
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 249);
style = command.style.value;
            }
        } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 251);
if (value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 252);
style = command.style.value || value;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 254);
style = '';
        }}

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 257);
styleNodes.setStyle(command.style.property, style);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 259);
if ('block' !== command.type) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 260);
range.startNode(styleNodes.item(0));
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 261);
range.endNode(styleNodes.item(styleNodes.size() - 1), 'after');

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 263);
this.selection.select(range.shrink());
        }
    },


    /**
    Parses inline elements from a given range. Partially selected nodes will
    be split and text nodes will be wrapped in `<span>` tags if necessary.

    @method _getStyleNodes
    @param {Range} range
    @return {NodeList} NodeList of inline elements within the given `range`
    @protected
    **/
    _getStyleNodes: function (range) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyleNodes", 277);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 278);
var styleNode, styleNodes = [];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 280);
range.shrink();

        // see if the range is contained in an existing styleNode
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 283);
styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 285);
if (styleNode) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 286);
if (range.toString() === styleNode.get('text')) {
                // the entire node is selected, just return the node
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 288);
return new Y.NodeList([styleNode]);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 291);
styleNode = Y.Node.create(STYLENODE);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 294);
var startNode = range.startNode(),
            startOffset = range.startOffset(),
            endNode = range.endNode(),
            endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 299);
range.traverse(function (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 3)", 299);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 300);
if (!EDOM.isTextNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 301);
return;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 304);
if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 305);
node = EDOM.split(node, endOffset).get('previousSibling');
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 308);
if (startNode === node && startOffset) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 309);
node = EDOM.split(node, startOffset);
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 312);
if (this._isStyleNode(node.get('parentNode'))) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 313);
if (node.get('nextSibling')) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 314);
EDOM.split(node.get('parentNode'), node.get('nextSibling'));
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 317);
if (node.get('previousSibling')) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 318);
EDOM.split(node.get('parentNode'), node);
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 321);
styleNodes.push(node.get('parentNode'));
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 323);
styleNodes.push(node.wrap(styleNode).get('parentNode'));
            }
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 327);
return new Y.NodeList(styleNodes);
    },


    /**
    Returns the value of a `style` command by querying css properties

    @method _queryStyleCommand
    @param {String} name Command name.
    @return {Boolean|String} Boolean style commands will return true/false, other commands will
    return the property value, or null if the property doesnt exist.
    @protected
    **/
    _queryStyleCommand: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_queryStyleCommand", 340);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 341);
var command = this.commands[name],
            range = this.selection.range().clone(),
            selector = 'span', values = [], value;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 345);
if (range && command.style) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 346);
if ('block' === command.type) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 347);
selector = this.blockTags;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 350);
this._getNodes(range, selector).each(function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 4)", 350);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 351);
var value;

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 353);
if (command.style.computed) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 354);
value = node.getStyle(command.style.property);
                } else {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 356);
value = node._node.style[command.style.property];
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 359);
values.push(value || '');
            });

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 362);
values = Y.Array.dedupe(values);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 364);
if (1 === values.length) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 365);
value = values[0];
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 368);
if (Y.Lang.isValue(command.style.value)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 369);
value = (value == command.style.value);
            } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 370);
if ('' === value) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 371);
value = null;
            }}
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 375);
return value;
    }
});

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 379);
Y.namespace('Editor').Style = EditorStyle;

}());


}, '@VERSION@', {
    "requires": [
        "gallery-sm-editor-base",
        "gallery-sm-editor-dom",
        "gallery-sm-editor-keys",
        "gallery-sm-editor-queue",
        "node-style"
    ]
});
