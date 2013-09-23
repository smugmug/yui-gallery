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
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].code=["YUI.add('gallery-sm-editor-style', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that normalizes style commands into css properties","","@class Editor.Style","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var doc = Y.config.doc,","    win = Y.config.win,","    EDOM = Y.Editor.DOM,","    STYLENODE = '<span></span>';","","var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} styleCommands","        @param {String} property The name of the CSS property in camelCase form","        @param {String} [value] For boolean commands, the `on` value of the","        property. eg. `bold`","    **/","    styleCommands: {","        bold: {","            property: 'fontWeight',","            value: 'bold'","        },","","        fontName: {","            property: 'fontFamily'","        },","","        fontSize: {","            property: 'fontSize'","        },","","        italic: {","            property: 'fontStyle',","            value: 'italic'","        },","","        underline: {","            property: 'textDecoration',","            value: 'underline'","        }","    },","","","    /**","    Key commands related to style functionality.","","    @property {Object} styleKeyCommands","    **/","    styleKeyCommands: {","//        'backspace':  {fn: '_afterDelete', allowDefault: true, async: true},","//        'delete':     {fn: '_afterDelete', allowDefault: true, async: true}","    },","","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} supportedTags","    **/","    styleTags: 'span',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        if (this.supportedTags) {","            this.supportedTags += ',' + this.styleTags;","        } else {","            this.supportedTags = this.styleTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);","        }","","        this._attachStyleEvents();","    },","","    destructor: function () {","        this._detachStyleEvents();","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Bolds or unbolds the current selection.","","    @method bold","    @chainable","    **/","    bold: function () {","        this.command('bold', 'toggle');","        return this;","    },","","","    /**","    Italicizes or unitalicizes the current selection.","","    @method italic","    @chainable","    **/","    italic: function () {","        this.command('italic', 'toggle');","        return this;","    },","","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.command(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    /**","    Toggles underline on the current selection.","","    @method underline","    @chainable","    **/","    underline: function () {","        this.command('underline', 'toggle');","        return this;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches style events.","","    @method _attachStyleEvents","    @protected","    **/","    _attachStyleEvents: function () {","        if (this._styleEvents) {","            return;","        }","","        this._styleEvents = [","            Y.Do.before(this._styleBeforeExecCommand, this, '_execCommand', this),","            Y.Do.before(this._styleBeforeQueryCommand, this, '_queryCommandValue', this)","        ];","    },","","","    /**","    Detaches style events.","","    @method _detachStyleEvents","    @protected","    **/","    _detachStyleEvents: function () {","        if (this._styleEvents) {","            new Y.EventHandle(this._styleEvents).detach();","            this._styleEvents = null;","        }","    },","","","    /**","    Duckpunch Editor.Base._execCommand to build css styled nodes instead of","    relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands` or `this.blockCommands`","","    @method _execStyleCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execStyleCommand: function (name, value) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            styleNodes, style;","","        if (!range || !command) {","            return;","        }","","        styleNodes = this._getStyleNodes(range);","","        // use the first node because blah blah","        // dont use getStyle blah blah","        style = styleNodes.item(0)._node.style[command.property];","","        if (this.boolCommands[name] && 'toggle' === value) {","            if (style && '' !== style) {","                style = '';","            } else {","                style = command.value;","            }","        } else if (value) {","            style = command.value || value;","        } else {","            style = '';","        }","","        styleNodes.setStyle(command.property, style);","    },","","","    /**","    Reformats html to the proper style","","    TODO: put this in its own extension.  doesnt belong here.","","    <span>blah blah</span>","    @param {HTML} html HTML string to format","    @return {Node} Node instance containing a document fragment with the","        formatted _html_","    @protected","    **/","    _formatHTML: function (html) {","        function flatten (node) {","            var childNodes = node.get('childNodes')._nodes;","","            Y.Array.each(childNodes.reverse(), function (node) {","                var parentNode;","","                node = Y.one(node);","                parentNode = node.get('parentNode');","","                if (EDOM.isTextNode(node)) {","                    if (this._isBlockNode(parentNode)) {","                        node.wrap(STYLENODE);","                    } else if (node.get('previousSibling')) {","                        EDOM.split(parentNode, node);","                    }","                } else {","                    // TODO: replace b, em, i, strong, u nodes with spans","                    if (!node.test(this.supportedTags)) {","                        node.replace(node.get('text'));","                    } else if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {","                        parentNode.insert(node, 'after');","","                        if (!this._isBlockNode(node)) {","                            node.addClass(parentNode.get('className'));","","                            EDOM.copyStyles(parentNode, node, supportedStyles, {","                                explicit: true,","                                overwrite: false","                            });","                        }","                    } else {","                        // TODO: clear styles on containers","                    }","","                    flatten.call(this, node);","","                    if (EDOM.isEmptyNode(node)) {","                        node.remove(true);","                    }","","                    node.removeAttribute('id');","                }","            }, this);","        }","","        var frag, supportedStyles = [], supportedTags = this.supportedTags;","","        Y.Object.each(this.styleCommands, function (cmd) {","            supportedStyles.push(cmd.property);","        });","","        frag = Y.one(doc.createDocumentFragment()).setHTML(html);","","        flatten.call(this, frag);","","        return frag;","    },","","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        value = Y.Editor.Base.prototype._getHTML.call(this, value);","","        return this.get('formatFn')(value).getHTML();","    },","","","    /**","    Walks the ancestor tree of a given node until a node that has","    the css property set is found","","    @method _getStyledAncestor","    @param {Node} startNode","    @param {String} property","    @return {Node} The node having `property` set, or null if no node was found","    @protected","    **/","    _getStyledAncestor: function (startNode, property) {","        return startNode.ancestor(function (node) {","            if (!EDOM.isElementNode(node)) {","                return false;","            }","","            // don't use node.getStyle() because it will return","            // computedStyle for empty string values like `property: \"\"`","            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106","            return !!node._node.style[property];","        }, true, this.selectors.input);","    },","","","    /**","    Parses inline elements from a given range. Partially selected nodes will","    be split and text nodes will be wrapped in `<span>` tags if necessary.","","    @method _getStyleNodes","    @param {Range} range","    @return {NodeList} NodeList of inline elements within the given `range`","    @protected","    **/","    _getStyleNodes: function (range) {","        var styleNode, styleNodes = [];","","        range.shrink();","","        // see if the range is contained in an existing styleNode","        styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);","","        if (styleNode) {","            if (range.toString() === styleNode.get('text')) {","                // the entire node is selected, just return the node","                return new Y.NodeList([styleNode]);","            }","        } else {","            styleNode = Y.Node.create(STYLENODE);","        }","","        var startNode = range.startNode(),","            startOffset = range.startOffset(),","            endNode = range.endNode(),","            endOffset = range.endOffset();","","        range.traverse(function (node) {","            if (!EDOM.isTextNode(node)) {","                return;","            }","","            if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {","                node = EDOM.split(node, endOffset).get('previousSibling');","            }","","            if (startNode === node && startOffset) {","                node = EDOM.split(node, startOffset);","            }","","            if (this._isStyleNode(node.get('parentNode'))) {","                if (node.get('nextSibling')) {","                    EDOM.split(node.get('parentNode'), node.get('nextSibling'));","                }","","                if (node.get('previousSibling')) {","                    EDOM.split(node.get('parentNode'), node);","                }","","                styleNodes.push(node.get('parentNode'));","            } else {","                styleNodes.push(node.wrap(styleNode).get('parentNode'));","            }","        }, this);","","        return new Y.NodeList(styleNodes);","    },","","","    /**","    Returns true if the given node is a container element, false otherwise","    A container element is defined as a non-inline element","","    @method _isBlockNode","    @param {HTMLNode|Node} node","    @return {Boolean} true if the given node is a container element, false otherwise","    @protected","    **/","    _isBlockNode: function (node) {","        node = Y.one(node);","","        // isElementNode() will exclude document fragments, which are valid","        // containers, use !isTextNode() instead","        return !EDOM.isTextNode(node) && (node.get('nodeName') === '#document-fragment' || node.test(this.blockTags));","    },","","","    /**","    Returns true if the given node is an inline element node, false otherwise","","    @method _isStyleNode","    @param {HTMLNode|Node} node","    @return {Boolean} true if the given node is an inline element node, false otherwise","    @protected","    **/","    _isStyleNode: function (node) {","        node = Y.one(node);","","        return node && !EDOM.isTextNode(node) && node.test(this.styleTags);","    },","","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        value = this.get('formatFn')(value).getHTML();","","        return Y.Editor.Base.prototype._setHTML.call(this, value);","    },","","","    /**","    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes","    instead of relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _queryStyleCommand","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryStyleCommand: function (name) {","        var command = this.styleCommands[name],","            range = this.selection.range().clone(),","            parentNode, styleNode, value;","","        if (range) {","            parentNode = range.shrink().parentNode();","","            // first attempt to get any explicitly styled ancestor for","            // the given property. Need to do this first because browsers","            // sometimes return different values for explicit style vs.","            // computed style. `font-weight: bold;` for example will return","            // `bold` in all browsers when explicitly set but `700` in","            // Firefox and Internet Explorer with computedStyle.","            styleNode = this._getStyledAncestor(parentNode, command.property);","","            if (!styleNode) {","                // no explicitly styled ancestor found. walk the","                // ancestor tree to find the closest element","                // node ancestor, inclusive of the parentNode","                styleNode = parentNode.ancestor(EDOM.isElementNode, true);","            }","","            // getStyle will fall back to computedStyle if the","            // property isn't explicitly set","            value = styleNode.getStyle(command.property);","        }","","        if (this.boolCommands[name]) {","            value = (value === command.value);","        } else if ('' === value) {","            value = null;","        }","","        return value;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `delete` events on the editor","","    @method _afterDelete","    @protected","    **/","    _afterDelete: function () {","        this._clearCommandQueue();","        this._updateSelection({force: true});","    },","","","    /**","    AOP wrapper for `Editor.Base#_execCommand()`.","","    @method _styleBeforeExecCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _styleBeforeExecCommand: function (name, value) {","        if (this.styleCommands[name]) {","            var ret = this._execStyleCommand(name, value);","            return new Y.Do.Halt('Editor.Style prevented _execCommand', ret);","        }","    },","","","    /**","    AOP wrapper for `Editor.Base#_queryCommand()`.","","    @method _styleBeforeQueryCommand","    @param {String} name Command name.","    @protected","    **/","    _styleBeforeQueryCommand: function (name) {","        if (this.styleCommands[name]) {","            var ret = this._queryStyleCommand(name);","            return new Y.Do.Halt('Editor.Style prevented _queryCommand', ret);","        }","    }","}, {","    ATTRS: {","        /**","        Function for formatting editor html","","        One day allow custom formatting. Today is not that day.","        **/","        formatFn: {","            readOnly: true,","            setter: function (val) {","                return Y.bind(val, this);","            },","            validator: Y.Lang.isFunction,","            valueFn: function () {","                return this._formatHTML;","            }","        }","    }","});","","Y.namespace('Editor').Style = EditorStyle;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"gallery-sm-editor-queue\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].lines = {"1":0,"21":0,"23":0,"28":0,"91":0,"92":0,"94":0,"97":0,"98":0,"101":0,"105":0,"118":0,"119":0,"130":0,"131":0,"149":0,"152":0,"153":0,"154":0,"155":0,"159":0,"161":0,"162":0,"163":0,"168":0,"178":0,"179":0,"192":0,"193":0,"196":0,"210":0,"211":0,"212":0,"230":0,"234":0,"235":0,"238":0,"242":0,"244":0,"245":0,"246":0,"248":0,"250":0,"251":0,"253":0,"256":0,"272":0,"273":0,"275":0,"276":0,"278":0,"279":0,"281":0,"282":0,"283":0,"284":0,"285":0,"289":0,"290":0,"291":0,"292":0,"294":0,"295":0,"297":0,"306":0,"308":0,"309":0,"312":0,"317":0,"319":0,"320":0,"323":0,"325":0,"327":0,"340":0,"342":0,"357":0,"358":0,"359":0,"365":0,"380":0,"382":0,"385":0,"387":0,"388":0,"390":0,"393":0,"396":0,"401":0,"402":0,"403":0,"406":0,"407":0,"410":0,"411":0,"414":0,"415":0,"416":0,"419":0,"420":0,"423":0,"425":0,"429":0,"443":0,"447":0,"460":0,"462":0,"475":0,"477":0,"494":0,"498":0,"499":0,"507":0,"509":0,"513":0,"518":0,"521":0,"522":0,"523":0,"524":0,"527":0,"539":0,"540":0,"553":0,"554":0,"555":0,"568":0,"569":0,"570":0,"583":0,"587":0,"593":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].functions = {"initializer:90":0,"destructor:104":0,"bold:117":0,"italic:129":0,"styles:148":0,"underline:177":0,"_attachStyleEvents:191":0,"_detachStyleEvents:209":0,"_execStyleCommand:229":0,"(anonymous 3):275":0,"flatten:272":0,"(anonymous 4):319":0,"_formatHTML:271":0,"_getHTML:339":0,"(anonymous 5):357":0,"_getStyledAncestor:356":0,"(anonymous 6):401":0,"_getStyleNodes:379":0,"_isBlockNode:442":0,"_isStyleNode:459":0,"_setHTML:474":0,"_queryStyleCommand:493":0,"_afterDelete:538":0,"_styleBeforeExecCommand:552":0,"_styleBeforeQueryCommand:567":0,"setter:582":0,"valueFn:586":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredLines = 132;
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredFunctions = 29;
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
    win = Y.config.win,
    EDOM = Y.Editor.DOM,
    STYLENODE = '<span></span>';

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 28);
var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of style commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} styleCommands
        @param {String} property The name of the CSS property in camelCase form
        @param {String} [value] For boolean commands, the `on` value of the
        property. eg. `bold`
    **/
    styleCommands: {
        bold: {
            property: 'fontWeight',
            value: 'bold'
        },

        fontName: {
            property: 'fontFamily'
        },

        fontSize: {
            property: 'fontSize'
        },

        italic: {
            property: 'fontStyle',
            value: 'italic'
        },

        underline: {
            property: 'textDecoration',
            value: 'underline'
        }
    },


    /**
    Key commands related to style functionality.

    @property {Object} styleKeyCommands
    **/
    styleKeyCommands: {
//        'backspace':  {fn: '_afterDelete', allowDefault: true, async: true},
//        'delete':     {fn: '_afterDelete', allowDefault: true, async: true}
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} supportedTags
    **/
    styleTags: 'span',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "initializer", 90);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 91);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 92);
this.supportedTags += ',' + this.styleTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 94);
this.supportedTags = this.styleTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 97);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 98);
this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 101);
this._attachStyleEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "destructor", 104);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 105);
this._detachStyleEvents();
    },


    // -- Public Methods -------------------------------------------------------

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "bold", 117);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 118);
this.command('bold', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 119);
return this;
    },


    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "italic", 129);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 130);
this.command('italic', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 131);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "styles", 148);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 149);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 152);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 153);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 154);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 155);
results[name] = this.command(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 159);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 161);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 162);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 163);
results[name] = this._queryCommandValue(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 168);
return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "underline", 177);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 178);
this.command('underline', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 179);
return this;
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches style events.

    @method _attachStyleEvents
    @protected
    **/
    _attachStyleEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_attachStyleEvents", 191);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 192);
if (this._styleEvents) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 193);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 196);
this._styleEvents = [
            Y.Do.before(this._styleBeforeExecCommand, this, '_execCommand', this),
            Y.Do.before(this._styleBeforeQueryCommand, this, '_queryCommandValue', this)
        ];
    },


    /**
    Detaches style events.

    @method _detachStyleEvents
    @protected
    **/
    _detachStyleEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_detachStyleEvents", 209);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 210);
if (this._styleEvents) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 211);
new Y.EventHandle(this._styleEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 212);
this._styleEvents = null;
        }
    },


    /**
    Duckpunch Editor.Base._execCommand to build css styled nodes instead of
    relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands` or `this.blockCommands`

    @method _execStyleCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execStyleCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_execStyleCommand", 229);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 230);
var command = this.styleCommands[name],
            range = this.selection.range(),
            styleNodes, style;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 234);
if (!range || !command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 235);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 238);
styleNodes = this._getStyleNodes(range);

        // use the first node because blah blah
        // dont use getStyle blah blah
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 242);
style = styleNodes.item(0)._node.style[command.property];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 244);
if (this.boolCommands[name] && 'toggle' === value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 245);
if (style && '' !== style) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 246);
style = '';
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 248);
style = command.value;
            }
        } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 250);
if (value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 251);
style = command.value || value;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 253);
style = '';
        }}

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 256);
styleNodes.setStyle(command.property, style);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_formatHTML", 271);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 272);
function flatten (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "flatten", 272);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 273);
var childNodes = node.get('childNodes')._nodes;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 275);
Y.Array.each(childNodes.reverse(), function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 3)", 275);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 276);
var parentNode;

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 278);
node = Y.one(node);
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 279);
parentNode = node.get('parentNode');

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 281);
if (EDOM.isTextNode(node)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 282);
if (this._isBlockNode(parentNode)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 283);
node.wrap(STYLENODE);
                    } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 284);
if (node.get('previousSibling')) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 285);
EDOM.split(parentNode, node);
                    }}
                } else {
                    // TODO: replace b, em, i, strong, u nodes with spans
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 289);
if (!node.test(this.supportedTags)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 290);
node.replace(node.get('text'));
                    } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 291);
if (!this._isBlockNode(parentNode) && !parentNode.test('a')) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 292);
parentNode.insert(node, 'after');

                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 294);
if (!this._isBlockNode(node)) {
                            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 295);
node.addClass(parentNode.get('className'));

                            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 297);
EDOM.copyStyles(parentNode, node, supportedStyles, {
                                explicit: true,
                                overwrite: false
                            });
                        }
                    } else {
                        // TODO: clear styles on containers
                    }}

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 306);
flatten.call(this, node);

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 308);
if (EDOM.isEmptyNode(node)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 309);
node.remove(true);
                    }

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 312);
node.removeAttribute('id');
                }
            }, this);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 317);
var frag, supportedStyles = [], supportedTags = this.supportedTags;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 319);
Y.Object.each(this.styleCommands, function (cmd) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 4)", 319);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 320);
supportedStyles.push(cmd.property);
        });

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 323);
frag = Y.one(doc.createDocumentFragment()).setHTML(html);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 325);
flatten.call(this, frag);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 327);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getHTML", 339);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 340);
value = Y.Editor.Base.prototype._getHTML.call(this, value);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 342);
return this.get('formatFn')(value).getHTML();
    },


    /**
    Walks the ancestor tree of a given node until a node that has
    the css property set is found

    @method _getStyledAncestor
    @param {Node} startNode
    @param {String} property
    @return {Node} The node having `property` set, or null if no node was found
    @protected
    **/
    _getStyledAncestor: function (startNode, property) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyledAncestor", 356);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 357);
return startNode.ancestor(function (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 5)", 357);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 358);
if (!EDOM.isElementNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 359);
return false;
            }

            // don't use node.getStyle() because it will return
            // computedStyle for empty string values like `property: ""`
            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 365);
return !!node._node.style[property];
        }, true, this.selectors.input);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyleNodes", 379);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 380);
var styleNode, styleNodes = [];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 382);
range.shrink();

        // see if the range is contained in an existing styleNode
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 385);
styleNode = range.parentNode().ancestor(this.styleTags, true, this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 387);
if (styleNode) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 388);
if (range.toString() === styleNode.get('text')) {
                // the entire node is selected, just return the node
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 390);
return new Y.NodeList([styleNode]);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 393);
styleNode = Y.Node.create(STYLENODE);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 396);
var startNode = range.startNode(),
            startOffset = range.startOffset(),
            endNode = range.endNode(),
            endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 401);
range.traverse(function (node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 6)", 401);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 402);
if (!EDOM.isTextNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 403);
return;
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 406);
if (endNode === node && endOffset !== EDOM.maxOffset(endNode)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 407);
node = EDOM.split(node, endOffset).get('previousSibling');
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 410);
if (startNode === node && startOffset) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 411);
node = EDOM.split(node, startOffset);
            }

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 414);
if (this._isStyleNode(node.get('parentNode'))) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 415);
if (node.get('nextSibling')) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 416);
EDOM.split(node.get('parentNode'), node.get('nextSibling'));
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 419);
if (node.get('previousSibling')) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 420);
EDOM.split(node.get('parentNode'), node);
                }

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 423);
styleNodes.push(node.get('parentNode'));
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 425);
styleNodes.push(node.wrap(styleNode).get('parentNode'));
            }
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 429);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_isBlockNode", 442);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 443);
node = Y.one(node);

        // isElementNode() will exclude document fragments, which are valid
        // containers, use !isTextNode() instead
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 447);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_isStyleNode", 459);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 460);
node = Y.one(node);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 462);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_setHTML", 474);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 475);
value = this.get('formatFn')(value).getHTML();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 477);
return Y.Editor.Base.prototype._setHTML.call(this, value);
    },


    /**
    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes
    instead of relying on spotty browser compatibility of `styleWithCSS`

    Passes through to Editor.Base for any commands not defined
    in `this.styleCommands`

    @method _queryStyleCommand
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryStyleCommand: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_queryStyleCommand", 493);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 494);
var command = this.styleCommands[name],
            range = this.selection.range().clone(),
            parentNode, styleNode, value;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 498);
if (range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 499);
parentNode = range.shrink().parentNode();

            // first attempt to get any explicitly styled ancestor for
            // the given property. Need to do this first because browsers
            // sometimes return different values for explicit style vs.
            // computed style. `font-weight: bold;` for example will return
            // `bold` in all browsers when explicitly set but `700` in
            // Firefox and Internet Explorer with computedStyle.
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 507);
styleNode = this._getStyledAncestor(parentNode, command.property);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 509);
if (!styleNode) {
                // no explicitly styled ancestor found. walk the
                // ancestor tree to find the closest element
                // node ancestor, inclusive of the parentNode
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 513);
styleNode = parentNode.ancestor(EDOM.isElementNode, true);
            }

            // getStyle will fall back to computedStyle if the
            // property isn't explicitly set
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 518);
value = styleNode.getStyle(command.property);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 521);
if (this.boolCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 522);
value = (value === command.value);
        } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 523);
if ('' === value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 524);
value = null;
        }}

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 527);
return value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `delete` events on the editor

    @method _afterDelete
    @protected
    **/
    _afterDelete: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_afterDelete", 538);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 539);
this._clearCommandQueue();
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 540);
this._updateSelection({force: true});
    },


    /**
    AOP wrapper for `Editor.Base#_execCommand()`.

    @method _styleBeforeExecCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _styleBeforeExecCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_styleBeforeExecCommand", 552);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 553);
if (this.styleCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 554);
var ret = this._execStyleCommand(name, value);
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 555);
return new Y.Do.Halt('Editor.Style prevented _execCommand', ret);
        }
    },


    /**
    AOP wrapper for `Editor.Base#_queryCommand()`.

    @method _styleBeforeQueryCommand
    @param {String} name Command name.
    @protected
    **/
    _styleBeforeQueryCommand: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_styleBeforeQueryCommand", 567);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 568);
if (this.styleCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 569);
var ret = this._queryStyleCommand(name);
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 570);
return new Y.Do.Halt('Editor.Style prevented _queryCommand', ret);
        }
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
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "setter", 582);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 583);
return Y.bind(val, this);
            },
            validator: Y.Lang.isFunction,
            valueFn: function () {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "valueFn", 586);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 587);
return this._formatHTML;
            }
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 593);
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
