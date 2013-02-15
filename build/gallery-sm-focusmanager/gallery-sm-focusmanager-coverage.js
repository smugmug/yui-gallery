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
_yuitest_coverage["build/gallery-sm-focusmanager/gallery-sm-focusmanager.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-focusmanager/gallery-sm-focusmanager.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-focusmanager/gallery-sm-focusmanager.js"].code=["YUI.add('gallery-sm-focusmanager', function (Y, NAME) {","","/*jshint expr:true, maxlen:200, onevar:false */","","/**","Provides the FocusManager Node plugin, which makes it easy to manage keyboard","focus among the descendants of a node.","","@module gallery-sm-focusmanager","@main gallery-sm-focusmanager","**/","","/**","Node plugin that makes it easy to manage keyboard focus among the descendants of","a node.","","### Example: Simple flat list","","    <ul id=\"list\">","        <li>Item 1</li>","        <li>Item 2</li>","        <li>Item 3</li>","    </ul>","","    <script>","    YUI().use('gallery-sm-focusmanager', function (Y) {","        // Make the list items in #list keyboard-focusable using the arrow keys.","        Y.one('#list').plug(Y.Plugin.FocusManager);","    });","    </script>","","### Example: Hierarchical list","","    <ul id=\"list\">","        <li>","            Item 1","            <ul>","                <li>Item 1.1</li>","                <li>","                    Item 1.2","                    <ul>","                        <li>Item 1.2.1</li>","                        <li>Item 1.2.2</li>","                    </ul>","                </li>","            </ul>","        </li>","        <li>Item 2</li>","        <li>Item 3</li>","    </ul>","","    <script>","    YUI().use('gallery-sm-focusmanager', function (Y) {","        // Make the list items in #list keyboard-focusable and allow","        // descending/ascending into and out of nested lists using the right and","        // left arrow keys.","        Y.one('#list').plug(Y.Plugin.FocusManager, {","            containerSelector: 'ul'","        });","    });","    </script>","","@class Plugin.FocusManager","@extends Plugin.Base","@constructor","**/","","function FocusManager() {","    FocusManager.superclass.constructor.apply(this, arguments);","}","","Y.extend(FocusManager, Y.Plugin.Base, {","    // -- Public Properties ----------------------------------------------------","","    /**","    Mapping of key codes to friendly key names that can be used in the `keys`","    attribute and the `preventDefaultMap` property.","","    @property {Object} keyCodeMap","    **/","    keyCodeMap: {","        32: 'space',","        33: 'pgup',","        34: 'pgdown',","        35: 'end',","        36: 'home',","        37: 'left',","        38: 'up',","        39: 'right',","        40: 'down'","    },","","    /**","    Mapping of keys whose default actions should be prevented when they trigger","    a FocusManager action.","","    @property {Object} preventDefaultMap","    **/","    preventDefaultMap: {","        down  : 1,","        end   : 1,","        home  : 1,","        left  : 1,","        pgdown: 1,","        pgup  : 1,","        right : 1,","        space : 1,","        up    : 1","    },","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        this._host = config.host;","","        this._attachEvents();","        this.refresh();","    },","","    destructor: function () {","        this._detachEvents();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Focuses and returns the nearest ancestor item that contains the current","    `activeItem`, if any.","","    @method ascend","    @return {Node|null} Focused node, or `null` if there is no ancestor item.","    **/","    ascend: function () {","        var container = this._getActiveContainer(),","            host      = this._host,","            parentItem;","","        if (container === host) {","            return null;","        }","","        parentItem = container.ancestor(this.get('itemSelector'), false, function (node) {","            // Stop ascending if we reach the host.","            return node === host;","        });","","        this.set('activeItem', parentItem, {src: 'ascend'});","","        return parentItem;","    },","","    /**","    Focuses and returns the first descendant item within the current","    `activeItem`, if any. In order for this to have any effect, a","    `containerSelector` must be set.","","    @method descend","    @return {Node|null} Focused node, or `null` if there is no descendant item.","    **/","    descend: function () {","        var activeItem                = this.get('activeItem'),","            anchoredContainerSelector = this.get('anchoredContainerSelector');","","        if (!anchoredContainerSelector || !activeItem) {","            return null;","        }","","        var container = activeItem.one(anchoredContainerSelector);","","        return container ? this.first({container: container}) : null;","    },","","    /**","    Focuses and returns the first focusable item.","","    @method first","    @param {Object} [options] Options.","        @param {Node} [options.container] Descendant container to restrict the","            search to. Defaults to the host node.","        @param {Boolean} [options.silent=false] If `true`, the item will be","            returned, but will not become the active item.","    @return {Node|null} Focused node, or `null` if there are no focusable items.","    **/","    first: function (options) {","        options || (options = {});","","        // Get the first item that isn't disabled.","        var container        = options.container || this.get('host'),","            disabledSelector = this.get('disabledSelector'),","            itemSelector     = this.get('itemSelector'),","            item             = container.one(this.get('anchoredItemSelector'));","","        while (item && disabledSelector && item.test(disabledSelector)) {","            item = item.next(itemSelector);","        }","","        if (!options.silent) {","            this.set('activeItem', item, {src: 'first'});","        }","","        return item;","    },","","    /**","    Focuses and returns the last focusable item.","","    @method last","    @param {Object} [options] Options.","        @param {Node} [options.container] Descendant container to restrict the","            search to. Defaults to the host node.","        @param {Boolean} [options.silent=false] If `true`, the item will be","            returned, but will not become the active item.","    @return {Node|null} Focused node, or `null` if there are no focusable items.","    **/","    last: function (options) {","        options || (options = {});","","        var container        = options.container || this._host,","            disabledSelector = this.get('disabledSelector'),","            items            = container.all(this.get('anchoredItemSelector')),","            item             = items.pop();","","        while (item && disabledSelector && item.test(disabledSelector)) {","            item = items.pop();","        }","","        if (!options.silent) {","            this.set('activeItem', item, {src: 'last'});","        }","","        return item;","    },","","    /**","    Focuses and returns the next focusable sibling of the current `activeItem`.","","    If there is no focusable next sibling and the `circular` attribute is","    `false`, the current `activeItem` will be returned.","","    @method next","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the item will be","            returned, but will not become the active item.","    @return {Node|null} Focused node, or `null` if there is no `activeItem`.","    **/","    next: function (options) {","        options || (options = {});","","        var activeItem = this.get('activeItem');","","        if (!activeItem) {","            return null;","        }","","        var disabledSelector = this.get('disabledSelector'),","            itemSelector     = this.get('itemSelector'),","            nextItem         = activeItem.next(itemSelector);","","        // Get the next sibling that matches the itemSelector and isn't","        // disabled.","        while (nextItem && disabledSelector && nextItem.test(disabledSelector)) {","            nextItem = nextItem.next(itemSelector);","        }","","        if (nextItem) {","            if (!options.silent) {","                this.set('activeItem', nextItem, {src: 'next'});","            }","        } else {","            // If there is no next sibling and the `circular` attribute is","            // truthy, then focus the first item in this container.","            if (this.get('circular')) {","                nextItem = this.first(Y.merge(options, {","                    container: this._getActiveContainer(activeItem)","                }));","            }","        }","","        return nextItem || activeItem;","    },","","    /**","    Focuses and returns the previous focusable sibling of the current","    `activeItem`.","","    If there is no focusable previous sibling and the `circular` attribute is","    `false`, the current `activeItem` will be returned.","","    @method previous","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the item will be","            returned, but will not become the active item.","    @return {Node|null} Focused node, or `null` if there is no `activeItem`.","    **/","    previous: function (options) {","        options || (options = {});","","        var activeItem = this.get('activeItem');","","        if (!activeItem) {","            return null;","        }","","        var disabledSelector = this.get('disabledSelector'),","            itemSelector     = this.get('itemSelector'),","            prevItem         = activeItem.previous(itemSelector);","","        // Get the previous sibling that matches the itemSelector and isn't","        // disabled.","        while (prevItem && disabledSelector && prevItem.test(disabledSelector)) {","            prevItem = prevItem.previous(itemSelector);","        }","","        if (prevItem) {","            if (!options.silent) {","                this.set('activeItem', prevItem, {src: 'previous'});","            }","        } else {","            // If there is no previous sibling and the `circular` attribute is","            // truthy, then focus the last item in this container.","            prevItem = this.last(Y.merge(options, {","                container: this._getActiveContainer(activeItem)","            }));","        }","","        return prevItem || activeItem;","    },","","    /**","    Refreshes the `tabIndex` state of this FocusManager's items to ensure that","    items are focusable but only the currently active item is in the tab flow.","","    Call this method after adding, disabling, or enabling elements to ensure","    that they're managed correctly.","","    @method refresh","    @param {Node} [container] If specified, only items that are direct","        descendants of this container will be refreshed.","    @chainable","    **/","    refresh: function (container) {","        var activeItem       = this.get('activeItem'),","            disabledSelector = this.get('disabledSelector'),","            itemSelector     = this.get(container ? 'anchoredItemSelector' : 'itemSelector');","","        (container || this._host).all(itemSelector).each(function (node) {","            if (disabledSelector && node.test(disabledSelector)) {","                node.removeAttribute('tabIndex');","            } else {","                node.set('tabIndex', node === activeItem ? 0 : -1);","            }","        });","","        return this;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Attaches event handlers.","","    @method _attachEvents","    @protected","    **/","    _attachEvents: function () {","        var host = this._host;","","        this._events = [","            host.on('keydown', this._onKeyDown, this),","            host.after('blur', this._afterBlur, this),","            host.after('focus', this._afterFocus, this),","","            this.after({","                activeItemChange: this._afterActiveItemChange","            })","        ];","    },","","    /**","    Detaches event handlers.","","    @method _detachEvents","    @protected","    **/","    _detachEvents: function () {","        new Y.EventHandle(this._events).detach();","    },","","    /**","    Returns the container node for the current `activeItem`.","","    @method _getActiveContainer","    @return {Node} Container node for the current `activeItem`.","    @protected","    **/","    _getActiveContainer: function (activeItem) {","        var containerSelector = this.get('containerSelector'),","            host              = this._host,","            container;","","        if (!containerSelector) {","            return host;","        }","","        activeItem || (activeItem = this.get('activeItem'));","","        if (!activeItem) {","            return host;","        }","","        container = activeItem.ancestor(containerSelector, false, function (node) {","            // Stop the search if we reach the host node.","            return node === host;","        });","","        return container || host;","    },","","    /**","    Getter for the `anchoredContainerSelector` attribute.","","    @method _getAnchoredContainerSelector","    @param {String|null} value","    @return {String|null}","    @protected","    **/","    _getAnchoredContainerSelector: function (value) {","        if (value) {","            return value;","        }","","        var containerSelector = this.get('containerSelector');","","        if (containerSelector) {","            return '>' + containerSelector;","        }","","        return null;","    },","","    /**","    Getter for the `anchoredItemSelector` attribute.","","    @method _getAnchoredItemSelector","    @param {String|null} value","    @return {String}","    @protected","    **/","    _getAnchoredItemSelector: function (value) {","        if (value) {","            return value;","        }","","        return '>' + this.get('itemSelector');","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `activeItemChange` events.","","    @method _afterActiveItemChange","    @param {EventFacade} e","    @protected","    **/","    _afterActiveItemChange: function (e) {","        var newVal  = e.newVal,","            prevVal = e.prevVal;","","        if (prevVal) {","            prevVal.set('tabIndex', -1);","        }","","        if (newVal) {","            newVal.set('tabIndex', 0);","","            if (this.get('focused')) {","                newVal.focus();","            }","        }","    },","","    /**","    Handles `blur` events on the host node.","","    @method _afterBlur","    @protected","    **/","    _afterBlur: function () {","        this._set('focused', false);","    },","","    /**","    Handles `focus` events on the host node.","","    @method _afterFocus","    @param {EventFacade} e","    @protected","    **/","    _afterFocus: function (e) {","        var target = e.target;","","        this._set('focused', true);","","        if (target !== this._host && target.test(this.get('itemSelector'))) {","            this.set('activeItem', target, {src: 'focus'});","        }","    },","","    /**","    Handles `keydown` events on the host node.","","    @method _onKeyDown","    @param {EventFacade} e","    @protected","    **/","    _onKeyDown: function (e) {","        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {","            return;","        }","","        var key    = this.keyCodeMap[e.keyCode] || e.keyCode,","            action = this.get('keys')[key];","","        if (action) {","            if (this.preventDefaultMap[key]) {","                e.preventDefault();","            }","","            if (typeof action === 'string') {","                this[action].call(this);","            } else {","                action.call(this);","            }","        }","    }","}, {","    NAME: 'focusManager',","    NS  : 'focusManager',","","    ATTRS: {","        /**","        Node that's currently either focused or focusable as part of the","        document's tab flow.","","        @attribute {Node|null} activeItem","        **/","        activeItem: {","            valueFn: function () {","                // TODO: Need to be smarter about choosing the default","                // activeItem. Old FocusManager defaults to the first item with","                // tabIndex === 0, if there is one.","                return this.first();","            }","        },","","        /**","        Anchored version of `containerSelector`.","","        For example, if `containerSelector` is set to \"ul\", then","        `anchoredContainerSelector` will default to \">ul\". You can override the","        default by specifying your own anchored selector if desired.","","        @attribute {String|null} anchoredContainerSelector","        **/","        anchoredContainerSelector: {","            getter: '_getAnchoredContainerSelector'","        },","","        /**","        Anchored version of `itemSelector`.","","        For example, if `itemSelector` is set to \"li\", then","        `anchoredItemSelector` will default to \">li\". You can override the","        default by specifying your own anchored selector if desired.","","        @attribute {String|null} anchoredItemSelector","        **/","        anchoredItemSelector: {","            getter: '_getAnchoredItemSelector'","        },","","        /**","        If `true`, focus will wrap around to the first or last item in the","        current container when the selection moves past the end or beginning of","        the focusable items, respectively.","","        @attribute {Boolean} circular","        @default true","        **/","        circular: {","            value: true","        },","","        /**","        Non-anchored CSS selector that matches a hierarchical descendant","        container into which focus can descend.","","        For example, if the host node is a `<ul>` and item nodes are `<li>`s,","        setting `containerSelector` to \"ul\" would allow the user to descend into","        a nested `<ul>` contained inside an `<li>`.","","        To prevent hierarchical selection, set `containerSelector` to `null`","        (the default).","","        @attribute {String|null} containerSelector","        **/","        containerSelector: {},","","        /**","        Non-anchored CSS selector that matches nodes that should be considered","        disabled. Disabled nodes will not be considered focusable.","","        By default, a node is considered disabled if it has a `disabled`","        attribute or an `aria-disabled` or `aria-hidden` attribute set to","        \"true\".","","        @attribute {String|null} disabledSelector","        **/","        disabledSelector: {","            value: '[aria-disabled=\"true\"], [aria-hidden=\"true\"], [disabled]'","        },","","        /**","        `true` if the host node or one of its focusable items is currently","        focused, `false` otherwise.","","        @attribute {Boolean} focused","        @default false","        @readOnly","        **/","        focused: {","            readOnly: true,","            value   : false","        },","","        /**","        Non-anchored CSS selector that matches item nodes that should be","        focusable.","","        @attribute {String} itemSelector","        @default '*'","        **/","        itemSelector: {","            value: '*'","        },","","        /**","        Mapping of keyboard codes to functions or function names that should","        execute when those keys are pressed.","","        By default, the following keys are mapped:","","        * down arrow: `next()`","        * left arrow: `ascend()`","        * right arrow: `descend()`","        * up arrow: `previous()`","","        To customize the mapping, either modify or replace the `keys` object.","","        Values should be functions or strings representing named functions on","        this FocusManager instance. All functions will be executed with this","        FocusManager as the `this` object.","","        Properties should be numerical key codes or one of the following","        strings representing a key on the keyboard:","","        * down","        * end","        * home","        * left","        * pgdown","        * pgup","        * right","        * space","        * up","","        @attribute {Object} keys","        **/","        keys: {","            cloneDefaultValue: 'shallow',","","            value: {","                down : 'next',","                left : 'ascend',","                right: 'descend',","                up   : 'previous'","            }","        }","    }","});","","Y.namespace('Plugin').FocusManager = FocusManager;","","","}, '@VERSION@', {\"requires\": [\"event-focus\", \"node-pluginhost\", \"plugin\", \"selector-css3\"]});"];
_yuitest_coverage["build/gallery-sm-focusmanager/gallery-sm-focusmanager.js"].lines = {"1":0,"68":0,"69":0,"72":0,"113":0,"115":0,"116":0,"120":0,"133":0,"137":0,"138":0,"141":0,"143":0,"146":0,"148":0,"160":0,"163":0,"164":0,"167":0,"169":0,"184":0,"187":0,"192":0,"193":0,"196":0,"197":0,"200":0,"215":0,"217":0,"222":0,"223":0,"226":0,"227":0,"230":0,"246":0,"248":0,"250":0,"251":0,"254":0,"260":0,"261":0,"264":0,"265":0,"266":0,"271":0,"272":0,"278":0,"295":0,"297":0,"299":0,"300":0,"303":0,"309":0,"310":0,"313":0,"314":0,"315":0,"320":0,"325":0,"341":0,"345":0,"346":0,"347":0,"349":0,"353":0,"365":0,"367":0,"385":0,"396":0,"400":0,"401":0,"404":0,"406":0,"407":0,"410":0,"412":0,"415":0,"427":0,"428":0,"431":0,"433":0,"434":0,"437":0,"449":0,"450":0,"453":0,"466":0,"469":0,"470":0,"473":0,"474":0,"476":0,"477":0,"489":0,"500":0,"502":0,"504":0,"505":0,"517":0,"518":0,"521":0,"524":0,"525":0,"526":0,"529":0,"530":0,"532":0,"552":0,"692":0};
_yuitest_coverage["build/gallery-sm-focusmanager/gallery-sm-focusmanager.js"].functions = {"FocusManager:68":0,"initializer:112":0,"destructor:119":0,"(anonymous 2):141":0,"ascend:132":0,"descend:159":0,"first:183":0,"last:214":0,"next:245":0,"previous:294":0,"(anonymous 3):345":0,"refresh:340":0,"_attachEvents:364":0,"_detachEvents:384":0,"(anonymous 4):410":0,"_getActiveContainer:395":0,"_getAnchoredContainerSelector:426":0,"_getAnchoredItemSelector:448":0,"_afterActiveItemChange:465":0,"_afterBlur:488":0,"_afterFocus:499":0,"_onKeyDown:516":0,"valueFn:548":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-focusmanager/gallery-sm-focusmanager.js"].coveredLines = 109;
_yuitest_coverage["build/gallery-sm-focusmanager/gallery-sm-focusmanager.js"].coveredFunctions = 24;
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 1);
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

_yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 68);
function FocusManager() {
    _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "FocusManager", 68);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 69);
FocusManager.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 72);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "initializer", 112);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 113);
this._host = config.host;

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 115);
this._attachEvents();
        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 116);
this.refresh();
    },

    destructor: function () {
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "destructor", 119);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 120);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "ascend", 132);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 133);
var container = this._getActiveContainer(),
            host      = this._host,
            parentItem;

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 137);
if (container === host) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 138);
return null;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 141);
parentItem = container.ancestor(this.get('itemSelector'), false, function (node) {
            // Stop ascending if we reach the host.
            _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "(anonymous 2)", 141);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 143);
return node === host;
        });

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 146);
this.set('activeItem', parentItem, {src: 'ascend'});

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 148);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "descend", 159);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 160);
var activeItem                = this.get('activeItem'),
            anchoredContainerSelector = this.get('anchoredContainerSelector');

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 163);
if (!anchoredContainerSelector || !activeItem) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 164);
return null;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 167);
var container = activeItem.one(anchoredContainerSelector);

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 169);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "first", 183);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 184);
options || (options = {});

        // Get the first item that isn't disabled.
        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 187);
var container        = options.container || this.get('host'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            item             = container.one(this.get('anchoredItemSelector'));

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 192);
while (item && disabledSelector && item.test(disabledSelector)) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 193);
item = item.next(itemSelector);
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 196);
if (!options.silent) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 197);
this.set('activeItem', item, {src: 'first'});
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 200);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "last", 214);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 215);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 217);
var container        = options.container || this._host,
            disabledSelector = this.get('disabledSelector'),
            items            = container.all(this.get('anchoredItemSelector')),
            item             = items.pop();

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 222);
while (item && disabledSelector && item.test(disabledSelector)) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 223);
item = items.pop();
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 226);
if (!options.silent) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 227);
this.set('activeItem', item, {src: 'last'});
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 230);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "next", 245);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 246);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 248);
var activeItem = this.get('activeItem');

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 250);
if (!activeItem) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 251);
return null;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 254);
var disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            nextItem         = activeItem.next(itemSelector);

        // Get the next sibling that matches the itemSelector and isn't
        // disabled.
        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 260);
while (nextItem && disabledSelector && nextItem.test(disabledSelector)) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 261);
nextItem = nextItem.next(itemSelector);
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 264);
if (nextItem) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 265);
if (!options.silent) {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 266);
this.set('activeItem', nextItem, {src: 'next'});
            }
        } else {
            // If there is no next sibling and the `circular` attribute is
            // truthy, then focus the first item in this container.
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 271);
if (this.get('circular')) {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 272);
nextItem = this.first(Y.merge(options, {
                    container: this._getActiveContainer(activeItem)
                }));
            }
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 278);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "previous", 294);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 295);
options || (options = {});

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 297);
var activeItem = this.get('activeItem');

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 299);
if (!activeItem) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 300);
return null;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 303);
var disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get('itemSelector'),
            prevItem         = activeItem.previous(itemSelector);

        // Get the previous sibling that matches the itemSelector and isn't
        // disabled.
        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 309);
while (prevItem && disabledSelector && prevItem.test(disabledSelector)) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 310);
prevItem = prevItem.previous(itemSelector);
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 313);
if (prevItem) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 314);
if (!options.silent) {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 315);
this.set('activeItem', prevItem, {src: 'previous'});
            }
        } else {
            // If there is no previous sibling and the `circular` attribute is
            // truthy, then focus the last item in this container.
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 320);
prevItem = this.last(Y.merge(options, {
                container: this._getActiveContainer(activeItem)
            }));
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 325);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "refresh", 340);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 341);
var activeItem       = this.get('activeItem'),
            disabledSelector = this.get('disabledSelector'),
            itemSelector     = this.get(container ? 'anchoredItemSelector' : 'itemSelector');

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 345);
(container || this._host).all(itemSelector).each(function (node) {
            _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "(anonymous 3)", 345);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 346);
if (disabledSelector && node.test(disabledSelector)) {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 347);
node.removeAttribute('tabIndex');
            } else {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 349);
node.set('tabIndex', node === activeItem ? 0 : -1);
            }
        });

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 353);
return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Attaches event handlers.

    @method _attachEvents
    @protected
    **/
    _attachEvents: function () {
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_attachEvents", 364);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 365);
var host = this._host;

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 367);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_detachEvents", 384);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 385);
new Y.EventHandle(this._events).detach();
    },

    /**
    Returns the container node for the current `activeItem`.

    @method _getActiveContainer
    @return {Node} Container node for the current `activeItem`.
    @protected
    **/
    _getActiveContainer: function (activeItem) {
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_getActiveContainer", 395);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 396);
var containerSelector = this.get('containerSelector'),
            host              = this._host,
            container;

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 400);
if (!containerSelector) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 401);
return host;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 404);
activeItem || (activeItem = this.get('activeItem'));

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 406);
if (!activeItem) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 407);
return host;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 410);
container = activeItem.ancestor(containerSelector, false, function (node) {
            // Stop the search if we reach the host node.
            _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "(anonymous 4)", 410);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 412);
return node === host;
        });

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 415);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_getAnchoredContainerSelector", 426);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 427);
if (value) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 428);
return value;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 431);
var containerSelector = this.get('containerSelector');

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 433);
if (containerSelector) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 434);
return '>' + containerSelector;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 437);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_getAnchoredItemSelector", 448);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 449);
if (value) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 450);
return value;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 453);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_afterActiveItemChange", 465);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 466);
var newVal  = e.newVal,
            prevVal = e.prevVal;

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 469);
if (prevVal) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 470);
prevVal.set('tabIndex', -1);
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 473);
if (newVal) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 474);
newVal.set('tabIndex', 0);

            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 476);
if (this.get('focused')) {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 477);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_afterBlur", 488);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 489);
this._set('focused', false);
    },

    /**
    Handles `focus` events on the host node.

    @method _afterFocus
    @param {EventFacade} e
    @protected
    **/
    _afterFocus: function (e) {
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_afterFocus", 499);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 500);
var target = e.target;

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 502);
this._set('focused', true);

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 504);
if (target !== this._host && target.test(this.get('itemSelector'))) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 505);
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
        _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "_onKeyDown", 516);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 517);
if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 518);
return;
        }

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 521);
var key    = this.keyCodeMap[e.keyCode] || e.keyCode,
            action = this.get('keys')[key];

        _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 524);
if (action) {
            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 525);
if (this.preventDefaultMap[key]) {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 526);
e.preventDefault();
            }

            _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 529);
if (typeof action === 'string') {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 530);
this[action].call(this);
            } else {
                _yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 532);
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
                _yuitest_coverfunc("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", "valueFn", 548);
_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 552);
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

_yuitest_coverline("build/gallery-sm-focusmanager/gallery-sm-focusmanager.js", 692);
Y.namespace('Plugin').FocusManager = FocusManager;


}, '@VERSION@', {"requires": ["event-focus", "node-pluginhost", "plugin", "selector-css3"]});
