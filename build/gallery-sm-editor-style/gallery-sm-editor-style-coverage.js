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
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].code=["YUI.add('gallery-sm-editor-style', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that normalizes style commands into css properties","","@class Editor.Style","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var doc = Y.config.doc,","    EDOM = Y.Editor.DOM,","    STYLENODE = '<span></span>';","","var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} styleCommands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","        @param {Object} style","            @param {String} style.property The name of the CSS property in","            camelCase form","            @param {String} [style.value] For boolean commands, the `on` value","            of the property. eg. `bold`","    **/","    styleCommands: {","        bold: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontWeight',","                value: 'bold'","            }","        },","","        fontName: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontFamily'","            }","        },","","        fontSize: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontSize'","            }","        },","","        italic: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'fontStyle',","                value: 'italic'","            }","        },","","        justifyCenter: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: 'center'","            },","            type: 'block'","        },","","        justifyFull: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: 'justify'","            },","            type: 'block'","        },","","        justifyLeft: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: ''","            },","            type: 'block'","        },","","        justifyRight: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textAlign',","                value: 'right'","            },","            type: 'block'","        },","","        strikeThrough: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textDecoration',","                value: 'line-through'","            }","        },","","        underline: {","            commandFn: '_execStyleCommand',","            queryFn: '_queryStyleCommand',","            style: {","                property: 'textDecoration',","                value: 'underline'","            }","        }","    },","","","    /**","    Key commands related to style functionality.","","    @property {Object} styleKeyCommands","    **/","    styleKeyCommands: {","        'ctrl+b': 'bold',","        'ctrl+i': 'italic',","        'ctrl+u': 'underline'","    },","","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} supportedTags","    **/","    styleTags: 'span',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.commands = Y.merge(this.commands, this.styleCommands);","","        if (this.supportedTags) {","            this.supportedTags += ',' + this.styleTags;","        } else {","            this.supportedTags = this.styleTags;","        }","","        this.supportedStyles = [];","","        Y.Object.each(this.styleCommands, function (cmd) {","            this.supportedStyles.push(cmd.style.property);","        }, this);","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);","        }","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.command(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this.query(name);","                }","            }","        }","","        return results;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Executes a `style` command by adding/removing css properties","","    @method _execStyleCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execStyleCommand: function (name, value) {","        var command = this.commands[name],","            range = this.selection.range(),","            styleNodes, style;","","        if (!range || !command || !command.style) {","            return;","        }","","        if ('block' === command.type) {","            styleNodes = this._getNodes(range, this.blockTags);","        } else {","            styleNodes = this._getStyleNodes(range);","        }","","        // use the first node because blah blah","        // dont use getStyle blah blah","        style = styleNodes.item(0)._node.style[command.style.property];","","        if (Y.Lang.isValue(command.style.value)) {","            if (style && style === command.style.value) {","                style = '';","            } else {","                style = command.style.value;","            }","        } else if (value) {","            style = command.style.value || value;","        } else {","            style = '';","        }","","        styleNodes.setStyle(command.style.property, style);","","        if ('block' !== command.type) {","            range.startNode(styleNodes.item(0));","            range.endNode(styleNodes.item(styleNodes.size() - 1), 'after');","","            this.selection.select(range.shrink());","        }","    },","","","    /**","    Reformats html to the proper style","","    TODO: put this in its own extension.  doesnt belong here.","","    <span>blah blah</span>","    @param {HTML} html HTML string to format","    @return {Node} Node instance containing a document fragment with the","        formatted _html_","    @protected","    **/","    _formatHTML: function (html) {","        function flatten (node) {","            var childNodes = node.get('childNodes')._nodes;","","            Y.Array.each(childNodes.reverse(), function (node) {","                var parentNode;","","                node = Y.one(node);","                parentNode = node.get('parentNode');","","                if (EDOM.isTextNode(node)) {","                    if (this._isBlockNode(parentNode)) {","                        node.wrap(STYLENODE);","                    } else if (node.get('previousSibling')) {","                        EDOM.split(parentNode, node);","                    }","                } else {","                    // TODO: replace b, em, i, strong, u nodes with spans","                    if (!node.test(this.supportedTags)) {","                        node.replace(node.get('text'));","                    } else if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {","                        parentNode.insert(node, 'after');","","                        if (!this._isBlockNode(node)) {","                            node.addClass(parentNode.get('className'));","","                            EDOM.copyStyles(parentNode, node, this.supportedStyles, {","                                explicit: true,","                                overwrite: false","                            });","                        }","                    } else {","                        // TODO: clear styles on containers","                    }","","                    flatten.call(this, node);","","                    if (EDOM.isEmptyNode(node)) {","                        node.remove(true);","                    }","","                    node.removeAttribute('id');","                }","            }, this);","        }","","        var frag = Y.one(doc.createDocumentFragment()).setHTML(html);","","        flatten.call(this, frag);","","        return frag;","    },","","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        value = Y.Editor.Base.prototype._getHTML.call(this, value);","","        return this.get('formatFn')(value).getHTML();","    },","","","    /**","    Parses inline elements from a given range. Partially selected nodes will","    be split and text nodes will be wrapped in `<span>` tags if necessary.","","    @method _getStyleNodes","    @param {Range} range","    @return {NodeList} NodeList of inline elements within the given `range`","    @protected","    **/","    _getStyleNodes: function (range) {","        var styleNode, styleNodes = [];","","        range.shrink();","","        // see if the range is contained in an existing styleNode","        styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);","","        if (styleNode) {","            if (range.toString() === styleNode.get('text')) {","                // the entire node is selected, just return the node","                return new Y.NodeList([styleNode]);","            }","        } else {","            styleNode = Y.Node.create(STYLENODE);","        }","","        var startNode = range.startNode(),","            startOffset = range.startOffset(),","            endNode = range.endNode(),","            endOffset = range.endOffset();","","        range.traverse(function (node) {","            if (!EDOM.isTextNode(node)) {","                return;","            }","","            if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {","                node = EDOM.split(node, endOffset).get('previousSibling');","            }","","            if (startNode === node && startOffset) {","                node = EDOM.split(node, startOffset);","            }","","            if (this._isStyleNode(node.get('parentNode'))) {","                if (node.get('nextSibling')) {","                    EDOM.split(node.get('parentNode'), node.get('nextSibling'));","                }","","                if (node.get('previousSibling')) {","                    EDOM.split(node.get('parentNode'), node);","                }","","                styleNodes.push(node.get('parentNode'));","            } else {","                styleNodes.push(node.wrap(styleNode).get('parentNode'));","            }","        }, this);","","        return new Y.NodeList(styleNodes);","    },","","","    /**","    Returns true if the given node is a container element, false otherwise","    A container element is defined as a non-inline element","","    @method _isBlockNode","    @param {HTMLNode|Node} node","    @return {Boolean} true if the given node is a container element, false otherwise","    @protected","    **/","    _isBlockNode: function (node) {","        node = Y.one(node);","","        // isElementNode() will exclude document fragments, which are valid","        // containers, use !isTextNode() instead","        return !EDOM.isTextNode(node) && (node.get('nodeName') === '#document-fragment' || node.test(this.blockTags));","    },","","","    /**","    Returns true if the given node is an inline element node, false otherwise","","    @method _isStyleNode","    @param {HTMLNode|Node} node","    @return {Boolean} true if the given node is an inline element node, false otherwise","    @protected","    **/","    _isStyleNode: function (node) {","        node = Y.one(node);","","        return node && !EDOM.isTextNode(node) && node.test(this.styleTags);","    },","","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        value = this.get('formatFn')(value).getHTML();","","        return Y.Editor.Base.prototype._setHTML.call(this, value);","    },","","","    /**","    Returns the value of a `style` command by querying css properties","","    @method _queryStyleCommand","    @param {String} name Command name.","    @return {Boolean|String} Boolean style commands will return true/false, other commands will","    return the property value, or null if the property doesnt exist.","    @protected","    **/","    _queryStyleCommand: function (name) {","        var command = this.commands[name],","            range = this.selection.range().clone(),","            selector = 'span', values = [], value;","","        if (range && command.style) {","            if ('block' === command.type) {","                selector = this.blockTags;","            }","","            this._getNodes(range, selector).each(function (node) {","                var value;","","                if (command.style.computed) {","                    value = node.getStyle(command.style.property);","                } else {","                    value = node._node.style[command.style.property];","                }","","                values.push(value || '');","            });","","            values = Y.Array.dedupe(values);","","            if (1 === values.length) {","                value = values[0];","            }","","            if (Y.Lang.isValue(command.style.value)) {","                value = (value == command.style.value);","            } else if ('' === value) {","                value = null;","            }","        }","","        return value;","    }","","    // -- Protected Event Handlers ---------------------------------------------","","}, {","    ATTRS: {","        /**","        Function for formatting editor html","","        One day allow custom formatting. Today is not that day.","        **/","        formatFn: {","            readOnly: true,","            setter: function (val) {","                return Y.bind(val, this);","            },","            validator: Y.Lang.isFunction,","            valueFn: function () {","                return this._formatHTML;","            }","        }","    }","});","","Y.namespace('Editor').Style = EditorStyle;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"gallery-sm-editor-queue\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].lines = {"1":0,"21":0,"23":0,"27":0,"164":0,"166":0,"167":0,"169":0,"172":0,"174":0,"175":0,"178":0,"179":0,"200":0,"203":0,"204":0,"205":0,"206":0,"210":0,"212":0,"213":0,"214":0,"219":0,"234":0,"238":0,"239":0,"242":0,"243":0,"245":0,"250":0,"252":0,"253":0,"254":0,"256":0,"258":0,"259":0,"261":0,"264":0,"266":0,"267":0,"268":0,"270":0,"287":0,"288":0,"290":0,"291":0,"293":0,"294":0,"296":0,"297":0,"298":0,"299":0,"300":0,"304":0,"305":0,"306":0,"307":0,"309":0,"310":0,"312":0,"321":0,"323":0,"324":0,"327":0,"332":0,"334":0,"336":0,"349":0,"351":0,"365":0,"367":0,"370":0,"372":0,"373":0,"375":0,"378":0,"381":0,"386":0,"387":0,"388":0,"391":0,"392":0,"395":0,"396":0,"399":0,"400":0,"401":0,"404":0,"405":0,"408":0,"410":0,"414":0,"428":0,"432":0,"445":0,"447":0,"460":0,"462":0,"476":0,"480":0,"481":0,"482":0,"485":0,"486":0,"488":0,"489":0,"491":0,"494":0,"497":0,"499":0,"500":0,"503":0,"504":0,"505":0,"506":0,"510":0,"525":0,"529":0,"535":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].functions = {"(anonymous 3):174":0,"initializer:163":0,"styles:199":0,"_execStyleCommand:233":0,"(anonymous 4):290":0,"flatten:287":0,"_formatHTML:286":0,"_getHTML:348":0,"(anonymous 5):386":0,"_getStyleNodes:364":0,"_isBlockNode:427":0,"_isStyleNode:444":0,"_setHTML:459":0,"(anonymous 6):485":0,"_queryStyleCommand:475":0,"setter:524":0,"valueFn:528":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredLines = 119;
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredFunctions = 19;
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
var doc = Y.config.doc,
    EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 27);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "initializer", 163);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 164);
this.commands = Y.merge(this.commands, this.styleCommands);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 166);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 167);
this.supportedTags += ',' + this.styleTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 169);
this.supportedTags = this.styleTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 172);
this.supportedStyles = [];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 174);
Y.Object.each(this.styleCommands, function (cmd) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 3)", 174);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 175);
this.supportedStyles.push(cmd.style.property);
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 178);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 179);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "styles", 199);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 200);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 203);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 204);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 205);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 206);
results[name] = this.command(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 210);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 212);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 213);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 214);
results[name] = this.query(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 219);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_execStyleCommand", 233);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 234);
var command = this.commands[name],
            range = this.selection.range(),
            styleNodes, style;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 238);
if (!range || !command || !command.style) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 239);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 242);
if ('block' === command.type) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 243);
styleNodes = this._getNodes(range, this.blockTags);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 245);
styleNodes = this._getStyleNodes(range);
        }

        // use the first node because blah blah
        // dont use getStyle blah blah
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 250);
style = styleNodes.item(0)._node.style[command.style.property];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 252);
if (Y.Lang.isValue(command.style.value)) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 253);
if (style && style === command.style.value) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 254);
style = '';
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 256);
style = command.style.value;
            }
        } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 258);
if (value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 259);
style = command.style.value || value;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 261);
style = '';
        }}

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 264);
styleNodes.setStyle(command.style.property, style);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 266);
if ('block' !== command.type) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 267);
range.startNode(styleNodes.item(0));
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 268);
range.endNode(styleNodes.item(styleNodes.size() - 1), 'after');

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 270);
this.selection.select(range.shrink());
        }
    },


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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_formatHTML", 286);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 287);
function flatten (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "flatten", 287);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 288);
var childNodes = node.get('childNodes')._nodes;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 290);
Y.Array.each(childNodes.reverse(), function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 4)", 290);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 291);
var parentNode;

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 293);
node = Y.one(node);
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 294);
parentNode = node.get('parentNode');

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 296);
if (EDOM.isTextNode(node)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 297);
if (this._isBlockNode(parentNode)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 298);
node.wrap(STYLENODE);
                    } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 299);
if (node.get('previousSibling')) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 300);
EDOM.split(parentNode, node);
                    }}
                } else {
                    // TODO: replace b, em, i, strong, u nodes with spans
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 304);
if (!node.test(this.supportedTags)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 305);
node.replace(node.get('text'));
                    } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 306);
if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 307);
parentNode.insert(node, 'after');

                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 309);
if (!this._isBlockNode(node)) {
                            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 310);
node.addClass(parentNode.get('className'));

                            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 312);
EDOM.copyStyles(parentNode, node, this.supportedStyles, {
                                explicit: true,
                                overwrite: false
                            });
                        }
                    } else {
                        // TODO: clear styles on containers
                    }}

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 321);
flatten.call(this, node);

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 323);
if (EDOM.isEmptyNode(node)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 324);
node.remove(true);
                    }

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 327);
node.removeAttribute('id');
                }
            }, this);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 332);
var frag = Y.one(doc.createDocumentFragment()).setHTML(html);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 334);
flatten.call(this, frag);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 336);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getHTML", 348);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 349);
value = Y.Editor.Base.prototype._getHTML.call(this, value);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 351);
return this.get('formatFn')(value).getHTML();
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyleNodes", 364);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 365);
var styleNode, styleNodes = [];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 367);
range.shrink();

        // see if the range is contained in an existing styleNode
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 370);
styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 372);
if (styleNode) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 373);
if (range.toString() === styleNode.get('text')) {
                // the entire node is selected, just return the node
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 375);
return new Y.NodeList([styleNode]);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 378);
styleNode = Y.Node.create(STYLENODE);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 381);
var startNode = range.startNode(),
            startOffset = range.startOffset(),
            endNode = range.endNode(),
            endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 386);
range.traverse(function (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 5)", 386);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 387);
if (!EDOM.isTextNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 388);
return;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 391);
if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 392);
node = EDOM.split(node, endOffset).get('previousSibling');
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 395);
if (startNode === node && startOffset) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 396);
node = EDOM.split(node, startOffset);
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 399);
if (this._isStyleNode(node.get('parentNode'))) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 400);
if (node.get('nextSibling')) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 401);
EDOM.split(node.get('parentNode'), node.get('nextSibling'));
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 404);
if (node.get('previousSibling')) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 405);
EDOM.split(node.get('parentNode'), node);
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 408);
styleNodes.push(node.get('parentNode'));
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 410);
styleNodes.push(node.wrap(styleNode).get('parentNode'));
            }
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 414);
return new Y.NodeList(styleNodes);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_isBlockNode", 427);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 428);
node = Y.one(node);

        // isElementNode() will exclude document fragments, which are valid
        // containers, use !isTextNode() instead
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 432);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_isStyleNode", 444);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 445);
node = Y.one(node);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 447);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_setHTML", 459);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 460);
value = this.get('formatFn')(value).getHTML();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 462);
return Y.Editor.Base.prototype._setHTML.call(this, value);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_queryStyleCommand", 475);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 476);
var command = this.commands[name],
            range = this.selection.range().clone(),
            selector = 'span', values = [], value;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 480);
if (range && command.style) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 481);
if ('block' === command.type) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 482);
selector = this.blockTags;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 485);
this._getNodes(range, selector).each(function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 6)", 485);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 486);
var value;

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 488);
if (command.style.computed) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 489);
value = node.getStyle(command.style.property);
                } else {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 491);
value = node._node.style[command.style.property];
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 494);
values.push(value || '');
            });

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 497);
values = Y.Array.dedupe(values);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 499);
if (1 === values.length) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 500);
value = values[0];
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 503);
if (Y.Lang.isValue(command.style.value)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 504);
value = (value == command.style.value);
            } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 505);
if ('' === value) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 506);
value = null;
            }}
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 510);
return value;
    }

    // -- Protected Event Handlers ---------------------------------------------

}, {
    ATTRS: {
        /**
        Function for formatting editor html

        One day allow custom formatting. Today is not that day.
        **/
        formatFn: {
            readOnly: true,
            setter: function (val) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "setter", 524);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 525);
return Y.bind(val, this);
            },
            validator: Y.Lang.isFunction,
            valueFn: function () {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "valueFn", 528);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 529);
return this._formatHTML;
            }
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 535);
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
