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

(function() {

var STYLENODE = '<span></span>';

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
        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.queueKeyCommands);
        }

        this._attachQueueEvents();
    },


    destructor: function () {
        this._detachQueueEvents();
    },
    
    
    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches queue events.

    @method _attachQueueEvents
    @protected
    **/
    _attachQueueEvents: function() {
        if (this._queueEvents) {
            return;
        }

        var container = this.get('container');

        this._queueEvents = [
            container.delegate('keypress', this._onKeyPress, this.selectors.input, this),
            Y.Do.before(this._queueBeforeExecCommand, this, '_execCommand', this)
        ];
    },


    /**
    Clears the command queue

    @method _clearCommandQueue
    @protected
    **/
    _clearCommandQueue: function() {
        this._commandQueue = null;
    },


    /**
    Detaches queue events.

    @method _detachQueueEvents
    @protected
    **/
    _detachQueueEvents: function() {
        if (this._queueEvents) {
            new Y.EventHandle(this._queueEvents).detach();
            this._queueEvents = null;
        }
    },
    

    /**
    Executes all commands on the command queue

    @method _flushCommandQueue
    @protected
    **/
    _flushCommandQueue: function() {
        if (!this._commandQueue) {
            return;
        }

        Y.Object.each(this._commandQueue, function(value, cmd) {
            this._execCommand(cmd, value);
        }, this);

        this._clearCommandQueue()
    },


    /**
    Adds a command to the queue

    @method _queueCommand
    @protected
    **/
    _queueCommand: function(name, value) {
        this._commandQueue || (this._commandQueue = {});

        if ('toggle' === value && 'toggle' === this._commandQueue[name]) {
            delete this._commandQueue[name];
        } else {
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
        var range = this.selection.range(),
            wrapperNode, textNode;

        if (range.shrink().isCollapsed() && this._commandQueue) {
            e.preventDefault();

            wrapperNode = range.insertNode(Y.Node.create(STYLENODE));
            wrapperNode.set('text', String.fromCharCode(e.charCode));

            range.selectNode(wrapperNode);

            this.selection.select(range);

            this._flushCommandQueue();

            range = this.selection.range().shrink().collapse();

            this.selection.select(range);
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
        var range = this.selection.range();

        if (range && range.shrink().isCollapsed()) {
            this._queueCommand(name, value);
            return new Y.Do.Halt('queue prevented _execCommand');
        }
    }
});

Y.namespace('Editor').Queue = EditorQueue;

}());
