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
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].code=["YUI.add('gallery-sm-menu', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","/**","Provides the `Y.Menu` widget.","","@module gallery-sm-menu","@main gallery-sm-menu","**/","","/**","Menu widget.","","@class Menu","@constructor","@param {HTMLElement|Node|String} [sourceNode] Node instance, HTML element, or","    selector string for a node (usually a `<ul>` or `<ol>`) whose structure","    should be parsed and used to generate this menu's contents. This node will","    be removed from the DOM after being parsed.","@extends Menu.Base","@uses View","**/","","var doc          = Y.config.doc,","    getClassName = Y.ClassNameManager.getClassName;","","/**","Fired when any clickable menu item is clicked.","","You can subscribe to clicks on a specific menu item by subscribing to","\"itemClick#id\", where \"id\" is the item id of the item you want to subscribe to.","","@event itemClick","@param {Menu.Item} item Menu item that was clicked.","@param {EventFacade} originEvent Original click event.","@preventable _defItemClickFn","**/","var EVT_ITEM_CLICK = 'itemClick';","","var Menu = Y.Base.create('menu', Y.Menu.Base, [Y.View], {","","    /**","    CSS class names used by this menu.","","    @property {Object} classNames","    **/","    classNames: {","        canHaveChildren: getClassName('menu-can-have-children'),","        children       : getClassName('menu-children'),","        disabled       : getClassName('menu-disabled'),","        hasChildren    : getClassName('menu-has-children'),","        heading        : getClassName('menu-heading'),","        hidden         : getClassName('menu-hidden'),","        item           : getClassName('menu-item'),","        label          : getClassName('menu-label'),","        menu           : getClassName('menu'),","        noTouch        : getClassName('menu-notouch'),","        open           : getClassName('menu-open'),","        selected       : getClassName('menu-selected'),","        separator      : getClassName('menu-separator'),","        touch          : getClassName('menu-touch')","    },","","    /**","    Whether or not this menu has been rendered.","","    @property {Boolean} rendered","    @default false","    **/","    rendered: false,","","    /**","    Selectors to use when parsing a menu structure from a DOM structure via","    `parseHTML()`.","","    @property {Object} sourceSelectors","    **/","    sourceSelectors: {","        item   : '> li',","        label  : '> a, > span',","        subtree: '> ul, > ol'","    },","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function (config) {","        this._openMenus = {};","        this._published = {};","        this._timeouts  = {};","","        if (config && config.sourceNode) {","            config.nodes = (config.nodes || []).concat(","                this.parseHTML(config.sourceNode));","","            Y.one(config.sourceNode).remove(true);","        }","","        this._attachMenuEvents();","    },","","    destructor: function () {","        this._detachMenuEvents();","","        delete this._openMenus;","        delete this._published;","","        Y.Object.each(this._timeouts, function (timeout) {","            clearTimeout(timeout);","        }, this);","","        delete this._timeouts;","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the HTML node (as a `Y.Node` instance) associated with the specified","    menu item, if any.","","    @method getHTMLNode","    @param {Menu.Item} item Menu item.","    @return {Node} `Y.Node` instance associated with the given tree node, or","        `undefined` if one was not found.","    **/","    getHTMLNode: function (item) {","        if (!item._htmlNode) {","            item._htmlNode = this.get('container').one('#' + item.id);","        }","","        return item._htmlNode;","    },","","    /**","    Hides this menu.","","    @method hide","    @chainable","    **/","    hide: function () {","        this.set('visible', false);","        return this;","    },","","    /**","    Parses the specified HTML _sourceNode_ as a menu structure and returns an","    array of menu item objects that can be used to generate a menu with that","    structure.","","    By default, _sourceNode_ is expected to contain one `<li>` element per","    menu item, and submenus are expected to be represented by `<ul>` or `<ol>`","    elements.","","    The selector queries used to parse the menu structure are contained in the","    `sourceSelectors` property, and may be customized. Class names specified in","    the `classNames` property are used to determine whether a menu item should","    be disabled, hidden, or treated as a heading or separator.","","    @method parseHTML","    @param {HTMLElement|Node|String} sourceNode Node instance, HTML element, or","        selector string for the node (usually a `<ul> or `<ol>` element) to","        parse.","    @return {Object[]} Array of menu item objects.","    **/","    parseHTML: function (sourceNode) {","        sourceNode = Y.one(sourceNode);","","        var classNames = this.classNames,","            items      = [],","            sel        = this.sourceSelectors,","            self       = this;","","        sourceNode.all(sel.item).each(function (itemNode) {","            var item        = {},","                itemEl      = itemNode._node,","                labelNode   = itemNode.one(sel.label),","                subTreeNode = itemNode.one(sel.subtree);","","            if (itemNode.hasClass(classNames.heading)) {","                item.type = 'heading';","            } else if (itemNode.hasClass(classNames.separator)) {","                item.type = 'separator';","            }","","            if (itemNode.hasClass(classNames.disabled)) {","                item.state || (item.state = {});","                item.state.disabled = true;","            }","","            if (itemNode.hasClass(classNames.hidden)) {","                item.state || (item.state = {});","                item.state.hidden = true;","            }","","            if (labelNode) {","                var href = labelNode.getAttribute('href');","","                item.label = labelNode.getHTML();","","                if (href && href !== '#') {","                    item.url = href;","                }","            } else {","                // The selector didn't find a label node, so look for the first","                // text child of the item element.","                var childEl;","","                for (var i = 0, len = itemEl.childNodes.length; i < len; i++) {","                    childEl = itemEl.childNodes[i];","","                    if (childEl.nodeType === doc.TEXT_NODE) {","                        item.label = Y.Escape.html(childEl.nodeValue);","                        break;","                    }","                }","            }","","            if (subTreeNode) {","                item.children = self.parseHTML(subTreeNode);","            }","","            items.push(item);","        });","","        return items;","    },","","    /**","    Renders this menu into its container.","","    If the container hasn't already been added to the current document, it will","    be appended to the `<body>` element.","","    @method render","    @chainable","    **/","    render: function () {","        var container = this.get('container');","","        container.addClass(this.classNames.menu);","","        // Detect touchscreen devices.","        if ('ontouchstart' in Y.config.win) {","            container.addClass(this.classNames.touch);","        } else {","            container.addClass(this.classNames.noTouch);","        }","","        this._childrenNode = this.renderChildren(this.rootNode, {","            container: container","        });","","        if (!container.inDoc()) {","            Y.one('body').append(container);","        }","","        this.rendered = true;","","        return this;","    },","","    /**","    Renders the children of the specified menu item.","","    If a container is specified, it will be assumed to be an existing rendered","    menu item, and the children will be rendered (or re-rendered) inside it.","","    @method renderChildren","    @param {Menu.Item} menuItem Menu item whose children should be rendered.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container into","            which the children should be rendered. If the container already","            contains rendered children, they will be re-rendered in place.","    @return {Node} `Y.Node` instance containing the rendered children.","    **/","    renderChildren: function (treeNode, options) {","        options || (options = {});","","        var container    = options.container,","            childrenNode = container && container.one('.' + this.classNames.children);","","        if (!childrenNode) {","            childrenNode = Y.Node.create(Menu.Templates.children({","                classNames: this.classNames,","                menu      : this,","                item      : treeNode","            }));","        }","","        if (treeNode.isRoot()) {","            childrenNode.set('tabIndex', 0); // Add the root list to the tab order.","            childrenNode.set('role', 'menu');","        }","","        if (treeNode.hasChildren()) {","            childrenNode.set('aria-expanded', treeNode.isOpen());","        }","","        for (var i = 0, len = treeNode.children.length; i < len; i++) {","            this.renderNode(treeNode.children[i], {","                container     : childrenNode,","                renderChildren: true","            });","        }","","        if (container) {","            container.append(childrenNode);","        }","","        return childrenNode;","    },","","    /**","    Renders the specified menu item and its children (if any).","","    If a container is specified, the rendered node will be appended to it.","","    @method renderNode","    @param {Menu.Item} menuItem Tree node to render.","    @param {Object} [options] Options.","        @param {Node} [options.container] `Y.Node` instance of a container to","            which the rendered tree node should be appended.","        @param {Boolean} [options.renderChildren=false] Whether or not to render","            this node's children.","    @return {Node} `Y.Node` instance of the rendered menu item.","    **/","    renderNode: function (item, options) {","        options || (options = {});","","        var classNames = this.classNames,","            htmlNode   = item._htmlNode,","            isHidden   = item.isHidden();","","        // Create an HTML node for this menu item if one doesn't already exist.","        if (!htmlNode) {","            htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({","                classNames: classNames,","                item      : item,","                menu      : this","            }));","        }","","        // Mark the HTML node as hidden if the item is hidden.","        htmlNode.set('aria-hidden', isHidden);","        htmlNode.toggleClass(classNames.hidden, isHidden);","","        switch (item.type) {","            case 'separator':","                htmlNode.set('role', 'separator');","                break;","","            case 'item':","            case 'heading':","                var labelNode = htmlNode.one('.' + classNames.label),","                    labelId   = labelNode.get('id');","","                labelNode.setHTML(item.label);","","                if (!labelId) {","                    labelId = Y.guid();","                    labelNode.set('id', labelId);","                }","","                htmlNode.set('aria-labelledby', labelId);","","                if (item.type === 'heading') {","                    htmlNode.set('role', 'heading');","                } else {","                    htmlNode.set('role', 'menuitem');","","                    htmlNode.toggleClass(classNames.disabled, item.isDisabled());","","                    if (item.canHaveChildren) {","                        htmlNode.addClass(classNames.canHaveChildren);","                        htmlNode.toggleClass(classNames.open, item.isOpen());","","                        if (item.hasChildren()) {","                            htmlNode.addClass(classNames.hasChildren);","","                            if (options.renderChildren) {","                                this.renderChildren(item, {","                                    container: htmlNode","                                });","                            }","                        }","                    }","                }","                break;","        }","","        if (options.container) {","            options.container.append(htmlNode);","        }","","        return htmlNode;","    },","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    @method reposition","    @param {Node|Number[]|Object} anchorPoint Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        var container = this.get('container'),","            anchorRegion, menuRegion;","","        if (Y.Lang.isArray(anchorPoint)) {","            anchorRegion = {","                bottom: anchorPoint[1],","                left  : anchorPoint[0],","                right : anchorPoint[0],","                top   : anchorPoint[1]","            };","        } else if (anchorPoint._node) {","            anchorRegion = anchorPoint.get('region');","        } else {","            anchorRegion = anchorPoint;","        }","","        menuRegion = this._getSortedAnchorRegions(","            this.get('alignments'),","            container.get('region'),","            anchorRegion","        )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    /**","    Shows this menu.","","    @method show","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    show: function (options) {","        if (options && options.anchorPoint) {","            this.reposition(options.anchorPoint);","        }","","        this.set('visible', true);","        return this;","    },","","    /**","    Toggles the visibility of this menu, showing it if it's currently hidden or","    hiding it if it's currently visible.","","    @method toggle","    @param {Object} [options] Options.","        @param {Node|Number[]|Object} [options.anchorPoint] Anchor point at","            which this menu should be positioned when shown. The point may be","            specified as a `Y.Node` reference, a region object, or an array of X","            and Y pixel coordinates.","    @chainable","    **/","    toggle: function (options) {","        return this[this.get('visible') ? 'hide' : 'show'](options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches menu events.","","    @method _attachMenuEvents","    @protected","    **/","    _attachMenuEvents: function () {","        this._menuEvents || (this._menuEvents = []);","","        var classNames = this.classNames,","            container  = this.get('container');","","        this._menuEvents.push(","            this.after({","                add          : this._afterAdd,","                clear        : this._afterClear,","                close        : this._afterClose,","                disable      : this._afterDisable,","                enable       : this._afterEnable,","                hide         : this._afterHide,","                open         : this._afterOpen,","                remove       : this._afterRemove,","                show         : this._afterShow,","                visibleChange: this._afterVisibleChange","            }),","","            container.on('hover', this._onMenuMouseEnter, this._onMenuMouseLeave, this),","","            container.delegate('click', this._onItemClick, '.' + classNames.item + '>.' + classNames.label, this),","            container.delegate('hover', this._onItemMouseEnter, this._onItemMouseLeave, '.' + classNames.canHaveChildren, this),","","            Y.one('doc').after('mousedown', this._afterDocMouseDown, this)","        );","    },","","    /**","    Detaches menu events.","","    @method _detachMenuEvents","    @protected","    **/","    _detachMenuEvents: function () {","        (new Y.EventHandle(this._menuEvents)).detach();","    },","","    /**","    Returns an efficient test function that can be passed to `Y.Node#ancestor()`","    to test whether a node is this menu's container.","","    This is broken out to make overriding easier in subclasses.","","    @method _getAncestorTestFn","    @return {Function} Test function.","    @protected","    **/","    _getAncestorTestFn: function () {","        var container = this.get('container');","","        return function (node) {","            return node === container;","        };","    },","","    /**","    Given an anchor point and the regions currently occupied by a child node","    (the node being anchored) and a parent node (the node being anchored to),","    returns a region object representing the coordinates the anchored node will","    occupy when anchored to the given point on the parent.","","    An anchor point is a string like \"tl-bl\", which means \"anchor the top left","    point of _nodeRegion_ to the bottom left point of _parentRegion_\".","","    Any combination of top/bottom/left/right anchor points may be used as long","    as they follow this format. Here are a few examples:","","      * `'bl-br'`: Anchor the bottom left of _nodeRegion_ to the bottom right of","        _parentRegion_.","      * `'br-bl'`: Anchor the bottom right of _nodeRegion_ to the bottom left of","        _parentRegion_.","      * `'tl-tr'`: Anchor the top left of _nodeRegion_ to the top right of","        _parentRegion_.","      * `'tr-tl'`: Anchor the top right of _nodeRegion_ to the top left of","        _parentRegion_.","","    @method _getAnchorRegion","    @param {String} anchor Anchor point. See above for details.","    @param {Object} nodeRegion Region object for the node to be anchored (that","        is, the node that will be repositioned).","    @param {Object} parentRegion Region object for the node that will be","        anchored to (that is, the node that will not move).","    @return {Object} Region that will be occupied by the anchored node.","    @protected","    **/","    _getAnchorRegion: function (anchor, nodeRegion, parentRegion) {","        var region = {};","","        anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {","            var lookup = {","                    b: 'bottom',","                    l: 'left',","                    r: 'right',","                    t: 'top'","                };","","            region[lookup[p1]] = parentRegion[lookup[p3]];","            region[lookup[p2]] = parentRegion[lookup[p4]];","        });","","        'bottom' in region || (region.bottom = region.top + nodeRegion.height);","        'left' in region   || (region.left = region.right - nodeRegion.width);","        'right' in region  || (region.right = region.left + nodeRegion.width);","        'top' in region    || (region.top = region.bottom - nodeRegion.height);","","        return region;","    },","","    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {","        containerRegion || (containerRegion = Y.DOM.viewportRegion());","","        // Run through each possible anchor point and test whether it would","        // allow the submenu to be displayed fully within the viewport. Stop at","        // the first anchor point that works.","        var anchors = [],","            i, len, point, region;","","        for (i = 0, len = points.length; i < len; i++) {","            point = points[i];","","            // Allow arrays of strings or arrays of objects like {point: '...'}.","            if (point.point) {","                point = point.point;","            }","","            region = this._getAnchorRegion(point, nodeRegion, parentRegion);","","            anchors.push({","                point : point,","                region: region,","                score : this._inRegion(region, containerRegion)","            });","        }","","        // Sort the anchors in descending order by score (higher score is","        // better).","        anchors.sort(function (a, b) {","            if (a.score === b.score) {","                return 0;","            } else if (a.score === true) {","                return -1;","            } else if (b.score === true) {","                return 1;","            } else {","                return b.score - a.score;","            }","        });","","        // Return the sorted anchors.","        return anchors;","    },","","    /**","    Hides the specified menu container by moving its htmlNode offscreen.","","    @method _hideMenu","    @param {Menu.Item} item Menu item.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _hideMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children);","","        childrenNode.setXY([-10000, -10000]);","        delete item.data.menuAnchor;","    },","","    /**","    Returns `true` if the given _inner_ region is contained entirely within the","    given _outer_ region. If it's not a perfect fit, returns a numerical score","    indicating how much of the _inner_ region fits within the _outer_ region.","    A higher score indicates a better fit.","","    @method _inRegion","    @param {Object} inner Inner region.","    @param {Object} outer Outer region.","    @return {Boolean|Number} `true` if the _inner_ region fits entirely within","        the _outer_ region or, if not, a numerical score indicating how much of","        the inner region fits.","    @protected","    **/","    _inRegion: function (inner, outer) {","        if (inner.bottom <= outer.bottom","                && inner.left >= outer.left","                && inner.right <= outer.right","                && inner.top >= outer.top) {","","            // Perfect fit!","            return true;","        }","","        // Not a perfect fit, so return the overall score of this region so we","        // can compare it with the scores of other regions to determine the best","        // possible fit.","        return (","            Math.min(outer.bottom - inner.bottom, 0) +","            Math.min(inner.left - outer.left, 0) +","            Math.min(outer.right - inner.right, 0) +","            Math.min(inner.top - outer.top, 0)","        );","    },","","    /**","    Intelligently positions the _htmlNode_ of the given submenu _item_ relative","    to its parent so that as much as possible of the submenu will be visible","    within the viewport.","","    @method _positionMenu","    @param {Menu.Item} item Menu item to position.","    @param {Node} [htmlNode] HTML node for the menu item.","    @protected","    **/","    _positionMenu: function (item, htmlNode) {","        htmlNode || (htmlNode = this.getHTMLNode(item));","","        var childrenNode = htmlNode.one('.' + this.classNames.children),","","            anchors = this._getSortedAnchorRegions(","                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),","                childrenNode.get('region'),","                htmlNode.get('region')","            );","","        // Remember which anchors we used for this item so that we can default","        // that anchor for submenus of this item if necessary.","        item.data.menuAnchors = anchors;","","        // Position the submenu.","        var anchorRegion = anchors[0].region;","        childrenNode.setXY([anchorRegion.left, anchorRegion.top]);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `add` events for this menu.","","    @method _afterAdd","    @param {EventFacade} e","    @protected","    **/","    _afterAdd: function (e) {","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        var parent = e.parent,","            htmlChildrenNode,","            htmlNode;","","        if (parent === this.rootNode) {","            htmlChildrenNode = this._childrenNode;","        } else {","            htmlNode = this.getHTMLNode(parent);","            htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);","","            if (!htmlChildrenNode) {","                // Parent node hasn't been rendered yet, or hasn't yet been","                // rendered with children. Render it.","                htmlNode || (htmlNode = this.renderNode(parent));","","                this.renderChildren(parent, {","                    container: htmlNode","                });","","                return;","            }","        }","","        htmlChildrenNode.insert(this.renderNode(e.node, {","            renderChildren: true","        }), e.index);","    },","","    /**","    Handles `clear` events for this menu.","","    @method _afterClear","    @protected","    **/","    _afterClear: function () {","        this._openMenus = {};","","        // Nothing to do if the menu hasn't been rendered yet.","        if (!this.rendered) {","            return;","        }","","        delete this._childrenNode;","        this.rendered = false;","","        this.get('container').empty();","        this.render();","    },","","    /**","    Handles `mousedown` events on the document.","","    @method _afterDocMouseDown","    @param {EventFacade} e","    @protected","    **/","    _afterDocMouseDown: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        if (!e.target.ancestor(this._getAncestorTestFn(), true)) {","            this.closeSubMenus();","","            if (this.get('hideOnOutsideClick')) {","                this.hide();","            }","        }","    },","","    /**","    Handles `close` events for this menu.","","    @method _afterClose","    @param {EventFacade} e","    @protected","    **/","    _afterClose: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item);","","        // Ensure that all this item's children are closed first.","        for (var i = 0, len = item.children.length; i < len; i++) {","            item.children[i].close();","        }","","        item.close();","        delete this._openMenus[item.id];","","        if (htmlNode) {","            this._hideMenu(item, htmlNode);","            htmlNode.removeClass(this.classNames.open);","        }","    },","","    /**","    Handles `disable` events for this menu.","","    @method _afterDisable","    @param {EventFacade} e","    @protected","    **/","    _afterDisable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `enable` events for this menu.","","    @method _afterEnable","    @param {EventFacade} e","    @protected","    **/","    _afterEnable: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.disabled);","        }","    },","","    /**","    Handles `hide` events for this menu.","","    @method _afterHide","    @param {EventFacade} e","    @protected","    **/","    _afterHide: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.addClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', true);","        }","    },","","    /**","    Handles `open` events for this menu.","","    @method _afterOpen","    @param {EventFacade} e","    @protected","    **/","    _afterOpen: function (e) {","        var item     = e.node,","            htmlNode = this.getHTMLNode(item),","            parent   = item.parent,","            child;","","        if (parent) {","            // Close all the parent's children except this one. This is","            // necessary when mouse events don't fire to indicate that a submenu","            // should be closed, such as on touch devices.","            if (parent.isOpen()) {","                for (var i = 0, len = parent.children.length; i < len; i++) {","                    child = parent.children[i];","","                    if (child !== item) {","                        child.close();","                    }","                }","            } else {","                // Ensure that the parent is open before we open the submenu.","                parent.open();","            }","        }","","        this._openMenus[item.id] = item;","","        if (htmlNode) {","            this._positionMenu(item, htmlNode);","            htmlNode.addClass(this.classNames.open);","        }","    },","","    /**","    Handles `remove` events for this menu.","","    @method _afterRemove","    @param {EventFacade} e","    @protected","    **/","    _afterRemove: function (e) {","        delete this._openMenus[e.node.id];","","        if (!this.rendered) {","            return;","        }","","        var htmlNode = this.getHTMLNode(e.node);","","        if (htmlNode) {","            htmlNode.remove(true);","            delete e.node._htmlNode;","        }","    },","","    /**","    Handles `show` events for this menu.","","    @method _afterShow","    @param {EventFacade} e","    @protected","    **/","    _afterShow: function (e) {","        var htmlNode = this.getHTMLNode(e.item);","","        if (htmlNode) {","            htmlNode.removeClass(this.classNames.hidden);","            htmlNode.set('aria-hidden', false);","        }","    },","","    /**","    Handles `visibleChange` events for this menu.","","    @method _afterVisibleChange","    @param {EventFacade} e","    @protected","    **/","    _afterVisibleChange: function (e) {","        this.get('container').toggleClass(this.classNames.open, e.newVal);","    },","","    /**","    Handles click events on menu items.","","    @method _onItemClick","    @param {EventFacade} e","    @protected","    **/","    _onItemClick: function (e) {","        var item       = this.getNodeById(e.currentTarget.getData('item-id')),","            eventName  = EVT_ITEM_CLICK + '#' + item.id,","            isDisabled = item.isDisabled() || item.isHidden();","","        // Avoid navigating to '#' if this item is disabled or doesn't have a","        // custom URL.","        if (isDisabled || item.url === '#') {","            e.preventDefault();","        }","","        if (isDisabled) {","            return;","        }","","        if (!this._published[eventName]) {","            this._published[eventName] = this.publish(eventName, {","                defaultFn: this._defSpecificItemClickFn","            });","        }","","        if (!this._published[EVT_ITEM_CLICK]) {","            this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {","                defaultFn: this._defItemClickFn","            });","        }","","        this.fire(eventName, {","            originEvent: e,","            item       : item","        });","    },","","    /**","    Handles delegated `mouseenter` events on menu items.","","    @method _onItemMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseEnter: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (item.isOpen() || item.isDisabled()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.open();","        }, 200); // TODO: make timeouts configurable","    },","","    /**","    Handles delegated `mouseleave` events on menu items.","","    @method _onItemMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onItemMouseLeave: function (e) {","        var item = this.getNodeById(e.currentTarget.get('id'));","","        clearTimeout(this._timeouts.item);","","        if (!item.isOpen()) {","            return;","        }","","        this._timeouts.item = setTimeout(function () {","            item.close();","        }, 300);","    },","","    /**","    Handles `mouseenter` events on this menu.","","    @method _onMenuMouseEnter","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","    },","","    /**","    Handles `mouseleave` events on this menu.","","    @method _onMenuMouseLeave","    @param {EventFacade} e","    @protected","    **/","    _onMenuMouseLeave: function () {","        var self = this;","","        clearTimeout(this._timeouts.menu);","","        this._timeouts.menu = setTimeout(function () {","            self.closeSubMenus();","","            if (self.get('hideOnMouseLeave')) {","                self.hide();","            }","        }, 500);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the generic `itemClick` event.","","    @method _defItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defItemClickFn: function (e) {","        var item = e.item;","","        if (item.canHaveChildren) {","            clearTimeout(this._timeouts.item);","            clearTimeout(this._timeouts.menu);","","            e.item.toggle();","        } else if (this.get('hideOnClick')) {","            this.closeSubMenus();","            this.hide();","        }","    },","","    /**","    Default handler for item-specific `itemClick#<id>` events.","","    @method _defSpecificItemClickFn","    @param {EventFacade} e","    @protected","    **/","    _defSpecificItemClickFn: function (e) {","        this.fire(EVT_ITEM_CLICK, {","            originEvent: e.originEvent,","            item       : e.item","        });","    }","}, {","    ATTRS: {","        /**","        Preferred alignment positions at which this menu should be displayed","        relative to the anchor point when one is provided to the `show()`,","        `toggle()`, or `reposition()` methods.","","        The most optimal alignment position will be chosen automatically based","        on which one allows the most of this menu to be visible within the","        browser's viewport. If multiple positions are equally visible, then the","        optimal position will be chosen based on its order in this array.","","        An alignment position is a string like \"tl-bl\", which means \"align the","        top left of this menu to the bottom left of its anchor point\".","","        Any combination of top/bottom/left/right alignment positions may be used","        as long as they follow this format. Here are a few examples:","","          * `'bl-br'`: Align the bottom left of this menu with the bottom right","            of the anchor point.","          * `'br-bl'`: Align the bottom right of this menu with the bottom left","            of the anchor point.","          * `'tl-tr'`: Align the top left of this menu with the top right of","            the anchor point.","          * `'tr-tl'`: Align the top right of this menu to the top left of this","            anchor point.","","        @attribute {String[]} alignments","        @default ['tl-bl', 'tr-br', 'bl-tl', 'br-tr']","        **/","        alignments: {","            valueFn: function () {","                return ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'];","            }","        },","","        /**","        If `true`, this menu will be hidden when the user clicks on a menu item","        that doesn't contain a submenu.","","        @attribute {Boolean} hideOnClick","        @default true","        **/","        hideOnClick: {","            value: true","        },","","        /**","        If `true`, this menu will be hidden when the user moves the mouse","        outside the menu.","","        @attribute {Boolean} hideOnMouseLeave","        @default false","        **/","        hideOnMouseLeave: {","            value: false","        },","","        /**","        If `true`, this menu will be hidden when the user clicks somewhere","        outside the menu.","","        @attribute {Boolean} hideOnOutsideClick","        @default true","        **/","        hideOnOutsideClick: {","            value: true","        },","","        /**","        Just like `alignments`, but for submenus of this menu. See the","        `alignments` attribute for details on how alignment positions work.","","        @attribute {String[]} subMenuAlignments","        @default ['tl-tr', 'bl-br', 'tr-tl', 'br-bl']","        **/","        subMenuAlignments: {","            valueFn: function () {","                return ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'];","            }","        },","","        /**","        Whether or not this menu is visible. Changing this attribute's value","        will also change the visibility of this menu.","","        @attribute {Boolean} visible","        @default false","        **/","        visible: {","            value: false","        }","    }","});","","Y.Menu = Y.mix(Menu, Y.Menu);","","","}, '@VERSION@', {","    \"requires\": [","        \"classnamemanager\",","        \"event-hover\",","        \"gallery-sm-menu-base\",","        \"gallery-sm-menu-templates\",","        \"node-screen\",","        \"view\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].lines = {"1":0,"25":0,"39":0,"41":0,"88":0,"89":0,"90":0,"92":0,"93":0,"96":0,"99":0,"103":0,"105":0,"106":0,"108":0,"109":0,"112":0,"127":0,"128":0,"131":0,"141":0,"142":0,"166":0,"168":0,"173":0,"174":0,"179":0,"180":0,"181":0,"182":0,"185":0,"186":0,"187":0,"190":0,"191":0,"192":0,"195":0,"196":0,"198":0,"200":0,"201":0,"206":0,"208":0,"209":0,"211":0,"212":0,"213":0,"218":0,"219":0,"222":0,"225":0,"238":0,"240":0,"243":0,"244":0,"246":0,"249":0,"253":0,"254":0,"257":0,"259":0,"277":0,"279":0,"282":0,"283":0,"290":0,"291":0,"292":0,"295":0,"296":0,"299":0,"300":0,"306":0,"307":0,"310":0,"328":0,"330":0,"335":0,"336":0,"344":0,"345":0,"347":0,"349":0,"350":0,"354":0,"357":0,"359":0,"360":0,"361":0,"364":0,"366":0,"367":0,"369":0,"371":0,"373":0,"374":0,"375":0,"377":0,"378":0,"380":0,"381":0,"388":0,"391":0,"392":0,"395":0,"413":0,"416":0,"417":0,"423":0,"424":0,"426":0,"429":0,"435":0,"437":0,"452":0,"453":0,"456":0,"457":0,"473":0,"485":0,"487":0,"490":0,"520":0,"534":0,"536":0,"537":0,"572":0,"574":0,"575":0,"582":0,"583":0,"586":0,"587":0,"588":0,"589":0,"591":0,"595":0,"600":0,"603":0,"604":0,"607":0,"608":0,"611":0,"613":0,"622":0,"623":0,"624":0,"625":0,"626":0,"627":0,"628":0,"630":0,"635":0,"647":0,"649":0,"651":0,"652":0,"670":0,"676":0,"682":0,"701":0,"703":0,"713":0,"716":0,"717":0,"731":0,"732":0,"735":0,"739":0,"740":0,"742":0,"743":0,"745":0,"748":0,"750":0,"754":0,"758":0,"770":0,"773":0,"774":0,"777":0,"778":0,"780":0,"781":0,"792":0,"793":0,"796":0,"797":0,"799":0,"800":0,"813":0,"817":0,"818":0,"821":0,"822":0,"824":0,"825":0,"826":0,"838":0,"840":0,"841":0,"853":0,"855":0,"856":0,"868":0,"870":0,"871":0,"872":0,"884":0,"889":0,"893":0,"894":0,"895":0,"897":0,"898":0,"903":0,"907":0,"909":0,"910":0,"911":0,"923":0,"925":0,"926":0,"929":0,"931":0,"932":0,"933":0,"945":0,"947":0,"948":0,"949":0,"961":0,"972":0,"978":0,"979":0,"982":0,"983":0,"986":0,"987":0,"992":0,"993":0,"998":0,"1012":0,"1014":0,"1016":0,"1017":0,"1020":0,"1021":0,"1033":0,"1035":0,"1037":0,"1038":0,"1041":0,"1042":0,"1054":0,"1065":0,"1067":0,"1069":0,"1070":0,"1072":0,"1073":0,"1088":0,"1090":0,"1091":0,"1092":0,"1094":0,"1095":0,"1096":0,"1097":0,"1109":0,"1146":0,"1192":0,"1209":0};
_yuitest_coverage["build/gallery-sm-menu/gallery-sm-menu.js"].functions = {"initializer:87":0,"(anonymous 2):108":0,"destructor:102":0,"getHTMLNode:126":0,"hide:140":0,"(anonymous 3):173":0,"parseHTML:165":0,"render:237":0,"renderChildren:276":0,"renderNode:327":0,"reposition:412":0,"show:451":0,"toggle:472":0,"_attachMenuEvents:484":0,"_detachMenuEvents:519":0,"(anonymous 4):536":0,"_getAncestorTestFn:533":0,"(anonymous 5):574":0,"_getAnchorRegion:571":0,"(anonymous 6):622":0,"_getSortedAnchorRegions:594":0,"_hideMenu:646":0,"_inRegion:669":0,"_positionMenu:700":0,"_afterAdd:729":0,"_afterClear:769":0,"_afterDocMouseDown:791":0,"_afterClose:812":0,"_afterDisable:837":0,"_afterEnable:852":0,"_afterHide:867":0,"_afterOpen:883":0,"_afterRemove:922":0,"_afterShow:944":0,"_afterVisibleChange:960":0,"_onItemClick:971":0,"(anonymous 7):1020":0,"_onItemMouseEnter:1011":0,"(anonymous 8):1041":0,"_onItemMouseLeave:1032":0,"_onMenuMouseEnter:1053":0,"(anonymous 9):1069":0,"_onMenuMouseLeave:1064":0,"_defItemClickFn:1087":0,"_defSpecificItemClickFn:1108":0,"valueFn:1145":0,"valueFn:1191":0,"(anonymous 1):1":0};
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
@param {HTMLElement|Node|String} [sourceNode] Node instance, HTML element, or
    selector string for a node (usually a `<ul>` or `<ol>`) whose structure
    should be parsed and used to generate this menu's contents. This node will
    be removed from the DOM after being parsed.
@extends Menu.Base
@uses View
**/

_yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 25);
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
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 39);
var EVT_ITEM_CLICK = 'itemClick';

_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 41);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "initializer", 87);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 88);
this._openMenus = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 89);
this._published = {};
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 90);
this._timeouts  = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 92);
if (config && config.sourceNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 93);
config.nodes = (config.nodes || []).concat(
                this.parseHTML(config.sourceNode));

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 96);
Y.one(config.sourceNode).remove(true);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 99);
this._attachMenuEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "destructor", 102);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 103);
this._detachMenuEvents();

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 105);
delete this._openMenus;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 106);
delete this._published;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 108);
Y.Object.each(this._timeouts, function (timeout) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 2)", 108);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 109);
clearTimeout(timeout);
        }, this);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 112);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "getHTMLNode", 126);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 127);
if (!item._htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 128);
item._htmlNode = this.get('container').one('#' + item.id);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 131);
return item._htmlNode;
    },

    /**
    Hides this menu.

    @method hide
    @chainable
    **/
    hide: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "hide", 140);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 141);
this.set('visible', false);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 142);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "parseHTML", 165);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 166);
sourceNode = Y.one(sourceNode);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 168);
var classNames = this.classNames,
            items      = [],
            sel        = this.sourceSelectors,
            self       = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 173);
sourceNode.all(sel.item).each(function (itemNode) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 3)", 173);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 174);
var item        = {},
                itemEl      = itemNode._node,
                labelNode   = itemNode.one(sel.label),
                subTreeNode = itemNode.one(sel.subtree);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 179);
if (itemNode.hasClass(classNames.heading)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 180);
item.type = 'heading';
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 181);
if (itemNode.hasClass(classNames.separator)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 182);
item.type = 'separator';
            }}

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 185);
if (itemNode.hasClass(classNames.disabled)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 186);
item.state || (item.state = {});
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 187);
item.state.disabled = true;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 190);
if (itemNode.hasClass(classNames.hidden)) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 191);
item.state || (item.state = {});
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 192);
item.state.hidden = true;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 195);
if (labelNode) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 196);
var href = labelNode.getAttribute('href');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 198);
item.label = labelNode.getHTML();

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 200);
if (href && href !== '#') {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 201);
item.url = href;
                }
            } else {
                // The selector didn't find a label node, so look for the first
                // text child of the item element.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 206);
var childEl;

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 208);
for (var i = 0, len = itemEl.childNodes.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 209);
childEl = itemEl.childNodes[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 211);
if (childEl.nodeType === doc.TEXT_NODE) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 212);
item.label = Y.Escape.html(childEl.nodeValue);
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 213);
break;
                    }
                }
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 218);
if (subTreeNode) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 219);
item.children = self.parseHTML(subTreeNode);
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 222);
items.push(item);
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 225);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "render", 237);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 238);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 240);
container.addClass(this.classNames.menu);

        // Detect touchscreen devices.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 243);
if ('ontouchstart' in Y.config.win) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 244);
container.addClass(this.classNames.touch);
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 246);
container.addClass(this.classNames.noTouch);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 249);
this._childrenNode = this.renderChildren(this.rootNode, {
            container: container
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 253);
if (!container.inDoc()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 254);
Y.one('body').append(container);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 257);
this.rendered = true;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 259);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderChildren", 276);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 277);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 279);
var container    = options.container,
            childrenNode = container && container.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 282);
if (!childrenNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 283);
childrenNode = Y.Node.create(Menu.Templates.children({
                classNames: this.classNames,
                menu      : this,
                item      : treeNode
            }));
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 290);
if (treeNode.isRoot()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 291);
childrenNode.set('tabIndex', 0); // Add the root list to the tab order.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 292);
childrenNode.set('role', 'menu');
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 295);
if (treeNode.hasChildren()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 296);
childrenNode.set('aria-expanded', treeNode.isOpen());
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 299);
for (var i = 0, len = treeNode.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 300);
this.renderNode(treeNode.children[i], {
                container     : childrenNode,
                renderChildren: true
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 306);
if (container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 307);
container.append(childrenNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 310);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "renderNode", 327);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 328);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 330);
var classNames = this.classNames,
            htmlNode   = item._htmlNode,
            isHidden   = item.isHidden();

        // Create an HTML node for this menu item if one doesn't already exist.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 335);
if (!htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 336);
htmlNode = item._htmlNode = Y.Node.create(Menu.Templates.item({
                classNames: classNames,
                item      : item,
                menu      : this
            }));
        }

        // Mark the HTML node as hidden if the item is hidden.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 344);
htmlNode.set('aria-hidden', isHidden);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 345);
htmlNode.toggleClass(classNames.hidden, isHidden);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 347);
switch (item.type) {
            case 'separator':
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 349);
htmlNode.set('role', 'separator');
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 350);
break;

            case 'item':
            case 'heading':
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 354);
var labelNode = htmlNode.one('.' + classNames.label),
                    labelId   = labelNode.get('id');

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 357);
labelNode.setHTML(item.label);

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 359);
if (!labelId) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 360);
labelId = Y.guid();
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 361);
labelNode.set('id', labelId);
                }

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 364);
htmlNode.set('aria-labelledby', labelId);

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 366);
if (item.type === 'heading') {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 367);
htmlNode.set('role', 'heading');
                } else {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 369);
htmlNode.set('role', 'menuitem');

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 371);
htmlNode.toggleClass(classNames.disabled, item.isDisabled());

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 373);
if (item.canHaveChildren) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 374);
htmlNode.addClass(classNames.canHaveChildren);
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 375);
htmlNode.toggleClass(classNames.open, item.isOpen());

                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 377);
if (item.hasChildren()) {
                            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 378);
htmlNode.addClass(classNames.hasChildren);

                            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 380);
if (options.renderChildren) {
                                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 381);
this.renderChildren(item, {
                                    container: htmlNode
                                });
                            }
                        }
                    }
                }
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 388);
break;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 391);
if (options.container) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 392);
options.container.append(htmlNode);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 395);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "reposition", 412);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 413);
var container = this.get('container'),
            anchorRegion, menuRegion;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 416);
if (Y.Lang.isArray(anchorPoint)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 417);
anchorRegion = {
                bottom: anchorPoint[1],
                left  : anchorPoint[0],
                right : anchorPoint[0],
                top   : anchorPoint[1]
            };
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 423);
if (anchorPoint._node) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 424);
anchorRegion = anchorPoint.get('region');
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 426);
anchorRegion = anchorPoint;
        }}

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 429);
menuRegion = this._getSortedAnchorRegions(
            this.get('alignments'),
            container.get('region'),
            anchorRegion
        )[0].region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 435);
container.setXY([menuRegion.left, menuRegion.top]);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 437);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "show", 451);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 452);
if (options && options.anchorPoint) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 453);
this.reposition(options.anchorPoint);
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 456);
this.set('visible', true);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 457);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "toggle", 472);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 473);
return this[this.get('visible') ? 'hide' : 'show'](options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches menu events.

    @method _attachMenuEvents
    @protected
    **/
    _attachMenuEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_attachMenuEvents", 484);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 485);
this._menuEvents || (this._menuEvents = []);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 487);
var classNames = this.classNames,
            container  = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 490);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_detachMenuEvents", 519);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 520);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAncestorTestFn", 533);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 534);
var container = this.get('container');

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 536);
return function (node) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 4)", 536);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 537);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getAnchorRegion", 571);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 572);
var region = {};

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 574);
anchor.replace(/^([bt])([lr])-([bt])([lr])/i, function (match, p1, p2, p3, p4) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 5)", 574);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 575);
var lookup = {
                    b: 'bottom',
                    l: 'left',
                    r: 'right',
                    t: 'top'
                };

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 582);
region[lookup[p1]] = parentRegion[lookup[p3]];
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 583);
region[lookup[p2]] = parentRegion[lookup[p4]];
        });

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 586);
'bottom' in region || (region.bottom = region.top + nodeRegion.height);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 587);
'left' in region   || (region.left = region.right - nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 588);
'right' in region  || (region.right = region.left + nodeRegion.width);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 589);
'top' in region    || (region.top = region.bottom - nodeRegion.height);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 591);
return region;
    },

    _getSortedAnchorRegions: function (points, nodeRegion, parentRegion, containerRegion) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_getSortedAnchorRegions", 594);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 595);
containerRegion || (containerRegion = Y.DOM.viewportRegion());

        // Run through each possible anchor point and test whether it would
        // allow the submenu to be displayed fully within the viewport. Stop at
        // the first anchor point that works.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 600);
var anchors = [],
            i, len, point, region;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 603);
for (i = 0, len = points.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 604);
point = points[i];

            // Allow arrays of strings or arrays of objects like {point: '...'}.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 607);
if (point.point) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 608);
point = point.point;
            }

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 611);
region = this._getAnchorRegion(point, nodeRegion, parentRegion);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 613);
anchors.push({
                point : point,
                region: region,
                score : this._inRegion(region, containerRegion)
            });
        }

        // Sort the anchors in descending order by score (higher score is
        // better).
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 622);
anchors.sort(function (a, b) {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 6)", 622);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 623);
if (a.score === b.score) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 624);
return 0;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 625);
if (a.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 626);
return -1;
            } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 627);
if (b.score === true) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 628);
return 1;
            } else {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 630);
return b.score - a.score;
            }}}
        });

        // Return the sorted anchors.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 635);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_hideMenu", 646);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 647);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 649);
var childrenNode = htmlNode.one('.' + this.classNames.children);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 651);
childrenNode.setXY([-10000, -10000]);
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 652);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_inRegion", 669);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 670);
if (inner.bottom <= outer.bottom
                && inner.left >= outer.left
                && inner.right <= outer.right
                && inner.top >= outer.top) {

            // Perfect fit!
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 676);
return true;
        }

        // Not a perfect fit, so return the overall score of this region so we
        // can compare it with the scores of other regions to determine the best
        // possible fit.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 682);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_positionMenu", 700);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 701);
htmlNode || (htmlNode = this.getHTMLNode(item));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 703);
var childrenNode = htmlNode.one('.' + this.classNames.children),

            anchors = this._getSortedAnchorRegions(
                (item.parent && item.parent.data.menuAnchors) || this.get('subMenuAlignments'),
                childrenNode.get('region'),
                htmlNode.get('region')
            );

        // Remember which anchors we used for this item so that we can default
        // that anchor for submenus of this item if necessary.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 713);
item.data.menuAnchors = anchors;

        // Position the submenu.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 716);
var anchorRegion = anchors[0].region;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 717);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterAdd", 729);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 731);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 732);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 735);
var parent = e.parent,
            htmlChildrenNode,
            htmlNode;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 739);
if (parent === this.rootNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 740);
htmlChildrenNode = this._childrenNode;
        } else {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 742);
htmlNode = this.getHTMLNode(parent);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 743);
htmlChildrenNode = htmlNode && htmlNode.one('.' + this.classNames.children);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 745);
if (!htmlChildrenNode) {
                // Parent node hasn't been rendered yet, or hasn't yet been
                // rendered with children. Render it.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 748);
htmlNode || (htmlNode = this.renderNode(parent));

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 750);
this.renderChildren(parent, {
                    container: htmlNode
                });

                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 754);
return;
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 758);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClear", 769);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 770);
this._openMenus = {};

        // Nothing to do if the menu hasn't been rendered yet.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 773);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 774);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 777);
delete this._childrenNode;
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 778);
this.rendered = false;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 780);
this.get('container').empty();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 781);
this.render();
    },

    /**
    Handles `mousedown` events on the document.

    @method _afterDocMouseDown
    @param {EventFacade} e
    @protected
    **/
    _afterDocMouseDown: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDocMouseDown", 791);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 792);
if (!this.get('visible')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 793);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 796);
if (!e.target.ancestor(this._getAncestorTestFn(), true)) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 797);
this.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 799);
if (this.get('hideOnOutsideClick')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 800);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterClose", 812);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 813);
var item     = e.node,
            htmlNode = this.getHTMLNode(item);

        // Ensure that all this item's children are closed first.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 817);
for (var i = 0, len = item.children.length; i < len; i++) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 818);
item.children[i].close();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 821);
item.close();
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 822);
delete this._openMenus[item.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 824);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 825);
this._hideMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 826);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterDisable", 837);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 838);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 840);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 841);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterEnable", 852);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 853);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 855);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 856);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterHide", 867);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 868);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 870);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 871);
htmlNode.addClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 872);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterOpen", 883);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 884);
var item     = e.node,
            htmlNode = this.getHTMLNode(item),
            parent   = item.parent,
            child;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 889);
if (parent) {
            // Close all the parent's children except this one. This is
            // necessary when mouse events don't fire to indicate that a submenu
            // should be closed, such as on touch devices.
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 893);
if (parent.isOpen()) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 894);
for (var i = 0, len = parent.children.length; i < len; i++) {
                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 895);
child = parent.children[i];

                    _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 897);
if (child !== item) {
                        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 898);
child.close();
                    }
                }
            } else {
                // Ensure that the parent is open before we open the submenu.
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 903);
parent.open();
            }
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 907);
this._openMenus[item.id] = item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 909);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 910);
this._positionMenu(item, htmlNode);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 911);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterRemove", 922);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 923);
delete this._openMenus[e.node.id];

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 925);
if (!this.rendered) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 926);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 929);
var htmlNode = this.getHTMLNode(e.node);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 931);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 932);
htmlNode.remove(true);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 933);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterShow", 944);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 945);
var htmlNode = this.getHTMLNode(e.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 947);
if (htmlNode) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 948);
htmlNode.removeClass(this.classNames.hidden);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 949);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_afterVisibleChange", 960);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 961);
this.get('container').toggleClass(this.classNames.open, e.newVal);
    },

    /**
    Handles click events on menu items.

    @method _onItemClick
    @param {EventFacade} e
    @protected
    **/
    _onItemClick: function (e) {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemClick", 971);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 972);
var item       = this.getNodeById(e.currentTarget.getData('item-id')),
            eventName  = EVT_ITEM_CLICK + '#' + item.id,
            isDisabled = item.isDisabled() || item.isHidden();

        // Avoid navigating to '#' if this item is disabled or doesn't have a
        // custom URL.
        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 978);
if (isDisabled || item.url === '#') {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 979);
e.preventDefault();
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 982);
if (isDisabled) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 983);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 986);
if (!this._published[eventName]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 987);
this._published[eventName] = this.publish(eventName, {
                defaultFn: this._defSpecificItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 992);
if (!this._published[EVT_ITEM_CLICK]) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 993);
this._published[EVT_ITEM_CLICK] = this.publish(EVT_ITEM_CLICK, {
                defaultFn: this._defItemClickFn
            });
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 998);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseEnter", 1011);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1012);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1014);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1016);
if (item.isOpen() || item.isDisabled()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1017);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1020);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 7)", 1020);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1021);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onItemMouseLeave", 1032);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1033);
var item = this.getNodeById(e.currentTarget.get('id'));

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1035);
clearTimeout(this._timeouts.item);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1037);
if (!item.isOpen()) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1038);
return;
        }

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1041);
this._timeouts.item = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 8)", 1041);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1042);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseEnter", 1053);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1054);
clearTimeout(this._timeouts.menu);
    },

    /**
    Handles `mouseleave` events on this menu.

    @method _onMenuMouseLeave
    @param {EventFacade} e
    @protected
    **/
    _onMenuMouseLeave: function () {
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_onMenuMouseLeave", 1064);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1065);
var self = this;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1067);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1069);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "(anonymous 9)", 1069);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1070);
self.closeSubMenus();

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1072);
if (self.get('hideOnMouseLeave')) {
                _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1073);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defItemClickFn", 1087);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1088);
var item = e.item;

        _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1090);
if (item.canHaveChildren) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1091);
clearTimeout(this._timeouts.item);
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1092);
clearTimeout(this._timeouts.menu);

            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1094);
e.item.toggle();
        } else {_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1095);
if (this.get('hideOnClick')) {
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1096);
this.closeSubMenus();
            _yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1097);
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
        _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "_defSpecificItemClickFn", 1108);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1109);
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
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1145);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1146);
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
                _yuitest_coverfunc("build/gallery-sm-menu/gallery-sm-menu.js", "valueFn", 1191);
_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1192);
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

_yuitest_coverline("build/gallery-sm-menu/gallery-sm-menu.js", 1209);
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
