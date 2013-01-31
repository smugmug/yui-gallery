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
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].code=["YUI.add('gallery-sm-menu', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Y.Menu` widget.","","@module gallery-sm-menu","@main gallery-sm-menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@param {Object} [config] Config options.","@param {HTMLElement|Node|String} [config.sourceNode] Node instance, HTML","    element, or selector string for a node (usually a `<ul>` or `<ol>`) whose","    structure should be parsed and used to generate this menu's contents. This","    node will be removed from the DOM after being parsed.","@extends Menu.Base","@uses View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","var EVT_ITEM_CLICK = 'itemClick';","","var Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        hidden         : getClassName('menu-hidden'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    /**","    Selectors to use when parsing a menu structure from a DOM structure via","    `parseHTML()`.","","    @property {Object} sourceSelectors","    **/","    sourceSelectors: {","        item   : '> li',","        label  : '> a, > span',","        subtree: '> ul, > ol'","    },","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function (config) {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        if (config && config.sourceNode) {","            config.nodes = (config.nodes || []).concat(","                this.parseHTML(config.sourceNode));","","            Y.one(config.sourceNode).remove(true);","        }","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Parses the specified HTML _sourceNode_ as a menu structure and returns an","    array of menu item objects that can be used to generate a menu with that","    structure.","","    By default, _sourceNode_ is expected to contain one `<li>` element per","    menu item, and submenus are expected to be represented by `<ul>` or `<ol>`","    elements.","","    The selector queries used to parse the menu structure are contained in the","    `sourceSelectors` property, and may be customized. Class names specified in","    the `classNames` property are used to determine whether a menu item should","    be disabled, hidden, or treated as a heading or separator.","","    @method parseHTML","    @param {HTMLElement|Node|String} sourceNode Node instance, HTML element, or","        selector string for the node (usually a `<ul> or `<ol>` element) to","        parse.","    @return {Object[]} Array of menu item objects.","    **/","    parseHTML: function (sourceNode) {","        sourceNode = Y.one(sourceNode);","","        var classNames = this.classNames,","            items      = [],","            sel        = this.sourceSelectors,","            self       = this;","","        sourceNode.all(sel.item).each(function (itemNode) {","            var item        = {},","                itemEl      = itemNode._node,","                labelNode   = itemNode.one(sel.label),","                subTreeNode = itemNode.one(sel.subtree);","","            if (itemNode.hasClass(classNames.heading)) {","                item.type = 'heading';","            } else if (itemNode.hasClass(classNames.separator)) {","                item.type = 'separator';","            }","","            if (itemNode.hasClass(classNames.disabled)) {","                item.state || (item.state = {});","                item.state.disabled = true;","            }","","            if (itemNode.hasClass(classNames.hidden)) {","                item.state || (item.state = {});","                item.state.hidden = true;","            }","","            if (labelNode) {","                var href = labelNode.getAttribute('href');","","                item.label = labelNode.getHTML();","","                if (href && href !== '#') {","                    item.url = href;","                }","            } else {","                // The selector didn't find a label node, so look for the first","                // text child of the item element.","                var childEl;","","                for (var i = 0, len = itemEl.childNodes.length; i < len; i++) {","                    childEl = itemEl.childNodes[i];","","                    if (childEl.nodeType === doc.TEXT_NODE) {","                        item.label = Y.Escape.html(childEl.nodeValue);","                        break;","                    }","                }","            }","","            if (subTreeNode) {","                item.children = self.parseHTML(subTreeNode);","            }","","            items.push(item);","        });","","        return items;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode,","            isHidden   = item.isHidden();","","        // Create an HTML node for this menu item if one doesn't already exist.","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        // Mark the HTML node as hidden if the item is hidden.","        htmlNode.set('aria-hidden', isHidden);","        htmlNode.toggleClass(classNames.hidden, isHidden);","","        switch (item.type) {","        case 'separator':","            htmlNode.set('role', 'separator');","            break;","","        case 'item':","        case 'heading':","            var labelNode = htmlNode.one('.' + classNames.label),","                labelId   = labelNode.get('id');","","            labelNode.setHTML(item.label);","","            if (!labelId) {","                labelId = Y.guid();","                labelNode.set('id', labelId);","            }","","            htmlNode.set('aria-labelledby', labelId);","","            if (item.type === 'heading') {","                htmlNode.set('role', 'heading');","            } else {","                htmlNode.set('role', 'menuitem');","","                htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                if (item.canHaveChildren) {","                    htmlNode.addClass(classNames.canHaveChildren);","                    htmlNode.toggleClass(classNames.open, item.isOpen());","","                    if (item.hasChildren()) {","                        htmlNode.addClass(classNames.hasChildren);","","                        if (options.renderChildren) {","                            this.renderChildren(item, {","                                container: htmlNode","                            });","                        }","                    }","                }","            }","            break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    @method reposition","    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        var container = this.get('container'),","            anchorRegion, menuRegion;","","        if (Y.Lang.isArray(anchorPoint)) {","            anchorRegion = {","                bottom: anchorPoint[1],","                left  : anchorPoint[0],","                right : anchorPoint[0],","                top   : anchorPoint[1]","            };","        } else if (anchorPoint._node) {","            anchorRegion = anchorPoint.get('region');","        } else {","            anchorRegion = anchorPoint;","        }","","        menuRegion = this._getSortedAnchorRegions(","            this.get('alignments'),","            container.get('region'),","            anchorRegion","        )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    /**","    Shows this menu.","","    @method show","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    show: function (options) {","        if (options && options.anchorPoint) {","            this.reposition(options.anchorPoint);","        }","","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    toggle: function (options) {","        return this[this.get('visible') ? 'hide' : 'show'](options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add          : this._afterAdd,","                clear        : this._afterClear,","                close        : this._afterClose,","                disable      : this._afterDisable,","                enable       : this._afterEnable,","                hide         : this._afterHide,","                open         : this._afterOpen,","                remove       : this._afterRemove,","                show         : this._afterShow,","                visibleChange: this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),","","            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Returns an efficient test function that can be passed to `Y.Node#ancestor()`","    to test whether a node is this menu's container.","","    This is broken out to make overriding easier in subclasses.","","    @method _getAncestorTestFn","    @return {Function} Test function.","    @protected","    **/","    _getAncestorTestFn: function () {","        var container = this.get('container');","","        return function (node) {","            return node === container;","        };","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides the specified menu container by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","","            anchors = this._getSortedAnchorRegions(","                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),","                childrenNode.get('region'),","                htmlNode.get('region')","            );","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `mousedown` events on the document.","","    @method _afterDocMouseDown","    @param {EventFacade} e","    @protected","    **/","    _afterDocMouseDown: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        if (!e.target.ancestor(this._getAncestorTestFn(), true)) {","            this.closeSubMenus();","","            if (this.get('hideOnOutsideClick')) {","                this.hide();","            }","        }","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `disable` events for this menu.","","    @method _afterDisable","    @param {EventFacade} e","    @protected","    **/","    _afterDisable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `enable` events for this menu.","","    @method _afterEnable","    @param {EventFacade} e","    @protected","    **/","    _afterEnable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `hide` events for this menu.","","    @method _afterHide","    @param {EventFacade} e","    @protected","    **/","    _afterHide: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', true);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `show` events for this menu.","","    @method _afterShow","    @param {EventFacade} e","    @protected","    **/","    _afterShow: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', false);","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this.get('container').toggleClass(this.classNames.open, e.newVal);","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled() || item.isHidden();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            });","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen() || item.isDisabled()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","","            if (self.get('hideOnMouseLeave')) {","                self.hide();","            }","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else if (this.get('hideOnClick')) {","            this.closeSubMenus();","            this.hide();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Preferred alignment positions at which this menu should be displayed","        relative to the anchor point when one is provided to the `show()`,","        `toggle()`, or `reposition()` methods.","","        The most optimal alignment position will be chosen automatically based","        on which one allows the most of this menu to be visible within the","        browser's viewport. If multiple positions are equally visible, then the","        optimal position will be chosen based on its order in this array.","","        An alignment position is a string like \"tl-bl\", which means \"align the","        top left of this menu to the bottom left of its anchor point\".","","        Any combination of top/bottom/left/right alignment positions may be used","        as long as they follow this format. Here are a few examples:","","          * `'bl-br'`: Align the bottom left of this menu with the bottom right","            of the anchor point.","          * `'br-bl'`: Align the bottom right of this menu with the bottom left","            of the anchor point.","          * `'tl-tr'`: Align the top left of this menu with the top right of","            the anchor point.","          * `'tr-tl'`: Align the top right of this menu to the top left of this","            anchor point.","","        @attribute {String[]} alignments","        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']","        **/","        alignments: {","            valueFn: function () {","                return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];","            }","        },","","        /**","        If `true`, this menu will be hidden when the user clicks on a menu item","        that doesn't contain a submenu.","","        @attribute {Boolean} hideOnClick","        @default true","        **/","        hideOnClick: {","            value: true","        },","","        /**","        If `true`, this menu will be hidden when the user moves the mouse","        outside the menu.","","        @attribute {Boolean} hideOnMouseLeave","        @default false","        **/","        hideOnMouseLeave: {","            value: false","        },","","        /**","        If `true`, this menu will be hidden when the user clicks somewhere","        outside the menu.","","        @attribute {Boolean} hideOnOutsideClick","        @default true","        **/","        hideOnOutsideClick: {","            value: true","        },","","        /**","        Just like `alignments`, but for submenus of this menu. See the","        `alignments` attribute for details on how alignment positions work.","","        @attribute {String[]} subMenuAlignments","        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']","        **/","        subMenuAlignments: {","            valueFn: function () {","                return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];","            }","        },","","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {","    \"requires\": [","        \"classnamemanager\",","        \"escape\",","        \"event-hover\",","        \"gallery-sm-menu-base\",","        \"gallery-sm-menu-templates\",","        \"node-screen\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].lines = {"1":0,"26":0,"40":0,"42":0,"89":0,"90":0,"91":0,"93":0,"94":0,"97":0,"100":0,"104":0,"106":0,"107":0,"109":0,"110":0,"113":0,"128":0,"129":0,"132":0,"142":0,"143":0,"167":0,"169":0,"174":0,"175":0,"180":0,"181":0,"182":0,"183":0,"186":0,"187":0,"188":0,"191":0,"192":0,"193":0,"196":0,"197":0,"199":0,"201":0,"202":0,"207":0,"209":0,"210":0,"212":0,"213":0,"214":0,"219":0,"220":0,"223":0,"226":0,"239":0,"241":0,"244":0,"245":0,"247":0,"250":0,"254":0,"255":0,"258":0,"260":0,"278":0,"280":0,"283":0,"284":0,"291":0,"292":0,"293":0,"296":0,"297":0,"300":0,"301":0,"307":0,"308":0,"311":0,"329":0,"331":0,"336":0,"337":0,"345":0,"346":0,"348":0,"350":0,"351":0,"355":0,"358":0,"360":0,"361":0,"362":0,"365":0,"367":0,"368":0,"370":0,"372":0,"374":0,"375":0,"376":0,"378":0,"379":0,"381":0,"382":0,"389":0,"392":0,"393":0,"396":0,"414":0,"417":0,"418":0,"424":0,"425":0,"427":0,"430":0,"436":0,"438":0,"453":0,"454":0,"457":0,"458":0,"474":0,"486":0,"488":0,"491":0,"521":0,"535":0,"537":0,"538":0,"573":0,"575":0,"576":0,"583":0,"584":0,"587":0,"588":0,"589":0,"590":0,"592":0,"596":0,"601":0,"604":0,"605":0,"608":0,"609":0,"612":0,"614":0,"623":0,"624":0,"625":0,"626":0,"627":0,"628":0,"629":0,"631":0,"636":0,"648":0,"650":0,"652":0,"653":0,"671":0,"677":0,"683":0,"702":0,"704":0,"714":0,"717":0,"718":0,"732":0,"733":0,"736":0,"740":0,"741":0,"743":0,"744":0,"746":0,"749":0,"751":0,"755":0,"759":0,"771":0,"774":0,"775":0,"778":0,"779":0,"781":0,"782":0,"793":0,"794":0,"797":0,"798":0,"800":0,"801":0,"814":0,"818":0,"819":0,"822":0,"823":0,"825":0,"826":0,"827":0,"839":0,"841":0,"842":0,"854":0,"856":0,"857":0,"869":0,"871":0,"872":0,"873":0,"885":0,"890":0,"894":0,"895":0,"896":0,"898":0,"899":0,"904":0,"908":0,"910":0,"911":0,"912":0,"924":0,"926":0,"927":0,"930":0,"932":0,"933":0,"934":0,"946":0,"948":0,"949":0,"950":0,"962":0,"973":0,"979":0,"980":0,"983":0,"984":0,"987":0,"988":0,"993":0,"994":0,"999":0,"1013":0,"1015":0,"1017":0,"1018":0,"1021":0,"1022":0,"1034":0,"1036":0,"1038":0,"1039":0,"1042":0,"1043":0,"1055":0,"1066":0,"1068":0,"1070":0,"1071":0,"1073":0,"1074":0,"1089":0,"1091":0,"1092":0,"1093":0,"1095":0,"1096":0,"1097":0,"1098":0,"1110":0,"1147":0,"1193":0,"1210":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].functions = {"initializer:88":0,"(anonymous 2):109":0,"destructor:103":0,"getHTMLNode:127":0,"hide:141":0,"(anonymous 3):174":0,"parseHTML:166":0,"render:238":0,"renderChildren:277":0,"renderNode:328":0,"reposition:413":0,"show:452":0,"toggle:473":0,"_attachMenuEvents:485":0,"_detachMenuEvents:520":0,"(anonymous 4):537":0,"_getAncestorTestFn:534":0,"(anonymous 5):575":0,"_getAnchorRegion:572":0,"(anonymous 6):623":0,"_getSortedAnchorRegions:595":0,"_hideMenu:647":0,"_inRegion:670":0,"_positionMenu:701":0,"_afterAdd:730":0,"_afterClear:770":0,"_afterDocMouseDown:792":0,"_afterClose:813":0,"_afterDisable:838":0,"_afterEnable:853":0,"_afterHide:868":0,"_afterOpen:884":0,"_afterRemove:923":0,"_afterShow:945":0,"_afterVisibleChange:961":0,"_onItemClick:972":0,"(anonymous 7):1021":0,"_onItemMouseEnter:1012":0,"(anonymous 8):1042":0,"_onItemMouseLeave:1033":0,"_onMenuMouseEnter:1054":0,"(anonymous 9):1070":0,"_onMenuMouseLeave:1065":0,"_defItemClickFn:1088":0,"_defSpecificItemClickFn:1109":0,"valueFn:1146":0,"valueFn:1192":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].coveredLines = 273;
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].coveredFunctions = 48;
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
        item           : getClassName('menu-item'),
        label          : getClassName('menu-label'),
        menu           : getClassName('menu'),
        noTouch        : getClassName('menu-notouch'),
        open           : getClassName('menu-open'),
        selected       : getClassName('menu-selected'),
        separator      : getClassName('menu-separator'),
        touch          : getClassName('menu-touch')
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "initializer", 88);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 89);
this._openMenus = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 90);
this._published = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 91);
this._timeouts  = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 93);
if (config && config.sourceNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 94);
config.nodes = (config.nodes || []).concat(
                this.parseHTML(config.sourceNode));

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 97);
Y.one(config.sourceNode).remove(true);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 100);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "destructor", 103);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 104);
this._detachMenuEvents();

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 106);
delete this._openMenus;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 107);
delete this._published;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 109);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 2)", 109);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 110);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 113);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "getHTMLNode", 127);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 128);
if (!item._htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 129);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 132);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "hide", 141);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 142);
this.set('visible', false);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 143);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "parseHTML", 166);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 167);
sourceNode = Y.one(sourceNode);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 169);
var classNames = this.classNames,
            items      = [],
            sel        = this.sourceSelectors,
            self       = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 174);
sourceNode.all(sel.item).each(function (itemNode) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 3)", 174);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 175);
var item        = {},
                itemEl      = itemNode._node,
                labelNode   = itemNode.one(sel.label),
                subTreeNode = itemNode.one(sel.subtree);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 180);
if (itemNode.hasClass(classNames.heading)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 181);
item.type = 'heading';
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 182);
if (itemNode.hasClass(classNames.separator)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 183);
item.type = 'separator';
            }}

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 186);
if (itemNode.hasClass(classNames.disabled)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 187);
item.state || (item.state = {});
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 188);
item.state.disabled = true;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 191);
if (itemNode.hasClass(classNames.hidden)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 192);
item.state || (item.state = {});
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 193);
item.state.hidden = true;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 196);
if (labelNode) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 197);
var href = labelNode.getAttribute('href');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 199);
item.label = labelNode.getHTML();

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 201);
if (href && href !== '#') {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 202);
item.url = href;
                }
            } else {
                // The selector didn't find a label node, so look for the first
                // text child of the item element.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 207);
var childEl;

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 209);
for (var i = 0, len = itemEl.childNodes.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 210);
childEl = itemEl.childNodes[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 212);
if (childEl.nodeType === doc.TEXT_NODE) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 213);
item.label = Y.Escape.html(childEl.nodeValue);
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 214);
break;
                    }
                }
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 219);
if (subTreeNode) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 220);
item.children = self.parseHTML(subTreeNode);
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 223);
items.push(item);
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 226);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "render", 238);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 239);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 241);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 244);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 245);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 247);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 250);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 254);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 255);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 258);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 260);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderChildren", 277);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 278);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 280);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 283);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 284);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 291);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 292);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 293);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 296);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 297);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 300);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 301);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 307);
if (container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 308);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 311);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderNode", 328);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 329);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 331);
var classNames = this.classNames,
            htmlNode   = item._htmlNode,
            isHidden   = item.isHidden();

        // Create an HTML node for this menu item if one doesn't already exist.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 336);
if (!htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 337);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        // Mark the HTML node as hidden if the item is hidden.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 345);
htmlNode.set('aria-hidden', isHidden);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 346);
htmlNode.toggleClass(classNames.hidden, isHidden);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 348);
switch (item.type) {
        case 'separator':
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 350);
htmlNode.set('role', 'separator');
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 351);
break;

        case 'item':
        case 'heading':
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 355);
var labelNode = htmlNode.one('.' + classNames.label),
                labelId   = labelNode.get('id');

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 358);
labelNode.setHTML(item.label);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 360);
if (!labelId) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 361);
labelId = Y.guid();
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 362);
labelNode.set('id', labelId);
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 365);
htmlNode.set('aria-labelledby', labelId);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 367);
if (item.type === 'heading') {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 368);
htmlNode.set('role', 'heading');
            } else {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 370);
htmlNode.set('role', 'menuitem');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 372);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 374);
if (item.canHaveChildren) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 375);
htmlNode.addClass(classNames.canHaveChildren);
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 376);
htmlNode.toggleClass(classNames.open, item.isOpen());

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 378);
if (item.hasChildren()) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 379);
htmlNode.addClass(classNames.hasChildren);

                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 381);
if (options.renderChildren) {
                            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 382);
this.renderChildren(item, {
                                container: htmlNode
                            });
                        }
                    }
                }
            }
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 389);
break;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 392);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 393);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 396);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "reposition", 413);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 414);
var container = this.get('container'),
            anchorRegion, menuRegion;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 417);
if (Y.Lang.isArray(anchorPoint)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 418);
anchorRegion = {
                bottom: anchorPoint[1],
                left  : anchorPoint[0],
                right : anchorPoint[0],
                top   : anchorPoint[1]
            };
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 424);
if (anchorPoint._node) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 425);
anchorRegion = anchorPoint.get('region');
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 427);
anchorRegion = anchorPoint;
        }}

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 430);
menuRegion = this._getSortedAnchorRegions(
            this.get('alignments'),
            container.get('region'),
            anchorRegion
        )[0].region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 436);
container.setXY([menuRegion.left, menuRegion.top]);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 438);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "show", 452);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 453);
if (options && options.anchorPoint) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 454);
this.reposition(options.anchorPoint);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 457);
this.set('visible', true);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 458);
return this;
    },

    /**
    Toggles the visibility of this menu, showing it if it's currently hidden or
    hiding it if it's currently visible.

    @method toggle
    @param {Object} [options] Options.
        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at
            which this menu should be positioned when shown. The point may be
            specified as a `Y.Node` reference, a region object, or an array of X
            and Y pixel coordinates.
    @chainable
    **/
    toggle: function (options) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "toggle", 473);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 474);
return this[this.get('visible') ? 'hide' : 'show'](options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_attachMenuEvents", 485);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 486);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 488);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 491);
this._menuEvents.push(
            this.after({
                add          : this._afterAdd,
                clear        : this._afterClear,
                close        : this._afterClose,
                disable      : this._afterDisable,
                enable       : this._afterEnable,
                hide         : this._afterHide,
                open         : this._afterOpen,
                remove       : this._afterRemove,
                show         : this._afterShow,
                visibleChange: this._afterVisibleChange
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_detachMenuEvents", 520);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 521);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAncestorTestFn", 534);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 535);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 537);
return function (node) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 4)", 537);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 538);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAnchorRegion", 572);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 573);
var region = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 575);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 5)", 575);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 576);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 583);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 584);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 587);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 588);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 589);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 590);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 592);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getSortedAnchorRegions", 595);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 596);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 601);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 604);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 605);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 608);
if (point.point) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 609);
point = point.point;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 612);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 614);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 623);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 6)", 623);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 624);
if (a.score === b.score) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 625);
return 0;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 626);
if (a.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 627);
return -1;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 628);
if (b.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 629);
return 1;
            } else {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 631);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 636);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_hideMenu", 647);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 648);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 650);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 652);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 653);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_inRegion", 670);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 671);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 677);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 683);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_positionMenu", 701);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 702);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 704);
var childrenNode = htmlNode.one('.' + this.classNames.children),

            anchors = this._getSortedAnchorRegions(
                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),
                childrenNode.get('region'),
                htmlNode.get('region')
            );

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 714);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 717);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 718);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterAdd", 730);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 732);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 733);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 736);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 740);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 741);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 743);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 744);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 746);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 749);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 751);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 755);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 759);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClear", 770);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 771);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 774);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 775);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 778);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 779);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 781);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 782);
this.render();
    },

    /**
    Handles `mousedown` events on the document.

    @method _afterDocMouseDown
    @param {EventFacade} e
    @protected
    **/
    _afterDocMouseDown: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDocMouseDown", 792);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 793);
if (!this.get('visible')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 794);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 797);
if (!e.target.ancestor(this._getAncestorTestFn(), true)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 798);
this.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 800);
if (this.get('hideOnOutsideClick')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 801);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClose", 813);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 814);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 818);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 819);
item.children[i].close();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 822);
item.close();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 823);
delete this._openMenus[item.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 825);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 826);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 827);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDisable", 838);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 839);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 841);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 842);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterEnable", 853);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 854);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 856);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 857);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterHide", 868);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 869);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 871);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 872);
htmlNode.addClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 873);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterOpen", 884);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 885);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 890);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 894);
if (parent.isOpen()) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 895);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 896);
child = parent.children[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 898);
if (child !== item) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 899);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 904);
parent.open();
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 908);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 910);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 911);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 912);
htmlNode.addClass(this.classNames.open);
        }
    },

    /**
    Handles `remove` events for this menu.

    @method _afterRemove
    @param {EventFacade} e
    @protected
    **/
    _afterRemove: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterRemove", 923);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 924);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 926);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 927);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 930);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 932);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 933);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 934);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterShow", 945);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 946);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 948);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 949);
htmlNode.removeClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 950);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterVisibleChange", 961);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 962);
this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemClick", 972);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 973);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 979);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 980);
e.preventDefault();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 983);
if (isDisabled) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 984);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 987);
if (!this._published[eventName]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 988);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 993);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 994);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 999);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseEnter", 1012);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1013);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1015);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1017);
if (item.isOpen() || item.isDisabled()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1018);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1021);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 7)", 1021);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1022);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseLeave", 1033);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1034);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1036);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1038);
if (!item.isOpen()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1039);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1042);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 8)", 1042);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1043);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseEnter", 1054);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1055);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseLeave", 1065);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1066);
var self = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1068);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1070);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 9)", 1070);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1071);
self.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1073);
if (self.get('hideOnMouseLeave')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1074);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defItemClickFn", 1088);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1089);
var item = e.item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1091);
if (item.canHaveChildren) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1092);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1093);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1095);
e.item.toggle();
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1096);
if (this.get('hideOnClick')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1097);
this.closeSubMenus();
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1098);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defSpecificItemClickFn", 1109);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1110);
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
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1146);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1147);
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
        Just like `alignments`, but for submenus of this menu. See the
        `alignments` attribute for details on how alignment positions work.

        @attribute {String[]} subMenuAlignments
        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']
        **/
        subMenuAlignments: {
            valueFn: function () {
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1192);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1193);
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

_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1210);
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
