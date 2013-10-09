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
        @param {Function|String} commandFn
        @param {Function|String} [queryFn]
    **/
    blockCommands: {
        'delete': {
            commandFn: '_delete'
        },

        forwardDelete: {
            commandFn: '_forwardDelete'
        },

        formatBlock: {
            commandFn: '_formatBlock',
            queryFn: '_queryBlockCommand'
        },

        heading: {
            commandFn: '_formatBlock',
            queryFn: '_queryBlockCommand'
        },

        insertBreak: {
            commandFn: '_insertBreak'
        },

        insertParagraph: {
            commandFn: '_insertReturn',
            queryFn: '_queryBlockCommand'
        }
    },


    /**
    Key commands related to block functionality.

    @property {Object} styleKeyCommands
    **/
    blockKeyCommands: {
        'alt+c':       'justifyCenter',
        'alt+f':       'justifyFull',
        'alt+l':       'justifyLeft',
        'alt+r':       'justifyRight',
        'backspace':   'delete',
        'delete':      'forwardDelete',
        'enter':       'insertParagraph',
        'shift+enter': 'insertBreak'
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} blockTags
    **/
    blockTags: 'div, p, h1, h2, h3, h4, h5',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        this.commands = Y.merge(this.commands, this.blockCommands);

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
    @param {String} [direction=back] `forward` for a forward delete,
    `back` for a backspace
    @protected
    **/
    _delete: function (direction) {
        var selection = this.selection,
            range = selection.range(),
            startBlock = range.startNode().ancestor(this.blockTags, true),
            endBlock = range.endNode().ancestor(this.blockTags, true);

        // With a collapsed range, a backspace will delete across blocks when
        // the range is a the start of a block and a fwd delete will delete
        // across blocks when the range is at the end of a block. Check to see
        // if the range is positioned at the start or end of the range and
        // assign startBlock/endBlock according to the direction of the delete.
        if (range.isCollapsed()) {
            // collapsed, so startBlock === endBlock.
            range.expand({stopAt: startBlock});

            var compRange = range.clone().selectNodeContents(startBlock),
                compPoint = 'forward' === direction ? 'end' : 'start',
                compValue = range.compare(compRange, {
                    myPoint: compPoint,
                    otherPoint: compPoint
                });

            if (0 === compValue) {
                if ('forward' === direction) {
                    endBlock = startBlock.next();
                } else {
                    endBlock = startBlock;
                    startBlock = endBlock.previous();
                }
            }

            range.collapse();
        }

        // The startBlock/endBlock will be different if deleting
        // across blocks.
        if (startBlock && endBlock && startBlock !== endBlock) {
            range.deleteContents();
            range.endNode(startBlock.get('lastChild'), 'after');
            range.collapse();

            // only copy nodes from elements that have text content
            if (endBlock.get('text').length) {
                startBlock.append(endBlock.get('childNodes'));
            }

            endBlock.remove(true);
        } else {
            // Not deleting across blocks, safe to use the native
            // browser delete methods
            if ('forward' === direction) {
                this._execCommand('forwardDelete');
            } else {
                this._execCommand('delete');
            }

            // although sometimes firefox will delete a node and leave the
            // range in the editor input node which messes up the auto-block
            // generation. If startOffset references a valid node, select it.
            if (this._inputNode === range.parentNode()) {
                startBlock = this._inputNode.get('childNodes')
                                .item(range.startOffset() - 1);

                if (startBlock) {
                    range.selectNodeContents(startBlock);
                    range.collapse();
                }
            }
        }

        selection.select(range);
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
    Replaces block elements containing the current selection with elements
    of the given `tag`

    @method _formatBlock
    @param {String} tag The new block element tag
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

                EDOM.copyStyles(node, newNode, this.supportedStyles, {
                    explicit: true,
                    overwrite: false
                });

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
    Performs a forward delete from the current cursor position

    @method _forwardDelete
    @protected
    **/
    _forwardDelete: function() {
        return this._delete('forward');
    },


    /**
    Inserts a `<br>` at the current selection point

    @method _insertBreak
    @protected
    **/
    _insertBreak: function () {
        var br = this._insertHTML('<br>');

        if (!br.get('nextSibling') || '' === br.get('nextSibling').get('text')) {
            this._insertHTML('<br>');
        }
    },


    /**
    Inserts a `return` at the current selection point.

    Any content contained by the range is deleted, resulting in a collapsed range.

    If the range is at the start of a block, a duplicate, empty block is
    inserted as the previous sibling of current block. The range is positioned
    at the beginning of the new block

    If the range is at the end of a block, a new `<p>` element is created as
    the next sibling of the current block. The range is positioned at the start
    of the new block.

    If the range is in the middle of a block, the block will be split at the
    current position. The range will be positioned at the beginning of the new
    block.

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


    /**
    Default query function for block elements

    @method _queryBlockCommand
    @return {NodeList} A nodelist of the block nodes containing the range
    @protected
     */
    _queryBlockCommand: function() {
        return this._getNodes(this.selection.range(), this.blockTags);
    },


    /**
    Splits elements after the given range until a node matching the
    given `selector` is reached.

    @method _splitRange
    @param {Range} range
    @param {String} selector
    @return {Node} The node created after splitting
    @protected
    **/
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
    Event handler for the selection `change` event

    Creates a default `block` if none exists for the current selection

    @method _blockOnSelectionChange
    @param {EventFacade} e
    @protected
    **/
    _blockOnSelectionChange: function (e) {
        var range = e.range,
            startNode;

        if (!range || !range.isCollapsed()) {
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
