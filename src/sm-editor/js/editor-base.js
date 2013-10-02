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
    getClassName = Y.ClassNameManager.getClassName,
    EDOM = Y.Editor.DOM;

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
        if (this._rendered) {
            this._inputNode.blur();
        }

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
        var command, ret,
            fn = name,
            args = Y.Array(arguments, 1, true);

        if ('string' === typeof fn) {
            command = this.commands[fn];

            if (command) {
                fn = command.commandFn;

                if (command.style) {
                    args.unshift(name);
                }
            }

            fn = this[fn];
        }

        this.focus();

        if ('function' === typeof fn) {
            ret = fn.apply(this, args);

            this._updateSelection({force: true});
        }

        return ret || this.query(name);
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        if (this._rendered) {
            this._inputNode.focus();
        }

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
        var command, ret,
            fn = name,
            args = Y.Array(arguments, 0, true);

        if ('string' === typeof fn) {
            command = this.commands[fn];

            if (command) {
                fn = command.queryFn;
            }

            fn = this[fn];
        }

        this.focus();

        if ('function' === typeof fn) {
            ret = fn.apply(this, args);
        }

        return ret;
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
    is valid in the current state

    @method _execCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _execCommand: function (name, value) {
        if (!doc.queryCommandEnabled(name)) {
            Y.log('Command is not currently allowed: ' + name, 'warn', 'sm-editor');
            return;
        }

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
        var testNode, nodes = [];

        range = range.clone().shrink();

        testNode = range.startNode();

        if (range.isCollapsed()) {
            if (!EDOM.isTextNode(testNode)) {
                // the range is collapsed so it will never get traversed. grab
                // the exact node referenced by startNode/startOffset and work
                // backwards from there
                testNode = testNode.get('childNodes').item(range.startOffset());
            }
        } else {
            // traversal will include the startNode, so start off with the
            // startNodes parent
            testNode = testNode.get('parentNode');
        }

        while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {
            if (testNode.test(selector)) {
                nodes.push(testNode);
            }

            testNode = testNode.get('parentNode');
        }

        range.traverse(function (node) {
           if (node.test(selector)) {
               nodes.push(node);
           }
        });

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
        var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        if (!range) {
            return;
        }

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        range.expand({stopAt: this._inputNode});

        node = range.deleteContents().insertNode(node);

        range.collapse();

        selection.select(range);

        return node;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
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
        return this._insertHTML(doc.createTextNode(text));
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
        return doc.queryCommandValue(name);
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
            contents;

        // expand the range to prevent any empty nodes
        // being left after `extractContents()`
        range.expand({stopAt: this._inputNode});
        contents = range.extractContents().getHTML();

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
        var self = this,
            selection = this.selection,
            range;

        if (!this._rendered) {
            return;
        }

        // restore the previously selected range, or create a new range
        if (!(range = this._selectedRange)) {
            range = new Y.Range();
            range.selectNode(this._inputNode).collapse({toStart: true});
        }

        selection.select(range);

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
            contents = clipboard.getData('text');

        e.preventDefault();

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

Y.namespace('Editor').Base = EditorBase;
