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
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].code=["YUI.add('gallery-sm-editor-block', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Editor.Block` extension.","","@module gallery-sm-editor","@submodule gallery-sm-editor-block","**/","","/**","Extension for `Editor.Base` that handles block element formatting","","@class Editor.Block","@constructor","@extends Base","@extensionfor Editor.Base","**/","","(function () {","","var EDOM = Y.Editor.DOM;","","var EditorBlock = Y.Base.create('editorBlock', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Hash of block commands supported by this editor.","","    Names should correspond with valid `execCommand()` command names. Values","    are properties in the following format:","","    @property {Object} blockCommands","        @param {String} property The name of the CSS property in camelCase form","        @param {String} [value] The `on` value of the property. eg. `bold`","    **/","    blockCommands: {","        formatBlock: {","            fn: '_formatBlock'","        },","","        heading: {","            fn: '_formatBlock'","        },","","        justify: {","            property: 'textAlign'","        },","","        justifyCenter: {","            fn: 'justifyCenter'","        },","","        justifyLeft: {","            fn: 'justifyLeft'","        },","","        justifyRight: {","            fn: 'justifyRight'","        }","    },","","","    /**","    Key commands related to block functionality.","","    @property {Object} styleKeyCommands","    **/","    blockKeyCommands: {","        'alt+c':       {fn: 'justifyCenter', allowDefault: false, async: false},","        'alt+l':       {fn: 'justifyLeft', allowDefault: false, async: false},","        'alt+r':       {fn: 'justifyRight', allowDefault: false, async: false},","        'alt+h':       {fn: '_heading', allowDefault: false, async: false},","        'backspace':   {fn: '_delete', allowDefault: true},","        'delete':      {fn: '_delete', allowDefault: true},","        'enter':       {fn: '_insertReturn', allowDefault: false, async: false},","        'shift+enter': {fn: '_insertBreak', allowDefault: false, async: false}","    },","","","    /**","    HTML tags supported by this editor. Unsupported tags will be treated","    as text","","    @property {String} blockTags","    **/","    blockTags: 'div, p, h1, h2, h3, h4, h5',","","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        if (this.supportedTags) {","            this.supportedTags += ',' + this.blockTags;","        } else {","            this.supportedTags = this.blockTags;","        }","","        if (this.keyCommands) {","            this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);","        }","","        this._attachBlockEvents();","    },","","","    destructor: function () {","        this._detachBlockEvents();","    },","","","    // -- Public Methods -------------------------------------------------------","","    justifyCenter: function () {","        this.command('justify', 'center');","        return this;","    },","","","    justifyLeft: function () {","        this.command('justify', 'left');","        return this;","    },","","","    justifyRight: function () {","        this.command('justify', 'right');","        return this;","    },","","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches block events.","","    @method _attachBlockEvents","    @protected","    **/","    _attachBlockEvents: function () {","        if (this._blockEvents) {","            return;","        }","","        this._blockEvents = [","            Y.Do.before(this._blockBeforeExecCommand, this, '_execCommand', this),","            this.on('selectionChange', this._blockOnSelectionChange, this)","        ];","    },","","","    /**","    Handles backspace and delete because chrome is an idiot and will copy","    computed styles like `line-height`, `color` and `font-size` when merging","    blocks of different types.","","    For example given the following HTML:","","        <h1>foo</h1>","        <p>bar</p>","","    Hitting backspace with the cursor at the beginning of the `<p>` element will","    create a `<span>` in the `<h1>` after the text `foo` with the computed styles","    of the `<p>` element. The brilliant result is:","","        <h1>foo<span style=\"line-height: 1.2; font-size:12px; color:xxx;\">bar</span></h1>","","    Its so stupid and none of the other browsers (even Safari) behave this way.","","    This method normalizes the behavior when deleting across blocks to *not*","    copy styles. The result from the previous example is now:","","        <h1>foobar</h1>","","    @method _delete","    @param {EventFacade} e","    @param {array} combo","    @protected","    **/","    _delete: function (e, combo) {","        var selection = this.selection,","            range = selection.range(),","            direction = 'backspace' === combo[0] ? 'start' : 'end',","            block, compRange;","","        this._clearCommandQueue();","","        range.deleteContents();","","        if (range.parentNode() === this._inputNode) {","            // we deleted across blocks","            block = this._inputNode.get('childNodes').item(range.startOffset());","","            if ('end' === direction) {","                block = block && block.previous();","            }","","            block && range.selectNodeContents(block).collapse({toStart: ('start' === direction)});","        } else {","            // the range will be collapsed after deleteContents, so","            // there will only ever be one 'block'","            block = this._getNodes(range, this.blockTags).item(0);","        }","","        if (this._inputNode.contains(block)) {","            range.expand({stopAt: block});","            compRange = range.clone().selectNodeContents(block).collapse({toStart: ('start' === direction)});","","            if (0 === range.compare(compRange, {myPoint: direction, otherPoint: direction})) {","                // at the start or end of a block and we are deleting across","                // blocks.  prevent the default delete action and do our magic","                e && e.preventDefault();","","                var fromNode, toNode, childNodes, startNode;","","                if (direction === 'start') {","                    fromNode = block;","                    toNode = block.previous();","                } else {","                    fromNode = block.next();","                    toNode = block;","                }","","                if (fromNode && toNode) {","                    childNodes = fromNode.get('childNodes');","                    startNode = childNodes.item(0);","","                    toNode.append(childNodes);","                    fromNode.remove(true);","","                    range.startNode(startNode, 0);","                }","            }","","            // very important to collapse the range here. Firefox freaks out a","            // bit if the range is still in its expanded state and will require","            // multiple presses of the delete key unless the range is collapsed.","            range.collapse({toStart: true});","        }","","        selection.select(range);","","        // Y.later so the default delete action can run if we didn't","        // end up preventing it","        Y.later(0, this, this._updateSelection, {force: true});","    },","","","    /**","    Detaches block events.","","    @method _detachBlockEvents","    @protected","    **/","    _detachBlockEvents: function () {","        if (this._blockEvents) {","            new Y.EventHandle(this._blockEvents).detach();","            this._blockEvents = null;","        }","    },","","","    /**","    @method _execBlockCommand","    @param {String} name","    @param {Function|Number|String} value","    @protected","    **/","    _execBlockCommand: function (name, value) {","        var command = this.blockCommands[name],","            range = this.selection.range(),","            blocks, fn;","","        if (!range || !command) {","            return;","        }","","        blocks = this._getNodes(range, this.blockTags);","","        if (0 === blocks.size()) {","            return;","        }","","        fn = command.fn;","","        if ('string' === typeof fn) {","            fn = this[fn];","        }","","        fn && fn.call(this, value);","","        if (command.property) {","            blocks.setStyle(command.property, value);","        }","    },","","","    /**","    @method _formatBlock","    @param {String} tag","    @protected","    **/","    _formatBlock: function (tag) {","        tag = tag.replace(/[<>]/g, '');","","        if (-1 < this.blockTags.indexOf(tag)) {","            tag = '<' + tag + '>';","","            var selection = this.selection,","                range = selection.range(),","                nodes = [];","","            this._getNodes(range, this.blockTags).each(function (node) {","                var newNode = Y.Node.create(tag);","","                newNode.insert(node.get('childNodes'));","                node.replace(newNode).remove(true);","","                nodes.push(newNode);","            }, this);","","            // hack until bookmarks are implemented to preserve range","            range.startNode(nodes[0]);","            range.endNode(nodes[nodes.length]);","            console.log('shrink in formatblock');","            range.shrink().collapse({toStart: true});","","            selection.select(range);","        }","    },","","","    /**","    Returns nodes containing any part of the given `range` matching the","    given `selector`","","    @method _getNodes","    @param {Range} range","    @param {String} selector","    @return {NodeList}","    @protected","    **/","    _getNodes: function (range, selector) {","        var testNode, blockNodes = [];","","        range = range.clone().shrink();","","        testNode = range.startNode();","","        if (range.isCollapsed()) {","            if (!EDOM.isTextNode(testNode)) {","                // the range is collapsed so it will never get traversed. grab","                // the exact node referenced by startNode/startOffset and work","                // backwards from there","                testNode = testNode.get('childNodes').item(range.startOffset());","            }","        } else {","            // traversal will include the startNode, so start off with the","            // startNodes parent","            testNode = testNode.get('parentNode');","        }","","        while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {","            if (testNode.test(selector)) {","                blockNodes.push(testNode);","            }","","            testNode = testNode.get('parentNode');","        }","","        range.traverse(function (node) {","           if (node.test(selector)) {","               blockNodes.push(node);","           }","        });","","        return Y.all(blockNodes);","    },","","","    /**","    Inserts a `<br>` at the current selection point","","    @method _insertBreak","    @protected","    **/","    _insertBreak: function () {","        var br = this.insertHTML('<br>');","","        if (!br.get('nextSibling') || '' === br.get('nextSibling').get('text')) {","            this.insertHTML('<br>');","        }","    },","","","    /**","    Inserts a `return` at the current selection point. Depending on the","    current selection, the `return` may split block nodes","","    @method _insertReturn","    @protected","    **/","    _insertReturn: function () {","        var selection = this.selection,","            range = selection.range().shrink(),","            block, startRange, endRange;","","        range.deleteContents();","","        // the range will be collapsed after deleteContents, so","        // there will only ever be one 'block'","        block = this._getNodes(range, this.blockTags).item(0);","","        // when hitting enter in an `empty` block, collapse the","        // the range to the end of the block to force the new block","        // to be inserted after","        if ('' === block.get('text')) {","            range.selectNodeContents(block).collapse();","        }","","        range.expand({stopAt: block});","        startRange = range.clone().selectNodeContents(block).collapse({toStart: true});","        endRange = range.clone().selectNodeContents(block).collapse();","","        if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {","            // the range is collapsed at the start of the block, insert","            // a clone of the block before the current block","            block = block.insert(block.cloneNode(), 'before').previous();","        } else if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {","            // the range is collapsed at the end of the block, start a new","            // paragraph after the current block","            block = block.insert('<p></p>', 'after').next();","        } else {","            // somewhere in the middle of a block node, split it","            block = this._splitRange(range, this.blockTags);","        }","","        // in order to be able to place the cursor inside an element","        // in webkit we need to insert a br","        if (EDOM.isEmptyNode(block)) {","            block.setHTML('<br>');","        }","","        range.selectNodeContents(block).collapse({toStart: true});","","        selection.select(range);","    },","","","    _splitRange: function (range, selector) {","        var endNode, endOffset;","","        endNode = range.endNode();","        endOffset = range.endOffset();","","        while (!endNode.test(selector)) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (this._inputNode !== endNode) {","            endOffset = EDOM.split(endNode, endOffset);","            endNode = endOffset.get('parentNode');","        }","","        if (!endOffset._node) {","            endOffset = endNode.get('childNodes').item(endOffset);","        }","","        return endOffset;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    AOP wrapper for `Editor.Base#_execCommand()`.","","    @method _blockBeforeExecCommand","    @param {String} name Command name.","    @param {Boolean|String} value Command value.","    @protected","    **/","    _blockBeforeExecCommand: function (name, value) {","        if (this.blockCommands[name]) {","            var ret = this._execBlockCommand(name, value);","            return new Y.Do.Halt('Editor.Block prevented _execCommand', ret);","        }","    },","","","    /**","    Event handler for the selection `change` event","","    @method _blockOnSelectionChange","    @param {EventFacade} e","    @protected","    **/","    _blockOnSelectionChange: function (e) {","        var range = e.range,","            startNode;","","        if (!range.isCollapsed()) {","            return;","        }","","        startNode = range.startNode();","","        if (this._inputNode === startNode.ancestor(this.blockTags, true)) {","            Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');","        }","    }","});","","Y.namespace('Editor').Block = EditorBlock;","","}());","","","}, '@VERSION@', {","    \"requires\": [","        \"gallery-sm-editor-base\",","        \"gallery-sm-editor-dom\",","        \"gallery-sm-editor-keys\",","        \"node-style\"","    ]","});"];
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].lines = {"1":0,"21":0,"23":0,"25":0,"94":0,"95":0,"97":0,"100":0,"101":0,"104":0,"109":0,"116":0,"117":0,"122":0,"123":0,"128":0,"129":0,"142":0,"143":0,"146":0,"182":0,"187":0,"189":0,"191":0,"193":0,"195":0,"196":0,"199":0,"203":0,"206":0,"207":0,"208":0,"210":0,"213":0,"215":0,"217":0,"218":0,"219":0,"221":0,"222":0,"225":0,"226":0,"227":0,"229":0,"230":0,"232":0,"239":0,"242":0,"246":0,"257":0,"258":0,"259":0,"271":0,"275":0,"276":0,"279":0,"281":0,"282":0,"285":0,"287":0,"288":0,"291":0,"293":0,"294":0,"305":0,"307":0,"308":0,"310":0,"314":0,"315":0,"317":0,"318":0,"320":0,"324":0,"325":0,"326":0,"327":0,"329":0,"345":0,"347":0,"349":0,"351":0,"352":0,"356":0,"361":0,"364":0,"365":0,"366":0,"369":0,"372":0,"373":0,"374":0,"378":0,"389":0,"391":0,"392":0,"405":0,"409":0,"413":0,"418":0,"419":0,"422":0,"423":0,"424":0,"426":0,"429":0,"430":0,"433":0,"436":0,"441":0,"442":0,"445":0,"447":0,"452":0,"454":0,"455":0,"457":0,"458":0,"459":0,"462":0,"463":0,"464":0,"467":0,"468":0,"471":0,"485":0,"486":0,"487":0,"500":0,"503":0,"504":0,"507":0,"509":0,"510":0,"515":0};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].functions = {"initializer:93":0,"destructor:108":0,"justifyCenter:115":0,"justifyLeft:121":0,"justifyRight:127":0,"_attachBlockEvents:141":0,"_delete:181":0,"_detachBlockEvents:256":0,"_execBlockCommand:270":0,"(anonymous 3):314":0,"_formatBlock:304":0,"(anonymous 4):372":0,"_getNodes:344":0,"_insertBreak:388":0,"_insertReturn:404":0,"_splitRange:451":0,"_blockBeforeExecCommand:484":0,"_blockOnSelectionChange:499":0,"(anonymous 2):21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].coveredLines = 135;
_yuitest_coverage["build/gallery-sm-editor-block/gallery-sm-editor-block.js"].coveredFunctions = 20;
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "initializer", 93);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 94);
if (this.supportedTags) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 95);
this.supportedTags += ',' + this.blockTags;
        } else {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 97);
this.supportedTags = this.blockTags;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 100);
if (this.keyCommands) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 101);
this.keyCommands = Y.merge(this.keyCommands, this.blockKeyCommands);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 104);
this._attachBlockEvents();
    },


    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "destructor", 108);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 109);
this._detachBlockEvents();
    },


    // -- Public Methods -------------------------------------------------------

    justifyCenter: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "justifyCenter", 115);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 116);
this.command('justify', 'center');
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 117);
return this;
    },


    justifyLeft: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "justifyLeft", 121);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 122);
this.command('justify', 'left');
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 123);
return this;
    },


    justifyRight: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "justifyRight", 127);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 128);
this.command('justify', 'right');
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 129);
return this;
    },


    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches block events.

    @method _attachBlockEvents
    @protected
    **/
    _attachBlockEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_attachBlockEvents", 141);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 142);
if (this._blockEvents) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 143);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 146);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_delete", 181);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 182);
var selection = this.selection,
            range = selection.range(),
            direction = 'backspace' === combo[0] ? 'start' : 'end',
            block, compRange;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 187);
this._clearCommandQueue();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 189);
range.deleteContents();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 191);
if (range.parentNode() === this._inputNode) {
            // we deleted across blocks
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 193);
block = this._inputNode.get('childNodes').item(range.startOffset());

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 195);
if ('end' === direction) {
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 196);
block = block && block.previous();
            }

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 199);
block && range.selectNodeContents(block).collapse({toStart: ('start' === direction)});
        } else {
            // the range will be collapsed after deleteContents, so
            // there will only ever be one 'block'
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 203);
block = this._getNodes(range, this.blockTags).item(0);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 206);
if (this._inputNode.contains(block)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 207);
range.expand({stopAt: block});
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 208);
compRange = range.clone().selectNodeContents(block).collapse({toStart: ('start' === direction)});

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 210);
if (0 === range.compare(compRange, {myPoint: direction, otherPoint: direction})) {
                // at the start or end of a block and we are deleting across
                // blocks.  prevent the default delete action and do our magic
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 213);
e && e.preventDefault();

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 215);
var fromNode, toNode, childNodes, startNode;

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 217);
if (direction === 'start') {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 218);
fromNode = block;
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 219);
toNode = block.previous();
                } else {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 221);
fromNode = block.next();
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 222);
toNode = block;
                }

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 225);
if (fromNode && toNode) {
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 226);
childNodes = fromNode.get('childNodes');
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 227);
startNode = childNodes.item(0);

                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 229);
toNode.append(childNodes);
                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 230);
fromNode.remove(true);

                    _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 232);
range.startNode(startNode, 0);
                }
            }

            // very important to collapse the range here. Firefox freaks out a
            // bit if the range is still in its expanded state and will require
            // multiple presses of the delete key unless the range is collapsed.
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 239);
range.collapse({toStart: true});
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 242);
selection.select(range);

        // Y.later so the default delete action can run if we didn't
        // end up preventing it
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 246);
Y.later(0, this, this._updateSelection, {force: true});
    },


    /**
    Detaches block events.

    @method _detachBlockEvents
    @protected
    **/
    _detachBlockEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_detachBlockEvents", 256);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 257);
if (this._blockEvents) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 258);
new Y.EventHandle(this._blockEvents).detach();
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 259);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_execBlockCommand", 270);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 271);
var command = this.blockCommands[name],
            range = this.selection.range(),
            blocks, fn;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 275);
if (!range || !command) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 276);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 279);
blocks = this._getNodes(range, this.blockTags);

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 281);
if (0 === blocks.size()) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 282);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 285);
fn = command.fn;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 287);
if ('string' === typeof fn) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 288);
fn = this[fn];
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 291);
fn && fn.call(this, value);

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 293);
if (command.property) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 294);
blocks.setStyle(command.property, value);
        }
    },


    /**
    @method _formatBlock
    @param {String} tag
    @protected
    **/
    _formatBlock: function (tag) {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_formatBlock", 304);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 305);
tag = tag.replace(/[<>]/g, '');

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 307);
if (-1 < this.blockTags.indexOf(tag)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 308);
tag = '<' + tag + '>';

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 310);
var selection = this.selection,
                range = selection.range(),
                nodes = [];

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 314);
this._getNodes(range, this.blockTags).each(function (node) {
                _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "(anonymous 3)", 314);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 315);
var newNode = Y.Node.create(tag);

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 317);
newNode.insert(node.get('childNodes'));
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 318);
node.replace(newNode).remove(true);

                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 320);
nodes.push(newNode);
            }, this);

            // hack until bookmarks are implemented to preserve range
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 324);
range.startNode(nodes[0]);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 325);
range.endNode(nodes[nodes.length]);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 326);
console.log('shrink in formatblock');
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 327);
range.shrink().collapse({toStart: true});

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 329);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_getNodes", 344);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 345);
var testNode, blockNodes = [];

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 347);
range = range.clone().shrink();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 349);
testNode = range.startNode();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 351);
if (range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 352);
if (!EDOM.isTextNode(testNode)) {
                // the range is collapsed so it will never get traversed. grab
                // the exact node referenced by startNode/startOffset and work
                // backwards from there
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 356);
testNode = testNode.get('childNodes').item(range.startOffset());
            }
        } else {
            // traversal will include the startNode, so start off with the
            // startNodes parent
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 361);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 364);
while (testNode && testNode !== this._inputNode && this._inputNode.contains(testNode)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 365);
if (testNode.test(selector)) {
                _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 366);
blockNodes.push(testNode);
            }

            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 369);
testNode = testNode.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 372);
range.traverse(function (node) {
           _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "(anonymous 4)", 372);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 373);
if (node.test(selector)) {
               _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 374);
blockNodes.push(node);
           }
        });

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 378);
return Y.all(blockNodes);
    },


    /**
    Inserts a `<br>` at the current selection point

    @method _insertBreak
    @protected
    **/
    _insertBreak: function () {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_insertBreak", 388);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 389);
var br = this.insertHTML('<br>');

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 391);
if (!br.get('nextSibling') || '' === br.get('nextSibling').get('text')) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 392);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_insertReturn", 404);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 405);
var selection = this.selection,
            range = selection.range().shrink(),
            block, startRange, endRange;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 409);
range.deleteContents();

        // the range will be collapsed after deleteContents, so
        // there will only ever be one 'block'
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 413);
block = this._getNodes(range, this.blockTags).item(0);

        // when hitting enter in an `empty` block, collapse the
        // the range to the end of the block to force the new block
        // to be inserted after
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 418);
if ('' === block.get('text')) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 419);
range.selectNodeContents(block).collapse();
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 422);
range.expand({stopAt: block});
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 423);
startRange = range.clone().selectNodeContents(block).collapse({toStart: true});
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 424);
endRange = range.clone().selectNodeContents(block).collapse();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 426);
if (0 === range.compare(startRange, {myPoint: 'start', otherPoint: 'start'})) {
            // the range is collapsed at the start of the block, insert
            // a clone of the block before the current block
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 429);
block = block.insert(block.cloneNode(), 'before').previous();
        } else {_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 430);
if (0 === range.compare(endRange, {myPoint: 'end', otherPoint: 'end'})) {
            // the range is collapsed at the end of the block, start a new
            // paragraph after the current block
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 433);
block = block.insert('<p></p>', 'after').next();
        } else {
            // somewhere in the middle of a block node, split it
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 436);
block = this._splitRange(range, this.blockTags);
        }}

        // in order to be able to place the cursor inside an element
        // in webkit we need to insert a br
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 441);
if (EDOM.isEmptyNode(block)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 442);
block.setHTML('<br>');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 445);
range.selectNodeContents(block).collapse({toStart: true});

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 447);
selection.select(range);
    },


    _splitRange: function (range, selector) {
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_splitRange", 451);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 452);
var endNode, endOffset;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 454);
endNode = range.endNode();
        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 455);
endOffset = range.endOffset();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 457);
while (!endNode.test(selector)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 458);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 459);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 462);
if (this._inputNode !== endNode) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 463);
endOffset = EDOM.split(endNode, endOffset);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 464);
endNode = endOffset.get('parentNode');
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 467);
if (!endOffset._node) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 468);
endOffset = endNode.get('childNodes').item(endOffset);
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 471);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_blockBeforeExecCommand", 484);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 485);
if (this.blockCommands[name]) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 486);
var ret = this._execBlockCommand(name, value);
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 487);
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
        _yuitest_coverfunc("build/gallery-sm-editor-block/gallery-sm-editor-block.js", "_blockOnSelectionChange", 499);
_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 500);
var range = e.range,
            startNode;

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 503);
if (!range.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 504);
return;
        }

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 507);
startNode = range.startNode();

        _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 509);
if (this._inputNode === startNode.ancestor(this.blockTags, true)) {
            _yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 510);
Y.Editor.Base.prototype._execCommand.call(this, 'formatBlock', '<p>');
        }
    }
});

_yuitest_coverline("build/gallery-sm-editor-block/gallery-sm-editor-block.js", 515);
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
