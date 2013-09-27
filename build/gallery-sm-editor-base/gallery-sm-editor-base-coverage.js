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
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].code=["YUI.add('gallery-sm-editor-base', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.","","@module gallery-sm-editor","@submodule gallery-sm-editor-base","**/","","/**","Base implementation of the SmugMug editor. Provides core editor functionality,","but no undo stack, keyboard shortcuts, etc.","","@class Editor.Base","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName,","    EDOM = Y.Editor.DOM;","","/**","Fired after this editor loses focus.","","@event blur","**/","var EVT_BLUR = 'blur';","","/**","Fired after this editor receives focus.","","@event focus","**/","var EVT_FOCUS = 'focus';","","/**","Fired after this editor is rendered.","","@event render","**/","var EVT_RENDER = 'render';","","/**","Fired when this editor's selection changes.","","@event selectionChange","@param {Range} prevRange Range that was previously selected, or `null` if there","    was no previous selection.","@param {Range} range Range that's now selected, or `null` if the current","    selection is empty or outside the editor.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","var EditorBase = Y.Base.create('editorBase', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} commands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    commands: {},","","","    supportedTags: 'a, br, div, p, span',","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._inputNode) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String|Function} name Command name.","    @param {*} [value*]","    @return {*} Value of the specified command.","    **/","    command: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 1, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.commandFn;","","                if (command.style) {","                    args.unshift(name);","                }","            }","","            fn = this[fn];","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","","            this._updateSelection({force: true});","        }","","        return ret || this.query(name);","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._inputNode) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        node = range.deleteContents().insertNode(node);","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    insertText: function (text) {","        return this.insertHTML(doc.createTextNode(text));","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method query","    @param {String|Function} name Command name.","    @return {*} Value of the specified command.","    **/","    query: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 0, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.queryFn;","            }","","            fn = this[fn];","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","        }","","        return ret;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        }","","        inputNode.set('contentEditable', true);","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this._updateSelection({silent: true});","","        this.fire(EVT_RENDER);","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',  this._onBlur,  selectors.input, this),","            container.delegate('copy',  this._onCopy,  selectors.input, this),","            container.delegate('cut',  this._onCut,  selectors.input, this),","            container.delegate('dblclick', this._onDblClick, selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('paste', this._onPaste, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        if (!doc.queryCommandEnabled(name)) {","            return;","        }","","        doc.execCommand(name, false, value);","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Returns nodes containing any part of the given `range` matching the","    given `selector`","","    @method _getNodes","    @param {Range} range","    @param {String} selector","    @return {NodeList}","    @protected","    **/","    _getNodes: function (range, selector) {","        var testNode, nodes = [];","","        range = range.clone().shrink();","","        testNode = range.startNode();","","        if (range.isCollapsed()) {","            if (!EDOM.isTextNode(testNode)) {","                // the range is collapsed so it will never get traversed. grab","                // the exact node referenced by startNode/startOffset and work","                // backwards from there","                testNode = testNode.get('childNodes').item(range.startOffset());","            }","        } else {","            // traversal will include the startNode, so start off with the","            // startNodes parent","            testNode = testNode.get('parentNode');","        }","","        while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {","            if (testNode.test(selector)) {","                nodes.push(testNode);","            }","","            testNode = testNode.get('parentNode');","        }","","        range.traverse(function (node) {","           if (node.test(selector)) {","               nodes.push(node);","           }","        });","","        return Y.all(nodes);","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this.insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Wrapper for the native `queryCommandState()` and `queryCommandValue()`","    methods that uses the appropriate method for the given command type.","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return doc.queryCommandValue(name);","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.force=false] If `true`, the internal selection","            state will be updated regardless of if the selection changed.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var prevRange = this._selectedRange || null,","            newRange  = this.selection.range() || null,","            force     = options && options.force,","            silent    = options && options.silent;","","        if (!force && (","                newRange === prevRange || (","                    prevRange &&","                    prevRange.isEquivalent(newRange) &&","                    prevRange.toHTML() === newRange.toHTML()","                )","            )","        ) {","            return;","        }","","        this._selectedRange = newRange;","","        // Only fire an event if options.silent is falsy and the new range is","        // either null or is entirely inside this editor.","        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {","            this.fire(EVT_SELECTION_CHANGE, {","                prevRange: prevRange,","                range    : newRange,","                selection: this.selection","            });","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","","        this.fire(EVT_BLUR);","    },","","    /**","    Handles `copy` events on the editor.","","    @method _onCopy","    @param {EventFacade} e","    @protected","    **/","    _onCopy: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents = range.cloneContents().getHTML();","","        e.preventDefault();","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `cut` events on the editor.","","    @method _onCut","    @param {EventFacade} e","    @protected","    **/","    _onCut: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents;","","        // expand the range to prevent any empty nodes","        // being left after `extractContents()`","        range.expand({stopAt: this._inputNode});","        contents = range.extractContents().getHTML();","","        e.preventDefault();","","        this.selection.select(range);","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `dblclick` events on the editor.","","    @method _onDblClick","    @protected","    **/","    _onDblClick: function() {","        var range = this.selection.range();","","        this.selection.select(range.shrink({trim: true}));","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this,","            selection = this.selection,","            range;","","        if (!this._rendered) {","            return;","        }","","        // restore the previously selected range","        if (!(range = this._selectedRange)) {","            range = new Y.Range();","            range.selectNode(this._inputNode).collapse({toStart: true});","        }","","        selection.select(range);","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","","        this.fire(EVT_FOCUS);","    },","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @param {EventFacade} e","    @protected","    **/","    _onPaste: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            contents = clipboard.getData('text'),","            selection = this.selection,","            range = selection.range();","","        e.preventDefault();","","        // treat pasted content as plain text, until we can do better client","        // side sanitization.","","        // convert unescaped html to nodes, then extract the text into a text node.","        //","        // `<div>foo</div> <div>bar</div>`","        //","        // will result in a text node:","        //","        // `foo bar`","        contents = Y.Node.create(contents); // document-fragment","        contents = doc.createTextNode(contents.get('text'));","","        if (!range.isCollapsed()) {","            // expanding the range before deleting contents makes sure","            // the entire node is deleted, if possible.","            range.expand({stopAt: this._inputNode});","","            range.deleteContents();","        }","","        range.insertNode(contents);","","        selection.select(range.collapse());","","        this._updateSelection({force: true});","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","Y.namespace('Editor').Base = EditorBase;","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"event-focus\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-selection\",","        \"view\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].lines = {"1":0,"5":0,"23":0,"32":0,"39":0,"46":0,"58":0,"60":0,"112":0,"113":0,"115":0,"117":0,"118":0,"121":0,"125":0,"127":0,"139":0,"140":0,"143":0,"158":0,"162":0,"163":0,"165":0,"166":0,"168":0,"169":0,"173":0,"176":0,"178":0,"179":0,"181":0,"184":0,"194":0,"195":0,"198":0,"211":0,"215":0,"216":0,"219":0,"220":0,"222":0,"224":0,"236":0,"250":0,"254":0,"255":0,"257":0,"258":0,"261":0,"264":0,"266":0,"267":0,"270":0,"281":0,"284":0,"286":0,"287":0,"291":0,"294":0,"295":0,"296":0,"297":0,"300":0,"302":0,"303":0,"305":0,"307":0,"309":0,"321":0,"322":0,"325":0,"328":0,"345":0,"346":0,"347":0,"361":0,"362":0,"365":0,"377":0,"391":0,"393":0,"395":0,"397":0,"398":0,"402":0,"407":0,"410":0,"411":0,"412":0,"415":0,"418":0,"419":0,"420":0,"424":0,"436":0,"447":0,"460":0,"472":0,"473":0,"476":0,"488":0,"489":0,"492":0,"509":0,"514":0,"522":0,"525":0,"529":0,"530":0,"547":0,"548":0,"551":0,"553":0,"564":0,"568":0,"570":0,"572":0,"573":0,"575":0,"587":0,"593":0,"594":0,"596":0,"598":0,"600":0,"602":0,"603":0,"605":0,"616":0,"618":0,"628":0,"632":0,"633":0,"637":0,"638":0,"639":0,"642":0,"644":0,"646":0,"648":0,"649":0,"652":0,"663":0,"668":0,"680":0,"681":0,"683":0,"686":0,"688":0,"691":0,"693":0,"695":0,"743":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].functions = {"(anonymous 2):117":0,"initializer:111":0,"destructor:124":0,"blur:138":0,"command:157":0,"focus:193":0,"insertHTML:210":0,"insertText:235":0,"query:249":0,"render:280":0,"_attachEvents:320":0,"_detachEvents:344":0,"_execCommand:360":0,"_getHTML:376":0,"(anonymous 3):418":0,"_getNodes:390":0,"_getText:435":0,"_insertTab:446":0,"_queryCommandValue:459":0,"_setHTML:471":0,"_setText:487":0,"_updateSelection:508":0,"_onBlur:546":0,"_onCopy:563":0,"_onCut:586":0,"_onDblClick:615":0,"(anonymous 4):648":0,"_onFocus:627":0,"_onPaste:662":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredLines = 153;
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
    getClassName = Y.ClassNameManager.getClassName,
    EDOM = Y.Editor.DOM;

/**
Fired after this editor loses focus.

@event blur
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 32);
var EVT_BLUR = 'blur';

/**
Fired after this editor receives focus.

@event focus
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 39);
var EVT_FOCUS = 'focus';

/**
Fired after this editor is rendered.

@event render
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 46);
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
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 58);
var EVT_SELECTION_CHANGE = 'selectionChange';

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 60);
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
    Hash of commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} commands
        @param {Function|String} commandFn
        @param {Function|String} [queryFn]
    **/
    commands: {},


    supportedTags: 'a, br, div, p, span',

    // -- Protected Properties -------------------------------------------------

    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "initializer", 111);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 112);
this.selection  = new Y.Selection();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 113);
this.selectors  = {};

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 115);
this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 117);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 2)", 117);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 118);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 121);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "destructor", 124);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 125);
this._detachEvents();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 127);
this.selection = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "blur", 138);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 139);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 140);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 143);
return this;
    },

    /**
    Gets and/or sets the value of the specified editor command.

    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>
    for a list of possible commands.

    @method command
    @param {String|Function} name Command name.
    @param {*} [value*]
    @return {*} Value of the specified command.
    **/
    command: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "command", 157);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 158);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 1, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 162);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 163);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 165);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 166);
fn = command.commandFn;

                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 168);
if (command.style) {
                    _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 169);
args.unshift(name);
                }
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 173);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 176);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 178);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 179);
ret = fn.apply(this, args);

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 181);
this._updateSelection({force: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 184);
return ret || this.query(name);
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "focus", 193);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 194);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 195);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 198);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "insertHTML", 210);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 211);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 215);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 216);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 219);
node = range.deleteContents().insertNode(node);
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 220);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 222);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 224);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "insertText", 235);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 236);
return this.insertHTML(doc.createTextNode(text));
    },

    /**
    Gets and/or sets the value of the specified editor command.

    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>
    for a list of possible commands.

    @method query
    @param {String|Function} name Command name.
    @return {*} Value of the specified command.
    **/
    query: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "query", 249);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 250);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 0, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 254);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 255);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 257);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 258);
fn = command.queryFn;
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 261);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 264);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 266);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 267);
ret = fn.apply(this, args);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 270);
return ret;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "render", 280);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 281);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 284);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 286);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 287);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 291);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 294);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 295);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 296);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 297);
inputNode.set('text', text);
        }}

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 300);
inputNode.set('contentEditable', true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 302);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 303);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 305);
this._updateSelection({silent: true});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 307);
this.fire(EVT_RENDER);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 309);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_attachEvents", 320);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 321);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 322);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 325);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 328);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_detachEvents", 344);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 345);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 346);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 347);
this._events = null;
        }
    },

    /**
    Wrapper for native the native `execCommand()` that verifies that the command
    is valid in the current state

    @method _execCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_execCommand", 360);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 361);
if (!doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 362);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 365);
doc.execCommand(name, false, value);
    },

    /**
    Getter for the `html` attribute.

    @method _getHTML
    @param {HTML} value Internal value.
    @return {HTML} HTML.
    @protected
    **/
    _getHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getHTML", 376);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 377);
return this._rendered ? this._inputNode.getHTML() : value;
    },

    /**
    Returns nodes containing any part of the given `range` matching the
    given `selector`

    @method _getNodes
    @param {Range} range
    @param {String} selector
    @return {NodeList}
    @protected
    **/
    _getNodes: function (range, selector) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getNodes", 390);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 391);
var testNode, nodes = [];

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 393);
range = range.clone().shrink();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 395);
testNode = range.startNode();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 397);
if (range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 398);
if (!EDOM.isTextNode(testNode)) {
                // the range is collapsed so it will never get traversed. grab
                // the exact node referenced by startNode/startOffset and work
                // backwards from there
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 402);
testNode = testNode.get('childNodes').item(range.startOffset());
            }
        } else {
            // traversal will include the startNode, so start off with the
            // startNodes parent
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 407);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 410);
while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 411);
if (testNode.test(selector)) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 412);
nodes.push(testNode);
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 415);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 418);
range.traverse(function (node) {
           _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 3)", 418);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 419);
if (node.test(selector)) {
               _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 420);
nodes.push(node);
           }
        });

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 424);
return Y.all(nodes);
    },

    /**
    Getter for the `text` attribute.

    @method _getText
    @param {String} value Internal value.
    @return {String} Text.
    @protected
    **/
    _getText: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getText", 435);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 436);
return this._rendered ? this._inputNode.get('text') : value;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertTab", 446);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 447);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_queryCommandValue", 459);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 460);
return doc.queryCommandValue(name);
    },

    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setHTML", 471);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 472);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 473);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 476);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setText", 487);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 488);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 489);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 492);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_updateSelection", 508);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 509);
var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            force     = options && options.force,
            silent    = options && options.silent;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 514);
if (!force && (
                newRange === prevRange || (
                    prevRange &&
                    prevRange.isEquivalent(newRange) &&
                    prevRange.toHTML() === newRange.toHTML()
                )
            )
        ) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 522);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 525);
this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 529);
if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 530);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onBlur", 546);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 547);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 548);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 551);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 553);
this.fire(EVT_BLUR);
    },

    /**
    Handles `copy` events on the editor.

    @method _onCopy
    @param {EventFacade} e
    @protected
    **/
    _onCopy: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCopy", 563);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 564);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents = range.cloneContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 568);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 570);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 572);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 573);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 575);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCut", 586);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 587);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents;

        // expand the range to prevent any empty nodes
        // being left after `extractContents()`
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 593);
range.expand({stopAt: this._inputNode});
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 594);
contents = range.extractContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 596);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 598);
this.selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 600);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 602);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 603);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 605);
clipboard.setData('text', contents);
        }
    },

    /**
    Handles `dblclick` events on the editor.

    @method _onDblClick
    @protected
    **/
    _onDblClick: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onDblClick", 615);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 616);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 618);
this.selection.select(range.shrink({trim: true}));
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onFocus", 627);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 628);
var self = this,
            selection = this.selection,
            range;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 632);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 633);
return;
        }

        // restore the previously selected range
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 637);
if (!(range = this._selectedRange)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 638);
range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 639);
range.selectNode(this._inputNode).collapse({toStart: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 642);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 644);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 646);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 648);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 4)", 648);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 649);
self._updateSelection();
        }, 200);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 652);
this.fire(EVT_FOCUS);
    },

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onPaste", 662);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 663);
var clipboard = e._event.clipboardData || win.clipboardData,
            contents = clipboard.getData('text'),
            selection = this.selection,
            range = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 668);
e.preventDefault();

        // treat pasted content as plain text, until we can do better client
        // side sanitization.

        // convert unescaped html to nodes, then extract the text into a text node.
        //
        // `<div>foo</div> <div>bar</div>`
        //
        // will result in a text node:
        //
        // `foo bar`
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 680);
contents = Y.Node.create(contents); // document-fragment
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 681);
contents = doc.createTextNode(contents.get('text'));

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 683);
if (!range.isCollapsed()) {
            // expanding the range before deleting contents makes sure
            // the entire node is deleted, if possible.
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 686);
range.expand({stopAt: this._inputNode});

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 688);
range.deleteContents();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 691);
range.insertNode(contents);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 693);
selection.select(range.collapse());

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 695);
this._updateSelection({force: true});
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

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 743);
Y.namespace('Editor').Base = EditorBase;


}, '@VERSION@', {
    "requires": [
        "base-build",
        "classnamemanager",
        "event-focus",
        "gallery-sm-editor-dom",
        "gallery-sm-selection",
        "view"
    ]
});
