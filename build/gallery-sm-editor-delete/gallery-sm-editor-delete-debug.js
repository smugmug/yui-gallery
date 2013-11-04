YUI.add('gallery-sm-editor-delete', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Delete` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-delete
**/

/**
Extension for `Editor.Base` that handles deletion

Provides support for the following commands:

- delete
- forwardDelete

@class Editor.Delete
@extends Base
@extensionfor Editor.Base
**/

(function () {

var isIE = !!(Y.UA.ie);

var EditorDelete = Y.Base.create('editorDelete', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Hash of delete commands supported by this editor.

    Names should correspond with valid `execCommand()` command names. Values
    are properties in the following format:

    @property {Object} deleteCommands
        @param {Function|String} commandFn
        @param {Function|String} [queryFn]
    **/
    deleteCommands: {
        'delete': {
            commandFn: '_delete'
        },

        forwardDelete: {
            commandFn: '_forwardDelete'
        }
    },


    /**
    Key commands related to delete functionality.

    @property {Object} deleteKeyCommands
    **/
    deleteKeyCommands: isIE ? {
        'backspace':   {fn: 'delete',        allowDefault: true, async: true},
        'delete':      {fn: 'forwardDelete', allowDefault: true, async: true}
    } : {
        'backspace':   {fn: 'delete',        allowDefault: false, async: false},
        'delete':      {fn: 'forwardDelete', allowDefault: false, async: false}
    },


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        this.commands = Y.merge(this.commands, this.deleteCommands);

        if (this.keyCommands) {
            this.keyCommands = Y.merge(this.keyCommands, this.deleteKeyCommands);
        }
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Handles backspace and delete because webkit is an idiot and will copy
    computed styles like `line-height`, `color` and `font-size` when merging
    blocks of different types.

    For example given the following HTML:

        <h1>foo</h1>
        <p>bar</p>

    Hitting backspace with the cursor at the beginning of the `<p>` element will
    create a `<span>` in the `<h1>` after the text `foo` with the computed styles
    of the `<p>` element. The brilliant result is:

        <h1>foo<span style="line-height: 1.2; font-size:12px; color:xxx;">bar</span></h1>

    Its so stupid and IE/Firefox do not behave this way.

    Related, when deleting across blocks with different `text-alignment`,
    Firefox will copy `text-alignment` from the later block, which is opposite
    of what the other browsers do.

    This method normalizes the behavior when deleting across blocks to *not*
    copy styles. The result from the previous example is now:

        <h1>foobar</h1>

    @method _delete
    @param {String} [direction=back] `forward` for a forward delete,
    `back` for a backspace
    @protected
    **/
    _delete: isIE ? function (direction) {
        // no-op
    } : function (direction) {
        var selection = this.selection,
            range = selection.range(),
            startBlock = range.startNode().ancestor(this.blockTags, true),
            endBlock = range.endNode().ancestor(this.blockTags, true);

        if ('forward' !== direction) {
            direction = 'back';
        }

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
                }
            }
        }

        range.collapse({toStart: ('back' === direction)});

        selection.select(range);
    },


    /**
    Performs a forward delete from the current cursor position

    @method _forwardDelete
    @protected
    **/
    _forwardDelete: isIE ? function () {
        // no-op
    } : function () {
        return this._delete('forward');
    }
});

Y.namespace('Editor').Delete = EditorDelete;

}());


}, '@VERSION@', {
    "requires": [
        "base-build",
        "gallery-sm-editor-base",
        "gallery-sm-editor-block",
        "gallery-sm-editor-keys",
        "node-base"
    ]
});
