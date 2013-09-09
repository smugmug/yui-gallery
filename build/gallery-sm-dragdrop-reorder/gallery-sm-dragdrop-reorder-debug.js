YUI.add('gallery-sm-dragdrop-reorder', function (Y, NAME) {

/*jshint expr:true, onevar:false */

/**
Provides the `Plugin.DragDrop.Reorder` class, a `DragDrop` plugin that adds
drag-to-reorder functionality to a collection of nodes.

@module gallery-sm-dragdrop
@submodule gallery-sm-dragdrop-reorder
**/

/**
A plugin for `DragDrop` that adds drag-to-reorder functionality to a collection
of nodes.

@class Plugin.DragDrop.Reorder
@extends Plugin.Base
@constructor
**/

var getClassName = Y.ClassNameManager.getClassName;

/**
Fired after a drop occurs that results in reorderable nodes being reordered.

@event reorder
@param {Boolean} above `true` if _dragNode_ was dropped above the center of
    _node_.
@param {Boolean} after `true` if _dragNode_ was dropped after _node_.
@param {Boolean} before `true` if _dragNode_ was dropped before _node_.
@param {Boolean} below `true` if _dragNode_ was dropped below the center of
    _node_.
@param {Number[]} deltaXY Number of pixels the pointer has moved on the X and Y
    axes since the drag operation began.
@param {Node} dragNode The node that was dropped.
@param {Boolean} inside `true` if _dragNode_ was dropped inside _node_.
@param {Boolean} left `true` if _dragNode_ was dropped left of the center of
    _node_.
@param {Node} node The reorderable node before or after which the pointer was
    positioned when the drop occurred.
@param {Number[]} pageXY Current X and Y coordinates of the pointer.
@param {Boolean} right `true` if _dragNode_ was dropped right of the center of
    _node_.
@param {Number[]} startXY X and Y coordinates of the pointer when the drag
    operation began.
@preventable _defReorderFn
**/
var EVT_REORDER = 'reorder';

/**
Fired when the pointer is positioned after a reorderable node during a drag
operation.

@event reorderafter
@param {Boolean} above `true` if the pointer is above the center of _node_.
@param {Boolean} below `true` if the pointer is below the center of _node_.
@param {Number[]} deltaXY Number of pixels the pointer has moved on the X and Y
    axes since the drag operation began.
@param {Node} dragNode The node being dragged.
@param {Boolean} inside `true` if the pointer is inside _node_.
@param {Boolean} left `true` if the pointer is left of the center of _node_.
@param {Node} node The reorderable node after which the pointer is currently
    positioned.
@param {Number[]} pageXY Current X and Y coordinates of the pointer.
@param {Boolean} right `true` if the pointer is right of the center of _node_.
@param {Number[]} startXY X and Y coordinates of the pointer when the drag
    operation began.
@preventable _defReorderAfterFn
**/
var EVT_REORDER_AFTER = 'reorderafter';

/**
Fired when the pointer is positioned before a reorderable node during a drag
operation.

@event reorderbefore
@param {Boolean} above `true` if the pointer is above the center of _node_.
@param {Boolean} below `true` if the pointer is below the center of _node_.
@param {Number[]} deltaXY Number of pixels the pointer has moved on the X and Y
    axes since the drag operation began.
@param {Node} dragNode The node being dragged.
@param {Boolean} inside `true` if the pointer is inside _node_.
@param {Boolean} left `true` if the pointer is left of the center of _node_.
@param {Node} node The reorderable node before which the pointer is currently
    positioned.
@param {Number[]} pageXY Current X and Y coordinates of the pointer.
@param {Boolean} right `true` if the pointer is right of the center of _node_.
@param {Number[]} startXY X and Y coordinates of the pointer when the drag
    operation began.
@preventable _defReorderBeforeFn
**/
var EVT_REORDER_BEFORE = 'reorderbefore';

/**
Fired when the reorderable phase of a drag operation ends.

This could occur because the drag operation itself ended, or because the pointer
was dragged outside the reorderable container. If the reorderable phase ended
without causing any items to be reordered, the `canceled` property on this
event's facade will be `true`.

@event reorderend
@param {Boolean} canceled `true` if the reorderable phase ended without causing
    any items to be reordered.
@param {Number[]} deltaXY Number of pixels the pointer has moved on the X and Y
    axes since the drag operation began.
@param {Node} dragNode The node being dragged.
@param {Number[]} pageXY Current X and Y coordinates of the pointer.
@param {Number[]} startXY X and Y coordinates of the pointer when the drag
    operation began.
**/
var EVT_REORDER_END = 'reorderend';

/**
Fired when the reorderable phase of a drag operation starts.

This could occur because the drag operation itself started, or because the
pointer was dragged back inside the reorderable container after having
previously left it.

To prevent reordering during the current drag operation, call `preventDefault()`
on this event's facade.

@event reorderstart
@param {Number[]} deltaXY Number of pixels the pointer has moved on the X and Y
    axes since the drag operation began.
@param {Node} dragNode The node being dragged.
@param {Number[]} pageXY Current X and Y coordinates of the pointer.
@param {Number[]} startXY X and Y coordinates of the pointer when the drag
    operation began.
@preventable _defReorderStartFn
**/
var EVT_REORDER_START = 'reorderstart';

Y.namespace('Plugin.DragDrop').Reorder = Y.Base.create('dragdropReorder', Y.Plugin.Base, [], {
    // -- Public Properties ----------------------------------------------------
    classNames: {
        after : getClassName('drag-reorder-after'),
        before: getClassName('drag-reorder-before')
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        this._host            = config.host;
        this._publishedEvents = {};

        // Can't be set in a valueFn because this._host and this.get('host')
        // might not be available yet.
        if (!this.get('container')) {
            this.set('container', this._host.get('container'));
        }

        // Cache frequently-used attrs.
        this._maxDistance     = this.get('maxDistance');
        this._orientation     = this.get('orientation');
        this._placeholderNode = this.get('placeholderNode');
        this._throttleDelay   = this.get('throttleDelay');

        this.afterHostMethod('sync', this.sync);

        this.onHostEvent('dragstart', this._onDragStart);
        this.afterHostEvent('drag', this._afterDrag);
        this.afterHostEvent('dragend', this._afterDragEnd);

        this._attachEvents();
    },

    destructor: function () {
        this._detachEvents();

        this._containerRect   = null;
        this._host            = null;
        this._itemRects       = null;
        this._publishedEvents = null;
        this._reorderTimeout  = clearTimeout(this._reorderTimeout);
    },

    // -- Public Methods -------------------------------------------------------
    sync: function () {
        if (this._host._dragState.dragging) {
            this._containerRect = this._host._getBoundingRect(
                this.get('container')._node);

            this._cacheItemRects();
        }

        return this;
    },

    // -- Protected Methods ----------------------------------------------------
    _attachEvents: function () {
        this._events = [
            this.after([
                'containerChange',
                'itemSelectorChange',
                'orientationChange'
            ], this.sync),

            // Update cached attrs when they change.
            this.after([
                'maxDistanceChange',
                'orientationChange',
                'placeholderNodeChange',
                'throttleDelayChange'
            ], this._cacheAttrValue)
        ];
    },

    /**
    Attribute change event handler that caches the new value of the attribute in
    a protected property on this class.

    @method _cacheAttrValue
    @param {EventFacade} e
    @protected
    **/
    _cacheAttrValue: function (e) {
        this['_' + e.attrName] = e.newVal;
    },

    _cacheItemRects: function () {
        var host           = this._host,
            dragEl         = host._proxyOrDragNode()._node,
            originalDragEl = host._dragState.dragNode._node,

            itemEls = Y.Selector.query(this.get('itemSelector'),
                this.get('container')._node),

            itemRects = this._itemRects = [],

            itemEl,
            rect;

        for (var i = 0, len = itemEls.length; i < len; i++) {
            itemEl = itemEls[i];

            if (itemEl === dragEl || itemEl === originalDragEl) {
                continue;
            }

            rect         = host._getBoundingRect(itemEl);
            rect.centerX = Math.round(rect.width / 2) + rect.left;
            rect.centerY = Math.round(rect.height / 2) + rect.top;
            rect.el      = itemEl;

            itemRects.push(rect);
        }

        // Sort the rects by top, then by left.
        itemRects.sort(function (a, b) {
            return (a.top - b.top) || (a.left - b.left);
        });
    },

    _coordsAreInsideRect: function (x, y, rect) {
        return y <= rect.bottom
                && y >= rect.top
                && x <= rect.right
                && x >= rect.left;
    },

    _detachEvents: function () {
        new Y.EventHandle(this._events).detach();
        this._events = null;
    },

    _findNearestItem: function () {
        var itemRects   = this._itemRects,
            state       = this._host._dragState,
            orientation = this._orientation,
            pointerX    = state.pageXY[0],
            pointerY    = state.pageXY[1],

            isColumn = orientation === 'column',
            isGrid   = orientation === 'grid',
            isRow    = orientation === 'row',

            closestDistance,
            closestRect,
            distance,
            forceAfter,
            itemRect;

        // Find the itemRect whose center is closest to the pointer.
        // TODO: Optimize this. It doesn't need to be O(n).
        for (var i = 0, len = itemRects.length; i < len; i++) {
            itemRect = itemRects[i];

            if (isColumn) {
                distance = Math.abs(itemRect.centerY - pointerY);
            } else if (isGrid) {
                // Ignore any item that's not in the same row as the pointer.
                if (pointerY < itemRect.top || pointerY > itemRect.bottom) {
                    continue;
                }

                distance = Math.abs(itemRect.centerX - pointerX) +
                        Math.abs(itemRect.centerY - pointerY);
            } else if (isRow) {
                distance = Math.abs(itemRect.centerX - pointerX);
            }

            if (!closestRect || distance < closestDistance) {
                closestDistance = distance;
                closestRect     = itemRect;
            }
        }

        if (!closestRect || closestDistance > this._maxDistance) {
            if (isGrid) {
                // The pointer isn't close to any nodes that are on the same
                // row, but is it below the last node in the grid? If so, and
                // if it's not too far below, then consider it closest to the
                // last node.
                var lastItem = itemRects[itemRects.length - 1];

                if (pointerY > lastItem.bottom
                        && pointerY - lastItem.bottom < this._maxDistance) {

                    closestRect = lastItem;
                    forceAfter  = true;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        var result;

        result = {
            el    : closestRect.el,
            rect  : closestRect,

            above : pointerY < closestRect.centerY,
            below : pointerY > closestRect.centerY,
            inside: this._coordsAreInsideRect(pointerX, pointerY, closestRect),
            left  : pointerX < closestRect.centerX,
            right : pointerX > closestRect.centerX
        };

        result.before = result.left && !forceAfter;
        result.after  = !result.before;

        return result;
    },

    _fireEnd: function () {
        var placeholderNode = this._placeholderNode,
            state           = this._host._dragState,
            oldItem         = state.reorder.nearestItem;

        if (placeholderNode) {
            placeholderNode.remove();
        }

        if (oldItem) {
            oldItem.node.removeClass(
                this.classNames[oldItem.after ? 'after' : 'before']);
        }

        state.reorder.active      = false;
        state.reorder.nearestItem = null;

        this._publishAndFire(EVT_REORDER_END, Y.merge(state, {
            canceled: !state.reorder.dropped,
            deltaXY : this._host._getDelta(),
            state   : state
        }));
    },

    _fireStart: function () {
        var state = this._host._dragState;

        this._publishAndFire(EVT_REORDER_START, Y.merge(state, {
            deltaXY: this._host._getDelta(),
            state  : state
        }), {
            defaultFn  : this._defReorderStartFn,
            preventedFn: this._preventedReorderStartFn
        });
    },

    _isReorderable: function () {
        var state = this._host._dragState;

        // Is the pointer inside the container?
        if (this._coordsAreInsideRect(state.pageXY[0], state.pageXY[1],
                this._containerRect)) {

            // The pointer is inside the reorderable container. If it previously
            // wasn't, then fire a reorderstart event to indicate that a
            // reorderable phase has started.
            if (!state.reorder.active) {
                this._fireStart();
            }
        } else {
            // The pointer is not inside the reorderable container. End the
            // reorder phase (if necessary) and return.
            if (state.reorder.active) {
                this._fireEnd();
            }
        }

        return state.reorder.active;
    },

    /**
    Utility method for lazily publishing and firing events.

    @method _publishAndFire
    @param {String} name Event name to fire.
    @param {Object} facade Event facade.
    @param {Object} [options] Event options.
        @param {Boolean} [options.silent=false] Whether the default handler
            should be executed directly without actually firing the event.
    @chainable
    @protected
    **/
    _publishAndFire: function (name, facade, options) {
        if (options && options.silent) {
            if (options.defaultFn) {
                options.defaultFn.call(this, facade);
            }
        } else {
            if (options && !this._publishedEvents[name]) {
                this._publishedEvents[name] = this.publish(name, options);
            }

            this.fire(name, facade);
        }

        return this;
    },

    _reorderDrag: function () {
        var item  = this._findNearestItem(),
            state = this._host._dragState;

        var oldItem = state.reorder.nearestItem;

        if (oldItem) {
            // If the current nearest item and the old nearest item are the same
            // and are in the same position relative to the pointer as the last
            // time we checked, don't fire any events.
            if (item && oldItem.el === item.el && oldItem.before === item.before) {
                return;
            }

            // The current nearest item and the old nearest item are not the
            // same, so remove CSS classes from the old node.
            oldItem.node.removeClass(
                    this.classNames[oldItem.after ? 'after' : 'before']);

            this.sync();
        }

        // If no item was found near the pointer end the reorder operation. It
        // will be restarted if the pointer gets near enough to an item again.
        if (!item) {
            state.reorder.nearestItem = null;
            this._fireEnd();
            return;
        }

        item.node = Y.one(item.el);
        state.reorder.nearestItem = item;

        var facade;

        facade = Y.merge(state, item, {
            deltaXY: this._host._getDelta(),
            state  : state
        });

        if (item.before) {
            this._publishAndFire(EVT_REORDER_BEFORE, facade, {
                defaultFn  : this._defReorderBeforeFn,
                preventedFn: this._preventedReorderBeforeFn
            });
        } else if (item.after) {
            this._publishAndFire(EVT_REORDER_AFTER, facade, {
                defaultFn  : this._defReorderAfterFn,
                preventedFn: this._preventedReorderAfterFn
            });
        }
    },

    _validateOrientation: function (value) {
        return value === 'column' || value === 'grid' || value === 'row';
    },

    // -- Event Handlers -------------------------------------------------------
    _afterDrag: function (e) {
        if (this._reorderTimeout || e.state.reorder.prevented) {
            return;
        }

        if (this._isReorderable()) {
            this._reorderDrag();
        }

        var self = this;

        this._reorderTimeout = setTimeout(function () {
            self._reorderTimeout = null;
        }, this._throttleDelay);
    },

    _afterDragEnd: function (e) {
        var state       = e.state,
            nearestItem = state.reorder.active && state.reorder.nearestItem;

        // If a reorderable phase is active and there's an item near the
        // pointer, treat this as a drop and trigger a reorder event.
        if (nearestItem) {
            this._publishAndFire(EVT_REORDER, Y.merge(state, nearestItem, {
                deltaXY: this._host._getDelta(),
                state  : state
            }), {
                defaultFn: this._defReorderFn
            });
        }

        this._fireEnd();
    },

    _defReorderFn: function (e) {
        var state       = e.state,
            nearestItem = state.reorder.nearestItem;

        if (!nearestItem) {
            return;
        }

        state.reorder.dropped = true;

        // Move the dragNode before or after the nearest item.
        if (this.get('moveOnEnd')) {
            nearestItem.node.insert(e.dragNode,
                nearestItem.before ? 'before' : 'after');
        }
    },

    _defReorderAfterFn: function (e) {
        var placeholderNode = this._placeholderNode;

        e.node.addClass(this.classNames.after);

        if (placeholderNode) {
            e.node.insert(placeholderNode, 'after');
            this.sync();
        }
    },

    _defReorderBeforeFn: function (e) {
        var placeholderNode = this._placeholderNode;

        e.node.addClass(this.classNames.before);

        if (placeholderNode) {
            e.node.insert(placeholderNode, 'before');
            this.sync();
        }
    },

    _defReorderStartFn: function (e) {
        e.state.reorder.active = true;
    },

    _onDragStart: function (e) {
        e.state.reorder = {};
    },

    _preventedReorderAfterFn: function (e) {
        this._fireEnd();
    },

    _preventedReorderBeforeFn: function (e) {
        this._fireEnd();
    },

    _preventedReorderStartFn: function (e) {
        e.state.reorder.prevented = true;
    }
}, {
    NS: 'reorder',

    ATTRS: {
        container: {
            setter: Y.one
        },

        itemSelector: {},

        /**
        Orientation of the reorderable items. May be one of the following
        strings:

        - **column** - for items in a single vertical column
        - **grid** - for items in a grid-like pattern that may have both columns
          and rows.
        - **row** - for items in a single horizontal row

        This affects how before/after positions are calculated. The default is
        **grid**.

        @attribute {String} orientation
        @default 'grid'
        **/
        orientation: {
            validator: '_validateOrientation',
            value    : 'grid'
        },

        maxDistance: {
            value: 400
        },

        moveOnEnd: {
            value: true
        },

        placeholderNode: {},

        throttleDelay: {
            value: 20
        }
    }
});


}, '@VERSION@', {"requires": ["base-pluginhost", "gallery-sm-dragdrop", "plugin"]});
