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
@extends Base
@extensionfor Editor.Base
**/

(function() {

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

        // need to create a copy because the commandQueue
        // will be flushed after the first command is executed
        var queue = Y.merge(this._commandQueue);

        Y.Object.each(queue, function(value, cmd) {
            this.command(cmd, value);
        }, this);

        this._clearCommandQueue();
    },


    /**
    Adds a command to the queue

    @method _queueCommand
    @protected
    **/
    _queueCommand: function(name, value) {
        var command = this.commands[name];

        if (!this._commandQueue) {
            this._commandQueue = {};
        }

        if (command.style && Y.Lang.isValue(command.style.value)) {
            value = this._commandQueue[name] ? '' : command.style.value;
        }

        this._commandQueue[name] = value;

        return value;
    },


    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `keypress` events on the editor

    @method _onKeyPress
    @param {EventFacade} e
    @protected
    **/
    _onKeyPress: function(e) {
        if (e.metaKey) {
            return;
        }

        var selection = this.selection,
            range = selection.range(),
            node;

        if (range.shrink().isCollapsed() && this._commandQueue) {
            e.preventDefault();

            node = range.insertNode(Y.Node.create(String.fromCharCode(e.charCode)));

            selection.select(range.selectNode(node));

            this._flushCommandQueue();

            selection.select(range.selectNode(node).shrink().collapse());
        } else {
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
        var styleCmd = this.styleCommands[name],
            range, ret;

        if (styleCmd && 'block' !== styleCmd.type) {
            range = this.selection.range();

            if (range && range.isCollapsed()) {
                ret = this._queueCommand(name, value);
                this._updateSelection({force: true});
                return new Y.Do.Halt('Editor.Queue prevented command', ret);
            }
        } else {
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
        var qCmd = this._commandQueue && this._commandQueue[name],
            styleCmd = this.styleCommands[name];

        if (styleCmd && Y.Lang.isValue(qCmd)) { // because qCmd could be ''
            if (Y.Lang.isValue(styleCmd.style.value)) {
                qCmd = qCmd === styleCmd.style.value;
            }

            return new Y.Do.Halt('Editor.Queue prevented query', qCmd);
        }
    }
});

Y.namespace('Editor').Queue = EditorQueue;

}());


}, '@VERSION@', {
    "requires": [
        "base-build",
        "event-custom",
        "gallery-sm-editor-base",
        "gallery-sm-editor-keys",
        "node-event-delegate"
    ]
});
