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
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].code=["YUI.add('gallery-sm-treeview', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Y.TreeView` widget.","","@module gallery-sm-treeview","@main gallery-sm-treeview","**/","","/**","TreeView widget.","","@class TreeView","@constructor","@extends View","@uses Tree","@uses Tree.Labelable","@uses Tree.Openable","@uses Tree.Selectable","**/","","var getClassName = Y.ClassNameManager.getClassName,","","TreeView = Y.Base.create('treeView', Y.View, [","    Y.Tree, Y.Tree.Labelable, Y.Tree.Openable, Y.Tree.Selectable","], {","    // -- Public Properties ----------------------------------------------------","","    /**","    CSS class names used by this treeview.","","    @property {Object} classNames","    @param {String} canHaveChildren Class name indicating that a tree node can","        contain child nodes (whether or not it actually does).","    @param {String} children Class name for a list of child nodes.","    @param {String} hasChildren Class name indicating that a tree node has one","        or more child nodes.","    @param {String} icon Class name for a tree node's icon.","    @param {String} indicator Class name for an open/closed indicator.","    @param {String} label Class name for a tree node's user-visible label.","    @param {String} node Class name for a tree node item.","    @param {String} noTouch Class name added to the TreeView container when not","        using a touchscreen device.","    @param {String} open Class name indicating that a tree node is open.","    @param {String} row Class name for a row container encompassing the","        indicator and label within a tree node.","    @param {String} selected Class name for a tree node that's selected.","    @param {String} touch Class name added to the TreeView container when using","        a touchscreen device.","    @param {String} treeview Class name for the TreeView container.","    **/","    classNames: {","        canHaveChildren: getClassName('treeview-can-have-children'),","        children       : getClassName('treeview-children'),","        hasChildren    : getClassName('treeview-has-children'),","        icon           : getClassName('treeview-icon'),","        indicator      : getClassName('treeview-indicator'),","        label          : getClassName('treeview-label'),","        node           : getClassName('treeview-node'),","        noTouch        : getClassName('treeview-notouch'),","        open           : getClassName('treeview-open'),","        row            : getClassName('treeview-row'),","        selected       : getClassName('treeview-selected'),","        touch          : getClassName('treeview-touch'),","        treeview       : getClassName('treeview')","    },","","    /**","    Whether or not this TreeView has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    /**","    Default templates used to render this TreeView.","","    @property {Object} templates","    **/","    templates: Y.TreeView.Templates,","","    // -- Protected Properties -------------------------------------------------","","    /**","    Simple way to type-check that this is a TreeView instance.","","    @property {Boolean} _isYUITreeView","    @default true","    @protected","    **/","    _isYUITreeView: true,","","    /**","    Cached value of the `lazyRender` attribute.","","    @property {Boolean} _lazyRender","    @protected","    **/","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function (config) {","        if (config && config.templates) {","            this.templates = Y.merge(this.templates, config.templates);","        }","","        this._attachTreeViewEvents();","    },","","    destructor: function () {","        this._detachTreeViewEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    `Tree.Node` instance, if any.","","    @method getHTMLNode","    @param {Tree.Node} treeNode Tree node.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (treeNode) {","        if (!treeNode._htmlNode) {","            treeNode._htmlNode = this.get('container').one('#' + treeNode.id);","        }","","        return treeNode._htmlNode;","    },","","    /**","    Renders this TreeView into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container     = this.get('container'),","            isTouchDevice = 'ontouchstart' in Y.config.win;","","        container.addClass(this.classNames.treeview);","        container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified tree node.","","    If a container is specified, it will be assumed to be an existing rendered","    tree node, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Tree.Node} treeNode Tree node whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children),","            lazyRender   = this._lazyRender;","","        if (!childrenNode) {","            childrenNode = Y.Node.create(this.templates.children({","                classNames: this.classNames,","                node      : treeNode,","                treeview  : this // not currently used, but may be useful for custom templates","            }));","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","","            for (var i = 0, len = treeNode.children.length; i < len; i++) {","                var child = treeNode.children[i];","","                this.renderNode(child, {","                    container     : childrenNode,","                    renderChildren: !lazyRender || child.isOpen()","                });","            }","        }","","        // Keep track of whether or not this node's children have been rendered","        // so we'll know whether we need to render them later if the node is","        // opened.","        treeNode.state.renderedChildren = true;","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified tree node and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Tree.Node} treeNode Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered tree node.","    **/","    renderNode: function (treeNode, options) {","        options || (options = {});","","        var classNames     = this.classNames,","            hasChildren    = treeNode.hasChildren(),","            htmlNode       = treeNode._htmlNode,","            nodeClassNames = {},","            className;","","        // Build the hash of CSS classes for this node.","        nodeClassNames[classNames.node]            = true;","        nodeClassNames[classNames.canHaveChildren] = !!treeNode.canHaveChildren;","        nodeClassNames[classNames.hasChildren]     = hasChildren;","        nodeClassNames[classNames.open]            = treeNode.isOpen();","","        if (htmlNode) {","            // This node has already been rendered, so we just need to update","            // the DOM instead of re-rendering it from scratch.","            htmlNode.one('.' + classNames.label).setHTML(treeNode.label);","","            for (className in nodeClassNames) {","                if (nodeClassNames.hasOwnProperty(className)) {","                    htmlNode.toggleClass(className, nodeClassNames[className]);","                }","            }","        } else {","            // This node hasn't been rendered yet, so render it from scratch.","            var enabledClassNames = [];","","            for (className in nodeClassNames) {","                if (nodeClassNames.hasOwnProperty(className) && nodeClassNames[className]) {","                    enabledClassNames.push(className);","                }","            }","","            htmlNode = treeNode._htmlNode = Y.Node.create(this.templates.node({","                classNames    : classNames,","                nodeClassNames: enabledClassNames,","                node          : treeNode,","                treeview      : this // not currently used, but may be useful for custom templates","            }));","        }","","        if (hasChildren && options.renderChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        treeNode.state.rendered = true;","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachTreeViewEvents: function () {","        this._treeViewEvents || (this._treeViewEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._treeViewEvents.push(","            // Custom events.","            this.after({","                add              : this._afterAdd,","                clear            : this._afterClear,","                close            : this._afterClose,","                multiSelectChange: this._afterTreeViewMultiSelectChange, // sheesh","                open             : this._afterOpen,","                remove           : this._afterRemove,","                select           : this._afterSelect,","                unselect         : this._afterUnselect","            }),","","            // DOM events.","            container.on('mousedown', this._onMouseDown, this),","","            container.delegate('click', this._onIndicatorClick, '.' + classNames.indicator, this),","            container.delegate('click', this._onRowClick, '.' + classNames.row, this),","            container.delegate('dblclick', this._onRowDoubleClick, '.' + classNames.canHaveChildren + ' > .' + classNames.row, this)","        );","    },","","    _detachTreeViewEvents: function () {","        (new Y.EventHandle(this._treeViewEvents)).detach();","    },","","    /**","    Setter for the `lazyRender` attribute.","","    Just caches the value in a property for faster lookups.","","    @method _setLazyRender","    @return {Boolean} Value.","    @protected","    **/","    _setLazyRender: function (value) {","        return this._lazyRender = value;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _afterAdd: function (e) {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            // Re-render the parent to update its state.","            htmlNode         = this.renderNode(parent);","            htmlChildrenNode = htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Children haven't yet been rendered. Render them.","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        // Parent's children have already been rendered. Instead of re-rendering","        // all of them, just render the new node and insert it at the correct","        // position.","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: !this._lazyRender || e.node.isOpen()","        }), e.index);","    },","","    _afterClear: function () {","        // Nothing to do if the treeview hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    _afterClose: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.open);","        htmlNode.set('aria-expanded', false);","    },","","    _afterOpen: function (e) {","        if (!this.rendered) {","            return;","        }","","        var treeNode = e.node,","            htmlNode = this.getHTMLNode(treeNode);","","        // If this node's children haven't been rendered yet, render them.","        if (!treeNode.state.renderedChildren) {","            this.renderChildren(treeNode, {","                container: htmlNode","            });","        }","","        htmlNode.addClass(this.classNames.open);","        htmlNode.set('aria-expanded', true);","    },","","    _afterRemove: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","","        // Re-render the parent to update its state in case this was its last","        // child.","        if (e.parent) {","            this.renderNode(e.parent);","        }","    },","","    _afterSelect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.addClass(this.classNames.selected);","","        if (this.get('multiSelect')) {","            // It's only necessary to set aria-selected when multi-selection is","            // enabled and focus can't be used to track the selection state.","            htmlNode.set('aria-selected', true);","        } else {","            htmlNode.set('tabIndex', 0).focus();","        }","    },","","    _afterTreeViewMultiSelectChange: function (e) {","        if (!this.rendered) {","            return;","        }","","        var container = this.get('container'),","            rootList  = container.one('> .' + this.classNames.children),","            htmlNodes = container.all('.' + this.classNames.node);","","        if (e.newVal) {","            rootList.set('aria-multiselectable', true);","            htmlNodes.set('aria-selected', false);","        } else {","            // When multiselect is disabled, aria-selected must not be set on","            // any nodes, since focus is used to indicate selection.","            rootList.removeAttribute('aria-multiselectable');","            htmlNodes.removeAttribute('aria-selected');","        }","    },","","    _afterUnselect: function (e) {","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        htmlNode.removeClass(this.classNames.selected);","","        if (this.get('multiSelect')) {","            htmlNode.set('aria-selected', false);","        }","","        htmlNode.removeAttribute('tabIndex');","    },","","    _onIndicatorClick: function (e) {","        var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);","","        // Indicator clicks shouldn't toggle selection state, so don't allow","        // this event to propagate to the _onRowClick() handler.","        e.stopImmediatePropagation();","","        this.getNodeById(rowNode.getData('node-id')).toggleOpen();","    },","","    _onMouseDown: function (e) {","        // This prevents the tree from momentarily grabbing focus before focus","        // is set on a node.","        e.preventDefault();","    },","","    _onRowClick: function (e) {","        var node = this.getNodeById(e.currentTarget.getData('node-id'));","","        if (this.get('multiSelect')) {","            node[node.isSelected() ? 'unselect' : 'select']();","        } else {","            node.select();","        }","    },","","    _onRowDoubleClick: function (e) {","        this.getNodeById(e.currentTarget.getData('node-id')).toggleOpen();","    }","}, {","    ATTRS: {","        /**","        When `true`, a node's children won't be rendered until the first time","        that node is opened.","","        This can significantly speed up the time it takes to render a large","        tree, but might not make sense if you're using CSS that doesn't hide the","        contents of closed nodes.","","        @attribute {Boolean} lazyRender","        @default true","        **/","        lazyRender: {","            lazyAdd: false, // to ensure that the setter runs on init","            setter : '_setLazyRender',","            value  : true","        }","    }","});","","Y.TreeView = Y.mix(TreeView, Y.TreeView);","","","}, '@VERSION@', {","    \"requires\": [","        \"base-build\",","        \"classnamemanager\",","        \"gallery-sm-treeview-templates\",","        \"tree\",","        \"tree-labelable\",","        \"tree-openable\",","        \"tree-selectable\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].lines = {"1":0,"24":0,"106":0,"107":0,"110":0,"114":0,"129":0,"130":0,"133":0,"146":0,"149":0,"150":0,"152":0,"156":0,"157":0,"160":0,"162":0,"180":0,"182":0,"186":0,"187":0,"194":0,"195":0,"197":0,"198":0,"200":0,"210":0,"212":0,"213":0,"216":0,"234":0,"236":0,"243":0,"244":0,"245":0,"246":0,"248":0,"251":0,"253":0,"254":0,"255":0,"260":0,"262":0,"263":0,"264":0,"268":0,"276":0,"277":0,"282":0,"284":0,"285":0,"288":0,"294":0,"296":0,"299":0,"322":0,"335":0,"342":0,"343":0,"346":0,"350":0,"351":0,"354":0,"355":0,"357":0,"359":0,"363":0,"370":0,"377":0,"378":0,"381":0,"382":0,"384":0,"385":0,"389":0,"390":0,"393":0,"395":0,"396":0,"400":0,"401":0,"404":0,"408":0,"409":0,"414":0,"415":0,"419":0,"420":0,"423":0,"425":0,"426":0,"427":0,"432":0,"433":0,"438":0,"439":0,"442":0,"444":0,"446":0,"449":0,"451":0,"456":0,"457":0,"460":0,"464":0,"465":0,"466":0,"470":0,"471":0,"476":0,"477":0,"480":0,"482":0,"484":0,"485":0,"488":0,"492":0,"496":0,"498":0,"504":0,"508":0,"510":0,"511":0,"513":0,"518":0,"541":0};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].functions = {"initializer:105":0,"destructor:113":0,"getHTMLNode:128":0,"render:145":0,"renderChildren:179":0,"renderNode:233":0,"_attachTreeViewEvents:293":0,"_detachTreeViewEvents:321":0,"_setLazyRender:334":0,"_afterAdd:340":0,"_afterClear:375":0,"_afterClose:388":0,"_afterOpen:399":0,"_afterRemove:418":0,"_afterSelect:437":0,"_afterTreeViewMultiSelectChange:455":0,"_afterUnselect:475":0,"_onIndicatorClick:491":0,"_onMouseDown:501":0,"_onRowClick:507":0,"_onRowDoubleClick:517":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-treeview/gallery-sm-treeview.js"].coveredLines = 126;
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
@uses Tree.Labelable
@uses Tree.Openable
@uses Tree.Selectable
**/

_yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 24);
var getClassName = Y.ClassNameManager.getClassName,

TreeView = Y.Base.create('treeView', Y.View, [
    Y.Tree, Y.Tree.Labelable, Y.Tree.Openable, Y.Tree.Selectable
], {
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

    /**
    Default templates used to render this TreeView.

    @property {Object} templates
    **/
    templates: Y.TreeView.Templates,

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

    initializer: function (config) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "initializer", 105);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 106);
if (config && config.templates) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 107);
this.templates = Y.merge(this.templates, config.templates);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 110);
this._attachTreeViewEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "destructor", 113);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 114);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "getHTMLNode", 128);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 129);
if (!treeNode._htmlNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 130);
treeNode._htmlNode = this.get('container').one('#' + treeNode.id);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 133);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "render", 145);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 146);
var container     = this.get('container'),
            isTouchDevice = 'ontouchstart' in Y.config.win;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 149);
container.addClass(this.classNames.treeview);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 150);
container.addClass(this.classNames[isTouchDevice ? 'touch' : 'noTouch']);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 152);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 156);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 157);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 160);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 162);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "renderChildren", 179);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 180);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 182);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children),
            lazyRender   = this._lazyRender;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 186);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 187);
childrenNode = Y.Node.create(this.templates.children({
                classNames: this.classNames,
                node      : treeNode,
                treeview  : this // not currently used, but may be useful for custom templates
            }));
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 194);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 195);
childrenNode.set('aria-expanded', treeNode.isOpen());

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 197);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 198);
var child = treeNode.children[i];

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 200);
this.renderNode(child, {
                    container     : childrenNode,
                    renderChildren: !lazyRender || child.isOpen()
                });
            }
        }

        // Keep track of whether or not this node's children have been rendered
        // so we'll know whether we need to render them later if the node is
        // opened.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 210);
treeNode.state.renderedChildren = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 212);
if (container) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 213);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 216);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "renderNode", 233);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 234);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 236);
var classNames     = this.classNames,
            hasChildren    = treeNode.hasChildren(),
            htmlNode       = treeNode._htmlNode,
            nodeClassNames = {},
            className;

        // Build the hash of CSS classes for this node.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 243);
nodeClassNames[classNames.node]            = true;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 244);
nodeClassNames[classNames.canHaveChildren] = !!treeNode.canHaveChildren;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 245);
nodeClassNames[classNames.hasChildren]     = hasChildren;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 246);
nodeClassNames[classNames.open]            = treeNode.isOpen();

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 248);
if (htmlNode) {
            // This node has already been rendered, so we just need to update
            // the DOM instead of re-rendering it from scratch.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 251);
htmlNode.one('.' + classNames.label).setHTML(treeNode.label);

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 253);
for (className in nodeClassNames) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 254);
if (nodeClassNames.hasOwnProperty(className)) {
                    _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 255);
htmlNode.toggleClass(className, nodeClassNames[className]);
                }
            }
        } else {
            // This node hasn't been rendered yet, so render it from scratch.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 260);
var enabledClassNames = [];

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 262);
for (className in nodeClassNames) {
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 263);
if (nodeClassNames.hasOwnProperty(className) && nodeClassNames[className]) {
                    _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 264);
enabledClassNames.push(className);
                }
            }

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 268);
htmlNode = treeNode._htmlNode = Y.Node.create(this.templates.node({
                classNames    : classNames,
                nodeClassNames: enabledClassNames,
                node          : treeNode,
                treeview      : this // not currently used, but may be useful for custom templates
            }));
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 276);
if (hasChildren && options.renderChildren) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 277);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 282);
treeNode.state.rendered = true;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 284);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 285);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 288);
return htmlNode;
    },

    // -- Protected Methods ----------------------------------------------------

    _attachTreeViewEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_attachTreeViewEvents", 293);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 294);
this._treeViewEvents || (this._treeViewEvents = []);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 296);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 299);
this._treeViewEvents.push(
            // Custom events.
            this.after({
                add              : this._afterAdd,
                clear            : this._afterClear,
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_detachTreeViewEvents", 321);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 322);
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
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_setLazyRender", 334);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 335);
return this._lazyRender = value;
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterAdd: function (e) {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterAdd", 340);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 342);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 343);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 346);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 350);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 351);
htmlChildrenNode = this._childrenNode;
        } else {
            // Re-render the parent to update its state.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 354);
htmlNode         = this.renderNode(parent);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 355);
htmlChildrenNode = htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 357);
if (!htmlChildrenNode) {
                // Children haven't yet been rendered. Render them.
                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 359);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 363);
return;
            }
        }

        // Parent's children have already been rendered. Instead of re-rendering
        // all of them, just render the new node and insert it at the correct
        // position.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 370);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: !this._lazyRender || e.node.isOpen()
        }), e.index);
    },

    _afterClear: function () {
        // Nothing to do if the treeview hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterClear", 375);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 377);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 378);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 381);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 382);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 384);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 385);
this.render();
    },

    _afterClose: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterClose", 388);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 389);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 390);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 393);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 395);
htmlNode.removeClass(this.classNames.open);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 396);
htmlNode.set('aria-expanded', false);
    },

    _afterOpen: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterOpen", 399);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 400);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 401);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 404);
var treeNode = e.node,
            htmlNode = this.getHTMLNode(treeNode);

        // If this node's children haven't been rendered yet, render them.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 408);
if (!treeNode.state.renderedChildren) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 409);
this.renderChildren(treeNode, {
                container: htmlNode
            });
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 414);
htmlNode.addClass(this.classNames.open);
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 415);
htmlNode.set('aria-expanded', true);
    },

    _afterRemove: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterRemove", 418);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 419);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 420);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 423);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 425);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 426);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 427);
delete e.node._htmlNode;
        }

        // Re-render the parent to update its state in case this was its last
        // child.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 432);
if (e.parent) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 433);
this.renderNode(e.parent);
        }
    },

    _afterSelect: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterSelect", 437);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 438);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 439);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 442);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 444);
htmlNode.addClass(this.classNames.selected);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 446);
if (this.get('multiSelect')) {
            // It's only necessary to set aria-selected when multi-selection is
            // enabled and focus can't be used to track the selection state.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 449);
htmlNode.set('aria-selected', true);
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 451);
htmlNode.set('tabIndex', 0).focus();
        }
    },

    _afterTreeViewMultiSelectChange: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterTreeViewMultiSelectChange", 455);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 456);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 457);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 460);
var container = this.get('container'),
            rootList  = container.one('> .' + this.classNames.children),
            htmlNodes = container.all('.' + this.classNames.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 464);
if (e.newVal) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 465);
rootList.set('aria-multiselectable', true);
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 466);
htmlNodes.set('aria-selected', false);
        } else {
            // When multiselect is disabled, aria-selected must not be set on
            // any nodes, since focus is used to indicate selection.
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 470);
rootList.removeAttribute('aria-multiselectable');
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 471);
htmlNodes.removeAttribute('aria-selected');
        }
    },

    _afterUnselect: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_afterUnselect", 475);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 476);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 477);
return;
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 480);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 482);
htmlNode.removeClass(this.classNames.selected);

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 484);
if (this.get('multiSelect')) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 485);
htmlNode.set('aria-selected', false);
        }

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 488);
htmlNode.removeAttribute('tabIndex');
    },

    _onIndicatorClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onIndicatorClick", 491);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 492);
var rowNode = e.currentTarget.ancestor('.' + this.classNames.row);

        // Indicator clicks shouldn't toggle selection state, so don't allow
        // this event to propagate to the _onRowClick() handler.
        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 496);
e.stopImmediatePropagation();

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 498);
this.getNodeById(rowNode.getData('node-id')).toggleOpen();
    },

    _onMouseDown: function (e) {
        // This prevents the tree from momentarily grabbing focus before focus
        // is set on a node.
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onMouseDown", 501);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 504);
e.preventDefault();
    },

    _onRowClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onRowClick", 507);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 508);
var node = this.getNodeById(e.currentTarget.getData('node-id'));

        _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 510);
if (this.get('multiSelect')) {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 511);
node[node.isSelected() ? 'unselect' : 'select']();
        } else {
            _yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 513);
node.select();
        }
    },

    _onRowDoubleClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-treeview/gallery-sm-treeview.js", "_onRowDoubleClick", 517);
_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 518);
this.getNodeById(e.currentTarget.getData('node-id')).toggleOpen();
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

_yuitest_coverline("build/gallery-sm-treeview/gallery-sm-treeview.js", 541);
Y.TreeView = Y.mix(TreeView, Y.TreeView);


}, '@VERSION@', {
    "requires": [
        "base-build",
        "classnamemanager",
        "gallery-sm-treeview-templates",
        "tree",
        "tree-labelable",
        "tree-openable",
        "tree-selectable",
        "view"
    ],
    "skinnable": true
});
