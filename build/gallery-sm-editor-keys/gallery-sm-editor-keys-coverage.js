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
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-keys/gallery-sm-editor-keys.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].code=["YUI.add('gallery-sm-editor-keys', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Keys` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-keys","**/","","/**","Extension for `Editor.Base` that adds support for configurable keyboard","shortcuts, including a set of default shortcuts.","","@class Editor.Keys","@constructor","@extends Base","@extensionfor Editor.Base","**/","","var EditorKeys = Y.Base.create('editorKeys', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of keyCode values that should be ignored when processing keyboard","    events.","","    This is used to avoid double-handling of modifier keys, since other event","    properties are used to detect whether modifier keys are pressed.","","    @property {Object} ignoreKeyCodes","    **/","    ignoreKeyCodes: {","        16 : 'shift',","        17 : 'ctrl',      // Opera uses this keyCode for meta, which is fine","        18 : 'alt',","        91 : 'leftmeta',  // WebKit","        93 : 'rightmeta', // WebKit","        224: 'meta'       // Gecko","    },","","    /**","    Mapping of keyCode values to friendly names for special keys.","","    @property {Object} keyCodeMap","    **/","    keyCodeMap: {","        8  : 'backspace',","        9  : 'tab',","        13 : 'enter',","        27 : 'esc',","        32 : 'space',","        33 : 'pgup',","        34 : 'pgdown',","        35 : 'end',","        36 : 'home',","        37 : 'left',","        38 : 'up',","        39 : 'right',","        40 : 'down',","        46 : 'delete',","        49 : '!',","        61 : '=', // Gecko","        173: '-', // Gecko","        187: '=', // WebKit, IE","        189: '-', // WebKit, IE","        190: '.',","        191: '?',","        219: '[',","        221: ']'","    },","","    /**","    Mapping of shortcut keys to function handlers.","","    @property {Object} keyCommands","    **/","    keyCommands: {","        // The Ctrl key and the Cmd (meta) key are synonymous.","","        // Formatting.","        'ctrl+-': 'decreaseFontSize',","        'ctrl+=': 'increaseFontSize', // unshifted + key","        // TODO: 'ctrl+d': 'selectWord',","","        // Special cases.","        'tab': '_insertTab'","    },","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function () {","        this._attachKeyEvents();","    },","","    destructor: function () {","        this._detachKeyEvents();","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches keyboard events.","","    @method _attachKeyEvents","    @protected","    **/","    _attachKeyEvents: function () {","        if (this._keyEvents) {","            return;","        }","","        var container = this.get('container');","","        this._keyEvents = [","            container.delegate('keydown', this._onKeyDown, this.selectors.input, this)","        ];","    },","","    /**","    Detaches keyboard events.","","    @method _detachKeyEvents","    @protected","    **/","    _detachKeyEvents: function () {","        if (this._keyEvents) {","            new Y.EventHandle(this._keyEvents).detach();","            this._keyEvents = null;","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `keydown` events on this editor.","","    @method _onKeyDown","    @param {EventFacade} e","    @protected","    **/","    _onKeyDown: function (e) {","        var keyCode = e.keyCode;","","        // Ignore individual modifier keys, since we don't care about them until","        // another key is also depressed.","        if (this.ignoreKeyCodes[keyCode]) {","            return;","        }","","        var combo = [];","","        if (e.altKey)               { combo.push('alt'); }","        if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }","        if (e.shiftKey)             { combo.push('shift'); }","","        combo.push(this.keyCodeMap[keyCode] ||","                String.fromCharCode(keyCode).toLowerCase());","","        var handler = this.keyCommands[combo.join('+')];","","        if (handler) {","            var fn   = handler.fn || handler,","                args = [e, combo];","","            if (typeof fn === 'string') {","                if (this.commands[fn]) {","                    args.unshift(fn);","                    fn = 'command';","                }","","                fn = this[fn];","            }","","            if (!handler.allowDefault) {","                e.preventDefault();","            }","","            if (handler.async) {","                Y.later(0, this, fn, args);","            } else {","                fn.apply(this, args);","            }","        }","    }","});","","Y.namespace('Editor').Keys = EditorKeys;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\"]});"];
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].lines = {"1":0,"22":0,"93":0,"97":0,"109":0,"110":0,"113":0,"115":0,"127":0,"128":0,"129":0,"143":0,"147":0,"148":0,"151":0,"153":0,"154":0,"155":0,"157":0,"160":0,"162":0,"163":0,"166":0,"167":0,"168":0,"169":0,"172":0,"175":0,"176":0,"179":0,"180":0,"182":0,"188":0};
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].functions = {"initializer:92":0,"destructor:96":0,"_attachKeyEvents:108":0,"_detachKeyEvents:126":0,"_onKeyDown:142":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].coveredLines = 33;
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].coveredFunctions = 6;
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 1);
YUI.add('gallery-sm-editor-keys', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Keys` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-keys
**/

/**
Extension for `Editor.Base` that adds support for configurable keyboard
shortcuts, including a set of default shortcuts.

@class Editor.Keys
@constructor
@extends Base
@extensionfor Editor.Base
**/

_yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 22);
var EditorKeys = Y.Base.create('editorKeys', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

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
        // TODO: 'ctrl+d': 'selectWord',

        // Special cases.
        'tab': '_insertTab'
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "initializer", 92);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 93);
this._attachKeyEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "destructor", 96);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 97);
this._detachKeyEvents();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches keyboard events.

    @method _attachKeyEvents
    @protected
    **/
    _attachKeyEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "_attachKeyEvents", 108);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 109);
if (this._keyEvents) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 110);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 113);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 115);
this._keyEvents = [
            container.delegate('keydown', this._onKeyDown, this.selectors.input, this)
        ];
    },

    /**
    Detaches keyboard events.

    @method _detachKeyEvents
    @protected
    **/
    _detachKeyEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "_detachKeyEvents", 126);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 127);
if (this._keyEvents) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 128);
new Y.EventHandle(this._keyEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 129);
this._keyEvents = null;
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `keydown` events on this editor.

    @method _onKeyDown
    @param {EventFacade} e
    @protected
    **/
    _onKeyDown: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "_onKeyDown", 142);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 143);
var keyCode = e.keyCode;

        // Ignore individual modifier keys, since we don't care about them until
        // another key is also depressed.
        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 147);
if (this.ignoreKeyCodes[keyCode]) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 148);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 151);
var combo = [];

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 153);
if (e.altKey)               { combo.push('alt'); }
        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 154);
if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }
        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 155);
if (e.shiftKey)             { combo.push('shift'); }

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 157);
combo.push(this.keyCodeMap[keyCode] ||
                String.fromCharCode(keyCode).toLowerCase());

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 160);
var handler = this.keyCommands[combo.join('+')];

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 162);
if (handler) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 163);
var fn   = handler.fn || handler,
                args = [e, combo];

            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 166);
if (typeof fn === 'string') {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 167);
if (this.commands[fn]) {
                    _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 168);
args.unshift(fn);
                    _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 169);
fn = 'command';
                }

                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 172);
fn = this[fn];
            }

            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 175);
if (!handler.allowDefault) {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 176);
e.preventDefault();
            }

            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 179);
if (handler.async) {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 180);
Y.later(0, this, fn, args);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 182);
fn.apply(this, args);
            }
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 188);
Y.namespace('Editor').Keys = EditorKeys;


}, '@VERSION@', {"requires": ["gallery-sm-editor-base"]});
