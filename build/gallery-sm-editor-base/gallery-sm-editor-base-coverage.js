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
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].code=["YUI.add('gallery-sm-editor-base', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.","","@module gallery-sm-editor","@submodule gallery-sm-editor-base","**/","","/**","Base implementation of the SmugMug editor. Provides core editor functionality,","but no undo stack, keyboard shortcuts, etc.","","@class Editor.Base","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","/**","Fired after this editor loses focus.","","@event blur","**/","var EVT_BLUR = 'blur';","","/**","Fired after this editor receives focus.","","@event focus","**/","var EVT_FOCUS = 'focus';","","/**","Fired after this editor is rendered.","","@event render","**/","var EVT_RENDER = 'render';","","/**","Fired when this editor's selection changes.","","@event selectionChange","@param {Range} prevRange Range that was previously selected, or `null` if there","    was no previous selection.","@param {Range} range Range that's now selected, or `null` if the current","    selection is empty or outside the editor.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","var EditorBase = Y.Base.create('editorBase', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of boolean commands supported by this editor. A boolean command is","    one that does not require a value. Executing this command will toggle","    the currently set value.","","    Names should correspond with valid `execCommand()` command names.","","    @property {Object} boolCommands","    **/","    boolCommands: {","        bold     : true,","        italic   : true,","        underline: true,","        justifyCenter: true,","        justifyFull: true,","        justifyLeft: true,","        justifyRight: true","    },","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._inputNode) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String|Function} name Command name or function to execute. By","        default functions will execute in the editor context. Use Y.bind","        to provide a different execution context.","    @param {*} [value*] Command value or 0..n arguments to pass","        to the command function. Use the special value 'toggle' to toggle a","        boolean command (like 'bold') to the opposite of its current state.","    @return {*} Value of the specified command or return value of the","        supplied function.","    **/","    command: function (name, value) {","        var args = Y.Array(arguments, 1, true),","            retVal;","","        this.focus();","","        if (typeof name === 'function') {","            retVal = name.apply(this, args);","        } else {","            value = args.shift();","","            if (typeof value !== 'undefined') {","                this._execCommand(name, value);","            }","","            retVal = this._queryCommandValue(name);","        }","","        this._updateSelection({force: true});","","        return retVal;","    },","","    /**","    Decreases the font size of the current selection (if possible).","","    @method decreaseFontSize","    @chainable","    **/","    decreaseFontSize: function () {","        var newSize = parseInt(this.command('fontSize'), 10) - 1;","","        if (newSize > 0) {","            this.command('fontSize', '' + newSize);","        }","","        return this;","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._inputNode) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Increases the font size of the current selection (if possible).","","    @method increaseFontSize","    @chainable","    **/","    increaseFontSize: function () {","        var newSize = parseInt(this.command('fontSize'), 10) + 1;","","        // currently only webkit supports size 7 (xxx-large), so keep","        // it under 7 for compatibility","        if (newSize < 7) {","            this.command('fontSize', '' + newSize);","        }","","        return this;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        node = range.deleteContents().insertNode(node);","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    insertText: function (text) {","        return this.insertHTML(doc.createTextNode(text));","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        }","","        inputNode.set('contentEditable', true);","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this._updateSelection({silent: true});","","        this.fire(EVT_RENDER);","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',  this._onBlur,  selectors.input, this),","            container.delegate('copy',  this._onCopy,  selectors.input, this),","            container.delegate('cut',  this._onCut,  selectors.input, this),","            container.delegate('dblclick', this._onDblClick, selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('paste', this._onPaste, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state and normalizes boolean/toggleable values.","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        if (!doc.queryCommandEnabled(name)) {","            return;","        }","","        if (this.boolCommands[name]) {","            // Only execute the command if the desired state differs from the","            // current state, or the desired state is 'toggle', indicating that","            // the command should be toggled regardless of its current state.","            if (value === 'toggle' || value !== this._queryCommandValue(name)) {","                doc.execCommand(name, false, null);","            }","        } else {","            doc.execCommand(name, false, value);","        }","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this.insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Wrapper for the native `queryCommandState()` and `queryCommandValue()`","    methods that uses the appropriate method for the given command type.","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return this.boolCommands[name] ?","            !!doc.queryCommandState(name) : doc.queryCommandValue(name);","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.force=false] If `true`, the internal selection","            state will be updated regardless of if the selection changed.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var prevRange = this._selectedRange || null,","            newRange  = this.selection.range() || null,","            force     = options && options.force,","            silent    = options && options.silent;","","        if (!force && (","                newRange === prevRange || (","                    prevRange &&","                    prevRange.isEquivalent(newRange) &&","                    prevRange.toHTML() === newRange.toHTML()","                )","            )","        ) {","            return;","        }","","        this._selectedRange = newRange;","","        // Only fire an event if options.silent is falsy and the new range is","        // either null or is entirely inside this editor.","        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {","            this.fire(EVT_SELECTION_CHANGE, {","                prevRange: prevRange,","                range    : newRange,","                selection: this.selection","            });","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","","        this.fire(EVT_BLUR);","    },","","    /**","    Handles `copy` events on the editor.","","    @method _onCopy","    @param {EventFacade} e","    @protected","    **/","    _onCopy: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents = range.cloneContents().getHTML();","","        e.preventDefault();","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `cut` events on the editor.","","    @method _onCut","    @param {EventFacade} e","    @protected","    **/","    _onCut: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","","            // note the `expand()`. this prevents any empty nodes","            // being left after `extractContents()`","            contents = range.expand().extractContents().getHTML();","","        e.preventDefault();","","        this.selection.select(range);","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `dblclick` events on the editor.","","    @method _onDblClick","    @protected","    **/","    _onDblClick: function() {","        var range = this.selection.range();","","        this.selection.select(range.shrink({trim: true}));","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this;","","        if (!this._rendered) {","            return;","        }","","        // restore the previously selected range","        if (this._selectedRange) {","            this.selection.select(this._selectedRange);","        }","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","","        this.fire(EVT_FOCUS);","    },","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @protected","    **/","    _onPaste: function () {","        // TODO: handle paste events!","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","Y.namespace('Editor').Base = EditorBase;","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"classnamemanager\", \"event-focus\", \"gallery-sm-selection\", \"view\"]});"];
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].lines = {"1":0,"5":0,"23":0,"31":0,"38":0,"45":0,"57":0,"59":0,"115":0,"116":0,"118":0,"120":0,"121":0,"124":0,"128":0,"130":0,"142":0,"143":0,"146":0,"166":0,"169":0,"171":0,"172":0,"174":0,"176":0,"177":0,"180":0,"183":0,"185":0,"195":0,"197":0,"198":0,"201":0,"211":0,"212":0,"215":0,"225":0,"229":0,"230":0,"233":0,"246":0,"250":0,"251":0,"254":0,"255":0,"257":0,"259":0,"271":0,"282":0,"285":0,"287":0,"288":0,"292":0,"295":0,"296":0,"297":0,"298":0,"301":0,"303":0,"304":0,"306":0,"308":0,"310":0,"322":0,"323":0,"326":0,"329":0,"346":0,"347":0,"348":0,"362":0,"363":0,"366":0,"370":0,"371":0,"374":0,"387":0,"399":0,"410":0,"423":0,"436":0,"437":0,"440":0,"452":0,"453":0,"456":0,"473":0,"478":0,"486":0,"489":0,"493":0,"494":0,"511":0,"512":0,"515":0,"517":0,"528":0,"532":0,"534":0,"536":0,"537":0,"539":0,"551":0,"558":0,"560":0,"562":0,"564":0,"565":0,"567":0,"578":0,"580":0,"590":0,"592":0,"593":0,"597":0,"598":0,"601":0,"603":0,"605":0,"606":0,"609":0,"667":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].functions = {"(anonymous 2):120":0,"initializer:114":0,"destructor:127":0,"blur:141":0,"command:165":0,"decreaseFontSize:194":0,"focus:210":0,"increaseFontSize:224":0,"insertHTML:245":0,"insertText:270":0,"render:281":0,"_attachEvents:321":0,"_detachEvents:345":0,"_execCommand:361":0,"_getHTML:386":0,"_getText:398":0,"_insertTab:409":0,"_queryCommandValue:422":0,"_setHTML:435":0,"_setText:451":0,"_updateSelection:472":0,"_onBlur:510":0,"_onCopy:527":0,"_onCut:550":0,"_onDblClick:577":0,"(anonymous 3):605":0,"_onFocus:589":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredLines = 122;
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredFunctions = 28;
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
    Hash of boolean commands supported by this editor. A boolean command is
    one that does not require a value. Executing this command will toggle
    the currently set value.

    Names should correspond with valid `execCommand()` command names.

    @property {Object} boolCommands
    **/
    boolCommands: {
        bold     : true,
        italic   : true,
        underline: true,
        justifyCenter: true,
        justifyFull: true,
        justifyLeft: true,
        justifyRight: true
    },

    // -- Protected Properties -------------------------------------------------

    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "initializer", 114);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 115);
this.selection  = new Y.Selection();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 116);
this.selectors  = {};

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 118);
this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 120);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 2)", 120);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 121);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 124);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "destructor", 127);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 128);
this._detachEvents();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 130);
this.selection = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "blur", 141);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 142);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 143);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 146);
return this;
    },

    /**
    Gets and/or sets the value of the specified editor command.

    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>
    for a list of possible commands.

    @method command
    @param {String|Function} name Command name or function to execute. By
        default functions will execute in the editor context. Use Y.bind
        to provide a different execution context.
    @param {*} [value*] Command value or 0..n arguments to pass
        to the command function. Use the special value 'toggle' to toggle a
        boolean command (like 'bold') to the opposite of its current state.
    @return {*} Value of the specified command or return value of the
        supplied function.
    **/
    command: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "command", 165);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 166);
var args = Y.Array(arguments, 1, true),
            retVal;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 169);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 171);
if (typeof name === 'function') {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 172);
retVal = name.apply(this, args);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 174);
value = args.shift();

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 176);
if (typeof value !== 'undefined') {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 177);
this._execCommand(name, value);
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 180);
retVal = this._queryCommandValue(name);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 183);
this._updateSelection({force: true});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 185);
return retVal;
    },

    /**
    Decreases the font size of the current selection (if possible).

    @method decreaseFontSize
    @chainable
    **/
    decreaseFontSize: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "decreaseFontSize", 194);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 195);
var newSize = parseInt(this.command('fontSize'), 10) - 1;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 197);
if (newSize > 0) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 198);
this.command('fontSize', '' + newSize);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 201);
return this;
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "focus", 210);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 211);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 212);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 215);
return this;
    },

    /**
    Increases the font size of the current selection (if possible).

    @method increaseFontSize
    @chainable
    **/
    increaseFontSize: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "increaseFontSize", 224);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 225);
var newSize = parseInt(this.command('fontSize'), 10) + 1;

        // currently only webkit supports size 7 (xxx-large), so keep
        // it under 7 for compatibility
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 229);
if (newSize < 7) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 230);
this.command('fontSize', '' + newSize);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 233);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "insertHTML", 245);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 246);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 250);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 251);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 254);
node = range.deleteContents().insertNode(node);
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 255);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 257);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 259);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "insertText", 270);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 271);
return this.insertHTML(doc.createTextNode(text));
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "render", 281);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 282);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 285);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 287);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 288);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 292);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 295);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 296);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 297);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 298);
inputNode.set('text', text);
        }}

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 301);
inputNode.set('contentEditable', true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 303);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 304);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 306);
this._updateSelection({silent: true});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 308);
this.fire(EVT_RENDER);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 310);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_attachEvents", 321);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 322);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 323);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 326);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 329);
this._events = [
            container.delegate('blur',  this._onBlur,  selectors.input, this),
            container.delegate('copy',  this._onCopy,  selectors.input, this),
            container.delegate('cut',  this._onCut,  selectors.input, this),
            container.delegate('dblclick', this._onDblClick, selectors.input, this),
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_detachEvents", 345);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 346);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 347);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 348);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_execCommand", 361);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 362);
if (!doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 363);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 366);
if (this.boolCommands[name]) {
            // Only execute the command if the desired state differs from the
            // current state, or the desired state is 'toggle', indicating that
            // the command should be toggled regardless of its current state.
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 370);
if (value === 'toggle' || value !== this._queryCommandValue(name)) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 371);
doc.execCommand(name, false, null);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 374);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getHTML", 386);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 387);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getText", 398);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 399);
return this._rendered ? this._inputNode.get('text') : value;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertTab", 409);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 410);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_queryCommandValue", 422);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 423);
return this.boolCommands[name] ?
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setHTML", 435);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 436);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 437);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 440);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setText", 451);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 452);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 453);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 456);
return value;
    },

    /**
    Refreshes the editor's internal knowledge of the current document selection
    state and fires a `selectionChange` event if the selection has changed since
    it was last refreshed.

    @method _updateSelection
    @param {Object} [options] Options.
        @param {Boolean} [options.force=false] If `true`, the internal selection
            state will be updated regardless of if the selection changed.
        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`
            event will be suppressed.
    @protected
    **/
    _updateSelection:  function (options) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_updateSelection", 472);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 473);
var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            force     = options && options.force,
            silent    = options && options.silent;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 478);
if (!force && (
                newRange === prevRange || (
                    prevRange &&
                    prevRange.isEquivalent(newRange) &&
                    prevRange.toHTML() === newRange.toHTML()
                )
            )
        ) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 486);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 489);
this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 493);
if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 494);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onBlur", 510);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 511);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 512);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 515);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 517);
this.fire(EVT_BLUR);
    },

    /**
    Handles `copy` events on the editor.

    @method _onCopy
    @param {EventFacade} e
    @protected
    **/
    _onCopy: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCopy", 527);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 528);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents = range.cloneContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 532);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 534);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 536);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 537);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 539);
clipboard.setData('text', contents);
        }
    },

    /**
    Handles `cut` events on the editor.

    @method _onCut
    @param {EventFacade} e
    @protected
    **/
    _onCut: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCut", 550);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 551);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),

            // note the `expand()`. this prevents any empty nodes
            // being left after `extractContents()`
            contents = range.expand().extractContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 558);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 560);
this.selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 562);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 564);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 565);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 567);
clipboard.setData('text', contents);
        }
    },

    /**
    Handles `dblclick` events on the editor.

    @method _onDblClick
    @protected
    **/
    _onDblClick: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onDblClick", 577);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 578);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 580);
this.selection.select(range.shrink({trim: true}));
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onFocus", 589);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 590);
var self = this;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 592);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 593);
return;
        }

        // restore the previously selected range
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 597);
if (this._selectedRange) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 598);
this.selection.select(this._selectedRange);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 601);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 603);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 605);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 3)", 605);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 606);
self._updateSelection();
        }, 200);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 609);
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

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 667);
Y.namespace('Editor').Base = EditorBase;


}, '@VERSION@', {"requires": ["base-build", "classnamemanager", "event-focus", "gallery-sm-selection", "view"]});
