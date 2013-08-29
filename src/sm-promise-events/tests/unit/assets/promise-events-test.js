YUI.add('promise-events-test', function (Y) {

var suite = new Y.Test.Suite('Promise.EventNotifier');

suite.add(new Y.Test.Case({
    name: 'Instantiation',

    'constructor should create a new instance': function () {
        var notifier = new Y.Promise.EventNotifier();

        Y.Assert.isInstanceOf(Y.Promise.EventNotifier, notifier);
    }
}));

suite.add(new Y.Test.Case({
    name: 'on(type, callback)',

    'event subscribers should be notified': function () {
        var test     = this,
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            });

        notifier.addEvents(promise);

        promise.on('test', function (e) {
            test.resume(function () {
                Y.Assert.isTrue(true);
            });
        });

        // In a setTimeout because we're not testing asynchronicity, so forcing
        // async avoids test noise.
        setTimeout(function () {
            notifier.fire('test');
        }, 0);

        test.wait();
    },

    'event object should receive an event object': function () {
        var test     = this,
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            });

        notifier.addEvents(promise);

        promise.on('test', function (e) {
            test.resume(function () {
                Y.Assert.isObject(e);
            });
        });

        // In a setTimeout because we're not testing asynchronicity, so forcing
        // async avoids test noise.
        setTimeout(function () {
            notifier.fire('test');
        }, 0);

        test.wait();
    },

    'event object should have fire(name, THIS_STUFF)': function () {
        var test     = this,
            details  = { message: 'testing' },
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            });

        notifier.addEvents(promise);

        promise.on('test', function (e) {
            test.resume(function () {
                Y.Assert.isObject(e);
                Y.Assert.areSame('testing', e.message);
                Y.Assert.areSame('test', e.type);
                Y.Assert.isArray(e.details);
                Y.Assert.areSame(details, e.details[0]);
                Y.Assert.areSame('a', e.details[1]);
            });
        });

        // In a setTimeout because we're not testing asynchronicity, so forcing
        // async avoids test noise.
        setTimeout(function () {
            notifier.fire('test', details, 'a');
        }, 0);

        test.wait();
    },

    'promise children should have on() method': function () {
        var test     = this,
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            }),
            childPromise;

        notifier.addEvents(promise);

        childPromise = promise.then(function () {});

        Y.Assert.isFunction(childPromise.on);
    },

    "promise children's then() should also propagate event support": function () {
        var test     = this,
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            }),
            childPromise;

        notifier.addEvents(promise);

        childPromise = promise.then(function () {}).then(function () {});

        Y.Assert.isFunction(childPromise.on);
    },

    'promise children subscribers should also be notified': function () {
        var test     = this,
            details  = { message: 'testing' },
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            });

        notifier.addEvents(promise);

        promise.then(function () {
            // no-op
        }).on('test', function (e) {
            test.resume(function () {
                Y.Assert.isObject(e);
                Y.Assert.areSame('testing', e.message);
                Y.Assert.areSame('test', e.type);
                Y.Assert.isArray(e.details);
                Y.Assert.areSame(details, e.details[0]);
                Y.Assert.areSame('a', e.details[1]);
            });
        });

        // In a setTimeout because we're not testing asynchronicity, so forcing
        // async avoids test noise.
        setTimeout(function () {
            notifier.fire('test', details, 'a');
        }, 0);

        test.wait();
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['gallery-sm-promise-events', 'test']
});
