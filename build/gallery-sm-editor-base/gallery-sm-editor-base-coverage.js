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
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-base/gallery-sm-editor-base.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].code=["YUI.add('gallery-sm-editor-base', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Provides `Y.Editor.Base`, the core implementation of the SmugMug editor.","","@module gallery-sm-editor","@submodule gallery-sm-editor-base","**/","","/**","Base implementation of the SmugMug editor. Provides core editor functionality,","but no undo stack, keyboard shortcuts, etc.","","@class Editor.Base","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    win          = Y.config.win,","    getClassName = Y.ClassNameManager.getClassName,","    EDOM         = Y.Editor.DOM;","","/**","Fired after this editor loses focus.","","@event blur","**/","var EVT_BLUR = 'blur';","","/**","Fired after this editor receives focus.","","@event focus","**/","var EVT_FOCUS = 'focus';","","/**","Fired after this editor is rendered.","","@event render","**/","var EVT_RENDER = 'render';","","/**","Fired when this editor's selection changes.","","@event selectionChange","@param {Range} prevRange Range that was previously selected, or `null` if there","    was no previous selection.","@param {Range} range Range that's now selected, or `null` if the current","    selection is empty or outside the editor.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","var EditorBase = Y.Base.create('editorBase', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} cursor Class name used for a placeholder node that","        represents the cursor position.","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        cursor: getClassName('sm-editor-cursor', true),","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    `Y.Selection` instance representing the current document selection.","","    The selection object's state always reflects the current selection, so it","    will update when the selection changes. If you need to retain the state of a","    past selection, hold onto a Range instance representing that selection.","","    Also, beware: this selection object reflects the current selection in the","    entire browser document, not just within this editor.","","    @property {Selection} selection","    **/","","    /**","    Hash of commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} commands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    commands: {","        insertHTML: {","            commandFn: '_insertHTML'","        },","","        insertText: {","            commandFn: '_insertText'","        }","    },","","","    supportedTags: 'a, br, div, p, span',","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.selection  = new Y.Selection();","        this.selectors  = {};","","        this._cursorHTML = '<span class=\"' + this.classNames.cursor + '\"></span>';","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","","        this.selection = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._rendered) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String|Function} name Command name.","    @param {*} [value*]","    @return {*} Value of the specified command.","    **/","    command: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 1, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.commandFn;","","                if (command.style) {","                    args.unshift(name);","                }","            }","","            if ('string' === typeof fn) {","                fn = this[fn];","            }","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","","            this._updateSelection({force: true});","        }","","        return ret || this.query(name);","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._rendered) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method query","    @param {String|Function} name Command name.","    @return {*} Value of the specified command.","    **/","    query: function (name) {","        var command, ret,","            fn = name,","            args = Y.Array(arguments, 0, true);","","        if ('string' === typeof fn) {","            command = this.commands[fn];","","            if (command) {","                fn = command.queryFn;","            }","","            fn = this[fn];","        }","","        this.focus();","","        if ('function' === typeof fn) {","            ret = fn.apply(this, args);","        }","","        return ret;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        } else {","            inputNode.setHTML('<p><br></p>');","        }","","        inputNode.set('contentEditable', true);","","        this._inputNode = inputNode;","        this._rendered  = true;","","        this.fire(EVT_RENDER);","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',  this._onBlur,  selectors.input, this),","            container.delegate('copy',  this._onCopy,  selectors.input, this),","            container.delegate('cut',  this._onCut,  selectors.input, this),","            container.delegate('dblclick', this._onDblClick, selectors.input, this),","            container.delegate('focus', this._onFocus, selectors.input, this),","            container.delegate('paste', this._onPaste, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        if (!doc.queryCommandSupported(name) || !doc.queryCommandEnabled(name)) {","            return;","        }","","        doc.execCommand(name, false, value);","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Returns nodes containing any part of the given `range` matching the","    given `selector`","","    @method _getNodes","    @param {Range} range","    @param {String} selector","    @return {NodeList}","    @protected","    **/","    _getNodes: function (range, selector) {","        var startNode, startOffset,","            testNode, nodes = [];","","        range = range.clone().shrink();","","        startNode = range.startNode();","        startOffset = range.startOffset();","","        if (range.isCollapsed()) {","            var childNodes = startNode.get('childNodes');","","            if (!EDOM.isTextNode(startNode) && childNodes.item(startOffset - 1)) {","                // the range is collapsed so it will never get traversed. grab","                // the exact node referenced by startNode/startOffset and work","                // backwards from there","                testNode = childNodes.item(startOffset - 1);","            } else {","                testNode = startNode;","            }","        } else {","            // traversal will include the startNode, so start off with the","            // startNodes parent","            testNode = startNode.get('parentNode');","        }","","        while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {","            if (testNode.test(selector)) {","                nodes.push(testNode);","            }","","            testNode = testNode.get('parentNode');","        }","","        range.traverse(function (node) {","           if (node.test(selector)) {","               nodes.push(node);","           }","        });","","        return Y.all(nodes);","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Inserts the specified _html_ at the current selection point, deleting the","    current selection if there is one.","","    @method _insertHTML","    @param {HTML|HTMLElement|Node} html HTML to insert, in the form of an HTML","        string, HTMLElement, or Node instance.","    @return {Node} Node instance representing the inserted HTML.","    **/","    _insertHTML: function (html) {","        var node      = typeof html === 'string' ? Y.Node.create(html) : html,","            selection = this.selection,","            range     = selection.range();","","        if (!range) {","            return;","        }","","        // expanding the range before deleting contents makes sure","        // the entire node is deleted, if possible.","        range.expand({stopAt: this._inputNode});","","        node = range.deleteContents().insertNode(node);","","        range.collapse();","","        selection.select(range);","","        return node;","    },","","    /**","    Inserts a `<span>` at the current selection point containing a preformatted","    tab character.","","    @method _insertTab","    @protected","    **/","    _insertTab: function () {","        this._insertHTML('<span style=\"white-space:pre;\">\\t</span>');","    },","","    /**","    Inserts the specified plain _text_ at the current selection point, deleting","    the current selection if there is one.","","    @method insertText","    @param {String} text Text to insert.","    @return {Node} Node instance representing the inserted text node.","    **/","    _insertText: function (text) {","        // replace any newlines with spaces. browsers will convert","        // back to back newlines into paragraphs in the `formatBlock` command","        // which could cause nesting issues depending on where the text is","        // being inserted","        text = text.replace(/\\n+/g, ' ');","","        return this._insertHTML(doc.createTextNode(text));","    },","","    /**","    Wrapper for the native `queryCommandValue()` method","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return doc.queryCommandSupported(name) ? doc.queryCommandValue(name) : null;","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.force=false] If `true`, the internal selection","            state will be updated regardless of if the selection changed.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var prevRange = this._selectedRange || null,","            newRange  = this.selection.range() || null,","            force     = options && options.force,","            silent    = options && options.silent;","","        if (!force && (","                newRange === prevRange || (","                    prevRange &&","                    prevRange.isEquivalent(newRange) &&","                    prevRange.toHTML() === newRange.toHTML()","                )","            )","        ) {","            return;","        }","","        this._selectedRange = newRange;","","        // Only fire an event if options.silent is falsy and the new range is","        // either null or is entirely inside this editor.","        if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {","            this.fire(EVT_SELECTION_CHANGE, {","                prevRange: prevRange,","                range    : newRange,","                selection: this.selection","            });","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        if (!this._rendered) {","            return;","        }","","        clearInterval(this._selectionMonitor);","","        this.fire(EVT_BLUR);","    },","","    /**","    Handles `copy` events on the editor.","","    @method _onCopy","    @param {EventFacade} e","    @protected","    **/","    _onCopy: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            range = this.selection.range(),","            contents = range.cloneContents().getHTML();","","        e.preventDefault();","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `cut` events on the editor.","","    @method _onCut","    @param {EventFacade} e","    @protected","    **/","    _onCut: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            range = this.selection.range(),","            contents;","","        // expand the range to prevent any empty nodes","        // being left after `extractContents()`","        range.expand({stopAt: this._inputNode});","        contents = range.extractContents().getHTML();","","        e.preventDefault();","","        this.selection.select(range);","","        try {","            // IE doesn't support mime types","            clipboard.setData('text/html', contents);","            clipboard.setData('text/plain', contents);","        } catch (err) {","            clipboard.setData('text', contents);","        }","    },","","    /**","    Handles `dblclick` events on the editor.","","    @method _onDblClick","    @protected","    **/","    _onDblClick: function() {","        var range = this.selection.range();","","        this.selection.select(range.shrink({trim: true}));","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this,","            selection = this.selection,","            range;","","        if (!this._rendered) {","            return;","        }","","        // restore the previously selected range, or create a new range","        if (!(range = this._selectedRange)) {","            var node = this._inputNode.get('firstChild') || this._inputNode;","","            range = new Y.Range();","            range.selectNodeContents(node);","            range.collapse({toStart: true});","        }","","        selection.select(range);","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","","        this.fire(EVT_FOCUS);","    },","","    /**","    Handles `paste` events on the editor.","","    @method _onPaste","    @param {EventFacade} e","    @protected","    **/","    _onPaste: function (e) {","        var clipboard = e._event.clipboardData || win.clipboardData,","            contents = clipboard.getData('text');","","        e.preventDefault();","","        // create a document-fragment with the pasted contents","        // then get the text content of the fragment. effectively","        // strips tags.","        contents = Y.Node.create(contents).get('text');","","        this.command('insertText', contents);","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","Y.namespace('Editor').Base = EditorBase;","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"event-focus\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-selection\",","        \"view\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].lines = {"1":0,"5":0,"23":0,"33":0,"40":0,"47":0,"59":0,"61":0,"121":0,"122":0,"124":0,"126":0,"127":0,"130":0,"134":0,"136":0,"148":0,"149":0,"152":0,"167":0,"171":0,"172":0,"174":0,"175":0,"177":0,"178":0,"182":0,"183":0,"187":0,"189":0,"190":0,"192":0,"195":0,"205":0,"206":0,"209":0,"223":0,"227":0,"228":0,"230":0,"231":0,"234":0,"237":0,"239":0,"240":0,"243":0,"254":0,"257":0,"259":0,"260":0,"264":0,"267":0,"268":0,"269":0,"270":0,"272":0,"275":0,"277":0,"278":0,"280":0,"282":0,"294":0,"295":0,"298":0,"301":0,"318":0,"319":0,"320":0,"334":0,"335":0,"338":0,"350":0,"364":0,"367":0,"369":0,"370":0,"372":0,"373":0,"375":0,"379":0,"381":0,"386":0,"389":0,"390":0,"391":0,"394":0,"397":0,"398":0,"399":0,"403":0,"415":0,"428":0,"432":0,"433":0,"438":0,"440":0,"442":0,"444":0,"446":0,"457":0,"473":0,"475":0,"487":0,"499":0,"500":0,"503":0,"515":0,"516":0,"519":0,"536":0,"541":0,"549":0,"552":0,"556":0,"557":0,"574":0,"575":0,"578":0,"580":0,"591":0,"595":0,"597":0,"599":0,"600":0,"602":0,"614":0,"620":0,"621":0,"623":0,"625":0,"627":0,"629":0,"630":0,"632":0,"643":0,"645":0,"655":0,"659":0,"660":0,"664":0,"665":0,"667":0,"668":0,"669":0,"672":0,"674":0,"676":0,"678":0,"679":0,"682":0,"693":0,"696":0,"701":0,"703":0,"751":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].functions = {"(anonymous 2):126":0,"initializer:120":0,"destructor:133":0,"blur:147":0,"command:166":0,"focus:204":0,"query:222":0,"render:253":0,"_attachEvents:293":0,"_detachEvents:317":0,"_execCommand:333":0,"_getHTML:349":0,"(anonymous 3):397":0,"_getNodes:363":0,"_getText:414":0,"_insertHTML:427":0,"_insertTab:456":0,"_insertText:468":0,"_queryCommandValue:486":0,"_setHTML:498":0,"_setText:514":0,"_updateSelection:535":0,"_onBlur:573":0,"_onCopy:590":0,"_onCut:613":0,"_onDblClick:642":0,"(anonymous 4):678":0,"_onFocus:654":0,"_onPaste:692":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredLines = 155;
_yuitest_coverage["build/gallery-sm-editor-base/gallery-sm-editor-base.js"].coveredFunctions = 30;
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 1);
YUI.add('gallery-sm-editor-base', function (Y, NAME) {

/*jshint expr:true, onevar:false */

_yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 5);
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

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 23);
var doc          = Y.config.doc,
    win          = Y.config.win,
    getClassName = Y.ClassNameManager.getClassName,
    EDOM         = Y.Editor.DOM;

/**
Fired after this editor loses focus.

@event blur
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 33);
var EVT_BLUR = 'blur';

/**
Fired after this editor receives focus.

@event focus
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 40);
var EVT_FOCUS = 'focus';

/**
Fired after this editor is rendered.

@event render
**/
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 47);
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
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 59);
var EVT_SELECTION_CHANGE = 'selectionChange';

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 61);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "initializer", 120);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 121);
this.selection  = new Y.Selection();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 122);
this.selectors  = {};

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 124);
this._cursorHTML = '<span class="' + this.classNames.cursor + '"></span>';

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 126);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 2)", 126);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 127);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 130);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "destructor", 133);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 134);
this._detachEvents();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 136);
this.selection = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "blur", 147);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 148);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 149);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 152);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "command", 166);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 167);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 1, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 171);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 172);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 174);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 175);
fn = command.commandFn;

                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 177);
if (command.style) {
                    _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 178);
args.unshift(name);
                }
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 182);
if ('string' === typeof fn) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 183);
fn = this[fn];
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 187);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 189);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 190);
ret = fn.apply(this, args);

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 192);
this._updateSelection({force: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 195);
return ret || this.query(name);
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "focus", 204);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 205);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 206);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 209);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "query", 222);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 223);
var command, ret,
            fn = name,
            args = Y.Array(arguments, 0, true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 227);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 228);
command = this.commands[fn];

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 230);
if (command) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 231);
fn = command.queryFn;
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 234);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 237);
this.focus();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 239);
if ('function' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 240);
ret = fn.apply(this, args);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 243);
return ret;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "render", 253);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 254);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 257);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 259);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 260);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 264);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 267);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 268);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 269);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 270);
inputNode.set('text', text);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 272);
inputNode.setHTML('<p><br></p>');
        }}

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 275);
inputNode.set('contentEditable', true);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 277);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 278);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 280);
this.fire(EVT_RENDER);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 282);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_attachEvents", 293);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 294);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 295);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 298);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 301);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_detachEvents", 317);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 318);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 319);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 320);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_execCommand", 333);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 334);
if (!doc.queryCommandSupported(name) || !doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 335);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 338);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getHTML", 349);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 350);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getNodes", 363);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 364);
var startNode, startOffset,
            testNode, nodes = [];

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 367);
range = range.clone().shrink();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 369);
startNode = range.startNode();
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 370);
startOffset = range.startOffset();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 372);
if (range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 373);
var childNodes = startNode.get('childNodes');

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 375);
if (!EDOM.isTextNode(startNode) && childNodes.item(startOffset - 1)) {
                // the range is collapsed so it will never get traversed. grab
                // the exact node referenced by startNode/startOffset and work
                // backwards from there
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 379);
testNode = childNodes.item(startOffset - 1);
            } else {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 381);
testNode = startNode;
            }
        } else {
            // traversal will include the startNode, so start off with the
            // startNodes parent
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 386);
testNode = startNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 389);
while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 390);
if (testNode.test(selector)) {
                _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 391);
nodes.push(testNode);
            }

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 394);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 397);
range.traverse(function (node) {
           _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 3)", 397);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 398);
if (node.test(selector)) {
               _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 399);
nodes.push(node);
           }
        });

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 403);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_getText", 414);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 415);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertHTML", 427);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 428);
var node      = typeof html === 'string' ? Y.Node.create(html) : html,
            selection = this.selection,
            range     = selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 432);
if (!range) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 433);
return;
        }

        // expanding the range before deleting contents makes sure
        // the entire node is deleted, if possible.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 438);
range.expand({stopAt: this._inputNode});

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 440);
node = range.deleteContents().insertNode(node);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 442);
range.collapse();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 444);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 446);
return node;
    },

    /**
    Inserts a `<span>` at the current selection point containing a preformatted
    tab character.

    @method _insertTab
    @protected
    **/
    _insertTab: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertTab", 456);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 457);
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
        // replace any newlines with spaces. browsers will convert
        // back to back newlines into paragraphs in the `formatBlock` command
        // which could cause nesting issues depending on where the text is
        // being inserted
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_insertText", 468);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 473);
text = text.replace(/\n+/g, ' ');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 475);
return this._insertHTML(doc.createTextNode(text));
    },

    /**
    Wrapper for the native `queryCommandValue()` method

    @method _queryCommandValue
    @param {String} name Command name.
    @return {Boolean|String} Command value.
    @protected
    **/
    _queryCommandValue: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_queryCommandValue", 486);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 487);
return doc.queryCommandSupported(name) ? doc.queryCommandValue(name) : null;
    },

    /**
    Setter for the `html` attribute.

    @method _setHTML
    @param {HTML} value HTML.
    @return {HTML} HTML.
    @protected
    **/
    _setHTML: function (value) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setHTML", 498);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 499);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 500);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 503);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_setText", 514);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 515);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 516);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 519);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_updateSelection", 535);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 536);
var prevRange = this._selectedRange || null,
            newRange  = this.selection.range() || null,
            force     = options && options.force,
            silent    = options && options.silent;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 541);
if (!force && (
                newRange === prevRange || (
                    prevRange &&
                    prevRange.isEquivalent(newRange) &&
                    prevRange.toHTML() === newRange.toHTML()
                )
            )
        ) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 549);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 552);
this._selectedRange = newRange;

        // Only fire an event if options.silent is falsy and the new range is
        // either null or is entirely inside this editor.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 556);
if (!silent && (!newRange || newRange.isInsideNode(this._inputNode))) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 557);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onBlur", 573);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 574);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 575);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 578);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 580);
this.fire(EVT_BLUR);
    },

    /**
    Handles `copy` events on the editor.

    @method _onCopy
    @param {EventFacade} e
    @protected
    **/
    _onCopy: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCopy", 590);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 591);
var clipboard = e._event.clipboardData || win.clipboardData,
            range = this.selection.range(),
            contents = range.cloneContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 595);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 597);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 599);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 600);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 602);
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
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onCut", 613);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 614);
var clipboard = e._event.clipboardData || win.clipboardData,
            range = this.selection.range(),
            contents;

        // expand the range to prevent any empty nodes
        // being left after `extractContents()`
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 620);
range.expand({stopAt: this._inputNode});
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 621);
contents = range.extractContents().getHTML();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 623);
e.preventDefault();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 625);
this.selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 627);
try {
            // IE doesn't support mime types
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 629);
clipboard.setData('text/html', contents);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 630);
clipboard.setData('text/plain', contents);
        } catch (err) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 632);
clipboard.setData('text', contents);
        }
    },

    /**
    Handles `dblclick` events on the editor.

    @method _onDblClick
    @protected
    **/
    _onDblClick: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onDblClick", 642);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 643);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 645);
this.selection.select(range.shrink({trim: true}));
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onFocus", 654);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 655);
var self = this,
            selection = this.selection,
            range;

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 659);
if (!this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 660);
return;
        }

        // restore the previously selected range, or create a new range
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 664);
if (!(range = this._selectedRange)) {
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 665);
var node = this._inputNode.get('firstChild') || this._inputNode;

            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 667);
range = new Y.Range();
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 668);
range.selectNodeContents(node);
            _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 669);
range.collapse({toStart: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 672);
selection.select(range);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 674);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 676);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 678);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "(anonymous 4)", 678);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 679);
self._updateSelection();
        }, 200);

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 682);
this.fire(EVT_FOCUS);
    },

    /**
    Handles `paste` events on the editor.

    @method _onPaste
    @param {EventFacade} e
    @protected
    **/
    _onPaste: function (e) {
        _yuitest_coverfunc("build/gallery-sm-editor-base/gallery-sm-editor-base.js", "_onPaste", 692);
_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 693);
var clipboard = e._event.clipboardData || win.clipboardData,
            contents = clipboard.getData('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 696);
e.preventDefault();

        // create a document-fragment with the pasted contents
        // then get the text content of the fragment. effectively
        // strips tags.
        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 701);
contents = Y.Node.create(contents).get('text');

        _yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 703);
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

_yuitest_coverline("build/gallery-sm-editor-base/gallery-sm-editor-base.js", 751);
Y.namespace('Editor').Base = EditorBase;


}, '@VERSION@', {
    "requires": [
        "base-build",
        "classnamemanager",
        "event-focus",
        "gallery-sm-editor-dom",
        "gallery-sm-selection",
        "view"
    ]
});
