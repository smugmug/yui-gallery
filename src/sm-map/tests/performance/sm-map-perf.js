var suite = new PerfSuite('Y.Map', {
    slug: 'sm-map',

    yui: {
        version: '3.12.0',

        config: {
            modules: {
                'gallery-sm-map': 'assets/gallery-sm-map.js'
            }
        },

        use: ['gallery-sm-map'],
    },

    assets: [
        '../../../../build/gallery-sm-map/gallery-sm-map.js'
    ]
});

suite.add('Create a Map instance', function () {
    this.map = new Y.Map();
});

suite.add('Create a string entry', function () {
    map.set('foo', 'bar');
}, {
    setup: function () {
        var map = new Y.Map();
    }
});

suite.add('Get an object key from a large map', function () {
    this.value = map.get(needle);
}, {
    setup: function () {
        var map         = new Y.Map(),
            needle      = {},
            needleIndex = Math.floor(Math.random() * 999);

        for (var i = 0; i < 1000; ++i) {
            if (i === needleIndex) {
                map.set(needle, 'you found me!');
            } else {
                map.set({}, 'not me!');
            }
        }
    }
});
