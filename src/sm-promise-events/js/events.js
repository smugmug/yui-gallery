"use strict";
/**
Provides a `Y.Promise.EventNotifier` class. Instances can be used to decorate
`Y.Promise` instances with an `on()` method to allow for non-resolution related
event notifications such as cancelation or progress. Additionally, the
promise's `then` method is "infected" to propagate the mixin to its returned
promises as well, allowing notifications to cascade throughout a promise chain.

@module gallery-sm-promise-events
@since @@SINCE@@
**/
var isObject   = Y.Lang.isObject,
    toArray    = Y.Array,
    arrayIndex = Y.Array.indexOf,
    Notifier;

/**
@namespace Promise
@class EventNotifier
@constructor
**/
Notifier = Y.Promise.EventNotifier = function () {
    this._targets = [];
};

/**
Decorate a Promise with an `on` method and make its `then` method propagate
event support to its generated child promises.

@method decorate
@param {Promise} promise the Promise to add event support to
@static
**/
Notifier.decorate = function (promise) {
    if (promise._evts) {
        return promise;
    }

    promise._evts = {
        subs   : {},
        targets: []
    };

    promise.on = function (type, callback) {
        if (type && callback) {
            if (!promise._evts.subs[type]) {
                promise._evts.subs[type] = [];
            }

            promise._evts.subs[type].push(callback);
        }

        return promise;
    };

    promise.then = (function (original) {
        return function (ok, fail) {
            var child = Notifier.decorate(original.call(this, ok, fail));

            this._evts.targets.push(child);

            return child;
        };
    })(promise.then);

    return promise;
};

Y.mix(Notifier.prototype, {
    /**
    Decorate a promise and register it and its kin as targets for notifications
    from this instance.

    Returns the input promise.

    @method addEvents
    @param {Promise} promise The Promise to add event support to
    @return {Promise}
    **/
    addEvents: function (promise) {
        this._targets.push(promise);

        return Notifier.decorate(promise);
    },

    /**
    Notify registered Promises and their children of an event. Subscription
    callbacks will be passed an object with a `type` property. If additional
    parameters are passed to `fire`, a `details` property will be added with
    thos parameters in an array. If the second parameter is an object, it will
    be shallow-copied onto the event object.

    @method fire
    @param {String} type The name of the event to notify subscribers of
    @param {Any*} [details*] Any additional details to include in `e.details`
    @return {Promise.EventNotifier} this instance
    @chainable
    **/
    fire: function (type, details) {
        var targets = this._targets.slice(),
            known   = [],
            e       = (details && isObject(details, true)) ?
                        Y.merge(details) : {},
            target, subs,
            i, len, j, jlen;

        // Breadth-first notification order, mimicking resolution order
        // Note: Not caching a length comparator because this pushes to the end
        // of the targets array as it iterates.
        for (i = 0; i < targets.length; ++i) {
            // Not that this should ever happen, but don't push known promise
            // targets onto the list again. That would make for an infinite loop
            if (arrayIndex(targets[i], known) === -1 && targets[i]._evts) {
                targets.push.apply(targets, targets[i]._evts.targets);
            }
        }

        targets = Y.Array.unique(targets);

        e.type = type;

        if (arguments.length > 1) {
            e.details = toArray(arguments, 1, true);
        }

        for (i = 0, len = targets.length; i < len; ++i) {
            target = targets[i];
            subs   = target && target && target._evts &&target._evts.subs[type];

            if (subs) {
                for (j = 0, jlen = subs.length; j < jlen; ++j) {
                    // Force async to mimic resolution lifecycle, and each
                    // callback in its own event loop turn to avoid swallowing
                    // errors and errors breaking the current js thread.
                    // TODO: would synchronous notifications be better?
                    Y.soon(Y.bind(subs[j], null, e));
                }
            }
        }

        return this;
    }
});
