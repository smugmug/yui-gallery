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
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-treeview/gallery-sm-treeview.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].code=["YUI.add('gallery-sm-treeview', function (Y, NAME) {","","/**","Provides the `Y.TreeView` widget.","","@module gallery-sm-treeview","@main gallery-sm-treeview","**/","","/**","TreeView widget.","","@class TreeView","@constructor","@extends View","@uses Tree","**/","","var getClassName = Y.ClassNameManager.getClassName,","","TreeView = Y.Base.create('treeView', Y.View, [Y.Tree], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this treeview.","","    @property {Object} classNames","    @param {String} canHaveChildren Class name indicating that a tree node can","        contain child nodes (whether or not it actually does).","    @param {String} children Class name for a list of child nodes.","    @param {String} hasChildren Class name indicating that a tree node has one","        or more child nodes.","    @param {String} icon Class name for a tree node's icon.","    @param {String} indicator Class name for an open/closed indicator.","    @param {String} label Class name for a tree node's user-visible label.","    @param {String} node Class name for a tree node item.","    @param {String} noTouch Class name added to the TreeView container when not","        using a touchscreen device.","    @param {String} open Class name indicating that a tree node is open.","    @param {String} row Class name for a row container encompassing the","        indicator and label within a tree node.","    @param {String} selected Class name for a tree node that's selected.","    @param {String} touch Class name added to the TreeView container when using","        a touchscreen device.","    @param {String} treeview Class name for the TreeView container.","    **/","    classNames: {","        canHaveChildren: getClassName('treeview-can-have-children'),","        children       : getClassName('treeview-children'),","        hasChildren    : getClassName('treeview-has-children'),","        icon           : getClassName('treeview-icon'),","        indicator      : getClassName('treeview-indicator'),","        label          : getClassName('treeview-label'),","        node           : getClassName('treeview-node'),","        noTouch        : getClassName('treeview-notouch'),","        open           : getClassName('treeview-open'),","        row            : getClassName('treeview-row'),","        selected       : getClassName('treeview-selected'),","        touch          : getClassName('treeview-touch'),","        treeview       : getClassName('treeview')","    },","","    /**","    Whether or not this TreeView has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView instance.","","    @property {Boolean} _isYUITreeView","    @default true","    @protected","    **/","    _isYUITreeView: true,","","    /**","    Cached value of the `lazyRender` attribute.","","    @property {Boolean} _lazyRender","    @protected","    **/","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._attachTreeViewEvents();","    },","","    destructor: function () {","        this._detachTreeViewEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    `Tree.Node` instance, if any.","","    @method getHTMLNode","    @param {Tree.Node} treeNode Tree node.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (treeNode) {","        if (!treeNode._htmlNode) {","            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);","        }","","        return treeNode._htmlNode;","    },","","    /**","    Renders this TreeView into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container     = this.get('container'),","            isTouchDevice = 'ontouchstart' in Y.config.win;","","        container.addClass(this.classNames.treeview);","        container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified tree node.","","    If a container is specified, it will be assumed to be an existing rendered","    tree node, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Tree.Node} treeNode Tree node whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children),","            lazyRender   = this._lazyRender;","","        if (!childrenNode) {","            childrenNode = Y.Node.create(TreeView.Templates.children({","                classNames: this.classNames,","                node      : treeNode,","                treeview  : this // not currently used, but may be useful for custom templates","            }));","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","","            for (var i = 0, len = treeNode.children.length; i < len; i++) {","                var child = treeNode.children[i];","","                this.renderNode(child, {","                    container     : childrenNode,","                    renderChildren: !lazyRender || child.isOpen()","                });","            }","        }","","        // Keep track of whether or not this node's children have been rendered","        // so we'll know whether we need to render them later if the node is","        // opened.","        treeNode.state.renderedChildren = true;","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified tree node and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Tree.Node} treeNode Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered tree node.","    **/","    renderNode: function (treeNode, options) {","        options || (options = {});","","        var classNames     = this.classNames,","            hasChildren    = treeNode.hasChildren(),","            htmlNode       = treeNode._htmlNode,","            nodeClassNames = {};","","        // Build the hash of CSS classes for this node.","        nodeClassNames[classNames.node]            = true;","        nodeClassNames[classNames.canHaveChildren] = treeNode.canHaveChildren;","        nodeClassNames[classNames.hasChildren]     = hasChildren;","        nodeClassNames[classNames.open]            = treeNode.isOpen();","","        if (htmlNode) {","            // This node has already been rendered, so we just need to update","            // the DOM instead of re-rendering it from scratch.","            htmlNode.one('.' + classNames.label).setHTML(treeNode.label);","","            for (var className in nodeClassNames) {","                if (nodeClassNames.hasOwnProperty(className)) {","                    htmlNode.toggleClass(className, nodeClassNames[className]);","                }","            }","        } else {","            // This node hasn't been rendered yet, so render it from scratch.","            var enabledClassNames = [];","","            for (var className in nodeClassNames) {","                if (nodeClassNames.hasOwnProperty(className) && nodeClassNames[className]) {","                    enabledClassNames.push(className);","                }","            }","","            htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({","                classNames    : classNames,","                nodeClassNames: enabledClassNames,","                node          : treeNode,","                treeview      : this // not currently used, but may be useful for custom templates","            }));","        }","","        if (hasChildren && options.renderChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        treeNode.state.rendered = true;","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachTreeViewEvents: function () {","        this._treeViewEvents || (this._treeViewEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._treeViewEvents.push(","            // Custom events.","            this.after({","                add              : this._afterAdd,","                close            : this._afterClose,","                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh","                open             : this._afterOpen,","                remove           : this._afterRemove,","                select           : this._afterSelect,","                unselect         : this._afterUnselect","            }),","","            // DOM events.","            container.on('mousedown', this._onMouseDown, this),","","            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),","            container.delegate('click', this._onRowClick, '.' + classNames.row, this),","            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)","        );","    },","","    _detachTreeViewEvents: function () {","        (new Y.EventHandle(this._treeViewEvents)).detach();","    },","","    /**","    Setter for the `lazyRender` attribute.","","    Just caches the value in a property for faster lookups.","","    @method _setLazyRender","    @return {Boolean} Value.","    @protected","    **/","    _setLazyRender: function (value) {","        return this._lazyRender = value;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode         = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode = this.renderNode(parent);","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    _afterClear: function () {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.open);","        htmlNode.set('aria-expanded', false);","    },","","    _afterOpen: function (e) {","        if (!this.rendered) {","            return;","        }","","        var treeNode = e.node,","            htmlNode = this.getHTMLNode(treeNode);","","        // If this node's children haven't been rendered yet, render them.","        if (!treeNode.state.renderedChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        htmlNode.addClass(this.classNames.open);","        htmlNode.set('aria-expanded', true);","    },","","    _afterRemove: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    _afterSelect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.selected);","","        if (this.multiSelect) {","            // It's only necessary to set aria-selected when multi-selection is","            // enabled and focus can't be used to track the selection state.","            htmlNode.set('aria-selected', true);","        } else {","            htmlNode.set('tabIndex', 0).focus();","        }","    },","","    _afterTreeViewMultiSelectChange: function (e) {","        if (!this.rendered) {","            return;","        }","","        var container = this.get('container'),","            rootList  = container.one('> .' + this.classNames.children),","            htmlNodes = container.all('.' + this.classNames.node);","","        if (e.newVal) {","            rootList.set('aria-multiselectable', true);","            htmlNodes.set('aria-selected', false);","        } else {","            // When multiselect is disabled, aria-selected must not be set on","            // any nodes, since focus is used to indicate selection.","            rootList.removeAttribute('aria-multiselectable');","            htmlNodes.removeAttribute('aria-selected');","        }","    },","","    _afterUnselect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.selected);","","        if (this.multiSelect) {","            htmlNode.set('aria-selected', false);","        }","","        htmlNode.removeAttribute('tabIndex');","    },","","    _onIndicatorClick: function (e) {","        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);","","        // Indicator clicks shouldn't toggle selection state, so don't allow","        // this event to propagate to the _onRowClick() handler.","        e.stopImmediatePropagation();","","        this.getNodeById(rowNode.getData('node-id')).toggle();","    },","","    _onMouseDown: function (e) {","        // This prevents the tree from momentarily grabbing focus before focus","        // is set on a node.","        e.preventDefault();","    },","","    _onRowClick: function (e) {","        var node = this.getNodeById(e.currentTarget.getData('node-id'));","","        if (this.multiSelect) {","            node[node.isSelected() ? 'unselect' : 'select']();","        } else {","            node.select();","        }","    },","","    _onRowDoubleClick: function (e) {","        this.getNodeById(e.currentTarget.getData('node-id')).toggle();","    }","}, {","    ATTRS: {","        /**","        When `true`, a node's children won't be rendered until the first time","        that node is opened.","","        This can significantly speed up the time it takes to render a large","        tree, but might not make sense if you're using CSS that doesn't hide the","        contents of closed nodes.","","        @attribute {Boolean} lazyRender","        @default true","        **/","        lazyRender: {","            lazyAdd: false, // to ensure that the setter runs on init","            setter : '_setLazyRender',","            value  : true","        }","    }","});","","Y.TreeView = Y.mix(TreeView, Y.TreeView);","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"gallery-sm-tree\",","        \"gallery-sm-treeview-templates\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].lines = {"1":0,"19":0,"92":0,"96":0,"111":0,"112":0,"115":0,"128":0,"131":0,"132":0,"134":0,"138":0,"139":0,"142":0,"144":0,"162":0,"164":0,"168":0,"169":0,"176":0,"177":0,"179":0,"180":0,"182":0,"192":0,"194":0,"195":0,"198":0,"216":0,"218":0,"224":0,"225":0,"226":0,"227":0,"229":0,"232":0,"234":0,"235":0,"236":0,"241":0,"243":0,"244":0,"245":0,"249":0,"257":0,"258":0,"263":0,"265":0,"266":0,"269":0,"275":0,"277":0,"280":0,"302":0,"315":0,"322":0,"323":0,"326":0,"330":0,"331":0,"333":0,"334":0,"336":0,"339":0,"341":0,"345":0,"349":0,"356":0,"357":0,"360":0,"361":0,"363":0,"364":0,"368":0,"369":0,"372":0,"374":0,"375":0,"379":0,"380":0,"383":0,"387":0,"388":0,"393":0,"394":0,"398":0,"399":0,"402":0,"404":0,"405":0,"406":0,"411":0,"412":0,"415":0,"417":0,"419":0,"422":0,"424":0,"429":0,"430":0,"433":0,"437":0,"438":0,"439":0,"443":0,"444":0,"449":0,"450":0,"453":0,"455":0,"457":0,"458":0,"461":0,"465":0,"469":0,"471":0,"477":0,"481":0,"483":0,"484":0,"486":0,"491":0,"514":0};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].functions = {"initializer:91":0,"destructor:95":0,"getHTMLNode:110":0,"render:127":0,"renderChildren:161":0,"renderNode:215":0,"_attachTreeViewEvents:274":0,"_detachTreeViewEvents:301":0,"_setLazyRender:314":0,"_afterAdd:320":0,"_afterClear:354":0,"_afterClose:367":0,"_afterOpen:378":0,"_afterRemove:397":0,"_afterSelect:410":0,"_afterTreeViewMultiSelectChange:428":0,"_afterUnselect:448":0,"_onIndicatorClick:464":0,"_onMouseDown:474":0,"_onRowClick:480":0,"_onRowDoubleClick:490":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].coveredLines = 123;
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].coveredFunctions = 22;
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 1);
YUI.add('gallery-sm-treeview', function (Y, NAME) {

/**
Provides the `Y.TreeView` widget.

@module gallery-sm-treeview
@main gallery-sm-treeview
**/

/**
TreeView widget.

@class TreeView
@constructor
@extends View
@uses Tree
**/

_yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 19);
var getClassName = Y.ClassNameManager.getClassName,

TreeView = Y.Base.create('treeView', Y.View, [Y.Tree], {
    // -- Public Properties ----------------------------------------------------

    /**
    CSS class names used by this treeview.

    @property {Object} classNames
    @param {String} canHaveChildren Class name indicating that a tree node can
        contain child nodes (whether or not it actually does).
    @param {String} children Class name for a list of child nodes.
    @param {String} hasChildren Class name indicating that a tree node has one
        or more child nodes.
    @param {String} icon Class name for a tree node's icon.
    @param {String} indicator Class name for an open/closed indicator.
    @param {String} label Class name for a tree node's user-visible label.
    @param {String} node Class name for a tree node item.
    @param {String} noTouch Class name added to the TreeView container when not
        using a touchscreen device.
    @param {String} open Class name indicating that a tree node is open.
    @param {String} row Class name for a row container encompassing the
        indicator and label within a tree node.
    @param {String} selected Class name for a tree node that's selected.
    @param {String} touch Class name added to the TreeView container when using
        a touchscreen device.
    @param {String} treeview Class name for the TreeView container.
    **/
    classNames: {
        canHaveChildren: getClassName('treeview-can-have-children'),
        children       : getClassName('treeview-children'),
        hasChildren    : getClassName('treeview-has-children'),
        icon           : getClassName('treeview-icon'),
        indicator      : getClassName('treeview-indicator'),
        label          : getClassName('treeview-label'),
        node           : getClassName('treeview-node'),
        noTouch        : getClassName('treeview-notouch'),
        open           : getClassName('treeview-open'),
        row            : getClassName('treeview-row'),
        selected       : getClassName('treeview-selected'),
        touch          : getClassName('treeview-touch'),
        treeview       : getClassName('treeview')
    },

    /**
    Whether or not this TreeView has been rendered.

    @property {Boolean} rendered
    @default false
    **/
    rendered: false,

    // -- Protected Properties -------------------------------------------------

    /**
    Simple way to type-check that this is a TreeView instance.

    @property {Boolean} _isYUITreeView
    @default true
    @protected
    **/
    _isYUITreeView: true,

    /**
    Cached value of the `lazyRender` attribute.

    @property {Boolean} _lazyRender
    @protected
    **/

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "initializer", 91);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 92);
this._attachTreeViewEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "destructor", 95);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 96);
this._detachTreeViewEvents();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns the HTML node (as a `Y.Node` instance) associated with the specified
    `Tree.Node` instance, if any.

    @method getHTMLNode
    @param {Tree.Node} treeNode Tree node.
    @return {Node} `Y.Node` instance associated with the given tree node, or
        `undefined` if one was not found.
    **/
    getHTMLNode: function (treeNode) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "getHTMLNode", 110);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 111);
if (!treeNode._htmlNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 112);
treeNode._htmlNode = this.get('container').one('#' + treeNode.id);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 115);
return treeNode._htmlNode;
    },

    /**
    Renders this TreeView into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "render", 127);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 128);
var container     = this.get('container'),
            isTouchDevice = 'ontouchstart' in Y.config.win;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 131);
container.addClass(this.classNames.treeview);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 132);
container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 134);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 138);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 139);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 142);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 144);
return this;
    },

    /**
    Renders the children of the specified tree node.

    If a container is specified, it will be assumed to be an existing rendered
    tree node, and the children will be rendered (or re-rendered) inside it.

    @method renderChildren
    @param {Tree.Node} treeNode Tree node whose children should be rendered.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container into
            which the children should be rendered. If the container already
            contains rendered children, they will be re-rendered in place.
    @return {Node} `Y.Node` instance containing the rendered children.
    **/
    renderChildren: function (treeNode, options) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "renderChildren", 161);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 162);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 164);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children),
            lazyRender   = this._lazyRender;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 168);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 169);
childrenNode = Y.Node.create(TreeView.Templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this // not currently used, but may be useful for custom templates
            }));
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 176);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 177);
childrenNode.set('aria-expanded', treeNode.isOpen());

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 179);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 180);
var child = treeNode.children[i];

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 182);
this.renderNode(child, {
                    container     : childrenNode,
                    renderChildren: !lazyRender || child.isOpen()
                });
            }
        }

        // Keep track of whether or not this node's children have been rendered
        // so we'll know whether we need to render them later if the node is
        // opened.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 192);
treeNode.state.renderedChildren = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 194);
if (container) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 195);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 198);
return childrenNode;
    },

    /**
    Renders the specified tree node and its children (if any).

    If a container is specified, the rendered node will be appended to it.

    @method renderNode
    @param {Tree.Node} treeNode Tree node to render.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container to
            which the rendered tree node should be appended.
        @param {Boolean} [options.renderChildren=false] Whether or not to render
            this node's children.
    @return {Node} `Y.Node` instance of the rendered tree node.
    **/
    renderNode: function (treeNode, options) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "renderNode", 215);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 216);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 218);
var classNames     = this.classNames,
            hasChildren    = treeNode.hasChildren(),
            htmlNode       = treeNode._htmlNode,
            nodeClassNames = {};

        // Build the hash of CSS classes for this node.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 224);
nodeClassNames[classNames.node]            = true;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 225);
nodeClassNames[classNames.canHaveChildren] = treeNode.canHaveChildren;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 226);
nodeClassNames[classNames.hasChildren]     = hasChildren;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 227);
nodeClassNames[classNames.open]            = treeNode.isOpen();

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 229);
if (htmlNode) {
            // This node has already been rendered, so we just need to update
            // the DOM instead of re-rendering it from scratch.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 232);
htmlNode.one('.' + classNames.label).setHTML(treeNode.label);

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 234);
for (var className in nodeClassNames) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 235);
if (nodeClassNames.hasOwnProperty(className)) {
                    _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 236);
htmlNode.toggleClass(className, nodeClassNames[className]);
                }
            }
        } else {
            // This node hasn't been rendered yet, so render it from scratch.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 241);
var enabledClassNames = [];

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 243);
for (var className in nodeClassNames) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 244);
if (nodeClassNames.hasOwnProperty(className) && nodeClassNames[className]) {
                    _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 245);
enabledClassNames.push(className);
                }
            }

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 249);
htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({
                classNames    : classNames,
                nodeClassNames: enabledClassNames,
                node          : treeNode,
                treeview      : this // not currently used, but may be useful for custom templates
            }));
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 257);
if (hasChildren && options.renderChildren) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 258);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 263);
treeNode.state.rendered = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 265);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 266);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 269);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_attachTreeViewEvents", 274);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 275);
this._treeViewEvents || (this._treeViewEvents = []);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 277);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 280);
this._treeViewEvents.push(
            // Custom events.
            this.after({
                add              : this._afterAdd,
                close            : this._afterClose,
                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh
                open             : this._afterOpen,
                remove           : this._afterRemove,
                select           : this._afterSelect,
                unselect         : this._afterUnselect
            }),

            // DOM events.
            container.on('mousedown', this._onMouseDown, this),

            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),
            container.delegate('click', this._onRowClick, '.' + classNames.row, this),
            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)
        );
    },

    _detachTreeViewEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_detachTreeViewEvents", 301);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 302);
(new Y.EventHandle(this._treeViewEvents)).detach();
    },

    /**
    Setter for the `lazyRender` attribute.

    Just caches the value in a property for faster lookups.

    @method _setLazyRender
    @return {Boolean} Value.
    @protected
    **/
    _setLazyRender: function (value) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_setLazyRender", 314);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 315);
return this._lazyRender = value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterAdd", 320);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 322);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 323);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 326);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 330);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 331);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 333);
htmlNode         = this.getHTMLNode(parent);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 334);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 336);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 339);
htmlNode = this.renderNode(parent);

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 341);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 345);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 349);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    _afterClear: function () {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterClear", 354);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 356);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 357);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 360);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 361);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 363);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 364);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterClose", 367);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 368);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 369);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 372);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 374);
htmlNode.removeClass(this.classNames.open);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 375);
htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterOpen", 378);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 379);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 380);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 383);
var treeNode = e.node,
            htmlNode = this.getHTMLNode(treeNode);

        // If this node's children haven't been rendered yet, render them.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 387);
if (!treeNode.state.renderedChildren) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 388);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 393);
htmlNode.addClass(this.classNames.open);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 394);
htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterRemove", 397);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 398);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 399);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 402);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 404);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 405);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 406);
delete e.node._htmlNode;
        }
    },

    _afterSelect: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterSelect", 410);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 411);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 412);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 415);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 417);
htmlNode.addClass(this.classNames.selected);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 419);
if (this.multiSelect) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 422);
htmlNode.set('aria-selected', true);
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 424);
htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterTreeViewMultiSelectChange", 428);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 429);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 430);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 433);
var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 437);
if (e.newVal) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 438);
rootList.set('aria-multiselectable', true);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 439);
htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 443);
rootList.removeAttribute('aria-multiselectable');
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 444);
htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterUnselect", 448);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 449);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 450);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 453);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 455);
htmlNode.removeClass(this.classNames.selected);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 457);
if (this.multiSelect) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 458);
htmlNode.set('aria-selected', false);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 461);
htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onIndicatorClick", 464);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 465);
var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 469);
e.stopImmediatePropagation();

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 471);
this.getNodeById(rowNode.getData('node-id')).toggle();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onMouseDown", 474);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 477);
e.preventDefault();
    },

    _onRowClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onRowClick", 480);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 481);
var node = this.getNodeById(e.currentTarget.getData('node-id'));

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 483);
if (this.multiSelect) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 484);
node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 486);
node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onRowDoubleClick", 490);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 491);
this.getNodeById(e.currentTarget.getData('node-id')).toggle();
    }
}, {
    ATTRS: {
        /**
        When `true`, a node's children won't be rendered until the first time
        that node is opened.

        This can significantly speed up the time it takes to render a large
        tree, but might not make sense if you're using CSS that doesn't hide the
        contents of closed nodes.

        @attribute {Boolean} lazyRender
        @default true
        **/
        lazyRender: {
            lazyAdd: false, // to ensure that the setter runs on init
            setter : '_setLazyRender',
            value  : true
        }
    }
});

_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 514);
Y.TreeView = Y.mix(TreeView, Y.TreeView);


}, '@VERSION@', {
    "requires": [
        "base-build",
        "classnamemanager",
        "gallery-sm-tree",
        "gallery-sm-treeview-templates",
        "view"
    ],
    "skinnable": true
});
