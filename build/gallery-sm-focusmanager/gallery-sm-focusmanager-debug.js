YUI.add('gallery-sm-focusmanager', function (Y, NAME) {

/*jshint expr:true, maxlen:200, onevar:false */

/**
Provides the FocusManager Node plugin, which makes it easy to manage keyboard
focus among the descendants of a node.

@module gallery-sm-focusmanager
@main gallery-sm-focusmanager
**/

/**
Node plugin that makes it easy to manage keyboard focus among the descendants of
a node.

### Example: Simple flat list

    <ul id="list">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>

    <script>
    YUI().use('gallery-sm-focusmanager', function (Y) {
        // Make the list items in #list keyboard-focusable using the arrow keys.
        Y.one('#list').plug(Y.Plugin.FocusManager);
    });
    </script>

### Example: Hierarchical list

    <ul id="list">
        <li>
            Item 1
            <ul>
                <li>Item 1.1</li>
                <li>
                    Item 1.2
                    <ul>
                        <li>Item 1.2.1</li>
                        <li>Item 1.2.2</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>

    <script>
    YUI().use('gallery-sm-focusmanager', function (Y) {
        // Make the list items in #list keyboard-focusable and allow
        // descending/ascending into and out of nested lists using the right and
        // left arrow keys.
        Y.one('#list').plug(Y.Plugin.FocusManager, {
            containerSelector: 'ul'
        });
    });
    </script>

@class Plugin.FocusManager
@extends Plugin.Base
@constructor
**/

function FocusManager() {
    FocusManager.superclass.constructor.apply(this, arguments);
}

Y.extend(FocusManager, Y.Plugin.Base, {
    // -- Public Properties ----------------------------------------------------

    /**
    Mapping of key codes to friendly key names that can be used in the `keys`
    attribute and the `preventDefaultMap` property.

    @property {Object} keyCodeMap
    **/
    keyCodeMap: {
        32: 'space',
        33: 'pgup',
        34: 'pgdown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },

    /**
    Mapping of keys whose default actions should be prevented when they trigger
    a FocusManager action.

    @property {Object} preventDefaultMap
    **/
    preventDefaultMap: {
        down  : 1,
        end   : 1,
        home  : 1,
        left  : 1,
        pgdown: 1,
        pgup  : 1,
        right : 1,
        space : 1,
        up    : 1
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        this._host = config.host;

        this._attachEvents();
        this.refresh();
    },

    destructor: function () {
        this._detachEvents();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Focuses and returns the nearest ancestor item that contains the current
    `activeItem`, if any.

    @method ascend
    @return {Node|null} Focused node, or `null` if there is no ancestor item.
    **/
    ascend: function () {
        var container = this._getActiveContainer(),
            host      = this._host,
            parentItem;

        if (container === host) {
            return null;
        }

        parentItem = container.ancestor(this.get('itemSelector'), false, function (node) {
            // Stop ascending if we reach the host.
            return node === host;
        });

        this.set('activeItem', parentItem, {src: 'ascend'});

        return parentItem;
    },

    /**
    Focuses and returns the first descendant item within the current
    `activeItem`, if any. In order for this to have any effect, a
    `containerSelector` must be set.

    @method descend
    @return {Node|null} Focused node, or `null` if there is no descendant item.
    **/
    descend: function () {
        var activeItem                = this.get('activeItem'),
            anchoredContainerSelector = this.get('anchoredContainerSelector');

        if (!anchoredContainerSelector || !activeItem) {
            return null;
        }

        var container = activeItem.one(anchoredContainerSelector);

        return container ? this.first({container: container}) : null;
    },

    /**
    Focuses and returns the first focusable item.

    @method first
    @param {Object} [options] Options.
        @param {Node} [options.container] Descendant container to restrict the
            search to. Defaults to the host node.
        @param {Boolean} [options.silent=false] If `true`, the item will be
            returned, but will not become the active item.
    @return {Node|null} Focused node, or `null` if there are no focusable items.
    **/
    first: function (options) {
        options || (options = {});

        // Get the first item that isn't disabled.
        var container        = options.container || this.get('host'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            item             = container.one(this.get('anchoredItemSelector'));

        while (item && disabledSelector && item.test(disabledSelector)) {
            item = item.next(itemSelector);
        }

        if (!options.silent) {
            this.set('activeItem', item, {src: 'first'});
        }

        return item;
    },

    /**
    Focuses and returns the last focusable item.

    @method last
    @param {Object} [options] Options.
        @param {Node} [options.container] Descendant container to restrict the
            search to. Defaults to the host node.
        @param {Boolean} [options.silent=false] If `true`, the item will be
            returned, but will not become the active item.
    @return {Node|null} Focused node, or `null` if there are no focusable items.
    **/
    last: function (options) {
        options || (options = {});

        var container        = options.container || this._host,
            disabledSelector = this.get('disabledSelector'),
            items            = container.all(this.get('anchoredItemSelector')),
            item             = items.pop();

        while (item && disabledSelector && item.test(disabledSelector)) {
            item = items.pop();
        }

        if (!options.silent) {
            this.set('activeItem', item, {src: 'last'});
        }

        return item;
    },

    /**
    Focuses and returns the next focusable sibling of the current `activeItem`.

    If there is no focusable next sibling and the `circular` attribute is
    `false`, the current `activeItem` will be returned.

    @method next
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the item will be
            returned, but will not become the active item.
    @return {Node|null} Focused node, or `null` if there is no `activeItem`.
    **/
    next: function (options) {
        options || (options = {});

        var activeItem = this.get('activeItem');

        if (!activeItem) {
            return null;
        }

        var disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            nextItem         = activeItem.next(itemSelector);

        // Get the next sibling that matches the itemSelector and isn't
        // disabled.
        while (nextItem && disabledSelector && nextItem.test(disabledSelector)) {
            nextItem = nextItem.next(itemSelector);
        }

        if (nextItem) {
            if (!options.silent) {
                this.set('activeItem', nextItem, {src: 'next'});
            }
        } else {
            // If there is no next sibling and the `circular` attribute is
            // truthy, then focus the first item in this container.
            if (this.get('circular')) {
                nextItem = this.first(Y.merge(options, {
                    container: this._getActiveContainer(activeItem)
                }));
            }
        }

        return nextItem || activeItem;
    },

    /**
    Focuses and returns the previous focusable sibling of the current
    `activeItem`.

    If there is no focusable previous sibling and the `circular` attribute is
    `false`, the current `activeItem` will be returned.

    @method previous
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the item will be
            returned, but will not become the active item.
    @return {Node|null} Focused node, or `null` if there is no `activeItem`.
    **/
    previous: function (options) {
        options || (options = {});

        var activeItem = this.get('activeItem');

        if (!activeItem) {
            return null;
        }

        var disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            prevItem         = activeItem.previous(itemSelector);

        // Get the previous sibling that matches the itemSelector and isn't
        // disabled.
        while (prevItem && disabledSelector && prevItem.test(disabledSelector)) {
            prevItem = prevItem.previous(itemSelector);
        }

        if (prevItem) {
            if (!options.silent) {
                this.set('activeItem', prevItem, {src: 'previous'});
            }
        } else {
            // If there is no previous sibling and the `circular` attribute is
            // truthy, then focus the last item in this container.
            if (this.get('circular')) {
                prevItem = this.last(Y.merge(options, {
                    container: this._getActiveContainer(activeItem)
                }));
            }
        }

        return prevItem || activeItem;
    },

    /**
    Refreshes the `tabIndex` state of this FocusManager's items to ensure that
    items are focusable but only the currently active item is in the tab flow.

    Call this method after adding, disabling, or enabling elements to ensure
    that they're managed correctly.

    @method refresh
    @param {Node} [container] If specified, only items that are direct
        descendants of this container will be refreshed.
    @chainable
    **/
    refresh: function (container) {
        var activeItem       = this.get('activeItem'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get(container ? 'anchoredItemSelector' : 'itemSelector');

        (container || this._host).all(itemSelector).each(function (node) {
            if (disabledSelector && node.test(disabledSelector)) {
                node.removeAttribute('tabIndex');
            } else {
                node.set('tabIndex', node === activeItem ? 0 : -1);
            }
        });

        return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches event handlers.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        var host = this._host;

        this._events = [
            host.on('keydown', this._onKeyDown, this),
            host.after('blur', this._afterBlur, this),
            host.after('focus', this._afterFocus, this),

            this.after({
                activeItemChange: this._afterActiveItemChange
            })
        ];
    },

    /**
    Detaches event handlers.

    @method _detachEvents
    @protected
    **/
    _detachEvents: function () {
        new Y.EventHandle(this._events).detach();
    },

    /**
    Returns the container node for the current `activeItem`.

    @method _getActiveContainer
    @return {Node} Container node for the current `activeItem`.
    @protected
    **/
    _getActiveContainer: function (activeItem) {
        var containerSelector = this.get('containerSelector'),
            host              = this._host,
            container;

        if (!containerSelector) {
            return host;
        }

        activeItem || (activeItem = this.get('activeItem'));

        if (!activeItem) {
            return host;
        }

        container = activeItem.ancestor(containerSelector, false, function (node) {
            // Stop the search if we reach the host node.
            return node === host;
        });

        return container || host;
    },

    /**
    Getter for the `anchoredContainerSelector` attribute.

    @method _getAnchoredContainerSelector
    @param {String|null} value
    @return {String|null}
    @protected
    **/
    _getAnchoredContainerSelector: function (value) {
        if (value) {
            return value;
        }

        var containerSelector = this.get('containerSelector');

        if (containerSelector) {
            return '>' + containerSelector;
        }

        return null;
    },

    /**
    Getter for the `anchoredItemSelector` attribute.

    @method _getAnchoredItemSelector
    @param {String|null} value
    @return {String}
    @protected
    **/
    _getAnchoredItemSelector: function (value) {
        if (value) {
            return value;
        }

        return '>' + this.get('itemSelector');
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `activeItemChange` events.

    @method _afterActiveItemChange
    @param {EventFacade} e
    @protected
    **/
    _afterActiveItemChange: function (e) {
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            prevVal.set('tabIndex', -1);
        }

        if (newVal) {
            newVal.set('tabIndex', 0);

            if (this.get('focused')) {
                newVal.focus();
            }
        }
    },

    /**
    Handles `blur` events on the host node.

    @method _afterBlur
    @protected
    **/
    _afterBlur: function () {
        this._set('focused', false);
    },

    /**
    Handles `focus` events on the host node.

    @method _afterFocus
    @param {EventFacade} e
    @protected
    **/
    _afterFocus: function (e) {
        var target = e.target;

        this._set('focused', true);

        if (target !== this._host && target.test(this.get('itemSelector'))) {
            this.set('activeItem', target, {src: 'focus'});
        }
    },

    /**
    Handles `keydown` events on the host node.

    @method _onKeyDown
    @param {EventFacade} e
    @protected
    **/
    _onKeyDown: function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }

        var key    = this.keyCodeMap[e.keyCode] || e.keyCode,
            keys   = this.get('keys'),
            action = keys[key] || keys[e.keyCode];

        if (action) {
            if (this.preventDefaultMap[key]) {
                e.preventDefault();
            }

            if (typeof action === 'string') {
                this[action].call(this);
            } else {
                action.call(this);
            }
        }
    }
}, {
    NAME: 'focusManager',
    NS  : 'focusManager',

    ATTRS: {
        /**
        Node that's currently either focused or focusable as part of the
        document's tab flow.

        @attribute {Node|null} activeItem
        **/
        activeItem: {
            valueFn: function () {
                // TODO: Need to be smarter about choosing the default
                // activeItem. Old FocusManager defaults to the first item with
                // tabIndex === 0, if there is one.
                return this.first();
            }
        },

        /**
        Anchored version of `containerSelector`.

        For example, if `containerSelector` is set to "ul", then
        `anchoredContainerSelector` will default to ">ul". You can override the
        default by specifying your own anchored selector if desired.

        @attribute {String|null} anchoredContainerSelector
        **/
        anchoredContainerSelector: {
            getter: '_getAnchoredContainerSelector'
        },

        /**
        Anchored version of `itemSelector`.

        For example, if `itemSelector` is set to "li", then
        `anchoredItemSelector` will default to ">li". You can override the
        default by specifying your own anchored selector if desired.

        @attribute {String|null} anchoredItemSelector
        **/
        anchoredItemSelector: {
            getter: '_getAnchoredItemSelector'
        },

        /**
        If `true`, focus will wrap around to the first or last item in the
        current container when the selection moves past the end or beginning of
        the focusable items, respectively.

        @attribute {Boolean} circular
        @default true
        **/
        circular: {
            value: true
        },

        /**
        Non-anchored CSS selector that matches a hierarchical descendant
        container into which focus can descend.

        For example, if the host node is a `<ul>` and item nodes are `<li>`s,
        setting `containerSelector` to "ul" would allow the user to descend into
        a nested `<ul>` contained inside an `<li>`.

        To prevent hierarchical selection, set `containerSelector` to `null`
        (the default).

        @attribute {String|null} containerSelector
        **/
        containerSelector: {},

        /**
        Non-anchored CSS selector that matches nodes that should be considered
        disabled. Disabled nodes will not be considered focusable.

        By default, a node is considered disabled if it has a `disabled`
        attribute or an `aria-disabled` or `aria-hidden` attribute set to
        "true".

        @attribute {String|null} disabledSelector
        **/
        disabledSelector: {
            value: '[aria-disabled="true"], [aria-hidden="true"], [disabled]'
        },

        /**
        `true` if the host node or one of its focusable items is currently
        focused, `false` otherwise.

        @attribute {Boolean} focused
        @default false
        @readOnly
        **/
        focused: {
            readOnly: true,
            value   : false
        },

        /**
        Non-anchored CSS selector that matches item nodes that should be
        focusable.

        @attribute {String} itemSelector
        @default '*'
        **/
        itemSelector: {
            value: '*'
        },

        /**
        Mapping of keyboard codes to functions or function names that should
        execute when those keys are pressed.

        By default, the following keys are mapped:

        * down arrow: `next()`
        * left arrow: `ascend()`
        * right arrow: `descend()`
        * up arrow: `previous()`

        To customize the mapping, either modify or replace the `keys` object.

        Values should be functions or strings representing named functions on
        this FocusManager instance. All functions will be executed with this
        FocusManager as the `this` object.

        Properties should be numerical key codes or one of the following
        strings representing a key on the keyboard:

        * down
        * end
        * home
        * left
        * pgdown
        * pgup
        * right
        * space
        * up

        @attribute {Object} keys
        **/
        keys: {
            cloneDefaultValue: 'shallow',

            value: {
                down : 'next',
                left : 'ascend',
                right: 'descend',
                up   : 'previous'
            }
        }
    }
});

Y.namespace('Plugin').FocusManager = FocusManager;


}, '@VERSION@', {"requires": ["event-focus", "node-pluginhost", "plugin", "selector-css3"]});
