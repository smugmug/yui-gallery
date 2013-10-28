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
_yuitest_coverage["build/gallery-sm-editor-delete/gallery-sm-editor-delete.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-delete/gallery-sm-editor-delete.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-delete/gallery-sm-editor-delete.js"].code=["YUI.add('gallery-sm-editor-delete', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Delete` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-delete","**/","","/**","Extension for `Editor.Base` that handles deletion","","","@class Editor.Delete","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var isWebkit = !!(Y.UA.webkit);","","var EditorDelete = Y.Base.create('editorDelete', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of delete commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} deleteCommands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    deleteCommands: {","        'delete': {","            commandFn: '_delete'","        },","","        forwardDelete: {","            commandFn: '_forwardDelete'","        }","    },","","","    /**","    Key commands related to delete functionality.","","    @property {Object} styleKeyCommands","    **/","    deleteKeyCommands: isWebkit ? {","        'backspace':   {fn: 'delete',        allowDefault: false, async: false},","        'delete':      {fn: 'forwardDelete', allowDefault: false, async: false}","    } : {","        'backspace':   {fn: 'delete',        allowDefault: true, async: true},","        'delete':      {fn: 'forwardDelete', allowDefault: true, async: true}","    },","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.commands = Y.merge(this.commands, this.deleteCommands);","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.deleteKeyCommands);","        }","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Handles backspace and delete because webkit is an idiot and will copy","    computed styles like `line-height`, `color` and `font-size` when merging","    blocks of different types.","","    For example given the following HTML:","","        <h1>foo</h1>","        <p>bar</p>","","    Hitting backspace with the cursor at the beginning of the `<p>` element will","    create a `<span>` in the `<h1>` after the text `foo` with the computed styles","    of the `<p>` element. The brilliant result is:","","        <h1>foo<span style=\"line-height: 1.2; font-size:12px; color:xxx;\">bar</span></h1>","","    Its so stupid and IE/Firefox do not behave this way.","","    This method normalizes the behavior when deleting across blocks to *not*","    copy styles. The result from the previous example is now:","","        <h1>foobar</h1>","","    @method _delete","    @param {String} [direction=back] `forward` for a forward delete,","    `back` for a backspace","    @protected","    **/","    _delete: isWebkit ? function (direction) {","        var selection = this.selection,","            range = selection.range(),","            startBlock = range.startNode().ancestor(this.blockTags, true),","            endBlock = range.endNode().ancestor(this.blockTags, true);","","        if ('forward' !== direction) {","            direction = 'back';","        }","","        // With a collapsed range, a backspace will delete across blocks when","        // the range is a the start of a block and a fwd delete will delete","        // across blocks when the range is at the end of a block. Check to see","        // if the range is positioned at the start or end of the range and","        // assign startBlock/endBlock according to the direction of the delete.","        if (range.isCollapsed()) {","            // collapsed, so startBlock === endBlock.","            range.expand({stopAt: startBlock});","","            var compRange = range.clone().selectNodeContents(startBlock),","                compPoint = 'forward' === direction ? 'end' : 'start',","                compValue = range.compare(compRange, {","                    myPoint: compPoint,","                    otherPoint: compPoint","                });","","            if (0 === compValue) {","                if ('forward' === direction) {","                    endBlock = startBlock.next();","                } else {","                    endBlock = startBlock;","                    startBlock = endBlock.previous();","                }","            }","        }","","        // The startBlock/endBlock will be different if deleting","        // across blocks.","        if (startBlock && endBlock && startBlock !== endBlock) {","            range.deleteContents();","            range.endNode(startBlock.get('lastChild'), 'after');","","            // only copy nodes from elements that have text content","            if (endBlock.get('text').length) {","                startBlock.append(endBlock.get('childNodes'));","            }","","            endBlock.remove(true);","        } else {","            // Not deleting across blocks, safe to use the native","            // browser delete methods","            if ('forward' === direction) {","                this._execCommand('forwardDelete');","            } else {","                this._execCommand('delete');","            }","        }","","        range.collapse({toStart: ('back' === direction)});","","        selection.select(range);","    } : function () {","        // no-op","    },","","","    /**","    Performs a forward delete from the current cursor position","","    @method _forwardDelete","    @protected","    **/","    _forwardDelete: isWebkit ? function() {","        return this._delete('forward');","    } : function () {","        // no-op","    }","});","","Y.namespace('Editor').Delete = EditorDelete;","","}());","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-editor-base\", \"gallery-sm-editor-block\", \"gallery-sm-editor-keys\", \"node\"]});"];
_yuitest_coverage["build/gallery-sm-editor-delete/gallery-sm-editor-delete.js"].lines = {"1":0,"22":0,"24":0,"26":0,"67":0,"69":0,"70":0,"106":0,"111":0,"112":0,"120":0,"122":0,"124":0,"131":0,"132":0,"133":0,"135":0,"136":0,"143":0,"144":0,"145":0,"148":0,"149":0,"152":0,"156":0,"157":0,"159":0,"163":0,"165":0,"178":0,"184":0};
_yuitest_coverage["build/gallery-sm-editor-delete/gallery-sm-editor-delete.js"].functions = {"initializer:66":0,"(anonymous 3):105":0,"(anonymous 4):177":0,"(anonymous 2):22":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-delete/gallery-sm-editor-delete.js"].coveredLines = 31;
_yuitest_coverage["build/gallery-sm-editor-delete/gallery-sm-editor-delete.js"].coveredFunctions = 5;
_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 1);
YUI.add('gallery-sm-editor-delete', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Editor.Delete` extension.

@module gallery-sm-editor
@submodule gallery-sm-editor-delete
**/

/**
Extension for `Editor.Base` that handles deletion


@class Editor.Delete
@constructor
@extends Base
@extensionfor Editor.Base
**/

_yuitest_coverfunc("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 22);
(function () {

_yuitest_coverfunc("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", "(anonymous 2)", 22);
_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 24);
var isWebkit = !!(Y.UA.webkit);

_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 26);
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

    @property {Object} styleKeyCommands
    **/
    deleteKeyCommands: isWebkit ? {
        'backspace':   {fn: 'delete',        allowDefault: false, async: false},
        'delete':      {fn: 'forwardDelete', allowDefault: false, async: false}
    } : {
        'backspace':   {fn: 'delete',        allowDefault: true, async: true},
        'delete':      {fn: 'forwardDelete', allowDefault: true, async: true}
    },


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", "initializer", 66);
_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 67);
this.commands = Y.merge(this.commands, this.deleteCommands);

        _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 69);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 70);
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

    This method normalizes the behavior when deleting across blocks to *not*
    copy styles. The result from the previous example is now:

        <h1>foobar</h1>

    @method _delete
    @param {String} [direction=back] `forward` for a forward delete,
    `back` for a backspace
    @protected
    **/
    _delete: isWebkit ? function (direction) {
        _yuitest_coverfunc("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", "(anonymous 3)", 105);
_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 106);
var selection = this.selection,
            range = selection.range(),
            startBlock = range.startNode().ancestor(this.blockTags, true),
            endBlock = range.endNode().ancestor(this.blockTags, true);

        _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 111);
if ('forward' !== direction) {
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 112);
direction = 'back';
        }

        // With a collapsed range, a backspace will delete across blocks when
        // the range is a the start of a block and a fwd delete will delete
        // across blocks when the range is at the end of a block. Check to see
        // if the range is positioned at the start or end of the range and
        // assign startBlock/endBlock according to the direction of the delete.
        _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 120);
if (range.isCollapsed()) {
            // collapsed, so startBlock === endBlock.
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 122);
range.expand({stopAt: startBlock});

            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 124);
var compRange = range.clone().selectNodeContents(startBlock),
                compPoint = 'forward' === direction ? 'end' : 'start',
                compValue = range.compare(compRange, {
                    myPoint: compPoint,
                    otherPoint: compPoint
                });

            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 131);
if (0 === compValue) {
                _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 132);
if ('forward' === direction) {
                    _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 133);
endBlock = startBlock.next();
                } else {
                    _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 135);
endBlock = startBlock;
                    _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 136);
startBlock = endBlock.previous();
                }
            }
        }

        // The startBlock/endBlock will be different if deleting
        // across blocks.
        _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 143);
if (startBlock && endBlock && startBlock !== endBlock) {
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 144);
range.deleteContents();
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 145);
range.endNode(startBlock.get('lastChild'), 'after');

            // only copy nodes from elements that have text content
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 148);
if (endBlock.get('text').length) {
                _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 149);
startBlock.append(endBlock.get('childNodes'));
            }

            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 152);
endBlock.remove(true);
        } else {
            // Not deleting across blocks, safe to use the native
            // browser delete methods
            _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 156);
if ('forward' === direction) {
                _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 157);
this._execCommand('forwardDelete');
            } else {
                _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 159);
this._execCommand('delete');
            }
        }

        _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 163);
range.collapse({toStart: ('back' === direction)});

        _yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 165);
selection.select(range);
    } : function () {
        // no-op
    },


    /**
    Performs a forward delete from the current cursor position

    @method _forwardDelete
    @protected
    **/
    _forwardDelete: isWebkit ? function() {
        _yuitest_coverfunc("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", "(anonymous 4)", 177);
_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 178);
return this._delete('forward');
    } : function () {
        // no-op
    }
});

_yuitest_coverline("build/gallery-sm-editor-delete/gallery-sm-editor-delete.js", 184);
Y.namespace('Editor').Delete = EditorDelete;

}());


}, '@VERSION@', {"requires": ["gallery-sm-editor-base", "gallery-sm-editor-block", "gallery-sm-editor-keys", "node"]});
