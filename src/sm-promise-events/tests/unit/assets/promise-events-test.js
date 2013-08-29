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

    'event subscribers should receive fire(type, THIS_STUFF)': function () {
        var test     = this,
            details  = { message: 'testing' },
            notifier = new Y.Promise.EventNotifier(),
            promise  = new Y.Promise(function (resolve) {
                resolve();
            });

        notifier.addEvents(promise);

        promise.on('test', function (x, y) {
            test.resume(function () {
                Y.Assert.areSame(details, x);
                Y.Assert.areSame('a', y);
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
        }).on('test', function (x, y) {
            test.resume(function () {
                Y.Assert.areSame(details, x);
                Y.Assert.areSame('a', y);
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
