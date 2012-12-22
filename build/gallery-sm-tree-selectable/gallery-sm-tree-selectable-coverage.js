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
_yuitest_coverage["build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js"].code=["YUI.add('gallery-sm-tree-selectable', function (Y, NAME) {","","/**","Extension for `Tree` that adds the concept of selection state for nodes.","","@module tree","@submodule tree-selectable","@main tree-selectable","**/","","var Do = Y.Do,","","/**","Extension for `Tree` that adds the concept of selection state for nodes.","","@class Tree.Selectable","@constructor","@extensionfor Tree","**/","","/**","Fired when a node is selected.","","@event select","@param {Tree.Node} node Node being selected.","@preventable _defSelectFn","**/","EVT_SELECT = 'select',","","/**","Fired when a node is unselected.","","@event unselect","@param {Tree.Node} node Node being unselected.","@preventable _defUnselectFn","**/","EVT_UNSELECT = 'unselect';","","function Selectable() {","    Do.after(this._afterDefAddFn, this, '_defAddFn');","    Do.after(this._afterDefClearFn, this, '_defClearFn');","    Do.after(this._afterDefRemoveFn, this, '_defRemoveFn');","}","","Selectable.prototype = {","    // -- Protected Properties -------------------------------------------------","","    /**","    Mapping of node ids to node instances for nodes in this tree that are","    currently selected.","","    @property {Object} _selectedMap","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","","    initializer: function () {","        this.nodeExtensions = this.nodeExtensions.concat(Y.Tree.Node.Selectable);","        this._selectedMap   = {};","","        this._selectableEvents = [","            this.after('multiSelectChange', this._afterMultiSelectChange)","        ];","    },","","    destructor: function () {","        (new Y.EventHandle(this._selectableEvents)).detach();","","        this._selectableEvents = null;","        this._selectedMap      = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns an array of nodes that are currently selected.","","    @method getSelectedNodes","    @return {Tree.Node.Selectable[]} Array of selected nodes.","    **/","    getSelectedNodes: function () {","        return Y.Object.values(this._selectedMap);","    },","","    /**","    Selects the specified node.","","    @method selectNode","    @param {Tree.Node.Selectable} node Node to select.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    selectNode: function (node, options) {","        // Instead of calling node.isSelected(), we look for the node in this","        // tree's selectedMap, which ensures that the `select` event will fire","        // in cases such as a node being added to this tree with its selected","        // state already set to true.","        if (!this._selectedMap[node.id]) {","            this._fire(EVT_SELECT, {node: node}, {","                defaultFn: this._defSelectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Unselects all selected nodes.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        for (var id in this._selectedMap) {","            if (this._selectedMap.hasOwnProperty(id)) {","                this.unselectNode(this._selectedMap[id], options);","            }","        }","","        return this;","    },","","    /**","    Unselects the specified node.","","    @method unselectNode","    @param {Tree.Node.Selectable} node Node to unselect.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselectNode: function (node, options) {","        if (node.isSelected() || this._selectedMap[node.id]) {","            this._fire(EVT_UNSELECT, {node: node}, {","                defaultFn: this._defUnselectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","    _afterDefAddFn: function (e) {","        // If the node is marked as selected, we need go through the select","        // flow.","        if (e.node.isSelected()) {","            this.selectNode(e.node);","        }","    },","","    _afterDefClearFn: function () {","        this._selectedMap = {};","    },","","    _afterDefRemoveFn: function (e) {","        delete e.node.state.selected;","        delete this._selectedMap[e.node.id];","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterMultiSelectChange: function () {","        this.unselect();","    },","","    _defSelectFn: function (e) {","        if (!this.get('multiSelect')) {","            this.unselect();","        }","","        e.node.state.selected = true;","        this._selectedMap[e.node.id] = e.node;","    },","","    _defUnselectFn: function (e) {","        delete e.node.state.selected;","        delete this._selectedMap[e.node.id];","    }","};","","Selectable.ATTRS = {","    /**","    Whether or not to allow multiple nodes to be selected at once.","","    @attribute {Boolean} multiSelect","    @default false","    **/","    multiSelect: {","        value: false","    }","};","","Y.Tree.Selectable = Selectable;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-tree\", \"gallery-sm-tree-node-selectable\"]});"];
_yuitest_coverage["build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js"].lines = {"1":0,"11":0,"39":0,"40":0,"41":0,"42":0,"45":0,"59":0,"60":0,"62":0,"68":0,"70":0,"71":0,"83":0,"101":0,"102":0,"108":0,"121":0,"122":0,"123":0,"127":0,"141":0,"142":0,"148":0,"155":0,"156":0,"161":0,"165":0,"166":0,"171":0,"175":0,"176":0,"179":0,"180":0,"184":0,"185":0,"189":0,"201":0};
_yuitest_coverage["build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js"].functions = {"Selectable:39":0,"initializer:58":0,"destructor:67":0,"getSelectedNodes:82":0,"selectNode:96":0,"unselect:120":0,"unselectNode:140":0,"_afterDefAddFn:152":0,"_afterDefClearFn:160":0,"_afterDefRemoveFn:164":0,"_afterMultiSelectChange:170":0,"_defSelectFn:174":0,"_defUnselectFn:183":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js"].coveredLines = 38;
_yuitest_coverage["build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js"].coveredFunctions = 14;
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 1);
YUI.add('gallery-sm-tree-selectable', function (Y, NAME) {

/**
Extension for `Tree` that adds the concept of selection state for nodes.

@module tree
@submodule tree-selectable
@main tree-selectable
**/

_yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 11);
var Do = Y.Do,

/**
Extension for `Tree` that adds the concept of selection state for nodes.

@class Tree.Selectable
@constructor
@extensionfor Tree
**/

/**
Fired when a node is selected.

@event select
@param {Tree.Node} node Node being selected.
@preventable _defSelectFn
**/
EVT_SELECT = 'select',

/**
Fired when a node is unselected.

@event unselect
@param {Tree.Node} node Node being unselected.
@preventable _defUnselectFn
**/
EVT_UNSELECT = 'unselect';

_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 39);
function Selectable() {
    _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "Selectable", 39);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 40);
Do.after(this._afterDefAddFn, this, '_defAddFn');
    _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 41);
Do.after(this._afterDefClearFn, this, '_defClearFn');
    _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 42);
Do.after(this._afterDefRemoveFn, this, '_defRemoveFn');
}

_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 45);
Selectable.prototype = {
    // -- Protected Properties -------------------------------------------------

    /**
    Mapping of node ids to node instances for nodes in this tree that are
    currently selected.

    @property {Object} _selectedMap
    @protected
    **/

    // -- Lifecycle ------------------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "initializer", 58);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 59);
this.nodeExtensions = this.nodeExtensions.concat(Y.Tree.Node.Selectable);
        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 60);
this._selectedMap   = {};

        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 62);
this._selectableEvents = [
            this.after('multiSelectChange', this._afterMultiSelectChange)
        ];
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "destructor", 67);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 68);
(new Y.EventHandle(this._selectableEvents)).detach();

        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 70);
this._selectableEvents = null;
        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 71);
this._selectedMap      = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns an array of nodes that are currently selected.

    @method getSelectedNodes
    @return {Tree.Node.Selectable[]} Array of selected nodes.
    **/
    getSelectedNodes: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "getSelectedNodes", 82);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 83);
return Y.Object.values(this._selectedMap);
    },

    /**
    Selects the specified node.

    @method selectNode
    @param {Tree.Node.Selectable} node Node to select.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `select` event
            will be suppressed.
    @chainable
    **/
    selectNode: function (node, options) {
        // Instead of calling node.isSelected(), we look for the node in this
        // tree's selectedMap, which ensures that the `select` event will fire
        // in cases such as a node being added to this tree with its selected
        // state already set to true.
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "selectNode", 96);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 101);
if (!this._selectedMap[node.id]) {
            _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 102);
this._fire(EVT_SELECT, {node: node}, {
                defaultFn: this._defSelectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 108);
return this;
    },

    /**
    Unselects all selected nodes.

    @method unselect
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselect: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "unselect", 120);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 121);
for (var id in this._selectedMap) {
            _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 122);
if (this._selectedMap.hasOwnProperty(id)) {
                _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 123);
this.unselectNode(this._selectedMap[id], options);
            }
        }

        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 127);
return this;
    },

    /**
    Unselects the specified node.

    @method unselectNode
    @param {Tree.Node.Selectable} node Node to unselect.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselectNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "unselectNode", 140);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 141);
if (node.isSelected() || this._selectedMap[node.id]) {
            _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 142);
this._fire(EVT_UNSELECT, {node: node}, {
                defaultFn: this._defUnselectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 148);
return this;
    },

    // -- Protected Methods ----------------------------------------------------
    _afterDefAddFn: function (e) {
        // If the node is marked as selected, we need go through the select
        // flow.
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "_afterDefAddFn", 152);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 155);
if (e.node.isSelected()) {
            _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 156);
this.selectNode(e.node);
        }
    },

    _afterDefClearFn: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "_afterDefClearFn", 160);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 161);
this._selectedMap = {};
    },

    _afterDefRemoveFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "_afterDefRemoveFn", 164);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 165);
delete e.node.state.selected;
        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 166);
delete this._selectedMap[e.node.id];
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterMultiSelectChange: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "_afterMultiSelectChange", 170);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 171);
this.unselect();
    },

    _defSelectFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "_defSelectFn", 174);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 175);
if (!this.get('multiSelect')) {
            _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 176);
this.unselect();
        }

        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 179);
e.node.state.selected = true;
        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 180);
this._selectedMap[e.node.id] = e.node;
    },

    _defUnselectFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", "_defUnselectFn", 183);
_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 184);
delete e.node.state.selected;
        _yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 185);
delete this._selectedMap[e.node.id];
    }
};

_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 189);
Selectable.ATTRS = {
    /**
    Whether or not to allow multiple nodes to be selected at once.

    @attribute {Boolean} multiSelect
    @default false
    **/
    multiSelect: {
        value: false
    }
};

_yuitest_coverline("build/gallery-sm-tree-selectable/gallery-sm-tree-selectable.js", 201);
Y.Tree.Selectable = Selectable;


}, '@VERSION@', {"requires": ["gallery-sm-tree", "gallery-sm-tree-node-selectable"]});
