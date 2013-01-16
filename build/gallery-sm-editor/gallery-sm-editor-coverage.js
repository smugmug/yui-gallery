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
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor/gallery-sm-editor.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].code=["YUI.add('gallery-sm-editor', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides `Y.Editor`, a simple but powerful WYSIWYG editor.","","@module gallery-sm-editor","@main gallery-sm-editor","**/","","/**","A simple but powerful WYSIWYG editor.","","@class Editor","@constructor","@extends View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","Y.Node.DOM_EVENTS.paste = 1;","","/**","Fires when this editor's selection changes.","","@event selectionChange","@param {Range[]} newRanges Array of ranges that are now selected.","@param {Range[]} oldRanges Array of ranges that were selected before the","    selection changed.","@param {Selection} selection Reference to this editor's Selection instance.","**/","var EVT_SELECTION_CHANGE = 'selectionChange';","","Y.Editor = Y.Base.create('editor', Y.View, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this editor.","","    @property {Object} classNames","    @param {String} editor Class name used for the editor's container.","    @param {String} input Class name used for the WYSIWYG YUI Editor frame that","        will receive user input.","    **/","    classNames: {","        editor: getClassName('sm-editor', true),","        input : getClassName('sm-editor-input', true)","    },","","    /**","    Hash of style commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    should be strings specifying the style's type: either 'boolean' or 'string'.","","    @property {Object} styleCommands","    @param {String} [bold='boolean']","    @param {String} [italic='boolean']","    @param {String} [fontName='string']","    @param {String} [fontSize='string']","    @param {String} [underline='string']","    **/","    styleCommands: {","        bold     : 'boolean',","        italic   : 'boolean',","        fontName : 'string',","        fontSize : 'string',","        underline: 'boolean'","    },","","    // -- Protected Properties -------------------------------------------------","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function () {","        this._updateSelection({silent: true});","","        // Generate selectors based on configured class names.","        this.selectors = {};","","        Y.Object.each(this.classNames, function (name, key) {","            this.selectors[key] = '.' + name;","        }, this);","","        this._attachEvents();","    },","","    destructor: function () {","        this._detachEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Removes focus from this editor.","","    @method blur","    @chainable","    **/","    blur: function () {","        if (this._inputNode) {","            this._inputNode.blur();","        }","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor command.","","    See <https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla>","    for a list of possible commands.","","    @method command","    @param {String} name Command name.","    @param {Boolean|String} [value] Command value. Use the special value","        'toggle' to toggle a boolean command (like 'bold') to the opposite of","        its current state.","    @return {Boolean|String} Value of the specified command.","    **/","    command: function (name, value) {","        if (value) {","            this._execCommand(name, value);","        }","","        return this._queryCommandValue(name);","    },","","    /**","    Focuses this editor.","","    @method focus","    @chainable","    **/","    focus: function () {","        if (this._inputNode) {","            this._inputNode.focus();","        }","","        return this;","    },","","    /**","    Renders this editor into its container and appends the container to the","    document if necessary.","","    @method render","    @chainable","    **/","    render: function () {","        var container  = this.get('container'),","            inputNode  = container.one(this.selectors.input);","","        container.addClass(this.classNames.editor);","","        if (!inputNode) {","            inputNode = container.appendChild('<div/>')","                                 .addClass(this.classNames.input);","        }","","        var html = this.get('html'),","            text = this.get('text');","","        if (html) {","            inputNode.setHTML(html);","        } else if (text) {","            inputNode.set('text', text);","        }","","        inputNode.set('contentEditable', true);","","        // Append the container to the body if it's not already in the document.","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this._inputNode = inputNode;","        this._rendered  = true;","","        return this;","    },","","    /**","    Gets and/or sets the value of the specified editor style command. This","    method is similar to `command()`, but only supports a subset of","    style-related commands.","","    See the `styleCommands` property for a list of supported style commands.","","    @method style","    @param {String} name Command name.","    @param {Boolean|String} [value] Command value. Use the special value","        'toggle' to toggle a boolean command (like 'bold') to the opposite of","        its current state.","    @return {Boolean|String} Value of the specified command.","    **/","    style: function (name, value) {","        if (!this.styleCommands.hasOwnProperty(name)) {","            Y.error('sm-editor: Unsupported style: ' + name);","            return;","        }","","        return this.command(name, value);","    },","","    /**","    Gets and/or sets the values of multiple editor style commands.","","    When called without an argument, the current values of all supported style","    commands will be returned. When called with a _styles_ object, the specified","    style commands will be set to their given values, and the resulting new","    values will be returned.","","    @method styles","    @param {Object} [styles] Hash of style names and values to set.","    @return {Object} Hash of style names and values that were set, or all styles","        if no _styles_ parameter was specified.","    **/","    styles: function (styles) {","        var results = {},","            name;","","        if (styles) {","            for (name in styles) {","                if (styles.hasOwnProperty(name)) {","                    results[name] = this.style(name, styles[name]);","                }","            }","        } else {","            var commands = this.styleCommands;","","            for (name in commands) {","                if (commands.hasOwnProperty(name)) {","                    results[name] = this._queryCommandValue(name);","                }","            }","        }","","        return results;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches editor events.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        if (this._events) {","            return;","        }","","        var container = this.get('container'),","            selectors = this.selectors;","","        this._events = [","            container.delegate('blur',    this._onBlur,    selectors.input, this),","            container.delegate('focus',   this._onFocus,   selectors.input, this),","            container.delegate('keydown', this._onKeyDown, selectors.input, this)","        ];","    },","","    /**","    Detaches editor events.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        if (this._events) {","            new Y.EventHandle(this._events).detach();","            this._events = null;","        }","    },","","    /**","    Wrapper for native the native `execCommand()` that verifies that the command","    is valid in the current state and normalizes boolean/toggleable values.","","    @method _execCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _execCommand: function (name, value) {","        var type = this.styleCommands[name];","","        if (!doc.queryCommandEnabled(name)) {","            return;","        }","","        if (type === 'boolean') {","            // Only execute the command if the desired state differs from the","            // current state, or the desired state is 'toggle', indicating that","            // the command should be toggled regardless of its current state.","            if (value === 'toggle' || value !== this._queryCommandValue(name)) {","                doc.execCommand(name, false, null);","            }","        } else {","            doc.execCommand(name, false, value);","        }","    },","","    /**","    Getter for the `html` attribute.","","    @method _getHTML","    @param {HTML} value Internal value.","    @return {HTML} HTML.","    @protected","    **/","    _getHTML: function (value) {","        return this._rendered ? this._inputNode.getHTML() : value;","    },","","    /**","    Getter for the `text` attribute.","","    @method _getText","    @param {String} value Internal value.","    @return {String} Text.","    @protected","    **/","    _getText: function (value) {","        return this._rendered ? this._inputNode.get('text') : value;","    },","","    /**","    Wrapper for the native `queryCommandState()` and `queryCommandValue()`","    methods that uses the appropriate method for the given command type.","","    @method _queryCommandValue","    @param {String} name Command name.","    @return {Boolean|String} Command value.","    @protected","    **/","    _queryCommandValue: function (name) {","        return this.styleCommands[name] === 'boolean' ?","            !!doc.queryCommandState(name) : doc.queryCommandValue(name);","    },","","    /**","    Setter for the `html` attribute.","","    @method _setHTML","    @param {HTML} value HTML.","    @return {HTML} HTML.","    @protected","    **/","    _setHTML: function (value) {","        if (this._rendered) {","            this._inputNode.setHTML(value);","        }","","        return value;","    },","","    /**","    Setter for the `text` attribute.","","    @method _setText","    @param {String} value Text.","    @return {String} Text.","    @protected","    **/","    _setText: function (value) {","        if (this._rendered) {","            this._inputNode.set('text', value);","        }","","        return value;","    },","","    /**","    Refreshes the editor's internal knowledge of the current document selection","    state and fires a `selectionChange` event if the selection has changed since","    it was last refreshed.","","    @method _updateSelection","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `selectionChange`","            event will be suppressed.","    @protected","    **/","    _updateSelection:  function (options) {","        var selection  = this._selection || (this._selection = new Y.Selection()),","            oldRanges  = this._selectedRanges,","            newRanges  = selection.ranges(),","            isInEditor = true;","","        var changed, i, len;","","        if (oldRanges && oldRanges.length === newRanges.length) {","            for (i = 0, len = oldRanges.length; i < len; i++) {","                if (!oldRanges[i].isEquivalent(newRanges[i])) {","                    changed = true;","                    break;","                }","            }","        } else {","            changed = true;","        }","","        if (changed) {","            // Are all the selected ranges inside the editor?","            for (i = 0, len = newRanges.length; i < len; i++) {","                if (!newRanges[i].isInsideNode(this._inputNode)) {","                    isInEditor = false;","                    break;","                }","            }","","            this._selectedRanges = isInEditor ? newRanges : [];","","            if (!(options && options.silent)) {","                this.fire(EVT_SELECTION_CHANGE, {","                    newRanges: this._selectedRanges,","                    oldRanges: oldRanges,","                    selection: this._selection","                });","            }","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `blur` events on the editor.","","    @method _onBlur","    @protected","    **/","    _onBlur: function () {","        clearInterval(this._selectionMonitor);","        this._updateSelection();","    },","","    /**","    Handles `focus` events on the editor.","","    @method _onFocus","    @protected","    **/","    _onFocus: function () {","        var self = this;","","        this._updateSelection();","","        clearInterval(this._selectionMonitor);","","        this._selectionMonitor = setInterval(function () {","            self._updateSelection();","        }, 200);","    },","","    /**","    Handles `keydown` events on the editor.","","    @method _onKeyDown","    @param {EventFacade} e","    @protected","    **/","    _onKeyDown: function (e) {","        if (e.shiftKey || e.altKey || !(e.ctrlKey || e.metaKey)) {","            return;","        }","","        switch (e.charCode) {","        case 66: // b","            this.style('bold', 'toggle');","            break;","","        case 73: // i","            this.style('italic', 'toggle');","            break;","","        case 85: // u","            this.style('underline', 'toggle');","            break;","","        default:","            return;","        }","","        e.preventDefault();","    }","}, {","    ATTRS: {","        /**","        HTML content of this editor.","","        @attribute {HTML} html","        @default ''","        **/","        html: {","            getter: '_getHTML',","            setter: '_setHTML',","            value : ''","        },","","        /**","        Form field name to use for the hidden `<textarea>` that contains the raw","        output of the editor in the configured output format. This name will","        only be used if the output node doesn't already have a name when the","        editor is rendered.","","        You may need to customize this if you plan to use the editor in a form","        that will be submitted to a server.","","        @attribute {String} outputName","        @default 'editor'","        @initOnly","        **/","        outputName: {","            value    : 'editor',","            writeOnce: 'initOnly'","        },","","        /**","        Text content of this editor, with no HTML.","","        @attribute {String} text","        @default ''","        **/","        text: {","            getter: '_getText',","            setter: '_setText',","            value : ''","        }","    }","});","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"event-focus\",","        \"gallery-sm-selection\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].lines = {"1":0,"20":0,"23":0,"34":0,"36":0,"77":0,"80":0,"82":0,"83":0,"86":0,"90":0,"102":0,"103":0,"106":0,"123":0,"124":0,"127":0,"137":0,"138":0,"141":0,"152":0,"155":0,"157":0,"158":0,"162":0,"165":0,"166":0,"167":0,"168":0,"171":0,"174":0,"175":0,"178":0,"179":0,"181":0,"199":0,"200":0,"201":0,"204":0,"221":0,"224":0,"225":0,"226":0,"227":0,"231":0,"233":0,"234":0,"235":0,"240":0,"252":0,"253":0,"256":0,"259":0,"273":0,"274":0,"275":0,"289":0,"291":0,"292":0,"295":0,"299":0,"300":0,"303":0,"316":0,"328":0,"341":0,"354":0,"355":0,"358":0,"370":0,"371":0,"374":0,"389":0,"394":0,"396":0,"397":0,"398":0,"399":0,"400":0,"404":0,"407":0,"409":0,"410":0,"411":0,"412":0,"416":0,"418":0,"419":0,"437":0,"438":0,"448":0,"450":0,"452":0,"454":0,"455":0,"467":0,"468":0,"471":0,"473":0,"474":0,"477":0,"478":0,"481":0,"482":0,"485":0,"488":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].functions = {"(anonymous 2):82":0,"initializer:76":0,"destructor:89":0,"blur:101":0,"command:122":0,"focus:136":0,"render:151":0,"style:198":0,"styles:220":0,"_attachEvents:251":0,"_detachEvents:272":0,"_execCommand:288":0,"_getHTML:315":0,"_getText:327":0,"_queryCommandValue:340":0,"_setHTML:353":0,"_setText:369":0,"_updateSelection:388":0,"_onBlur:436":0,"(anonymous 3):454":0,"_onFocus:447":0,"_onKeyDown:466":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredLines = 106;
_yuitest_coverage["build/gallery-sm-editor/gallery-sm-editor.js"].coveredFunctions = 23;
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 1);
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

_yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 20);
var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 23);
Y.Node.DOM_EVENTS.paste = 1;

/**
Fires when this editor's selection changes.

@event selectionChange
@param {Range[]} newRanges Array of ranges that are now selected.
@param {Range[]} oldRanges Array of ranges that were selected before the
    selection changed.
@param {Selection} selection Reference to this editor's Selection instance.
**/
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 34);
var EVT_SELECTION_CHANGE = 'selectionChange';

_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 36);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "initializer", 76);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 77);
this._updateSelection({silent: true});

        // Generate selectors based on configured class names.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 80);
this.selectors = {};

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 82);
Y.Object.each(this.classNames, function (name, key) {
            _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 2)", 82);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 83);
this.selectors[key] = '.' + name;
        }, this);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 86);
this._attachEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "destructor", 89);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 90);
this._detachEvents();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Removes focus from this editor.

    @method blur
    @chainable
    **/
    blur: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "blur", 101);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 102);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 103);
this._inputNode.blur();
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 106);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "command", 122);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 123);
if (value) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 124);
this._execCommand(name, value);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 127);
return this._queryCommandValue(name);
    },

    /**
    Focuses this editor.

    @method focus
    @chainable
    **/
    focus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "focus", 136);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 137);
if (this._inputNode) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 138);
this._inputNode.focus();
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 141);
return this;
    },

    /**
    Renders this editor into its container and appends the container to the
    document if necessary.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "render", 151);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 152);
var container  = this.get('container'),
            inputNode  = container.one(this.selectors.input);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 155);
container.addClass(this.classNames.editor);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 157);
if (!inputNode) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 158);
inputNode = container.appendChild('<div/>')
                                 .addClass(this.classNames.input);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 162);
var html = this.get('html'),
            text = this.get('text');

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 165);
if (html) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 166);
inputNode.setHTML(html);
        } else {_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 167);
if (text) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 168);
inputNode.set('text', text);
        }}

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 171);
inputNode.set('contentEditable', true);

        // Append the container to the body if it's not already in the document.
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 174);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 175);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 178);
this._inputNode = inputNode;
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 179);
this._rendered  = true;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 181);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "style", 198);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 199);
if (!this.styleCommands.hasOwnProperty(name)) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 200);
Y.error('sm-editor: Unsupported style: ' + name);
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 201);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 204);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "styles", 220);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 221);
var results = {},
            name;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 224);
if (styles) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 225);
for (name in styles) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 226);
if (styles.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 227);
results[name] = this.style(name, styles[name]);
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 231);
var commands = this.styleCommands;

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 233);
for (name in commands) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 234);
if (commands.hasOwnProperty(name)) {
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 235);
results[name] = this._queryCommandValue(name);
                }
            }
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 240);
return results;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches editor events.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_attachEvents", 251);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 252);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 253);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 256);
var container = this.get('container'),
            selectors = this.selectors;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 259);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_detachEvents", 272);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 273);
if (this._events) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 274);
new Y.EventHandle(this._events).detach();
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 275);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_execCommand", 288);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 289);
var type = this.styleCommands[name];

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 291);
if (!doc.queryCommandEnabled(name)) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 292);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 295);
if (type === 'boolean') {
            // Only execute the command if the desired state differs from the
            // current state, or the desired state is 'toggle', indicating that
            // the command should be toggled regardless of its current state.
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 299);
if (value === 'toggle' || value !== this._queryCommandValue(name)) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 300);
doc.execCommand(name, false, null);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 303);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_getHTML", 315);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 316);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_getText", 327);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 328);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_queryCommandValue", 340);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 341);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_setHTML", 353);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 354);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 355);
this._inputNode.setHTML(value);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 358);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_setText", 369);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 370);
if (this._rendered) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 371);
this._inputNode.set('text', value);
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 374);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_updateSelection", 388);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 389);
var selection  = this._selection || (this._selection = new Y.Selection()),
            oldRanges  = this._selectedRanges,
            newRanges  = selection.ranges(),
            isInEditor = true;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 394);
var changed, i, len;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 396);
if (oldRanges && oldRanges.length === newRanges.length) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 397);
for (i = 0, len = oldRanges.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 398);
if (!oldRanges[i].isEquivalent(newRanges[i])) {
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 399);
changed = true;
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 400);
break;
                }
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 404);
changed = true;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 407);
if (changed) {
            // Are all the selected ranges inside the editor?
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 409);
for (i = 0, len = newRanges.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 410);
if (!newRanges[i].isInsideNode(this._inputNode)) {
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 411);
isInEditor = false;
                    _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 412);
break;
                }
            }

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 416);
this._selectedRanges = isInEditor ? newRanges : [];

            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 418);
if (!(options && options.silent)) {
                _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 419);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_onBlur", 436);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 437);
clearInterval(this._selectionMonitor);
        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 438);
this._updateSelection();
    },

    /**
    Handles `focus` events on the editor.

    @method _onFocus
    @protected
    **/
    _onFocus: function () {
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_onFocus", 447);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 448);
var self = this;

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 450);
this._updateSelection();

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 452);
clearInterval(this._selectionMonitor);

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 454);
this._selectionMonitor = setInterval(function () {
            _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "(anonymous 3)", 454);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 455);
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
        _yuitest_coverfunc("build/gallery-sm-editor/gallery-sm-editor.js", "_onKeyDown", 466);
_yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 467);
if (e.shiftKey || e.altKey || !(e.ctrlKey || e.metaKey)) {
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 468);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 471);
switch (e.charCode) {
        case 66: // b
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 473);
this.style('bold', 'toggle');
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 474);
break;

        case 73: // i
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 477);
this.style('italic', 'toggle');
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 478);
break;

        case 85: // u
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 481);
this.style('underline', 'toggle');
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 482);
break;

        default:
            _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 485);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor/gallery-sm-editor.js", 488);
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
