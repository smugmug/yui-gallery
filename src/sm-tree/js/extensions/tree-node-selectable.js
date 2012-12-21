/**
Provides the `Tree.Node.Selectable` class, which extends `Tree.Node` and adds
methods that are useful for nodes in trees that use the `Tree.Selectable`
extension.

@module tree-selectable
@submodule tree-node-selectable
**/

/**
Extends `Tree.Node` and adds methods that are useful for nodes in trees that use
the `Tree.Selectable` extension.

@class Tree.Node.Selectable
@constructor
@extends Tree.Node
**/

function NodeSelectable () {
    Y.Tree.Node.apply(this, arguments);
}

Y.Tree.Node.Selectable = Y.extend(NodeSelectable, Y.Tree.Node, {
    /**
    Returns `true` if this node is currently selected.

    @method isSelected
    @return {Boolean} `true` if this node is currently selected, `false`
        otherwise.
    **/
    isSelected: function () {
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
        this.tree.selectNode(this, options);
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
        this.tree.unselectNode(this, options);
        return this;
    }
});
