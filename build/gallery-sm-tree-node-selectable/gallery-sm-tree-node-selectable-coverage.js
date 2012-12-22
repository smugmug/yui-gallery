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
_yuitest_coverage["build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js"].code=["YUI.add('gallery-sm-tree-node-selectable', function (Y, NAME) {","","/**","Provides the `Tree.Node.Selectable` class, an extension for `Tree.Node` that","adds methods useful for nodes in trees that use the `Tree.Selectable` extension.","","@module tree-selectable","@submodule tree-node-selectable","**/","","/**","`Tree.Node` extension that adds methods useful for nodes in trees that use the","`Tree.Selectable` extension.","","@class Tree.Node.Selectable","@constructor","@extensionfor Tree.Node","**/","","function NodeSelectable() {}","","NodeSelectable.prototype = {","    /**","    Returns `true` if this node is currently selected.","","    @method isSelected","    @return {Boolean} `true` if this node is currently selected, `false`","        otherwise.","    **/","    isSelected: function () {","        return !!this.state.selected;","    },","","    /**","    Selects this node.","","    @method select","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    select: function (options) {","        this.tree.selectNode(this, options);","        return this;","    },","","    /**","    Unselects this node.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        this.tree.unselectNode(this, options);","        return this;","    }","};","","Y.Tree.Node.Selectable = NodeSelectable;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-tree-node\", \"oop\"]});"];
_yuitest_coverage["build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js"].lines = {"1":0,"20":0,"22":0,"31":0,"44":0,"45":0,"58":0,"59":0,"63":0};
_yuitest_coverage["build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js"].functions = {"NodeSelectable:20":0,"isSelected:30":0,"select:43":0,"unselect:57":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js"].coveredLines = 9;
_yuitest_coverage["build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js"].coveredFunctions = 5;
_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 1);
YUI.add('gallery-sm-tree-node-selectable', function (Y, NAME) {

/**
Provides the `Tree.Node.Selectable` class, an extension for `Tree.Node` that
adds methods useful for nodes in trees that use the `Tree.Selectable` extension.

@module tree-selectable
@submodule tree-node-selectable
**/

/**
`Tree.Node` extension that adds methods useful for nodes in trees that use the
`Tree.Selectable` extension.

@class Tree.Node.Selectable
@constructor
@extensionfor Tree.Node
**/

_yuitest_coverfunc("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 20);
function NodeSelectable() {}

_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 22);
NodeSelectable.prototype = {
    /**
    Returns `true` if this node is currently selected.

    @method isSelected
    @return {Boolean} `true` if this node is currently selected, `false`
        otherwise.
    **/
    isSelected: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", "isSelected", 30);
_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 31);
return !!this.state.selected;
    },

    /**
    Selects this node.

    @method select
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `select` event
            will be suppressed.
    @chainable
    **/
    select: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", "select", 43);
_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 44);
this.tree.selectNode(this, options);
        _yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 45);
return this;
    },

    /**
    Unselects this node.

    @method unselect
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselect: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", "unselect", 57);
_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 58);
this.tree.unselectNode(this, options);
        _yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 59);
return this;
    }
};

_yuitest_coverline("build/gallery-sm-tree-node-selectable/gallery-sm-tree-node-selectable.js", 63);
Y.Tree.Node.Selectable = NodeSelectable;


}, '@VERSION@', {"requires": ["gallery-sm-tree-node", "oop"]});
