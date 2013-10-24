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
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-queue/gallery-sm-editor-queue.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].code=["YUI.add('gallery-sm-editor-queue', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Queue` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-queue","**/","","/**","Extension for `Editor.Base` that queues commands","","@class Editor.Queue","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","","var EditorQueue = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Key commands related to queue functionality.","","    @property {Object} queueKeyCommands","    **/","    queueKeyCommands: {","        'down'     : {fn: '_clearCommandQueue', allowDefault: true},","        'end'      : {fn: '_clearCommandQueue', allowDefault: true},","        'esc'      : {fn: '_clearCommandQueue', allowDefault: true},","        'home'     : {fn: '_clearCommandQueue', allowDefault: true},","        'left'     : {fn: '_clearCommandQueue', allowDefault: true},","        'pgdown'   : {fn: '_clearCommandQueue', allowDefault: true},","        'pgup'     : {fn: '_clearCommandQueue', allowDefault: true},","        'right'    : {fn: '_clearCommandQueue', allowDefault: true},","        'tab'      : {fn: '_clearCommandQueue', allowDefault: true},","        'up'       : {fn: '_clearCommandQueue', allowDefault: true}","    },","","","    // -- Protected Properties -------------------------------------------------","","    /**","    Hash of commands queued for execution on the next keypress.","","    Workaround for webkit bug where it wont place a caret in an empty node","    or between nodes.","","    @property {Object} _commandQueue","    **/","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.queueKeyCommands);","        }","","        this._attachQueueEvents();","    },","","","    destructor: function () {","        this._detachQueueEvents();","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches queue events.","","    @method _attachQueueEvents","    @protected","    **/","    _attachQueueEvents: function() {","        if (this._queueEvents) {","            return;","        }","","        var container = this.get('container');","","        this._queueEvents = [","            container.delegate('keypress', this._onKeyPress, this.selectors.input, this),","            Y.Do.before(this._queueDoBeforeCommand, this, 'command', this),","            Y.Do.before(this._queueDoBeforeQuery, this, 'query', this)","        ];","    },","","","    /**","    Clears the command queue","","    @method _clearCommandQueue","    @protected","    **/","    _clearCommandQueue: function() {","        this._commandQueue = null;","    },","","","    /**","    Detaches queue events.","","    @method _detachQueueEvents","    @protected","    **/","    _detachQueueEvents: function() {","        if (this._queueEvents) {","            new Y.EventHandle(this._queueEvents).detach();","            this._queueEvents = null;","        }","    },","","","    /**","    Executes all commands on the command queue","","    @method _flushCommandQueue","    @protected","    **/","    _flushCommandQueue: function() {","        if (!this._commandQueue) {","            return;","        }","","        // need to create a copy because the commandQueue","        // will be flushed after the first command is executed","        var queue = Y.merge(this._commandQueue);","","        Y.Object.each(queue, function(value, cmd) {","            this.command(cmd, value);","        }, this);","","        this._clearCommandQueue();","    },","","","    /**","    Adds a command to the queue","","    @method _queueCommand","    @protected","    **/","    _queueCommand: function(name, value) {","        var command = this.commands[name];","","        if (!this._commandQueue) {","            this._commandQueue = {};","        }","","        if (command.style && Y.Lang.isValue(command.style.value)) {","            value = this._commandQueue[name] ? '' : command.style.value;","        }","","        this._commandQueue[name] = value;","","        return value;","    },","","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `keypress` events on the editor","","    @param {EventFacade} e","    @protected","    **/","    _onKeyPress: function(e) {","        if (e.metaKey) {","            return;","        }","","        var selection = this.selection,","            range = selection.range(),","            node;","","        if (range.shrink().isCollapsed() && this._commandQueue) {","            e.preventDefault();","","            node = range.insertNode(Y.Node.create(String.fromCharCode(e.charCode)));","","            selection.select(range.selectNode(node));","","            this._flushCommandQueue();","","            selection.select(range.selectNode(node).shrink().collapse());","        } else {","            this._clearCommandQueue();","        }","    },","","","    /**","    Wrapper for `Editor.Base#_execCommand()`.","","    @method _queueBeforeExecStyleCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _queueDoBeforeCommand: function (name, value) {","        var styleCmd = this.styleCommands[name],","            range, ret;","","        if (styleCmd && 'block' !== styleCmd.type) {","            range = this.selection.range();","","            if (range && range.isCollapsed()) {","                ret = this._queueCommand(name, value);","                this._updateSelection({force: true});","                return new Y.Do.Halt('Editor.Queue prevented command', ret);","            }","        } else {","            this._clearCommandQueue();","        }","    },","","","    /**","    Wrapper for `Editor.Base#_queryCommandValue()`.","","    @method _queueDoBeforeQueryCommandValue","    @param {String} name Command name.","    @protected","    **/","    _queueDoBeforeQuery: function (name) {","        var qCmd = this._commandQueue && this._commandQueue[name],","            styleCmd = this.styleCommands[name];","","        if (styleCmd && Y.Lang.isValue(qCmd)) { // because qCmd could be ''","            if (Y.Lang.isValue(styleCmd.style.value)) {","                qCmd = qCmd === styleCmd.style.value;","            }","","            return new Y.Do.Halt('Editor.Queue prevented query', qCmd);","        }","    }","});","","Y.namespace('Editor').Queue = EditorQueue;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-keys\"]});"];
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].lines = {"1":0,"21":0,"23":0,"60":0,"61":0,"64":0,"69":0,"82":0,"83":0,"86":0,"88":0,"103":0,"114":0,"115":0,"116":0,"128":0,"129":0,"134":0,"136":0,"137":0,"140":0,"151":0,"153":0,"154":0,"157":0,"158":0,"161":0,"163":0,"176":0,"177":0,"180":0,"184":0,"185":0,"187":0,"189":0,"191":0,"193":0,"195":0,"209":0,"212":0,"213":0,"215":0,"216":0,"217":0,"218":0,"221":0,"234":0,"237":0,"238":0,"239":0,"242":0,"247":0};
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].functions = {"initializer:59":0,"destructor:68":0,"_attachQueueEvents:81":0,"_clearCommandQueue:102":0,"_detachQueueEvents:113":0,"(anonymous 3):136":0,"_flushCommandQueue:127":0,"_queueCommand:150":0,"_onKeyPress:175":0,"_queueDoBeforeCommand:208":0,"_queueDoBeforeQuery:233":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].coveredLines = 52;
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].coveredFunctions = 13;
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 1);
YUI.add('gallery-sm-editor-queue', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Queue` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-queue
**/

/**
Extension for `Editor.Base` that queues commands

@class Editor.Queue
@constructor
@extends Base
@extensionfor Editor.Base
**/

_yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 21);
(function() {

_yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "(anonymous 2)", 21);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 23);
var EditorQueue = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Key commands related to queue functionality.

    @property {Object} queueKeyCommands
    **/
    queueKeyCommands: {
        'down'     : {fn: '_clearCommandQueue', allowDefault: true},
        'end'      : {fn: '_clearCommandQueue', allowDefault: true},
        'esc'      : {fn: '_clearCommandQueue', allowDefault: true},
        'home'     : {fn: '_clearCommandQueue', allowDefault: true},
        'left'     : {fn: '_clearCommandQueue', allowDefault: true},
        'pgdown'   : {fn: '_clearCommandQueue', allowDefault: true},
        'pgup'     : {fn: '_clearCommandQueue', allowDefault: true},
        'right'    : {fn: '_clearCommandQueue', allowDefault: true},
        'tab'      : {fn: '_clearCommandQueue', allowDefault: true},
        'up'       : {fn: '_clearCommandQueue', allowDefault: true}
    },


    // -- Protected Properties -------------------------------------------------

    /**
    Hash of commands queued for execution on the next keypress.

    Workaround for webkit bug where it wont place a caret in an empty node
    or between nodes.

    @property {Object} _commandQueue
    **/


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "initializer", 59);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 60);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 61);
this.keyCommands = Y.merge(this.keyCommands, this.queueKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 64);
this._attachQueueEvents();
    },


    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "destructor", 68);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 69);
this._detachQueueEvents();
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches queue events.

    @method _attachQueueEvents
    @protected
    **/
    _attachQueueEvents: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_attachQueueEvents", 81);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 82);
if (this._queueEvents) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 83);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 86);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 88);
this._queueEvents = [
            container.delegate('keypress', this._onKeyPress, this.selectors.input, this),
            Y.Do.before(this._queueDoBeforeCommand, this, 'command', this),
            Y.Do.before(this._queueDoBeforeQuery, this, 'query', this)
        ];
    },


    /**
    Clears the command queue

    @method _clearCommandQueue
    @protected
    **/
    _clearCommandQueue: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_clearCommandQueue", 102);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 103);
this._commandQueue = null;
    },


    /**
    Detaches queue events.

    @method _detachQueueEvents
    @protected
    **/
    _detachQueueEvents: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_detachQueueEvents", 113);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 114);
if (this._queueEvents) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 115);
new Y.EventHandle(this._queueEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 116);
this._queueEvents = null;
        }
    },


    /**
    Executes all commands on the command queue

    @method _flushCommandQueue
    @protected
    **/
    _flushCommandQueue: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_flushCommandQueue", 127);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 128);
if (!this._commandQueue) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 129);
return;
        }

        // need to create a copy because the commandQueue
        // will be flushed after the first command is executed
        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 134);
var queue = Y.merge(this._commandQueue);

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 136);
Y.Object.each(queue, function(value, cmd) {
            _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "(anonymous 3)", 136);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 137);
this.command(cmd, value);
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 140);
this._clearCommandQueue();
    },


    /**
    Adds a command to the queue

    @method _queueCommand
    @protected
    **/
    _queueCommand: function(name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_queueCommand", 150);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 151);
var command = this.commands[name];

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 153);
if (!this._commandQueue) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 154);
this._commandQueue = {};
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 157);
if (command.style && Y.Lang.isValue(command.style.value)) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 158);
value = this._commandQueue[name] ? '' : command.style.value;
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 161);
this._commandQueue[name] = value;

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 163);
return value;
    },


    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `keypress` events on the editor

    @param {EventFacade} e
    @protected
    **/
    _onKeyPress: function(e) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_onKeyPress", 175);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 176);
if (e.metaKey) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 177);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 180);
var selection = this.selection,
            range = selection.range(),
            node;

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 184);
if (range.shrink().isCollapsed() && this._commandQueue) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 185);
e.preventDefault();

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 187);
node = range.insertNode(Y.Node.create(String.fromCharCode(e.charCode)));

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 189);
selection.select(range.selectNode(node));

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 191);
this._flushCommandQueue();

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 193);
selection.select(range.selectNode(node).shrink().collapse());
        } else {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 195);
this._clearCommandQueue();
        }
    },


    /**
    Wrapper for `Editor.Base#_execCommand()`.

    @method _queueBeforeExecStyleCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _queueDoBeforeCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_queueDoBeforeCommand", 208);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 209);
var styleCmd = this.styleCommands[name],
            range, ret;

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 212);
if (styleCmd && 'block' !== styleCmd.type) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 213);
range = this.selection.range();

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 215);
if (range && range.isCollapsed()) {
                _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 216);
ret = this._queueCommand(name, value);
                _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 217);
this._updateSelection({force: true});
                _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 218);
return new Y.Do.Halt('Editor.Queue prevented command', ret);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 221);
this._clearCommandQueue();
        }
    },


    /**
    Wrapper for `Editor.Base#_queryCommandValue()`.

    @method _queueDoBeforeQueryCommandValue
    @param {String} name Command name.
    @protected
    **/
    _queueDoBeforeQuery: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_queueDoBeforeQuery", 233);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 234);
var qCmd = this._commandQueue && this._commandQueue[name],
            styleCmd = this.styleCommands[name];

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 237);
if (styleCmd && Y.Lang.isValue(qCmd)) { // because qCmd could be ''
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 238);
if (Y.Lang.isValue(styleCmd.style.value)) {
                _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 239);
qCmd = qCmd === styleCmd.style.value;
            }

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 242);
return new Y.Do.Halt('Editor.Queue prevented query', qCmd);
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 247);
Y.namespace('Editor').Queue = EditorQueue;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-keys"]});
