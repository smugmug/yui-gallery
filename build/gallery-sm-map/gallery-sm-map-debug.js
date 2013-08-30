YUI.add('gallery-sm-map', function (Y, NAME) {

/*jshint es3: true, globalstrict: true, indent: 4 */

"use strict";

var isNative           = Y.Lang._isNative,
    nativeObjectCreate = isNative(Object.create),
    sizeIsGetter       = isNative(Object.defineProperty) && Y.UA.ie !== 8;

function YMap(entries) {
    this.clear();

    if (entries) {
        if (!Y.Lang.isArray(entries)) {
            entries = Array.prototype.slice.call(entries);
        }

        var entry;

        for (var i = 0, len = entries.length; i < len; ++i) {
            entry = entries[i];
            this.set(entry[0], entry[1]);
        }
    }
}

// In modern browsers, the `size` property is a non-enumerable getter on the
// prototype, as specified in ES6. In older browsers (mainly IE<9), we just
// manually update a plain old instance property.
if (sizeIsGetter) {
    Object.defineProperty(YMap.prototype, 'size', {
        configurable: true,

        get: function () {
            return this._mapKeys.length;
        }
    });
}

Y.mix(YMap.prototype, {
    // -- Public Properties ----------------------------------------------------

    /**
    The number of entries in this map.

    @property {Number} size
    @default 0
    @readOnly
    **/

    // -- Public Methods -------------------------------------------------------

    /**
    Deletes all entries from this map.

    @method clear
    @chainable
    **/
    clear: function () {
        this._mapKeyIndices = nativeObjectCreate ? Object.create(null) : {};
        this._mapKeys       = [];
        this._mapValues     = [];

        if (!sizeIsGetter) {
            this.size = 0;
        }

        return this;
    },

    /**
    Executes the given _callback_ function on each entry in this map.

    @method each
    @param {Function} callback Callback function.
        @param {Mixed} callback.value Value being iterated.
        @param {Mixed} callback.key Key being iterated.
        @param {Map} callback.map Reference to this map.
    @param {Object} [thisObj] `this` object to use when calling _callback_.
    @chainable
    @see forEach
    **/
    each: function (callback, thisObj) {
        var entries = this.entries(),
            entry;

        for (var i = 0, len = entries.length; i < len; ++i) {
            entry = entries[i];

            if (0 in entry) {
                callback.call(thisObj, entry[1], entry[0], this);
            }
        }

        return this;
    },

    /**
    Returns an array of all the entries in this map. Each entry is an array with
    two items, the first being a key and the second a value associated with that
    key.

    @method entries
    @return {Array} Array of entries.
    **/
    entries: function () {
        var entries = [];

        for (var i = 0, len = this._mapKeys.length; i < len; ++i) {
            entries.push([this._mapKeys[i], this._mapValues[i]]);
        }

        return entries;
    },

    /**
    Returns the value associated with the given _key_, or _default_ if the key
    isn't found.

    @method get
    @param {Mixed} key Key to look up.
    @param {Mixed} [defaultValue] Default value to return if _key_ isn't found.
    @return {Mixed} Value associated with the given _key_, or _default_ if the
        key isn't found.
    **/
    get: function (key, defaultValue) {
        var i = this._indexOfKey(key);
        return i < 0 ? defaultValue : this._mapValues[i];
    },

    /**
    Returns `true` if _key_ exists in this map, `false` otherwise.

    @method has
    @param {Mixed} key Key to look up.
    @return {Boolean} `true` if _key_ exists in this map, `false` otherwise.
    **/
    has: function (key) {
        return this._indexOfKey(key) >= 0;
    },

    /**
    Returns an array of all the keys in this map.

    @method keys
    @return {Array} Array of keys.
    **/
    keys: function () {
        return Array.prototype.slice.call(this._mapKeys);
    },

    /**
    Deletes the entry with the given _key_.

    @method remove
    @param {Mixed} key Key to delete.
    @return {Boolean} `true` if the key existed and was deleted, `false`
        otherwise.
    **/
    remove: function (key) {
        var i = this._indexOfKey(key);

        if (i < 0) {
            return false;
        }

        this._mapKeys.splice(i, 1);
        this._mapValues.splice(i, 1);

        if (typeof key === 'string') {
            delete this._mapKeyIndices[key];
        }

        if (!sizeIsGetter) {
            this.size = this._mapKeys.length;
        }

        return true;
    },

    /**
    Sets the value of the entry with the given _key_. If the key already exists,
    its value will be overwritten; otherwise it will be created.

    The _key_ may be any JavaScript value (including both primitives and
    objects), but string keys will allow fast lookups, whereas non-string keys
    will result in slower lookups.

    @method set
    @param {Mixed} key Key to set.
    @param {Mixed} value Value to set.
    @chainable
    **/
    set: function (key, value) {
        var i = this._indexOfKey(key);

        if (i < 0) {
            i = this._mapKeys.length;
        }

        this._mapKeys[i]   = key;
        this._mapValues[i] = value;

        if (typeof key === 'string') {
            this._mapKeyIndices[key] = i;
        }

        if (!sizeIsGetter) {
            this.size = this._mapKeys.length;
        }

        return this;
    },

    /**
    Returns an array of all the values in this map.

    @method values
    @return {Array} Array of values.
    **/
    values: function () {
        return Array.prototype.slice.call(this._mapValues);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Returns the numerical index of the entry with the given _key_, or `-1` if
    not found.

    This is a very efficient operation with string keys, but is slower with
    non-string keys.

    @method _indexOfKey
    @param {Mixed} key Key to look up.
    @return {Number} Index of the entry with the given _key_, or `-1` if not
        found.
    @protected
    **/
    _indexOfKey: function (key) {
        var i;

        // If the key is a string, do a fast hash lookup for the index.
        if (typeof key === 'string') {
            i = this._mapKeyIndices[key];
            return i >= 0 ? i : -1;
        }

        // Otherwise, do a slow O(n) lookup.
        var keys = this._mapKeys,
            is   = this._is,
            len;

        for (i = 0, len = keys.length; i < len; ++i) {
            if (is(keys[i], key)) {
                return i;
            }
        }

        return -1;
    },

    /**
    Returns `true` if the two given values are the same value, `false`
    otherwise.

    This is an implementation of the ES5/6 SameValue comparison algorithm, which
    is more correct than `===` in that it considers `NaN` to be the same as
    `NaN`, and does not consider `0` to be the same as `-0`.

    This method is an alias for `Object.is()` if available, or a fallback
    implementation if not.

    @method _is
    @param {Mixed} a First value to compare.
    @param {Mixed} b Second value to compare.
    @return {Boolean} `true` if _a_ and _b_ are the same value, `false`
        otherwise.
    @protected
    **/
    _is: isNative(Object.is) ? Object.is : function (a, b) {
        if (a === b) {
            // 0 === -0, but they're not identical.
            return a !== 0 || 1 / a === 1 / b;
        }

        // NaN !== NaN, but they're identical.
        return a !== a && b !== b;
    }
}, true);

/**
Alias for `remove()`.

@method delete
@see remove
**/
YMap.prototype['delete'] = YMap.prototype.remove;

/**
Alias for `each()`.

@method forEach
@see each
**/
YMap.prototype.forEach = YMap.prototype.each;

/**
Returns a JSON-serializable representation of this map.

This is effectively an alias for `entries()`, but could be overridden to
return a customized representation.

@method toJSON
@return {Array} JSON-serializable array of entries in this map.
**/
YMap.prototype.toJSON = YMap.prototype.entries;

Y.Map = YMap;


}, '@VERSION@', {"requires": []});
