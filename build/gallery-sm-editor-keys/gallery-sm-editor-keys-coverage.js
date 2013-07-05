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
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].code=["YUI.add('gallery-sm-editor-keys', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Keys` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-keys","**/","","/**","Extension for `Editor.Base` that adds support for configurable keyboard","shortcuts, including a set of default shortcuts.","","@class Editor.Keys","@constructor","@extends Base","@extensionfor Editor.Base","**/","","var EditorKeys = Y.Base.create('editorKeys', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of keyCode values that should be ignored when processing keyboard","    events.","","    This is used to avoid double-handling of modifier keys, since other event","    properties are used to detect whether modifier keys are pressed.","","    @property {Object} ignoreKeyCodes","    **/","    ignoreKeyCodes: {","        16 : 'shift',","        17 : 'ctrl',      // Opera uses this keyCode for meta, which is fine","        18 : 'alt',","        91 : 'leftmeta',  // WebKit","        93 : 'rightmeta', // WebKit","        224: 'meta'       // Gecko","    },","","    /**","    Mapping of keyCode values to friendly names for special keys.","","    @property {Object} keyCodeMap","    **/","    keyCodeMap: {","        8  : 'backspace',","        9  : 'tab',","        13 : 'enter',","        27 : 'esc',","        32 : 'space',","        33 : 'pgup',","        34 : 'pgdown',","        35 : 'end',","        36 : 'home',","        37 : 'left',","        38 : 'up',","        39 : 'right',","        40 : 'down',","        46 : 'delete',","        49 : '!',","        61 : '=', // Gecko","        173: '-', // Gecko","        187: '=', // WebKit, IE","        189: '-', // WebKit, IE","        190: '.',","        191: '?',","        219: '[',","        221: ']'","    },","","    /**","    Mapping of shortcut keys to function handlers.","","    @property {Object} keyCommands","    **/","    keyCommands: {","        // The Ctrl key and the Cmd (meta) key are synonymous.","","        // Formatting.","        'ctrl+-': 'decreaseFontSize',","        'ctrl+=': 'increaseFontSize', // unshifted + key","        'ctrl+b': 'bold',","        // TODO: 'ctrl+d': 'selectWord',","        'ctrl+i': 'italic',","        'ctrl+u': 'underline',","","        // Special cases.","        'tab': '_insertTab'","    },","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function () {","        this._attachKeyEvents();","    },","","    destructor: function () {","        this._detachKeyEvents();","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches keyboard events.","","    @method _attachKeyEvents","    @protected","    **/","    _attachKeyEvents: function () {","        if (this._keyEvents) {","            return;","        }","","        var container = this.get('container');","","        this._keyEvents = [","            container.delegate('keydown', this._onKeyDown, this.selectors.input, this)","        ];","    },","","    /**","    Detaches keyboard events.","","    @method _detachKeyEvents","    @protected","    **/","    _detachKeyEvents: function () {","        if (this._keyEvents) {","            new Y.EventHandle(this._keyEvents).detach();","            this._keyEvents = null;","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `keydown` events on this editor.","","    @method _onKeyDown","    @param {EventFacade} e","    @protected","    **/","    _onKeyDown: function (e) {","        var keyCode = e.keyCode;","","        // Ignore individual modifier keys, since we don't care about them until","        // another key is also depressed.","        if (this.ignoreKeyCodes[keyCode]) {","            return;","        }","","        var combo = [];","","        if (e.altKey)               { combo.push('alt'); }","        if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }","        if (e.shiftKey)             { combo.push('shift'); }","","        combo.push(this.keyCodeMap[keyCode] ||","                String.fromCharCode(keyCode).toLowerCase());","","        var handler = this.keyCommands[combo.join('+')];","","        if (handler) {","            var fn   = handler.fn || handler,","                self = this;","","            if (typeof fn === 'string') {","                fn = this[fn];","            }","","            if (!handler.allowDefault) {","                e.preventDefault();","            }","","            if (handler.async) {","                setTimeout(function () {","                    fn.call(self, e, combo);","                }, 0);","            } else {","                fn.call(this, e, combo);","            }","        }","    }","});","","Y.namespace('Editor').Keys = EditorKeys;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\"]});"];
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].lines = {"1":0,"22":0,"96":0,"100":0,"112":0,"113":0,"116":0,"118":0,"130":0,"131":0,"132":0,"146":0,"150":0,"151":0,"154":0,"156":0,"157":0,"158":0,"160":0,"163":0,"165":0,"166":0,"169":0,"170":0,"173":0,"174":0,"177":0,"178":0,"179":0,"182":0,"188":0};
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].functions = {"initializer:95":0,"destructor:99":0,"_attachKeyEvents:111":0,"_detachKeyEvents:129":0,"(anonymous 2):178":0,"_onKeyDown:145":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].coveredLines = 31;
_yuitest_coverage["build/gallery-sm-editor-keys/gallery-sm-editor-keys.js"].coveredFunctions = 7;
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
        'ctrl+b': 'bold',
        // TODO: 'ctrl+d': 'selectWord',
        'ctrl+i': 'italic',
        'ctrl+u': 'underline',

        // Special cases.
        'tab': '_insertTab'
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "initializer", 95);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 96);
this._attachKeyEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "destructor", 99);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 100);
this._detachKeyEvents();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches keyboard events.

    @method _attachKeyEvents
    @protected
    **/
    _attachKeyEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "_attachKeyEvents", 111);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 112);
if (this._keyEvents) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 113);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 116);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 118);
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
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "_detachKeyEvents", 129);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 130);
if (this._keyEvents) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 131);
new Y.EventHandle(this._keyEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 132);
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
        _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "_onKeyDown", 145);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 146);
var keyCode = e.keyCode;

        // Ignore individual modifier keys, since we don't care about them until
        // another key is also depressed.
        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 150);
if (this.ignoreKeyCodes[keyCode]) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 151);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 154);
var combo = [];

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 156);
if (e.altKey)               { combo.push('alt'); }
        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 157);
if (e.ctrlKey || e.metaKey) { combo.push('ctrl'); }
        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 158);
if (e.shiftKey)             { combo.push('shift'); }

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 160);
combo.push(this.keyCodeMap[keyCode] ||
                String.fromCharCode(keyCode).toLowerCase());

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 163);
var handler = this.keyCommands[combo.join('+')];

        _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 165);
if (handler) {
            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 166);
var fn   = handler.fn || handler,
                self = this;

            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 169);
if (typeof fn === 'string') {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 170);
fn = this[fn];
            }

            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 173);
if (!handler.allowDefault) {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 174);
e.preventDefault();
            }

            _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 177);
if (handler.async) {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 178);
setTimeout(function () {
                    _yuitest_coverfunc("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", "(anonymous 2)", 178);
_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 179);
fn.call(self, e, combo);
                }, 0);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 182);
fn.call(this, e, combo);
            }
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-keys/gallery-sm-editor-keys.js", 188);
Y.namespace('Editor').Keys = EditorKeys;


}, '@VERSION@', {"requires": ["gallery-sm-editor-base"]});
