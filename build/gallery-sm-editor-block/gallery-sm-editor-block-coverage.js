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
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].code=["YUI.add('gallery-sm-editor-block', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Block` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-block","**/","","/**","Extension for `Editor.Base` that handles block element formatting","","@class Editor.Block","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var EDOM = Y.Editor.DOM;","","var EditorBlock = Y.Base.create('editorBlock', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of block commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} blockCommands","        @param {Function|String} commandFn","        @param {Function|String} [queryFn]","    **/","    blockCommands: {","        formatBlock: {","            commandFn: '_formatBlock',","            queryFn: '_queryBlockCommand'","        },","","        heading: {","            commandFn: '_formatBlock',","            queryFn: '_queryBlockCommand'","        },","","        insertBreak: {","            commandFn: '_noCommand'","        },","","        insertParagraph: {","            commandFn: '_insertReturn',","            queryFn: '_queryBlockCommand'","        }","    },","","","    /**","    Key commands related to block functionality.","","    @property {Object} styleKeyCommands","    **/","    blockKeyCommands: {","        'alt+c':       'justifyCenter',","        'alt+f':       'justifyFull',","        'alt+l':       'justifyLeft',","        'alt+r':       'justifyRight',","        'enter':       'insertParagraph',","        // ctrl+enter for safari, shift+enter for sane browsers. safe to have","        // both declarations here because they pass through to default behavior","        'ctrl+enter':  {fn: 'insertBreak', allowDefault: true, async: true},","        'shift+enter': {fn: 'insertBreak', allowDefault: true, async: true}","    },","","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} blockTags","    **/","    blockTags: 'div, p, h1, h2, h3, h4, h5',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.commands = Y.merge(this.commands, this.blockCommands);","","        if (this.supportedTags) {","            this.supportedTags += ',' + this.blockTags;","        } else {","            this.supportedTags = this.blockTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);","        }","","        this._attachBlockEvents();","    },","","","    destructor: function () {","        this._detachBlockEvents();","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches block events.","","    @method _attachBlockEvents","    @protected","    **/","    _attachBlockEvents: function () {","        if (this._blockEvents) {","            return;","        }","","        this._blockEvents = [","            this.on('selectionChange', this._blockOnSelectionChange, this)","        ];","    },","","","    /**","    Detaches block events.","","    @method _detachBlockEvents","    @protected","    **/","    _detachBlockEvents: function () {","        if (this._blockEvents) {","            new Y.EventHandle(this._blockEvents).detach();","            this._blockEvents = null;","        }","    },","","","    /**","    Replaces block elements containing the current selection with elements","    of the given `tag`","","    @method _formatBlock","    @param {String} tag The new block element tag","    @protected","    **/","    _formatBlock: function (tag) {","        tag = tag.replace(/[<>]/g, '');","","        if (-1 < this.blockTags.indexOf(tag)) {","            tag = '<' + tag + '>';","","            var selection = this.selection,","                range = selection.range(),","                nodes = [];","","            this._getNodes(range, this.blockTags).each(function (node) {","                var newNode = Y.Node.create(tag);","","                newNode.insert(node.get('childNodes'));","","                EDOM.copyStyles(node, newNode, this.supportedStyles, {","                    explicit: true,","                    overwrite: false","                });","","                node.replace(newNode).remove(true);","","                nodes.push(newNode);","            }, this);","","            // hack until bookmarks are implemented to preserve range","            range.startNode(nodes[0]);","            range.endNode(nodes[nodes.length]);","","            range.shrink().collapse({toStart: true});","","            selection.select(range);","        }","    },","","","    /**","    Inserts a `return` at the current selection point.","","    Any content contained by the range is deleted, resulting in a collapsed range.","","    If the range is at the start of a block, a duplicate, empty block is","    inserted as the previous sibling of current block. The range is positioned","    at the beginning of the new block","","    If the range is at the end of a block, a new `<p>` element is created as","    the next sibling of the current block. The range is positioned at the start","    of the new block.","","    If the range is in the middle of a block, the block will be split at the","    current position. The range will be positioned at the beginning of the new","    block.","","    @method _insertReturn","    @protected","    **/","    _insertReturn: function () {","        var selection = this.selection,","            range = selection.range().shrink(),","            block, startRange, endRange;","","        range.deleteContents();","","        // the range will be collapsed after deleteContents, so","        // there will only ever be one 'block'","        block = this._getNodes(range, this.blockTags).item(0);","","        // when hitting enter in an `empty` block, collapse the","        // the range to the end of the block to force the new block","        // to be inserted after","        if ('' === block.get('text')) {","            range.selectNodeContents(block).collapse();","        }","","        range.expand({stopAt: block});","        startRange = range.clone().selectNodeContents(block).collapse({toStart: true});","        endRange = range.clone().selectNodeContents(block).collapse();","","        if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {","            // the range is collapsed at the start of the block, insert","            // a clone of the block before the current block","            block = block.insert(block.cloneNode(), 'before').previous();","        } else if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {","            // the range is collapsed at the end of the block, start a new","            // paragraph after the current block","            block = block.insert('<p></p>', 'after').next();","        } else {","            // somewhere in the middle of a block node, split it","            block = this._splitRange(range, this.blockTags);","        }","","        // in order to be able to place the cursor inside an element","        // in webkit we need to insert a br","        if (EDOM.isEmptyNode(block)) {","            block.setHTML('<br>');","        }","","        range.selectNodeContents(block).collapse({toStart: true});","","        selection.select(range);","    },","","","    /**","    Default query function for block elements","","    @method _queryBlockCommand","    @return {NodeList} A nodelist of the block nodes containing the range","    @protected","     */","    _queryBlockCommand: function() {","        return this._getNodes(this.selection.range(), this.blockTags);","    },","","","    /**","    Splits elements after the given range until a node matching the","    given `selector` is reached.","","    @method _splitRange","    @param {Range} range","    @param {String} selector","    @return {Node} The node created after splitting","    @protected","    **/","    _splitRange: function (range, selector) {","        var endNode, endOffset;","","        endNode = range.endNode();","        endOffset = range.endOffset();","","        while (!endNode.test(selector)) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (this._inputNode !== endNode) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (!endOffset._node) {","            endOffset = endNode.get('childNodes').item(endOffset);","        }","","        return endOffset;","    },","","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Event handler for the selection `change` event","","    Creates a default `block` if none exists for the current selection","","    @method _blockOnSelectionChange","    @param {EventFacade} e","    @protected","    **/","    _blockOnSelectionChange: function (e) {","        var range = e.range,","            startNode;","","        if (!range || !range.isCollapsed()) {","            return;","        }","","        startNode = range.startNode();","","        if (this._inputNode === startNode.ancestor(this.blockTags, true)) {","            Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');","        }","    }","});","","Y.namespace('Editor').Block = EditorBlock;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].lines = {"1":0,"21":0,"23":0,"25":0,"90":0,"92":0,"93":0,"95":0,"98":0,"99":0,"102":0,"107":0,"120":0,"121":0,"124":0,"137":0,"138":0,"139":0,"153":0,"155":0,"156":0,"158":0,"162":0,"163":0,"165":0,"167":0,"172":0,"174":0,"178":0,"179":0,"181":0,"183":0,"209":0,"213":0,"217":0,"222":0,"223":0,"226":0,"227":0,"228":0,"230":0,"233":0,"234":0,"237":0,"240":0,"245":0,"246":0,"249":0,"251":0,"263":0,"278":0,"280":0,"281":0,"283":0,"284":0,"285":0,"288":0,"289":0,"290":0,"293":0,"294":0,"297":0,"313":0,"316":0,"317":0,"320":0,"322":0,"323":0,"328":0};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].functions = {"initializer:89":0,"destructor:106":0,"_attachBlockEvents:119":0,"_detachBlockEvents:136":0,"(anonymous 3):162":0,"_formatBlock:152":0,"_insertReturn:208":0,"_queryBlockCommand:262":0,"_splitRange:277":0,"_blockOnSelectionChange:312":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].coveredLines = 69;
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].coveredFunctions = 12;
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
        formatBlock: {
            commandFn: '_formatBlock',
            queryFn: '_queryBlockCommand'
        },

        heading: {
            commandFn: '_formatBlock',
            queryFn: '_queryBlockCommand'
        },

        insertBreak: {
            commandFn: '_noCommand'
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
        'enter':       'insertParagraph',
        // ctrl+enter for safari, shift+enter for sane browsers. safe to have
        // both declarations here because they pass through to default behavior
        'ctrl+enter':  {fn: 'insertBreak', allowDefault: true, async: true},
        'shift+enter': {fn: 'insertBreak', allowDefault: true, async: true}
    },


    /**
    HTML tags supported by this editor. Unsupported tags will be treated
    as text

    @property {String} blockTags
    **/
    blockTags: 'div, p, h1, h2, h3, h4, h5',


    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "initializer", 89);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 90);
this.commands = Y.merge(this.commands, this.blockCommands);

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 92);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 93);
this.supportedTags += ',' + this.blockTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 95);
this.supportedTags = this.blockTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 98);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 99);
this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 102);
this._attachBlockEvents();
    },


    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "destructor", 106);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 107);
this._detachBlockEvents();
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches block events.

    @method _attachBlockEvents
    @protected
    **/
    _attachBlockEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_attachBlockEvents", 119);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 120);
if (this._blockEvents) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 121);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 124);
this._blockEvents = [
            this.on('selectionChange', this._blockOnSelectionChange, this)
        ];
    },


    /**
    Detaches block events.

    @method _detachBlockEvents
    @protected
    **/
    _detachBlockEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_detachBlockEvents", 136);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 137);
if (this._blockEvents) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 138);
new Y.EventHandle(this._blockEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 139);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_formatBlock", 152);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 153);
tag = tag.replace(/[<>]/g, '');

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 155);
if (-1 < this.blockTags.indexOf(tag)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 156);
tag = '<' + tag + '>';

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 158);
var selection = this.selection,
                range = selection.range(),
                nodes = [];

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 162);
this._getNodes(range, this.blockTags).each(function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "(anonymous 3)", 162);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 163);
var newNode = Y.Node.create(tag);

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 165);
newNode.insert(node.get('childNodes'));

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 167);
EDOM.copyStyles(node, newNode, this.supportedStyles, {
                    explicit: true,
                    overwrite: false
                });

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 172);
node.replace(newNode).remove(true);

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 174);
nodes.push(newNode);
            }, this);

            // hack until bookmarks are implemented to preserve range
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 178);
range.startNode(nodes[0]);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 179);
range.endNode(nodes[nodes.length]);

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 181);
range.shrink().collapse({toStart: true});

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 183);
selection.select(range);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_insertReturn", 208);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 209);
var selection = this.selection,
            range = selection.range().shrink(),
            block, startRange, endRange;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 213);
range.deleteContents();

        // the range will be collapsed after deleteContents, so
        // there will only ever be one 'block'
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 217);
block = this._getNodes(range, this.blockTags).item(0);

        // when hitting enter in an `empty` block, collapse the
        // the range to the end of the block to force the new block
        // to be inserted after
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 222);
if ('' === block.get('text')) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 223);
range.selectNodeContents(block).collapse();
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 226);
range.expand({stopAt: block});
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 227);
startRange = range.clone().selectNodeContents(block).collapse({toStart: true});
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 228);
endRange = range.clone().selectNodeContents(block).collapse();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 230);
if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {
            // the range is collapsed at the start of the block, insert
            // a clone of the block before the current block
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 233);
block = block.insert(block.cloneNode(), 'before').previous();
        } else {_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 234);
if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {
            // the range is collapsed at the end of the block, start a new
            // paragraph after the current block
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 237);
block = block.insert('<p></p>', 'after').next();
        } else {
            // somewhere in the middle of a block node, split it
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 240);
block = this._splitRange(range, this.blockTags);
        }}

        // in order to be able to place the cursor inside an element
        // in webkit we need to insert a br
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 245);
if (EDOM.isEmptyNode(block)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 246);
block.setHTML('<br>');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 249);
range.selectNodeContents(block).collapse({toStart: true});

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 251);
selection.select(range);
    },


    /**
    Default query function for block elements

    @method _queryBlockCommand
    @return {NodeList} A nodelist of the block nodes containing the range
    @protected
     */
    _queryBlockCommand: function() {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_queryBlockCommand", 262);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 263);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_splitRange", 277);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 278);
var endNode, endOffset;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 280);
endNode = range.endNode();
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 281);
endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 283);
while (!endNode.test(selector)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 284);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 285);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 288);
if (this._inputNode !== endNode) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 289);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 290);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 293);
if (!endOffset._node) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 294);
endOffset = endNode.get('childNodes').item(endOffset);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 297);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_blockOnSelectionChange", 312);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 313);
var range = e.range,
            startNode;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 316);
if (!range || !range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 317);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 320);
startNode = range.startNode();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 322);
if (this._inputNode === startNode.ancestor(this.blockTags, true)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 323);
Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 328);
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
