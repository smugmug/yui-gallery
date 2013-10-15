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
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].code=["YUI.add('gallery-sm-editor-base', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.","","@module gallery-sm-editor","@submodule gallery-sm-editor-base","**/","","/**","Base implementation of the SmugMug editor. Provides core editor functionality,","but no undo stack, keyboard shortcuts, etc.","","@class Editor.Base","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName,","    EDOM = Y.Editor.DOM;","","/**","Fired after this editor loses focus.","","@event blur","**/","var EVT_BLUR = 'blur';","","/**","Fired after this editor receives focus.","","@event focus","**/","var EVT_FOCUS = 'focus';","","/**","Fired after this editor is rendered.","","@event render","**/","var EVT_RENDER = 'render';","","/**","Fired when this editor's selection changes.","","@event selectionChange","@param {Range} prevRange Range that was previously selected, or `null` if there","    was no previous selection.","@param {Range} range Range that's now selected, or `null` if the current","    selection is empty or outside the editor.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","var EditorBase = Y.Base.create('editorBase', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} commands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    commands: {","        insertHTML: {","            commandFn: '_insertHTML'","        },","","        insertText: {","            commandFn: '_insertText'","        }","    },","","","    supportedTags: 'a, br, div, p, span',","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._rendered) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String|Function} name Command name.","    @param {*} [value*]","    @return {*} Value of the specified command.","    **/","    command: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 1, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.commandFn;","","                if (command.style) {","                    args.unshift(name);","                }","            }","","            if ('string' === typeof fn) {","                fn = this[fn];","            }","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","","            this._updateSelection({force: true});","        }","","        return ret || this.query(name);","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._rendered) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method query","    @param {String|Function} name Command name.","    @return {*} Value of the specified command.","    **/","    query: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 0, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.queryFn;","            }","","            fn = this[fn];","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","        }","","        return ret;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        } else {","            inputNode.setHTML('<p><br></p>');","        }","","        inputNode.set('contentEditable', true);","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this.fire(EVT_RENDER);","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',  this._onBlur,  selectors.input, this),","            container.delegate('copy',  this._onCopy,  selectors.input, this),","            container.delegate('cut',  this._onCut,  selectors.input, this),","            container.delegate('dblclick', this._onDblClick, selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('paste', this._onPaste, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        if (!doc.queryCommandSupported(name) || !doc.queryCommandEnabled(name)) {","            return;","        }","","        doc.execCommand(name, false, value);","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Returns nodes containing any part of the given `range` matching the","    given `selector`","","    @method _getNodes","    @param {Range} range","    @param {String} selector","    @return {NodeList}","    @protected","    **/","    _getNodes: function (range, selector) {","        var startNode, startOffset,","            testNode, nodes = [];","","        range = range.clone().shrink();","","        startNode = range.startNode();","        startOffset = range.startOffset();","","        if (range.isCollapsed()) {","            var childNodes = startNode.get('childNodes');","","            if (!EDOM.isTextNode(startNode) && childNodes.item(startOffset - 1)) {","                // the range is collapsed so it will never get traversed. grab","                // the exact node referenced by startNode/startOffset and work","                // backwards from there","                testNode = childNodes.item(startOffset - 1);","            } else {","                testNode = startNode;","            }","        } else {","            // traversal will include the startNode, so start off with the","            // startNodes parent","            testNode = startNode.get('parentNode');","        }","","        while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {","            if (testNode.test(selector)) {","                nodes.push(testNode);","            }","","            testNode = testNode.get('parentNode');","        }","","        range.traverse(function (node) {","           if (node.test(selector)) {","               nodes.push(node);","           }","        });","","        return Y.all(nodes);","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method _insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    _insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        // expanding the range before deleting contents makes sure","        // the entire node is deleted, if possible.","        range.expand({stopAt: this._inputNode});","","        node = range.deleteContents().insertNode(node);","","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this._insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    _insertText: function (text) {","        return this._insertHTML(doc.createTextNode(text));","    },","","    /**","    Wrapper for the native `queryCommandValue()` method","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return doc.queryCommandSupported(name) ? doc.queryCommandValue(name) : null;","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.force=false] If `true`, the internal selection","            state will be updated regardless of if the selection changed.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var prevRange = this._selectedRange || null,","            newRange  = this.selection.range() || null,","            force     = options && options.force,","            silent    = options && options.silent;","","        if (!force && (","                newRange === prevRange || (","                    prevRange &&","                    prevRange.isEquivalent(newRange) &&","                    prevRange.toHTML() === newRange.toHTML()","                )","            )","        ) {","            return;","        }","","        this._selectedRange = newRange;","","        // Only fire an event if options.silent is falsy and the new range is","        // either null or is entirely inside this editor.","        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {","            this.fire(EVT_SELECTION_CHANGE, {","                prevRange: prevRange,","                range    : newRange,","                selection: this.selection","            });","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","","        this.fire(EVT_BLUR);","    },","","    /**","    Handles `copy` events on the editor.","","    @method _onCopy","    @param {EventFacade} e","    @protected","    **/","    _onCopy: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents = range.cloneContents().getHTML();","","        e.preventDefault();","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `cut` events on the editor.","","    @method _onCut","    @param {EventFacade} e","    @protected","    **/","    _onCut: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents;","","        // expand the range to prevent any empty nodes","        // being left after `extractContents()`","        range.expand({stopAt: this._inputNode});","        contents = range.extractContents().getHTML();","","        e.preventDefault();","","        this.selection.select(range);","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `dblclick` events on the editor.","","    @method _onDblClick","    @protected","    **/","    _onDblClick: function() {","        var range = this.selection.range();","","        this.selection.select(range.shrink({trim: true}));","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this,","            selection = this.selection,","            range;","","        if (!this._rendered) {","            return;","        }","","        // restore the previously selected range, or create a new range","        if (!(range = this._selectedRange)) {","            var node = this._inputNode.get('firstChild') || this._inputNode;","","            range = new Y.Range();","            range.selectNodeContents(node);","            range.collapse({toStart: true});","        }","","        selection.select(range);","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","","        this.fire(EVT_FOCUS);","    },","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @param {EventFacade} e","    @protected","    **/","    _onPaste: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            contents = clipboard.getData('text');","","        e.preventDefault();","","        this.command('insertText', contents);","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","Y.namespace('Editor').Base = EditorBase;","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"event-focus\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-selection\",","        \"view\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].lines = {"1":0,"5":0,"23":0,"32":0,"39":0,"46":0,"58":0,"60":0,"120":0,"121":0,"123":0,"125":0,"126":0,"129":0,"133":0,"135":0,"147":0,"148":0,"151":0,"166":0,"170":0,"171":0,"173":0,"174":0,"176":0,"177":0,"181":0,"182":0,"186":0,"188":0,"189":0,"191":0,"194":0,"204":0,"205":0,"208":0,"222":0,"226":0,"227":0,"229":0,"230":0,"233":0,"236":0,"238":0,"239":0,"242":0,"253":0,"256":0,"258":0,"259":0,"263":0,"266":0,"267":0,"268":0,"269":0,"271":0,"274":0,"276":0,"277":0,"279":0,"281":0,"293":0,"294":0,"297":0,"300":0,"317":0,"318":0,"319":0,"333":0,"334":0,"337":0,"349":0,"363":0,"366":0,"368":0,"369":0,"371":0,"372":0,"374":0,"378":0,"380":0,"385":0,"388":0,"389":0,"390":0,"393":0,"396":0,"397":0,"398":0,"402":0,"414":0,"427":0,"431":0,"432":0,"437":0,"439":0,"441":0,"443":0,"445":0,"456":0,"468":0,"480":0,"492":0,"493":0,"496":0,"508":0,"509":0,"512":0,"529":0,"534":0,"542":0,"545":0,"549":0,"550":0,"567":0,"568":0,"571":0,"573":0,"584":0,"588":0,"590":0,"592":0,"593":0,"595":0,"607":0,"613":0,"614":0,"616":0,"618":0,"620":0,"622":0,"623":0,"625":0,"636":0,"638":0,"648":0,"652":0,"653":0,"657":0,"658":0,"660":0,"661":0,"662":0,"665":0,"667":0,"669":0,"671":0,"672":0,"675":0,"686":0,"689":0,"691":0,"739":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].functions = {"(anonymous 2):125":0,"initializer:119":0,"destructor:132":0,"blur:146":0,"command:165":0,"focus:203":0,"query:221":0,"render:252":0,"_attachEvents:292":0,"_detachEvents:316":0,"_execCommand:332":0,"_getHTML:348":0,"(anonymous 3):396":0,"_getNodes:362":0,"_getText:413":0,"_insertHTML:426":0,"_insertTab:455":0,"_insertText:467":0,"_queryCommandValue:479":0,"_setHTML:491":0,"_setText:507":0,"_updateSelection:528":0,"_onBlur:566":0,"_onCopy:583":0,"_onCut:606":0,"_onDblClick:635":0,"(anonymous 4):671":0,"_onFocus:647":0,"_onPaste:685":0,"(anonymous 1):1":0};
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
    commands: {
        insertHTML: {
            commandFn: '_insertHTML'
        },

        insertText: {
            commandFn: '_insertText'
        }
    },


    supportedTags: 'a, br, div, p, span',

    // -- Protected Properties -------------------------------------------------

    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "initializer", 119);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 120);
this.selection  = new Y.Selection();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 121);
this.selectors  = {};

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 123);
this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 125);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 2)", 125);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 126);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 129);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "destructor", 132);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 133);
this._detachEvents();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 135);
this.selection = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "blur", 146);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 147);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 148);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 151);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "command", 165);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 166);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 1, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 170);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 171);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 173);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 174);
fn = command.commandFn;

                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 176);
if (command.style) {
                    _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 177);
args.unshift(name);
                }
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 181);
if ('string' === typeof fn) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 182);
fn = this[fn];
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 186);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 188);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 189);
ret = fn.apply(this, args);

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 191);
this._updateSelection({force: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 194);
return ret || this.query(name);
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "focus", 203);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 204);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 205);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 208);
return this;
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "query", 221);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 222);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 0, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 226);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 227);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 229);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 230);
fn = command.queryFn;
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 233);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 236);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 238);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 239);
ret = fn.apply(this, args);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 242);
return ret;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "render", 252);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 253);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 256);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 258);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 259);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 263);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 266);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 267);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 268);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 269);
inputNode.set('text', text);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 271);
inputNode.setHTML('<p><br></p>');
        }}

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 274);
inputNode.set('contentEditable', true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 276);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 277);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 279);
this.fire(EVT_RENDER);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 281);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_attachEvents", 292);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 293);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 294);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 297);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 300);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_detachEvents", 316);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 317);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 318);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 319);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_execCommand", 332);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 333);
if (!doc.queryCommandSupported(name) || !doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 334);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 337);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getHTML", 348);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 349);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getNodes", 362);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 363);
var startNode, startOffset,
            testNode, nodes = [];

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 366);
range = range.clone().shrink();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 368);
startNode = range.startNode();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 369);
startOffset = range.startOffset();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 371);
if (range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 372);
var childNodes = startNode.get('childNodes');

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 374);
if (!EDOM.isTextNode(startNode) && childNodes.item(startOffset - 1)) {
                // the range is collapsed so it will never get traversed. grab
                // the exact node referenced by startNode/startOffset and work
                // backwards from there
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 378);
testNode = childNodes.item(startOffset - 1);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 380);
testNode = startNode;
            }
        } else {
            // traversal will include the startNode, so start off with the
            // startNodes parent
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 385);
testNode = startNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 388);
while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 389);
if (testNode.test(selector)) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 390);
nodes.push(testNode);
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 393);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 396);
range.traverse(function (node) {
           _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 3)", 396);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 397);
if (node.test(selector)) {
               _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 398);
nodes.push(node);
           }
        });

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 402);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getText", 413);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 414);
return this._rendered ? this._inputNode.get('text') : value;
    },

    /**
    Inserts the specified _html_ at the current selection point, deleting the
    current selection if there is one.

    @method _insertHTML
    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML
        string, HTMLElement, or Node instance.
    @return {Node} Node instance representing the inserted HTML.
    **/
    _insertHTML: function (html) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertHTML", 426);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 427);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 431);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 432);
return;
        }

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 437);
range.expand({stopAt: this._inputNode});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 439);
node = range.deleteContents().insertNode(node);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 441);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 443);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 445);
return node;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertTab", 455);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 456);
this._insertHTML('<span style="white-space:pre;">\t</span>');
    },

    /**
    Inserts the specified plain _text_ at the current selection point, deleting
    the current selection if there is one.

    @method insertText
    @param {String} text Text to insert.
    @return {Node} Node instance representing the inserted text node.
    **/
    _insertText: function (text) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertText", 467);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 468);
return this._insertHTML(doc.createTextNode(text));
    },

    /**
    Wrapper for the native `queryCommandValue()` method

    @method _queryCommandValue
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryCommandValue: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_queryCommandValue", 479);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 480);
return doc.queryCommandSupported(name) ? doc.queryCommandValue(name) : null;
    },

    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setHTML", 491);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 492);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 493);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 496);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setText", 507);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 508);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 509);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 512);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_updateSelection", 528);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 529);
var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            force     = options && options.force,
            silent    = options && options.silent;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 534);
if (!force && (
                newRange === prevRange || (
                    prevRange &&
                    prevRange.isEquivalent(newRange) &&
                    prevRange.toHTML() === newRange.toHTML()
                )
            )
        ) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 542);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 545);
this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 549);
if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 550);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onBlur", 566);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 567);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 568);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 571);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 573);
this.fire(EVT_BLUR);
    },

    /**
    Handles `copy` events on the editor.

    @method _onCopy
    @param {EventFacade} e
    @protected
    **/
    _onCopy: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCopy", 583);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 584);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents = range.cloneContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 588);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 590);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 592);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 593);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 595);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCut", 606);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 607);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents;

        // expand the range to prevent any empty nodes
        // being left after `extractContents()`
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 613);
range.expand({stopAt: this._inputNode});
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 614);
contents = range.extractContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 616);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 618);
this.selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 620);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 622);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 623);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 625);
clipboard.setData('text', contents);
        }
    },

    /**
    Handles `dblclick` events on the editor.

    @method _onDblClick
    @protected
    **/
    _onDblClick: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onDblClick", 635);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 636);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 638);
this.selection.select(range.shrink({trim: true}));
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onFocus", 647);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 648);
var self = this,
            selection = this.selection,
            range;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 652);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 653);
return;
        }

        // restore the previously selected range, or create a new range
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 657);
if (!(range = this._selectedRange)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 658);
var node = this._inputNode.get('firstChild') || this._inputNode;

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 660);
range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 661);
range.selectNodeContents(node);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 662);
range.collapse({toStart: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 665);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 667);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 669);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 671);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 4)", 671);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 672);
self._updateSelection();
        }, 200);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 675);
this.fire(EVT_FOCUS);
    },

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onPaste", 685);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 686);
var clipboard = e._event.clipboardData || win.clipboardData,
            contents = clipboard.getData('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 689);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 691);
this.command('insertText', contents);
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

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 739);
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
