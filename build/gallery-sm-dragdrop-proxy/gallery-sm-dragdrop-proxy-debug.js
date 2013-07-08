YUI.add('gallery-sm-dragdrop-proxy', function (Y, NAME) {

/*jshint expr:true, onevar:false */

var getClassName = Y.ClassNameManager.getClassName;

Y.namespace('Plugin.DragDrop').Proxy = Y.Base.create('dragdropProxy', Y.Plugin.Base, [], {
    // -- Public Properties ----------------------------------------------------
    classNames: {
        dragproxy: getClassName('dragproxy')
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        this._host = config.host;

        this.afterHostEvent('dragstart', this._afterDragStart);
        this.onHostEvent('dragstart', this._onDragStart);
        this.onHostEvent('dragend', this._onDragEnd);
    },

    // -- Public Methods -------------------------------------------------------
    cloneNode: function (node) {
        var clone  = node.cloneNode(true);

        delete clone._yuid;

        clone.set('id', Y.guid())
            .setData('isDragProxyClone', true)
            .setStyle('position', 'absolute');

        return clone;
    },

    // -- Protected Methods ----------------------------------------------------
    _getContainer: function (value) {
        return value || this._host.get('container');
    },

    _getProxyNode: function (value) {
        if (this.get('clone')) {
            var state = this._host._dragState;

            if (state.proxyNode) {
                return state.proxyNode;
            }

            if (state.pending) {
                return this.cloneNode(state.dragNode);
            }

            return null;
        }

        return value;
    },

    _setContainer: function (value) {
        return value === 'parent' ? value : Y.one(value);
    },

    _setProxyNode: function (node) {
        node = node && Y.one(node);

        if (!node) {
            return null;
        }

        node.addClass(this.classNames.dragproxy);
    },

    // -- Event Handlers -------------------------------------------------------
    _afterDragStart: function (e) {
        var dragNode  = e.dragNode,
            state     = e.state,
            proxyNode = state.proxyNode;

        proxyNode
            .setStyle('visibility', 'hidden')
            .show()
            .setXY([
                e.pageXY[0] + state.offsetXY[0],
                e.pageXY[1] + state.offsetXY[1]
            ]);

        if (this.get('matchSize')) {
            proxyNode.setStyles({
                height: dragNode.get('offsetHeight'),
                width : dragNode.get('offsetWidth')
            });
        }

        proxyNode.setStyle('visibility', 'visible');
    },

    _onDragEnd: function (e) {
        var proxyNode = this._host._dragState.proxyNode;

        if (this.get('moveOnEnd')) {
            e.dragNode.setXY(proxyNode.getXY());
        }

        if (proxyNode.getData('isDragProxyClone')) {
            proxyNode.remove(true);
        } else {
            proxyNode.hide();
        }
    },

    _onDragStart: function (e) {
        var proxyNode = this.get('proxyNode');

        proxyNode.addClass(this.classNames.dragproxy);

        this._host._dragState.proxyNode = proxyNode;

        if (!proxyNode.inDoc()) {
            var container = this.get('container');

            if (container === 'parent') {
                container = e.dragNode.get('parentNode');
            }

            proxyNode.hide();
            container.append(proxyNode);
        }
    }
}, {
    NS: 'proxy',

    ATTRS: {
        clone: {
            value: false
        },

        container: {
            getter: '_getContainer',
            setter: '_setContainer'
        },

        matchSize: {
            value: true
        },

        moveOnEnd: {
            value: true
        },

        proxyNode: {
            getter: '_getProxyNode',
            setter: '_setProxyNode',

            valueFn: function () {
                return Y.Node.create('<div></div>');
            }
        }
    }
});


}, '@VERSION@', {"requires": ["base-pluginhost", "gallery-sm-dragdrop", "plugin"]});
