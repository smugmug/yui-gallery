YUI.add('gallery-sm-editor-block', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Block` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-block
**/

/**
Extension for `Editor.Base` that handles block element formatting

@class Editor.Block
@constructor
@extends Base
@extensionfor Editor.Base
**/

(function () {

var EDOM = Y.Editor.DOM;

var EditorBlock = Y.Base.create('editorBlock', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of block commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} blockCommands
        @param {String} property The name of the CSS property in camelCase form
        @param {String} [value] The `on` value of the property. eg. `bold`
    **/
    blockCommands: {
        formatBlock: {
            fn: '_formatBlock'
        },

        heading: {
            fn: '_formatBlock'
        },

        justify: {
            property: 'textAlign'
        },

        justifyCenter: {
            fn: 'justifyCenter'
        },

        justifyLeft: {
            fn: 'justifyLeft'
        },

        justifyRight: {
            fn: 'justifyRight'
        }
    },


    /**
    Key commands related to block functionality.

    @property {Object} styleKeyCommands
    **/
    blockKeyCommands: {
        'alt+c':       {fn: 'justifyCenter', allowDefault: false, async: false},
        'alt+l':       {fn: 'justifyLeft', allowDefault: false, async: false},
        'alt+r':       {fn: 'justifyRight', allowDefault: false, async: false},
        'alt+h':       {fn: '_heading', allowDefault: false, async: false},
        'backspace':   {fn: '_delete', allowDefault: true},
        'delete':      {fn: '_delete', allowDefault: true},
        'enter':       {fn: '_insertReturn', allowDefault: false, async: false},
        'shift+enter': {fn: '_insertBreak', allowDefault: false, async: false}
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} blockTags
    **/
    blockTags: 'div, p, h1, h2, h3, h4, h5',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        if (this.supportedTags) {
            this.supportedTags += ',' + this.blockTags;
        } else {
            this.supportedTags = this.blockTags;
        }

        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);
        }

        this._attachBlockEvents();
    },


    destructor: function () {
        this._detachBlockEvents();
    },


    // -- Public Methods -------------------------------------------------------

    justifyCenter: function () {
        this.command('justify', 'center');
        return this;
    },


    justifyLeft: function () {
        this.command('justify', 'left');
        return this;
    },


    justifyRight: function () {
        this.command('justify', 'right');
        return this;
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches block events.

    @method _attachBlockEvents
    @protected
    **/
    _attachBlockEvents: function () {
        if (this._blockEvents) {
            return;
        }

        this._blockEvents = [
            Y.Do.before(this._blockBeforeExecCommand, this, '_execCommand', this),
            this.on('selectionChange', this._blockOnSelectionChange, this)
        ];
    },


    /**
    Handles backspace and delete because chrome is an idiot and will copy
    computed styles like `line-height`, `color` and `font-size` when merging
    blocks of different types.

    For example given the following HTML:

        <h1>foo</h1>
        <p>bar</p>

    Hitting backspace with the cursor at the beginning of the `<p>` element will
    create a `<span>` in the `<h1>` after the text `foo` with the computed styles
    of the `<p>` element. The brilliant result is:

        <h1>foo<span style="line-height: 1.2; font-size:12px; color:xxx;">bar</span></h1>

    Its so stupid and none of the other browsers (even Safari) behave this way.

    This method normalizes the behavior when deleting across blocks to *not*
    copy styles. The result from the previous example is now:

        <h1>foobar</h1>

    @method _delete
    @param {EventFacade} e
    @param {array} combo
    @protected
    **/
    _delete: function (e, combo) {
        var selection = this.selection,
            range = selection.range(),
            direction = 'backspace' === combo[0] ? 'start' : 'end',
            block, compRange;

        this._clearCommandQueue();

        range.deleteContents();

        if (range.parentNode() === this._inputNode) {
            // we deleted across blocks
            block = this._inputNode.get('childNodes').item(range.startOffset());

            if ('end' === direction) {
                block = block && block.previous();
            }

            block && range.selectNodeContents(block).collapse({toStart: ('start' === direction)});
        } else {
            // the range will be collapsed after deleteContents, so
            // there will only ever be one 'block'
            block = this._getNodes(range, this.blockTags).item(0);
        }

        if (this._inputNode.contains(block)) {
            range.expand({stopAt: block});
            compRange = range.clone().selectNodeContents(block).collapse({toStart: ('start' === direction)});

            if (0 === range.compare(compRange, {myPoint: direction, otherPoint: direction})) {
                // at the start or end of a block and we are deleting across
                // blocks.  prevent the default delete action and do our magic
                e && e.preventDefault();

                var fromNode, toNode, childNodes, startNode;

                if (direction === 'start') {
                    fromNode = block;
                    toNode = block.previous();
                } else {
                    fromNode = block.next();
                    toNode = block;
                }

                if (fromNode && toNode) {
                    childNodes = fromNode.get('childNodes');
                    startNode = childNodes.item(0);

                    toNode.append(childNodes);
                    fromNode.remove(true);

                    range.startNode(startNode, 0);
                }
            }

            // very important to collapse the range here. Firefox freaks out a
            // bit if the range is still in its expanded state and will require
            // multiple presses of the delete key unless the range is collapsed.
            range.collapse({toStart: true});
        }

        selection.select(range);

        // Y.later so the default delete action can run if we didn't
        // end up preventing it
        Y.later(0, this, this._updateSelection, {force: true});
    },


    /**
    Detaches block events.

    @method _detachBlockEvents
    @protected
    **/
    _detachBlockEvents: function () {
        if (this._blockEvents) {
            new Y.EventHandle(this._blockEvents).detach();
            this._blockEvents = null;
        }
    },


    /**
    @method _execBlockCommand
    @param {String} name
    @param {Function|Number|String} value
    @protected
    **/
    _execBlockCommand: function (name, value) {
        var command = this.blockCommands[name],
            range = this.selection.range(),
            blocks, fn;

        if (!range || !command) {
            return;
        }

        blocks = this._getNodes(range, this.blockTags);

        if (0 === blocks.size()) {
            return;
        }

        fn = command.fn;

        if ('string' === typeof fn) {
            fn = this[fn];
        }

        fn && fn.call(this, value);

        if (command.property) {
            blocks.setStyle(command.property, value);
        }
    },


    /**
    @method _formatBlock
    @param {String} tag
    @protected
    **/
    _formatBlock: function (tag) {
        tag = tag.replace(/[<>]/g, '');

        if (-1 < this.blockTags.indexOf(tag)) {
            tag = '<' + tag + '>';

            var selection = this.selection,
                range = selection.range(),
                nodes = [];

            this._getNodes(range, this.blockTags).each(function (node) {
                var newNode = Y.Node.create(tag);

                newNode.insert(node.get('childNodes'));
                node.replace(newNode).remove(true);

                nodes.push(newNode);
            }, this);

            // hack until bookmarks are implemented to preserve range
            range.startNode(nodes[0]);
            range.endNode(nodes[nodes.length]);
            console.log('shrink in formatblock');
            range.shrink().collapse({toStart: true});

            selection.select(range);
        }
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
        var testNode, blockNodes = [];

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
                blockNodes.push(testNode);
            }

            testNode = testNode.get('parentNode');
        }

        range.traverse(function (node) {
           if (node.test(selector)) {
               blockNodes.push(node);
           }
        });

        return Y.all(blockNodes);
    },


    /**
    Inserts a `<br>` at the current selection point

    @method _insertBreak
    @protected
    **/
    _insertBreak: function () {
        var br = this.insertHTML('<br>');

        if (!br.get('nextSibling') || '' === br.get('nextSibling').get('text')) {
            this.insertHTML('<br>');
        }
    },


    /**
    Inserts a `return` at the current selection point. Depending on the
    current selection, the `return` may split block nodes

    @method _insertReturn
    @protected
    **/
    _insertReturn: function () {
        var selection = this.selection,
            range = selection.range().shrink(),
            block, startRange, endRange;

        range.deleteContents();

        // the range will be collapsed after deleteContents, so
        // there will only ever be one 'block'
        block = this._getNodes(range, this.blockTags).item(0);

        // when hitting enter in an `empty` block, collapse the
        // the range to the end of the block to force the new block
        // to be inserted after
        if ('' === block.get('text')) {
            range.selectNodeContents(block).collapse();
        }

        range.expand({stopAt: block});
        startRange = range.clone().selectNodeContents(block).collapse({toStart: true});
        endRange = range.clone().selectNodeContents(block).collapse();

        if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {
            // the range is collapsed at the start of the block, insert
            // a clone of the block before the current block
            block = block.insert(block.cloneNode(), 'before').previous();
        } else if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {
            // the range is collapsed at the end of the block, start a new
            // paragraph after the current block
            block = block.insert('<p></p>', 'after').next();
        } else {
            // somewhere in the middle of a block node, split it
            block = this._splitRange(range, this.blockTags);
        }

        // in order to be able to place the cursor inside an element
        // in webkit we need to insert a br
        if (EDOM.isEmptyNode(block)) {
            block.setHTML('<br>');
        }

        range.selectNodeContents(block).collapse({toStart: true});

        selection.select(range);
    },


    _splitRange: function (range, selector) {
        var endNode, endOffset;

        endNode = range.endNode();
        endOffset = range.endOffset();

        while (!endNode.test(selector)) {
            endOffset = EDOM.split(endNode, endOffset);
            endNode = endOffset.get('parentNode');
        }

        if (this._inputNode !== endNode) {
            endOffset = EDOM.split(endNode, endOffset);
            endNode = endOffset.get('parentNode');
        }

        if (!endOffset._node) {
            endOffset = endNode.get('childNodes').item(endOffset);
        }

        return endOffset;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    AOP wrapper for `Editor.Base#_execCommand()`.

    @method _blockBeforeExecCommand
    @param {String} name Command name.
    @param {Boolean|String} value Command value.
    @protected
    **/
    _blockBeforeExecCommand: function (name, value) {
        if (this.blockCommands[name]) {
            var ret = this._execBlockCommand(name, value);
            return new Y.Do.Halt('Editor.Block prevented _execCommand', ret);
        }
    },


    /**
    Event handler for the selection `change` event

    @method _blockOnSelectionChange
    @param {EventFacade} e
    @protected
    **/
    _blockOnSelectionChange: function (e) {
        var range = e.range,
            startNode;

        if (!range.isCollapsed()) {
            return;
        }

        startNode = range.startNode();

        if (this._inputNode === startNode.ancestor(this.blockTags, true)) {
            Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');
        }
    }
});

Y.namespace('Editor').Block = EditorBlock;

}());


}, '@VERSION@', {
    "requires": [
        "gallery-sm-editor-base",
        "gallery-sm-editor-dom",
        "gallery-sm-editor-keys",
        "node-style"
    ]
});
