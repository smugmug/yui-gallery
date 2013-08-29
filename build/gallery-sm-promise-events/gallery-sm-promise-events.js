YUI.add('gallery-sm-promise-events', function (Y, NAME) {

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
var toArray    = Y.Array,
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
    callbacks will be passed additional _args_ parameters.

    @method fire
    @param {String} type The name of the event to notify subscribers of
    @param {Any*} [args*] Arguments to pass to the callbacks
    @return {Promise.EventNotifier} this instance
    @chainable
    **/
    fire: function (type) {
        var targets = this._targets.slice(),
            known   = {},
            args    = arguments.length > 1 && toArray(arguments, 1, true),
            target, subs,
            i, j, jlen, guid, callback;

        // Add index 0 and 1 entries for use in Y.bind.apply(Y, args) below.
        // Index 0 will be set to the callback, and index 1 will be left as null
        // resulting in Y.bind.apply(Y, [callback, null, arg0,...argN])
        if (args) {
            args.unshift(null, null);
        }

        // Breadth-first notification order, mimicking resolution order
        // Note: Not caching a length comparator because this pushes to the end
        // of the targets array as it iterates.
        for (i = 0; i < targets.length; ++i) {
            target = targets[i];

            if (targets[i]._evts) {
                // Not that this should ever happen, but don't push known
                // promise targets onto the list again. That would make for an
                // infinite loop
                guid = Y.stamp(targets[i]);

                if (known[guid]) {
                    continue;
                }

                known[guid] = 1;

                // Queue any child promises to get notified
                targets.push.apply(targets, targets[i]._evts.targets);

                // Notify subscribers
                subs = target._evts.subs[type];

                if (subs) {
                    for (j = 0, jlen = subs.length; j < jlen; ++j) {
                        callback = subs[j];

                        if (args) {
                            args[0]  = callback;
                            callback = Y.bind.apply(Y, args);
                        }

                        // Force async to mimic resolution lifecycle, and
                        // each callback in its own event loop turn to
                        // avoid swallowing errors and errors breaking the
                        // current js thread.
                        // TODO: would synchronous notifications be better?
                        Y.soon(callback);
                    }
                }
            }
        }

        return this;
    }
});


}, '@VERSION@', {"requires": ["promise"]});
