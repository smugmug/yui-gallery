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
_yuitest_coverage["build/gallery-sm-tree-node/gallery-sm-tree-node.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-tree-node/gallery-sm-tree-node.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-tree-node/gallery-sm-tree-node.js"].code=["YUI.add('gallery-sm-tree-node', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Tree.Node` class, which represents a tree node contained in a","`Tree` data structure.","","@module gallery-sm-tree","@submodule gallery-sm-tree-node","**/","","/**","Represents a tree node in a `Tree` data structure.","","@class Tree.Node","@param {Tree} tree `Tree` instance with which this node should be associated.","@param {Object} [config] Configuration hash for this node.","","    @param {Boolean} [config.canHaveChildren=false] Whether or not this node can","        contain child nodes. Will be automatically set to `true` if not","        specified and `config.children` contains one or more children.","","    @param {Tree.Node[]} [config.children] Array of `Tree.Node` instances","        for child nodes of this node.","","    @param {Object} [config.data] Implementation-specific data related to this","        node. You may add arbitrary properties to this hash for your own use.","","    @param {String} [config.id] Unique id for this node. This id must be unique","        among all tree nodes on the entire page, and will also be used as this","        node's DOM id when it's rendered by a TreeView. A unique id will be","        automatically generated unless you specify a custom value.","","    @param {HTML} [config.label=''] User-visible HTML label for this node.","","    @param {Object} [config.state] State hash for this node. You may add","        arbitrary state properties to this hash for your own use. See the","        docs for `Tree.Node`'s `state` property for details on state values used","        internally by `Tree.Node`.","","@constructor","**/","","function TreeNode(tree, config) {","    config || (config = {});","","    this.id   = this._yuid = config.id || this.id || Y.guid('treeNode-');","    this.tree = tree;","","    if ('label' in config) {","        this.label = config.label;","    }","","    this.children = config.children || [];","    this.data     = config.data || {};","    this.state    = config.state || {};","","    if (config.canHaveChildren) {","        this.canHaveChildren = config.canHaveChildren;","    } else if (this.children.length) {","        this.canHaveChildren = true;","    }","","    // Mix in arbitrary properties on the config object, but don't overwrite any","    // existing properties of this node.","    Y.mix(this, config);","","    // If this node has children, loop through them and ensure their parent","    // references are all set to this node.","    for (var i = 0, len = this.children.length; i < len; i++) {","        this.children[i].parent = this;","    }","}","","TreeNode.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Whether or not this node can contain child nodes.","","    This value is falsy by default unless child nodes are added at instantiation","    time, in which case it will be automatically set to `true`. You can also","    manually set it to `true` to indicate that a node can have children even if","    it doesn't currently have any children.","","    Note that regardless of the value of this property, appending, prepending,","    or inserting a node into this node will cause `canHaveChildren` to be set to","    true automatically.","","    @property {Boolean} canHaveChildren","    **/","","    /**","    Child nodes contained within this node.","","    @property {Tree.Node[]} children","    @default []","    @readOnly","    **/","","    /**","    Arbitrary implementation-specific data related to this node.","","    This property is created by setting a `data` property in the config object","    passed to Tree.Node's constructor. It may contain any serializable data","    you want to store on this node instance.","","    @property {Object} data","    @default {}","    **/","","    /**","    Unique id for this node.","","    @property {String} id","    @readOnly","    **/","","    /**","    User-visible HTML label for this node.","","    This value may be rendered as HTML without sanitization, so **do not** put","    untrusted user input here without escaping it first using `Y.Escape.html()`.","","    @property {HTML} label","    @default ''","    **/","    label: '',","","    /**","    Parent node of this node, or `undefined` if this is an unattached node or","    the root node.","","    @property {Tree.Node} parent","    @readOnly","    **/","","    /**","    Current state of this node.","","    @property {Object} state","    **/","","    /**","    The Tree instance with which this node is associated.","","    @property {Tree} tree","    @readOnly","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Mapping of child node ids to indices.","","    @property {Object} _indexMap","    @protected","    **/","","    /**","    Flag indicating whether the `_indexMap` is stale and needs to be rebuilt.","","    @property {Boolean} _isIndexStale","    @default true","    @protected","    **/","    _isIndexStale: true,","","    /**","    Simple way to type-check that this is an instance of Tree.Node.","","    @property {Boolean} _isYUITreeNode","    @default true","    @protected","    **/","    _isYUITreeNode: true,","","    /**","    Array of property names on this node that should be serialized to JSON when","    `toJSON()` is called.","","    Note that the `children` property is a special case that is managed","    separately.","","    @property {String[]} _serializable","    @protected","    **/","    _serializable: ['canHaveChildren', 'data', 'id', 'label', 'state'],","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends the given tree node or array of nodes to the end of this node's","    children.","","    @method append","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were appended.","    **/","    append: function (node, options) {","        return this.tree.appendNode(this, node, options);","    },","","    // TODO: clone()?","","    /**","    Removes all children from this node. The removed children will still be","    reusable unless the `destroy` option is truthy.","","    @method empty","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    empty: function (options) {","        return this.tree.emptyNode(this, options);","    },","","    /**","    Returns `true` if this node has one or more child nodes.","","    @method hasChildren","    @return {Boolean} `true` if this node has one or more child nodes, `false`","        otherwise.","    **/","    hasChildren: function () {","        return !!this.children.length;","    },","","    /**","    Returns the numerical index of this node within its parent node, or `-1` if","    this node doesn't have a parent node.","","    @method index","    @return {Number} Index of this node within its parent node, or `-1` if this","        node doesn't have a parent node.","    **/","    index: function () {","        return this.parent ? this.parent.indexOf(this) : -1;","    },","","    /**","    Returns the numerical index of the given child node, or `-1` if the node is","    not a child of this node.","","    @method indexOf","    @param {Tree.Node} node Child node.","    @return {Number} Index of the child, or `-1` if the node is not a child of","        this node.","    **/","    indexOf: function (node) {","        var index;","","        if (this._isIndexStale) {","            this._reindex();","        }","","        index = this._indexMap[node.id];","","        return typeof index === 'undefined' ? -1 : index;","    },","","    /**","    Inserts a node or array of nodes at the specified index under this node, or","    appends them to this node if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insert","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insert: function (node, options) {","        return this.tree.insertNode(this, node, options);","    },","","    /**","    Returns `true` if this node has been inserted into a tree, `false` if it is","    merely associated with a tree and has not yet been inserted.","","    @method isInTree","    @return {Boolean} `true` if this node has been inserted into a tree, `false`","        otherwise.","    **/","    isInTree: function () {","        if (this.tree.rootNode === this) {","            return true;","        }","","        return !!(this.parent && this.parent.isInTree());","    },","","    /**","    Returns `true` if this node is the root of the tree.","","    @method isRoot","    @return {Boolean} `true` if this node is the root of the tree, `false`","        otherwise.","    **/","    isRoot: function () {","        return this.tree.rootNode === this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of this node's children.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prepend","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to prepend","        to this node. Node config objects will automatically be converted into","        node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were prepended.","    **/","    prepend: function (node, options) {","        return this.tree.prependNode(this, node, options);","    },","","    /**","    Removes this node from its parent node.","","    @method remove","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, this node and all","            its children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @chainable","    **/","    remove: function (options) {","        return this.tree.removeNode(this, options);","    },","","    /**","    Returns the total number of nodes contained within this node, including all","    descendants of this node's children.","","    @method size","    @return {Number} Total number of nodes contained within this node, including","        all descendants.","    **/","    size: function () {","        var children = this.children,","            len      = children.length,","            total    = len;","","        for (var i = 0; i < len; i++) {","            total += children[i].size();","        }","","        return total;","    },","","    /**","    Serializes this node to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized node object.","    **/","    toJSON: function () {","        var obj   = {},","            state = this.state,","            i, key, len;","","        // Do nothing if this node is marked as destroyed.","        if (state.destroyed) {","            return null;","        }","","        // Serialize properties explicitly marked as serializable.","        for (i = 0, len = this._serializable.length; i < len; i++) {","            key = this._serializable[i];","","            if (key in this) {","                obj[key] = this[key];","            }","        }","","        // Serialize child nodes.","        if (this.canHaveChildren) {","            obj.children = [];","","            for (i = 0, len = this.children.length; i < len; i++) {","                obj.children.push(this.children[i].toJSON());","            }","        }","","        return obj;","    },","","    // -- Protected Methods ----------------------------------------------------","    _reindex: function () {","        var children = this.children,","            indexMap = {},","            i, len;","","        for (i = 0, len = children.length; i < len; i++) {","            indexMap[children[i].id] = i;","        }","","        this._indexMap     = indexMap;","        this._isIndexStale = false;","    }","};","","Y.namespace('Tree').Node = TreeNode;","","","}, '@VERSION@');"];
_yuitest_coverage["build/gallery-sm-tree-node/gallery-sm-tree-node.js"].lines = {"1":0,"45":0,"46":0,"48":0,"49":0,"51":0,"52":0,"55":0,"56":0,"57":0,"59":0,"60":0,"61":0,"62":0,"67":0,"71":0,"72":0,"76":0,"208":0,"227":0,"238":0,"250":0,"263":0,"265":0,"266":0,"269":0,"271":0,"297":0,"309":0,"310":0,"313":0,"324":0,"344":0,"360":0,"372":0,"376":0,"377":0,"380":0,"390":0,"395":0,"396":0,"400":0,"401":0,"403":0,"404":0,"409":0,"410":0,"412":0,"413":0,"417":0,"422":0,"426":0,"427":0,"430":0,"431":0,"435":0};
_yuitest_coverage["build/gallery-sm-tree-node/gallery-sm-tree-node.js"].functions = {"TreeNode:45":0,"append:207":0,"empty:226":0,"hasChildren:237":0,"index:249":0,"indexOf:262":0,"insert:296":0,"isInTree:308":0,"isRoot:323":0,"prepend:343":0,"remove:359":0,"size:371":0,"toJSON:389":0,"_reindex:421":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree-node/gallery-sm-tree-node.js"].coveredLines = 56;
_yuitest_coverage["build/gallery-sm-tree-node/gallery-sm-tree-node.js"].coveredFunctions = 15;
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 1);
YUI.add('gallery-sm-tree-node', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Tree.Node` class, which represents a tree node contained in a
`Tree` data structure.

@module gallery-sm-tree
@submodule gallery-sm-tree-node
**/

/**
Represents a tree node in a `Tree` data structure.

@class Tree.Node
@param {Tree} tree `Tree` instance with which this node should be associated.
@param {Object} [config] Configuration hash for this node.

    @param {Boolean} [config.canHaveChildren=false] Whether or not this node can
        contain child nodes. Will be automatically set to `true` if not
        specified and `config.children` contains one or more children.

    @param {Tree.Node[]} [config.children] Array of `Tree.Node` instances
        for child nodes of this node.

    @param {Object} [config.data] Implementation-specific data related to this
        node. You may add arbitrary properties to this hash for your own use.

    @param {String} [config.id] Unique id for this node. This id must be unique
        among all tree nodes on the entire page, and will also be used as this
        node's DOM id when it's rendered by a TreeView. A unique id will be
        automatically generated unless you specify a custom value.

    @param {HTML} [config.label=''] User-visible HTML label for this node.

    @param {Object} [config.state] State hash for this node. You may add
        arbitrary state properties to this hash for your own use. See the
        docs for `Tree.Node`'s `state` property for details on state values used
        internally by `Tree.Node`.

@constructor
**/

_yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 45);
function TreeNode(tree, config) {
    _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "TreeNode", 45);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 46);
config || (config = {});

    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 48);
this.id   = this._yuid = config.id || this.id || Y.guid('treeNode-');
    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 49);
this.tree = tree;

    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 51);
if ('label' in config) {
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 52);
this.label = config.label;
    }

    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 55);
this.children = config.children || [];
    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 56);
this.data     = config.data || {};
    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 57);
this.state    = config.state || {};

    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 59);
if (config.canHaveChildren) {
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 60);
this.canHaveChildren = config.canHaveChildren;
    } else {_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 61);
if (this.children.length) {
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 62);
this.canHaveChildren = true;
    }}

    // Mix in arbitrary properties on the config object, but don't overwrite any
    // existing properties of this node.
    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 67);
Y.mix(this, config);

    // If this node has children, loop through them and ensure their parent
    // references are all set to this node.
    _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 71);
for (var i = 0, len = this.children.length; i < len; i++) {
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 72);
this.children[i].parent = this;
    }
}

_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 76);
TreeNode.prototype = {
    // -- Public Properties ----------------------------------------------------

    /**
    Whether or not this node can contain child nodes.

    This value is falsy by default unless child nodes are added at instantiation
    time, in which case it will be automatically set to `true`. You can also
    manually set it to `true` to indicate that a node can have children even if
    it doesn't currently have any children.

    Note that regardless of the value of this property, appending, prepending,
    or inserting a node into this node will cause `canHaveChildren` to be set to
    true automatically.

    @property {Boolean} canHaveChildren
    **/

    /**
    Child nodes contained within this node.

    @property {Tree.Node[]} children
    @default []
    @readOnly
    **/

    /**
    Arbitrary implementation-specific data related to this node.

    This property is created by setting a `data` property in the config object
    passed to Tree.Node's constructor. It may contain any serializable data
    you want to store on this node instance.

    @property {Object} data
    @default {}
    **/

    /**
    Unique id for this node.

    @property {String} id
    @readOnly
    **/

    /**
    User-visible HTML label for this node.

    This value may be rendered as HTML without sanitization, so **do not** put
    untrusted user input here without escaping it first using `Y.Escape.html()`.

    @property {HTML} label
    @default ''
    **/
    label: '',

    /**
    Parent node of this node, or `undefined` if this is an unattached node or
    the root node.

    @property {Tree.Node} parent
    @readOnly
    **/

    /**
    Current state of this node.

    @property {Object} state
    **/

    /**
    The Tree instance with which this node is associated.

    @property {Tree} tree
    @readOnly
    **/

    // -- Protected Properties -------------------------------------------------

    /**
    Mapping of child node ids to indices.

    @property {Object} _indexMap
    @protected
    **/

    /**
    Flag indicating whether the `_indexMap` is stale and needs to be rebuilt.

    @property {Boolean} _isIndexStale
    @default true
    @protected
    **/
    _isIndexStale: true,

    /**
    Simple way to type-check that this is an instance of Tree.Node.

    @property {Boolean} _isYUITreeNode
    @default true
    @protected
    **/
    _isYUITreeNode: true,

    /**
    Array of property names on this node that should be serialized to JSON when
    `toJSON()` is called.

    Note that the `children` property is a special case that is managed
    separately.

    @property {String[]} _serializable
    @protected
    **/
    _serializable: ['canHaveChildren', 'data', 'id', 'label', 'state'],

    // -- Public Methods -------------------------------------------------------

    /**
    Appends the given tree node or array of nodes to the end of this node's
    children.

    @method append
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to append
        to the given parent. Node config objects will automatically be converted
        into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were appended.
    **/
    append: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "append", 207);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 208);
return this.tree.appendNode(this, node, options);
    },

    // TODO: clone()?

    /**
    Removes all children from this node. The removed children will still be
    reusable unless the `destroy` option is truthy.

    @method empty
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the children will
            also be destroyed, which makes them available for garbage collection
            and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @return {Tree.Node[]} Array of removed child nodes.
    **/
    empty: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "empty", 226);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 227);
return this.tree.emptyNode(this, options);
    },

    /**
    Returns `true` if this node has one or more child nodes.

    @method hasChildren
    @return {Boolean} `true` if this node has one or more child nodes, `false`
        otherwise.
    **/
    hasChildren: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "hasChildren", 237);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 238);
return !!this.children.length;
    },

    /**
    Returns the numerical index of this node within its parent node, or `-1` if
    this node doesn't have a parent node.

    @method index
    @return {Number} Index of this node within its parent node, or `-1` if this
        node doesn't have a parent node.
    **/
    index: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "index", 249);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 250);
return this.parent ? this.parent.indexOf(this) : -1;
    },

    /**
    Returns the numerical index of the given child node, or `-1` if the node is
    not a child of this node.

    @method indexOf
    @param {Tree.Node} node Child node.
    @return {Number} Index of the child, or `-1` if the node is not a child of
        this node.
    **/
    indexOf: function (node) {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "indexOf", 262);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 263);
var index;

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 265);
if (this._isIndexStale) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 266);
this._reindex();
        }

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 269);
index = this._indexMap[node.id];

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 271);
return typeof index === 'undefined' ? -1 : index;
    },

    /**
    Inserts a node or array of nodes at the specified index under this node, or
    appends them to this node if no index is specified.

    If a node being inserted is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method insert
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to insert
        under the given parent. Node config objects will automatically be
        converted into node instances.

    @param {Object} [options] Options.
        @param {Number} [options.index] Index at which to insert the child node.
            If not specified, the node will be appended as the last child of the
            parent.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.

    @return {Tree.Node[]} Node or array of nodes that were inserted.
    **/
    insert: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "insert", 296);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 297);
return this.tree.insertNode(this, node, options);
    },

    /**
    Returns `true` if this node has been inserted into a tree, `false` if it is
    merely associated with a tree and has not yet been inserted.

    @method isInTree
    @return {Boolean} `true` if this node has been inserted into a tree, `false`
        otherwise.
    **/
    isInTree: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "isInTree", 308);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 309);
if (this.tree.rootNode === this) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 310);
return true;
        }

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 313);
return !!(this.parent && this.parent.isInTree());
    },

    /**
    Returns `true` if this node is the root of the tree.

    @method isRoot
    @return {Boolean} `true` if this node is the root of the tree, `false`
        otherwise.
    **/
    isRoot: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "isRoot", 323);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 324);
return this.tree.rootNode === this;
    },

    /**
    Prepends a node or array of nodes at the beginning of this node's children.

    If a node being prepended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method prepend
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to prepend
        to this node. Node config objects will automatically be converted into
        node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were prepended.
    **/
    prepend: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "prepend", 343);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 344);
return this.tree.prependNode(this, node, options);
    },

    /**
    Removes this node from its parent node.

    @method remove
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, this node and all
            its children will also be destroyed, which makes them available for
            garbage collection and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, the `remove` event
            will be suppressed.
    @chainable
    **/
    remove: function (options) {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "remove", 359);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 360);
return this.tree.removeNode(this, options);
    },

    /**
    Returns the total number of nodes contained within this node, including all
    descendants of this node's children.

    @method size
    @return {Number} Total number of nodes contained within this node, including
        all descendants.
    **/
    size: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "size", 371);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 372);
var children = this.children,
            len      = children.length,
            total    = len;

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 376);
for (var i = 0; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 377);
total += children[i].size();
        }

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 380);
return total;
    },

    /**
    Serializes this node to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized node object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "toJSON", 389);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 390);
var obj   = {},
            state = this.state,
            i, key, len;

        // Do nothing if this node is marked as destroyed.
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 395);
if (state.destroyed) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 396);
return null;
        }

        // Serialize properties explicitly marked as serializable.
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 400);
for (i = 0, len = this._serializable.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 401);
key = this._serializable[i];

            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 403);
if (key in this) {
                _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 404);
obj[key] = this[key];
            }
        }

        // Serialize child nodes.
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 409);
if (this.canHaveChildren) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 410);
obj.children = [];

            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 412);
for (i = 0, len = this.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 413);
obj.children.push(this.children[i].toJSON());
            }
        }

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 417);
return obj;
    },

    // -- Protected Methods ----------------------------------------------------
    _reindex: function () {
        _yuitest_coverfunc("build/gallery-sm-tree-node/gallery-sm-tree-node.js", "_reindex", 421);
_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 422);
var children = this.children,
            indexMap = {},
            i, len;

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 426);
for (i = 0, len = children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 427);
indexMap[children[i].id] = i;
        }

        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 430);
this._indexMap     = indexMap;
        _yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 431);
this._isIndexStale = false;
    }
};

_yuitest_coverline("build/gallery-sm-tree-node/gallery-sm-tree-node.js", 435);
Y.namespace('Tree').Node = TreeNode;


}, '@VERSION@');
