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
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].code=["YUI.add('gallery-sm-editor-style', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Style` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-style","**/","","/**","Extension for `Editor.Base` that normalizes style commands into css properties","","@class Editor.Style","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","","var doc = Y.config.doc,","    win = Y.config.win,","    EDOM = Y.Editor.DOM,","    STYLENODE = '<span></span>';","","var EditorStyle = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} styleCommands","      @param {String} property The name of the CSS property in camelCase form","      @param {String} [valueOn] The `on` value of the property. eg. `bold`","      @param {String} [valueOff] The `off` value of the property. eg. `none`","    **/","    styleCommands: {","        bold: {","            property: 'fontWeight',","            valueOn: 'bold',","            valueOff: 'normal'","        },","","        fontName: {","            property: 'fontFamily'","        },","","        fontSize: {","            property: 'fontSize'","        },","","        italic: {","            property: 'fontStyle',","            valueOn: 'italic',","            valueOff: 'normal'","        },","","        underline: {","            property: 'textDecoration',","            valueOn: 'underline',","            valueOff: 'none'","        }","    },","","    /**","    Key commands related to style functionality.","","    @property {Object} styleKeyCommands","    **/","    styleKeyCommands: {","        'backspace': {fn: '_afterDelete', allowDefault: true, async: true},","        'delete'   : {fn: '_afterDelete', allowDefault: true, async: true}","    },","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);","        }","    },","","    destructor: function () {","    },","","","    // -- Public Methods -------------------------------------------------------","","    /**","    Bolds or unbolds the current selection.","","    @method bold","    @chainable","    **/","    bold: function () {","        this.command('bold', 'toggle');","        return this;","    },","","    /**","    Italicizes or unitalicizes the current selection.","","    @method italic","    @chainable","    **/","    italic: function () {","        this.command('italic', 'toggle');","        return this;","    },","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.command(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    /**","    Toggles underline on the current selection.","","    @method underline","    @chainable","    **/","    underline: function () {","        this.command('underline', 'toggle');","        return this;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Duckpunch Editor.Base._execCommand to build css styled nodes instead of","    relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function(name, value) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            styleNodes;","","        if (!range) {","            return;","        }","","        if (!command) {","            return Y.Editor.Base.prototype._execCommand.call(this, name, value);","        }","","        styleNodes = this._getStyleNodes(range);","","        var style = styleNodes.item(0).getStyle(command.property);","","        if (this.boolCommands[name] && 'toggle' === value) {","            if (style && '' !== style) {","                style = '';","            } else {","                style = command.valueOn;","            }","        } else {","            style = value;","        }","","        styleNodes.setStyle(command.property, style);","","        // expanding the range before deleting contents makes sure","        // the entire node is deleted, if possible.","        range.expand(this._inputNode);","","        range.deleteContents();","","        this._splitAfterRange(range, styleNodes);","","        range.startNode(styleNodes.item(0), 0);","        range.endNode(styleNodes.item(styleNodes.size() - 1));","        range.endOffset(EDOM.maxOffset(range.endNode()));","","        this.selection.select(range);","    },","","","    /**","    Reformats html to the proper style","","    <span>blah blah</span>","    @param {HTML} html HTML string to format","    @return {Node} Node instance containing a document fragment with the","        formatted _html_","    @protected","    **/","    _formatHTML: function(html) {","        function flatten(node) {","            var childNodes = node.get('childNodes')._nodes;","","            Y.Array.each(childNodes.reverse(), function(node) {","                var parentNode;","","                node = Y.one(node);","                parentNode = node.get('parentNode');","","                if (EDOM.isTextNode(node)) {","                    if (EDOM.isContainer(parentNode)) {","                        node.wrap(STYLENODE);","                    } else if (node.get('previousSibling')) {","                        EDOM.split(parentNode, node);","                    }","                } else {","                    // TODO: replace b, em, i, strong, u nodes with spans","","                    if (!EDOM.isContainer(parentNode)) {","                        parentNode.insert(node, 'after');","","                        node.addClass(parentNode.get('className'));","","                        EDOM.copyStyles(parentNode, node, supportedStyles, {","                            explicit: true,","                            overwrite: false","                        });","                    } else {","                        // TODO: clear styles on containers","                    }","","                    flatten(node);","","                    if (!EDOM.isContainer(node) && EDOM.isEmptyNode(node)) {","                        node.remove(true);","                    }","","                    node.removeAttribute('id');","                }","            });","        }","","        var frag, supportedStyles = [];","","        Y.Object.each(this.styleCommands, function(cmd) {","            supportedStyles.push(cmd.property);","        });","","        frag = Y.one(doc.createDocumentFragment()).setHTML(html);","","        flatten(frag);","","        return frag;","    },","","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        value = Y.Editor.Base.prototype._getHTML.call(this, value);","","        return this.get('formatFn')(value).getHTML();","    },","","","    /**","    Walks the ancestor tree of a given node until a node that has","    the css property set is found","","    @method _getStyledAncestor","    @param {Node} startNode","    @param {String} property","    @param {Boolean} [self] Whether or not to include `startNode` in the scan","    @return {Node} The node having `property` set, or null if no node was found","    @protected","    **/","    _getStyledAncestor: function(startNode, property, self) {","        return startNode.ancestor(function(node) {","            if (!EDOM.isElementNode(node)) {","                return false;","            }","","            // don't use node.getStyle() because it will return","            // computedStyle for empty string values like `property: \"\"`","            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106","            return !!node._node.style[property];","        }, self, this.selectors.input);","    },","","","    /**","    Parses inline elements from a given range. Partially selected nodes will","    be split and text nodes will be wrapped in `<span>` tags if necessary.","","    The range will not be modified.","","    @method _getStyleNodes","    @param {Range} range","    @return {NodeList} NodeList of inline elements within the given `range`","    @protected","    **/","    _getStyleNodes: function(range) {","        var inlineParent, styleContext, contents;","","        // expanding the range before deleting contents makes sure","        // the entire node is deleted, if possible.","        range.expand(this._inputNode);","","        // see if the range is contained in an inline element","        inlineParent = EDOM.getAncestorElement(","            range.parentNode(),","            EDOM.isInlineElement","        );","","        if (inlineParent) {","            if (range.toString() === inlineParent.get('text')) {","                // the entire node is selected, just return the node","                return new Y.NodeList([inlineParent]);","            }","","            // wrap textnodes in clones of the inline parent node","            // to maintain existing styles","            styleContext = inlineParent;","        } else {","            styleContext = Y.Node.create(STYLENODE);","        }","","        contents = range.cloneContents().get('childNodes');","","        contents.each(function(node, ix) {","            if (EDOM.isTextNode(node)) {","                // wrap any text nodes in a style context","                contents.splice(ix, 1, styleContext.cloneNode(false).append(node));","            }","        });","","        return contents;","    },","","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        value = this.get('formatFn')(value).getHTML();","","        return Y.Editor.Base.prototype._setHTML.call(this, value);","    },","","","    /**","    Splits the node at the end of the selection","","    @method _splitAfterRange","    @param {Range} range","    @param {HTMLCollection|HTMLElement|Node|NodeList|String} [contents] Contents","        to be inserted after the split","    @return {Node} Node reference of the node created after splitting. Any","        _contents_ will have been inserted as previous siblings of this node.","    **/","    _splitAfterRange: function(range, contents) {","        var endNode, endOffset;","","        endNode = range.endNode();","        endOffset = range.endOffset();","","        while (!EDOM.isContainer(endNode) && endOffset === EDOM.maxOffset(endNode)) {","            endOffset = range.endOffset('after');","            endNode = range.endNode();","        }","","        while (!EDOM.isContainer(endNode)) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (contents) {","            endNode.insert(contents, endOffset);","        }","","        if (!endOffset._node) {","            endOffset = endNode.get('childNodes').item(endOffset);","        }","","        return endOffset;","    },","","","    /**","    Duckpunch Editor.Base _queryCommandValue to query the css properties of nodes","    instead of relying on spotty browser compatibility of `styleWithCSS`","","    Passes through to Editor.Base for any commands not defined","    in `this.styleCommands`","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function(name) {","        var command = this.styleCommands[name],","            range = this.selection.range(),","            parentNode, styleNode, value;","","        if (!command) {","            return Y.Editor.Base.prototype._queryCommandValue.call(this, name);","        }","","        if (range) {","            parentNode = range.shrink().parentNode();","","            // first attempt to get any explicitly styled ancestor for","            // the given property. Need to do this first because browsers","            // sometimes return different values for explicit style vs.","            // computed style. `font-weight: bold;` for example will return","            // `bold` in all browsers when explicitly set but `700` in","            // Firefox and Internet Explorer with computedStyle.","            styleNode = this._getStyledAncestor(parentNode, command.property, true);","","            if (!styleNode) {","                // no explicitly styled ancestor found. walk the","                // ancestor tree to find the closest element","                // node ancestor, inclusive of the parentNode","                styleNode = EDOM.getAncestorElement(parentNode);","            }","","            // getStyle will fall back to computedStyle if the","            // property isn't explicitly set","            value = styleNode.getStyle(command.property);","        }","","        if (this.boolCommands[name]) {","            value = (value === command.valueOn);","        } else if ('' === value) {","            value = null;","        }","","        return value;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `delete` events on the editor","","    @method _afterDelete","    @protected","    **/","    _afterDelete: function() {","        this._clearCommandQueue();","        this._updateSelection({force: true});","    },","","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @param {EventFacade} e","    @protected","    **/","    _onPaste: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            contents = clipboard.getData('text'),","            range = this.selection.range();","","        e.preventDefault();","","        contents = this.get('formatFn')(contents);","","        if (!range.isCollapsed()) {","            // expanding the range before deleting contents makes sure","            // the entire node is deleted, if possible.","            range.expand(this._inputNode);","","            range.deleteContents();","        }","","        range.endNode(this._splitAfterRange(range, contents), 'before');","","        // collapse the range after the pasted text","        this.selection.select(range.collapse());","        this._updateSelection({force: true});","    }","}, {","    ATTRS: {","        /**","        Function for formatting editor html","","        One day allow custom formatting. Today is not that day.","        **/","        formatFn: {","            readOnly: true,","            setter: function(val) {","                return Y.bind(val, this);","            },","            validator: Y.Lang.isFunction,","            valueFn: function() {","                return this._formatHTML;","            }","        }","    }","});","","Y.namespace('Editor').Style = EditorStyle;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"gallery-sm-editor-queue\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].lines = {"1":0,"21":0,"23":0,"28":0,"84":0,"85":0,"102":0,"103":0,"113":0,"114":0,"131":0,"134":0,"135":0,"136":0,"137":0,"141":0,"143":0,"144":0,"145":0,"150":0,"160":0,"161":0,"180":0,"184":0,"185":0,"188":0,"189":0,"192":0,"194":0,"196":0,"197":0,"198":0,"200":0,"203":0,"206":0,"210":0,"212":0,"214":0,"216":0,"217":0,"218":0,"220":0,"234":0,"235":0,"237":0,"238":0,"240":0,"241":0,"243":0,"244":0,"245":0,"246":0,"247":0,"252":0,"253":0,"255":0,"257":0,"265":0,"267":0,"268":0,"271":0,"276":0,"278":0,"279":0,"282":0,"284":0,"286":0,"299":0,"301":0,"317":0,"318":0,"319":0,"325":0,"342":0,"346":0,"349":0,"354":0,"355":0,"357":0,"362":0,"364":0,"367":0,"369":0,"370":0,"372":0,"376":0,"389":0,"391":0,"406":0,"408":0,"409":0,"411":0,"412":0,"413":0,"416":0,"417":0,"418":0,"421":0,"422":0,"425":0,"426":0,"429":0,"446":0,"450":0,"451":0,"454":0,"455":0,"463":0,"465":0,"469":0,"474":0,"477":0,"478":0,"479":0,"480":0,"483":0,"495":0,"496":0,"508":0,"512":0,"514":0,"516":0,"519":0,"521":0,"524":0,"527":0,"528":0,"540":0,"544":0,"550":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].functions = {"initializer:83":0,"bold:101":0,"italic:112":0,"styles:130":0,"underline:159":0,"_execCommand:179":0,"(anonymous 3):237":0,"flatten:234":0,"(anonymous 4):278":0,"_formatHTML:233":0,"_getHTML:298":0,"(anonymous 5):317":0,"_getStyledAncestor:316":0,"(anonymous 6):369":0,"_getStyleNodes:341":0,"_setHTML:388":0,"_splitAfterRange:405":0,"_queryCommandValue:445":0,"_afterDelete:494":0,"_onPaste:507":0,"setter:539":0,"valueFn:543":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredLines = 130;
_yuitest_coverage["build/gallery-sm-editor-style/gallery-sm-editor-style.js"].coveredFunctions = 24;
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

        underline: {
            property: 'textDecoration',
            valueOn: 'underline',
            valueOff: 'none'
        }
    },

    /**
    Key commands related to style functionality.

    @property {Object} styleKeyCommands
    **/
    styleKeyCommands: {
        'backspace': {fn: '_afterDelete', allowDefault: true, async: true},
        'delete'   : {fn: '_afterDelete', allowDefault: true, async: true}
    },


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "initializer", 83);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 84);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 85);
this.keyCommands = Y.merge(this.keyCommands, this.styleKeyCommands);
        }
    },

    destructor: function () {
    },


    // -- Public Methods -------------------------------------------------------

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "bold", 101);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 102);
this.command('bold', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 103);
return this;
    },

    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "italic", 112);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 113);
this.command('italic', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 114);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "styles", 130);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 131);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 134);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 135);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 136);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 137);
results[name] = this.command(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 141);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 143);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 144);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 145);
results[name] = this._queryCommandValue(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 150);
return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "underline", 159);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 160);
this.command('underline', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 161);
return this;
    },


    // -- Protected Methods ----------------------------------------------------

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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_execCommand", 179);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 180);
var command = this.styleCommands[name],
            range = this.selection.range(),
            styleNodes;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 184);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 185);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 188);
if (!command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 189);
return Y.Editor.Base.prototype._execCommand.call(this, name, value);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 192);
styleNodes = this._getStyleNodes(range);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 194);
var style = styleNodes.item(0).getStyle(command.property);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 196);
if (this.boolCommands[name] && 'toggle' === value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 197);
if (style && '' !== style) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 198);
style = '';
            } else {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 200);
style = command.valueOn;
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 203);
style = value;
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 206);
styleNodes.setStyle(command.property, style);

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 210);
range.expand(this._inputNode);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 212);
range.deleteContents();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 214);
this._splitAfterRange(range, styleNodes);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 216);
range.startNode(styleNodes.item(0), 0);
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 217);
range.endNode(styleNodes.item(styleNodes.size() - 1));
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 218);
range.endOffset(EDOM.maxOffset(range.endNode()));

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 220);
this.selection.select(range);
    },


    /**
    Reformats html to the proper style

    <span>blah blah</span>
    @param {HTML} html HTML string to format
    @return {Node} Node instance containing a document fragment with the
        formatted _html_
    @protected
    **/
    _formatHTML: function(html) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_formatHTML", 233);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 234);
function flatten(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "flatten", 234);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 235);
var childNodes = node.get('childNodes')._nodes;

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 237);
Y.Array.each(childNodes.reverse(), function(node) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 3)", 237);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 238);
var parentNode;

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 240);
node = Y.one(node);
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 241);
parentNode = node.get('parentNode');

                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 243);
if (EDOM.isTextNode(node)) {
                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 244);
if (EDOM.isContainer(parentNode)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 245);
node.wrap(STYLENODE);
                    } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 246);
if (node.get('previousSibling')) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 247);
EDOM.split(parentNode, node);
                    }}
                } else {
                    // TODO: replace b, em, i, strong, u nodes with spans

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 252);
if (!EDOM.isContainer(parentNode)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 253);
parentNode.insert(node, 'after');

                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 255);
node.addClass(parentNode.get('className'));

                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 257);
EDOM.copyStyles(parentNode, node, supportedStyles, {
                            explicit: true,
                            overwrite: false
                        });
                    } else {
                        // TODO: clear styles on containers
                    }

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 265);
flatten(node);

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 267);
if (!EDOM.isContainer(node) && EDOM.isEmptyNode(node)) {
                        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 268);
node.remove(true);
                    }

                    _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 271);
node.removeAttribute('id');
                }
            });
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 276);
var frag, supportedStyles = [];

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 278);
Y.Object.each(this.styleCommands, function(cmd) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 4)", 278);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 279);
supportedStyles.push(cmd.property);
        });

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 282);
frag = Y.one(doc.createDocumentFragment()).setHTML(html);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 284);
flatten(frag);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 286);
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getHTML", 298);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 299);
value = Y.Editor.Base.prototype._getHTML.call(this, value);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 301);
return this.get('formatFn')(value).getHTML();
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyledAncestor", 316);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 317);
return startNode.ancestor(function(node) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 5)", 317);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 318);
if (!EDOM.isElementNode(node)) {
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 319);
return false;
            }

            // don't use node.getStyle() because it will return
            // computedStyle for empty string values like `property: ""`
            // https://github.com/yui/yui3/blob/master/src/dom/js/dom-style.js#L106
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 325);
return !!node._node.style[property];
        }, self, this.selectors.input);
    },


    /**
    Parses inline elements from a given range. Partially selected nodes will
    be split and text nodes will be wrapped in `<span>` tags if necessary.

    The range will not be modified.

    @method _getStyleNodes
    @param {Range} range
    @return {NodeList} NodeList of inline elements within the given `range`
    @protected
    **/
    _getStyleNodes: function(range) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_getStyleNodes", 341);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 342);
var inlineParent, styleContext, contents;

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 346);
range.expand(this._inputNode);

        // see if the range is contained in an inline element
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 349);
inlineParent = EDOM.getAncestorElement(
            range.parentNode(),
            EDOM.isInlineElement
        );

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 354);
if (inlineParent) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 355);
if (range.toString() === inlineParent.get('text')) {
                // the entire node is selected, just return the node
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 357);
return new Y.NodeList([inlineParent]);
            }

            // wrap textnodes in clones of the inline parent node
            // to maintain existing styles
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 362);
styleContext = inlineParent;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 364);
styleContext = Y.Node.create(STYLENODE);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 367);
contents = range.cloneContents().get('childNodes');

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 369);
contents.each(function(node, ix) {
            _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "(anonymous 6)", 369);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 370);
if (EDOM.isTextNode(node)) {
                // wrap any text nodes in a style context
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 372);
contents.splice(ix, 1, styleContext.cloneNode(false).append(node));
            }
        });

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 376);
return contents;
    },


    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_setHTML", 388);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 389);
value = this.get('formatFn')(value).getHTML();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 391);
return Y.Editor.Base.prototype._setHTML.call(this, value);
    },


    /**
    Splits the node at the end of the selection

    @method _splitAfterRange
    @param {Range} range
    @param {HTMLCollection|HTMLElement|Node|NodeList|String} [contents] Contents
        to be inserted after the split
    @return {Node} Node reference of the node created after splitting. Any
        _contents_ will have been inserted as previous siblings of this node.
    **/
    _splitAfterRange: function(range, contents) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_splitAfterRange", 405);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 406);
var endNode, endOffset;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 408);
endNode = range.endNode();
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 409);
endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 411);
while (!EDOM.isContainer(endNode) && endOffset === EDOM.maxOffset(endNode)) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 412);
endOffset = range.endOffset('after');
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 413);
endNode = range.endNode();
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 416);
while (!EDOM.isContainer(endNode)) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 417);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 418);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 421);
if (contents) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 422);
endNode.insert(contents, endOffset);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 425);
if (!endOffset._node) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 426);
endOffset = endNode.get('childNodes').item(endOffset);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 429);
return endOffset;
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
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_queryCommandValue", 445);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 446);
var command = this.styleCommands[name],
            range = this.selection.range(),
            parentNode, styleNode, value;

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 450);
if (!command) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 451);
return Y.Editor.Base.prototype._queryCommandValue.call(this, name);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 454);
if (range) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 455);
parentNode = range.shrink().parentNode();

            // first attempt to get any explicitly styled ancestor for
            // the given property. Need to do this first because browsers
            // sometimes return different values for explicit style vs.
            // computed style. `font-weight: bold;` for example will return
            // `bold` in all browsers when explicitly set but `700` in
            // Firefox and Internet Explorer with computedStyle.
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 463);
styleNode = this._getStyledAncestor(parentNode, command.property, true);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 465);
if (!styleNode) {
                // no explicitly styled ancestor found. walk the
                // ancestor tree to find the closest element
                // node ancestor, inclusive of the parentNode
                _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 469);
styleNode = EDOM.getAncestorElement(parentNode);
            }

            // getStyle will fall back to computedStyle if the
            // property isn't explicitly set
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 474);
value = styleNode.getStyle(command.property);
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 477);
if (this.boolCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 478);
value = (value === command.valueOn);
        } else {_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 479);
if ('' === value) {
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 480);
value = null;
        }}

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 483);
return value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `delete` events on the editor

    @method _afterDelete
    @protected
    **/
    _afterDelete: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_afterDelete", 494);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 495);
this._clearCommandQueue();
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 496);
this._updateSelection({force: true});
    },


    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "_onPaste", 507);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 508);
var clipboard = e._event.clipboardData || win.clipboardData,
            contents = clipboard.getData('text'),
            range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 512);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 514);
contents = this.get('formatFn')(contents);

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 516);
if (!range.isCollapsed()) {
            // expanding the range before deleting contents makes sure
            // the entire node is deleted, if possible.
            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 519);
range.expand(this._inputNode);

            _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 521);
range.deleteContents();
        }

        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 524);
range.endNode(this._splitAfterRange(range, contents), 'before');

        // collapse the range after the pasted text
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 527);
this.selection.select(range.collapse());
        _yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 528);
this._updateSelection({force: true});
    }
}, {
    ATTRS: {
        /**
        Function for formatting editor html

        One day allow custom formatting. Today is not that day.
        **/
        formatFn: {
            readOnly: true,
            setter: function(val) {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "setter", 539);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 540);
return Y.bind(val, this);
            },
            validator: Y.Lang.isFunction,
            valueFn: function() {
                _yuitest_coverfunc("build/gallery-sm-editor-style/gallery-sm-editor-style.js", "valueFn", 543);
_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 544);
return this._formatHTML;
            }
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-style/gallery-sm-editor-style.js", 550);
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
