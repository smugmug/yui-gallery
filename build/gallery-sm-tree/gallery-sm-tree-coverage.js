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
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-tree/gallery-sm-tree.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].code=["YUI.add('gallery-sm-tree', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Tree` class.","","@module gallery-sm-tree","**/","","/**","The `Tree` class represents a generic tree data structure. A tree has a root","node, which may contain any number of child nodes, which may themselves contain","child nodes, ad infinitum.","","This class doesn't expose any UI, but is extended by the `TreeView` class, which","does.","","@class Tree","@param {Object} [config] Config options.","    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config","        objects or `Tree.Node` instances to add to this tree at initialization","        time.","    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of","        this tree.","@constructor","@extends Base","**/","","var Lang = Y.Lang,","","    /**","    Fired when a node is added to this Tree. The `src` property will indicate","    how the node was added (\"append\", \"insert\", \"prepend\", etc.).","","    @event add","    @param {Number} index Index at which the node will be added.","    @param {Tree.Node} node Node being added.","    @param {Tree.Node} parent Parent node to which the node will be added.","    @param {String} src Source of the event (\"append\", \"insert\", \"prepend\",","        etc.).","    @preventable _defAddFn","    **/","    EVT_ADD = 'add',","","    /**","    Fired when this Tree is cleared.","","    @event clear","    @param {Tree.Node} rootNode New root node of this tree (the old root node is","        always destroyed when a tree is cleared).","    @preventable _defClearFn","    **/","    EVT_CLEAR = 'clear',","","    /**","    Fired when a node is removed from this Tree.","","    @event remove","    @param {Boolean} destroy Whether or not the node will be destroyed after","        being removed from this tree.","    @param {Tree.Node} node Node being removed.","    @param {Tree.Node} parent Parent node from which the node will be removed.","    @preventable _defRemoveFn","    **/","    EVT_REMOVE = 'remove';","","var Tree = Y.Base.create('tree', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Reference to the `children` array of this Tree's `rootNode`.","","    This is a convenience property to allow you to type `tree.children` instead","    of `tree.rootNode.children`.","","    @property {Tree.Node[]} children","    @readOnly","    **/","","    /**","    The `Tree.Node` class or subclass that should be used for nodes created by","    this tree.","","    You may specific an actual class reference or a string that resolves to a","    class reference at runtime.","","    @property {String|Tree.Node} nodeClass","    @default Y.Tree.Node","    **/","    nodeClass: Y.Tree.Node,","","    /**","    Optional array containing one or more extension classes that should be mixed","    into the `nodeClass` when this Tree is instantiated. The resulting composed","    node class will be unique to this Tree instance and will not affect any","    other instances, nor will it modify the defined `nodeClass` itself.","","    This provides a late-binding extension mechanism for nodes that doesn't","    require them to extend `Y.Base`, which would incur a significant performance","    hit.","","    @property {Array} nodeExtensions","    @default []","    **/","    nodeExtensions: [],","","    /**","    Root node of this Tree.","","    @property {Tree.Node} rootNode","    @readOnly","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a Tree instance.","","    @property {Boolean} _isYUITree","    @default true","    @protected","    **/","    _isYUITree: true,","","    /**","    Composed node class based on `nodeClass` that mixes in any extensions","    specified in `nodeExtensions`. If there are no extensions, this will just be","    a reference to `nodeClass`.","","    @property {Tree.Node} _nodeClass","    @protected","    **/","","    /**","    Mapping of node ids to node instances for nodes in this tree.","","    @property {Object} _nodeMap","    @protected","    **/","","    /**","    Default config object for the root node.","","    @property {Object} _rootNodeConfig","    @protected","    **/","    _rootNodeConfig: {canHaveChildren: true},","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        if (config.nodeClass) {","            this.nodeClass = config.nodeClass;","        }","","        if (config.nodeExtensions) {","            this.nodeExtensions = this.nodeExtensions.concat(config.nodeExtensions);","        }","","        /**","        Hash of published custom events.","","        @property {Object} _published","        @default {}","        @protected","        **/","        this._published || (this._published = {});","        this._nodeMap = {};","","        // Allow all extensions to initialize, then finish up.","        this.onceAfter('initializedChange', function () {","            this._composeNodeClass();","","            this.clear(config.rootNode, {silent: true});","","            if (config.nodes) {","                this.insertNode(this.rootNode, config.nodes, {silent: true});","            }","        });","    },","","    destructor: function () {","        this.destroyNode(this.rootNode, {silent: true});","","        this.children   = null;","        this.rootNode   = null;","        this._nodeClass = null;","        this._nodeMap   = null;","        this._published = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends a node or array of nodes as the last child of the specified parent","    node.","","    If a node being appended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method appendNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        appended.","    **/","    appendNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: parent.children.length,","            src  : 'append'","        }));","    },","","    /**","    Clears this tree by destroying the root node and all its children. If a","    `rootNode` argument is provided, that node will become the root node of this","    tree; otherwise, a new root node will be created.","","    @method clear","    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as","        the new root node.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `clear` event","            will be suppressed.","    @chainable","    **/","    clear: function (rootNode, options) {","        return this._fire(EVT_CLEAR, {","            rootNode: this.createNode(rootNode || this._rootNodeConfig)","        }, {","            defaultFn: this._defClearFn,","            silent   : options && options.silent","        });","    },","","    /**","    Creates and returns a new `Tree.Node` instance associated with (but not","    yet appended to) this tree.","","    @method createNode","    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`","        instance is specified instead of a config object, that node will be","        adopted into this tree (if it doesn't already belong to this tree) and","        removed from any other tree to which it belongs.","    @return {Tree.Node} New node.","    **/","    createNode: function (config) {","        config || (config = {});","","        // If `config` is already a node, just ensure it's in the node map and","        // return it.","        if (config._isYUITreeNode) {","            this._adoptNode(config);","            return config;","        }","","        // First, create nodes for any children of this node.","        if (config.children) {","            var children = [];","","            for (var i = 0, len = config.children.length; i < len; i++) {","                children.push(this.createNode(config.children[i]));","            }","","            config = Y.merge(config, {children: children});","        }","","        var node = new this._nodeClass(this, config);","","        return this._nodeMap[node.id] = node;","    },","","    /**","    Removes and destroys a node and all its child nodes. Once destroyed, a node","    is eligible for garbage collection and cannot be reused or re-added to the","    tree.","","    @method destroyNode","    @param {Tree.Node} node Node to destroy.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @chainable","    **/","    destroyNode: function (node, options) {","        var child, i, len;","","        options || (options = {});","","        for (i = 0, len = node.children.length; i < len; i++) {","            child = node.children[i];","","            // Manually remove the child from its parent; this makes destroying","            // all children of the parent much faster since there's no splicing","            // involved.","            child.parent = null;","","            // Destroy the child.","            this.destroyNode(child, options);","        }","","        if (node.parent) {","            this.removeNode(node, options);","        }","","        node.children  = null;","        node.data      = null;","        node.state     = {destroyed: true};","        node.tree      = null;","        node._htmlNode = null;","        node._indexMap = null;","","        delete this._nodeMap[node.id];","","        return this;","    },","","    /**","    Removes all children from the specified node. The removed children will","    still be reusable unless the `destroy` option is truthy.","","    @method emptyNode","    @param {Tree.Node} node Node to empty.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    emptyNode: function (node, options) {","        var removed = [];","","        while (node.children.length) {","            removed.push(this.removeNode(node.children[0], options));","        }","","        return removed;","    },","","    /**","    Returns the tree node with the specified id, or `undefined` if the node","    doesn't exist in this tree.","","    @method getNodeById","    @param {String} id Node id.","    @return {Tree.Node} Node, or `undefined` if not found.","    **/","    getNodeById: function (id) {","        return this._nodeMap[id];","    },","","    /**","    Inserts a node or array of nodes at the specified index under the given","    parent node, or appends them to the parent if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insertNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insertNode: function (parent, node, options) {","        options || (options = {});","        parent  || (parent = this.rootNode);","","        var index = options.index;","","        if (typeof index === 'undefined') {","            index = parent.children.length;","        }","","        // If `node` is an array, recurse to insert each node it contains.","        //","        // Note: If you're getting an exception here because `node` is null when","        // you've passed in a reference to some other node's `children` array,","        // that's happening because nodes must be removed from their current","        // parent before being added to the new one, and the `children` array is","        // being modified while the nodes are inserted.","        //","        // Solution: pass a copy of the other node's `children` array instead of","        // the original. Doing the copy operation here would have a negative","        // impact on performance, so you're on your own since this is such a","        // rare edge case.","        if ('length' in node && Lang.isArray(node)) {","            var inserted = [];","","            for (var i = 0, len = node.length; i < len; i++) {","                inserted.push(this.insertNode(parent, node[i], options));","","                if ('index' in options) {","                    options.index += 1;","                }","            }","","            return inserted;","        }","","        node = this.createNode(node);","","        this._fire(EVT_ADD, {","            index : index,","            node  : node,","            parent: parent,","            src   : options.src || 'insert'","        }, {","            defaultFn: this._defAddFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Prepends a node or array of nodes at the beginning of the specified parent","    node.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prependNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        prepended.","    **/","    prependNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: 0,","            src  : 'prepend'","        }));","    },","","    /**","    Removes the specified node from its parent node. The removed node will still","    be reusable unless the `destroy` option is truthy.","","    @method removeNode","    @param {Tree.Node} node Node to remove.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the node and all its","            children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @return {Tree.Node} Node that was removed.","    **/","    removeNode: function (node, options) {","        options || (options = {});","","        this._fire(EVT_REMOVE, {","            destroy: !!options.destroy,","            node   : node,","            parent : node.parent,","            src    : options.src || 'remove'","        }, {","            defaultFn: this._defRemoveFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Returns the total number of nodes in this tree, at all levels.","","    Use `rootNode.children.length` to get only the number of top-level nodes.","","    @method size","    @return {Number} Total number of nodes in this tree.","    **/","    size: function () {","        return this.rootNode.size();","    },","","    /**","    Serializes this tree to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized tree object.","    **/","    toJSON: function () {","        return this.rootNode.toJSON();","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Moves the specified node and all its children from another tree to this","    tree.","","    @method _adoptNode","    @param {Tree.Node} node Node to adopt.","    @param {Object} [options] Options to pass along to `removeNode()`.","    @protected","    **/","    _adoptNode: function (node, options) {","        var oldTree = node.tree;","","        if (oldTree === this) {","            return;","        }","","        for (var i = 0, len = node.children.length; i < len; i++) {","            this._adoptNode(node.children[i], {silent: true});","        }","","        oldTree.removeNode(node, options);","        delete oldTree._nodeMap[node.id];","","        // If this node isn't an instance of this tree's composed _nodeClass,","        // then we need to recreate it to avoid potentially breaking things in","        // really weird ways.","        if (!(node instanceof this._nodeClass)","                || oldTree._nodeClass !== this._nodeClass) {","","            node = this.createNode(node.toJSON());","        }","","        node.tree = this;","        this._nodeMap[node.id] = node;","    },","","    /**","    Composes a custom late-bound tree node class (if necessary) based on the","    classes specified in this Tree's `nodeClass` and `nodeExtensions`","    properties.","","    The composed class is stored in this Tree's `_nodeClass` property. If","    composition wasn't necessary, then `_nodeClass` will just be a reference to","    `nodeClass`.","","    @method _composeNodeClass","    @protected","    **/","    _composeNodeClass: function () {","        var nodeClass      = this.nodeClass,","            nodeExtensions = this.nodeExtensions,","            composedClass;","","        if (typeof nodeClass === 'string') {","            // Look for a namespaced node class on `Y`.","            nodeClass = Y.Object.getValue(Y, nodeClass.split('.'));","","            if (nodeClass) {","                this.nodeClass = nodeClass;","            } else {","                Y.error('Tree: Node class not found: ' + nodeClass);","                return;","            }","        }","","        if (!nodeExtensions.length) {","            this._nodeClass = nodeClass;","            return;","        }","","        // Compose a new class by mixing extensions into nodeClass.","        composedClass = function () {","            var extensions = composedClass._nodeExtensions;","","            nodeClass.apply(this, arguments);","","            for (var i = 0, len = extensions.length; i < len; i++) {","                extensions[i].apply(this, arguments);","            }","        };","","        Y.extend(composedClass, nodeClass);","","        for (var i = 0, len = nodeExtensions.length; i < len; i++) {","            Y.mix(composedClass.prototype, nodeExtensions[i].prototype, true);","        }","","        composedClass._nodeExtensions = nodeExtensions;","        this._nodeClass = composedClass;","    },","","    /**","    Utility method for lazily publishing and firing events.","","    @method _fire","    @param {String} name Event name to fire.","    @param {Object} facade Event facade.","    @param {Object} [options] Options.","        @param {Function} [options.defaultFn] Default handler for this event.","        @param {Boolean} [options.silent=false] Whether the default handler","            should be executed directly without actually firing the event.","    @chainable","    @protected","    **/","    _fire: function (name, facade, options) {","        if (options && options.silent) {","            if (options.defaultFn) {","                options.defaultFn.call(this, facade);","            }","        } else {","            if (options && options.defaultFn && !this._published[name]) {","                this._published[name] = this.publish(name, {","                    defaultFn: options.defaultFn","                });","            }","","            this.fire(name, facade);","        }","","        return this;","    },","","    /**","    Removes the specified node from its parent node if it has one.","","    @method _removeNodeFromParent","    @param {Tree.Node} node Node to remove.","    @protected","    **/","    _removeNodeFromParent: function (node) {","        var parent = node.parent,","            index;","","        if (parent) {","            index = parent.indexOf(node);","","            if (index > -1) {","                parent.children.splice(index, 1);","                parent._isIndexStale = true;","                node.parent = null;","            }","        }","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defAddFn: function (e) {","        var node   = e.node,","            parent = e.parent;","","        // Remove the node from its existing parent if it has one.","        if (node.parent) {","            this._removeNodeFromParent(node);","        }","","        // Add the node to its new parent at the desired index.","        node.parent = parent;","        parent.children.splice(e.index, 0, node);","","        parent.canHaveChildren = true;","        parent._isIndexStale   = true;","    },","","    _defClearFn: function (e) {","        var newRootNode = e.rootNode;","","        if (this.rootNode) {","            this.destroyNode(this.rootNode, {silent: true});","        }","","        this._nodeMap = {};","        this._nodeMap[newRootNode.id] = newRootNode;","","        this.rootNode = newRootNode;","        this.children = newRootNode.children;","    },","","    _defRemoveFn: function (e) {","        var node = e.node;","","        if (e.destroy) {","            this.destroyNode(node, {silent: true});","        } else if (e.parent) {","            this._removeNodeFromParent(node);","        } else if (this.rootNode === node) {","            // Guess we'll need a new root node!","            this.rootNode = this.createNode(this._rootNodeConfig);","            this.children = this.rootNode.children;","        }","    }","});","","Y.Tree = Y.mix(Tree, Y.Tree);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"gallery-sm-tree-node\"]});"];
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].lines = {"1":0,"30":0,"68":0,"152":0,"154":0,"155":0,"158":0,"159":0,"169":0,"170":0,"173":0,"174":0,"176":0,"178":0,"179":0,"185":0,"187":0,"188":0,"189":0,"190":0,"191":0,"216":0,"236":0,"256":0,"260":0,"261":0,"262":0,"266":0,"267":0,"269":0,"270":0,"273":0,"276":0,"278":0,"294":0,"296":0,"298":0,"299":0,"304":0,"307":0,"310":0,"311":0,"314":0,"315":0,"316":0,"317":0,"318":0,"319":0,"321":0,"323":0,"341":0,"343":0,"344":0,"347":0,"359":0,"386":0,"387":0,"389":0,"391":0,"392":0,"407":0,"408":0,"410":0,"411":0,"413":0,"414":0,"418":0,"421":0,"423":0,"433":0,"456":0,"477":0,"479":0,"489":0,"501":0,"511":0,"526":0,"528":0,"529":0,"532":0,"533":0,"536":0,"537":0,"542":0,"545":0,"548":0,"549":0,"565":0,"569":0,"571":0,"573":0,"574":0,"576":0,"577":0,"581":0,"582":0,"583":0,"587":0,"588":0,"590":0,"592":0,"593":0,"597":0,"599":0,"600":0,"603":0,"604":0,"621":0,"622":0,"623":0,"626":0,"627":0,"632":0,"635":0,"646":0,"649":0,"650":0,"652":0,"653":0,"654":0,"655":0,"662":0,"666":0,"667":0,"671":0,"672":0,"674":0,"675":0,"679":0,"681":0,"682":0,"685":0,"686":0,"688":0,"689":0,"693":0,"695":0,"696":0,"697":0,"698":0,"699":0,"701":0,"702":0,"707":0};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].functions = {"(anonymous 2):173":0,"initializer:151":0,"destructor:184":0,"appendNode:215":0,"clear:235":0,"createNode:255":0,"destroyNode:293":0,"emptyNode:340":0,"getNodeById:358":0,"insertNode:385":0,"prependNode:455":0,"removeNode:476":0,"size:500":0,"toJSON:510":0,"_adoptNode:525":0,"composedClass:587":0,"_composeNodeClass:564":0,"_fire:620":0,"_removeNodeFromParent:645":0,"_defAddFn:661":0,"_defClearFn:678":0,"_defRemoveFn:692":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].coveredLines = 144;
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].coveredFunctions = 23;
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 1);
YUI.add('gallery-sm-tree', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Tree` class.

@module gallery-sm-tree
**/

/**
The `Tree` class represents a generic tree data structure. A tree has a root
node, which may contain any number of child nodes, which may themselves contain
child nodes, ad infinitum.

This class doesn't expose any UI, but is extended by the `TreeView` class, which
does.

@class Tree
@param {Object} [config] Config options.
    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config
        objects or `Tree.Node` instances to add to this tree at initialization
        time.
    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of
        this tree.
@constructor
@extends Base
**/

_yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 30);
var Lang = Y.Lang,

    /**
    Fired when a node is added to this Tree. The `src` property will indicate
    how the node was added ("append", "insert", "prepend", etc.).

    @event add
    @param {Number} index Index at which the node will be added.
    @param {Tree.Node} node Node being added.
    @param {Tree.Node} parent Parent node to which the node will be added.
    @param {String} src Source of the event ("append", "insert", "prepend",
        etc.).
    @preventable _defAddFn
    **/
    EVT_ADD = 'add',

    /**
    Fired when this Tree is cleared.

    @event clear
    @param {Tree.Node} rootNode New root node of this tree (the old root node is
        always destroyed when a tree is cleared).
    @preventable _defClearFn
    **/
    EVT_CLEAR = 'clear',

    /**
    Fired when a node is removed from this Tree.

    @event remove
    @param {Boolean} destroy Whether or not the node will be destroyed after
        being removed from this tree.
    @param {Tree.Node} node Node being removed.
    @param {Tree.Node} parent Parent node from which the node will be removed.
    @preventable _defRemoveFn
    **/
    EVT_REMOVE = 'remove';

_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 68);
var Tree = Y.Base.create('tree', Y.Base, [], {
    // -- Public Properties ----------------------------------------------------

    /**
    Reference to the `children` array of this Tree's `rootNode`.

    This is a convenience property to allow you to type `tree.children` instead
    of `tree.rootNode.children`.

    @property {Tree.Node[]} children
    @readOnly
    **/

    /**
    The `Tree.Node` class or subclass that should be used for nodes created by
    this tree.

    You may specific an actual class reference or a string that resolves to a
    class reference at runtime.

    @property {String|Tree.Node} nodeClass
    @default Y.Tree.Node
    **/
    nodeClass: Y.Tree.Node,

    /**
    Optional array containing one or more extension classes that should be mixed
    into the `nodeClass` when this Tree is instantiated. The resulting composed
    node class will be unique to this Tree instance and will not affect any
    other instances, nor will it modify the defined `nodeClass` itself.

    This provides a late-binding extension mechanism for nodes that doesn't
    require them to extend `Y.Base`, which would incur a significant performance
    hit.

    @property {Array} nodeExtensions
    @default []
    **/
    nodeExtensions: [],

    /**
    Root node of this Tree.

    @property {Tree.Node} rootNode
    @readOnly
    **/

    // -- Protected Properties -------------------------------------------------

    /**
    Simple way to type-check that this is a Tree instance.

    @property {Boolean} _isYUITree
    @default true
    @protected
    **/
    _isYUITree: true,

    /**
    Composed node class based on `nodeClass` that mixes in any extensions
    specified in `nodeExtensions`. If there are no extensions, this will just be
    a reference to `nodeClass`.

    @property {Tree.Node} _nodeClass
    @protected
    **/

    /**
    Mapping of node ids to node instances for nodes in this tree.

    @property {Object} _nodeMap
    @protected
    **/

    /**
    Default config object for the root node.

    @property {Object} _rootNodeConfig
    @protected
    **/
    _rootNodeConfig: {canHaveChildren: true},

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "initializer", 151);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 152);
config || (config = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 154);
if (config.nodeClass) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 155);
this.nodeClass = config.nodeClass;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 158);
if (config.nodeExtensions) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 159);
this.nodeExtensions = this.nodeExtensions.concat(config.nodeExtensions);
        }

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 169);
this._published || (this._published = {});
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 170);
this._nodeMap = {};

        // Allow all extensions to initialize, then finish up.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 173);
this.onceAfter('initializedChange', function () {
            _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "(anonymous 2)", 173);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 174);
this._composeNodeClass();

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 176);
this.clear(config.rootNode, {silent: true});

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 178);
if (config.nodes) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 179);
this.insertNode(this.rootNode, config.nodes, {silent: true});
            }
        });
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "destructor", 184);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 185);
this.destroyNode(this.rootNode, {silent: true});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 187);
this.children   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 188);
this.rootNode   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 189);
this._nodeClass = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 190);
this._nodeMap   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 191);
this._published = null;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Appends a node or array of nodes as the last child of the specified parent
    node.

    If a node being appended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method appendNode
    @param {Tree.Node} parent Parent node.
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config
        object, array of child nodes, or array of node config objects to append
        to the given parent. Node config objects will automatically be converted
        into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were
        appended.
    **/
    appendNode: function (parent, node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "appendNode", 215);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 216);
return this.insertNode(parent, node, Y.merge(options, {
            index: parent.children.length,
            src  : 'append'
        }));
    },

    /**
    Clears this tree by destroying the root node and all its children. If a
    `rootNode` argument is provided, that node will become the root node of this
    tree; otherwise, a new root node will be created.

    @method clear
    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as
        the new root node.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `clear` event
            will be suppressed.
    @chainable
    **/
    clear: function (rootNode, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "clear", 235);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 236);
return this._fire(EVT_CLEAR, {
            rootNode: this.createNode(rootNode || this._rootNodeConfig)
        }, {
            defaultFn: this._defClearFn,
            silent   : options && options.silent
        });
    },

    /**
    Creates and returns a new `Tree.Node` instance associated with (but not
    yet appended to) this tree.

    @method createNode
    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`
        instance is specified instead of a config object, that node will be
        adopted into this tree (if it doesn't already belong to this tree) and
        removed from any other tree to which it belongs.
    @return {Tree.Node} New node.
    **/
    createNode: function (config) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "createNode", 255);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 256);
config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 260);
if (config._isYUITreeNode) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 261);
this._adoptNode(config);
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 262);
return config;
        }

        // First, create nodes for any children of this node.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 266);
if (config.children) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 267);
var children = [];

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 269);
for (var i = 0, len = config.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 270);
children.push(this.createNode(config.children[i]));
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 273);
config = Y.merge(config, {children: children});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 276);
var node = new this._nodeClass(this, config);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 278);
return this._nodeMap[node.id] = node;
    },

    /**
    Removes and destroys a node and all its child nodes. Once destroyed, a node
    is eligible for garbage collection and cannot be reused or re-added to the
    tree.

    @method destroyNode
    @param {Tree.Node} node Node to destroy.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @chainable
    **/
    destroyNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "destroyNode", 293);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 294);
var child, i, len;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 296);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 298);
for (i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 299);
child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 304);
child.parent = null;

            // Destroy the child.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 307);
this.destroyNode(child, options);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 310);
if (node.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 311);
this.removeNode(node, options);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 314);
node.children  = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 315);
node.data      = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 316);
node.state     = {destroyed: true};
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 317);
node.tree      = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 318);
node._htmlNode = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 319);
node._indexMap = null;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 321);
delete this._nodeMap[node.id];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 323);
return this;
    },

    /**
    Removes all children from the specified node. The removed children will
    still be reusable unless the `destroy` option is truthy.

    @method emptyNode
    @param {Tree.Node} node Node to empty.
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the children will
            also be destroyed, which makes them available for garbage collection
            and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, `remove` events will
            be suppressed.
    @return {Tree.Node[]} Array of removed child nodes.
    **/
    emptyNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "emptyNode", 340);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 341);
var removed = [];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 343);
while (node.children.length) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 344);
removed.push(this.removeNode(node.children[0], options));
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 347);
return removed;
    },

    /**
    Returns the tree node with the specified id, or `undefined` if the node
    doesn't exist in this tree.

    @method getNodeById
    @param {String} id Node id.
    @return {Tree.Node} Node, or `undefined` if not found.
    **/
    getNodeById: function (id) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "getNodeById", 358);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 359);
return this._nodeMap[id];
    },

    /**
    Inserts a node or array of nodes at the specified index under the given
    parent node, or appends them to the parent if no index is specified.

    If a node being inserted is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method insertNode
    @param {Tree.Node} parent Parent node.
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
    insertNode: function (parent, node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "insertNode", 385);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 386);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 387);
parent  || (parent = this.rootNode);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 389);
var index = options.index;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 391);
if (typeof index === 'undefined') {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 392);
index = parent.children.length;
        }

        // If `node` is an array, recurse to insert each node it contains.
        //
        // Note: If you're getting an exception here because `node` is null when
        // you've passed in a reference to some other node's `children` array,
        // that's happening because nodes must be removed from their current
        // parent before being added to the new one, and the `children` array is
        // being modified while the nodes are inserted.
        //
        // Solution: pass a copy of the other node's `children` array instead of
        // the original. Doing the copy operation here would have a negative
        // impact on performance, so you're on your own since this is such a
        // rare edge case.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 407);
if ('length' in node && Lang.isArray(node)) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 408);
var inserted = [];

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 410);
for (var i = 0, len = node.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 411);
inserted.push(this.insertNode(parent, node[i], options));

                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 413);
if ('index' in options) {
                    _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 414);
options.index += 1;
                }
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 418);
return inserted;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 421);
node = this.createNode(node);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 423);
this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 433);
return node;
    },

    /**
    Prepends a node or array of nodes at the beginning of the specified parent
    node.

    If a node being prepended is from another tree, it and all its children will
    be removed from that tree and moved to this one.

    @method prependNode
    @param {Tree.Node} parent Parent node.
    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,
        node config object, array of child nodes, or array of node config
        objects to prepend to the given parent. Node config objects will
        automatically be converted into node instances.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `add` event will
            be suppressed.
    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were
        prepended.
    **/
    prependNode: function (parent, node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "prependNode", 455);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 456);
return this.insertNode(parent, node, Y.merge(options, {
            index: 0,
            src  : 'prepend'
        }));
    },

    /**
    Removes the specified node from its parent node. The removed node will still
    be reusable unless the `destroy` option is truthy.

    @method removeNode
    @param {Tree.Node} node Node to remove.
    @param {Object} [options] Options.
        @param {Boolean} [options.destroy=false] If `true`, the node and all its
            children will also be destroyed, which makes them available for
            garbage collection and means they can't be reused.
        @param {Boolean} [options.silent=false] If `true`, the `remove` event
            will be suppressed.
    @return {Tree.Node} Node that was removed.
    **/
    removeNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "removeNode", 476);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 477);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 479);
this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 489);
return node;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "size", 500);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 501);
return this.rootNode.size();
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "toJSON", 510);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 511);
return this.rootNode.toJSON();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Moves the specified node and all its children from another tree to this
    tree.

    @method _adoptNode
    @param {Tree.Node} node Node to adopt.
    @param {Object} [options] Options to pass along to `removeNode()`.
    @protected
    **/
    _adoptNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_adoptNode", 525);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 526);
var oldTree = node.tree;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 528);
if (oldTree === this) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 529);
return;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 532);
for (var i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 533);
this._adoptNode(node.children[i], {silent: true});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 536);
oldTree.removeNode(node, options);
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 537);
delete oldTree._nodeMap[node.id];

        // If this node isn't an instance of this tree's composed _nodeClass,
        // then we need to recreate it to avoid potentially breaking things in
        // really weird ways.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 542);
if (!(node instanceof this._nodeClass)
                || oldTree._nodeClass !== this._nodeClass) {

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 545);
node = this.createNode(node.toJSON());
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 548);
node.tree = this;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 549);
this._nodeMap[node.id] = node;
    },

    /**
    Composes a custom late-bound tree node class (if necessary) based on the
    classes specified in this Tree's `nodeClass` and `nodeExtensions`
    properties.

    The composed class is stored in this Tree's `_nodeClass` property. If
    composition wasn't necessary, then `_nodeClass` will just be a reference to
    `nodeClass`.

    @method _composeNodeClass
    @protected
    **/
    _composeNodeClass: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_composeNodeClass", 564);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 565);
var nodeClass      = this.nodeClass,
            nodeExtensions = this.nodeExtensions,
            composedClass;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 569);
if (typeof nodeClass === 'string') {
            // Look for a namespaced node class on `Y`.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 571);
nodeClass = Y.Object.getValue(Y, nodeClass.split('.'));

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 573);
if (nodeClass) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 574);
this.nodeClass = nodeClass;
            } else {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 576);
Y.error('Tree: Node class not found: ' + nodeClass);
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 577);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 581);
if (!nodeExtensions.length) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 582);
this._nodeClass = nodeClass;
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 583);
return;
        }

        // Compose a new class by mixing extensions into nodeClass.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 587);
composedClass = function () {
            _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "composedClass", 587);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 588);
var extensions = composedClass._nodeExtensions;

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 590);
nodeClass.apply(this, arguments);

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 592);
for (var i = 0, len = extensions.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 593);
extensions[i].apply(this, arguments);
            }
        };

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 597);
Y.extend(composedClass, nodeClass);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 599);
for (var i = 0, len = nodeExtensions.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 600);
Y.mix(composedClass.prototype, nodeExtensions[i].prototype, true);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 603);
composedClass._nodeExtensions = nodeExtensions;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 604);
this._nodeClass = composedClass;
    },

    /**
    Utility method for lazily publishing and firing events.

    @method _fire
    @param {String} name Event name to fire.
    @param {Object} facade Event facade.
    @param {Object} [options] Options.
        @param {Function} [options.defaultFn] Default handler for this event.
        @param {Boolean} [options.silent=false] Whether the default handler
            should be executed directly without actually firing the event.
    @chainable
    @protected
    **/
    _fire: function (name, facade, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_fire", 620);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 621);
if (options && options.silent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 622);
if (options.defaultFn) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 623);
options.defaultFn.call(this, facade);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 626);
if (options && options.defaultFn && !this._published[name]) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 627);
this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 632);
this.fire(name, facade);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 635);
return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {Tree.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_removeNodeFromParent", 645);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 646);
var parent = node.parent,
            index;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 649);
if (parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 650);
index = parent.indexOf(node);

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 652);
if (index > -1) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 653);
parent.children.splice(index, 1);
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 654);
parent._isIndexStale = true;
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 655);
node.parent = null;
            }
        }
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defAddFn", 661);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 662);
var node   = e.node,
            parent = e.parent;

        // Remove the node from its existing parent if it has one.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 666);
if (node.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 667);
this._removeNodeFromParent(node);
        }

        // Add the node to its new parent at the desired index.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 671);
node.parent = parent;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 672);
parent.children.splice(e.index, 0, node);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 674);
parent.canHaveChildren = true;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 675);
parent._isIndexStale   = true;
    },

    _defClearFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defClearFn", 678);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 679);
var newRootNode = e.rootNode;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 681);
if (this.rootNode) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 682);
this.destroyNode(this.rootNode, {silent: true});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 685);
this._nodeMap = {};
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 686);
this._nodeMap[newRootNode.id] = newRootNode;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 688);
this.rootNode = newRootNode;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 689);
this.children = newRootNode.children;
    },

    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defRemoveFn", 692);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 693);
var node = e.node;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 695);
if (e.destroy) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 696);
this.destroyNode(node, {silent: true});
        } else {_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 697);
if (e.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 698);
this._removeNodeFromParent(node);
        } else {_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 699);
if (this.rootNode === node) {
            // Guess we'll need a new root node!
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 701);
this.rootNode = this.createNode(this._rootNodeConfig);
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 702);
this.children = this.rootNode.children;
        }}}
    }
});

_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 707);
Y.Tree = Y.mix(Tree, Y.Tree);


}, '@VERSION@', {"requires": ["base-build", "gallery-sm-tree-node"]});
