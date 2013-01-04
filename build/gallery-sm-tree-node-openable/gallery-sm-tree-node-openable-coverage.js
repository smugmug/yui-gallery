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
_yuitest_coverage["build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js"].code=["YUI.add('gallery-sm-tree-node-openable', function (Y, NAME) {","","/**","Provides the `Tree.Node.Openable` class, an extension for `Tree.Node` that","adds methods useful for nodes in trees that use the `Tree.Openable` extension.","","@module tree-openable","@submodule tree-node-openable","**/","","/**","`Tree.Node` extension that adds methods useful for nodes in trees that use the","`Tree.Openable` extension.","","@class Tree.Node.Openable","@constructor","@extensionfor Tree.Node","**/","","function NodeOpenable() {}","","NodeOpenable.prototype = {","    /**","    Closes this node if it's currently open.","","    @method close","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    close: function (options) {","        this.tree.closeNode(this, options);","        return this;","    },","","    /**","    Returns `true` if this node is currently open.","","    Note: the root node of a tree is always considered to be open.","","    @method isOpen","    @return {Boolean} `true` if this node is currently open, `false` otherwise.","    **/","    isOpen: function () {","        return !!this.state.open || this.isRoot();","    },","","    /**","    Opens this node if it's currently closed.","","    @method open","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    open: function (options) {","        this.tree.openNode(this, options);","        return this;","    },","","    /**","    Toggles the open/closed state of this node, closing it if it's currently","    open or opening it if it's currently closed.","","    @method toggle","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggle: function (options) {","        this.tree.toggleNode(this, options);","        return this;","    }","};","","Y.Tree.Node.Openable = NodeOpenable;","","","}, '@VERSION@', {\"requires\": [\"gallery-sm-tree-node\"]});"];
_yuitest_coverage["build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js"].lines = {"1":0,"20":0,"22":0,"33":0,"34":0,"46":0,"59":0,"60":0,"74":0,"75":0,"79":0};
_yuitest_coverage["build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js"].functions = {"NodeOpenable:20":0,"close:32":0,"isOpen:45":0,"open:58":0,"toggle:73":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js"].coveredLines = 11;
_yuitest_coverage["build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js"].coveredFunctions = 6;
_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 1);
YUI.add('gallery-sm-tree-node-openable', function (Y, NAME) {

/**
Provides the `Tree.Node.Openable` class, an extension for `Tree.Node` that
adds methods useful for nodes in trees that use the `Tree.Openable` extension.

@module tree-openable
@submodule tree-node-openable
**/

/**
`Tree.Node` extension that adds methods useful for nodes in trees that use the
`Tree.Openable` extension.

@class Tree.Node.Openable
@constructor
@extensionfor Tree.Node
**/

_yuitest_coverfunc("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 20);
function NodeOpenable() {}

_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 22);
NodeOpenable.prototype = {
    /**
    Closes this node if it's currently open.

    @method close
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `close` event
            will be suppressed.
    @chainable
    **/
    close: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", "close", 32);
_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 33);
this.tree.closeNode(this, options);
        _yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 34);
return this;
    },

    /**
    Returns `true` if this node is currently open.

    Note: the root node of a tree is always considered to be open.

    @method isOpen
    @return {Boolean} `true` if this node is currently open, `false` otherwise.
    **/
    isOpen: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", "isOpen", 45);
_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 46);
return !!this.state.open || this.isRoot();
    },

    /**
    Opens this node if it's currently closed.

    @method open
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `open` event
            will be suppressed.
    @chainable
    **/
    open: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", "open", 58);
_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 59);
this.tree.openNode(this, options);
        _yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 60);
return this;
    },

    /**
    Toggles the open/closed state of this node, closing it if it's currently
    open or opening it if it's currently closed.

    @method toggle
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, events will be
            suppressed.
    @chainable
    **/
    toggle: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", "toggle", 73);
_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 74);
this.tree.toggleNode(this, options);
        _yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 75);
return this;
    }
};

_yuitest_coverline("build/gallery-sm-tree-node-openable/gallery-sm-tree-node-openable.js", 79);
Y.Tree.Node.Openable = NodeOpenable;


}, '@VERSION@', {"requires": ["gallery-sm-tree-node"]});
