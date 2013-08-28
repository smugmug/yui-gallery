"use strict";
/**
Provides a `Y.Promise.Events` class. Instances can be used to decorate
`Y.Promise` instances with an `on()` method to allow for non-resolution related
event notifications such as cancelation or progress. Additionally, the
promise's `then` method is "infected" to propagate the mixin to its returned
promises as well, allowing notifications to cascade throughout a promise chain.

@module gallery-sm-promise-events
@since @@SINCE@@
**/
var isObject = Y.Lang.isObject;

/**
@namespace Promise
@class Events
@constructor
**/
Y.Promise.Events = function () {
    this._targets = [];
};

Y.mix(Y.Promise.Events.prototype, {
    addEvents: function (promise) {
        this._targets.push(promise);

        return this._decorate(promise);
    },

    _decorate: function (promise) {
        if (promise._evts) {
            return promise;
        }

        var notifier = this;
        
        promise._evts = {
            subs   : {},
            targets: []
        };

        promise.on = function (type, callback) {
            if (!promise._evts.subs[type]) {
                promise._evts.subs[type] = [];
            }

            promise._evts.subs[type].push(callback);

            return promise;
        };

        promise.then = (function (original) {
            return function (ok, fail) {
                var child = notifier._decorate(original.call(this, ok, fail));

                this._evts.targets.push(child);

                return child;
            };
        })(promise.then);

        return promise;
    },

    fire: function (type, details) {
        var targets = this._targets.slice(),
            e       = (details && isObject(details, true)) ?
                        Y.Object(details) : {},
            i, len;

        e.type    = type;
        e.details = details;

        for (i = 0, len = targets.length; i < len; ++i) {
            this._notify(targets[i], e);
        }

        return this;
    },

    _notify: function (target, e) {
        if (!target || !target._evts) {
            return;
        }

        var subs     = target._evts.subs[e.type],
            children = target._evts.targets,
            i, len;

        if (subs) {
            for (i = 0, len = subs.length; i < len; ++i) {
                // Force async to mimic resolution lifecycle, and each callback
                // in its own event loop turn to avoid swallowing errors and
                // errors breaking the current js thread.
                // TODO: would synchronous notifications be better?
                Y.soon(Y.bind(subs[i], null, e));
            }
        }

        // Depth-first notification, mimicking resolution order
        if (children.length) {
            for (i = 0, len = children.length; i < len; ++i) {
                this._notify(children[i], e);
            }
        }
    }
});
