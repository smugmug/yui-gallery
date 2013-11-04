YUI.add('gallery-sm-editor-undo', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Undo` extension.

@module gallery-sm-editor
**/

/**
Extension for `Editor.Base` that adds a cross-browser undo/redo stack.

When mixed into an editor that also mixes in the `Editor.Keys` extension, handy
undo/redo keyboard shortcuts and triggers will be added as well.

@class Editor.Undo
@extends Base
@extensionfor Editor.Base
**/

var EditorUndo = Y.Base.create('editorUndo', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Key commands related to undo/redo functionality.

    @property {Object} undoKeyCommands
    **/
    undoKeyCommands: {
        // Undo/redo.
        'ctrl+z'      : 'undo',
        'ctrl+shift+z': 'redo',

        // Store an undo entry on these triggers.
        'backspace': {fn: '_addUndo', allowDefault: true},
        'ctrl+x'   : {fn: '_addUndo', allowDefault: true},
        'ctrl+v'   : {fn: '_addUndo', allowDefault: true},
        'delete'   : {fn: '_addUndo', allowDefault: true},
        'enter'    : {fn: '_addUndo', allowDefault: true, async: true},
        '.'        : {fn: '_addUndo', allowDefault: true, async: true},
        'shift+!'  : {fn: '_addUndo', allowDefault: true, async: true},
        'shift+?'  : {fn: '_addUndo', allowDefault: true, async: true}
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
        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.undoKeyCommands);
        }

        this._redoStack = [];
        this._undoStack = [];

        Y.Do.before(this._addUndo, this, 'insertHTML', this);
        Y.Do.before(this._beforeExecCommand, this, '_execCommand', this);

        this._attachUndoEvents();
    },

    destructor: function () {
        this._detachUndoEvents();

        this._redoStack = null;
        this._undoStack = null;
    },

    // -- Public Methods -------------------------------------------------------

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
    Attaches undo events.

    @method _attachUndoEvents
    @protected
    **/
    _attachUndoEvents: function () {
        if (this._undoEvents) {
            return;
        }

        this._undoEvents = [
            this.after('render', this._afterRender)
        ];
    },

    /**
    Wrapper for `Editor.Base#_execCommand()`.

    @method _beforeExecCommand
    @param {String} name Command name.
    @protected
    **/
    _beforeExecCommand: function (name) {
        if (!/^(?:redo|undo)$/i.test(name)) {
            this._addUndo();
        }
    },

    /**
    Detaches undo events.

    @method _detachUndoEvents
    @protected
    **/
    _detachUndoEvents: function () {
        if (this._undoEvents) {
            new Y.EventHandle(this._undoEvents).detach();
            this._undoEvents = null;
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles editor `render` events.

    @method _afterRender
    @protected
    **/
    _afterRender: function () {
        this._addUndo();
    }
}, {
    ATTRS: {
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

Y.namespace('Editor').Undo = EditorUndo;


}, '@VERSION@', {
    "requires": [
        "base-build",
        "event-custom",
        "gallery-sm-editor-base",
        "gallery-sm-editor-keys",
        "gallery-sm-range"
    ]
});
