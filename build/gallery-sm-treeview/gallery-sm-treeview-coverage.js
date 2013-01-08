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
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].code=["YUI.add('gallery-sm-treeview', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Y.TreeView` widget.","","@module gallery-sm-treeview","@main gallery-sm-treeview","**/","","/**","TreeView widget.","","@class TreeView","@constructor","@extends View","@uses Tree","@uses Tree.Openable","@uses Tree.Selectable","**/","","var getClassName = Y.ClassNameManager.getClassName,","","TreeView = Y.Base.create('treeView', Y.View, [Y.Tree, Y.Tree.Openable, Y.Tree.Selectable], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this treeview.","","    @property {Object} classNames","    @param {String} canHaveChildren Class name indicating that a tree node can","        contain child nodes (whether or not it actually does).","    @param {String} children Class name for a list of child nodes.","    @param {String} hasChildren Class name indicating that a tree node has one","        or more child nodes.","    @param {String} icon Class name for a tree node's icon.","    @param {String} indicator Class name for an open/closed indicator.","    @param {String} label Class name for a tree node's user-visible label.","    @param {String} node Class name for a tree node item.","    @param {String} noTouch Class name added to the TreeView container when not","        using a touchscreen device.","    @param {String} open Class name indicating that a tree node is open.","    @param {String} row Class name for a row container encompassing the","        indicator and label within a tree node.","    @param {String} selected Class name for a tree node that's selected.","    @param {String} touch Class name added to the TreeView container when using","        a touchscreen device.","    @param {String} treeview Class name for the TreeView container.","    **/","    classNames: {","        canHaveChildren: getClassName('treeview-can-have-children'),","        children       : getClassName('treeview-children'),","        hasChildren    : getClassName('treeview-has-children'),","        icon           : getClassName('treeview-icon'),","        indicator      : getClassName('treeview-indicator'),","        label          : getClassName('treeview-label'),","        node           : getClassName('treeview-node'),","        noTouch        : getClassName('treeview-notouch'),","        open           : getClassName('treeview-open'),","        row            : getClassName('treeview-row'),","        selected       : getClassName('treeview-selected'),","        touch          : getClassName('treeview-touch'),","        treeview       : getClassName('treeview')","    },","","    /**","    Whether or not this TreeView has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView instance.","","    @property {Boolean} _isYUITreeView","    @default true","    @protected","    **/","    _isYUITreeView: true,","","    /**","    Cached value of the `lazyRender` attribute.","","    @property {Boolean} _lazyRender","    @protected","    **/","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._attachTreeViewEvents();","    },","","    destructor: function () {","        this._detachTreeViewEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    `Tree.Node` instance, if any.","","    @method getHTMLNode","    @param {Tree.Node} treeNode Tree node.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (treeNode) {","        if (!treeNode._htmlNode) {","            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);","        }","","        return treeNode._htmlNode;","    },","","    /**","    Renders this TreeView into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container     = this.get('container'),","            isTouchDevice = 'ontouchstart' in Y.config.win;","","        container.addClass(this.classNames.treeview);","        container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified tree node.","","    If a container is specified, it will be assumed to be an existing rendered","    tree node, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Tree.Node} treeNode Tree node whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children),","            lazyRender   = this._lazyRender;","","        if (!childrenNode) {","            childrenNode = Y.Node.create(TreeView.Templates.children({","                classNames: this.classNames,","                node      : treeNode,","                treeview  : this // not currently used, but may be useful for custom templates","            }));","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","","            for (var i = 0, len = treeNode.children.length; i < len; i++) {","                var child = treeNode.children[i];","","                this.renderNode(child, {","                    container     : childrenNode,","                    renderChildren: !lazyRender || child.isOpen()","                });","            }","        }","","        // Keep track of whether or not this node's children have been rendered","        // so we'll know whether we need to render them later if the node is","        // opened.","        treeNode.state.renderedChildren = true;","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified tree node and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Tree.Node} treeNode Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered tree node.","    **/","    renderNode: function (treeNode, options) {","        options || (options = {});","","        var classNames     = this.classNames,","            hasChildren    = treeNode.hasChildren(),","            htmlNode       = treeNode._htmlNode,","            nodeClassNames = {},","            className;","","        // Build the hash of CSS classes for this node.","        nodeClassNames[classNames.node]            = true;","        nodeClassNames[classNames.canHaveChildren] = !!treeNode.canHaveChildren;","        nodeClassNames[classNames.hasChildren]     = hasChildren;","        nodeClassNames[classNames.open]            = treeNode.isOpen();","","        if (htmlNode) {","            // This node has already been rendered, so we just need to update","            // the DOM instead of re-rendering it from scratch.","            htmlNode.one('.' + classNames.label).setHTML(treeNode.label);","","            for (className in nodeClassNames) {","                if (nodeClassNames.hasOwnProperty(className)) {","                    htmlNode.toggleClass(className, nodeClassNames[className]);","                }","            }","        } else {","            // This node hasn't been rendered yet, so render it from scratch.","            var enabledClassNames = [];","","            for (className in nodeClassNames) {","                if (nodeClassNames.hasOwnProperty(className) && nodeClassNames[className]) {","                    enabledClassNames.push(className);","                }","            }","","            htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({","                classNames    : classNames,","                nodeClassNames: enabledClassNames,","                node          : treeNode,","                treeview      : this // not currently used, but may be useful for custom templates","            }));","        }","","        if (hasChildren && options.renderChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        treeNode.state.rendered = true;","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachTreeViewEvents: function () {","        this._treeViewEvents || (this._treeViewEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._treeViewEvents.push(","            // Custom events.","            this.after({","                add              : this._afterAdd,","                close            : this._afterClose,","                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh","                open             : this._afterOpen,","                remove           : this._afterRemove,","                select           : this._afterSelect,","                unselect         : this._afterUnselect","            }),","","            // DOM events.","            container.on('mousedown', this._onMouseDown, this),","","            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),","            container.delegate('click', this._onRowClick, '.' + classNames.row, this),","            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)","        );","    },","","    _detachTreeViewEvents: function () {","        (new Y.EventHandle(this._treeViewEvents)).detach();","    },","","    /**","    Setter for the `lazyRender` attribute.","","    Just caches the value in a property for faster lookups.","","    @method _setLazyRender","    @return {Boolean} Value.","    @protected","    **/","    _setLazyRender: function (value) {","        return this._lazyRender = value;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            // Re-render the parent to update its state.","            htmlNode         = this.renderNode(parent);","            htmlChildrenNode = htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Children haven't yet been rendered. Render them.","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        // Parent's children have already been rendered. Instead of re-rendering","        // all of them, just render the new node and insert it at the correct","        // position.","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: !this._lazyRender || e.node.isOpen()","        }), e.index);","    },","","    _afterClear: function () {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.open);","        htmlNode.set('aria-expanded', false);","    },","","    _afterOpen: function (e) {","        if (!this.rendered) {","            return;","        }","","        var treeNode = e.node,","            htmlNode = this.getHTMLNode(treeNode);","","        // If this node's children haven't been rendered yet, render them.","        if (!treeNode.state.renderedChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        htmlNode.addClass(this.classNames.open);","        htmlNode.set('aria-expanded', true);","    },","","    _afterRemove: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","","        // Re-render the parent to update its state in case this was its last","        // child.","        if (e.parent) {","            this.renderNode(e.parent);","        }","    },","","    _afterSelect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.selected);","","        if (this.get('multiSelect')) {","            // It's only necessary to set aria-selected when multi-selection is","            // enabled and focus can't be used to track the selection state.","            htmlNode.set('aria-selected', true);","        } else {","            htmlNode.set('tabIndex', 0).focus();","        }","    },","","    _afterTreeViewMultiSelectChange: function (e) {","        if (!this.rendered) {","            return;","        }","","        var container = this.get('container'),","            rootList  = container.one('> .' + this.classNames.children),","            htmlNodes = container.all('.' + this.classNames.node);","","        if (e.newVal) {","            rootList.set('aria-multiselectable', true);","            htmlNodes.set('aria-selected', false);","        } else {","            // When multiselect is disabled, aria-selected must not be set on","            // any nodes, since focus is used to indicate selection.","            rootList.removeAttribute('aria-multiselectable');","            htmlNodes.removeAttribute('aria-selected');","        }","    },","","    _afterUnselect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.selected);","","        if (this.get('multiSelect')) {","            htmlNode.set('aria-selected', false);","        }","","        htmlNode.removeAttribute('tabIndex');","    },","","    _onIndicatorClick: function (e) {","        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);","","        // Indicator clicks shouldn't toggle selection state, so don't allow","        // this event to propagate to the _onRowClick() handler.","        e.stopImmediatePropagation();","","        this.getNodeById(rowNode.getData('node-id')).toggle();","    },","","    _onMouseDown: function (e) {","        // This prevents the tree from momentarily grabbing focus before focus","        // is set on a node.","        e.preventDefault();","    },","","    _onRowClick: function (e) {","        var node = this.getNodeById(e.currentTarget.getData('node-id'));","","        if (this.get('multiSelect')) {","            node[node.isSelected() ? 'unselect' : 'select']();","        } else {","            node.select();","        }","    },","","    _onRowDoubleClick: function (e) {","        this.getNodeById(e.currentTarget.getData('node-id')).toggle();","    }","}, {","    ATTRS: {","        /**","        When `true`, a node's children won't be rendered until the first time","        that node is opened.","","        This can significantly speed up the time it takes to render a large","        tree, but might not make sense if you're using CSS that doesn't hide the","        contents of closed nodes.","","        @attribute {Boolean} lazyRender","        @default true","        **/","        lazyRender: {","            lazyAdd: false, // to ensure that the setter runs on init","            setter : '_setLazyRender',","            value  : true","        }","    }","});","","Y.TreeView = Y.mix(TreeView, Y.TreeView);","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"gallery-sm-tree\",","        \"gallery-sm-tree-openable\",","        \"gallery-sm-tree-selectable\",","        \"gallery-sm-treeview-templates\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].lines = {"1":0,"23":0,"96":0,"100":0,"115":0,"116":0,"119":0,"132":0,"135":0,"136":0,"138":0,"142":0,"143":0,"146":0,"148":0,"166":0,"168":0,"172":0,"173":0,"180":0,"181":0,"183":0,"184":0,"186":0,"196":0,"198":0,"199":0,"202":0,"220":0,"222":0,"229":0,"230":0,"231":0,"232":0,"234":0,"237":0,"239":0,"240":0,"241":0,"246":0,"248":0,"249":0,"250":0,"254":0,"262":0,"263":0,"268":0,"270":0,"271":0,"274":0,"280":0,"282":0,"285":0,"307":0,"320":0,"327":0,"328":0,"331":0,"335":0,"336":0,"339":0,"340":0,"342":0,"344":0,"348":0,"355":0,"362":0,"363":0,"366":0,"367":0,"369":0,"370":0,"374":0,"375":0,"378":0,"380":0,"381":0,"385":0,"386":0,"389":0,"393":0,"394":0,"399":0,"400":0,"404":0,"405":0,"408":0,"410":0,"411":0,"412":0,"417":0,"418":0,"423":0,"424":0,"427":0,"429":0,"431":0,"434":0,"436":0,"441":0,"442":0,"445":0,"449":0,"450":0,"451":0,"455":0,"456":0,"461":0,"462":0,"465":0,"467":0,"469":0,"470":0,"473":0,"477":0,"481":0,"483":0,"489":0,"493":0,"495":0,"496":0,"498":0,"503":0,"526":0};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].functions = {"initializer:95":0,"destructor:99":0,"getHTMLNode:114":0,"render:131":0,"renderChildren:165":0,"renderNode:219":0,"_attachTreeViewEvents:279":0,"_detachTreeViewEvents:306":0,"_setLazyRender:319":0,"_afterAdd:325":0,"_afterClear:360":0,"_afterClose:373":0,"_afterOpen:384":0,"_afterRemove:403":0,"_afterSelect:422":0,"_afterTreeViewMultiSelectChange:440":0,"_afterUnselect:460":0,"_onIndicatorClick:476":0,"_onMouseDown:486":0,"_onRowClick:492":0,"_onRowDoubleClick:502":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].coveredLines = 124;
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].coveredFunctions = 22;
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 1);
YUI.add('gallery-sm-treeview', function (Y, NAME) {

/*jshint expr:true, onevar:false */

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
@uses Tree.Openable
@uses Tree.Selectable
**/

_yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 23);
var getClassName = Y.ClassNameManager.getClassName,

TreeView = Y.Base.create('treeView', Y.View, [Y.Tree, Y.Tree.Openable, Y.Tree.Selectable], {
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "initializer", 95);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 96);
this._attachTreeViewEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "destructor", 99);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 100);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "getHTMLNode", 114);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 115);
if (!treeNode._htmlNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 116);
treeNode._htmlNode = this.get('container').one('#' + treeNode.id);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 119);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "render", 131);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 132);
var container     = this.get('container'),
            isTouchDevice = 'ontouchstart' in Y.config.win;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 135);
container.addClass(this.classNames.treeview);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 136);
container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 138);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 142);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 143);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 146);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 148);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "renderChildren", 165);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 166);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 168);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children),
            lazyRender   = this._lazyRender;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 172);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 173);
childrenNode = Y.Node.create(TreeView.Templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this // not currently used, but may be useful for custom templates
            }));
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 180);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 181);
childrenNode.set('aria-expanded', treeNode.isOpen());

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 183);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 184);
var child = treeNode.children[i];

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 186);
this.renderNode(child, {
                    container     : childrenNode,
                    renderChildren: !lazyRender || child.isOpen()
                });
            }
        }

        // Keep track of whether or not this node's children have been rendered
        // so we'll know whether we need to render them later if the node is
        // opened.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 196);
treeNode.state.renderedChildren = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 198);
if (container) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 199);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 202);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "renderNode", 219);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 220);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 222);
var classNames     = this.classNames,
            hasChildren    = treeNode.hasChildren(),
            htmlNode       = treeNode._htmlNode,
            nodeClassNames = {},
            className;

        // Build the hash of CSS classes for this node.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 229);
nodeClassNames[classNames.node]            = true;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 230);
nodeClassNames[classNames.canHaveChildren] = !!treeNode.canHaveChildren;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 231);
nodeClassNames[classNames.hasChildren]     = hasChildren;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 232);
nodeClassNames[classNames.open]            = treeNode.isOpen();

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 234);
if (htmlNode) {
            // This node has already been rendered, so we just need to update
            // the DOM instead of re-rendering it from scratch.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 237);
htmlNode.one('.' + classNames.label).setHTML(treeNode.label);

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 239);
for (className in nodeClassNames) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 240);
if (nodeClassNames.hasOwnProperty(className)) {
                    _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 241);
htmlNode.toggleClass(className, nodeClassNames[className]);
                }
            }
        } else {
            // This node hasn't been rendered yet, so render it from scratch.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 246);
var enabledClassNames = [];

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 248);
for (className in nodeClassNames) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 249);
if (nodeClassNames.hasOwnProperty(className) && nodeClassNames[className]) {
                    _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 250);
enabledClassNames.push(className);
                }
            }

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 254);
htmlNode = treeNode._htmlNode = Y.Node.create(TreeView.Templates.node({
                classNames    : classNames,
                nodeClassNames: enabledClassNames,
                node          : treeNode,
                treeview      : this // not currently used, but may be useful for custom templates
            }));
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 262);
if (hasChildren && options.renderChildren) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 263);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 268);
treeNode.state.rendered = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 270);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 271);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 274);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_attachTreeViewEvents", 279);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 280);
this._treeViewEvents || (this._treeViewEvents = []);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 282);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 285);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_detachTreeViewEvents", 306);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 307);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_setLazyRender", 319);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 320);
return this._lazyRender = value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterAdd", 325);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 327);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 328);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 331);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 335);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 336);
htmlChildrenNode = this._childrenNode;
        } else {
            // Re-render the parent to update its state.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 339);
htmlNode         = this.renderNode(parent);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 340);
htmlChildrenNode = htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 342);
if (!htmlChildrenNode) {
                // Children haven't yet been rendered. Render them.
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 344);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 348);
return;
            }
        }

        // Parent's children have already been rendered. Instead of re-rendering
        // all of them, just render the new node and insert it at the correct
        // position.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 355);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: !this._lazyRender || e.node.isOpen()
        }), e.index);
    },

    _afterClear: function () {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterClear", 360);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 362);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 363);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 366);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 367);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 369);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 370);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterClose", 373);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 374);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 375);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 378);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 380);
htmlNode.removeClass(this.classNames.open);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 381);
htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterOpen", 384);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 385);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 386);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 389);
var treeNode = e.node,
            htmlNode = this.getHTMLNode(treeNode);

        // If this node's children haven't been rendered yet, render them.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 393);
if (!treeNode.state.renderedChildren) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 394);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 399);
htmlNode.addClass(this.classNames.open);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 400);
htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterRemove", 403);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 404);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 405);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 408);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 410);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 411);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 412);
delete e.node._htmlNode;
        }

        // Re-render the parent to update its state in case this was its last
        // child.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 417);
if (e.parent) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 418);
this.renderNode(e.parent);
        }
    },

    _afterSelect: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterSelect", 422);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 423);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 424);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 427);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 429);
htmlNode.addClass(this.classNames.selected);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 431);
if (this.get('multiSelect')) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 434);
htmlNode.set('aria-selected', true);
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 436);
htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterTreeViewMultiSelectChange", 440);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 441);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 442);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 445);
var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 449);
if (e.newVal) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 450);
rootList.set('aria-multiselectable', true);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 451);
htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 455);
rootList.removeAttribute('aria-multiselectable');
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 456);
htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterUnselect", 460);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 461);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 462);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 465);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 467);
htmlNode.removeClass(this.classNames.selected);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 469);
if (this.get('multiSelect')) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 470);
htmlNode.set('aria-selected', false);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 473);
htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onIndicatorClick", 476);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 477);
var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 481);
e.stopImmediatePropagation();

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 483);
this.getNodeById(rowNode.getData('node-id')).toggle();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onMouseDown", 486);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 489);
e.preventDefault();
    },

    _onRowClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onRowClick", 492);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 493);
var node = this.getNodeById(e.currentTarget.getData('node-id'));

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 495);
if (this.get('multiSelect')) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 496);
node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 498);
node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onRowDoubleClick", 502);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 503);
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

_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 526);
Y.TreeView = Y.mix(TreeView, Y.TreeView);


}, '@VERSION@', {
    "requires": [
        "base-build",
        "classnamemanager",
        "gallery-sm-tree",
        "gallery-sm-tree-openable",
        "gallery-sm-tree-selectable",
        "gallery-sm-treeview-templates",
        "view"
    ],
    "skinnable": true
});
