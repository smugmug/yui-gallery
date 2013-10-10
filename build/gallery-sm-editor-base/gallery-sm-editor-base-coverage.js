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
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].code=["YUI.add('gallery-sm-editor-base', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.","","@module gallery-sm-editor","@submodule gallery-sm-editor-base","**/","","/**","Base implementation of the SmugMug editor. Provides core editor functionality,","but no undo stack, keyboard shortcuts, etc.","","@class Editor.Base","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName,","    EDOM = Y.Editor.DOM;","","/**","Fired after this editor loses focus.","","@event blur","**/","var EVT_BLUR = 'blur';","","/**","Fired after this editor receives focus.","","@event focus","**/","var EVT_FOCUS = 'focus';","","/**","Fired after this editor is rendered.","","@event render","**/","var EVT_RENDER = 'render';","","/**","Fired when this editor's selection changes.","","@event selectionChange","@param {Range} prevRange Range that was previously selected, or `null` if there","    was no previous selection.","@param {Range} range Range that's now selected, or `null` if the current","    selection is empty or outside the editor.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","var EditorBase = Y.Base.create('editorBase', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} commands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    commands: {","        insertHTML: {","            commandFn: '_insertHTML'","        },","","        insertText: {","            commandFn: '_insertText'","        }","    },","","","    supportedTags: 'a, br, div, p, span',","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._rendered) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String|Function} name Command name.","    @param {*} [value*]","    @return {*} Value of the specified command.","    **/","    command: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 1, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.commandFn;","","                if (command.style) {","                    args.unshift(name);","                }","            }","","            fn = this[fn];","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","","            this._updateSelection({force: true});","        }","","        return ret || this.query(name);","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._rendered) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method query","    @param {String|Function} name Command name.","    @return {*} Value of the specified command.","    **/","    query: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 0, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.queryFn;","            }","","            fn = this[fn];","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","        }","","        return ret;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        } else {","            inputNode.setHTML('<p><br></p>');","        }","","        inputNode.set('contentEditable', true);","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this.fire(EVT_RENDER);","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',  this._onBlur,  selectors.input, this),","            container.delegate('copy',  this._onCopy,  selectors.input, this),","            container.delegate('cut',  this._onCut,  selectors.input, this),","            container.delegate('dblclick', this._onDblClick, selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('paste', this._onPaste, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        if (!doc.queryCommandSupported(name) || !doc.queryCommandEnabled(name)) {","            return;","        }","","        doc.execCommand(name, false, value);","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Returns nodes containing any part of the given `range` matching the","    given `selector`","","    @method _getNodes","    @param {Range} range","    @param {String} selector","    @return {NodeList}","    @protected","    **/","    _getNodes: function (range, selector) {","        var startNode, startOffset,","            testNode, nodes = [];","","        range = range.clone().shrink();","","        startNode = range.startNode();","        startOffset = range.startOffset();","","        if (range.isCollapsed()) {","            var childNodes = startNode.get('childNodes');","","            if (!EDOM.isTextNode(startNode) && childNodes.item(startOffset - 1)) {","                // the range is collapsed so it will never get traversed. grab","                // the exact node referenced by startNode/startOffset and work","                // backwards from there","                testNode = childNodes.item(startOffset - 1);","            } else {","                testNode = startNode;","            }","        } else {","            // traversal will include the startNode, so start off with the","            // startNodes parent","            testNode = startNode.get('parentNode');","        }","","        while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {","            if (testNode.test(selector)) {","                nodes.push(testNode);","            }","","            testNode = testNode.get('parentNode');","        }","","        range.traverse(function (node) {","           if (node.test(selector)) {","               nodes.push(node);","           }","        });","","        return Y.all(nodes);","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method _insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    _insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        // expanding the range before deleting contents makes sure","        // the entire node is deleted, if possible.","        range.expand({stopAt: this._inputNode});","","        node = range.deleteContents().insertNode(node);","","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this._insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    _insertText: function (text) {","        return this._insertHTML(doc.createTextNode(text));","    },","","    /**","    Wrapper for the native `queryCommandValue()` method","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return doc.queryCommandSupported(name) ? doc.queryCommandValue(name) : null;","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.force=false] If `true`, the internal selection","            state will be updated regardless of if the selection changed.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var prevRange = this._selectedRange || null,","            newRange  = this.selection.range() || null,","            force     = options && options.force,","            silent    = options && options.silent;","","        if (!force && (","                newRange === prevRange || (","                    prevRange &&","                    prevRange.isEquivalent(newRange) &&","                    prevRange.toHTML() === newRange.toHTML()","                )","            )","        ) {","            return;","        }","","        this._selectedRange = newRange;","","        // Only fire an event if options.silent is falsy and the new range is","        // either null or is entirely inside this editor.","        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {","            this.fire(EVT_SELECTION_CHANGE, {","                prevRange: prevRange,","                range    : newRange,","                selection: this.selection","            });","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","","        this.fire(EVT_BLUR);","    },","","    /**","    Handles `copy` events on the editor.","","    @method _onCopy","    @param {EventFacade} e","    @protected","    **/","    _onCopy: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents = range.cloneContents().getHTML();","","        e.preventDefault();","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `cut` events on the editor.","","    @method _onCut","    @param {EventFacade} e","    @protected","    **/","    _onCut: function (e) {","        var clipboard = e._event.clipboardData || window.clipboardData,","            range = this.selection.range(),","            contents;","","        // expand the range to prevent any empty nodes","        // being left after `extractContents()`","        range.expand({stopAt: this._inputNode});","        contents = range.extractContents().getHTML();","","        e.preventDefault();","","        this.selection.select(range);","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `dblclick` events on the editor.","","    @method _onDblClick","    @protected","    **/","    _onDblClick: function() {","        var range = this.selection.range();","","        this.selection.select(range.shrink({trim: true}));","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this,","            selection = this.selection,","            range;","","        if (!this._rendered) {","            return;","        }","","        // restore the previously selected range, or create a new range","        if (!(range = this._selectedRange)) {","            var node = this._inputNode.get('firstChild') || this._inputNode;","","            range = new Y.Range();","            range.selectNodeContents(node);","            range.collapse({toStart: true});","        }","","        selection.select(range);","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","","        this.fire(EVT_FOCUS);","    },","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @param {EventFacade} e","    @protected","    **/","    _onPaste: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            contents = clipboard.getData('text');","","        e.preventDefault();","","        this.command('insertText', contents);","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","Y.namespace('Editor').Base = EditorBase;","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"event-focus\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-selection\",","        \"view\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].lines = {"1":0,"5":0,"23":0,"32":0,"39":0,"46":0,"58":0,"60":0,"120":0,"121":0,"123":0,"125":0,"126":0,"129":0,"133":0,"135":0,"147":0,"148":0,"151":0,"166":0,"170":0,"171":0,"173":0,"174":0,"176":0,"177":0,"181":0,"184":0,"186":0,"187":0,"189":0,"192":0,"202":0,"203":0,"206":0,"220":0,"224":0,"225":0,"227":0,"228":0,"231":0,"234":0,"236":0,"237":0,"240":0,"251":0,"254":0,"256":0,"257":0,"261":0,"264":0,"265":0,"266":0,"267":0,"269":0,"272":0,"274":0,"275":0,"277":0,"279":0,"291":0,"292":0,"295":0,"298":0,"315":0,"316":0,"317":0,"331":0,"332":0,"335":0,"347":0,"361":0,"364":0,"366":0,"367":0,"369":0,"370":0,"372":0,"376":0,"378":0,"383":0,"386":0,"387":0,"388":0,"391":0,"394":0,"395":0,"396":0,"400":0,"412":0,"425":0,"429":0,"430":0,"435":0,"437":0,"439":0,"441":0,"443":0,"454":0,"466":0,"478":0,"490":0,"491":0,"494":0,"506":0,"507":0,"510":0,"527":0,"532":0,"540":0,"543":0,"547":0,"548":0,"565":0,"566":0,"569":0,"571":0,"582":0,"586":0,"588":0,"590":0,"591":0,"593":0,"605":0,"611":0,"612":0,"614":0,"616":0,"618":0,"620":0,"621":0,"623":0,"634":0,"636":0,"646":0,"650":0,"651":0,"655":0,"656":0,"658":0,"659":0,"660":0,"663":0,"665":0,"667":0,"669":0,"670":0,"673":0,"684":0,"687":0,"689":0,"737":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].functions = {"(anonymous 2):125":0,"initializer:119":0,"destructor:132":0,"blur:146":0,"command:165":0,"focus:201":0,"query:219":0,"render:250":0,"_attachEvents:290":0,"_detachEvents:314":0,"_execCommand:330":0,"_getHTML:346":0,"(anonymous 3):394":0,"_getNodes:360":0,"_getText:411":0,"_insertHTML:424":0,"_insertTab:453":0,"_insertText:465":0,"_queryCommandValue:477":0,"_setHTML:489":0,"_setText:505":0,"_updateSelection:526":0,"_onBlur:564":0,"_onCopy:581":0,"_onCut:604":0,"_onDblClick:633":0,"(anonymous 4):669":0,"_onFocus:645":0,"_onPaste:683":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredLines = 152;
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
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 184);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 186);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 187);
ret = fn.apply(this, args);

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 189);
this._updateSelection({force: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 192);
return ret || this.query(name);
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "focus", 201);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 202);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 203);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 206);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "query", 219);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 220);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 0, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 224);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 225);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 227);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 228);
fn = command.queryFn;
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 231);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 234);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 236);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 237);
ret = fn.apply(this, args);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 240);
return ret;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "render", 250);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 251);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 254);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 256);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 257);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 261);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 264);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 265);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 266);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 267);
inputNode.set('text', text);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 269);
inputNode.setHTML('<p><br></p>');
        }}

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 272);
inputNode.set('contentEditable', true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 274);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 275);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 277);
this.fire(EVT_RENDER);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 279);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_attachEvents", 290);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 291);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 292);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 295);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 298);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_detachEvents", 314);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 315);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 316);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 317);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_execCommand", 330);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 331);
if (!doc.queryCommandSupported(name) || !doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 332);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 335);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getHTML", 346);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 347);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getNodes", 360);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 361);
var startNode, startOffset,
            testNode, nodes = [];

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 364);
range = range.clone().shrink();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 366);
startNode = range.startNode();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 367);
startOffset = range.startOffset();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 369);
if (range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 370);
var childNodes = startNode.get('childNodes');

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 372);
if (!EDOM.isTextNode(startNode) && childNodes.item(startOffset - 1)) {
                // the range is collapsed so it will never get traversed. grab
                // the exact node referenced by startNode/startOffset and work
                // backwards from there
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 376);
testNode = childNodes.item(startOffset - 1);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 378);
testNode = startNode;
            }
        } else {
            // traversal will include the startNode, so start off with the
            // startNodes parent
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 383);
testNode = startNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 386);
while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 387);
if (testNode.test(selector)) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 388);
nodes.push(testNode);
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 391);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 394);
range.traverse(function (node) {
           _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 3)", 394);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 395);
if (node.test(selector)) {
               _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 396);
nodes.push(node);
           }
        });

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 400);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getText", 411);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 412);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertHTML", 424);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 425);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 429);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 430);
return;
        }

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 435);
range.expand({stopAt: this._inputNode});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 437);
node = range.deleteContents().insertNode(node);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 439);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 441);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 443);
return node;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertTab", 453);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 454);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertText", 465);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 466);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_queryCommandValue", 477);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 478);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setHTML", 489);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 490);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 491);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 494);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setText", 505);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 506);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 507);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 510);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_updateSelection", 526);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 527);
var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            force     = options && options.force,
            silent    = options && options.silent;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 532);
if (!force && (
                newRange === prevRange || (
                    prevRange &&
                    prevRange.isEquivalent(newRange) &&
                    prevRange.toHTML() === newRange.toHTML()
                )
            )
        ) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 540);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 543);
this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 547);
if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 548);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onBlur", 564);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 565);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 566);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 569);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 571);
this.fire(EVT_BLUR);
    },

    /**
    Handles `copy` events on the editor.

    @method _onCopy
    @param {EventFacade} e
    @protected
    **/
    _onCopy: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCopy", 581);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 582);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents = range.cloneContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 586);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 588);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 590);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 591);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 593);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCut", 604);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 605);
var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents;

        // expand the range to prevent any empty nodes
        // being left after `extractContents()`
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 611);
range.expand({stopAt: this._inputNode});
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 612);
contents = range.extractContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 614);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 616);
this.selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 618);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 620);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 621);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 623);
clipboard.setData('text', contents);
        }
    },

    /**
    Handles `dblclick` events on the editor.

    @method _onDblClick
    @protected
    **/
    _onDblClick: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onDblClick", 633);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 634);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 636);
this.selection.select(range.shrink({trim: true}));
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onFocus", 645);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 646);
var self = this,
            selection = this.selection,
            range;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 650);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 651);
return;
        }

        // restore the previously selected range, or create a new range
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 655);
if (!(range = this._selectedRange)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 656);
var node = this._inputNode.get('firstChild') || this._inputNode;

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 658);
range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 659);
range.selectNodeContents(node);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 660);
range.collapse({toStart: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 663);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 665);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 667);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 669);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 4)", 669);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 670);
self._updateSelection();
        }, 200);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 673);
this.fire(EVT_FOCUS);
    },

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onPaste", 683);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 684);
var clipboard = e._event.clipboardData || win.clipboardData,
            contents = clipboard.getData('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 687);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 689);
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

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 737);
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
