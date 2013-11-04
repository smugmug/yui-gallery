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
@extends Base
@extensionfor Editor.Base
**/

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
        this._attachKeyEvents();
    },

    destructor: function () {
        this._detachKeyEvents();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches keyboard events.

    @method _attachKeyEvents
    @protected
    **/
    _attachKeyEvents: function () {
        if (this._keyEvents) {
            return;
        }

        var container = this.get('container');

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
        if (this._keyEvents) {
            new Y.EventHandle(this._keyEvents).detach();
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
                args = [e, combo];

            if (typeof fn === 'string') {
                if (this.commands[fn]) {
                    args.unshift(fn);
                    fn = 'command';
                }

                fn = this[fn];
            }

            if (!handler.allowDefault) {
                e.preventDefault();
            }

            if (handler.async) {
                Y.later(0, this, fn, args);
            } else {
                fn.apply(this, args);
            }
        }
    }
});

Y.namespace('Editor').Keys = EditorKeys;


}, '@VERSION@', {"requires": ["base-build", "event-custom", "gallery-sm-editor-base", "node-event-delegate"]});
