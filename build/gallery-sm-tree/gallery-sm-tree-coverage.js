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
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].code=["YUI.add('gallery-sm-tree', function (Y, NAME) {","","/**","Provides the `Tree` class.","","@module gallery-sm-tree","**/","","/**","The `Tree` class represents a generic tree data structure. A tree has a root","node, which may contain any number of child nodes, which may themselves contain","child nodes, ad infinitum.","","This class doesn't expose any UI, but is extended by the `TreeView` class, which","does.","","@class Tree","@param {Object} [config] Config options.","    @param {Object[]|Tree.Node[]} [config.nodes] Array of tree node config","        objects or `Tree.Node` instances to add to this tree at initialization","        time.","    @param {Object|Tree.Node} [config.rootNode] Node to use as the root node of","        this tree.","@constructor","@extends Base","**/","","var Lang = Y.Lang,","","    /**","    Fired when a node is added to this Tree. The `src` property will indicate","    how the node was added (\"append\", \"insert\", \"prepend\", etc.).","","    @event add","    @param {Number} index Index at which the node will be added.","    @param {Tree.Node} node Node being added.","    @param {Tree.Node} parent Parent node to which the node will be added.","    @param {String} src Source of the event (\"append\", \"insert\", \"prepend\",","        etc.).","    @preventable _defAddFn","    **/","    EVT_ADD = 'add',","","    /**","    Fired when this Tree is cleared.","","    @event clear","    @param {Tree.Node} rootNode New root node of this tree (the old root node is","        always destroyed when a tree is cleared).","    @preventable _defClearFn","    **/","    EVT_CLEAR = 'clear',","","    /**","    Fired when a node is closed.","","    @event close","    @param {Tree.Node} node Node being closed.","    @preventable _defCloseFn","    **/","    EVT_CLOSE = 'close',","","    /**","    Fired when a node is opened.","","    @event open","    @param {Tree.Node} node Node being opened.","    @preventable _defOpenFn","    **/","    EVT_OPEN = 'open',","","    /**","    Fired when a node is removed from this Tree.","","    @event remove","    @param {Boolean} destroy Whether or not the node will be destroyed after","        being removed from this tree.","    @param {Tree.Node} node Node being removed.","    @param {Tree.Node} parent Parent node from which the node will be removed.","    @preventable _defRemoveFn","    **/","    EVT_REMOVE = 'remove',","","    /**","    Fired when a node is selected.","","    @event select","    @param {Tree.Node} node Node being selected.","    @preventable _defSelectFn","    **/","    EVT_SELECT = 'select',","","    /**","    Fired when a node is unselected.","","    @event unselect","    @param {Tree.Node} node Node being unselected.","    @preventable _defUnselectFn","    **/","    EVT_UNSELECT = 'unselect';","","var Tree = Y.Base.create('tree', Y.Base, [], {","    // -- Public Properties ----------------------------------------------------","","    /**","    Reference to the `children` array of this Tree's `rootNode`.","","    This is a convenience property to allow you to type `tree.children` instead","    of `tree.rootNode.children`.","","    @property {Tree.Node[]} children","    @readOnly","    **/","","    /**","    Root node of this Tree.","","    @property {Tree.Node} rootNode","    @readOnly","    **/","","    /**","    The `Tree.Node` class or subclass that should be used for nodes created by","    this tree.","","    You may specific an actual class reference or a string that resolves to a","    class reference at runtime.","","    @property {String|Tree.Node} nodeClass","    @default Y.Tree.Node","    **/","    nodeClass: Y.Tree.Node,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a Tree instance.","","    @property {Boolean} _isYUITree","    @default true","    @protected","    **/","    _isYUITree: true,","","    /**","    Mapping of node ids to node instances for nodes in this tree.","","    @property {Object} _nodeMap","    @protected","    **/","","    /**","    Default config object for the root node.","","    @property {Object} _rootNodeConfig","    @protected","    **/","    _rootNodeConfig: {canHaveChildren: true},","","    /**","    Mapping of node ids to node instances for nodes in this tree that are","    currently selected.","","    @property {Object} _selectedMap","    @protected","    **/","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        /**","        Hash of published custom events.","","        @property {Object} _published","        @default {}","        @protected","        **/","        this._published || (this._published = {});","","        this._nodeMap = {};","","        if (typeof this.nodeClass === 'string') {","            // Look for a namespaced node class on `Y`.","            this.nodeClass = Y.Object.getValue(Y, this.nodeClass.split('.'));","","            if (!this.nodeClass) {","                Y.error('Tree: Node class not found: ' + this.nodeClass);","            }","        }","","        this.clear(config.rootNode, {silent: true});","        this._attachTreeEvents();","","        if (config.nodes) {","            this.insertNode(this.rootNode, config.nodes, {silent: true});","        }","    },","","    destructor: function () {","        this.destroyNode(this.rootNode, {silent: true});","","        this._detachTreeEvents();","","        this.children     = null;","        this.rootNode     = null;","        this._nodeMap     = null;","        this._published   = null;","        this._selectedMap = null;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Appends a node or array of nodes as the last child of the specified parent","    node.","","    If a node being appended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method appendNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to append","        to the given parent. Node config objects will automatically be converted","        into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        appended.","    **/","    appendNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: parent.children.length,","            src  : 'append'","        }));","    },","","    /**","    Clears this tree by destroying the root node and all its children. If a","    `rootNode` argument is provided, that node will become the root node of this","    tree; otherwise, a new root node will be created.","","    @method clear","    @param {Object|Tree.Node} [rootNode] If specified, this node will be used as","        the new root node.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `clear` event","            will be suppressed.","    @chainable","    **/","    clear: function (rootNode, options) {","        return this._fire(EVT_CLEAR, {","            rootNode: this.createNode(rootNode || this._rootNodeConfig)","        }, {","            defaultFn: this._defClearFn,","            silent   : options && options.silent","        });","    },","","    /**","    Closes the specified node if it isn't already closed.","","    @method closeNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `close` event","            will be suppressed.","    @chainable","    **/","    closeNode: function (node, options) {","        if (node.canHaveChildren && node.isOpen()) {","            this._fire(EVT_CLOSE, {node: node}, {","                defaultFn: this._defCloseFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Creates and returns a new `Tree.Node` instance associated with (but not","    yet appended to) this tree.","","    @method createNode","    @param {Object|Tree.Node} [config] Node configuration. If a `Tree.Node`","        instance is specified instead of a config object, that node will be","        adopted into this tree (if it doesn't already belong to this tree) and","        removed from any other tree to which it belongs.","    @return {Tree.Node} New node.","    **/","    createNode: function (config) {","        config || (config = {});","","        // If `config` is already a node, just ensure it's in the node map and","        // return it.","        if (config._isYUITreeNode) {","            this._adoptNode(config);","            return config;","        }","","        // First, create nodes for any children of this node.","        if (config.children) {","            var children = [];","","            for (var i = 0, len = config.children.length; i < len; i++) {","                children.push(this.createNode(config.children[i]));","            }","","            config = Y.merge(config, {children: children});","        }","","        var node = new this.nodeClass(this, config);","        return this._nodeMap[node.id] = node;","    },","","    /**","    Removes and destroys a node and all its child nodes. Once destroyed, a node","    is eligible for garbage collection and cannot be reused or re-added to the","    tree.","","    @method destroyNode","    @param {Tree.Node} node Node to destroy.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @chainable","    **/","    destroyNode: function (node, options) {","        var child, i, len;","","        options || (options = {});","","        for (i = 0, len = node.children.length; i < len; i++) {","            child = node.children[i];","","            // Manually remove the child from its parent; this makes destroying","            // all children of the parent much faster since there's no splicing","            // involved.","            child.parent = null;","","            // Destroy the child.","            this.destroyNode(child, options);","        }","","        if (node.parent) {","            this.removeNode(node, options);","        }","","        node.children  = null;","        node.data      = null;","        node.state     = {destroyed: true};","        node.tree      = null;","        node._htmlNode = null;","        node._indexMap = null;","","        delete this._nodeMap[node.id];","","        return this;","    },","","    /**","    Removes all children from the specified node. The removed children will","    still be reusable unless the `destroy` option is truthy.","","    @method emptyNode","    @param {Tree.Node} node Node to empty.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the children will","            also be destroyed, which makes them available for garbage collection","            and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, `remove` events will","            be suppressed.","    @return {Tree.Node[]} Array of removed child nodes.","    **/","    emptyNode: function (node, options) {","        var removed = [];","","        while (node.children.length) {","            removed.push(this.removeNode(node.children[0], options));","        }","","        return removed;","    },","","    /**","    Returns the tree node with the specified id, or `undefined` if the node","    doesn't exist in this tree.","","    @method getNodeById","    @param {String} id Node id.","    @return {Tree.Node} Node, or `undefined` if not found.","    **/","    getNodeById: function (id) {","        return this._nodeMap[id];","    },","","    /**","    Returns an array of nodes that are currently selected.","","    @method getSelectedNodes","    @return {Tree.Node[]} Array of selected nodes.","    **/","    getSelectedNodes: function () {","        return Y.Object.values(this._selectedMap);","    },","","    /**","    Inserts a node or array of nodes at the specified index under the given","    parent node, or appends them to the parent if no index is specified.","","    If a node being inserted is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method insertNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node, node config","        object, array of child nodes, or array of node config objects to insert","        under the given parent. Node config objects will automatically be","        converted into node instances.","","    @param {Object} [options] Options.","        @param {Number} [options.index] Index at which to insert the child node.","            If not specified, the node will be appended as the last child of the","            parent.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","","    @return {Tree.Node[]} Node or array of nodes that were inserted.","    **/","    insertNode: function (parent, node, options) {","        options || (options = {});","        parent  || (parent = this.rootNode);","","        var index = options.index;","","        if (typeof index === 'undefined') {","            index = parent.children.length;","        }","","        // If `node` is an array, recurse to insert each node it contains.","        //","        // Note: If you're getting an exception here because `node` is null when","        // you've passed in a reference to some other node's `children` array,","        // that's happening because nodes must be removed from their current","        // parent before being added to the new one, and the `children` array is","        // being modified while the nodes are inserted.","        //","        // Solution: pass a copy of the other node's `children` array instead of","        // the original. Doing the copy operation here would have a negative","        // impact on performance, so you're on your own since this is such a","        // rare edge case.","        if ('length' in node && Lang.isArray(node)) {","            var inserted = [];","","            for (var i = 0, len = node.length; i < len; i++) {","                inserted.push(this.insertNode(parent, node[i], options));","","                if ('index' in options) {","                    options.index += 1;","                }","            }","","            return inserted;","        }","","        node = this.createNode(node);","","        this._fire(EVT_ADD, {","            index : index,","            node  : node,","            parent: parent,","            src   : options.src || 'insert'","        }, {","            defaultFn: this._defAddFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Opens the specified node if it isn't already open.","","    @method openNode","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `open` event","            will be suppressed.","    @chainable","    **/","    openNode: function (node, options) {","        if (node.canHaveChildren && !node.isOpen()) {","            this._fire(EVT_OPEN, {node: node}, {","                defaultFn: this._defOpenFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Prepends a node or array of nodes at the beginning of the specified parent","    node.","","    If a node being prepended is from another tree, it and all its children will","    be removed from that tree and moved to this one.","","    @method prependNode","    @param {Tree.Node} parent Parent node.","    @param {Object|Object[]|Tree.Node|Tree.Node[]} node Child node,","        node config object, array of child nodes, or array of node config","        objects to prepend to the given parent. Node config objects will","        automatically be converted into node instances.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `add` event will","            be suppressed.","    @return {Tree.Node|Tree.Node[]} Node or array of nodes that were","        prepended.","    **/","    prependNode: function (parent, node, options) {","        return this.insertNode(parent, node, Y.merge(options, {","            index: 0,","            src  : 'prepend'","        }));","    },","","    /**","    Removes the specified node from its parent node. The removed node will still","    be reusable unless the `destroy` option is truthy.","","    @method removeNode","    @param {Tree.Node} node Node to remove.","    @param {Object} [options] Options.","        @param {Boolean} [options.destroy=false] If `true`, the node and all its","            children will also be destroyed, which makes them available for","            garbage collection and means they can't be reused.","        @param {Boolean} [options.silent=false] If `true`, the `remove` event","            will be suppressed.","    @return {Tree.Node} Node that was removed.","    **/","    removeNode: function (node, options) {","        options || (options = {});","","        this._fire(EVT_REMOVE, {","            destroy: !!options.destroy,","            node   : node,","            parent : node.parent,","            src    : options.src || 'remove'","        }, {","            defaultFn: this._defRemoveFn,","            silent   : options.silent","        });","","        return node;","    },","","    /**","    Selects the specified node.","","    @method selectNode","    @param {Tree.Node} node Node to select.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `select` event","            will be suppressed.","    @chainable","    **/","    selectNode: function (node, options) {","        // Instead of calling node.isSelected(), we look for the node in this","        // tree's selectedMap, which ensures that the `select` event will fire","        // in cases such as a node being added to this tree with its selected","        // state already set to true.","        if (!this._selectedMap[node.id]) {","            this._fire(EVT_SELECT, {node: node}, {","                defaultFn: this._defSelectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    /**","    Returns the total number of nodes in this tree, at all levels.","","    Use `rootNode.children.length` to get only the number of top-level nodes.","","    @method size","    @return {Number} Total number of nodes in this tree.","    **/","    size: function () {","        return this.rootNode.size();","    },","","    /**","    Toggles the open/closed state of the specified node.","","    @method toggleNode","    @param {Tree.Node} node Node to toggle.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, events will be","            suppressed.","    @chainable","    **/","    toggleNode: function (node, options) {","        return node.isOpen() ? this.closeNode(node, options) :","            this.openNode(node, options);","    },","","    /**","    Serializes this tree to an object suitable for use in JSON.","","    @method toJSON","    @return {Object} Serialized tree object.","    **/","    toJSON: function () {","        return this.rootNode.toJSON();","    },","","    /**","    Unselects all selected nodes.","","    @method unselect","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselect: function (options) {","        for (var id in this._selectedMap) {","            if (this._selectedMap.hasOwnProperty(id)) {","                this.unselectNode(this._selectedMap[id], options);","            }","        }","","        return this;","    },","","    /**","    Unselects the specified node.","","    @method unselectNode","    @param {Tree.Node} node Node to unselect.","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `unselect` event","            will be suppressed.","    @chainable","    **/","    unselectNode: function (node, options) {","        if (node.isSelected() || this._selectedMap[node.id]) {","            this._fire(EVT_UNSELECT, {node: node}, {","                defaultFn: this._defUnselectFn,","                silent   : options && options.silent","            });","        }","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Moves the specified node and all its children from another tree to this","    tree.","","    @method _adoptNode","    @param {Tree.Node} node Node to adopt.","    @param {Object} [options] Options to pass along to `removeNode()`.","    @protected","    **/","    _adoptNode: function (node, options) {","        var oldTree = node.tree;","","        if (oldTree === this) {","            return;","        }","","        for (var i = 0, len = node.children.length; i < len; i++) {","            this._adoptNode(node.children[i], {silent: true});","        }","","        oldTree.removeNode(node, options);","","        // TODO: update selectedMap?","        delete oldTree._nodeMap[node.id];","        this._nodeMap[node.id] = node;","        node.tree = this;","    },","","    _attachTreeEvents: function () {","        this._treeEvents || (this._treeEvents = []);","","        this._treeEvents.push(","            this.after('multiSelectChange', this._afterMultiSelectChange)","        );","    },","","    _detachTreeEvents: function () {","        (new Y.EventHandle(this._treeEvents)).detach();","        this._treeEvents = [];","    },","","    /**","    Utility method for lazily publishing and firing events.","","    @method _fire","    @param {String} name Event name to fire.","    @param {Object} facade Event facade.","    @param {Object} [options] Options.","        @param {Function} [options.defaultFn] Default handler for this event.","        @param {Boolean} [options.silent=false] Whether the default handler","            should be executed directly without actually firing the event.","    @chainable","    @protected","    **/","    _fire: function (name, facade, options) {","        if (options && options.silent) {","            if (options.defaultFn) {","                options.defaultFn.call(this, facade);","            }","        } else {","            if (options && options.defaultFn && !this._published[name]) {","                this._published[name] = this.publish(name, {","                    defaultFn: options.defaultFn","                });","            }","","            this.fire(name, facade);","        }","","        return this;","    },","","    /**","    Removes the specified node from its parent node if it has one.","","    @method _removeNodeFromParent","    @param {Tree.Node} node Node to remove.","    @protected","    **/","    _removeNodeFromParent: function (node) {","        var parent = node.parent,","            index;","","        if (parent) {","            index = parent.indexOf(node);","","            if (index > -1) {","                parent.children.splice(index, 1);","                parent._isIndexStale = true;","                node.parent = null;","            }","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterMultiSelectChange: function (e) {","        this.multiSelect = e.newVal; // for faster lookups","        this.unselect();","    },","","    // -- Default Event Handlers -----------------------------------------------","    _defAddFn: function (e) {","        var node   = e.node,","            parent = e.parent;","","        // Remove the node from its existing parent if it has one.","        this._removeNodeFromParent(node);","","        // Add the node to its new parent at the desired index.","        node.parent = parent;","        parent.children.splice(e.index, 0, node);","","        parent.canHaveChildren = true;","        parent._isIndexStale   = true;","","        // If the node is marked as selected, we need go through the select","        // flow.","        if (node.isSelected()) {","            this.selectNode(node);","        }","    },","","    _defClearFn: function (e) {","        var newRootNode = e.rootNode;","","        if (this.rootNode) {","            this.destroyNode(this.rootNode, {silent: true});","        }","","        this._nodeMap     = {};","        this._selectedMap = {};","","        this._nodeMap[newRootNode.id] = newRootNode;","        this.rootNode = newRootNode;","        this.children = newRootNode.children;","    },","","    _defCloseFn: function (e) {","        delete e.node.state.open;","    },","","    _defOpenFn: function (e) {","        e.node.state.open = true;","    },","","    _defRemoveFn: function (e) {","        var node = e.node;","","        delete node.state.selected;","        delete this._selectedMap[node.id];","","        if (e.destroy) {","            this.destroyNode(node, {silent: true});","        } else if (e.parent) {","            this._removeNodeFromParent(node);","        } else if (this.rootNode === node) {","            // Guess we'll need a new root node!","            this.rootNode = this.createNode(this._rootNodeConfig);","            this.children = this.rootNode.children;","        }","    },","","    _defSelectFn: function (e) {","        if (!this.get('multiSelect')) {","            this.unselect();","        }","","        e.node.state.selected = true;","        this._selectedMap[e.node.id] = e.node;","    },","","    _defUnselectFn: function (e) {","        delete e.node.state.selected;","        delete this._selectedMap[e.node.id];","    }","}, {","    ATTRS: {","        /**","        Whether or not to allow multiple nodes to be selected at once.","","        @attribute {Boolean} multiSelect","        @default false","        **/","        multiSelect: {","            value: false","        }","    }","});","","Y.Tree = Y.mix(Tree, Y.Tree);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"gallery-sm-tree-node\"]});"];
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].lines = {"1":0,"28":0,"102":0,"170":0,"179":0,"181":0,"183":0,"185":0,"187":0,"188":0,"192":0,"193":0,"195":0,"196":0,"201":0,"203":0,"205":0,"206":0,"207":0,"208":0,"209":0,"234":0,"254":0,"272":0,"273":0,"279":0,"294":0,"298":0,"299":0,"300":0,"304":0,"305":0,"307":0,"308":0,"311":0,"314":0,"315":0,"331":0,"333":0,"335":0,"336":0,"341":0,"344":0,"347":0,"348":0,"351":0,"352":0,"353":0,"354":0,"355":0,"356":0,"358":0,"360":0,"378":0,"380":0,"381":0,"384":0,"396":0,"406":0,"433":0,"434":0,"436":0,"438":0,"439":0,"454":0,"455":0,"457":0,"458":0,"460":0,"461":0,"465":0,"468":0,"470":0,"480":0,"493":0,"494":0,"500":0,"523":0,"544":0,"546":0,"556":0,"574":0,"575":0,"581":0,"593":0,"607":0,"618":0,"631":0,"632":0,"633":0,"637":0,"651":0,"652":0,"658":0,"673":0,"675":0,"676":0,"679":0,"680":0,"683":0,"686":0,"687":0,"688":0,"692":0,"694":0,"700":0,"701":0,"718":0,"719":0,"720":0,"723":0,"724":0,"729":0,"732":0,"743":0,"746":0,"747":0,"749":0,"750":0,"751":0,"752":0,"759":0,"760":0,"765":0,"769":0,"772":0,"773":0,"775":0,"776":0,"780":0,"781":0,"786":0,"788":0,"789":0,"792":0,"793":0,"795":0,"796":0,"797":0,"801":0,"805":0,"809":0,"811":0,"812":0,"814":0,"815":0,"816":0,"817":0,"818":0,"820":0,"821":0,"826":0,"827":0,"830":0,"831":0,"835":0,"836":0,"852":0};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].functions = {"initializer:169":0,"destructor:200":0,"appendNode:233":0,"clear:253":0,"closeNode:271":0,"createNode:293":0,"destroyNode:330":0,"emptyNode:377":0,"getNodeById:395":0,"getSelectedNodes:405":0,"insertNode:432":0,"openNode:492":0,"prependNode:522":0,"removeNode:543":0,"selectNode:569":0,"size:592":0,"toggleNode:606":0,"toJSON:617":0,"unselect:630":0,"unselectNode:650":0,"_adoptNode:672":0,"_attachTreeEvents:691":0,"_detachTreeEvents:699":0,"_fire:717":0,"_removeNodeFromParent:742":0,"_afterMultiSelectChange:758":0,"_defAddFn:764":0,"_defClearFn:785":0,"_defCloseFn:800":0,"_defOpenFn:804":0,"_defRemoveFn:808":0,"_defSelectFn:825":0,"_defUnselectFn:834":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].coveredLines = 158;
_yuitest_coverage["build/gallery-sm-tree/gallery-sm-tree.js"].coveredFunctions = 34;
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
    EVT_REMOVE = 'remove',

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

_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 102);
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
    Root node of this Tree.

    @property {Tree.Node} rootNode
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

    // -- Protected Properties -------------------------------------------------

    /**
    Simple way to type-check that this is a Tree instance.

    @property {Boolean} _isYUITree
    @default true
    @protected
    **/
    _isYUITree: true,

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

    /**
    Mapping of node ids to node instances for nodes in this tree that are
    currently selected.

    @property {Object} _selectedMap
    @protected
    **/

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "initializer", 169);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 170);
config || (config = {});

        /**
        Hash of published custom events.

        @property {Object} _published
        @default {}
        @protected
        **/
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 179);
this._published || (this._published = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 181);
this._nodeMap = {};

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 183);
if (typeof this.nodeClass === 'string') {
            // Look for a namespaced node class on `Y`.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 185);
this.nodeClass = Y.Object.getValue(Y, this.nodeClass.split('.'));

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 187);
if (!this.nodeClass) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 188);
Y.error('Tree: Node class not found: ' + this.nodeClass);
            }
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 192);
this.clear(config.rootNode, {silent: true});
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 193);
this._attachTreeEvents();

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 195);
if (config.nodes) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 196);
this.insertNode(this.rootNode, config.nodes, {silent: true});
        }
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "destructor", 200);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 201);
this.destroyNode(this.rootNode, {silent: true});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 203);
this._detachTreeEvents();

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 205);
this.children     = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 206);
this.rootNode     = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 207);
this._nodeMap     = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 208);
this._published   = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 209);
this._selectedMap = null;
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "appendNode", 233);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 234);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "clear", 253);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 254);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "closeNode", 271);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 272);
if (node.canHaveChildren && node.isOpen()) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 273);
this._fire(EVT_CLOSE, {node: node}, {
                defaultFn: this._defCloseFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 279);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "createNode", 293);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 294);
config || (config = {});

        // If `config` is already a node, just ensure it's in the node map and
        // return it.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 298);
if (config._isYUITreeNode) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 299);
this._adoptNode(config);
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 300);
return config;
        }

        // First, create nodes for any children of this node.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 304);
if (config.children) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 305);
var children = [];

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 307);
for (var i = 0, len = config.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 308);
children.push(this.createNode(config.children[i]));
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 311);
config = Y.merge(config, {children: children});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 314);
var node = new this.nodeClass(this, config);
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 315);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "destroyNode", 330);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 331);
var child, i, len;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 333);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 335);
for (i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 336);
child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 341);
child.parent = null;

            // Destroy the child.
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 344);
this.destroyNode(child, options);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 347);
if (node.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 348);
this.removeNode(node, options);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 351);
node.children  = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 352);
node.data      = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 353);
node.state     = {destroyed: true};
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 354);
node.tree      = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 355);
node._htmlNode = null;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 356);
node._indexMap = null;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 358);
delete this._nodeMap[node.id];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 360);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "emptyNode", 377);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 378);
var removed = [];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 380);
while (node.children.length) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 381);
removed.push(this.removeNode(node.children[0], options));
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 384);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "getNodeById", 395);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 396);
return this._nodeMap[id];
    },

    /**
    Returns an array of nodes that are currently selected.

    @method getSelectedNodes
    @return {Tree.Node[]} Array of selected nodes.
    **/
    getSelectedNodes: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "getSelectedNodes", 405);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 406);
return Y.Object.values(this._selectedMap);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "insertNode", 432);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 433);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 434);
parent  || (parent = this.rootNode);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 436);
var index = options.index;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 438);
if (typeof index === 'undefined') {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 439);
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
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 454);
if ('length' in node && Lang.isArray(node)) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 455);
var inserted = [];

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 457);
for (var i = 0, len = node.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 458);
inserted.push(this.insertNode(parent, node[i], options));

                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 460);
if ('index' in options) {
                    _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 461);
options.index += 1;
                }
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 465);
return inserted;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 468);
node = this.createNode(node);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 470);
this._fire(EVT_ADD, {
            index : index,
            node  : node,
            parent: parent,
            src   : options.src || 'insert'
        }, {
            defaultFn: this._defAddFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 480);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "openNode", 492);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 493);
if (node.canHaveChildren && !node.isOpen()) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 494);
this._fire(EVT_OPEN, {node: node}, {
                defaultFn: this._defOpenFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 500);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "prependNode", 522);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 523);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "removeNode", 543);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 544);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 546);
this._fire(EVT_REMOVE, {
            destroy: !!options.destroy,
            node   : node,
            parent : node.parent,
            src    : options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent   : options.silent
        });

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 556);
return node;
    },

    /**
    Selects the specified node.

    @method selectNode
    @param {Tree.Node} node Node to select.
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "selectNode", 569);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 574);
if (!this._selectedMap[node.id]) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 575);
this._fire(EVT_SELECT, {node: node}, {
                defaultFn: this._defSelectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 581);
return this;
    },

    /**
    Returns the total number of nodes in this tree, at all levels.

    Use `rootNode.children.length` to get only the number of top-level nodes.

    @method size
    @return {Number} Total number of nodes in this tree.
    **/
    size: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "size", 592);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 593);
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "toggleNode", 606);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 607);
return node.isOpen() ? this.closeNode(node, options) :
            this.openNode(node, options);
    },

    /**
    Serializes this tree to an object suitable for use in JSON.

    @method toJSON
    @return {Object} Serialized tree object.
    **/
    toJSON: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "toJSON", 617);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 618);
return this.rootNode.toJSON();
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "unselect", 630);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 631);
for (var id in this._selectedMap) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 632);
if (this._selectedMap.hasOwnProperty(id)) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 633);
this.unselectNode(this._selectedMap[id], options);
            }
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 637);
return this;
    },

    /**
    Unselects the specified node.

    @method unselectNode
    @param {Tree.Node} node Node to unselect.
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `unselect` event
            will be suppressed.
    @chainable
    **/
    unselectNode: function (node, options) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "unselectNode", 650);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 651);
if (node.isSelected() || this._selectedMap[node.id]) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 652);
this._fire(EVT_UNSELECT, {node: node}, {
                defaultFn: this._defUnselectFn,
                silent   : options && options.silent
            });
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 658);
return this;
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_adoptNode", 672);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 673);
var oldTree = node.tree;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 675);
if (oldTree === this) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 676);
return;
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 679);
for (var i = 0, len = node.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 680);
this._adoptNode(node.children[i], {silent: true});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 683);
oldTree.removeNode(node, options);

        // TODO: update selectedMap?
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 686);
delete oldTree._nodeMap[node.id];
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 687);
this._nodeMap[node.id] = node;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 688);
node.tree = this;
    },

    _attachTreeEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_attachTreeEvents", 691);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 692);
this._treeEvents || (this._treeEvents = []);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 694);
this._treeEvents.push(
            this.after('multiSelectChange', this._afterMultiSelectChange)
        );
    },

    _detachTreeEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_detachTreeEvents", 699);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 700);
(new Y.EventHandle(this._treeEvents)).detach();
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 701);
this._treeEvents = [];
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
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_fire", 717);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 718);
if (options && options.silent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 719);
if (options.defaultFn) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 720);
options.defaultFn.call(this, facade);
            }
        } else {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 723);
if (options && options.defaultFn && !this._published[name]) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 724);
this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 729);
this.fire(name, facade);
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 732);
return this;
    },

    /**
    Removes the specified node from its parent node if it has one.

    @method _removeNodeFromParent
    @param {Tree.Node} node Node to remove.
    @protected
    **/
    _removeNodeFromParent: function (node) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_removeNodeFromParent", 742);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 743);
var parent = node.parent,
            index;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 746);
if (parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 747);
index = parent.indexOf(node);

            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 749);
if (index > -1) {
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 750);
parent.children.splice(index, 1);
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 751);
parent._isIndexStale = true;
                _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 752);
node.parent = null;
            }
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_afterMultiSelectChange", 758);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 759);
this.multiSelect = e.newVal; // for faster lookups
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 760);
this.unselect();
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defAddFn", 764);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 765);
var node   = e.node,
            parent = e.parent;

        // Remove the node from its existing parent if it has one.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 769);
this._removeNodeFromParent(node);

        // Add the node to its new parent at the desired index.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 772);
node.parent = parent;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 773);
parent.children.splice(e.index, 0, node);

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 775);
parent.canHaveChildren = true;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 776);
parent._isIndexStale   = true;

        // If the node is marked as selected, we need go through the select
        // flow.
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 780);
if (node.isSelected()) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 781);
this.selectNode(node);
        }
    },

    _defClearFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defClearFn", 785);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 786);
var newRootNode = e.rootNode;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 788);
if (this.rootNode) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 789);
this.destroyNode(this.rootNode, {silent: true});
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 792);
this._nodeMap     = {};
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 793);
this._selectedMap = {};

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 795);
this._nodeMap[newRootNode.id] = newRootNode;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 796);
this.rootNode = newRootNode;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 797);
this.children = newRootNode.children;
    },

    _defCloseFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defCloseFn", 800);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 801);
delete e.node.state.open;
    },

    _defOpenFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defOpenFn", 804);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 805);
e.node.state.open = true;
    },

    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defRemoveFn", 808);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 809);
var node = e.node;

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 811);
delete node.state.selected;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 812);
delete this._selectedMap[node.id];

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 814);
if (e.destroy) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 815);
this.destroyNode(node, {silent: true});
        } else {_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 816);
if (e.parent) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 817);
this._removeNodeFromParent(node);
        } else {_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 818);
if (this.rootNode === node) {
            // Guess we'll need a new root node!
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 820);
this.rootNode = this.createNode(this._rootNodeConfig);
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 821);
this.children = this.rootNode.children;
        }}}
    },

    _defSelectFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defSelectFn", 825);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 826);
if (!this.get('multiSelect')) {
            _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 827);
this.unselect();
        }

        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 830);
e.node.state.selected = true;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 831);
this._selectedMap[e.node.id] = e.node;
    },

    _defUnselectFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-tree/gallery-sm-tree.js", "_defUnselectFn", 834);
_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 835);
delete e.node.state.selected;
        _yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 836);
delete this._selectedMap[e.node.id];
    }
}, {
    ATTRS: {
        /**
        Whether or not to allow multiple nodes to be selected at once.

        @attribute {Boolean} multiSelect
        @default false
        **/
        multiSelect: {
            value: false
        }
    }
});

_yuitest_coverline("build/gallery-sm-tree/gallery-sm-tree.js", 852);
Y.Tree = Y.mix(Tree, Y.Tree);


}, '@VERSION@', {"requires": ["base-build", "gallery-sm-tree-node"]});
