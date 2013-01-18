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
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor/gallery-sm-editor.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].code=["YUI.add('gallery-sm-editor', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides `Y.Editor`, a simple but powerful WYSIWYG editor.","","@module gallery-sm-editor","@main gallery-sm-editor","**/","","/**","A simple but powerful WYSIWYG editor.","","@class Editor","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Fires when this editor's selection changes.","","@event selectionChange","@param {Range} newRange Range that's now selected, or `null`.","@param {Range} oldRange Range that was previously selected, or `null`.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","Y.Editor = Y.Base.create('editor', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    Hash of keyCode values that should be ignored when processing keyboard","    events.","","    This is used to avoid double-handling of modifier keys, since other event","    properties are used to detect whether modifier keys are pressed.","","    @property {Object} ignoreKeyCodes","    **/","    ignoreKeyCodes: {","        16 : 'shift',","        17 : 'ctrl',      // Opera uses this keyCode for meta, which is fine","        18 : 'alt',","        91 : 'leftmeta',  // WebKit","        93 : 'rightmeta', // WebKit","        224: 'meta'       // Gecko","    },","","    /**","    Mapping of keyCode values to friendly names for special keys.","","    @property {Object} keyCodeMap","    **/","    keyCodeMap: {","        8  : 'backspace',","        9  : 'tab',","        13 : 'enter',","        27 : 'esc',","        32 : 'space',","        33 : 'pgup',","        34 : 'pgdown',","        35 : 'end',","        36 : 'home',","        37 : 'left',","        38 : 'up',","        39 : 'right',","        40 : 'down',","        46 : 'delete',","        49 : '!',","        61 : '=', // Gecko","        173: '-', // Gecko","        187: '=', // WebKit, IE","        189: '-', // WebKit, IE","        190: '.',","        191: '?',","        219: '[',","        221: ']'","    },","","    /**","    Mapping of shortcut keys to function handlers.","","    @property {Object} keyCommands","    **/","    keyCommands: {","        // The Ctrl key and the Cmd (meta) key are synonymous.","","        // Formatting.","        'ctrl+-': 'decreaseFontSize',","        'ctrl+=': 'increaseFontSize', // unshifted + key","        'ctrl+b': 'bold',","        // TODO: 'ctrl+d': 'selectWord',","        'ctrl+i': 'italic',","        'ctrl+u': 'underline',","","        // Undo/redo.","        'ctrl+z'      : 'undo',","        'ctrl+shift+z': 'redo',","","        // Undo/redo state triggers.","        'backspace': {fn: '_addUndo', allowDefault: true},","        'ctrl+x'   : {fn: '_addUndo', allowDefault: true},","        'ctrl+v'   : {fn: '_addUndo', allowDefault: true},","        'delete'   : {fn: '_addUndo', allowDefault: true},","        'enter'    : {fn: '_addUndo', allowDefault: true, async: true},","        '.'        : {fn: '_addUndo', allowDefault: true, async: true},","        'shift+!'  : {fn: '_addUndo', allowDefault: true, async: true},","        'shift+?'  : {fn: '_addUndo', allowDefault: true, async: true},","","        // Special cases.","        'tab': '_insertTab'","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    should be strings specifying the style's type: either 'boolean' or 'string'.","","    @property {Object} styleCommands","    @param {String} [bold='boolean']","    @param {String} [italic='boolean']","    @param {String} [fontName='string']","    @param {String} [fontSize='string']","    @param {String} [underline='string']","    **/","    styleCommands: {","        bold     : 'boolean',","        italic   : 'boolean',","        fontName : 'string',","        fontSize : 'string',","        underline: 'boolean'","    },","","    // -- Protected Properties -------------------------------------------------","","    /**","    Array of redoable changes that have previously been undone.","","    @property {Array} _redoStack","    @protected","    **/","","    /**","    Array of undoable changes that have been made to this editor.","","    @property {Array} _undoStack","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._redoStack  = [];","        this._undoStack  = [];","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection  = null;","        this._redoStack = null;","        this._undoStack = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._inputNode) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Bolds or unbolds the current selection.","","    @method bold","    @chainable","    **/","    bold: function () {","        this.style('bold', 'toggle');","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String} name Command name.","    @param {Boolean|String|null} [value] Command value. Use the special value","        'toggle' to toggle a boolean command (like 'bold') to the opposite of","        its current state.","    @return {Boolean|String} Value of the specified command.","    **/","    command: function (name, value) {","        if (typeof value !== 'undefined') {","            this._execCommand(name, value);","        }","","        return this._queryCommandValue(name);","    },","","    /**","    Decreases the font size of the current selection (if possible).","","    @method decreaseFontSize","    @chainable","    **/","    decreaseFontSize: function () {","        var newSize = parseInt(this.style('fontSize'), 10) - 1;","","        if (newSize > 0) {","            this.style('fontSize', '' + newSize);","        }","","        return this;","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._inputNode) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Increases the font size of the current selection (if possible).","","    @method increaseFontSize","    @chainable","    **/","    increaseFontSize: function () {","        var newSize = parseInt(this.style('fontSize'), 10) + 1;","","        if (newSize < 8) {","            this.style('fontSize', '' + newSize);","        }","","        return this;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        this._addUndo();","","        node = range.deleteContents().insertNode(node);","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    insertText: function (text) {","        return this.insertHTML(doc.createTextNode(text));","    },","","    /**","    Italicizes or unitalicizes the current selection.","","    @method italic","    @chainable","    **/","    italic: function () {","        this.style('italic', 'toggle');","        return this;","    },","","    /**","    Redoes the last change that was undone in this editor.","","    @method redo","    @chainable","    **/","    redo: function () {","        var html = this._redoStack.pop();","","        if (typeof html !== 'string') {","            return this;","        }","","        // If the HTML on the stack is the same as what we've currently got,","        // recurse to pop the previous item off the stack.","        if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {","            return this.redo();","        }","","        this._addUndo();","        this._inputNode.setHTML(html);","","        // Restore the cursor position.","        var cursor = this._inputNode.one(this.selectors.cursor);","","        if (cursor) {","            var range = new Y.Range();","            range.startNode(cursor, 'after');","","            this.selection.select(range);","","            cursor.remove(true);","        }","","        return this;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        }","","        inputNode.set('contentEditable', true);","","        // Append the container to the body if it's not already in the document.","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this._updateSelection({silent: true});","        this._addUndo();","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor style command. This","    method is similar to `command()`, but only supports a subset of","    style-related commands.","","    See the `styleCommands` property for a list of supported style commands.","","    @method style","    @param {String} name Command name.","    @param {Boolean|String} [value] Command value. Use the special value","        'toggle' to toggle a boolean command (like 'bold') to the opposite of","        its current state.","    @return {Boolean|String} Value of the specified command.","    **/","    style: function (name, value) {","        if (!this.styleCommands.hasOwnProperty(name)) {","            Y.error('sm-editor: Unsupported style: ' + name);","            return;","        }","","        return this.command(name, value);","    },","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.style(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    /**","    Toggles underline on the current selection.","","    @method underline","    @chainable","    **/","    underline: function () {","        this.style('underline', 'toggle');","        return this;","    },","","    /**","    Undoes the last change made in this editor.","","    @method undo","    @chainable","    **/","    undo: function () {","        var html = this._undoStack.pop();","","        if (typeof html !== 'string') {","            return this;","        }","","        // If the HTML on the stack is the same as what we've currently got,","        // recurse to pop the previous item off the stack.","        if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {","            return this.undo();","        }","","        this._addRedo();","        this._inputNode.setHTML(html);","","        // Restore the cursor position.","        var cursor = this._inputNode.one(this.selectors.cursor);","","        if (cursor) {","            var range = new Y.Range();","            range.startNode(cursor, 'after');","","            this.selection.select(range);","","            cursor.remove(true);","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Adds an entry to the undo stack representing the current state of the","    editor.","","    @method _addUndo","    @protected","    **/","    _addUndo: function () {","        var range = this.selection.range(),","            stack = this._undoStack,","            cursor;","","        if (range) {","            // Insert a cursor marker at the beginning of the range so we can","            // restore the cursor position on undo.","            cursor = range.insertNode(Y.Node.create(this._cursorHTML));","            this.selection.select(range);","        }","","        var html = this._inputNode.getHTML();","","        if (cursor) {","            cursor.remove(true);","        }","","        if (stack.push(html) > this.get('undoLevels')) {","            stack.shift();","        }","    },","","    /**","    Adds an entry to the redo stack representing the current state of the","    editor.","","    @method _addRedo","    @protected","    **/","    _addRedo: function () {","        var range = this.selection.range(),","            stack = this._redoStack,","            cursor;","","        if (range) {","            // Insert a cursor marker at the beginning of the range so we can","            // restore the cursor position on redo.","            cursor = range.insertNode(Y.Node.create(this._cursorHTML));","            this.selection.select(range);","        }","","        var html = this._inputNode.getHTML();","","        if (cursor) {","            cursor.remove(true);","        }","","        if (stack.push(html) > this.get('undoLevels')) {","            stack.shift();","        }","    },","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur', this._onBlur, selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('keydown', this._onKeyDown, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state and normalizes boolean/toggleable values.","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        var type = this.styleCommands[name];","","        if (!doc.queryCommandEnabled(name)) {","            return;","        }","","        if (type === 'boolean') {","            // Only execute the command if the desired state differs from the","            // current state, or the desired state is 'toggle', indicating that","            // the command should be toggled regardless of its current state.","            if (value === 'toggle' || value !== this._queryCommandValue(name)) {","                this._addUndo();","                doc.execCommand(name, false, null);","            }","        } else {","            if (!/^(?:redo|undo)$/i.test(name)) {","                this._addUndo();","            }","","            doc.execCommand(name, false, value);","        }","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this.insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Wrapper for the native `queryCommandState()` and `queryCommandValue()`","    methods that uses the appropriate method for the given command type.","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return this.styleCommands[name] === 'boolean' ?","            !!doc.queryCommandState(name) : doc.queryCommandValue(name);","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var selection = this.selection,","            oldRange  = this._selectedRange,","            newRange  = selection.range(),","            changed;","","        if (oldRange) {","            changed = !newRange || oldRange.isEquivalent(newRange);","        } else if (newRange) {","            changed = true;","        }","","        if (changed) {","            this._selectedRange = newRange.isInsideNode(this._inputNode) ?","                newRange : null;","","            if (!(options && options.silent)) {","                this.fire(EVT_SELECTION_CHANGE, {","                    newRange : this._selectedRange,","                    oldRange : oldRange,","                    selection: this.selection","                });","            }","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","        this._updateSelection();","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this;","","        if (!this._rendered) {","            return;","        }","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","    },","","    /**","    Handles `keydown` events on the editor.","","    @method _onKeyDown","    @param {EventFacade} e","    @protected","    **/","    _onKeyDown: function (e) {","        var keyCode = e.keyCode;","","        // Ignore individual modifier keys, since we don't care about them until","        // another key is also depressed.","        if (this.ignoreKeyCodes[keyCode]) {","            return;","        }","","        var combo = [];","","        if (e.altKey)               { combo.push('alt'); }","        if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }","        if (e.shiftKey)             { combo.push('shift'); }","","        combo.push(this.keyCodeMap[keyCode] ||","                String.fromCharCode(keyCode).toLowerCase());","","        var handler = this.keyCommands[combo.join('+')];","","        if (handler) {","            var fn   = handler.fn || handler,","                self = this;","","            if (typeof fn === 'string') {","                fn = this[fn];","            }","","            if (!handler.allowDefault) {","                e.preventDefault();","            }","","            if (handler.async) {","                setTimeout(function () {","                    fn.call(self, e, combo);","                }, 0);","            } else {","                fn.call(this, e, combo);","            }","        }","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        },","","        /**","        Number of undo/redo levels to maintain. Lowering this number may reduce","        memory usage, especially when editing very large documents.","","        @attribute {Number} undoLevels","        @default 20","        **/","        undoLevels: {","            value: 20","        }","    }","});","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"event-focus\",","        \"gallery-sm-selection\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].lines = {"1":0,"20":0,"23":0,"33":0,"35":0,"189":0,"190":0,"192":0,"193":0,"194":0,"196":0,"197":0,"200":0,"204":0,"206":0,"207":0,"208":0,"220":0,"221":0,"224":0,"234":0,"235":0,"252":0,"253":0,"256":0,"266":0,"268":0,"269":0,"272":0,"282":0,"283":0,"286":0,"296":0,"298":0,"299":0,"302":0,"315":0,"319":0,"320":0,"323":0,"325":0,"326":0,"328":0,"330":0,"342":0,"352":0,"353":0,"363":0,"365":0,"366":0,"371":0,"372":0,"375":0,"376":0,"379":0,"381":0,"382":0,"383":0,"385":0,"387":0,"390":0,"401":0,"404":0,"406":0,"407":0,"411":0,"414":0,"415":0,"416":0,"417":0,"420":0,"423":0,"424":0,"427":0,"428":0,"430":0,"431":0,"433":0,"451":0,"452":0,"453":0,"456":0,"473":0,"476":0,"477":0,"478":0,"479":0,"483":0,"485":0,"486":0,"487":0,"492":0,"502":0,"503":0,"513":0,"515":0,"516":0,"521":0,"522":0,"525":0,"526":0,"529":0,"531":0,"532":0,"533":0,"535":0,"537":0,"540":0,"553":0,"557":0,"560":0,"561":0,"564":0,"566":0,"567":0,"570":0,"571":0,"583":0,"587":0,"590":0,"591":0,"594":0,"596":0,"597":0,"600":0,"601":0,"612":0,"613":0,"616":0,"619":0,"633":0,"634":0,"635":0,"649":0,"651":0,"652":0,"655":0,"659":0,"660":0,"661":0,"664":0,"665":0,"668":0,"681":0,"693":0,"704":0,"717":0,"730":0,"731":0,"734":0,"746":0,"747":0,"750":0,"765":0,"770":0,"771":0,"772":0,"773":0,"776":0,"777":0,"780":0,"781":0,"799":0,"800":0,"803":0,"804":0,"814":0,"816":0,"817":0,"820":0,"822":0,"824":0,"825":0,"837":0,"841":0,"842":0,"845":0,"847":0,"848":0,"849":0,"851":0,"854":0,"856":0,"857":0,"860":0,"861":0,"864":0,"865":0,"868":0,"869":0,"870":0,"873":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].functions = {"(anonymous 2):196":0,"initializer:188":0,"destructor:203":0,"blur:219":0,"bold:233":0,"command:251":0,"decreaseFontSize:265":0,"focus:281":0,"increaseFontSize:295":0,"insertHTML:314":0,"insertText:341":0,"italic:351":0,"redo:362":0,"render:400":0,"style:450":0,"styles:472":0,"underline:501":0,"undo:512":0,"_addUndo:552":0,"_addRedo:582":0,"_attachEvents:611":0,"_detachEvents:632":0,"_execCommand:648":0,"_getHTML:680":0,"_getText:692":0,"_insertTab:703":0,"_queryCommandValue:716":0,"_setHTML:729":0,"_setText:745":0,"_updateSelection:764":0,"_onBlur:798":0,"(anonymous 3):824":0,"_onFocus:813":0,"(anonymous 4):869":0,"_onKeyDown:836":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredLines = 192;
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredFunctions = 36;
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 1);
YUI.add('gallery-sm-editor', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides `Y.Editor`, a simple but powerful WYSIWYG editor.

@module gallery-sm-editor
@main gallery-sm-editor
**/

/**
A simple but powerful WYSIWYG editor.

@class Editor
@constructor
@extends View
**/

_yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 20);
var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 23);
Y.Node.DOM_EVENTS.paste = 1;

/**
Fires when this editor's selection changes.

@event selectionChange
@param {Range} newRange Range that's now selected, or `null`.
@param {Range} oldRange Range that was previously selected, or `null`.
@param {Selection} selection Reference to this editor's Selection instance.
**/
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 33);
var EVT_SELECTION_CHANGE = 'selectionChange';

_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 35);
Y.Editor = Y.Base.create('editor', Y.View, [], {
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
    Hash of keyCode values that should be ignored when processing keyboard
    events.

    This is used to avoid double-handling of modifier keys, since other event
    properties are used to detect whether modifier keys are pressed.

    @property {Object} ignoreKeyCodes
    **/
    ignoreKeyCodes: {
        16 : 'shift',
        17 : 'ctrl',      // Opera uses this keyCode for meta, which is fine
        18 : 'alt',
        91 : 'leftmeta',  // WebKit
        93 : 'rightmeta', // WebKit
        224: 'meta'       // Gecko
    },

    /**
    Mapping of keyCode values to friendly names for special keys.

    @property {Object} keyCodeMap
    **/
    keyCodeMap: {
        8  : 'backspace',
        9  : 'tab',
        13 : 'enter',
        27 : 'esc',
        32 : 'space',
        33 : 'pgup',
        34 : 'pgdown',
        35 : 'end',
        36 : 'home',
        37 : 'left',
        38 : 'up',
        39 : 'right',
        40 : 'down',
        46 : 'delete',
        49 : '!',
        61 : '=', // Gecko
        173: '-', // Gecko
        187: '=', // WebKit, IE
        189: '-', // WebKit, IE
        190: '.',
        191: '?',
        219: '[',
        221: ']'
    },

    /**
    Mapping of shortcut keys to function handlers.

    @property {Object} keyCommands
    **/
    keyCommands: {
        // The Ctrl key and the Cmd (meta) key are synonymous.

        // Formatting.
        'ctrl+-': 'decreaseFontSize',
        'ctrl+=': 'increaseFontSize', // unshifted + key
        'ctrl+b': 'bold',
        // TODO: 'ctrl+d': 'selectWord',
        'ctrl+i': 'italic',
        'ctrl+u': 'underline',

        // Undo/redo.
        'ctrl+z'      : 'undo',
        'ctrl+shift+z': 'redo',

        // Undo/redo state triggers.
        'backspace': {fn: '_addUndo', allowDefault: true},
        'ctrl+x'   : {fn: '_addUndo', allowDefault: true},
        'ctrl+v'   : {fn: '_addUndo', allowDefault: true},
        'delete'   : {fn: '_addUndo', allowDefault: true},
        'enter'    : {fn: '_addUndo', allowDefault: true, async: true},
        '.'        : {fn: '_addUndo', allowDefault: true, async: true},
        'shift+!'  : {fn: '_addUndo', allowDefault: true, async: true},
        'shift+?'  : {fn: '_addUndo', allowDefault: true, async: true},

        // Special cases.
        'tab': '_insertTab'
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

    /**
    Array of redoable changes that have previously been undone.

    @property {Array} _redoStack
    @protected
    **/

    /**
    Array of undoable changes that have been made to this editor.

    @property {Array} _undoStack
    @protected
    **/

    // -- Lifecycle ------------------------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "initializer", 188);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 189);
this.selection  = new Y.Selection();
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 190);
this.selectors  = {};

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 192);
this._redoStack  = [];
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 193);
this._undoStack  = [];
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 194);
this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 196);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 2)", 196);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 197);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 200);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "destructor", 203);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 204);
this._detachEvents();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 206);
this.selection  = null;
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 207);
this._redoStack = null;
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 208);
this._undoStack = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "blur", 219);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 220);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 221);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 224);
return this;
    },

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "bold", 233);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 234);
this.style('bold', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 235);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "command", 251);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 252);
if (typeof value !== 'undefined') {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 253);
this._execCommand(name, value);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 256);
return this._queryCommandValue(name);
    },

    /**
    Decreases the font size of the current selection (if possible).

    @method decreaseFontSize
    @chainable
    **/
    decreaseFontSize: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "decreaseFontSize", 265);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 266);
var newSize = parseInt(this.style('fontSize'), 10) - 1;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 268);
if (newSize > 0) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 269);
this.style('fontSize', '' + newSize);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 272);
return this;
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "focus", 281);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 282);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 283);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 286);
return this;
    },

    /**
    Increases the font size of the current selection (if possible).

    @method increaseFontSize
    @chainable
    **/
    increaseFontSize: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "increaseFontSize", 295);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 296);
var newSize = parseInt(this.style('fontSize'), 10) + 1;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 298);
if (newSize < 8) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 299);
this.style('fontSize', '' + newSize);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 302);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "insertHTML", 314);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 315);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 319);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 320);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 323);
this._addUndo();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 325);
node = range.deleteContents().insertNode(node);
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 326);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 328);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 330);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "insertText", 341);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 342);
return this.insertHTML(doc.createTextNode(text));
    },

    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "italic", 351);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 352);
this.style('italic', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 353);
return this;
    },

    /**
    Redoes the last change that was undone in this editor.

    @method redo
    @chainable
    **/
    redo: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "redo", 362);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 363);
var html = this._redoStack.pop();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 365);
if (typeof html !== 'string') {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 366);
return this;
        }

        // If the HTML on the stack is the same as what we've currently got,
        // recurse to pop the previous item off the stack.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 371);
if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 372);
return this.redo();
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 375);
this._addUndo();
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 376);
this._inputNode.setHTML(html);

        // Restore the cursor position.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 379);
var cursor = this._inputNode.one(this.selectors.cursor);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 381);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 382);
var range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 383);
range.startNode(cursor, 'after');

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 385);
this.selection.select(range);

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 387);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 390);
return this;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "render", 400);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 401);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 404);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 406);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 407);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 411);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 414);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 415);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 416);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 417);
inputNode.set('text', text);
        }}

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 420);
inputNode.set('contentEditable', true);

        // Append the container to the body if it's not already in the document.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 423);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 424);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 427);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 428);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 430);
this._updateSelection({silent: true});
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 431);
this._addUndo();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 433);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "style", 450);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 451);
if (!this.styleCommands.hasOwnProperty(name)) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 452);
Y.error('sm-editor: Unsupported style: ' + name);
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 453);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 456);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "styles", 472);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 473);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 476);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 477);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 478);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 479);
results[name] = this.style(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 483);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 485);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 486);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 487);
results[name] = this._queryCommandValue(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 492);
return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "underline", 501);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 502);
this.style('underline', 'toggle');
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 503);
return this;
    },

    /**
    Undoes the last change made in this editor.

    @method undo
    @chainable
    **/
    undo: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "undo", 512);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 513);
var html = this._undoStack.pop();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 515);
if (typeof html !== 'string') {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 516);
return this;
        }

        // If the HTML on the stack is the same as what we've currently got,
        // recurse to pop the previous item off the stack.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 521);
if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 522);
return this.undo();
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 525);
this._addRedo();
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 526);
this._inputNode.setHTML(html);

        // Restore the cursor position.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 529);
var cursor = this._inputNode.one(this.selectors.cursor);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 531);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 532);
var range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 533);
range.startNode(cursor, 'after');

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 535);
this.selection.select(range);

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 537);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 540);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Adds an entry to the undo stack representing the current state of the
    editor.

    @method _addUndo
    @protected
    **/
    _addUndo: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_addUndo", 552);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 553);
var range = this.selection.range(),
            stack = this._undoStack,
            cursor;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 557);
if (range) {
            // Insert a cursor marker at the beginning of the range so we can
            // restore the cursor position on undo.
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 560);
cursor = range.insertNode(Y.Node.create(this._cursorHTML));
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 561);
this.selection.select(range);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 564);
var html = this._inputNode.getHTML();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 566);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 567);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 570);
if (stack.push(html) > this.get('undoLevels')) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 571);
stack.shift();
        }
    },

    /**
    Adds an entry to the redo stack representing the current state of the
    editor.

    @method _addRedo
    @protected
    **/
    _addRedo: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_addRedo", 582);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 583);
var range = this.selection.range(),
            stack = this._redoStack,
            cursor;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 587);
if (range) {
            // Insert a cursor marker at the beginning of the range so we can
            // restore the cursor position on redo.
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 590);
cursor = range.insertNode(Y.Node.create(this._cursorHTML));
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 591);
this.selection.select(range);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 594);
var html = this._inputNode.getHTML();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 596);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 597);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 600);
if (stack.push(html) > this.get('undoLevels')) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 601);
stack.shift();
        }
    },

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_attachEvents", 611);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 612);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 613);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 616);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 619);
this._events = [
            container.delegate('blur', this._onBlur, selectors.input, this),
            container.delegate('focus', this._onFocus, selectors.input, this),
            container.delegate('keydown', this._onKeyDown, selectors.input, this)
        ];
    },

    /**
    Detaches editor events.

    @method _detachEvents
    @protected
    **/
    _detachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_detachEvents", 632);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 633);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 634);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 635);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_execCommand", 648);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 649);
var type = this.styleCommands[name];

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 651);
if (!doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 652);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 655);
if (type === 'boolean') {
            // Only execute the command if the desired state differs from the
            // current state, or the desired state is 'toggle', indicating that
            // the command should be toggled regardless of its current state.
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 659);
if (value === 'toggle' || value !== this._queryCommandValue(name)) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 660);
this._addUndo();
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 661);
doc.execCommand(name, false, null);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 664);
if (!/^(?:redo|undo)$/i.test(name)) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 665);
this._addUndo();
            }

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 668);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_getHTML", 680);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 681);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_getText", 692);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 693);
return this._rendered ? this._inputNode.get('text') : value;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_insertTab", 703);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 704);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_queryCommandValue", 716);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 717);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_setHTML", 729);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 730);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 731);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 734);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_setText", 745);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 746);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 747);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 750);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_updateSelection", 764);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 765);
var selection = this.selection,
            oldRange  = this._selectedRange,
            newRange  = selection.range(),
            changed;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 770);
if (oldRange) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 771);
changed = !newRange || oldRange.isEquivalent(newRange);
        } else {_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 772);
if (newRange) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 773);
changed = true;
        }}

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 776);
if (changed) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 777);
this._selectedRange = newRange.isInsideNode(this._inputNode) ?
                newRange : null;

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 780);
if (!(options && options.silent)) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 781);
this.fire(EVT_SELECTION_CHANGE, {
                    newRange : this._selectedRange,
                    oldRange : oldRange,
                    selection: this.selection
                });
            }
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `blur` events on the editor.

    @method _onBlur
    @protected
    **/
    _onBlur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_onBlur", 798);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 799);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 800);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 803);
clearInterval(this._selectionMonitor);
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 804);
this._updateSelection();
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_onFocus", 813);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 814);
var self = this;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 816);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 817);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 820);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 822);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 824);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 3)", 824);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 825);
self._updateSelection();
        }, 200);
    },

    /**
    Handles `keydown` events on the editor.

    @method _onKeyDown
    @param {EventFacade} e
    @protected
    **/
    _onKeyDown: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_onKeyDown", 836);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 837);
var keyCode = e.keyCode;

        // Ignore individual modifier keys, since we don't care about them until
        // another key is also depressed.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 841);
if (this.ignoreKeyCodes[keyCode]) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 842);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 845);
var combo = [];

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 847);
if (e.altKey)               { combo.push('alt'); }
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 848);
if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 849);
if (e.shiftKey)             { combo.push('shift'); }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 851);
combo.push(this.keyCodeMap[keyCode] ||
                String.fromCharCode(keyCode).toLowerCase());

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 854);
var handler = this.keyCommands[combo.join('+')];

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 856);
if (handler) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 857);
var fn   = handler.fn || handler,
                self = this;

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 860);
if (typeof fn === 'string') {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 861);
fn = this[fn];
            }

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 864);
if (!handler.allowDefault) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 865);
e.preventDefault();
            }

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 868);
if (handler.async) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 869);
setTimeout(function () {
                    _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 4)", 869);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 870);
fn.call(self, e, combo);
                }, 0);
            } else {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 873);
fn.call(this, e, combo);
            }
        }
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
        },

        /**
        Number of undo/redo levels to maintain. Lowering this number may reduce
        memory usage, especially when editing very large documents.

        @attribute {Number} undoLevels
        @default 20
        **/
        undoLevels: {
            value: 20
        }
    }
});


}, '@VERSION@', {
    "requires": [
        "base-build",
        "classnamemanager",
        "event-focus",
        "gallery-sm-selection",
        "view"
    ],
    "skinnable": true
});
