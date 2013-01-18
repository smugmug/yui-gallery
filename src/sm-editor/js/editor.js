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

var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

Y.Node.DOM_EVENTS.paste = 1;

/**
Fires when this editor's selection changes.

@event selectionChange
@param {Range} newRange Range that's now selected, or `null`.
@param {Range} oldRange Range that was previously selected, or `null`.
@param {Selection} selection Reference to this editor's Selection instance.
**/
var EVT_SELECTION_CHANGE = 'selectionChange';

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
        this.selection  = new Y.Selection();
        this.selectors  = {};

        this._redoStack  = [];
        this._undoStack  = [];
        this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        Y.Object.each(this.classNames, function (name, key) {
            this.selectors[key] = '.' + name;
        }, this);

        this._attachEvents();
    },

    destructor: function () {
        this._detachEvents();

        this.selection  = null;
        this._redoStack = null;
        this._undoStack = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        if (this._inputNode) {
            this._inputNode.blur();
        }

        return this;
    },

    /**
    Bolds or unbolds the current selection.

    @method bold
    @chainable
    **/
    bold: function () {
        this.style('bold', 'toggle');
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
        if (typeof value !== 'undefined') {
            this._execCommand(name, value);
        }

        return this._queryCommandValue(name);
    },

    /**
    Decreases the font size of the current selection (if possible).

    @method decreaseFontSize
    @chainable
    **/
    decreaseFontSize: function () {
        var newSize = parseInt(this.style('fontSize'), 10) - 1;

        if (newSize > 0) {
            this.style('fontSize', '' + newSize);
        }

        return this;
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        if (this._inputNode) {
            this._inputNode.focus();
        }

        return this;
    },

    /**
    Increases the font size of the current selection (if possible).

    @method increaseFontSize
    @chainable
    **/
    increaseFontSize: function () {
        var newSize = parseInt(this.style('fontSize'), 10) + 1;

        if (newSize < 8) {
            this.style('fontSize', '' + newSize);
        }

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
        var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        if (!range) {
            return;
        }

        this._addUndo();

        node = range.deleteContents().insertNode(node);
        range.collapse();

        selection.select(range);

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
        return this.insertHTML(doc.createTextNode(text));
    },

    /**
    Italicizes or unitalicizes the current selection.

    @method italic
    @chainable
    **/
    italic: function () {
        this.style('italic', 'toggle');
        return this;
    },

    /**
    Redoes the last change that was undone in this editor.

    @method redo
    @chainable
    **/
    redo: function () {
        var html = this._redoStack.pop();

        if (typeof html !== 'string') {
            return this;
        }

        // If the HTML on the stack is the same as what we've currently got,
        // recurse to pop the previous item off the stack.
        if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {
            return this.redo();
        }

        this._addUndo();
        this._inputNode.setHTML(html);

        // Restore the cursor position.
        var cursor = this._inputNode.one(this.selectors.cursor);

        if (cursor) {
            var range = new Y.Range();
            range.startNode(cursor, 'after');

            this.selection.select(range);

            cursor.remove(true);
        }

        return this;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        container.addClass(this.classNames.editor);

        if (!inputNode) {
            inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        var html = this.get('html'),
            text = this.get('text');

        if (html) {
            inputNode.setHTML(html);
        } else if (text) {
            inputNode.set('text', text);
        }

        inputNode.set('contentEditable', true);

        // Append the container to the body if it's not already in the document.
        if (!container.inDoc()) {
            Y.one('body').append(container);
        }

        this._inputNode = inputNode;
        this._rendered  = true;

        this._updateSelection({silent: true});
        this._addUndo();

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
        if (!this.styleCommands.hasOwnProperty(name)) {
            Y.error('sm-editor: Unsupported style: ' + name);
            return;
        }

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
        var results = {},
            name;

        if (styles) {
            for (name in styles) {
                if (styles.hasOwnProperty(name)) {
                    results[name] = this.style(name, styles[name]);
                }
            }
        } else {
            var commands = this.styleCommands;

            for (name in commands) {
                if (commands.hasOwnProperty(name)) {
                    results[name] = this._queryCommandValue(name);
                }
            }
        }

        return results;
    },

    /**
    Toggles underline on the current selection.

    @method underline
    @chainable
    **/
    underline: function () {
        this.style('underline', 'toggle');
        return this;
    },

    /**
    Undoes the last change made in this editor.

    @method undo
    @chainable
    **/
    undo: function () {
        var html = this._undoStack.pop();

        if (typeof html !== 'string') {
            return this;
        }

        // If the HTML on the stack is the same as what we've currently got,
        // recurse to pop the previous item off the stack.
        if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {
            return this.undo();
        }

        this._addRedo();
        this._inputNode.setHTML(html);

        // Restore the cursor position.
        var cursor = this._inputNode.one(this.selectors.cursor);

        if (cursor) {
            var range = new Y.Range();
            range.startNode(cursor, 'after');

            this.selection.select(range);

            cursor.remove(true);
        }

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
        var range = this.selection.range(),
            stack = this._undoStack,
            cursor;

        if (range) {
            // Insert a cursor marker at the beginning of the range so we can
            // restore the cursor position on undo.
            cursor = range.insertNode(Y.Node.create(this._cursorHTML));
            this.selection.select(range);
        }

        var html = this._inputNode.getHTML();

        if (cursor) {
            cursor.remove(true);
        }

        if (stack.push(html) > this.get('undoLevels')) {
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
        var range = this.selection.range(),
            stack = this._redoStack,
            cursor;

        if (range) {
            // Insert a cursor marker at the beginning of the range so we can
            // restore the cursor position on redo.
            cursor = range.insertNode(Y.Node.create(this._cursorHTML));
            this.selection.select(range);
        }

        var html = this._inputNode.getHTML();

        if (cursor) {
            cursor.remove(true);
        }

        if (stack.push(html) > this.get('undoLevels')) {
            stack.shift();
        }
    },

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        if (this._events) {
            return;
        }

        var container = this.get('container'),
            selectors = this.selectors;

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
        if (this._events) {
            new Y.EventHandle(this._events).detach();
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
        var type = this.styleCommands[name];

        if (!doc.queryCommandEnabled(name)) {
            Y.log('Command is not currently allowed: ' + name, 'warn', 'sm-editor');
            return;
        }

        if (type === 'boolean') {
            // Only execute the command if the desired state differs from the
            // current state, or the desired state is 'toggle', indicating that
            // the command should be toggled regardless of its current state.
            if (value === 'toggle' || value !== this._queryCommandValue(name)) {
                this._addUndo();
                doc.execCommand(name, false, null);
            }
        } else {
            if (!/^(?:redo|undo)$/i.test(name)) {
                this._addUndo();
            }

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
        return this._rendered ? this._inputNode.get('text') : value;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
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
        if (this._rendered) {
            this._inputNode.setHTML(value);
        }

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
        if (this._rendered) {
            this._inputNode.set('text', value);
        }

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
        var selection = this.selection,
            oldRange  = this._selectedRange,
            newRange  = selection.range(),
            changed;

        if (oldRange) {
            changed = !newRange || oldRange.isEquivalent(newRange);
        } else if (newRange) {
            changed = true;
        }

        if (changed) {
            this._selectedRange = newRange.isInsideNode(this._inputNode) ?
                newRange : null;

            if (!(options && options.silent)) {
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
        if (!this._rendered) {
            return;
        }

        clearInterval(this._selectionMonitor);
        this._updateSelection();
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        var self = this;

        if (!this._rendered) {
            return;
        }

        this._updateSelection();

        clearInterval(this._selectionMonitor);

        this._selectionMonitor = setInterval(function () {
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
        var keyCode = e.keyCode;

        // Ignore individual modifier keys, since we don't care about them until
        // another key is also depressed.
        if (this.ignoreKeyCodes[keyCode]) {
            return;
        }

        var combo = [];

        if (e.altKey)               { combo.push('alt'); }
        if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }
        if (e.shiftKey)             { combo.push('shift'); }

        combo.push(this.keyCodeMap[keyCode] ||
                String.fromCharCode(keyCode).toLowerCase());

        var handler = this.keyCommands[combo.join('+')];

        if (handler) {
            var fn   = handler.fn || handler,
                self = this;

            if (typeof fn === 'string') {
                fn = this[fn];
            }

            if (!handler.allowDefault) {
                e.preventDefault();
            }

            if (handler.async) {
                setTimeout(function () {
                    fn.call(self, e, combo);
                }, 0);
            } else {
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
