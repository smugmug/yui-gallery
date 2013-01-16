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

var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

Y.Node.DOM_EVENTS.paste = 1;

/**
Fires when this editor's selection changes.

@event selectionChange
@param {Range[]} newRanges Array of ranges that are now selected.
@param {Range[]} oldRanges Array of ranges that were selected before the
    selection changed.
@param {Selection} selection Reference to this editor's Selection instance.
**/
var EVT_SELECTION_CHANGE = 'selectionChange';

Y.Editor = Y.Base.create('editor', Y.View, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    CSS class names used by this editor.

    @property {Object} classNames
    @param {String} editor Class name used for the editor's container.
    @param {String} input Class name used for the WYSIWYG YUI Editor frame that
        will receive user input.
    **/
    classNames: {
        editor: getClassName('sm-editor', true),
        input : getClassName('sm-editor-input', true)
    },

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

    // -- Lifecycle ------------------------------------------------------------
    initializer: function () {
        this._updateSelection({silent: true});

        // Generate selectors based on configured class names.
        this.selectors = {};

        Y.Object.each(this.classNames, function (name, key) {
            this.selectors[key] = '.' + name;
        }, this);

        this._attachEvents();
    },

    destructor: function () {
        this._detachEvents();
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
    Gets and/or sets the value of the specified editor command.

    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>
    for a list of possible commands.

    @method command
    @param {String} name Command name.
    @param {Boolean|String} [value] Command value. Use the special value
        'toggle' to toggle a boolean command (like 'bold') to the opposite of
        its current state.
    @return {Boolean|String} Value of the specified command.
    **/
    command: function (name, value) {
        if (value) {
            this._execCommand(name, value);
        }

        return this._queryCommandValue(name);
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

    // -- Protected Methods ----------------------------------------------------

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
            container.delegate('blur',    this._onBlur,    selectors.input, this),
            container.delegate('focus',   this._onFocus,   selectors.input, this),
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
            return;
        }

        if (type === 'boolean') {
            // Only execute the command if the desired state differs from the
            // current state, or the desired state is 'toggle', indicating that
            // the command should be toggled regardless of its current state.
            if (value === 'toggle' || value !== this._queryCommandValue(name)) {
                doc.execCommand(name, false, null);
            }
        } else {
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
        var selection  = this._selection || (this._selection = new Y.Selection()),
            oldRanges  = this._selectedRanges,
            newRanges  = selection.ranges(),
            isInEditor = true;

        var changed, i, len;

        if (oldRanges && oldRanges.length === newRanges.length) {
            for (i = 0, len = oldRanges.length; i < len; i++) {
                if (!oldRanges[i].isEquivalent(newRanges[i])) {
                    changed = true;
                    break;
                }
            }
        } else {
            changed = true;
        }

        if (changed) {
            // Are all the selected ranges inside the editor?
            for (i = 0, len = newRanges.length; i < len; i++) {
                if (!newRanges[i].isInsideNode(this._inputNode)) {
                    isInEditor = false;
                    break;
                }
            }

            this._selectedRanges = isInEditor ? newRanges : [];

            if (!(options && options.silent)) {
                this.fire(EVT_SELECTION_CHANGE, {
                    newRanges: this._selectedRanges,
                    oldRanges: oldRanges,
                    selection: this._selection
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
        if (e.shiftKey || e.altKey || !(e.ctrlKey || e.metaKey)) {
            return;
        }

        switch (e.charCode) {
        case 66: // b
            this.style('bold', 'toggle');
            break;

        case 73: // i
            this.style('italic', 'toggle');
            break;

        case 85: // u
            this.style('underline', 'toggle');
            break;

        default:
            return;
        }

        e.preventDefault();
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
