YUI.add('gallery-sm-indexed-map-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    IndexedMap  = Y.IndexedMap;

var suite = Y.IndexedMapTestSuite = new Y.Test.Suite('IndexedMap');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'constructor should construct an IndexedMap instance': function () {
        var map = new IndexedMap();

        Assert.isInstanceOf(IndexedMap, map);
        Assert.areSame(0, map.size, 'map size should be zero');
    },

    'IndexedMap should extend Map': function () {
        Assert.areSame(Y.Map, IndexedMap.superclass.constructor);
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.array  = [];
        this.fn     = function () {};
        this.object = {};
        this.regex  = /hello!/;

        this.entries = [
            ['a', 'one'],
            [this.array, 'array'],
            [this.fn, 'function'],
            [this.object, 'object'],
            [this.regex, 'regex'],
            [null, 'null'],
            [0, '0'],
            [3.14, 'pi'],
            [false, 'false']
        ];

        this.keys   = [];
        this.values = [];

        for (var i = 0, len = this.entries.length; i < len; ++i) {
            this.keys[i]   = this.entries[i][0];
            this.values[i] = this.entries[i][1];
        }

        this.map        = new IndexedMap(this.entries);
        this.stampedMap = new IndexedMap(this.entries, {autoStamp: true});
    },

    'entryAt() should return the entry at the given index': function () {
        var entry;

        for (var i = 0, len = this.entries.length; i < len; ++i) {
            entry = this.map.entryAt(i);

            Assert.areSame(entry[0], this.entries[i][0], 'key should be correct for entry ' + i);
            Assert.areSame(entry[1], this.entries[i][1], 'value should be correct for entry ' + i);
        }
    },

    'entryAt() should return `undefined` if the given index does not exist': function () {
        Assert.isUndefined(this.map.entryAt(128), 'index 128 should not have an entry');
        Assert.isUndefined(this.map.entryAt(-1), 'index -1 should not have an entry');
    },

    'pop() should remove the last entry and return it': function () {
        var map = new IndexedMap([['a', 'apple'], ['b', 'banana']]),
            removed;

        removed = map.pop();
        Assert.areSame(1, map.size, 'size should be correct');
        ArrayAssert.itemsAreSame(['b', 'banana'], removed, 'removed entry should be correct');

        removed = map.pop();
        Assert.areSame(0, map.size, 'size should be correct (2)');
        ArrayAssert.itemsAreSame(['a', 'apple'], removed, 'removed entry should be correct (2)');
    },

    'pop() should return `undefined` if the map is empty': function () {
        var map = new IndexedMap();
        Assert.isUndefined(map.pop());
    },

    'push() should append entries to the end of the map': function () {
        var map = new IndexedMap();

        map.push(['a', 'apple']);
        Assert.areSame(1, map.size, 'size should be correct');
        Assert.areSame('apple', map.get('a'), '"a" entry should be added');

        map.push(['b', 'banana'], [this.array, 'monkey']);
        Assert.areSame(3, map.size, 'size should be correct (2)');
        Assert.areSame('banana', map.get('b'), '"b" entry should be added');
        Assert.areSame('monkey', map.get(this.array), '"monkey" entry should be added');

        ArrayAssert.itemsAreSame([
            'a', 'b', this.array
        ], map.keys(), 'entries should be in the correct order');
    },

    'push() should return the new size of the map': function () {
        var map = new IndexedMap(),
            size;

        size = map.push(['b', 'banana'], [this.fn, 'monkey']);
        Assert.areSame(2, size);
    },

    'push() should remove existing entries if new entries have the same keys': function () {
        var oldSize = this.map.size;

        this.map.push([this.array, 'new array'], ['a', 'new a']);

        Assert.areSame(oldSize, this.map.size, 'size should not change');
        Assert.areSame('new array', this.map.get(this.array), 'array entry should be correct');
        Assert.areSame('new a', this.map.get('a'), '"a" entry should be correct');

        Assert.areSame(this.array, this.map.keyAt(this.map.size - 2), 'array key should be at the correct index');
        Assert.areSame('new array', this.map.valueAt(this.map.size - 2), 'array value should be at the correct index');
        Assert.areSame('a', this.map.keyAt(this.map.size - 1), '"a" key should be at the correct index');
        Assert.areSame('new a', this.map.valueAt(this.map.size - 1), '"a" value should be at the correct index');
    },

    'shift() should remove the first entry and return it': function () {
        var map = new IndexedMap([['a', 'apple'], ['b', 'banana']]),
            removed;

        removed = map.shift();
        Assert.areSame(1, map.size, 'size should be correct');
        ArrayAssert.itemsAreSame(['a', 'apple'], removed, 'removed entry should be correct');

        removed = map.shift();
        Assert.areSame(0, map.size, 'size should be correct (2)');
        ArrayAssert.itemsAreSame(['b', 'banana'], removed, 'removed entry should be correct (2)');
    },

    'shift() should return `undefined` if the map is empty': function () {
        var map = new IndexedMap();
        Assert.isUndefined(map.shift());
    },

    'slice() should extract a portion of the map and return it as a new IndexedMap': function () {
        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['m', 'manimal'],
            ['s', 'space: 1999']
        ], {objectIdName: 'foo'});

        var result;

        result = map.slice(1, 2);
        Assert.isInstanceOf(Y.IndexedMap, result, 'should be an IndexedMap instance');
        Assert.areSame('foo', result._mapOptions.objectIdName, 'should have the same options');
        ArrayAssert.itemsAreSame(['m'], result.keys(), 'should have the correct keys');
        ArrayAssert.itemsAreSame(['manimal'], result.values(), 'should have the correct values');

        result = map.slice(1);
        Assert.isInstanceOf(Y.IndexedMap, result, 'should be an IndexedMap instance (2)');
        Assert.areSame('foo', result._mapOptions.objectIdName, 'should have the same options (2)');
        ArrayAssert.itemsAreSame(['m', 's'], result.keys(), 'should have the correct keys (2)');
        ArrayAssert.itemsAreSame(['manimal', 'space: 1999'], result.values(), 'should have the correct values (2)');

        result = map.slice(-1);
        Assert.isInstanceOf(Y.IndexedMap, result, 'should be an IndexedMap instance (3)');
        Assert.areSame('foo', result._mapOptions.objectIdName, 'should have the same options (3)');
        ArrayAssert.itemsAreSame(['s'], result.keys(), 'should have the correct keys (3)');
        ArrayAssert.itemsAreSame(['space: 1999'], result.values(), 'should have the correct values (3)');

        result = map.slice(0, -1);
        Assert.isInstanceOf(Y.IndexedMap, result, 'should be an IndexedMap instance (4)');
        Assert.areSame('foo', result._mapOptions.objectIdName, 'should have the same options (4)');
        ArrayAssert.itemsAreSame(['a', 'm'], result.keys(), 'should have the correct keys (4)');
        ArrayAssert.itemsAreSame(['airwolf', 'manimal'], result.values(), 'should have the correct values (4)');

        result = map.slice();
        Assert.isInstanceOf(Y.IndexedMap, result, 'should be an IndexedMap instance (5)');
        Assert.areSame('foo', result._mapOptions.objectIdName, 'should have the same options (5)');
        ArrayAssert.itemsAreSame(map.keys(), result.keys(), 'should have the correct keys (5)');
        ArrayAssert.itemsAreSame(map.values(), result.values(), 'should have the correct values (5)');
    },

    'sort() should sort the entries in the map': function () {
        var map = new Y.IndexedMap([
            [0, 'manimal'],
            [1, 'space: 1999'],
            [2, 'airwolf']
        ]);

        var entries;

        // ASCII sort by value (the default).
        map.sort();
        entries = map.entries();

        Assert.areSame(3, map.size, 'size should not change');
        ArrayAssert.itemsAreSame([2, 'airwolf'], entries[0]);
        ArrayAssert.itemsAreSame([0, 'manimal'], entries[1]);
        ArrayAssert.itemsAreSame([1, 'space: 1999'], entries[2]);

        // Numerical sort by key (a custom sort).
        map.sort(function (a, b) {
            return a[0] - b[0];
        });

        entries = map.entries();

        Assert.areSame(3, map.size, 'size should not change (2)');
        ArrayAssert.itemsAreSame([0, 'manimal'], entries[0]);
        ArrayAssert.itemsAreSame([1, 'space: 1999'], entries[1]);
        ArrayAssert.itemsAreSame([2, 'airwolf'], entries[2]);

        // Reverse ASCII sort by value (a custom sort).
        map.sort(function (a, b) {
            var aValue = a[1].toString(),
                bValue = b[1].toString();

            if (bValue === aValue) {
                return 0;
            }

            return bValue < aValue ? -1 : 1;
        });

        entries = map.entries();

        Assert.areSame(3, map.size, 'size should not change (3)');
        ArrayAssert.itemsAreSame([1, 'space: 1999'], entries[0]);
        ArrayAssert.itemsAreSame([0, 'manimal'], entries[1]);
        ArrayAssert.itemsAreSame([2, 'airwolf'], entries[2]);
    },

    'sort() should be chainable': function () {
        Assert.areSame(this.map, this.map.sort());
    },

    'splice() should remove and return `count` entries starting at `start`': function () {
        var oldSize = this.map.size,
            removed = this.map.splice(2, 2);

        Assert.areSame(oldSize - 2, this.map.size, 'size should be correct');
        Assert.areSame(2, removed.length, 'two removed entries should be returned');

        Assert.areSame(this.keys[2], removed[0][0], 'first removed key should be correct');
        Assert.areSame(this.values[2], removed[0][1], 'first removed value should be correct');

        Assert.areSame(this.keys[3], removed[1][0], 'second removed key should be correct');
        Assert.areSame(this.values[3], removed[1][1], 'second removed value should be correct');

        this.keys.splice(2, 2);
        this.values.splice(2, 2);

        ArrayAssert.itemsAreSame(this.keys, this.map.keys(), 'remaining keys should be correct');
        ArrayAssert.itemsAreSame(this.values, this.map.values(), 'remaining values should be correct');
    },

    'splice() should support a negative `start` index': function () {
        var oldSize = this.map.size,
            removed = this.map.splice(-2, 2);

        Assert.areSame(oldSize - 2, this.map.size, 'size should be correct');
        Assert.areSame(2, removed.length, 'two removed entries should be returned');

        var removedKeys   = this.keys.splice(-2, 2),
            removedValues = this.values.splice(-2, 2);

        Assert.areSame(removedKeys[0], removed[0][0], 'first removed key should be correct');
        Assert.areSame(removedValues[0], removed[0][1], 'first removed value should be correct');

        Assert.areSame(removedKeys[1], removed[1][0], 'second removed key should be correct');
        Assert.areSame(removedValues[1], removed[1][1], 'second removed value should be correct');

        ArrayAssert.itemsAreSame(this.keys, this.map.keys(), 'remaining keys should be correct');
        ArrayAssert.itemsAreSame(this.values, this.map.values(), 'remaining values should be correct');
    },

    'splice() should start removing at index 0 if a negative `start` index exceeds the length of the map': function () {
        var oldSize = this.map.size,
            removed = this.map.splice(-(this.map.length + 5), 2);

        Assert.areSame(oldSize - 2, this.map.size, 'size should be correct');
        Assert.areSame(2, removed.length, 'two removed entries should be returned');

        var removedKeys   = this.keys.splice(-(this.keys.length + 5), 2),
            removedValues = this.values.splice(-(this.values.length + 5), 2);

        Assert.areSame(removedKeys[0], removed[0][0], 'first removed key should be correct');
        Assert.areSame(removedValues[0], removed[0][1], 'first removed value should be correct');

        Assert.areSame(removedKeys[1], removed[1][0], 'second removed key should be correct');
        Assert.areSame(removedValues[1], removed[1][1], 'second removed value should be correct');

        ArrayAssert.itemsAreSame(this.keys, this.map.keys(), 'remaining keys should be correct');
        ArrayAssert.itemsAreSame(this.values, this.map.values(), 'remaining values should be correct');
    },

    "splice() shouldn't remove anything if `start` exceeds the map's length": function () {
        var oldSize = this.map.size,
            removed = this.map.splice(oldSize + 5, 5);

        Assert.areSame(oldSize, this.map.size, 'size should not change');
        ArrayAssert.isEmpty(removed, 'no entries should be removed');
    },

    "splice() shouldn't remove anything if `count` is less than 1": function () {
        var oldSize = this.map.size,
            removed = this.map.splice(1, 0);

        Assert.areSame(oldSize, this.map.size, 'size should not change');
        ArrayAssert.isEmpty(removed, 'no entries should be removed');

        removed = this.map.splice(1, -2);
        Assert.areSame(oldSize, this.map.size, 'size should not change');
        ArrayAssert.isEmpty(removed, 'no entries should be removed');
    },

    'splice() should remove to the end of the map if `count` is not given': function () {
        var oldSize = this.map.size,
            removed = this.map.splice(3);

        Assert.areSame(3, this.map.size, 'size should be correct');
        Assert.areSame(oldSize - 3, removed.length, 'number of removed entries should be correct');
    },

    'splice() should do nothing if `start` is not given, `count` is not given, and no new entries are given': function () {
        var oldSize = this.map.size,
            removed;

        removed = this.map.splice();
        Assert.areSame(oldSize, this.map.size, 'size should not change');
        ArrayAssert.isEmpty(removed, 'nothing should be removed');

        removed = this.map.splice(null);
        Assert.areSame(oldSize, this.map.size, 'size should not change (2)');
        ArrayAssert.isEmpty(removed, 'nothing should be removed (2)');
    },

    "splice() should default `start` to 0 if it isn't given but `count` is": function () {
        var oldSize = this.map.size,
            removed;

        removed = this.map.splice(null, 2);

        Assert.areSame(oldSize - 2, this.map.size, 'size should be correct');
        Assert.areSame(2, removed.length, 'two entries should be removed');
        ArrayAssert.itemsAreSame(this.entries[0], removed[0], 'first removed entry should be correct');
        ArrayAssert.itemsAreSame(this.entries[1], removed[1], 'second removed entry should be correct');
    },

    'splice() should insert new entries': function () {
        var map = new IndexedMap([
            ['a', 'zero'],
            ['b', 'one'],
            ['c', 'two'],
            ['d', 'three']
        ]);

        var oldSize = map.size,

            newKeys   = ['foo', {}, -0, this.array],
            newValues = ['new string', 'new object', 'new number', 'new array'],

            removed;

        removed = map.splice(2, 0,
            [newKeys[0], newValues[0]],
            [newKeys[1], newValues[1]],
            [newKeys[2], newValues[2]],
            [newKeys[3], newValues[3]]
        );

        Assert.areSame(oldSize + 4, map.size, 'size should be correct');
        ArrayAssert.isEmpty(removed, 'no entries should be removed');

        ArrayAssert.itemsAreSame([
            'a',
            'b',
            newKeys[0],
            newKeys[1],
            newKeys[2],
            newKeys[3],
            'c',
            'd'
        ], map.keys(), 'keys should be correct');

        ArrayAssert.itemsAreSame([
            'zero',
            'one',
            newValues[0],
            newValues[1],
            newValues[2],
            newValues[3],
            'two',
            'three'
        ], map.values(), 'values should be correct');

        Assert.areSame('three', map.get('d'), 'internal key-to-index mappings should be correct');
    },

    'splice() should replace existing entries if inserted entries have duplicate keys': function () {
        var map = new IndexedMap([
            ['a', 'one'],
            [this.array, 'array'],
            [this.fn, 'function'],
            [this.object, 'object'],
            [this.regex, 'regex'],
            [null, 'null'],
            [0, '0'],
            [3.14, 'pi'],
            [false, 'false']
        ]);

        var oldSize = map.size,

            newKeys   = ['a', {}, -0, this.array],
            newValues = ['new string', 'new object', 'new number', 'new array'],

            removed;

        removed = map.splice(3, 0,
            [newKeys[0], newValues[0]],
            [newKeys[1], newValues[1]],
            [newKeys[2], newValues[2]],
            [newKeys[3], newValues[3]]
        );

        // New size is only oldSize + 1 because three of the spliced-in keys
        // already existed in the map.
        Assert.areSame(oldSize + 1, map.size, 'size should be correct');

        Assert.areSame(3, removed.length, 'three duplicate entries should be removed');
        Assert.areSame('a', removed[0][0], 'dupe "a" key should be removed');
        Assert.areSame('one', removed[0][1], 'removed "a" value should be correct');
        Assert.areSame(0, removed[1][0], 'dupe `0` key should be removed');
        Assert.areSame('0', removed[1][1], 'removed `0` value should be correct');
        Assert.areSame(this.array, removed[2][0], 'dupe array key should be removed');
        Assert.areSame('array', removed[2][1], 'removed array value should be correct');

        ArrayAssert.itemsAreSame([
            this.fn,
            newKeys[0],
            newKeys[1],
            newKeys[2],
            newKeys[3],
            this.object,
            this.regex,
            null,
            3.14,
            false
        ], map.keys(), 'keys should be correct');

        ArrayAssert.itemsAreSame([
            'function',
            newValues[0],
            newValues[1],
            newValues[2],
            newValues[3],
            'object',
            'regex',
            'null',
            'pi',
            'false'
        ], map.values(), 'values should be correct');
    },

    'splice() should throw a TypeError if an invalid entry is given': function () {
        var test = this;

        Assert.throwsError(TypeError, function () {
            test.map.splice(0, 0, ['value']);
        }, 'should throw if a single-element array is given');

        Assert.throwsError(TypeError, function () {
            test.map.splice(0, 0, ['key', 'value', 'wtf']);
        }, 'should throw if an entry has too many elements');

        Assert.throwsError(TypeError, function () {
            test.map.splice(0, 0, {});
        }, 'should throw if an entry is not an array-like object');
    },

    'unshift() should prepend entries to the beginning of the map': function () {
        var map = new IndexedMap();

        map.unshift(['a', 'apple']);
        Assert.areSame(1, map.size, 'size should be correct');
        Assert.areSame('apple', map.get('a'), '"a" entry should be added');

        map.unshift(['b', 'banana'], [this.array, 'monkey']);
        Assert.areSame(3, map.size, 'size should be correct (2)');
        Assert.areSame('banana', map.get('b'), '"b" entry should be added');
        Assert.areSame('monkey', map.get(this.array), '"monkey" entry should be added');

        ArrayAssert.itemsAreSame([
            'b', this.array, 'a'
        ], map.keys(), 'entries should be in the correct order');
    },

    'unshift() should return the new size of the map': function () {
        var map = new IndexedMap(),
            size;

        size = map.unshift(['b', 'banana'], [this.fn, 'monkey']);
        Assert.areSame(2, size);
    },

    'unshift() should remove existing entries if new entries have the same keys': function () {
        var oldSize = this.map.size;

        this.map.unshift([this.array, 'new array'], ['a', 'new a']);

        Assert.areSame(oldSize, this.map.size, 'size should not change');
        Assert.areSame('new array', this.map.get(this.array), 'array entry should be correct');
        Assert.areSame('new a', this.map.get('a'), '"a" entry should be correct');

        Assert.areSame(this.array, this.map.keyAt(0), 'array key should be at the correct index');
        Assert.areSame('new array', this.map.valueAt(0), 'array value should be at the correct index');
        Assert.areSame('a', this.map.keyAt(1), '"a" key should be at the correct index');
        Assert.areSame('new a', this.map.valueAt(1), '"a" value should be at the correct index');
    }
}));

}, '@VERSION@', {
    requires: ['gallery-sm-indexed-map', 'test']
});
