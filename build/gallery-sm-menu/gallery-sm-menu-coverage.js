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
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].code=["YUI.add('gallery-sm-menu', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Y.Menu` widget.","","@module gallery-sm-menu","@main gallery-sm-menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@extends Menu.Base","@uses View","**/","","var getClassName = Y.ClassNameManager.getClassName,","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","EVT_ITEM_CLICK = 'itemClick',","","Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        hidden         : getClassName('menu-hidden'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function () {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode,","            isHidden   = item.isHidden();","","        // Create an HTML node for this menu item if one doesn't already exist.","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        // Mark the HTML node as hidden if the item is hidden.","        htmlNode.set('aria-hidden', isHidden);","        htmlNode.toggleClass(classNames.hidden, isHidden);","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    @method reposition","    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        var container = this.get('container'),","            anchorRegion, menuRegion;","","        if (Y.Lang.isArray(anchorPoint)) {","            anchorRegion = {","                bottom: anchorPoint[1],","                left  : anchorPoint[0],","                right : anchorPoint[0],","                top   : anchorPoint[1]","            };","        } else if (anchorPoint._node) {","            anchorRegion = anchorPoint.get('region');","        } else {","            anchorRegion = anchorPoint;","        }","","        menuRegion = this._getSortedAnchorRegions(","            this.get('alignments'),","            container.get('region'),","            anchorRegion","        )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    /**","    Shows this menu.","","    @method show","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    show: function (options) {","        if (options && options.anchorPoint) {","            this.reposition(options.anchorPoint);","        }","","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    toggle: function (options) {","        return this[this.get('visible') ? 'hide' : 'show'](options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add          : this._afterAdd,","                clear        : this._afterClear,","                close        : this._afterClose,","                disable      : this._afterDisable,","                enable       : this._afterEnable,","                hide         : this._afterHide,","                open         : this._afterOpen,","                remove       : this._afterRemove,","                show         : this._afterShow,","                visibleChange: this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),","","            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Returns an efficient test function that can be passed to `Y.Node#ancestor()`","    to test whether a node is this menu's container.","","    This is broken out to make overriding easier in subclasses.","","    @method _getAncestorTestFn","    @return {Function} Test function.","    @protected","    **/","    _getAncestorTestFn: function () {","        var container = this.get('container');","","        return function (node) {","            return node === container;","        };","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides the specified menu container by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","","            anchors = this._getSortedAnchorRegions(","                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),","                childrenNode.get('region'),","                htmlNode.get('region')","            );","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `mousedown` events on the document.","","    @method _afterDocMouseDown","    @param {EventFacade} e","    @protected","    **/","    _afterDocMouseDown: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        if (!e.target.ancestor(this._getAncestorTestFn(), true)) {","            this.closeSubMenus();","","            if (this.get('hideOnOutsideClick')) {","                this.hide();","            }","        }","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `disable` events for this menu.","","    @method _afterDisable","    @param {EventFacade} e","    @protected","    **/","    _afterDisable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `enable` events for this menu.","","    @method _afterEnable","    @param {EventFacade} e","    @protected","    **/","    _afterEnable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `hide` events for this menu.","","    @method _afterHide","    @param {EventFacade} e","    @protected","    **/","    _afterHide: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', true);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `show` events for this menu.","","    @method _afterShow","    @param {EventFacade} e","    @protected","    **/","    _afterShow: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', false);","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this.get('container').toggleClass(this.classNames.open, e.newVal);","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled() || item.isHidden();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            }) ;","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen() || item.isDisabled()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","","            if (self.get('hideOnMouseLeave')) {","                self.hide();","            }","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else {","            this.closeSubMenus();","            this.hide();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Preferred alignment positions at which this menu should be displayed","        relative to the anchor point when one is provided to the `show()`,","        `toggle()`, or `reposition()` methods.","","        The most optimal alignment position will be chosen automatically based","        on which one allows the most of this menu to be visible within the","        browser's viewport. If multiple positions are equally visible, then the","        optimal position will be chosen based on its order in this array.","","        An alignment position is a string like \"tl-bl\", which means \"align the","        top left of this menu to the bottom left of its anchor point\".","","        Any combination of top/bottom/left/right alignment positions may be used","        as long as they follow this format. Here are a few examples:","","          * `'bl-br'`: Align the bottom left of this menu with the bottom right","            of the anchor point.","          * `'br-bl'`: Align the bottom right of this menu with the bottom left","            of the anchor point.","          * `'tl-tr'`: Align the top left of this menu with the top right of","            the anchor point.","          * `'tr-tl'`: Align the top right of this menu to the top left of this","            anchor point.","","        @attribute {String[]} alignments","        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']","        **/","        alignments: {","            valueFn: function () {","                return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];","            }","        },","","        /**","        If `true`, this menu will be hidden when the user moves the mouse","        outside the menu.","","        @attribute {Boolean} hideOnMouseLeave","        @default false","        **/","        hideOnMouseLeave: {","            value: false","        },","","        /**","        If `true`, this menu will be hidden when the user clicks somewhere","        outside the menu.","","        @attribute {Boolean} hideOnOutsideClick","        @default true","        **/","        hideOnOutsideClick: {","            value: true","        },","","        /**","        Just like `alignments`, but for submenus of this menu. See the","        `alignments` attribute for details on how alignment positions work.","","        @attribute {String[]} subMenuAlignments","        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']","        **/","        subMenuAlignments: {","            valueFn: function () {","                return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];","            }","        },","","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {","    \"requires\": [","        \"classnamemanager\",","        \"event-hover\",","        \"gallery-sm-menu-base\",","        \"gallery-sm-menu-templates\",","        \"node-screen\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].lines = {"1":0,"21":0,"71":0,"72":0,"73":0,"75":0,"79":0,"81":0,"82":0,"84":0,"85":0,"88":0,"103":0,"104":0,"107":0,"117":0,"118":0,"131":0,"133":0,"136":0,"137":0,"139":0,"142":0,"146":0,"147":0,"150":0,"152":0,"170":0,"172":0,"175":0,"176":0,"183":0,"184":0,"185":0,"188":0,"189":0,"192":0,"193":0,"199":0,"200":0,"203":0,"221":0,"223":0,"228":0,"229":0,"237":0,"238":0,"240":0,"242":0,"243":0,"247":0,"250":0,"252":0,"253":0,"254":0,"257":0,"259":0,"260":0,"262":0,"264":0,"266":0,"267":0,"268":0,"270":0,"271":0,"273":0,"274":0,"281":0,"284":0,"285":0,"288":0,"306":0,"309":0,"310":0,"316":0,"317":0,"319":0,"322":0,"328":0,"330":0,"345":0,"346":0,"349":0,"350":0,"366":0,"378":0,"380":0,"383":0,"413":0,"427":0,"429":0,"430":0,"465":0,"467":0,"468":0,"475":0,"476":0,"479":0,"480":0,"481":0,"482":0,"484":0,"488":0,"493":0,"496":0,"497":0,"500":0,"501":0,"504":0,"506":0,"515":0,"516":0,"517":0,"518":0,"519":0,"520":0,"521":0,"523":0,"528":0,"540":0,"542":0,"544":0,"545":0,"563":0,"569":0,"575":0,"594":0,"596":0,"606":0,"609":0,"610":0,"624":0,"625":0,"628":0,"632":0,"633":0,"635":0,"636":0,"638":0,"641":0,"643":0,"647":0,"651":0,"663":0,"666":0,"667":0,"670":0,"671":0,"673":0,"674":0,"685":0,"686":0,"689":0,"690":0,"692":0,"693":0,"706":0,"710":0,"711":0,"714":0,"715":0,"717":0,"718":0,"719":0,"731":0,"733":0,"734":0,"746":0,"748":0,"749":0,"761":0,"763":0,"764":0,"765":0,"777":0,"782":0,"786":0,"787":0,"788":0,"790":0,"791":0,"796":0,"800":0,"802":0,"803":0,"804":0,"816":0,"818":0,"819":0,"822":0,"824":0,"825":0,"826":0,"838":0,"840":0,"841":0,"842":0,"854":0,"865":0,"871":0,"872":0,"875":0,"876":0,"879":0,"880":0,"885":0,"886":0,"891":0,"905":0,"907":0,"909":0,"910":0,"913":0,"914":0,"926":0,"928":0,"930":0,"931":0,"934":0,"935":0,"947":0,"958":0,"960":0,"962":0,"963":0,"965":0,"966":0,"981":0,"983":0,"984":0,"985":0,"987":0,"989":0,"990":0,"1002":0,"1039":0,"1074":0,"1091":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].functions = {"initializer:70":0,"(anonymous 2):84":0,"destructor:78":0,"getHTMLNode:102":0,"hide:116":0,"render:130":0,"renderChildren:169":0,"renderNode:220":0,"reposition:305":0,"show:344":0,"toggle:365":0,"_attachMenuEvents:377":0,"_detachMenuEvents:412":0,"(anonymous 3):429":0,"_getAncestorTestFn:426":0,"(anonymous 4):467":0,"_getAnchorRegion:464":0,"(anonymous 5):515":0,"_getSortedAnchorRegions:487":0,"_hideMenu:539":0,"_inRegion:562":0,"_positionMenu:593":0,"_afterAdd:622":0,"_afterClear:662":0,"_afterDocMouseDown:684":0,"_afterClose:705":0,"_afterDisable:730":0,"_afterEnable:745":0,"_afterHide:760":0,"_afterOpen:776":0,"_afterRemove:815":0,"_afterShow:837":0,"_afterVisibleChange:853":0,"_onItemClick:864":0,"(anonymous 6):913":0,"_onItemMouseEnter:904":0,"(anonymous 7):934":0,"_onItemMouseLeave:925":0,"_onMenuMouseEnter:946":0,"(anonymous 8):962":0,"_onMenuMouseLeave:957":0,"_defItemClickFn:980":0,"_defSpecificItemClickFn:1001":0,"valueFn:1038":0,"valueFn:1073":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].coveredLines = 238;
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].coveredFunctions = 46;
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
@extends Menu.Base
@uses View
**/

_yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 21);
var getClassName = Y.ClassNameManager.getClassName,

/**
Fired when any clickable menu item is clicked.

You can subscribe to clicks on a specific menu item by subscribing to
"itemClick#id", where "id" is the item id of the item you want to subscribe to.

@event itemClick
@param {Menu.Item} item Menu item that was clicked.
@param {EventFacade} originEvent Original click event.
@preventable _defItemClickFn
**/
EVT_ITEM_CLICK = 'itemClick',

Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {

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

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "initializer", 70);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 71);
this._openMenus = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 72);
this._published = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 73);
this._timeouts  = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 75);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "destructor", 78);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 79);
this._detachMenuEvents();

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 81);
delete this._openMenus;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 82);
delete this._published;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 84);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 2)", 84);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 85);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 88);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "getHTMLNode", 102);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 103);
if (!item._htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 104);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 107);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "hide", 116);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 117);
this.set('visible', false);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 118);
return this;
    },

    /**
    Renders this menu into its container.

    If the container hasn't already been added to the current document, it will
    be appended to the `<body>` element.

    @method render
    @chainable
    **/
    render: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "render", 130);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 131);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 133);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 136);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 137);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 139);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 142);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 146);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 147);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 150);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 152);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderChildren", 169);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 170);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 172);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 175);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 176);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 183);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 184);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 185);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 188);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 189);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 192);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 193);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 199);
if (container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 200);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 203);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderNode", 220);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 221);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 223);
var classNames = this.classNames,
            htmlNode   = item._htmlNode,
            isHidden   = item.isHidden();

        // Create an HTML node for this menu item if one doesn't already exist.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 228);
if (!htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 229);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        // Mark the HTML node as hidden if the item is hidden.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 237);
htmlNode.set('aria-hidden', isHidden);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 238);
htmlNode.toggleClass(classNames.hidden, isHidden);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 240);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 242);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 243);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 247);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 250);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 252);
if (!labelId) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 253);
labelId = Y.guid();
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 254);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 257);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 259);
if (item.type === 'heading') {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 260);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 262);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 264);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 266);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 267);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 268);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 270);
if (item.hasChildren()) {
                            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 271);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 273);
if (options.renderChildren) {
                                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 274);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 281);
break;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 284);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 285);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 288);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "reposition", 305);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 306);
var container = this.get('container'),
            anchorRegion, menuRegion;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 309);
if (Y.Lang.isArray(anchorPoint)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 310);
anchorRegion = {
                bottom: anchorPoint[1],
                left  : anchorPoint[0],
                right : anchorPoint[0],
                top   : anchorPoint[1]
            };
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 316);
if (anchorPoint._node) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 317);
anchorRegion = anchorPoint.get('region');
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 319);
anchorRegion = anchorPoint;
        }}

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 322);
menuRegion = this._getSortedAnchorRegions(
            this.get('alignments'),
            container.get('region'),
            anchorRegion
        )[0].region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 328);
container.setXY([menuRegion.left, menuRegion.top]);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 330);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "show", 344);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 345);
if (options && options.anchorPoint) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 346);
this.reposition(options.anchorPoint);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 349);
this.set('visible', true);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 350);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "toggle", 365);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 366);
return this[this.get('visible') ? 'hide' : 'show'](options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_attachMenuEvents", 377);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 378);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 380);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 383);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_detachMenuEvents", 412);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 413);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAncestorTestFn", 426);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 427);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 429);
return function (node) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 3)", 429);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 430);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAnchorRegion", 464);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 465);
var region = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 467);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 4)", 467);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 468);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 475);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 476);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 479);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 480);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 481);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 482);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 484);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getSortedAnchorRegions", 487);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 488);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 493);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 496);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 497);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 500);
if (point.point) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 501);
point = point.point;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 504);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 506);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 515);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 5)", 515);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 516);
if (a.score === b.score) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 517);
return 0;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 518);
if (a.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 519);
return -1;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 520);
if (b.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 521);
return 1;
            } else {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 523);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 528);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_hideMenu", 539);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 540);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 542);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 544);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 545);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_inRegion", 562);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 563);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 569);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 575);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_positionMenu", 593);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 594);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 596);
var childrenNode = htmlNode.one('.' + this.classNames.children),

            anchors = this._getSortedAnchorRegions(
                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),
                childrenNode.get('region'),
                htmlNode.get('region')
            );

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 606);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 609);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 610);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterAdd", 622);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 624);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 625);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 628);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 632);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 633);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 635);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 636);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 638);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 641);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 643);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 647);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 651);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClear", 662);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 663);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 666);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 667);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 670);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 671);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 673);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 674);
this.render();
    },

    /**
    Handles `mousedown` events on the document.

    @method _afterDocMouseDown
    @param {EventFacade} e
    @protected
    **/
    _afterDocMouseDown: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDocMouseDown", 684);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 685);
if (!this.get('visible')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 686);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 689);
if (!e.target.ancestor(this._getAncestorTestFn(), true)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 690);
this.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 692);
if (this.get('hideOnOutsideClick')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 693);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClose", 705);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 706);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 710);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 711);
item.children[i].close();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 714);
item.close();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 715);
delete this._openMenus[item.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 717);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 718);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 719);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDisable", 730);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 731);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 733);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 734);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterEnable", 745);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 746);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 748);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 749);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterHide", 760);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 761);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 763);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 764);
htmlNode.addClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 765);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterOpen", 776);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 777);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 782);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 786);
if (parent.isOpen()) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 787);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 788);
child = parent.children[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 790);
if (child !== item) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 791);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 796);
parent.open();
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 800);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 802);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 803);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 804);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterRemove", 815);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 816);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 818);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 819);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 822);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 824);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 825);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 826);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterShow", 837);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 838);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 840);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 841);
htmlNode.removeClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 842);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterVisibleChange", 853);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 854);
this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemClick", 864);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 865);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 871);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 872);
e.preventDefault();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 875);
if (isDisabled) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 876);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 879);
if (!this._published[eventName]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 880);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            }) ;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 885);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 886);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 891);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseEnter", 904);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 905);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 907);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 909);
if (item.isOpen() || item.isDisabled()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 910);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 913);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 6)", 913);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 914);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseLeave", 925);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 926);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 928);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 930);
if (!item.isOpen()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 931);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 934);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 7)", 934);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 935);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseEnter", 946);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 947);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseLeave", 957);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 958);
var self = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 960);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 962);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 8)", 962);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 963);
self.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 965);
if (self.get('hideOnMouseLeave')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 966);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defItemClickFn", 980);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 981);
var item = e.item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 983);
if (item.canHaveChildren) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 984);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 985);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 987);
e.item.toggle();
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 989);
this.closeSubMenus();
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 990);
this.hide();
        }
    },

    /**
    Default handler for item-specific `itemClick#<id>` events.

    @method _defSpecificItemClickFn
    @param {EventFacade} e
    @protected
    **/
    _defSpecificItemClickFn: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defSpecificItemClickFn", 1001);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1002);
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
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1038);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1039);
return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];
            }
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
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1073);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1074);
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

_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1091);
Y.Menu = Y.mix(Menu, Y.Menu);


}, '@VERSION@', {
    "requires": [
        "classnamemanager",
        "event-hover",
        "gallery-sm-menu-base",
        "gallery-sm-menu-templates",
        "node-screen",
        "view"
    ],
    "skinnable": true
});
