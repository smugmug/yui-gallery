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
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-base/gallery-sm-editor-base.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].code=["YUI.add('gallery-sm-editor-base', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.","","@module gallery-sm-editor","@submodule gallery-sm-editor-base","**/","","/**","Base implementation of the SmugMug editor. Provides core editor functionality,","but no undo stack, keyboard shortcuts, etc.","","@class Editor.Base","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","/**","Fired after this editor loses focus.","","@event blur","**/","var EVT_BLUR = 'blur';","","/**","Fired after this editor receives focus.","","@event focus","**/","var EVT_FOCUS = 'focus';","","/**","Fired after this editor is rendered.","","@event render","**/","var EVT_RENDER = 'render';","","/**","Fired when this editor's selection changes.","","@event selectionChange","@param {Range} prevRange Range that was previously selected, or `null` if there","    was no previous selection.","@param {Range} range Range that's now selected, or `null` if the current","    selection is empty or outside the editor.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","var EditorBase = Y.Base.create('editorBase', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    should be strings specifying the style's type: either 'boolean' or 'string'.","","    @property {Object} styleCommands","    @param {String} [bold='boolean']","    @param {String} [italic='boolean']","    @param {String} [fontName='string']","    @param {String} [fontSize='string']","    @param {String} [underline='string']","    **/","    styleCommands: {","        bold     : 'boolean',","        italic   : 'boolean',","        fontName : 'string',","        fontSize : 'string',","        underline: 'boolean'","    },","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._inputNode) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Bolds or unbolds the current selection.","","    @method bold","    @chainable","    **/","    bold: function () {","        this.style('bold', 'toggle');","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String} name Command name.","    @param {Boolean|String|null} [value] Command value. Use the special value","        'toggle' to toggle a boolean command (like 'bold') to the opposite of","        its current state.","    @return {Boolean|String} Value of the specified command.","    **/","    command: function (name, value) {","        if (typeof value !== 'undefined') {","            this._execCommand(name, value);","        }","","        return this._queryCommandValue(name);","    },","","    /**","    Decreases the font size of the current selection (if possible).","","    @method decreaseFontSize","    @chainable","    **/","    decreaseFontSize: function () {","        var newSize = parseInt(this.style('fontSize'), 10) - 1;","","        if (newSize > 0) {","            this.style('fontSize', '' + newSize);","        }","","        return this;","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._inputNode) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Increases the font size of the current selection (if possible).","","    @method increaseFontSize","    @chainable","    **/","    increaseFontSize: function () {","        var newSize = parseInt(this.style('fontSize'), 10) + 1;","","        if (newSize < 8) {","            this.style('fontSize', '' + newSize);","        }","","        return this;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        node = range.deleteContents().insertNode(node);","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    insertText: function (text) {","        return this.insertHTML(doc.createTextNode(text));","    },","","    /**","    Italicizes or unitalicizes the current selection.","","    @method italic","    @chainable","    **/","    italic: function () {","        this.style('italic', 'toggle');","        return this;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        }","","        inputNode.set('contentEditable', true);","        doc.execCommand('styleWithCSS', false, 'true');","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this._updateSelection({silent: true});","","        this.fire(EVT_RENDER);","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor style command. This","    method is similar to `command()`, but only supports a subset of","    style-related commands.","","    See the `styleCommands` property for a list of supported style commands.","","    @method style","    @param {String} name Command name.","    @param {Boolean|String} [value] Command value. Use the special value","        'toggle' to toggle a boolean command (like 'bold') to the opposite of","        its current state.","    @return {Boolean|String} Value of the specified command.","    **/","    style: function (name, value) {","        if (!this.styleCommands.hasOwnProperty(name)) {","            Y.error('sm-editor: Unsupported style: ' + name);","            return;","        }","","        return this.command(name, value);","    },","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.style(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    /**","    Toggles underline on the current selection.","","    @method underline","    @chainable","    **/","    underline: function () {","        this.style('underline', 'toggle');","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',  this._onBlur,  selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('paste', this._onPaste, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state and normalizes boolean/toggleable values.","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        var type = this.styleCommands[name];","","        if (!doc.queryCommandEnabled(name)) {","            return;","        }","","        if (type === 'boolean') {","            // Only execute the command if the desired state differs from the","            // current state, or the desired state is 'toggle', indicating that","            // the command should be toggled regardless of its current state.","            if (value === 'toggle' || value !== this._queryCommandValue(name)) {","                doc.execCommand(name, false, null);","            }","        } else {","            doc.execCommand(name, false, value);","        }","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this.insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Wrapper for the native `queryCommandState()` and `queryCommandValue()`","    methods that uses the appropriate method for the given command type.","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return this.styleCommands[name] === 'boolean' ?","            !!doc.queryCommandState(name) : doc.queryCommandValue(name);","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var prevRange = this._selectedRange || null,","            newRange  = this.selection.range() || null,","            silent    = options && options.silent;","","        if (newRange === prevRange || (prevRange && prevRange.isEquivalent(newRange))) {","            return;","        }","","        this._selectedRange = newRange;","","        // Only fire an event if options.silent is falsy and the new range is","        // either null or is entirely inside this editor.","        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {","            this.fire(EVT_SELECTION_CHANGE, {","                prevRange: prevRange,","                range    : newRange,","                selection: this.selection","            });","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","        this._updateSelection();","","        this.fire(EVT_BLUR);","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this;","","        if (!this._rendered) {","            return;","        }","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","","        this.fire(EVT_FOCUS);","    },","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @protected","    **/","    _onPaste: function () {","        // TODO: handle paste events!","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","Y.namespace('Editor').Base = EditorBase;","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"classnamemanager\", \"event-focus\", \"gallery-sm-selection\", \"view\"]});"];
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].lines = {"1":0,"5":0,"23":0,"31":0,"38":0,"45":0,"57":0,"59":0,"116":0,"117":0,"119":0,"121":0,"122":0,"125":0,"129":0,"131":0,"143":0,"144":0,"147":0,"157":0,"158":0,"175":0,"176":0,"179":0,"189":0,"191":0,"192":0,"195":0,"205":0,"206":0,"209":0,"219":0,"221":0,"222":0,"225":0,"238":0,"242":0,"243":0,"246":0,"247":0,"249":0,"251":0,"263":0,"273":0,"274":0,"285":0,"288":0,"290":0,"291":0,"295":0,"298":0,"299":0,"300":0,"301":0,"304":0,"305":0,"307":0,"308":0,"310":0,"312":0,"314":0,"332":0,"333":0,"334":0,"337":0,"354":0,"357":0,"358":0,"359":0,"360":0,"364":0,"366":0,"367":0,"368":0,"373":0,"383":0,"384":0,"396":0,"397":0,"400":0,"403":0,"417":0,"418":0,"419":0,"433":0,"435":0,"436":0,"439":0,"443":0,"444":0,"447":0,"460":0,"472":0,"483":0,"496":0,"509":0,"510":0,"513":0,"525":0,"526":0,"529":0,"544":0,"548":0,"549":0,"552":0,"556":0,"557":0,"574":0,"575":0,"578":0,"579":0,"581":0,"591":0,"593":0,"594":0,"597":0,"599":0,"601":0,"602":0,"605":0,"663":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].functions = {"(anonymous 2):121":0,"initializer:115":0,"destructor:128":0,"blur:142":0,"bold:156":0,"command:174":0,"decreaseFontSize:188":0,"focus:204":0,"increaseFontSize:218":0,"insertHTML:237":0,"insertText:262":0,"italic:272":0,"render:284":0,"style:331":0,"styles:353":0,"underline:382":0,"_attachEvents:395":0,"_detachEvents:416":0,"_execCommand:432":0,"_getHTML:459":0,"_getText:471":0,"_insertTab:482":0,"_queryCommandValue:495":0,"_setHTML:508":0,"_setText:524":0,"_updateSelection:543":0,"_onBlur:573":0,"(anonymous 3):601":0,"_onFocus:590":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredLines = 121;
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredFunctions = 30;
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 1);
YUI.add('gallery-sm-editor-base', function (Y, NAME) {

/*jshint expr:true, onevar:false */

_yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 5);
Y.Node.DOM_EVENTS.paste = 1;

/**
Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.

@module gallery-sm-editor
@submodule gallery-sm-editor-base
**/

/**
Base implementation of the SmugMug editor. Provides core editor functionality,
but no undo stack, keyboard shortcuts, etc.

@class Editor.Base
@constructor
@extends View
**/

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 23);
var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

/**
Fired after this editor loses focus.

@event blur
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 31);
var EVT_BLUR = 'blur';

/**
Fired after this editor receives focus.

@event focus
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 38);
var EVT_FOCUS = 'focus';

/**
Fired after this editor is rendered.

@event render
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 45);
var EVT_RENDER = 'render';

/**
Fired when this editor's selection changes.

@event selectionChange
@param {Range} prevRange Range that was previously selected, or `null` if there
    was no previous selection.
@param {Range} range Range that's now selected, or `null` if the current
    selection is empty or outside the editor.
@param {Selection} selection Reference to this editor's Selection instance.
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 57);
var EVT_SELECTION_CHANGE = 'selectionChange';

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 59);
var EditorBase = Y.Base.create('editorBase', Y.View, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    CSS class names used by this editor.

    @property {Object} classNames
    @param {String} cursor Class name used for a placeholder node that
        represents the cursor position.
    @param {String} editor Class name used for the editor's container.
    @param {String} input Class name used for the WYSIWYG YUI Editor frame that
        will receive user input.
    **/
    classNames: {
        cursor: getClassName('sm-editor-cursor', true),
        editor: getClassName('sm-editor', true),
        input : getClassName('sm-editor-input', true)
    },

    /**
    `Y.Selection` instance representing the current document selection.

    The selection object's state always reflects the current selection, so it
    will update when the selection changes. If you need to retain the state of a
    past selection, hold onto a Range instance representing that selection.

    Also, beware: this selection object reflects the current selection in the
    entire browser document, not just within this editor.

    @property {Selection} selection
    **/

    /**
    Hash of style commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    should be strings specifying the style's type: either 'boolean' or 'string'.

    @property {Object} styleCommands
    @param {String} [bold='boolean']
    @param {String} [italic='boolean']
    @param {String} [fontName='string']
    @param {String} [fontSize='string']
    @param {String} [underline='string']
    **/
    styleCommands: {
        bold     : 'boolean',
        italic   : 'boolean',
        fontName : 'string',
        fontSize : 'string',
        underline: 'boolean'
    },

    // -- Protected Properties -------------------------------------------------

    // -- Lifecycle ------------------------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "initializer", 115);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 116);
this.selection  = new Y.Selection();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 117);
this.selectors  = {};

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 119);
this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 121);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 2)", 121);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 122);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 125);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "destructor", 128);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 129);
this._detachEvents();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 131);
this.selection = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "blur", 142);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 143);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 144);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 147);
return this;
    },

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "bold", 156);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 157);
this.style('bold', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 158);
return this;
    },

    /**
    Gets and/or sets the value of the specified editor command.

    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>
    for a list of possible commands.

    @method command
    @param {String} name Command name.
    @param {Boolean|String|null} [value] Command value. Use the special value
        'toggle' to toggle a boolean command (like 'bold') to the opposite of
        its current state.
    @return {Boolean|String} Value of the specified command.
    **/
    command: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "command", 174);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 175);
if (typeof value !== 'undefined') {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 176);
this._execCommand(name, value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 179);
return this._queryCommandValue(name);
    },

    /**
    Decreases the font size of the current selection (if possible).

    @method decreaseFontSize
    @chainable
    **/
    decreaseFontSize: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "decreaseFontSize", 188);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 189);
var newSize = parseInt(this.style('fontSize'), 10) - 1;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 191);
if (newSize > 0) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 192);
this.style('fontSize', '' + newSize);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 195);
return this;
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "focus", 204);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 205);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 206);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 209);
return this;
    },

    /**
    Increases the font size of the current selection (if possible).

    @method increaseFontSize
    @chainable
    **/
    increaseFontSize: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "increaseFontSize", 218);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 219);
var newSize = parseInt(this.style('fontSize'), 10) + 1;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 221);
if (newSize < 8) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 222);
this.style('fontSize', '' + newSize);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 225);
return this;
    },

    /**
    Inserts the specified _html_ at the current selection point, deleting the
    current selection if there is one.

    @method insertHTML
    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML
        string, HTMLElement, or Node instance.
    @return {Node} Node instance representing the inserted HTML.
    **/
    insertHTML: function (html) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "insertHTML", 237);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 238);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 242);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 243);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 246);
node = range.deleteContents().insertNode(node);
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 247);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 249);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 251);
return node;
    },

    /**
    Inserts the specified plain _text_ at the current selection point, deleting
    the current selection if there is one.

    @method insertText
    @param {String} text Text to insert.
    @return {Node} Node instance representing the inserted text node.
    **/
    insertText: function (text) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "insertText", 262);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 263);
return this.insertHTML(doc.createTextNode(text));
    },

    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "italic", 272);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 273);
this.style('italic', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 274);
return this;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "render", 284);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 285);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 288);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 290);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 291);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 295);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 298);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 299);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 300);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 301);
inputNode.set('text', text);
        }}

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 304);
inputNode.set('contentEditable', true);
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 305);
doc.execCommand('styleWithCSS', false, 'true');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 307);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 308);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 310);
this._updateSelection({silent: true});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 312);
this.fire(EVT_RENDER);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 314);
return this;
    },

    /**
    Gets and/or sets the value of the specified editor style command. This
    method is similar to `command()`, but only supports a subset of
    style-related commands.

    See the `styleCommands` property for a list of supported style commands.

    @method style
    @param {String} name Command name.
    @param {Boolean|String} [value] Command value. Use the special value
        'toggle' to toggle a boolean command (like 'bold') to the opposite of
        its current state.
    @return {Boolean|String} Value of the specified command.
    **/
    style: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "style", 331);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 332);
if (!this.styleCommands.hasOwnProperty(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 333);
Y.error('sm-editor: Unsupported style: ' + name);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 334);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 337);
return this.command(name, value);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "styles", 353);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 354);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 357);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 358);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 359);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 360);
results[name] = this.style(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 364);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 366);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 367);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 368);
results[name] = this._queryCommandValue(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 373);
return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "underline", 382);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 383);
this.style('underline', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 384);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_attachEvents", 395);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 396);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 397);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 400);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 403);
this._events = [
            container.delegate('blur',  this._onBlur,  selectors.input, this),
            container.delegate('focus', this._onFocus, selectors.input, this),
            container.delegate('paste', this._onPaste, selectors.input, this)
        ];
    },

    /**
    Detaches editor events.

    @method _detachEvents
    @protected
    **/
    _detachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_detachEvents", 416);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 417);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 418);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 419);
this._events = null;
        }
    },

    /**
    Wrapper for native the native `execCommand()` that verifies that the command
    is valid in the current state and normalizes boolean/toggleable values.

    @method _execCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_execCommand", 432);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 433);
var type = this.styleCommands[name];

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 435);
if (!doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 436);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 439);
if (type === 'boolean') {
            // Only execute the command if the desired state differs from the
            // current state, or the desired state is 'toggle', indicating that
            // the command should be toggled regardless of its current state.
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 443);
if (value === 'toggle' || value !== this._queryCommandValue(name)) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 444);
doc.execCommand(name, false, null);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 447);
doc.execCommand(name, false, value);
        }
    },

    /**
    Getter for the `html` attribute.

    @method _getHTML
    @param {HTML} value Internal value.
    @return {HTML} HTML.
    @protected
    **/
    _getHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getHTML", 459);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 460);
return this._rendered ? this._inputNode.getHTML() : value;
    },

    /**
    Getter for the `text` attribute.

    @method _getText
    @param {String} value Internal value.
    @return {String} Text.
    @protected
    **/
    _getText: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getText", 471);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 472);
return this._rendered ? this._inputNode.get('text') : value;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertTab", 482);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 483);
this.insertHTML('<span style="white-space:pre;">\t</span>');
    },

    /**
    Wrapper for the native `queryCommandState()` and `queryCommandValue()`
    methods that uses the appropriate method for the given command type.

    @method _queryCommandValue
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryCommandValue: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_queryCommandValue", 495);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 496);
return this.styleCommands[name] === 'boolean' ?
            !!doc.queryCommandState(name) : doc.queryCommandValue(name);
    },

    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setHTML", 508);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 509);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 510);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 513);
return value;
    },

    /**
    Setter for the `text` attribute.

    @method _setText
    @param {String} value Text.
    @return {String} Text.
    @protected
    **/
    _setText: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setText", 524);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 525);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 526);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 529);
return value;
    },

    /**
    Refreshes the editor's internal knowledge of the current document selection
    state and fires a `selectionChange` event if the selection has changed since
    it was last refreshed.

    @method _updateSelection
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`
            event will be suppressed.
    @protected
    **/
    _updateSelection:  function (options) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_updateSelection", 543);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 544);
var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            silent    = options && options.silent;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 548);
if (newRange === prevRange || (prevRange && prevRange.isEquivalent(newRange))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 549);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 552);
this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 556);
if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 557);
this.fire(EVT_SELECTION_CHANGE, {
                prevRange: prevRange,
                range    : newRange,
                selection: this.selection
            });
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `blur` events on the editor.

    @method _onBlur
    @protected
    **/
    _onBlur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onBlur", 573);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 574);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 575);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 578);
clearInterval(this._selectionMonitor);
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 579);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 581);
this.fire(EVT_BLUR);
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onFocus", 590);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 591);
var self = this;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 593);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 594);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 597);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 599);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 601);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 3)", 601);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 602);
self._updateSelection();
        }, 200);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 605);
this.fire(EVT_FOCUS);
    },

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @protected
    **/
    _onPaste: function () {
        // TODO: handle paste events!
    }
}, {
    ATTRS: {
        /**
        HTML content of this editor.

        @attribute {HTML} html
        @default ''
        **/
        html: {
            getter: '_getHTML',
            setter: '_setHTML',
            value : ''
        },

        /**
        Form field name to use for the hidden `<textarea>` that contains the raw
        output of the editor in the configured output format. This name will
        only be used if the output node doesn't already have a name when the
        editor is rendered.

        You may need to customize this if you plan to use the editor in a form
        that will be submitted to a server.

        @attribute {String} outputName
        @default 'editor'
        @initOnly
        **/
        outputName: {
            value    : 'editor',
            writeOnce: 'initOnly'
        },

        /**
        Text content of this editor, with no HTML.

        @attribute {String} text
        @default ''
        **/
        text: {
            getter: '_getText',
            setter: '_setText',
            value : ''
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 663);
Y.namespace('Editor').Base = EditorBase;


}, '@VERSION@', {"requires": ["base-build", "classnamemanager", "event-focus", "gallery-sm-selection", "view"]});
