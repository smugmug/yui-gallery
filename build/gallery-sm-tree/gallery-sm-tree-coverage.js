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
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].code=["YUI.add('gallery-sm-tree', function (Y, NAME) {","","/**","Provides the `Tree` class.","","@module gallery-sm-tree","**/","","/**","The `Tree` class represents a generic tree data structure. A tree has a root","node, which may contain any number of child nodes, which may themselves contain","child nodes, ad infinitum.","","This class doesn't expose any UI, but is extended by the `TreeView` class, which","does.","","@class Tree","@param {Object} [config] Config options.","    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config","        objects or `Tree.Node` instances to add to this tree at initialization","        time.","    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of","        this tree.","@constructor","@extends Base","**/","","var Lang = Y.Lang,","","    /**","    Fired when a node is added to this Tree. The `src` property will indicate","    how the node was added (\"append\", \"insert\", \"prepend\", etc.).","","    @event add","    @param {Number} index Index at which the node will be added.","    @param {Tree.Node} node Node being added.","    @param {Tree.Node} parent Parent node to which the node will be added.","    @param {String} src Source of the event (\"append\", \"insert\", \"prepend\",","        etc.).","    @preventable _defAddFn","    **/","    EVT_ADD = 'add',","","    /**","    Fired when this Tree is cleared.","","    @event clear","    @param {Tree.Node} rootNode New root node of this tree (the old root node is","        always destroyed when a tree is cleared).","    @preventable _defClearFn","    **/","    EVT_CLEAR = 'clear',","","    /**","    Fired when a node is closed.","","    @event close","    @param {Tree.Node} node Node being closed.","    @preventable _defCloseFn","    **/","    EVT_CLOSE = 'close',","","    /**","    Fired when a node is opened.","","    @event open","    @param {Tree.Node} node Node being opened.","    @preventable _defOpenFn","    **/","    EVT_OPEN = 'open',","","    /**","    Fired when a node is removed from this Tree.","","    @event remove","    @param {Boolean} destroy Whether or not the node will be destroyed after","        being removed from this tree.","    @param {Tree.Node} node Node being removed.","    @param {Tree.Node} parent Parent node from which the node will be removed.","    @preventable _defRemoveFn","    **/","    EVT_REMOVE = 'remove';","","var Tree = Y.Base.create('tree', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Reference to the `children` array of this Tree's `rootNode`.","","    This is a convenience property to allow you to type `tree.children` instead","    of `tree.rootNode.children`.","","    @property {Tree.Node[]} children","    @readOnly","    **/","","    /**","    The `Tree.Node` class or subclass that should be used for nodes created by","    this tree.","","    You may specific an actual class reference or a string that resolves to a","    class reference at runtime.","","    @property {String|Tree.Node} nodeClass","    @default Y.Tree.Node","    **/","    nodeClass: Y.Tree.Node,","","    /**","    Optional array containing one or more extension classes that should be mixed","    into the `nodeClass` when this Tree is instantiated. The resulting composed","    node class will be unique to this Tree instance and will not affect any","    other instances, nor will it modify the defined `nodeClass` itself.","","    This provides a late-binding extension mechanism for nodes that doesn't","    require them to extend `Y.Base`, which would incur a significant performance","    hit.","","    @property {Array} nodeExtensions","    @default []","    **/","    nodeExtensions: [],","","    /**","    Root node of this Tree.","","    @property {Tree.Node} rootNode","    @readOnly","    **/","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a Tree instance.","","    @property {Boolean} _isYUITree","    @default true","    @protected","    **/","    _isYUITree: true,","","    /**","    Composed node class based on `nodeClass` that mixes in any extensions","    specified in `nodeExtensions`. If there are no extensions, this will just be","    a reference to `nodeClass`.","","    @property {Tree.Node} _nodeClass","    @protected","    **/","","    /**","    Mapping of node ids to node instances for nodes in this tree.","","    @property {Object} _nodeMap","    @protected","    **/","","    /**","    Default config object for the root node.","","    @property {Object} _rootNodeConfig","    @protected","    **/","    _rootNodeConfig: {canHaveChildren: true},","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        if (config.nodeClass) {","            this.nodeClass = config.nodeClass;","        }","","        if (config.nodeExtensions) {","            this.nodeExtensions = this.nodeExtensions.concat(config.nodeExtensions);","        }","","        /**","        Hash of published custom events.","","        @property {Object} _published","        @default {}","        @protected","        **/","        this._published || (this._published = {});","        this._nodeMap = {};","","        // Allow all extensions to initialize, then finish up.","        this.onceAfter('initializedChange', function () {","            this._composeNodeClass();","","            this.clear(config.rootNode, {silent: true});","","            if (config.nodes) {","                this.insertNode(this.rootNode, config.nodes, {silent: true});","            }","        });","    },","","    destructor: function () {","        this.destroyNode(this.rootNode, {silent: true});","","        this.children   = null;","        this.rootNode   = null;","        this._nodeClass = null;","        this._nodeMap   = null;","        this._published = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends a node or array of nodes as the last child of the specified parent","    node.","","    If a node being appended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method appendNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        appended.","    **/","    appendNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: parent.children.length,","            src  : 'append'","        }));","    },","","    /**","    Clears this tree by destroying the root node and all its children. If a","    `rootNode` argument is provided, that node will become the root node of this","    tree; otherwise, a new root node will be created.","","    @method clear","    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as","        the new root node.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `clear` event","            will be suppressed.","    @chainable","    **/","    clear: function (rootNode, options) {","        return this._fire(EVT_CLEAR, {","            rootNode: this.createNode(rootNode || this._rootNodeConfig)","        }, {","            defaultFn: this._defClearFn,","            silent   : options && options.silent","        });","    },","","    /**","    Closes the specified node if it isn't already closed.","","    @method closeNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    closeNode: function (node, options) {","        if (node.canHaveChildren && node.isOpen()) {","            this._fire(EVT_CLOSE, {node: node}, {","                defaultFn: this._defCloseFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Creates and returns a new `Tree.Node` instance associated with (but not","    yet appended to) this tree.","","    @method createNode","    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`","        instance is specified instead of a config object, that node will be","        adopted into this tree (if it doesn't already belong to this tree) and","        removed from any other tree to which it belongs.","    @return {Tree.Node} New node.","    **/","    createNode: function (config) {","        config || (config = {});","","        // If `config` is already a node, just ensure it's in the node map and","        // return it.","        if (config._isYUITreeNode) {","            this._adoptNode(config);","            return config;","        }","","        // First, create nodes for any children of this node.","        if (config.children) {","            var children = [];","","            for (var i = 0, len = config.children.length; i < len; i++) {","                children.push(this.createNode(config.children[i]));","            }","","            config = Y.merge(config, {children: children});","        }","","        var node = new this._nodeClass(this, config);","","        return this._nodeMap[node.id] = node;","    },","","    /**","    Removes and destroys a node and all its child nodes. Once destroyed, a node","    is eligible for garbage collection and cannot be reused or re-added to the","    tree.","","    @method destroyNode","    @param {Tree.Node} node Node to destroy.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @chainable","    **/","    destroyNode: function (node, options) {","        var child, i, len;","","        options || (options = {});","","        for (i = 0, len = node.children.length; i < len; i++) {","            child = node.children[i];","","            // Manually remove the child from its parent; this makes destroying","            // all children of the parent much faster since there's no splicing","            // involved.","            child.parent = null;","","            // Destroy the child.","            this.destroyNode(child, options);","        }","","        if (node.parent) {","            this.removeNode(node, options);","        }","","        node.children  = null;","        node.data      = null;","        node.state     = {destroyed: true};","        node.tree      = null;","        node._htmlNode = null;","        node._indexMap = null;","","        delete this._nodeMap[node.id];","","        return this;","    },","","    /**","    Removes all children from the specified node. The removed children will","    still be reusable unless the `destroy` option is truthy.","","    @method emptyNode","    @param {Tree.Node} node Node to empty.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    emptyNode: function (node, options) {","        var removed = [];","","        while (node.children.length) {","            removed.push(this.removeNode(node.children[0], options));","        }","","        return removed;","    },","","    /**","    Returns the tree node with the specified id, or `undefined` if the node","    doesn't exist in this tree.","","    @method getNodeById","    @param {String} id Node id.","    @return {Tree.Node} Node, or `undefined` if not found.","    **/","    getNodeById: function (id) {","        return this._nodeMap[id];","    },","","    /**","    Inserts a node or array of nodes at the specified index under the given","    parent node, or appends them to the parent if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insertNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insertNode: function (parent, node, options) {","        options || (options = {});","        parent  || (parent = this.rootNode);","","        var index = options.index;","","        if (typeof index === 'undefined') {","            index = parent.children.length;","        }","","        // If `node` is an array, recurse to insert each node it contains.","        //","        // Note: If you're getting an exception here because `node` is null when","        // you've passed in a reference to some other node's `children` array,","        // that's happening because nodes must be removed from their current","        // parent before being added to the new one, and the `children` array is","        // being modified while the nodes are inserted.","        //","        // Solution: pass a copy of the other node's `children` array instead of","        // the original. Doing the copy operation here would have a negative","        // impact on performance, so you're on your own since this is such a","        // rare edge case.","        if ('length' in node && Lang.isArray(node)) {","            var inserted = [];","","            for (var i = 0, len = node.length; i < len; i++) {","                inserted.push(this.insertNode(parent, node[i], options));","","                if ('index' in options) {","                    options.index += 1;","                }","            }","","            return inserted;","        }","","        node = this.createNode(node);","","        this._fire(EVT_ADD, {","            index : index,","            node  : node,","            parent: parent,","            src   : options.src || 'insert'","        }, {","            defaultFn: this._defAddFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Opens the specified node if it isn't already open.","","    @method openNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    openNode: function (node, options) {","        if (node.canHaveChildren && !node.isOpen()) {","            this._fire(EVT_OPEN, {node: node}, {","                defaultFn: this._defOpenFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of the specified parent","    node.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prependNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        prepended.","    **/","    prependNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: 0,","            src  : 'prepend'","        }));","    },","","    /**","    Removes the specified node from its parent node. The removed node will still","    be reusable unless the `destroy` option is truthy.","","    @method removeNode","    @param {Tree.Node} node Node to remove.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the node and all its","            children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @return {Tree.Node} Node that was removed.","    **/","    removeNode: function (node, options) {","        options || (options = {});","","        this._fire(EVT_REMOVE, {","            destroy: !!options.destroy,","            node   : node,","            parent : node.parent,","            src    : options.src || 'remove'","        }, {","            defaultFn: this._defRemoveFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Returns the total number of nodes in this tree, at all levels.","","    Use `rootNode.children.length` to get only the number of top-level nodes.","","    @method size","    @return {Number} Total number of nodes in this tree.","    **/","    size: function () {","        return this.rootNode.size();","    },","","    /**","    Toggles the open/closed state of the specified node.","","    @method toggleNode","    @param {Tree.Node} node Node to toggle.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggleNode: function (node, options) {","        return node.isOpen() ? this.closeNode(node, options) :","            this.openNode(node, options);","    },","","    /**","    Serializes this tree to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized tree object.","    **/","    toJSON: function () {","        return this.rootNode.toJSON();","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Moves the specified node and all its children from another tree to this","    tree.","","    @method _adoptNode","    @param {Tree.Node} node Node to adopt.","    @param {Object} [options] Options to pass along to `removeNode()`.","    @protected","    **/","    _adoptNode: function (node, options) {","        var oldTree = node.tree;","","        if (oldTree === this) {","            return;","        }","","        for (var i = 0, len = node.children.length; i < len; i++) {","            this._adoptNode(node.children[i], {silent: true});","        }","","        oldTree.removeNode(node, options);","        delete oldTree._nodeMap[node.id];","","        // If this node isn't an instance of this tree's composed _nodeClass,","        // then we need to recreate it to avoid potentially breaking things in","        // really weird ways.","        if (!(node instanceof this._nodeClass)","                || oldTree._nodeClass !== this._nodeClass) {","","            node = this.createNode(node.toJSON());","        }","","        node.tree = this;","        this._nodeMap[node.id] = node;","    },","","    /**","    Composes a custom late-bound tree node class (if necessary) based on the","    classes specified in this Tree's `nodeClass` and `nodeExtensions`","    properties.","","    The composed class is stored in this Tree's `_nodeClass` property. If","    composition wasn't necessary, then `_nodeClass` will just be a reference to","    `nodeClass`.","","    @method _composeNodeClass","    @protected","    **/","    _composeNodeClass: function () {","        var nodeClass      = this.nodeClass,","            nodeExtensions = this.nodeExtensions,","            composedClass;","","        if (typeof nodeClass === 'string') {","            // Look for a namespaced node class on `Y`.","            nodeClass = Y.Object.getValue(Y, nodeClass.split('.'));","","            if (nodeClass) {","                this.nodeClass = nodeClass;","            } else {","                Y.error('Tree: Node class not found: ' + nodeClass);","                return;","            }","        }","","        if (!nodeExtensions.length) {","            this._nodeClass = nodeClass;","            return;","        }","","        // Compose a new class by mixing extensions into nodeClass.","        composedClass = function () {","            var extensions = composedClass._nodeExtensions;","","            nodeClass.apply(this, arguments);","","            for (var i = 0, len = extensions.length; i < len; i++) {","                extensions[i].apply(this, arguments);","            }","        };","","        Y.extend(composedClass, nodeClass);","","        for (var i = 0, len = nodeExtensions.length; i < len; i++) {","            Y.mix(composedClass.prototype, nodeExtensions[i].prototype, true);","        }","","        composedClass._nodeExtensions = nodeExtensions;","        this._nodeClass = composedClass;","    },","","    /**","    Utility method for lazily publishing and firing events.","","    @method _fire","    @param {String} name Event name to fire.","    @param {Object} facade Event facade.","    @param {Object} [options] Options.","        @param {Function} [options.defaultFn] Default handler for this event.","        @param {Boolean} [options.silent=false] Whether the default handler","            should be executed directly without actually firing the event.","    @chainable","    @protected","    **/","    _fire: function (name, facade, options) {","        if (options && options.silent) {","            if (options.defaultFn) {","                options.defaultFn.call(this, facade);","            }","        } else {","            if (options && options.defaultFn && !this._published[name]) {","                this._published[name] = this.publish(name, {","                    defaultFn: options.defaultFn","                });","            }","","            this.fire(name, facade);","        }","","        return this;","    },","","    /**","    Removes the specified node from its parent node if it has one.","","    @method _removeNodeFromParent","    @param {Tree.Node} node Node to remove.","    @protected","    **/","    _removeNodeFromParent: function (node) {","        var parent = node.parent,","            index;","","        if (parent) {","            index = parent.indexOf(node);","","            if (index > -1) {","                parent.children.splice(index, 1);","                parent._isIndexStale = true;","                node.parent = null;","            }","        }","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defAddFn: function (e) {","        var node   = e.node,","            parent = e.parent;","","        // Remove the node from its existing parent if it has one.","        if (node.parent) {","            this._removeNodeFromParent(node);","        }","","        // Add the node to its new parent at the desired index.","        node.parent = parent;","        parent.children.splice(e.index, 0, node);","","        parent.canHaveChildren = true;","        parent._isIndexStale   = true;","    },","","    _defClearFn: function (e) {","        var newRootNode = e.rootNode;","","        if (this.rootNode) {","            this.destroyNode(this.rootNode, {silent: true});","        }","","        this._nodeMap = {};","        this._nodeMap[newRootNode.id] = newRootNode;","","        this.rootNode = newRootNode;","        this.children = newRootNode.children;","    },","","    _defCloseFn: function (e) {","        delete e.node.state.open;","    },","","    _defOpenFn: function (e) {","        e.node.state.open = true;","    },","","    _defRemoveFn: function (e) {","        var node = e.node;","","        if (e.destroy) {","            this.destroyNode(node, {silent: true});","        } else if (e.parent) {","            this._removeNodeFromParent(node);","        } else if (this.rootNode === node) {","            // Guess we'll need a new root node!","            this.rootNode = this.createNode(this._rootNodeConfig);","            this.children = this.rootNode.children;","        }","    }","});","","Y.Tree = Y.mix(Tree, Y.Tree);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"gallery-sm-tree-node\"]});"];
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].lines = {"1":0,"28":0,"84":0,"168":0,"170":0,"171":0,"174":0,"175":0,"185":0,"186":0,"189":0,"190":0,"192":0,"194":0,"195":0,"201":0,"203":0,"204":0,"205":0,"206":0,"207":0,"232":0,"252":0,"270":0,"271":0,"277":0,"292":0,"296":0,"297":0,"298":0,"302":0,"303":0,"305":0,"306":0,"309":0,"312":0,"314":0,"330":0,"332":0,"334":0,"335":0,"340":0,"343":0,"346":0,"347":0,"350":0,"351":0,"352":0,"353":0,"354":0,"355":0,"357":0,"359":0,"377":0,"379":0,"380":0,"383":0,"395":0,"422":0,"423":0,"425":0,"427":0,"428":0,"443":0,"444":0,"446":0,"447":0,"449":0,"450":0,"454":0,"457":0,"459":0,"469":0,"482":0,"483":0,"489":0,"512":0,"533":0,"535":0,"545":0,"557":0,"571":0,"582":0,"597":0,"599":0,"600":0,"603":0,"604":0,"607":0,"608":0,"613":0,"616":0,"619":0,"620":0,"636":0,"640":0,"642":0,"644":0,"645":0,"647":0,"648":0,"652":0,"653":0,"654":0,"658":0,"659":0,"661":0,"663":0,"664":0,"668":0,"670":0,"671":0,"674":0,"675":0,"692":0,"693":0,"694":0,"697":0,"698":0,"703":0,"706":0,"717":0,"720":0,"721":0,"723":0,"724":0,"725":0,"726":0,"733":0,"737":0,"738":0,"742":0,"743":0,"745":0,"746":0,"750":0,"752":0,"753":0,"756":0,"757":0,"759":0,"760":0,"764":0,"768":0,"772":0,"774":0,"775":0,"776":0,"777":0,"778":0,"780":0,"781":0,"786":0};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].functions = {"(anonymous 2):189":0,"initializer:167":0,"destructor:200":0,"appendNode:231":0,"clear:251":0,"closeNode:269":0,"createNode:291":0,"destroyNode:329":0,"emptyNode:376":0,"getNodeById:394":0,"insertNode:421":0,"openNode:481":0,"prependNode:511":0,"removeNode:532":0,"size:556":0,"toggleNode:570":0,"toJSON:581":0,"_adoptNode:596":0,"composedClass:658":0,"_composeNodeClass:635":0,"_fire:691":0,"_removeNodeFromParent:716":0,"_defAddFn:732":0,"_defClearFn:749":0,"_defCloseFn:763":0,"_defOpenFn:767":0,"_defRemoveFn:771":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].coveredLines = 153;
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].coveredFunctions = 28;
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 1);
YUI.add('gallery-sm-tree', function (Y, NAME) {

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
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 28);
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
    Fired when a node is closed.

    @event close
    @param {Tree.Node} node Node being closed.
    @preventable _defCloseFn
    **/
    EVT_CLOSE = 'close',

    /**
    Fired when a node is opened.

    @event open
    @param {Tree.Node} node Node being opened.
    @preventable _defOpenFn
    **/
    EVT_OPEN = 'open',

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

_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 84);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "initializer", 167);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 168);
config || (config = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 170);
if (config.nodeClass) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 171);
this.nodeClass = config.nodeClass;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 174);
if (config.nodeExtensions) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 175);
this.nodeExtensions = this.nodeExtensions.concat(config.nodeExtensions);
        }

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 185);
this._published || (this._published = {});
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 186);
this._nodeMap = {};

        // Allow all extensions to initialize, then finish up.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 189);
this.onceAfter('initializedChange', function () {
            _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "(anonymous 2)", 189);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 190);
this._composeNodeClass();

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 192);
this.clear(config.rootNode, {silent: true});

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 194);
if (config.nodes) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 195);
this.insertNode(this.rootNode, config.nodes, {silent: true});
            }
        });
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "destructor", 200);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 201);
this.destroyNode(this.rootNode, {silent: true});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 203);
this.children   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 204);
this.rootNode   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 205);
this._nodeClass = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 206);
this._nodeMap   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 207);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "appendNode", 231);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 232);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "clear", 251);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 252);
return this._fire(EVT_CLEAR, {
            rootNode: this.createNode(rootNode || this._rootNodeConfig)
        }, {
            defaultFn: this._defClearFn,
            silent   : options && options.silent
        });
    },

    /**
    Closes the specified node if it isn't already closed.

    @method closeNode
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `close` event
            will be suppressed.
    @chainable
    **/
    closeNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "closeNode", 269);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 270);
if (node.canHaveChildren && node.isOpen()) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 271);
this._fire(EVT_CLOSE, {node: node}, {
                defaultFn: this._defCloseFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 277);
return this;
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "createNode", 291);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 292);
config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 296);
if (config._isYUITreeNode) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 297);
this._adoptNode(config);
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 298);
return config;
        }

        // First, create nodes for any children of this node.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 302);
if (config.children) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 303);
var children = [];

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 305);
for (var i = 0, len = config.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 306);
children.push(this.createNode(config.children[i]));
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 309);
config = Y.merge(config, {children: children});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 312);
var node = new this._nodeClass(this, config);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 314);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "destroyNode", 329);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 330);
var child, i, len;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 332);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 334);
for (i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 335);
child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 340);
child.parent = null;

            // Destroy the child.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 343);
this.destroyNode(child, options);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 346);
if (node.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 347);
this.removeNode(node, options);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 350);
node.children  = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 351);
node.data      = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 352);
node.state     = {destroyed: true};
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 353);
node.tree      = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 354);
node._htmlNode = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 355);
node._indexMap = null;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 357);
delete this._nodeMap[node.id];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 359);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "emptyNode", 376);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 377);
var removed = [];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 379);
while (node.children.length) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 380);
removed.push(this.removeNode(node.children[0], options));
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 383);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "getNodeById", 394);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 395);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "insertNode", 421);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 422);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 423);
parent  || (parent = this.rootNode);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 425);
var index = options.index;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 427);
if (typeof index === 'undefined') {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 428);
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
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 443);
if ('length' in node && Lang.isArray(node)) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 444);
var inserted = [];

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 446);
for (var i = 0, len = node.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 447);
inserted.push(this.insertNode(parent, node[i], options));

                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 449);
if ('index' in options) {
                    _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 450);
options.index += 1;
                }
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 454);
return inserted;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 457);
node = this.createNode(node);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 459);
this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 469);
return node;
    },

    /**
    Opens the specified node if it isn't already open.

    @method openNode
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `open` event
            will be suppressed.
    @chainable
    **/
    openNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "openNode", 481);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 482);
if (node.canHaveChildren && !node.isOpen()) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 483);
this._fire(EVT_OPEN, {node: node}, {
                defaultFn: this._defOpenFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 489);
return this;
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "prependNode", 511);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 512);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "removeNode", 532);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 533);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 535);
this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 545);
return node;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "size", 556);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 557);
return this.rootNode.size();
    },

    /**
    Toggles the open/closed state of the specified node.

    @method toggleNode
    @param {Tree.Node} node Node to toggle.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, events will be
            suppressed.
    @chainable
    **/
    toggleNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "toggleNode", 570);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 571);
return node.isOpen() ? this.closeNode(node, options) :
            this.openNode(node, options);
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "toJSON", 581);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 582);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_adoptNode", 596);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 597);
var oldTree = node.tree;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 599);
if (oldTree === this) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 600);
return;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 603);
for (var i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 604);
this._adoptNode(node.children[i], {silent: true});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 607);
oldTree.removeNode(node, options);
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 608);
delete oldTree._nodeMap[node.id];

        // If this node isn't an instance of this tree's composed _nodeClass,
        // then we need to recreate it to avoid potentially breaking things in
        // really weird ways.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 613);
if (!(node instanceof this._nodeClass)
                || oldTree._nodeClass !== this._nodeClass) {

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 616);
node = this.createNode(node.toJSON());
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 619);
node.tree = this;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 620);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_composeNodeClass", 635);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 636);
var nodeClass      = this.nodeClass,
            nodeExtensions = this.nodeExtensions,
            composedClass;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 640);
if (typeof nodeClass === 'string') {
            // Look for a namespaced node class on `Y`.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 642);
nodeClass = Y.Object.getValue(Y, nodeClass.split('.'));

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 644);
if (nodeClass) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 645);
this.nodeClass = nodeClass;
            } else {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 647);
Y.error('Tree: Node class not found: ' + nodeClass);
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 648);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 652);
if (!nodeExtensions.length) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 653);
this._nodeClass = nodeClass;
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 654);
return;
        }

        // Compose a new class by mixing extensions into nodeClass.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 658);
composedClass = function () {
            _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "composedClass", 658);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 659);
var extensions = composedClass._nodeExtensions;

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 661);
nodeClass.apply(this, arguments);

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 663);
for (var i = 0, len = extensions.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 664);
extensions[i].apply(this, arguments);
            }
        };

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 668);
Y.extend(composedClass, nodeClass);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 670);
for (var i = 0, len = nodeExtensions.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 671);
Y.mix(composedClass.prototype, nodeExtensions[i].prototype, true);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 674);
composedClass._nodeExtensions = nodeExtensions;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 675);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_fire", 691);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 692);
if (options && options.silent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 693);
if (options.defaultFn) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 694);
options.defaultFn.call(this, facade);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 697);
if (options && options.defaultFn && !this._published[name]) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 698);
this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 703);
this.fire(name, facade);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 706);
return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {Tree.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_removeNodeFromParent", 716);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 717);
var parent = node.parent,
            index;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 720);
if (parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 721);
index = parent.indexOf(node);

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 723);
if (index > -1) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 724);
parent.children.splice(index, 1);
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 725);
parent._isIndexStale = true;
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 726);
node.parent = null;
            }
        }
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defAddFn", 732);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 733);
var node   = e.node,
            parent = e.parent;

        // Remove the node from its existing parent if it has one.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 737);
if (node.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 738);
this._removeNodeFromParent(node);
        }

        // Add the node to its new parent at the desired index.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 742);
node.parent = parent;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 743);
parent.children.splice(e.index, 0, node);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 745);
parent.canHaveChildren = true;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 746);
parent._isIndexStale   = true;
    },

    _defClearFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defClearFn", 749);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 750);
var newRootNode = e.rootNode;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 752);
if (this.rootNode) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 753);
this.destroyNode(this.rootNode, {silent: true});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 756);
this._nodeMap = {};
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 757);
this._nodeMap[newRootNode.id] = newRootNode;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 759);
this.rootNode = newRootNode;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 760);
this.children = newRootNode.children;
    },

    _defCloseFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defCloseFn", 763);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 764);
delete e.node.state.open;
    },

    _defOpenFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defOpenFn", 767);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 768);
e.node.state.open = true;
    },

    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defRemoveFn", 771);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 772);
var node = e.node;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 774);
if (e.destroy) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 775);
this.destroyNode(node, {silent: true});
        } else {_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 776);
if (e.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 777);
this._removeNodeFromParent(node);
        } else {_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 778);
if (this.rootNode === node) {
            // Guess we'll need a new root node!
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 780);
this.rootNode = this.createNode(this._rootNodeConfig);
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 781);
this.children = this.rootNode.children;
        }}}
    }
});

_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 786);
Y.Tree = Y.mix(Tree, Y.Tree);


}, '@VERSION@', {"requires": ["base-build", "gallery-sm-tree-node"]});
