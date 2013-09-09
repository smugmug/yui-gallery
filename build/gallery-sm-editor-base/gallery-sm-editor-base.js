YUI.add('gallery-sm-editor-base', function (Y, NAME) {

/*jshint expr:true, onevar:false */

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

var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

/**
Fired after this editor loses focus.

@event blur
**/
var EVT_BLUR = 'blur';

/**
Fired after this editor receives focus.

@event focus
**/
var EVT_FOCUS = 'focus';

/**
Fired after this editor is rendered.

@event render
**/
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
var EVT_SELECTION_CHANGE = 'selectionChange';

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
    Hash of boolean commands supported by this editor. A boolean command is
    one that does not require a value. Executing this command will toggle
    the currently set value.

    Names should correspond with valid `execCommand()` command names.

    @property {Object} boolCommands
    **/
    boolCommands: {
        bold     : true,
        italic   : true,
        underline: true,
        justifyCenter: true,
        justifyFull: true,
        justifyLeft: true,
        justifyRight: true
    },

    // -- Protected Properties -------------------------------------------------

    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        this.selection  = new Y.Selection();
        this.selectors  = {};

        this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        Y.Object.each(this.classNames, function (name, key) {
            this.selectors[key] = '.' + name;
        }, this);

        this._attachEvents();
    },

    destructor: function () {
        this._detachEvents();

        this.selection = null;
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
    @param {String|Function} name Command name or function to execute. By
        default functions will execute in the editor context. Use Y.bind
        to provide a different execution context.
    @param {*} [value*] Command value or 0..n arguments to pass
        to the command function. Use the special value 'toggle' to toggle a
        boolean command (like 'bold') to the opposite of its current state.
    @return {*} Value of the specified command or return value of the
        supplied function.
    **/
    command: function (name, value) {
        var args = Y.Array(arguments, 1, true),
            retVal;

        this.focus();

        if (typeof name === 'function') {
            retVal = name.apply(this, args);
        } else {
            value = args.shift();

            if (typeof value !== 'undefined') {
                this._execCommand(name, value);
            }

            retVal = this._queryCommandValue(name);
        }

        this._updateSelection({force: true});

        return retVal;
    },

    /**
    Decreases the font size of the current selection (if possible).

    @method decreaseFontSize
    @chainable
    **/
    decreaseFontSize: function () {
        var newSize = parseInt(this.command('fontSize'), 10) - 1;

        if (newSize > 0) {
            this.command('fontSize', '' + newSize);
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
        var newSize = parseInt(this.command('fontSize'), 10) + 1;

        // currently only webkit supports size 7 (xxx-large), so keep
        // it under 7 for compatibility
        if (newSize < 7) {
            this.command('fontSize', '' + newSize);
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

        this._inputNode = inputNode;
        this._rendered  = true;

        this._updateSelection({silent: true});

        this.fire(EVT_RENDER);

        return this;
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
        if (!doc.queryCommandEnabled(name)) {
            return;
        }

        if (this.boolCommands[name]) {
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
        return this.boolCommands[name] ?
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
        @param {Boolean} [options.force=false] If `true`, the internal selection
            state will be updated regardless of if the selection changed.
        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`
            event will be suppressed.
    @protected
    **/
    _updateSelection:  function (options) {
        var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            force     = options && options.force,
            silent    = options && options.silent;

        if (!force && (
                newRange === prevRange || (
                    prevRange &&
                    prevRange.isEquivalent(newRange) &&
                    prevRange.toHTML() === newRange.toHTML()
                )
            )
        ) {
            return;
        }

        this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
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
        if (!this._rendered) {
            return;
        }

        clearInterval(this._selectionMonitor);

        this.fire(EVT_BLUR);
    },

    /**
    Handles `copy` events on the editor.

    @method _onCopy
    @param {EventFacade} e
    @protected
    **/
    _onCopy: function (e) {
        var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),
            contents = range.cloneContents().getHTML();

        e.preventDefault();

        try {
            // IE doesn't support mime types
            clipboard.setData('text/html', contents);
            clipboard.setData('text/plain', contents);
        } catch (err) {
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
        var clipboard = e._event.clipboardData || window.clipboardData,
            range = this.selection.range(),

            // note the `expand()`. this prevents any empty nodes
            // being left after `extractContents()`
            contents = range.expand().extractContents().getHTML();

        e.preventDefault();

        this.selection.select(range);

        try {
            // IE doesn't support mime types
            clipboard.setData('text/html', contents);
            clipboard.setData('text/plain', contents);
        } catch (err) {
            clipboard.setData('text', contents);
        }
    },

    /**
    Handles `dblclick` events on the editor.

    @method _onDblClick
    @protected
    **/
    _onDblClick: function() {
        var range = this.selection.range();

        this.selection.select(range.shrink({trim: true}));
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

        // restore the previously selected range
        if (this._selectedRange) {
            this.selection.select(this._selectedRange);
        }

        this._updateSelection();

        clearInterval(this._selectionMonitor);

        this._selectionMonitor = setInterval(function () {
            self._updateSelection();
        }, 200);

        this.fire(EVT_FOCUS);
    },

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        var clipboard = e._event.clipboardData || win.clipboardData,
            contents = clipboard.getData('text'),
            selection = this.selection,
            range = selection.range();

        e.preventDefault();

        // treat pasted content as plain text, until we can do better client
        // side sanitization.

        // convert unescaped html to nodes, then extract the text into a text node.
        //
        // `<div>foo</div> <div>bar</div>`
        //
        // will result in a text node:
        //
        // `foo bar`
        contents = Y.Node.create(contents); // document-fragment
        contents = doc.createTextNode(contents.get('text'));

        if (!range.isCollapsed()) {
            // expanding the range before deleting contents makes sure
            // the entire node is deleted, if possible.
            range.expand(this._inputNode);

            range.deleteContents();
        }

        range.insertNode(contents);

        selection.select(range.collapse());

        this._updateSelection({force: true});
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

Y.namespace('Editor').Base = EditorBase;


}, '@VERSION@', {"requires": ["base-build", "classnamemanager", "event-focus", "gallery-sm-selection", "view"]});
