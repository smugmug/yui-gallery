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
_yuitest_coverage["build/gallery-sm-editor-undo/gallery-sm-editor-undo.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-undo/gallery-sm-editor-undo.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-undo/gallery-sm-editor-undo.js"].code=["YUI.add('gallery-sm-editor-undo', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Undo` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-undo","**/","","/**","Extension for `Editor.Base` that adds a cross-browser undo/redo stack.","","When mixed into an editor that also mixes in the `Editor.Keys` extension, handy","undo/redo keyboard shortcuts and triggers will be added as well.","","@class Editor.Undo","@constructor","@extends Base","@extensionfor Editor.Base","**/","","var EditorUndo = Y.Base.create('editorUndo', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Key commands related to undo/redo functionality.","","    @property {Object} undoKeyCommands","    **/","    undoKeyCommands: {","        // Undo/redo.","        'ctrl+z'      : 'undo',","        'ctrl+shift+z': 'redo',","","        // Store an undo entry on these triggers.","        'backspace': {fn: '_addUndo', allowDefault: true},","        'ctrl+x'   : {fn: '_addUndo', allowDefault: true},","        'ctrl+v'   : {fn: '_addUndo', allowDefault: true},","        'delete'   : {fn: '_addUndo', allowDefault: true},","        'enter'    : {fn: '_addUndo', allowDefault: true, async: true},","        '.'        : {fn: '_addUndo', allowDefault: true, async: true},","        'shift+!'  : {fn: '_addUndo', allowDefault: true, async: true},","        'shift+?'  : {fn: '_addUndo', allowDefault: true, async: true}","    },","","    // -- Protected Properties -------------------------------------------------","","    /**","    Array of redoable changes that have previously been undone.","","    @property {Array} _redoStack","    @protected","    **/","","    /**","    Array of undoable changes that have been made to this editor.","","    @property {Array} _undoStack","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function () {","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.undoKeyCommands);","        }","","        this._redoStack = [];","        this._undoStack = [];","","        Y.Do.before(this._addUndo, this, 'insertHTML', this);","        Y.Do.before(this._beforeExecCommand, this, '_execCommand', this);","","        this._attachUndoEvents();","    },","","    destructor: function () {","        this._detachUndoEvents();","","        this._redoStack = null;","        this._undoStack = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Redoes the last change that was undone in this editor.","","    @method redo","    @chainable","    **/","    redo: function () {","        var html = this._redoStack.pop();","","        if (typeof html !== 'string') {","            return this;","        }","","        // If the HTML on the stack is the same as what we've currently got,","        // recurse to pop the previous item off the stack.","        if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {","            return this.redo();","        }","","        this._addUndo();","        this._inputNode.setHTML(html);","","        // Restore the cursor position.","        var cursor = this._inputNode.one(this.selectors.cursor);","","        if (cursor) {","            var range = new Y.Range();","            range.startNode(cursor, 'after');","","            this.selection.select(range);","","            cursor.remove(true);","        }","","        return this;","    },","","    /**","    Undoes the last change made in this editor.","","    @method undo","    @chainable","    **/","    undo: function () {","        var html = this._undoStack.pop();","","        if (typeof html !== 'string') {","            return this;","        }","","        // If the HTML on the stack is the same as what we've currently got,","        // recurse to pop the previous item off the stack.","        if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {","            return this.undo();","        }","","        this._addRedo();","        this._inputNode.setHTML(html);","","        // Restore the cursor position.","        var cursor = this._inputNode.one(this.selectors.cursor);","","        if (cursor) {","            var range = new Y.Range();","            range.startNode(cursor, 'after');","","            this.selection.select(range);","","            cursor.remove(true);","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Adds an entry to the undo stack representing the current state of the","    editor.","","    @method _addUndo","    @protected","    **/","    _addUndo: function () {","        var range = this.selection.range(),","            stack = this._undoStack,","            cursor;","","        if (range) {","            // Insert a cursor marker at the beginning of the range so we can","            // restore the cursor position on undo.","            cursor = range.insertNode(Y.Node.create(this._cursorHTML));","            this.selection.select(range);","        }","","        var html = this._inputNode.getHTML();","","        if (cursor) {","            cursor.remove(true);","        }","","        if (stack.push(html) > this.get('undoLevels')) {","            stack.shift();","        }","    },","","    /**","    Adds an entry to the redo stack representing the current state of the","    editor.","","    @method _addRedo","    @protected","    **/","    _addRedo: function () {","        var range = this.selection.range(),","            stack = this._redoStack,","            cursor;","","        if (range) {","            // Insert a cursor marker at the beginning of the range so we can","            // restore the cursor position on redo.","            cursor = range.insertNode(Y.Node.create(this._cursorHTML));","            this.selection.select(range);","        }","","        var html = this._inputNode.getHTML();","","        if (cursor) {","            cursor.remove(true);","        }","","        if (stack.push(html) > this.get('undoLevels')) {","            stack.shift();","        }","    },","","    /**","    Attaches undo events.","","    @method _attachUndoEvents","    @protected","    **/","    _attachUndoEvents: function () {","        if (this._undoEvents) {","            return;","        }","","        this._undoEvents = [","            this.after('render', this._afterRender)","        ];","    },","","    /**","    Wrapper for `Editor.Base#_execCommand()`.","","    @method _beforeExecCommand","    @param {String} name Command name.","    @protected","    **/","    _beforeExecCommand: function (name) {","        if (!/^(?:redo|undo)$/i.test(name)) {","            this._addUndo();","        }","    },","","    /**","    Detaches undo events.","","    @method _detachUndoEvents","    @protected","    **/","    _detachUndoEvents: function () {","        if (this._undoEvents) {","            new Y.EventHandle(this._undoEvents).detach();","            this._undoEvents = null;","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles editor `render` events.","","    @method _afterRender","    @protected","    **/","    _afterRender: function () {","        this._addUndo();","    }","}, {","    ATTRS: {","        /**","        Number of undo/redo levels to maintain. Lowering this number may reduce","        memory usage, especially when editing very large documents.","","        @attribute {Number} undoLevels","        @default 20","        **/","        undoLevels: {","            value: 20","        }","    }","});","","Y.namespace('Editor').Undo = EditorUndo;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\"]});"];
_yuitest_coverage["build/gallery-sm-editor-undo/gallery-sm-editor-undo.js"].lines = {"1":0,"24":0,"66":0,"67":0,"70":0,"71":0,"73":0,"74":0,"76":0,"80":0,"82":0,"83":0,"95":0,"97":0,"98":0,"103":0,"104":0,"107":0,"108":0,"111":0,"113":0,"114":0,"115":0,"117":0,"119":0,"122":0,"132":0,"134":0,"135":0,"140":0,"141":0,"144":0,"145":0,"148":0,"150":0,"151":0,"152":0,"154":0,"156":0,"159":0,"172":0,"176":0,"179":0,"180":0,"183":0,"185":0,"186":0,"189":0,"190":0,"202":0,"206":0,"209":0,"210":0,"213":0,"215":0,"216":0,"219":0,"220":0,"231":0,"232":0,"235":0,"248":0,"249":0,"260":0,"261":0,"262":0,"275":0,"292":0};
_yuitest_coverage["build/gallery-sm-editor-undo/gallery-sm-editor-undo.js"].functions = {"initializer:65":0,"destructor:79":0,"redo:94":0,"undo:131":0,"_addUndo:171":0,"_addRedo:201":0,"_attachUndoEvents:230":0,"_beforeExecCommand:247":0,"_detachUndoEvents:259":0,"_afterRender:274":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-undo/gallery-sm-editor-undo.js"].coveredLines = 68;
_yuitest_coverage["build/gallery-sm-editor-undo/gallery-sm-editor-undo.js"].coveredFunctions = 11;
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 1);
YUI.add('gallery-sm-editor-undo', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Undo` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-undo
**/

/**
Extension for `Editor.Base` that adds a cross-browser undo/redo stack.

When mixed into an editor that also mixes in the `Editor.Keys` extension, handy
undo/redo keyboard shortcuts and triggers will be added as well.

@class Editor.Undo
@constructor
@extends Base
@extensionfor Editor.Base
**/

_yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 24);
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
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "initializer", 65);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 66);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 67);
this.keyCommands = Y.merge(this.keyCommands, this.undoKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 70);
this._redoStack = [];
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 71);
this._undoStack = [];

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 73);
Y.Do.before(this._addUndo, this, 'insertHTML', this);
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 74);
Y.Do.before(this._beforeExecCommand, this, '_execCommand', this);

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 76);
this._attachUndoEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "destructor", 79);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 80);
this._detachUndoEvents();

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 82);
this._redoStack = null;
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 83);
this._undoStack = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Redoes the last change that was undone in this editor.

    @method redo
    @chainable
    **/
    redo: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "redo", 94);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 95);
var html = this._redoStack.pop();

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 97);
if (typeof html !== 'string') {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 98);
return this;
        }

        // If the HTML on the stack is the same as what we've currently got,
        // recurse to pop the previous item off the stack.
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 103);
if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 104);
return this.redo();
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 107);
this._addUndo();
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 108);
this._inputNode.setHTML(html);

        // Restore the cursor position.
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 111);
var cursor = this._inputNode.one(this.selectors.cursor);

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 113);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 114);
var range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 115);
range.startNode(cursor, 'after');

            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 117);
this.selection.select(range);

            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 119);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 122);
return this;
    },

    /**
    Undoes the last change made in this editor.

    @method undo
    @chainable
    **/
    undo: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "undo", 131);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 132);
var html = this._undoStack.pop();

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 134);
if (typeof html !== 'string') {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 135);
return this;
        }

        // If the HTML on the stack is the same as what we've currently got,
        // recurse to pop the previous item off the stack.
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 140);
if (html.replace(this._cursorHTML, '') === this._inputNode.getHTML()) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 141);
return this.undo();
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 144);
this._addRedo();
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 145);
this._inputNode.setHTML(html);

        // Restore the cursor position.
        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 148);
var cursor = this._inputNode.one(this.selectors.cursor);

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 150);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 151);
var range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 152);
range.startNode(cursor, 'after');

            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 154);
this.selection.select(range);

            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 156);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 159);
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
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "_addUndo", 171);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 172);
var range = this.selection.range(),
            stack = this._undoStack,
            cursor;

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 176);
if (range) {
            // Insert a cursor marker at the beginning of the range so we can
            // restore the cursor position on undo.
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 179);
cursor = range.insertNode(Y.Node.create(this._cursorHTML));
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 180);
this.selection.select(range);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 183);
var html = this._inputNode.getHTML();

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 185);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 186);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 189);
if (stack.push(html) > this.get('undoLevels')) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 190);
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
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "_addRedo", 201);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 202);
var range = this.selection.range(),
            stack = this._redoStack,
            cursor;

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 206);
if (range) {
            // Insert a cursor marker at the beginning of the range so we can
            // restore the cursor position on redo.
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 209);
cursor = range.insertNode(Y.Node.create(this._cursorHTML));
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 210);
this.selection.select(range);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 213);
var html = this._inputNode.getHTML();

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 215);
if (cursor) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 216);
cursor.remove(true);
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 219);
if (stack.push(html) > this.get('undoLevels')) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 220);
stack.shift();
        }
    },

    /**
    Attaches undo events.

    @method _attachUndoEvents
    @protected
    **/
    _attachUndoEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "_attachUndoEvents", 230);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 231);
if (this._undoEvents) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 232);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 235);
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
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "_beforeExecCommand", 247);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 248);
if (!/^(?:redo|undo)$/i.test(name)) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 249);
this._addUndo();
        }
    },

    /**
    Detaches undo events.

    @method _detachUndoEvents
    @protected
    **/
    _detachUndoEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "_detachUndoEvents", 259);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 260);
if (this._undoEvents) {
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 261);
new Y.EventHandle(this._undoEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 262);
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
        _yuitest_coverfunc("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", "_afterRender", 274);
_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 275);
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

_yuitest_coverline("build/gallery-sm-editor-undo/gallery-sm-editor-undo.js", 292);
Y.namespace('Editor').Undo = EditorUndo;


}, '@VERSION@', {"requires": ["gallery-sm-editor-base"]});
