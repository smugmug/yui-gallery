YUI.add('gallery-sm-indexed-map', function (Y, NAME) {

/*jshint es3: true, globalstrict: true, indent: 4 */

/**
Provides the `Y.IndexedMap` data structure.

@module gallery-sm-indexed-map
@main gallery-sm-indexed-map
**/

/**
An ordered, indexed hash map data structure. Like `Y.Map` and Array got together
and had a beautiful baby.

Provides constant time key-based lookups as well as numerical index-based
lookups, splicing, and other array-like functionality. Keys may be any value,
including objects.

The `Y.IndexedMap` class extends `Y.Map`. See that module's documentation for
more details on Map fundamentals.

@class IndexedMap
@extends Map
@constructor
@param {Array[]|Map} [entries] Array or Map of entries to add to this map. If an
    array, then each entry should itself be an array in which the first item is
    the key and the second item is the value for that entry.

@param {Object} [options] Options.

    @param {Boolean} [options.autoStamp=false] If `true`, objects used as keys
        will be automatically stamped with a unique id as the value of the
        property defined by the `objectIdName` option ("_yuid" by default) if
        that property isn't already set. This will result in much faster lookups
        for object keys.

    @param {String} [options.objectIdName="_yuid"] Name of a property whose
        string value should be used as the unique key when present on an object
        that's given as a key. This will significantly speed up lookups of
        object-based keys that define this property.
**/

"use strict";

var protoSlice = Array.prototype.slice;

function IndexedMap() {
    Y.Map.apply(this, arguments);
}

Y.IndexedMap = Y.extend(IndexedMap, Y.Map, {
    // -- Public Methods -------------------------------------------------------

    /**
    Returns the entry at the given _index_, or `undefined` if not found.

    An entry is an array with two items, the first being a key and the second a
    value associated with that key.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ]);

        map.entryAt(1); // => ['b', 'battlestar galactica']
        map.entryAt(5); // => undefined

    @method entryAt
    @param {Number} index Index to look up.
    @return {Array|undefined} Entry at the given _index_, or `undefined` if not
        found.
    **/
    entryAt: function (index) {
        if (index in this._mapKeys) {
            return [this._mapKeys[index], this._mapValues[index]];
        }
    },

    /**
    Returns the numerical index of the entry with the given _key_, or `-1` if
    not found.

    This is a very efficient operation with string keys, but may be slower with
    non-string keys.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ]);

        map.indexOfKey('b'); // => 1
        map.indexOfKey('z'); // => -1

    @method indexOfKey
    @param {Mixed} key Key to look up.
    @return {Number} Index of the entry with the given _key_, or `-1` if not
        found.
    @protected
    **/
    indexOfKey: function (key) {
        return Y.Map.prototype._indexOfKey.call(this, key);
    },

    /**
    Returns the key at the given _index_, or `undefined` if not found.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ]);

        map.keyAt(0); // => 'a'
        map.keyAt(5); // => undefined

    @method keyAt
    @param {Number} index Index to look up.
    @return {Mixed} Key at the given _index_, or `undefined` if not found.
    **/
    keyAt: function (index) {
        return this._mapKeys[index];
    },

    /**
    Removes the last entry from this map and returns it.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ]);

        map.pop(); // => ['b', 'battlestar galactica']
        map.pop(); // => ['a', 'airwolf']
        map.pop(); // => undefined

    @method pop
    @return {Array} Entry that was removed, or `undefined` if this map is empty.
    **/
    pop: function () {
        var len = this._mapKeys.length,

            entry,
            i;

        if (len) {
            i     = len - 1;
            entry = [this._mapKeys[i], this._mapValues[i]];

            this._removeMapEntry(i);
            this._updateMapSize();

            return entry;
        }
    },

    /**
    Appends the given entry or entries to the end of this map and returns the
    map's new size.

    Any entries that already exist in this map with the same keys as the new
    entries will be removed to make way for the new entries, regardless of their
    position. If this map has been sorted, you may need to re-sort it after
    appending new entries.

    @example

        var map = new Y.IndexedMap();

        map.push(
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ); // => 2

        map.get('a'); // => 'airwolf'

    @method push
    @param {Array} entry* One or more entries to append to this map.
    @return {Number} New size of this map.
    **/
    push: function () {
        var args = protoSlice.call(arguments);

        args.unshift(this._mapKeys.length, 0);
        this.splice.apply(this, args);

        return this.size;
    },

    /**
    Removes the first entry from this map and returns it. This will cause the
    indices of subsequent entries in the map to be adjusted.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ]);

        map.shift(); // => ['a', 'airwolf']
        map.shift(); // => ['b', 'battlestar galactica']
        map.shift(); // => undefined

    @method shift
    @return {Array} Entry that was removed, or `undefined` if this map is empty.
    **/
    shift: function () {
        if (this._mapKeys.length) {
            return this.splice(0, 1)[0];
        }
    },

    /**
    Returns a new IndexedMap containing a shallow copy of a portion of this map.

    The returned map will be created using the same options and constructor as
    this map.

    This method does not remove any entries or modify this map in any way.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['m', 'manimal'],
            ['s', 'space: 1999']
        ]);

        map.slice(1, 2);
        // => new IndexedMap containing ['m', 'manimal']

        map.slice(1);
        // => new IndexedMap containing ['m', 'manimal'] and ['s', 'space: 1999']

        map.slice(-1);
        // => new IndexedMap containing ['s', 'space: 1999']

        map.slice(0, -1);
        // => new IndexedMap containing ['a', 'airwolf'] and ['m', 'manimal']

        map.slice();
        // => new IndexedMap containing all three entries (effectively a copy)

    @method slice
    @param {Number} [begin] Zero-based index at which to begin extracting
        entries. If _begin_ is negative, it will be treated as relative to the
        end of the map. If _begin_ is omitted, it defaults to `0`.
    @param {Number} [end] Zero-based index at which to end extraction. `slice()`
        extracts entries up to but not including _end_. If _end is negative, it
        will be treated as relative to the end of the map. If _end_ is omitted,
        all elements between _begin_ and the end of the map will be extracted.
    @return {IndexedMap} New IndexedMap containing a shallow copy of the
        specified portion of this map.
    **/
    slice: function (begin, end) {
        var entries = [],

            keys,
            values;

        // Some browsers (guess which ones!) don't like it if you pass an
        // `undefined` end argument.
        if (typeof end === 'undefined') {
            keys   = this._mapKeys.slice(begin);
            values = this._mapValues.slice(begin);
        } else {
            keys   = this._mapKeys.slice(begin, end);
            values = this._mapValues.slice(begin, end);
        }

        for (var i = 0, len = keys.length; i < len; ++i) {
            entries[i] = [keys[i], values[i]];
        }

        return new this.constructor(entries, this._mapOptions);
    },

    /**
    Sorts the entries in this map.

    If a _callback_ is not given, entries will be sorted by converting their
    values to strings and comparing the values in lexicographic order (a simple
    ASCII sort).

    If a _callback_ is given, entries will be sorted according to the return
    value of the callback. The two entries (_a_ and _b_) passed to the callback
    are sorted based on the value the callback returns.

    The callback should return `-1` (or any negative number) to sort _a_ before
    _b_, `0` if _a_ and _b_ are equal, `1` (or any positive number) to sort _b_
    before _a_.

    @example

        var map = new Y.IndexedMap([
            [0, 'manimal'],
            [1, 'space: 1999'],
            [2, 'airwolf']
        ]);

        // ASCII sort by string values (the default).
        map.sort();

        map.entries();
        // => [
        //     [2, 'airwolf'],
        //     [0, 'manimal'],
        //     [1, 'space: 1999']
        // ]

        // Numerical sort by key (a custom sort).
        map.sort(function (a, b) {
            return a[0] - b[0];
        });

        map.entries();
        // => [
        //     [0, 'manimal'],
        //     [1, 'space: 1999']
        //     [2, 'airwolf'],
        // ]

        // Reverse ASCII sort by value (a custom sort).
        map.sort(function (a, b) {
            var aValue = a[1].toString(),
                bValue = b[1].toString();

            if (bValue === aValue) {
                return 0;
            }

            return bValue < aValue ? -1 : 1;
        });

        map.entries();
        // => [
        //     [1, 'space: 1999']
        //     [0, 'manimal'],
        //     [2, 'airwolf'],
        // ]

    @method sort
    @param {Function} [callback] Sort comparator callback. Receives two entriess
        as arguments, and should return an integer indicating whether the first
        is less than (`-1`), equal to (`0`), or greater than (`1`) the second.

        @param {Array} callback.a First entry to compare. An entry is an array
            in which the first element is the key and the second element is the
            value.
        @param {Array} callback.b Second entry to compare.

    @chainable
    **/
    sort: function (callback) {
        var entries = this.entries(),
            entry;

        entries.sort(callback || this._defaultSortFn);
        this.clear();

        for (var i = 0, len = entries.length; i < len; ++i) {
            entry = entries[i];
            this.set(entry[0], entry[1]);
        }

        return this;
    },

    /**
    Changes the contents of this map, adding new entries while removing old
    entries.

    If one or more new entries are specified, they will be added to this map
    starting at _start_.

    Any entries that already exist in this map with the same keys as the new
    entries will be removed to make way for the new entries, regardless of their
    position. If this map has been sorted, you may need to re-sort it after
    splicing in new entries.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['m', 'manimal'],
            ['s', 'space: 1999']
        ]);

        // Insert 'battlestar galactica' between 'airwolf' and 'manimal'.
        map.splice(1, 0, ['b', 'battlestar galactica']); // => []

        // Remove 'manimal'.
        map.splice(2, 1); // => [['m', 'manimal']]

        // Insert 'mission: impossible' and 'star trek' after
        // `battlestar galactica`. Since 'star trek' reuses the 's' key, the
        // 'space: 1999' entry will be removed.
        map.splice(2, 0, ['m', 'mission: impossible'], ['s', 'star trek']);
        // => [['s', 'space: 1999']]

        // Remove everything after 'airwolf', because who needs those shows
        // when you've got a show about a badass helicopter?
        map.splice(1);
        // => [['b', 'battlestar galactica'], ['m', 'mission: impossible'],
        //     ['s', 'star trek']]

    @method splice
    @param {Number} start Index at which to start changing this map. A negative
        value will result in a position relative to the end of the map.
    @param {Number} [count] Number of entries to remove, starting at _start_. If
        _count_ is `0`, no entries will be removed. If no `count` parameter is
        given, all entries after _start_ will be removed.
    @param {Array} [entry*] Zero or more new entries to add to this map. Each
        entry must be an array in which the first element is the key and the
        second element is the value to add.
    @return {Array[]} An array of entries that were removed, if any.
    **/
    splice: function (start, count) {
        var mapKeys        = this._mapKeys,
            mapValues      = this._mapValues,
            removedEntries = [],

            actualStart,
            i,
            len;

        // Determine the actual start index, since `start` may be relative.
        if (start < 0) {
            actualStart = Math.max(0, mapKeys.length + start);
        } else {
            actualStart = Math.min(mapKeys.length, start || 0);
        }

        // If `start` was given but `count` wasn't given, remove all entries
        // from `start` to the end of the map.
        if (typeof count === 'undefined' && Y.Lang.isNumber(start)) {
            count = mapKeys.length - actualStart;
        }

        start || (start = 0);

        // Remove keys and values.
        if (count) {
            var removedKeys   = mapKeys.splice(start, count),
                removedValues = mapValues.splice(start, count);

            // Remove key-to-index mappings for keys that were removed.
            for (i = 0, len = removedKeys.length; i < len; ++i) {
                removedEntries[i] = [removedKeys[i], removedValues[i]];
            }

            if (removedEntries.length) {
                this._isIndexStale = true;
            }
        }

        // Add new entries (if any).
        var newEntries = protoSlice.call(arguments, 2);

        if (newEntries.length) {
            var keyIndex,
                newEntry,
                newKey,
                newValue;

            // Splice new entries in after the start index.
            for (i = 0, len = newEntries.length; i < len; ++i) {
                newEntry = newEntries[i];

                if (newEntry.length !== 2) {
                    throw new TypeError('Invalid map entry: ' +
                        newEntry.toString());
                }

                newKey   = newEntry[0];
                newValue = newEntry[1];
                keyIndex = this.indexOfKey(newKey);

                if (keyIndex >= 0) {
                    // The key already exists in this map, so we have to remove
                    // it before we can reuse it in a new spliced entry.
                    removedEntries.push([mapKeys[keyIndex],
                        mapValues[keyIndex]]);

                    this._removeMapEntry(keyIndex);

                    // If the removed key preceded `actualStart`, adjust
                    // `actualStart` to account for the difference.
                    if (keyIndex < actualStart) {
                        actualStart -= 1;
                    }
                }

                // Add the new entry to the map.
                if (actualStart === mapKeys.length) {
                    // If `actualStart` is at the end of the map, we can append
                    // things without needing to reindex the map.
                    mapKeys[actualStart]   = newKey;
                    mapValues[actualStart] = newValue;

                    this._indexMapKey(actualStart, newKey);
                } else {
                    // `actualStart` is not at the end of the map, so we'll need
                    // to reindex the map.
                    mapKeys.splice(actualStart, 0, newKey);
                    mapValues.splice(actualStart, 0, newValue);

                    this._isIndexStale = true;
                }

                // Increment `actualStart` so that subsequent new entries are
                // added at the correct position.
                actualStart += 1;
            }
        }

        this._updateMapSize();

        return removedEntries;
    },

    /**
    Prepends the given entry or entries to the beginning of this map and returns
    the map's new size.

    Any entries that already exist in this map with the same keys as the new
    entries will be removed to make way for the new entries, regardless of their
    position. If this map has been sorted, you may need to re-sort it after
    prepending new entries.

    @example

        var map = new Y.IndexedMap([
            ['m', 'manimal'],
            ['s', 'space: 1999']
        ]);

        map.unshift(
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ); // => 2

        map.entries();
        // => [
        //     ['a', 'airwolf'],
        //     ['b', 'battlestar galactica'],
        //     ['m', 'manimal'],
        //     ['s', 'space: 1999']
        // ]

    @method unshift
    @param {Array} entry* One or more entries to append to this map.
    @return {Number} New size of this map.
    **/
    unshift: function () {
        var args = protoSlice.call(arguments);

        args.unshift(0, 0);
        this.splice.apply(this, args);

        return this.size;
    },

    /**
    Returns the value at the given _index_, or `undefined` if not found.

    @example

        var map = new Y.IndexedMap([
            ['a', 'airwolf'],
            ['b', 'battlestar galactica']
        ]);

        map.valueAt(0); // => 'airwolf'
        map.valueAt(5); // => undefined

    @method valueAt
    @param {Number} index Index to look up.
    @return {Mixed} Value at the given _index_, or `undefined` if not found.
    **/
    valueAt: function (index) {
        return this._mapValues[index];
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Default sort comparator used when `sort()` is called without a callback.

    @method _defaultSortFn
    @param {Array} a First entry to compare.
    @param {Array} b Second entry to compare.
    @return {Number} Result of the comparison.
    @protected
    **/
    _defaultSortFn: function (a, b) {
        var aValue = a[1].toString(),
            bValue = b[1].toString();

        return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0));
    }
});


}, '@VERSION@', {"requires": ["gallery-sm-map", "oop"]});
