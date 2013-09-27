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
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-editor-block/gallery-sm-editor-block.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].code=["YUI.add('gallery-sm-editor-block', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Block` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-block","**/","","/**","Extension for `Editor.Base` that handles block element formatting","","@class Editor.Block","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var EDOM = Y.Editor.DOM;","","var EditorBlock = Y.Base.create('editorBlock', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of block commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} blockCommands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    blockCommands: {","        'delete': {","            commandFn: '_delete'","        },","","        forwardDelete: {","            commandFn: '_forwardDelete'","        },","","        formatBlock: {","            commandFn: '_formatBlock',","            queryFn: '_queryBlockCommand'","        },","","        heading: {","            commandFn: '_formatBlock',","            queryFn: '_queryBlockCommand'","        },","","        insertParagraph: {","            commandFn: '_insertReturn',","            queryFn: '_queryBlockCommand'","        }","    },","","","    /**","    Key commands related to block functionality.","","    @property {Object} styleKeyCommands","    **/","    blockKeyCommands: {","        'alt+c':       'justifyCenter',","        'alt+f':       'justifyFull',","        'alt+l':       'justifyLeft',","        'alt+r':       'justifyRight',","        'backspace':   'delete',","        'delete':      'forwardDelete',","        'enter':       'insertParagraph',","        'shift+enter': 'insertBreak'","    },","","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} blockTags","    **/","    blockTags: 'div, p, h1, h2, h3, h4, h5',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.commands = Y.merge(this.commands, this.blockCommands);","","        if (this.supportedTags) {","            this.supportedTags += ',' + this.blockTags;","        } else {","            this.supportedTags = this.blockTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);","        }","","        this._attachBlockEvents();","    },","","","    destructor: function () {","        this._detachBlockEvents();","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches block events.","","    @method _attachBlockEvents","    @protected","    **/","    _attachBlockEvents: function () {","        if (this._blockEvents) {","            return;","        }","","        this._blockEvents = [","            this.on('selectionChange', this._blockOnSelectionChange, this)","        ];","    },","","","    /**","    Handles backspace and delete because chrome is an idiot and will copy","    computed styles like `line-height`, `color` and `font-size` when merging","    blocks of different types.","","    For example given the following HTML:","","        <h1>foo</h1>","        <p>bar</p>","","    Hitting backspace with the cursor at the beginning of the `<p>` element will","    create a `<span>` in the `<h1>` after the text `foo` with the computed styles","    of the `<p>` element. The brilliant result is:","","        <h1>foo<span style=\"line-height: 1.2; font-size:12px; color:xxx;\">bar</span></h1>","","    Its so stupid and none of the other browsers (even Safari) behave this way.","","    This method normalizes the behavior when deleting across blocks to *not*","    copy styles. The result from the previous example is now:","","        <h1>foobar</h1>","","    @method _delete","    @param {String} [direction=back] `forward` for a forward delete,","    `back` for a backspace","    @protected","    **/","    _delete: function (direction) {","        var selection = this.selection,","            range = selection.range(),","            block, compRange;","","        direction = 'forward' === direction ? 'end' : 'start';","","        range.deleteContents();","","        if (range.parentNode() === this._inputNode) {","            // we deleted across blocks","            block = this._inputNode.get('childNodes').item(range.startOffset());","","            if ('end' === direction) {","                block = block && block.previous();","            }","","            block && range.selectNodeContents(block).collapse({toStart: ('start' === direction)});","        } else {","            // the range will be collapsed after deleteContents, so","            // there will only ever be one 'block'","            block = this._getNodes(range, this.blockTags).item(0);","        }","","        if (this._inputNode.contains(block)) {","            range.expand({stopAt: block});","            compRange = range.clone().selectNodeContents(block).collapse({toStart: ('start' === direction)});","","            if (0 === range.compare(compRange, {myPoint: direction, otherPoint: direction})) {","                // at the start or end of a block and we are deleting across","                // blocks.  prevent the default delete action and do our magic","","                var fromNode, toNode, childNodes, startNode;","","                if (direction === 'start') {","                    fromNode = block;","                    toNode = block.previous();","                } else {","                    fromNode = block.next();","                    toNode = block;","                }","","                if (fromNode && toNode) {","                    childNodes = fromNode.get('childNodes');","                    startNode = childNodes.item(0);","","                    toNode.append(childNodes);","                    fromNode.remove(true);","","                    range.startNode(startNode, 0);","                }","            } else {","                if ('start' === direction) {","                    this._execCommand('delete');","                } else {","                    this._execCommand('forwardDelete');","                }","            }","","            // very important to collapse the range here. Firefox freaks out a","            // bit if the range is still in its expanded state and will require","            // multiple presses of the delete key unless the range is collapsed.","            range.collapse({toStart: true});","        }","","        selection.select(range);","    },","","","    /**","    Detaches block events.","","    @method _detachBlockEvents","    @protected","    **/","    _detachBlockEvents: function () {","        if (this._blockEvents) {","            new Y.EventHandle(this._blockEvents).detach();","            this._blockEvents = null;","        }","    },","","","    /**","    Replaces block elements containing the current selection with elements","    of the given `tag`","","    @method _formatBlock","    @param {String} tag The new block element tag","    @protected","    **/","    _formatBlock: function (tag) {","        tag = tag.replace(/[<>]/g, '');","","        if (-1 < this.blockTags.indexOf(tag)) {","            tag = '<' + tag + '>';","","            var selection = this.selection,","                range = selection.range(),","                nodes = [];","","            this._getNodes(range, this.blockTags).each(function (node) {","                var newNode = Y.Node.create(tag);","","                newNode.insert(node.get('childNodes'));","","                EDOM.copyStyles(node, newNode, this.supportedStyles, {","                    explicit: true,","                    overwrite: false","                });","","                node.replace(newNode).remove(true);","","                nodes.push(newNode);","            }, this);","","            // hack until bookmarks are implemented to preserve range","            range.startNode(nodes[0]);","            range.endNode(nodes[nodes.length]);","            console.log('shrink in formatblock');","            range.shrink().collapse({toStart: true});","","            selection.select(range);","        }","    },","","","    /**","    Performs a forward delete from the current cursor position","","    @method _forwardDelete","    @protected","    **/","    _forwardDelete: function() {","        return this._delete('forward');","    },","","","    /**","    Inserts a `<br>` at the current selection point","","    @method _insertBreak","    @protected","    **/","    insertBreak: function () {","        var br = this.insertHTML('<br>');","","        if (!br.get('nextSibling') || '' === br.get('nextSibling').get('text')) {","            this.insertHTML('<br>');","        }","    },","","","    /**","    Inserts a `return` at the current selection point.","","    Any content contained by the range is deleted, resulting in a collapsed range.","","    If the range is at the start of a block, a duplicate, empty block is","    inserted as the previous sibling of current block. The range is positioned","    at the beginning of the new block","","    If the range is at the end of a block, a new `<p>` element is created as","    the next sibling of the current block. The range is positioned at the start","    of the new block.","","    If the range is in the middle of a block, the block will be split at the","    current position. The range will be positioned at the beginning of the new","    block.","","    @method _insertReturn","    @protected","    **/","    _insertReturn: function () {","        var selection = this.selection,","            range = selection.range().shrink(),","            block, startRange, endRange;","","        range.deleteContents();","","        // the range will be collapsed after deleteContents, so","        // there will only ever be one 'block'","        block = this._getNodes(range, this.blockTags).item(0);","","        // when hitting enter in an `empty` block, collapse the","        // the range to the end of the block to force the new block","        // to be inserted after","        if ('' === block.get('text')) {","            range.selectNodeContents(block).collapse();","        }","","        range.expand({stopAt: block});","        startRange = range.clone().selectNodeContents(block).collapse({toStart: true});","        endRange = range.clone().selectNodeContents(block).collapse();","","        if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {","            // the range is collapsed at the start of the block, insert","            // a clone of the block before the current block","            block = block.insert(block.cloneNode(), 'before').previous();","        } else if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {","            // the range is collapsed at the end of the block, start a new","            // paragraph after the current block","            block = block.insert('<p></p>', 'after').next();","        } else {","            // somewhere in the middle of a block node, split it","            block = this._splitRange(range, this.blockTags);","        }","","        // in order to be able to place the cursor inside an element","        // in webkit we need to insert a br","        if (EDOM.isEmptyNode(block)) {","            block.setHTML('<br>');","        }","","        range.selectNodeContents(block).collapse({toStart: true});","","        selection.select(range);","    },","","","    /**","    Default query function for block elements","","    @method _queryBlockCommand","    @return {NodeList} A nodelist of the block nodes containing the range","    @protected","     */","    _queryBlockCommand: function() {","        return this._getNodes(this.selection.range(), this.blockTags);","    },","","","    /**","    Splits elements after the given range until a node matching the","    given `selector` is reached.","","    @method _splitRange","    @param {Range} range","    @param {String} selector","    @return {Node} The node created after splitting","    @protected","    **/","    _splitRange: function (range, selector) {","        var endNode, endOffset;","","        endNode = range.endNode();","        endOffset = range.endOffset();","","        while (!endNode.test(selector)) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (this._inputNode !== endNode) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (!endOffset._node) {","            endOffset = endNode.get('childNodes').item(endOffset);","        }","","        return endOffset;","    },","","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Event handler for the selection `change` event","","    Creates a default `block` if none exists for the current selection","","    @method _blockOnSelectionChange","    @param {EventFacade} e","    @protected","    **/","    _blockOnSelectionChange: function (e) {","        var range = e.range,","            startNode;","","        if (!range.isCollapsed()) {","            return;","        }","","        startNode = range.startNode();","","        if (this._inputNode === startNode.ancestor(this.blockTags, true)) {","            Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');","        }","    }","});","","Y.namespace('Editor').Block = EditorBlock;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].lines = {"1":0,"21":0,"23":0,"25":0,"93":0,"95":0,"96":0,"98":0,"101":0,"102":0,"105":0,"110":0,"123":0,"124":0,"127":0,"162":0,"166":0,"168":0,"170":0,"172":0,"174":0,"175":0,"178":0,"182":0,"185":0,"186":0,"187":0,"189":0,"193":0,"195":0,"196":0,"197":0,"199":0,"200":0,"203":0,"204":0,"205":0,"207":0,"208":0,"210":0,"213":0,"214":0,"216":0,"223":0,"226":0,"237":0,"238":0,"239":0,"253":0,"255":0,"256":0,"258":0,"262":0,"263":0,"265":0,"267":0,"272":0,"274":0,"278":0,"279":0,"280":0,"281":0,"283":0,"295":0,"306":0,"308":0,"309":0,"335":0,"339":0,"343":0,"348":0,"349":0,"352":0,"353":0,"354":0,"356":0,"359":0,"360":0,"363":0,"366":0,"371":0,"372":0,"375":0,"377":0,"389":0,"404":0,"406":0,"407":0,"409":0,"410":0,"411":0,"414":0,"415":0,"416":0,"419":0,"420":0,"423":0,"439":0,"442":0,"443":0,"446":0,"448":0,"449":0,"454":0};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].functions = {"initializer:92":0,"destructor:109":0,"_attachBlockEvents:122":0,"_delete:161":0,"_detachBlockEvents:236":0,"(anonymous 3):262":0,"_formatBlock:252":0,"_forwardDelete:294":0,"insertBreak:305":0,"_insertReturn:334":0,"_queryBlockCommand:388":0,"_splitRange:403":0,"_blockOnSelectionChange:438":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].coveredLines = 104;
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].coveredFunctions = 15;
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 1);
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

_yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 21);
(function () {

_yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "(anonymous 2)", 21);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 23);
var EDOM = Y.Editor.DOM;

_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 25);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "initializer", 92);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 93);
this.commands = Y.merge(this.commands, this.blockCommands);

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 95);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 96);
this.supportedTags += ',' + this.blockTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 98);
this.supportedTags = this.blockTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 101);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 102);
this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 105);
this._attachBlockEvents();
    },


    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "destructor", 109);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 110);
this._detachBlockEvents();
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches block events.

    @method _attachBlockEvents
    @protected
    **/
    _attachBlockEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_attachBlockEvents", 122);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 123);
if (this._blockEvents) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 124);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 127);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_delete", 161);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 162);
var selection = this.selection,
            range = selection.range(),
            block, compRange;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 166);
direction = 'forward' === direction ? 'end' : 'start';

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 168);
range.deleteContents();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 170);
if (range.parentNode() === this._inputNode) {
            // we deleted across blocks
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 172);
block = this._inputNode.get('childNodes').item(range.startOffset());

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 174);
if ('end' === direction) {
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 175);
block = block && block.previous();
            }

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 178);
block && range.selectNodeContents(block).collapse({toStart: ('start' === direction)});
        } else {
            // the range will be collapsed after deleteContents, so
            // there will only ever be one 'block'
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 182);
block = this._getNodes(range, this.blockTags).item(0);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 185);
if (this._inputNode.contains(block)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 186);
range.expand({stopAt: block});
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 187);
compRange = range.clone().selectNodeContents(block).collapse({toStart: ('start' === direction)});

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 189);
if (0 === range.compare(compRange, {myPoint: direction, otherPoint: direction})) {
                // at the start or end of a block and we are deleting across
                // blocks.  prevent the default delete action and do our magic

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 193);
var fromNode, toNode, childNodes, startNode;

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 195);
if (direction === 'start') {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 196);
fromNode = block;
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 197);
toNode = block.previous();
                } else {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 199);
fromNode = block.next();
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 200);
toNode = block;
                }

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 203);
if (fromNode && toNode) {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 204);
childNodes = fromNode.get('childNodes');
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 205);
startNode = childNodes.item(0);

                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 207);
toNode.append(childNodes);
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 208);
fromNode.remove(true);

                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 210);
range.startNode(startNode, 0);
                }
            } else {
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 213);
if ('start' === direction) {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 214);
this._execCommand('delete');
                } else {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 216);
this._execCommand('forwardDelete');
                }
            }

            // very important to collapse the range here. Firefox freaks out a
            // bit if the range is still in its expanded state and will require
            // multiple presses of the delete key unless the range is collapsed.
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 223);
range.collapse({toStart: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 226);
selection.select(range);
    },


    /**
    Detaches block events.

    @method _detachBlockEvents
    @protected
    **/
    _detachBlockEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_detachBlockEvents", 236);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 237);
if (this._blockEvents) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 238);
new Y.EventHandle(this._blockEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 239);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_formatBlock", 252);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 253);
tag = tag.replace(/[<>]/g, '');

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 255);
if (-1 < this.blockTags.indexOf(tag)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 256);
tag = '<' + tag + '>';

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 258);
var selection = this.selection,
                range = selection.range(),
                nodes = [];

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 262);
this._getNodes(range, this.blockTags).each(function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "(anonymous 3)", 262);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 263);
var newNode = Y.Node.create(tag);

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 265);
newNode.insert(node.get('childNodes'));

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 267);
EDOM.copyStyles(node, newNode, this.supportedStyles, {
                    explicit: true,
                    overwrite: false
                });

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 272);
node.replace(newNode).remove(true);

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 274);
nodes.push(newNode);
            }, this);

            // hack until bookmarks are implemented to preserve range
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 278);
range.startNode(nodes[0]);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 279);
range.endNode(nodes[nodes.length]);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 280);
console.log('shrink in formatblock');
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 281);
range.shrink().collapse({toStart: true});

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 283);
selection.select(range);
        }
    },


    /**
    Performs a forward delete from the current cursor position

    @method _forwardDelete
    @protected
    **/
    _forwardDelete: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_forwardDelete", 294);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 295);
return this._delete('forward');
    },


    /**
    Inserts a `<br>` at the current selection point

    @method _insertBreak
    @protected
    **/
    insertBreak: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "insertBreak", 305);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 306);
var br = this.insertHTML('<br>');

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 308);
if (!br.get('nextSibling') || '' === br.get('nextSibling').get('text')) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 309);
this.insertHTML('<br>');
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_insertReturn", 334);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 335);
var selection = this.selection,
            range = selection.range().shrink(),
            block, startRange, endRange;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 339);
range.deleteContents();

        // the range will be collapsed after deleteContents, so
        // there will only ever be one 'block'
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 343);
block = this._getNodes(range, this.blockTags).item(0);

        // when hitting enter in an `empty` block, collapse the
        // the range to the end of the block to force the new block
        // to be inserted after
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 348);
if ('' === block.get('text')) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 349);
range.selectNodeContents(block).collapse();
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 352);
range.expand({stopAt: block});
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 353);
startRange = range.clone().selectNodeContents(block).collapse({toStart: true});
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 354);
endRange = range.clone().selectNodeContents(block).collapse();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 356);
if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {
            // the range is collapsed at the start of the block, insert
            // a clone of the block before the current block
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 359);
block = block.insert(block.cloneNode(), 'before').previous();
        } else {_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 360);
if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {
            // the range is collapsed at the end of the block, start a new
            // paragraph after the current block
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 363);
block = block.insert('<p></p>', 'after').next();
        } else {
            // somewhere in the middle of a block node, split it
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 366);
block = this._splitRange(range, this.blockTags);
        }}

        // in order to be able to place the cursor inside an element
        // in webkit we need to insert a br
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 371);
if (EDOM.isEmptyNode(block)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 372);
block.setHTML('<br>');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 375);
range.selectNodeContents(block).collapse({toStart: true});

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 377);
selection.select(range);
    },


    /**
    Default query function for block elements

    @method _queryBlockCommand
    @return {NodeList} A nodelist of the block nodes containing the range
    @protected
     */
    _queryBlockCommand: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_queryBlockCommand", 388);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 389);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_splitRange", 403);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 404);
var endNode, endOffset;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 406);
endNode = range.endNode();
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 407);
endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 409);
while (!endNode.test(selector)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 410);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 411);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 414);
if (this._inputNode !== endNode) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 415);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 416);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 419);
if (!endOffset._node) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 420);
endOffset = endNode.get('childNodes').item(endOffset);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 423);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_blockOnSelectionChange", 438);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 439);
var range = e.range,
            startNode;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 442);
if (!range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 443);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 446);
startNode = range.startNode();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 448);
if (this._inputNode === startNode.ancestor(this.blockTags, true)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 449);
Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 454);
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
