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
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].code=["YUI.add('gallery-sm-editor-queue', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Queue` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-queue","**/","","/**","Extension for `Editor.Base` that queues commands","","@class Editor.Queue","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function() {","","var STYLENODE = '<span></span>';","","var EditorQueue = Y.Base.create('editorStyle', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Key commands related to queue functionality.","","    @property {Object} queueKeyCommands","    **/","    queueKeyCommands: {","        'backspace': {fn: '_clearCommandQueue', allowDefault: true},","        'delete'   : {fn: '_clearCommandQueue', allowDefault: true},","        'down'     : {fn: '_clearCommandQueue', allowDefault: true},","        'end'      : {fn: '_clearCommandQueue', allowDefault: true},","        'enter'    : {fn: '_clearCommandQueue', allowDefault: true},","        'esc'      : {fn: '_clearCommandQueue', allowDefault: true},","        'home'     : {fn: '_clearCommandQueue', allowDefault: true},","        'left'     : {fn: '_clearCommandQueue', allowDefault: true},","        'pgdown'   : {fn: '_clearCommandQueue', allowDefault: true},","        'pgup'     : {fn: '_clearCommandQueue', allowDefault: true},","        'right'    : {fn: '_clearCommandQueue', allowDefault: true},","        'tab'      : {fn: '_clearCommandQueue', allowDefault: true},","        'up'       : {fn: '_clearCommandQueue', allowDefault: true}","    },","","","    // -- Protected Properties -------------------------------------------------","","    /**","    Hash of commands queued for execution on the next keypress.","","    Workaround for webkit bug where it wont place a caret in an empty node","    or between nodes.","","    @property {Object} _commandQueue","    **/","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.queueKeyCommands);","        }","","        this._attachQueueEvents();","    },","","","    destructor: function () {","        this._detachQueueEvents();","    },","    ","    ","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches queue events.","","    @method _attachQueueEvents","    @protected","    **/","    _attachQueueEvents: function() {","        if (this._queueEvents) {","            return;","        }","","        var container = this.get('container');","","        this._queueEvents = [","            container.delegate('keypress', this._onKeyPress, this.selectors.input, this),","            Y.Do.before(this._queueBeforeExecCommand, this, '_execCommand', this),","            Y.Do.before(this._queueBeforeQueryCommandValue, this, '_queryCommandValue', this)","        ];","    },","","","    /**","    Clears the command queue","","    @method _clearCommandQueue","    @protected","    **/","    _clearCommandQueue: function() {","        this._commandQueue = null;","    },","","","    /**","    Detaches queue events.","","    @method _detachQueueEvents","    @protected","    **/","    _detachQueueEvents: function() {","        if (this._queueEvents) {","            new Y.EventHandle(this._queueEvents).detach();","            this._queueEvents = null;","        }","    },","    ","","    /**","    Executes all commands on the command queue","","    @method _flushCommandQueue","    @protected","    **/","    _flushCommandQueue: function() {","        if (!this._commandQueue) {","            return;","        }","","        Y.Object.each(this._commandQueue, function(value, cmd) {","            delete this._commandQueue[cmd];","            this._execCommand(cmd, value);","        }, this);","","        this._clearCommandQueue();","    },","","","    /**","    Adds a command to the queue","","    @method _queueCommand","    @protected","    **/","    _queueCommand: function(name, value) {","        this._commandQueue || (this._commandQueue = {});","","        if ('toggle' === value && 'toggle' === this._commandQueue[name]) {","            delete this._commandQueue[name];","        } else {","            this._commandQueue[name] = value;","        }","    },","","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `keypress` events on the editor","","    @param {EventFacade} e","    @protected","    **/","    _onKeyPress: function(e) {","        var range = this.selection.range(),","            wrapperNode;","","        if (range.shrink().isCollapsed() && this._commandQueue) {","            e.preventDefault();","","            wrapperNode = range.insertNode(Y.Node.create(STYLENODE));","            wrapperNode.set('text', String.fromCharCode(e.charCode));","","            range.selectNode(wrapperNode);","","            this.selection.select(range);","","            this._flushCommandQueue();","","            range = this.selection.range().shrink().collapse();","","            this.selection.select(range);","        } else {","            this._clearCommandQueue();","        }","    },","","","    /**","    Wrapper for `Editor.Base#_execCommand()`.","","    @method _queueBeforeExecCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _queueBeforeExecCommand: function (name, value) {","        var range = this.selection.range();","","        if (range && range.shrink().isCollapsed()) {","            this._queueCommand(name, value);","            return new Y.Do.Halt('queue prevented _execCommand');","        }","    },","","","    /**","    Wrapper for `Editor.Base#_queryCommandValue()`.","","    @method _queueBeforeQueryCommandValue","    @param {String} name Command name.","    @protected","    **/","    _queueBeforeQueryCommandValue: function (name) {","        if (this._commandQueue && this._commandQueue.hasOwnProperty(name)) {","            return new Y.Do.Halt('queue prevented _queryCommandValue', this._commandQueue[name]);","        }","    }","});","","Y.namespace('Editor').Queue = EditorQueue;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-keys\"]});"];
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].lines = {"1":0,"21":0,"23":0,"25":0,"65":0,"66":0,"69":0,"74":0,"87":0,"88":0,"91":0,"93":0,"108":0,"119":0,"120":0,"121":0,"133":0,"134":0,"137":0,"138":0,"139":0,"142":0,"153":0,"155":0,"156":0,"158":0,"172":0,"175":0,"176":0,"178":0,"179":0,"181":0,"183":0,"185":0,"187":0,"189":0,"191":0,"205":0,"207":0,"208":0,"209":0,"222":0,"223":0,"228":0};
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].functions = {"initializer:64":0,"destructor:73":0,"_attachQueueEvents:86":0,"_clearCommandQueue:107":0,"_detachQueueEvents:118":0,"(anonymous 3):137":0,"_flushCommandQueue:132":0,"_queueCommand:152":0,"_onKeyPress:171":0,"_queueBeforeExecCommand:204":0,"_queueBeforeQueryCommandValue:221":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-queue/gallery-sm-editor-queue.js"].coveredLines = 44;
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
var STYLENODE = '<span></span>';

_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 25);
var EditorQueue = Y.Base.create('editorStyle', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Key commands related to queue functionality.

    @property {Object} queueKeyCommands
    **/
    queueKeyCommands: {
        'backspace': {fn: '_clearCommandQueue', allowDefault: true},
        'delete'   : {fn: '_clearCommandQueue', allowDefault: true},
        'down'     : {fn: '_clearCommandQueue', allowDefault: true},
        'end'      : {fn: '_clearCommandQueue', allowDefault: true},
        'enter'    : {fn: '_clearCommandQueue', allowDefault: true},
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
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "initializer", 64);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 65);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 66);
this.keyCommands = Y.merge(this.keyCommands, this.queueKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 69);
this._attachQueueEvents();
    },


    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "destructor", 73);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 74);
this._detachQueueEvents();
    },
    
    
    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches queue events.

    @method _attachQueueEvents
    @protected
    **/
    _attachQueueEvents: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_attachQueueEvents", 86);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 87);
if (this._queueEvents) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 88);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 91);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 93);
this._queueEvents = [
            container.delegate('keypress', this._onKeyPress, this.selectors.input, this),
            Y.Do.before(this._queueBeforeExecCommand, this, '_execCommand', this),
            Y.Do.before(this._queueBeforeQueryCommandValue, this, '_queryCommandValue', this)
        ];
    },


    /**
    Clears the command queue

    @method _clearCommandQueue
    @protected
    **/
    _clearCommandQueue: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_clearCommandQueue", 107);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 108);
this._commandQueue = null;
    },


    /**
    Detaches queue events.

    @method _detachQueueEvents
    @protected
    **/
    _detachQueueEvents: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_detachQueueEvents", 118);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 119);
if (this._queueEvents) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 120);
new Y.EventHandle(this._queueEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 121);
this._queueEvents = null;
        }
    },
    

    /**
    Executes all commands on the command queue

    @method _flushCommandQueue
    @protected
    **/
    _flushCommandQueue: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_flushCommandQueue", 132);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 133);
if (!this._commandQueue) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 134);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 137);
Y.Object.each(this._commandQueue, function(value, cmd) {
            _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "(anonymous 3)", 137);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 138);
delete this._commandQueue[cmd];
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 139);
this._execCommand(cmd, value);
        }, this);

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 142);
this._clearCommandQueue();
    },


    /**
    Adds a command to the queue

    @method _queueCommand
    @protected
    **/
    _queueCommand: function(name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_queueCommand", 152);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 153);
this._commandQueue || (this._commandQueue = {});

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 155);
if ('toggle' === value && 'toggle' === this._commandQueue[name]) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 156);
delete this._commandQueue[name];
        } else {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 158);
this._commandQueue[name] = value;
        }
    },


    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `keypress` events on the editor

    @param {EventFacade} e
    @protected
    **/
    _onKeyPress: function(e) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_onKeyPress", 171);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 172);
var range = this.selection.range(),
            wrapperNode;

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 175);
if (range.shrink().isCollapsed() && this._commandQueue) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 176);
e.preventDefault();

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 178);
wrapperNode = range.insertNode(Y.Node.create(STYLENODE));
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 179);
wrapperNode.set('text', String.fromCharCode(e.charCode));

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 181);
range.selectNode(wrapperNode);

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 183);
this.selection.select(range);

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 185);
this._flushCommandQueue();

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 187);
range = this.selection.range().shrink().collapse();

            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 189);
this.selection.select(range);
        } else {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 191);
this._clearCommandQueue();
        }
    },


    /**
    Wrapper for `Editor.Base#_execCommand()`.

    @method _queueBeforeExecCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _queueBeforeExecCommand: function (name, value) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_queueBeforeExecCommand", 204);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 205);
var range = this.selection.range();

        _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 207);
if (range && range.shrink().isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 208);
this._queueCommand(name, value);
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 209);
return new Y.Do.Halt('queue prevented _execCommand');
        }
    },


    /**
    Wrapper for `Editor.Base#_queryCommandValue()`.

    @method _queueBeforeQueryCommandValue
    @param {String} name Command name.
    @protected
    **/
    _queueBeforeQueryCommandValue: function (name) {
        _yuitest_coverfunc("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", "_queueBeforeQueryCommandValue", 221);
_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 222);
if (this._commandQueue && this._commandQueue.hasOwnProperty(name)) {
            _yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 223);
return new Y.Do.Halt('queue prevented _queryCommandValue', this._commandQueue[name]);
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-queue/gallery-sm-editor-queue.js", 228);
Y.namespace('Editor').Queue = EditorQueue;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-keys"]});
