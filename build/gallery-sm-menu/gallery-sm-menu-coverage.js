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
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-menu/gallery-sm-menu.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].code=["YUI.add('gallery-sm-menu', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Y.Menu` widget.","","@module gallery-sm-menu","@main gallery-sm-menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@param {Object} [config] Config options.","@param {HTMLElement|Node|String} [config.sourceNode] Node instance, HTML","    element, or selector string for a node (usually a `<ul>` or `<ol>`) whose","    structure should be parsed and used to generate this menu's contents. This","    node will be removed from the DOM after being parsed.","@extends Menu.Base","@uses View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","var EVT_ITEM_CLICK = 'itemClick';","","var Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        hidden         : getClassName('menu-hidden'),","        horizontal     : getClassName('menu-horizontal'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch'),","        vertical       : getClassName('menu-vertical')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    /**","    Selectors to use when parsing a menu structure from a DOM structure via","    `parseHTML()`.","","    @property {Object} sourceSelectors","    **/","    sourceSelectors: {","        item   : '> li',","        label  : '> a, > span',","        subtree: '> ul, > ol'","    },","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function (config) {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        if (config && config.sourceNode) {","            config.nodes = (config.nodes || []).concat(","                this.parseHTML(config.sourceNode));","","            Y.one(config.sourceNode).remove(true);","        }","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Parses the specified HTML _sourceNode_ as a menu structure and returns an","    array of menu item objects that can be used to generate a menu with that","    structure.","","    By default, _sourceNode_ is expected to contain one `<li>` element per","    menu item, and submenus are expected to be represented by `<ul>` or `<ol>`","    elements.","","    The selector queries used to parse the menu structure are contained in the","    `sourceSelectors` property, and may be customized. Class names specified in","    the `classNames` property are used to determine whether a menu item should","    be disabled, hidden, or treated as a heading or separator.","","    @method parseHTML","    @param {HTMLElement|Node|String} sourceNode Node instance, HTML element, or","        selector string for the node (usually a `<ul> or `<ol>` element) to","        parse.","    @return {Object[]} Array of menu item objects.","    **/","    parseHTML: function (sourceNode) {","        sourceNode = Y.one(sourceNode);","","        var classNames = this.classNames,","            items      = [],","            sel        = this.sourceSelectors,","            self       = this;","","        sourceNode.all(sel.item).each(function (itemNode) {","            var item        = {},","                itemEl      = itemNode._node,","                labelNode   = itemNode.one(sel.label),","                subTreeNode = itemNode.one(sel.subtree);","","            if (itemNode.hasClass(classNames.heading)) {","                item.type = 'heading';","            } else if (itemNode.hasClass(classNames.separator)) {","                item.type = 'separator';","            }","","            if (itemNode.hasClass(classNames.disabled)) {","                item.state || (item.state = {});","                item.state.disabled = true;","            }","","            if (itemNode.hasClass(classNames.hidden)) {","                item.state || (item.state = {});","                item.state.hidden = true;","            }","","            if (labelNode) {","                var href = labelNode.getAttribute('href');","","                item.label = labelNode.getHTML();","","                if (href && href !== '#') {","                    item.url = href;","                }","            } else {","                // The selector didn't find a label node, so look for the first","                // text child of the item element.","                var childEl;","","                for (var i = 0, len = itemEl.childNodes.length; i < len; i++) {","                    childEl = itemEl.childNodes[i];","","                    if (childEl.nodeType === doc.TEXT_NODE) {","                        item.label = Y.Escape.html(childEl.nodeValue);","                        break;","                    }","                }","            }","","            if (subTreeNode) {","                item.children = self.parseHTML(subTreeNode);","            }","","            items.push(item);","        });","","        return items;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var classNames = this.classNames,","            container  = this.get('container');","","        container.addClass(classNames.menu);","        container.addClass(classNames[this.get('orientation')]);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(classNames.touch);","        } else {","            container.addClass(classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode,","            isHidden   = item.isHidden();","","        // Create an HTML node for this menu item if one doesn't already exist.","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        // Mark the HTML node as hidden if the item is hidden.","        htmlNode.set('aria-hidden', isHidden);","        htmlNode.toggleClass(classNames.hidden, isHidden);","","        switch (item.type) {","        case 'separator':","            htmlNode.set('role', 'separator');","            break;","","        case 'item':","        case 'heading':","            var labelNode = htmlNode.one('.' + classNames.label),","                labelId   = labelNode.get('id');","","            labelNode.setHTML(item.label);","","            if (!labelId) {","                labelId = Y.guid();","                labelNode.set('id', labelId);","            }","","            htmlNode.set('aria-labelledby', labelId);","","            if (item.type === 'heading') {","                htmlNode.set('role', 'heading');","            } else {","                htmlNode.set('role', 'menuitem');","","                htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                if (item.canHaveChildren) {","                    htmlNode.addClass(classNames.canHaveChildren);","                    htmlNode.toggleClass(classNames.open, item.isOpen());","","                    if (item.hasChildren()) {","                        htmlNode.addClass(classNames.hasChildren);","","                        if (options.renderChildren) {","                            this.renderChildren(item, {","                                container: htmlNode","                            });","                        }","                    }","                }","            }","            break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    @method reposition","    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        var container = this.get('container'),","            anchorRegion, menuRegion;","","        if (Y.Lang.isArray(anchorPoint)) {","            anchorRegion = {","                bottom: anchorPoint[1],","                left  : anchorPoint[0],","                right : anchorPoint[0],","                top   : anchorPoint[1]","            };","        } else if (anchorPoint._node) {","            anchorRegion = anchorPoint.get('region');","        } else {","            anchorRegion = anchorPoint;","        }","","        menuRegion = this._getSortedAnchorRegions(","            this.get('alignments'),","            container.get('region'),","            anchorRegion","        )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    /**","    Shows this menu.","","    @method show","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    show: function (options) {","        if (options && options.anchorPoint) {","            this.reposition(options.anchorPoint);","        }","","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggleVisible","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    toggleVisible: function (options) {","        return this[this.get('visible') ? 'hide' : 'show'](options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add              : this._afterAdd,","                clear            : this._afterClear,","                close            : this._afterClose,","                disable          : this._afterDisable,","                enable           : this._afterEnable,","                hide             : this._afterHide,","                open             : this._afterOpen,","                orientationChange: this._afterOrientationChange,","                remove           : this._afterRemove,","                show             : this._afterShow,","                visibleChange    : this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),","","            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Returns an efficient test function that can be passed to `Y.Node#ancestor()`","    to test whether a node is this menu's container.","","    This is broken out to make overriding easier in subclasses.","","    @method _getAncestorTestFn","    @return {Function} Test function.","    @protected","    **/","    _getAncestorTestFn: function () {","        var container = this.get('container');","","        return function (node) {","            return node === container;","        };","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides the specified menu container by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","            orientation  = this.get('orientation'),","            alignments, anchors;","","        // If this is a top-level submenu and this menu is horizontally","        // aligned, use `alignments`.","        if (item.parent.isRoot() && orientation === 'horizontal') {","            alignments = this.get('alignments');","        } else {","            // If this menu has a parent and the parent has stored alignment","            // anchors, use those. Otherwise, use `subMenuAlignments`.","            alignments = (item.parent && item.parent.data.menuAnchors) ||","                this.get('subMenuAlignments');","        }","","        anchors = this._getSortedAnchorRegions(alignments,","            childrenNode.get('region'), htmlNode.get('region'));","","        if (orientation === 'vertical' || !item.parent.isRoot()) {","            // Remember which anchors we used for this item so that we can","            // default that anchor for submenus of this item if necessary.","            item.data.menuAnchors = anchors;","        }","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `mousedown` events on the document.","","    @method _afterDocMouseDown","    @param {EventFacade} e","    @protected","    **/","    _afterDocMouseDown: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        if (!e.target.ancestor(this._getAncestorTestFn(), true)) {","            this.closeSubMenus();","","            if (this.get('hideOnOutsideClick')) {","                this.hide();","            }","        }","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `disable` events for this menu.","","    @method _afterDisable","    @param {EventFacade} e","    @protected","    **/","    _afterDisable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `enable` events for this menu.","","    @method _afterEnable","    @param {EventFacade} e","    @protected","    **/","    _afterEnable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `hide` events for this menu.","","    @method _afterHide","    @param {EventFacade} e","    @protected","    **/","    _afterHide: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', true);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `orientationChange` events for this menu.","","    @method _afterOrientationChange","    @param {EventFacade} e","    @protected","    **/","    _afterOrientationChange: function (e) {","        if (this.rendered) {","            this.get('container')","                .removeClass(this.classNames.horizontal)","                .removeClass(this.classNames.vertical)","                .addClass(this.classNames[e.newVal]);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `show` events for this menu.","","    @method _afterShow","    @param {EventFacade} e","    @protected","    **/","    _afterShow: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', false);","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        var container = this.get('container');","","        container.toggleClass(this.classNames.open, e.newVal);","","        // Ensure that the container doesn't take up space when it's not","        // visible. We have to manually remove the style attribute because it's","        // set when the menu is positioned, and it overrides CSS.","        if (!e.newVal) {","            container.removeAttribute('style');","        }","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled() || item.isHidden();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            });","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen() || item.isDisabled()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","","            if (self.get('hideOnMouseLeave')) {","                self.hide();","            }","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggleOpen();","        } else if (this.get('hideOnClick')) {","            this.closeSubMenus();","            this.hide();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Preferred alignment positions at which this menu should be displayed","        relative to the anchor point when one is provided to the `show()`,","        `toggle()`, or `reposition()` methods.","","        The most optimal alignment position will be chosen automatically based","        on which one allows the most of this menu to be visible within the","        browser's viewport. If multiple positions are equally visible, then the","        optimal position will be chosen based on its order in this array.","","        An alignment position is a string like \"tl-bl\", which means \"align the","        top left of this menu to the bottom left of its anchor point\".","","        Any combination of top/bottom/left/right alignment positions may be used","        as long as they follow this format. Here are a few examples:","","          * `'bl-br'`: Align the bottom left of this menu with the bottom right","            of the anchor point.","          * `'br-bl'`: Align the bottom right of this menu with the bottom left","            of the anchor point.","          * `'tl-tr'`: Align the top left of this menu with the top right of","            the anchor point.","          * `'tr-tl'`: Align the top right of this menu to the top left of this","            anchor point.","","        @attribute {String[]} alignments","        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']","        **/","        alignments: {","            valueFn: function () {","                return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];","            }","        },","","        /**","        If `true`, this menu will be hidden when the user clicks on a menu item","        that doesn't contain a submenu.","","        @attribute {Boolean} hideOnClick","        @default true","        **/","        hideOnClick: {","            value: true","        },","","        /**","        If `true`, this menu will be hidden when the user moves the mouse","        outside the menu.","","        @attribute {Boolean} hideOnMouseLeave","        @default false","        **/","        hideOnMouseLeave: {","            value: false","        },","","        /**","        If `true`, this menu will be hidden when the user clicks somewhere","        outside the menu.","","        @attribute {Boolean} hideOnOutsideClick","        @default true","        **/","        hideOnOutsideClick: {","            value: true","        },","","        /**","        Orientation of this menu. May be either `'vertical'` or `'horizontal'`.","","        @attribute {String} orientation","        @default 'vertical'","        **/","        orientation: {","            value: 'vertical'","        },","","        /**","        Just like `alignments`, but for submenus of this menu. See the","        `alignments` attribute for details on how alignment positions work.","","        @attribute {String[]} subMenuAlignments","        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']","        **/","        subMenuAlignments: {","            valueFn: function () {","                return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];","            }","        },","","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {","    \"requires\": [","        \"classnamemanager\",","        \"escape\",","        \"event-hover\",","        \"gallery-sm-menu-base\",","        \"gallery-sm-menu-templates\",","        \"node-screen\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].lines = {"1":0,"26":0,"40":0,"42":0,"91":0,"92":0,"93":0,"95":0,"96":0,"99":0,"102":0,"106":0,"108":0,"109":0,"111":0,"112":0,"115":0,"130":0,"131":0,"134":0,"144":0,"145":0,"169":0,"171":0,"176":0,"177":0,"182":0,"183":0,"184":0,"185":0,"188":0,"189":0,"190":0,"193":0,"194":0,"195":0,"198":0,"199":0,"201":0,"203":0,"204":0,"209":0,"211":0,"212":0,"214":0,"215":0,"216":0,"221":0,"222":0,"225":0,"228":0,"241":0,"244":0,"245":0,"248":0,"249":0,"251":0,"254":0,"258":0,"259":0,"262":0,"264":0,"282":0,"284":0,"287":0,"288":0,"295":0,"296":0,"297":0,"300":0,"301":0,"304":0,"305":0,"311":0,"312":0,"315":0,"333":0,"335":0,"340":0,"341":0,"349":0,"350":0,"352":0,"354":0,"355":0,"359":0,"362":0,"364":0,"365":0,"366":0,"369":0,"371":0,"372":0,"374":0,"376":0,"378":0,"379":0,"380":0,"382":0,"383":0,"385":0,"386":0,"393":0,"396":0,"397":0,"400":0,"418":0,"421":0,"422":0,"428":0,"429":0,"431":0,"434":0,"440":0,"442":0,"457":0,"458":0,"461":0,"462":0,"478":0,"490":0,"492":0,"495":0,"526":0,"540":0,"542":0,"543":0,"578":0,"580":0,"581":0,"588":0,"589":0,"592":0,"593":0,"594":0,"595":0,"597":0,"601":0,"606":0,"609":0,"610":0,"613":0,"614":0,"617":0,"619":0,"628":0,"629":0,"630":0,"631":0,"632":0,"633":0,"634":0,"636":0,"641":0,"653":0,"655":0,"657":0,"658":0,"676":0,"682":0,"688":0,"707":0,"709":0,"715":0,"716":0,"720":0,"724":0,"727":0,"730":0,"734":0,"735":0,"749":0,"750":0,"753":0,"757":0,"758":0,"760":0,"761":0,"763":0,"766":0,"768":0,"772":0,"776":0,"788":0,"791":0,"792":0,"795":0,"796":0,"798":0,"799":0,"810":0,"811":0,"814":0,"815":0,"817":0,"818":0,"831":0,"835":0,"836":0,"839":0,"840":0,"842":0,"843":0,"844":0,"856":0,"858":0,"859":0,"871":0,"873":0,"874":0,"886":0,"888":0,"889":0,"890":0,"902":0,"907":0,"911":0,"912":0,"913":0,"915":0,"916":0,"921":0,"925":0,"927":0,"928":0,"929":0,"941":0,"942":0,"957":0,"959":0,"960":0,"963":0,"965":0,"966":0,"967":0,"979":0,"981":0,"982":0,"983":0,"995":0,"997":0,"1002":0,"1003":0,"1015":0,"1021":0,"1022":0,"1025":0,"1026":0,"1029":0,"1030":0,"1035":0,"1036":0,"1041":0,"1055":0,"1057":0,"1059":0,"1060":0,"1063":0,"1064":0,"1076":0,"1078":0,"1080":0,"1081":0,"1084":0,"1085":0,"1097":0,"1108":0,"1110":0,"1112":0,"1113":0,"1115":0,"1116":0,"1131":0,"1133":0,"1134":0,"1135":0,"1137":0,"1138":0,"1139":0,"1140":0,"1152":0,"1189":0,"1245":0,"1262":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].functions = {"initializer:90":0,"(anonymous 2):111":0,"destructor:105":0,"getHTMLNode:129":0,"hide:143":0,"(anonymous 3):176":0,"parseHTML:168":0,"render:240":0,"renderChildren:281":0,"renderNode:332":0,"reposition:417":0,"show:456":0,"toggleVisible:477":0,"_attachMenuEvents:489":0,"_detachMenuEvents:525":0,"(anonymous 4):542":0,"_getAncestorTestFn:539":0,"(anonymous 5):580":0,"_getAnchorRegion:577":0,"(anonymous 6):628":0,"_getSortedAnchorRegions:600":0,"_hideMenu:652":0,"_inRegion:675":0,"_positionMenu:706":0,"_afterAdd:747":0,"_afterClear:787":0,"_afterDocMouseDown:809":0,"_afterClose:830":0,"_afterDisable:855":0,"_afterEnable:870":0,"_afterHide:885":0,"_afterOpen:901":0,"_afterOrientationChange:940":0,"_afterRemove:956":0,"_afterShow:978":0,"_afterVisibleChange:994":0,"_onItemClick:1014":0,"(anonymous 7):1063":0,"_onItemMouseEnter:1054":0,"(anonymous 8):1084":0,"_onItemMouseLeave:1075":0,"_onMenuMouseEnter:1096":0,"(anonymous 9):1112":0,"_onMenuMouseLeave:1107":0,"_defItemClickFn:1130":0,"_defSpecificItemClickFn:1151":0,"valueFn:1188":0,"valueFn:1244":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].coveredLines = 284;
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].coveredFunctions = 49;
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1);
YUI.add('gallery-sm-menu', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Y.Menu` widget.

@module gallery-sm-menu
@main gallery-sm-menu
**/

/**
Menu widget.

@class Menu
@constructor
@param {Object} [config] Config options.
@param {HTMLElement|Node|String} [config.sourceNode] Node instance, HTML
    element, or selector string for a node (usually a `<ul>` or `<ol>`) whose
    structure should be parsed and used to generate this menu's contents. This
    node will be removed from the DOM after being parsed.
@extends Menu.Base
@uses View
**/

_yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 26);
var doc          = Y.config.doc,
    getClassName = Y.ClassNameManager.getClassName;

/**
Fired when any clickable menu item is clicked.

You can subscribe to clicks on a specific menu item by subscribing to
"itemClick#id", where "id" is the item id of the item you want to subscribe to.

@event itemClick
@param {Menu.Item} item Menu item that was clicked.
@param {EventFacade} originEvent Original click event.
@preventable _defItemClickFn
**/
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 40);
var EVT_ITEM_CLICK = 'itemClick';

_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 42);
var Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {

    /**
    CSS class names used by this menu.

    @property {Object} classNames
    **/
    classNames: {
        canHaveChildren: getClassName('menu-can-have-children'),
        children       : getClassName('menu-children'),
        disabled       : getClassName('menu-disabled'),
        hasChildren    : getClassName('menu-has-children'),
        heading        : getClassName('menu-heading'),
        hidden         : getClassName('menu-hidden'),
        horizontal     : getClassName('menu-horizontal'),
        item           : getClassName('menu-item'),
        label          : getClassName('menu-label'),
        menu           : getClassName('menu'),
        noTouch        : getClassName('menu-notouch'),
        open           : getClassName('menu-open'),
        selected       : getClassName('menu-selected'),
        separator      : getClassName('menu-separator'),
        touch          : getClassName('menu-touch'),
        vertical       : getClassName('menu-vertical')
    },

    /**
    Whether or not this menu has been rendered.

    @property {Boolean} rendered
    @default false
    **/
    rendered: false,

    /**
    Selectors to use when parsing a menu structure from a DOM structure via
    `parseHTML()`.

    @property {Object} sourceSelectors
    **/
    sourceSelectors: {
        item   : '> li',
        label  : '> a, > span',
        subtree: '> ul, > ol'
    },

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function (config) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "initializer", 90);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 91);
this._openMenus = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 92);
this._published = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 93);
this._timeouts  = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 95);
if (config && config.sourceNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 96);
config.nodes = (config.nodes || []).concat(
                this.parseHTML(config.sourceNode));

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 99);
Y.one(config.sourceNode).remove(true);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 102);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "destructor", 105);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 106);
this._detachMenuEvents();

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 108);
delete this._openMenus;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 109);
delete this._published;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 111);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 2)", 111);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 112);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 115);
delete this._timeouts;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns the HTML node (as a `Y.Node` instance) associated with the specified
    menu item, if any.

    @method getHTMLNode
    @param {Menu.Item} item Menu item.
    @return {Node} `Y.Node` instance associated with the given tree node, or
        `undefined` if one was not found.
    **/
    getHTMLNode: function (item) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "getHTMLNode", 129);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 130);
if (!item._htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 131);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 134);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "hide", 143);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 144);
this.set('visible', false);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 145);
return this;
    },

    /**
    Parses the specified HTML _sourceNode_ as a menu structure and returns an
    array of menu item objects that can be used to generate a menu with that
    structure.

    By default, _sourceNode_ is expected to contain one `<li>` element per
    menu item, and submenus are expected to be represented by `<ul>` or `<ol>`
    elements.

    The selector queries used to parse the menu structure are contained in the
    `sourceSelectors` property, and may be customized. Class names specified in
    the `classNames` property are used to determine whether a menu item should
    be disabled, hidden, or treated as a heading or separator.

    @method parseHTML
    @param {HTMLElement|Node|String} sourceNode Node instance, HTML element, or
        selector string for the node (usually a `<ul> or `<ol>` element) to
        parse.
    @return {Object[]} Array of menu item objects.
    **/
    parseHTML: function (sourceNode) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "parseHTML", 168);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 169);
sourceNode = Y.one(sourceNode);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 171);
var classNames = this.classNames,
            items      = [],
            sel        = this.sourceSelectors,
            self       = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 176);
sourceNode.all(sel.item).each(function (itemNode) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 3)", 176);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 177);
var item        = {},
                itemEl      = itemNode._node,
                labelNode   = itemNode.one(sel.label),
                subTreeNode = itemNode.one(sel.subtree);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 182);
if (itemNode.hasClass(classNames.heading)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 183);
item.type = 'heading';
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 184);
if (itemNode.hasClass(classNames.separator)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 185);
item.type = 'separator';
            }}

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 188);
if (itemNode.hasClass(classNames.disabled)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 189);
item.state || (item.state = {});
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 190);
item.state.disabled = true;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 193);
if (itemNode.hasClass(classNames.hidden)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 194);
item.state || (item.state = {});
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 195);
item.state.hidden = true;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 198);
if (labelNode) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 199);
var href = labelNode.getAttribute('href');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 201);
item.label = labelNode.getHTML();

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 203);
if (href && href !== '#') {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 204);
item.url = href;
                }
            } else {
                // The selector didn't find a label node, so look for the first
                // text child of the item element.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 209);
var childEl;

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 211);
for (var i = 0, len = itemEl.childNodes.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 212);
childEl = itemEl.childNodes[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 214);
if (childEl.nodeType === doc.TEXT_NODE) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 215);
item.label = Y.Escape.html(childEl.nodeValue);
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 216);
break;
                    }
                }
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 221);
if (subTreeNode) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 222);
item.children = self.parseHTML(subTreeNode);
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 225);
items.push(item);
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 228);
return items;
    },

    /**
    Renders this menu into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "render", 240);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 241);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 244);
container.addClass(classNames.menu);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 245);
container.addClass(classNames[this.get('orientation')]);

        // Detect touchscreen devices.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 248);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 249);
container.addClass(classNames.touch);
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 251);
container.addClass(classNames.noTouch);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 254);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 258);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 259);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 262);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 264);
return this;
    },

    /**
    Renders the children of the specified menu item.

    If a container is specified, it will be assumed to be an existing rendered
    menu item, and the children will be rendered (or re-rendered) inside it.

    @method renderChildren
    @param {Menu.Item} menuItem Menu item whose children should be rendered.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container into
            which the children should be rendered. If the container already
            contains rendered children, they will be re-rendered in place.
    @return {Node} `Y.Node` instance containing the rendered children.
    **/
    renderChildren: function (treeNode, options) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderChildren", 281);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 282);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 284);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 287);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 288);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 295);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 296);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 297);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 300);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 301);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 304);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 305);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 311);
if (container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 312);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 315);
return childrenNode;
    },

    /**
    Renders the specified menu item and its children (if any).

    If a container is specified, the rendered node will be appended to it.

    @method renderNode
    @param {Menu.Item} menuItem Tree node to render.
    @param {Object} [options] Options.
        @param {Node} [options.container] `Y.Node` instance of a container to
            which the rendered tree node should be appended.
        @param {Boolean} [options.renderChildren=false] Whether or not to render
            this node's children.
    @return {Node} `Y.Node` instance of the rendered menu item.
    **/
    renderNode: function (item, options) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderNode", 332);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 333);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 335);
var classNames = this.classNames,
            htmlNode   = item._htmlNode,
            isHidden   = item.isHidden();

        // Create an HTML node for this menu item if one doesn't already exist.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 340);
if (!htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 341);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        // Mark the HTML node as hidden if the item is hidden.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 349);
htmlNode.set('aria-hidden', isHidden);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 350);
htmlNode.toggleClass(classNames.hidden, isHidden);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 352);
switch (item.type) {
        case 'separator':
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 354);
htmlNode.set('role', 'separator');
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 355);
break;

        case 'item':
        case 'heading':
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 359);
var labelNode = htmlNode.one('.' + classNames.label),
                labelId   = labelNode.get('id');

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 362);
labelNode.setHTML(item.label);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 364);
if (!labelId) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 365);
labelId = Y.guid();
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 366);
labelNode.set('id', labelId);
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 369);
htmlNode.set('aria-labelledby', labelId);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 371);
if (item.type === 'heading') {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 372);
htmlNode.set('role', 'heading');
            } else {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 374);
htmlNode.set('role', 'menuitem');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 376);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 378);
if (item.canHaveChildren) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 379);
htmlNode.addClass(classNames.canHaveChildren);
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 380);
htmlNode.toggleClass(classNames.open, item.isOpen());

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 382);
if (item.hasChildren()) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 383);
htmlNode.addClass(classNames.hasChildren);

                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 385);
if (options.renderChildren) {
                            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 386);
this.renderChildren(item, {
                                container: htmlNode
                            });
                        }
                    }
                }
            }
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 393);
break;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 396);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 397);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 400);
return htmlNode;
    },

    /**
    Repositions this menu so that it is anchored to a specified node, region, or
    set of pixel coordinates.

    The menu will be displayed at the most advantageous position relative to the
    anchor point to ensure that as much of the menu as possible is visible
    within the viewport.

    @method reposition
    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu
        should be positioned. The point may be specified as a `Y.Node`
        reference, a region object, or an array of X and Y pixel coordinates.
    @chainable
    **/
    reposition: function (anchorPoint) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "reposition", 417);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 418);
var container = this.get('container'),
            anchorRegion, menuRegion;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 421);
if (Y.Lang.isArray(anchorPoint)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 422);
anchorRegion = {
                bottom: anchorPoint[1],
                left  : anchorPoint[0],
                right : anchorPoint[0],
                top   : anchorPoint[1]
            };
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 428);
if (anchorPoint._node) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 429);
anchorRegion = anchorPoint.get('region');
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 431);
anchorRegion = anchorPoint;
        }}

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 434);
menuRegion = this._getSortedAnchorRegions(
            this.get('alignments'),
            container.get('region'),
            anchorRegion
        )[0].region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 440);
container.setXY([menuRegion.left, menuRegion.top]);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 442);
return this;
    },

    /**
    Shows this menu.

    @method show
    @param {Object} [options] Options.
        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at
            which this menu should be positioned when shown. The point may be
            specified as a `Y.Node` reference, a region object, or an array of X
            and Y pixel coordinates.
    @chainable
    **/
    show: function (options) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "show", 456);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 457);
if (options && options.anchorPoint) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 458);
this.reposition(options.anchorPoint);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 461);
this.set('visible', true);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 462);
return this;
    },

    /**
    Toggles the visibility of this menu, showing it if it's currently hidden or
    hiding it if it's currently visible.

    @method toggleVisible
    @param {Object} [options] Options.
        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at
            which this menu should be positioned when shown. The point may be
            specified as a `Y.Node` reference, a region object, or an array of X
            and Y pixel coordinates.
    @chainable
    **/
    toggleVisible: function (options) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "toggleVisible", 477);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 478);
return this[this.get('visible') ? 'hide' : 'show'](options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_attachMenuEvents", 489);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 490);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 492);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 495);
this._menuEvents.push(
            this.after({
                add              : this._afterAdd,
                clear            : this._afterClear,
                close            : this._afterClose,
                disable          : this._afterDisable,
                enable           : this._afterEnable,
                hide             : this._afterHide,
                open             : this._afterOpen,
                orientationChange: this._afterOrientationChange,
                remove           : this._afterRemove,
                show             : this._afterShow,
                visibleChange    : this._afterVisibleChange
            }),

            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),

            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),
            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),

            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)
        );
    },

    /**
    Detaches menu events.

    @method _detachMenuEvents
    @protected
    **/
    _detachMenuEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_detachMenuEvents", 525);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 526);
(new Y.EventHandle(this._menuEvents)).detach();
    },

    /**
    Returns an efficient test function that can be passed to `Y.Node#ancestor()`
    to test whether a node is this menu's container.

    This is broken out to make overriding easier in subclasses.

    @method _getAncestorTestFn
    @return {Function} Test function.
    @protected
    **/
    _getAncestorTestFn: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAncestorTestFn", 539);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 540);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 542);
return function (node) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 4)", 542);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 543);
return node === container;
        };
    },

    /**
    Given an anchor point and the regions currently occupied by a child node
    (the node being anchored) and a parent node (the node being anchored to),
    returns a region object representing the coordinates the anchored node will
    occupy when anchored to the given point on the parent.

    An anchor point is a string like "tl-bl", which means "anchor the top left
    point of _nodeRegion_ to the bottom left point of _parentRegion_".

    Any combination of top/bottom/left/right anchor points may be used as long
    as they follow this format. Here are a few examples:

      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of
        _parentRegion_.
      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of
        _parentRegion_.
      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of
        _parentRegion_.
      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of
        _parentRegion_.

    @method _getAnchorRegion
    @param {String} anchor Anchor point. See above for details.
    @param {Object} nodeRegion Region object for the node to be anchored (that
        is, the node that will be repositioned).
    @param {Object} parentRegion Region object for the node that will be
        anchored to (that is, the node that will not move).
    @return {Object} Region that will be occupied by the anchored node.
    @protected
    **/
    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAnchorRegion", 577);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 578);
var region = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 580);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 5)", 580);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 581);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 588);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 589);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 592);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 593);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 594);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 595);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 597);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getSortedAnchorRegions", 600);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 601);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 606);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 609);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 610);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 613);
if (point.point) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 614);
point = point.point;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 617);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 619);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 628);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 6)", 628);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 629);
if (a.score === b.score) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 630);
return 0;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 631);
if (a.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 632);
return -1;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 633);
if (b.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 634);
return 1;
            } else {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 636);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 641);
return anchors;
    },

    /**
    Hides the specified menu container by moving its htmlNode offscreen.

    @method _hideMenu
    @param {Menu.Item} item Menu item.
    @param {Node} [htmlNode] HTML node for the menu item.
    @protected
    **/
    _hideMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_hideMenu", 652);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 653);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 655);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 657);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 658);
delete item.data.menuAnchor;
    },

    /**
    Returns `true` if the given _inner_ region is contained entirely within the
    given _outer_ region. If it's not a perfect fit, returns a numerical score
    indicating how much of the _inner_ region fits within the _outer_ region.
    A higher score indicates a better fit.

    @method _inRegion
    @param {Object} inner Inner region.
    @param {Object} outer Outer region.
    @return {Boolean|Number} `true` if the _inner_ region fits entirely within
        the _outer_ region or, if not, a numerical score indicating how much of
        the inner region fits.
    @protected
    **/
    _inRegion: function (inner, outer) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_inRegion", 675);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 676);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 682);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 688);
return (
            Math.min(outer.bottom - inner.bottom, 0) +
            Math.min(inner.left - outer.left, 0) +
            Math.min(outer.right - inner.right, 0) +
            Math.min(inner.top - outer.top, 0)
        );
    },

    /**
    Intelligently positions the _htmlNode_ of the given submenu _item_ relative
    to its parent so that as much as possible of the submenu will be visible
    within the viewport.

    @method _positionMenu
    @param {Menu.Item} item Menu item to position.
    @param {Node} [htmlNode] HTML node for the menu item.
    @protected
    **/
    _positionMenu: function (item, htmlNode) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_positionMenu", 706);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 707);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 709);
var childrenNode = htmlNode.one('.' + this.classNames.children),
            orientation  = this.get('orientation'),
            alignments, anchors;

        // If this is a top-level submenu and this menu is horizontally
        // aligned, use `alignments`.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 715);
if (item.parent.isRoot() && orientation === 'horizontal') {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 716);
alignments = this.get('alignments');
        } else {
            // If this menu has a parent and the parent has stored alignment
            // anchors, use those. Otherwise, use `subMenuAlignments`.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 720);
alignments = (item.parent && item.parent.data.menuAnchors) ||
                this.get('subMenuAlignments');
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 724);
anchors = this._getSortedAnchorRegions(alignments,
            childrenNode.get('region'), htmlNode.get('region'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 727);
if (orientation === 'vertical' || !item.parent.isRoot()) {
            // Remember which anchors we used for this item so that we can
            // default that anchor for submenus of this item if necessary.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 730);
item.data.menuAnchors = anchors;
        }

        // Position the submenu.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 734);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 735);
childrenNode.setXY([anchorRegion.left, anchorRegion.top]);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `add` events for this menu.

    @method _afterAdd
    @param {EventFacade} e
    @protected
    **/
    _afterAdd: function (e) {
        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterAdd", 747);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 749);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 750);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 753);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 757);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 758);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 760);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 761);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 763);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 766);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 768);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 772);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 776);
htmlChildrenNode.insert(this.renderNode(e.node, {
            renderChildren: true
        }), e.index);
    },

    /**
    Handles `clear` events for this menu.

    @method _afterClear
    @protected
    **/
    _afterClear: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClear", 787);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 788);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 791);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 792);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 795);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 796);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 798);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 799);
this.render();
    },

    /**
    Handles `mousedown` events on the document.

    @method _afterDocMouseDown
    @param {EventFacade} e
    @protected
    **/
    _afterDocMouseDown: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDocMouseDown", 809);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 810);
if (!this.get('visible')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 811);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 814);
if (!e.target.ancestor(this._getAncestorTestFn(), true)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 815);
this.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 817);
if (this.get('hideOnOutsideClick')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 818);
this.hide();
            }
        }
    },

    /**
    Handles `close` events for this menu.

    @method _afterClose
    @param {EventFacade} e
    @protected
    **/
    _afterClose: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClose", 830);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 831);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 835);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 836);
item.children[i].close();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 839);
item.close();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 840);
delete this._openMenus[item.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 842);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 843);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 844);
htmlNode.removeClass(this.classNames.open);
        }
    },

    /**
    Handles `disable` events for this menu.

    @method _afterDisable
    @param {EventFacade} e
    @protected
    **/
    _afterDisable: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDisable", 855);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 856);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 858);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 859);
htmlNode.addClass(this.classNames.disabled);
        }
    },

    /**
    Handles `enable` events for this menu.

    @method _afterEnable
    @param {EventFacade} e
    @protected
    **/
    _afterEnable: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterEnable", 870);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 871);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 873);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 874);
htmlNode.removeClass(this.classNames.disabled);
        }
    },

    /**
    Handles `hide` events for this menu.

    @method _afterHide
    @param {EventFacade} e
    @protected
    **/
    _afterHide: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterHide", 885);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 886);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 888);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 889);
htmlNode.addClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 890);
htmlNode.set('aria-hidden', true);
        }
    },

    /**
    Handles `open` events for this menu.

    @method _afterOpen
    @param {EventFacade} e
    @protected
    **/
    _afterOpen: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterOpen", 901);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 902);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 907);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 911);
if (parent.isOpen()) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 912);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 913);
child = parent.children[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 915);
if (child !== item) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 916);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 921);
parent.open();
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 925);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 927);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 928);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 929);
htmlNode.addClass(this.classNames.open);
        }
    },

    /**
    Handles `orientationChange` events for this menu.

    @method _afterOrientationChange
    @param {EventFacade} e
    @protected
    **/
    _afterOrientationChange: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterOrientationChange", 940);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 941);
if (this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 942);
this.get('container')
                .removeClass(this.classNames.horizontal)
                .removeClass(this.classNames.vertical)
                .addClass(this.classNames[e.newVal]);
        }
    },

    /**
    Handles `remove` events for this menu.

    @method _afterRemove
    @param {EventFacade} e
    @protected
    **/
    _afterRemove: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterRemove", 956);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 957);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 959);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 960);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 963);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 965);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 966);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 967);
delete e.node._htmlNode;
        }
    },

    /**
    Handles `show` events for this menu.

    @method _afterShow
    @param {EventFacade} e
    @protected
    **/
    _afterShow: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterShow", 978);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 979);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 981);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 982);
htmlNode.removeClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 983);
htmlNode.set('aria-hidden', false);
        }
    },

    /**
    Handles `visibleChange` events for this menu.

    @method _afterVisibleChange
    @param {EventFacade} e
    @protected
    **/
    _afterVisibleChange: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterVisibleChange", 994);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 995);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 997);
container.toggleClass(this.classNames.open, e.newVal);

        // Ensure that the container doesn't take up space when it's not
        // visible. We have to manually remove the style attribute because it's
        // set when the menu is positioned, and it overrides CSS.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1002);
if (!e.newVal) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1003);
container.removeAttribute('style');
        }
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemClick", 1014);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1015);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1021);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1022);
e.preventDefault();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1025);
if (isDisabled) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1026);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1029);
if (!this._published[eventName]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1030);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1035);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1036);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1041);
this.fire(eventName, {
            originEvent: e,
            item       : item
        });
    },

    /**
    Handles delegated `mouseenter` events on menu items.

    @method _onItemMouseEnter
    @param {EventFacade} e
    @protected
    **/
    _onItemMouseEnter: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseEnter", 1054);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1055);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1057);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1059);
if (item.isOpen() || item.isDisabled()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1060);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1063);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 7)", 1063);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1064);
item.open();
        }, 200); // TODO: make timeouts configurable
    },

    /**
    Handles delegated `mouseleave` events on menu items.

    @method _onItemMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onItemMouseLeave: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseLeave", 1075);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1076);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1078);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1080);
if (!item.isOpen()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1081);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1084);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 8)", 1084);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1085);
item.close();
        }, 300);
    },

    /**
    Handles `mouseenter` events on this menu.

    @method _onMenuMouseEnter
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseEnter: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseEnter", 1096);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1097);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseLeave", 1107);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1108);
var self = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1110);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1112);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 9)", 1112);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1113);
self.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1115);
if (self.get('hideOnMouseLeave')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1116);
self.hide();
            }
        }, 500);
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default handler for the generic `itemClick` event.

    @method _defItemClickFn
    @param {EventFacade} e
    @protected
    **/
    _defItemClickFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defItemClickFn", 1130);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1131);
var item = e.item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1133);
if (item.canHaveChildren) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1134);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1135);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1137);
e.item.toggleOpen();
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1138);
if (this.get('hideOnClick')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1139);
this.closeSubMenus();
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1140);
this.hide();
        }}
    },

    /**
    Default handler for item-specific `itemClick#<id>` events.

    @method _defSpecificItemClickFn
    @param {EventFacade} e
    @protected
    **/
    _defSpecificItemClickFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defSpecificItemClickFn", 1151);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1152);
this.fire(EVT_ITEM_CLICK, {
            originEvent: e.originEvent,
            item       : e.item
        });
    }
}, {
    ATTRS: {
        /**
        Preferred alignment positions at which this menu should be displayed
        relative to the anchor point when one is provided to the `show()`,
        `toggle()`, or `reposition()` methods.

        The most optimal alignment position will be chosen automatically based
        on which one allows the most of this menu to be visible within the
        browser's viewport. If multiple positions are equally visible, then the
        optimal position will be chosen based on its order in this array.

        An alignment position is a string like "tl-bl", which means "align the
        top left of this menu to the bottom left of its anchor point".

        Any combination of top/bottom/left/right alignment positions may be used
        as long as they follow this format. Here are a few examples:

          * `'bl-br'`: Align the bottom left of this menu with the bottom right
            of the anchor point.
          * `'br-bl'`: Align the bottom right of this menu with the bottom left
            of the anchor point.
          * `'tl-tr'`: Align the top left of this menu with the top right of
            the anchor point.
          * `'tr-tl'`: Align the top right of this menu to the top left of this
            anchor point.

        @attribute {String[]} alignments
        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']
        **/
        alignments: {
            valueFn: function () {
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1188);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1189);
return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];
            }
        },

        /**
        If `true`, this menu will be hidden when the user clicks on a menu item
        that doesn't contain a submenu.

        @attribute {Boolean} hideOnClick
        @default true
        **/
        hideOnClick: {
            value: true
        },

        /**
        If `true`, this menu will be hidden when the user moves the mouse
        outside the menu.

        @attribute {Boolean} hideOnMouseLeave
        @default false
        **/
        hideOnMouseLeave: {
            value: false
        },

        /**
        If `true`, this menu will be hidden when the user clicks somewhere
        outside the menu.

        @attribute {Boolean} hideOnOutsideClick
        @default true
        **/
        hideOnOutsideClick: {
            value: true
        },

        /**
        Orientation of this menu. May be either `'vertical'` or `'horizontal'`.

        @attribute {String} orientation
        @default 'vertical'
        **/
        orientation: {
            value: 'vertical'
        },

        /**
        Just like `alignments`, but for submenus of this menu. See the
        `alignments` attribute for details on how alignment positions work.

        @attribute {String[]} subMenuAlignments
        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']
        **/
        subMenuAlignments: {
            valueFn: function () {
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1244);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1245);
return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];
            }
        },

        /**
        Whether or not this menu is visible. Changing this attribute's value
        will also change the visibility of this menu.

        @attribute {Boolean} visible
        @default false
        **/
        visible: {
            value: false
        }
    }
});

_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1262);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {
    "requires": [
        "classnamemanager",
        "escape",
        "event-hover",
        "gallery-sm-menu-base",
        "gallery-sm-menu-templates",
        "node-screen",
        "view"
    ],
    "skinnable": true
});
