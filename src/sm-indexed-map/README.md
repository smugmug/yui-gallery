SmugMug IndexedMap
==================

An ordered, indexed hash map data structure. Like Map and Array got together and
had a beautiful baby.

Provides constant time key-based lookups as well as numerical index-based
lookups, splicing, and other array-like functionality. Keys may be any value,
including objects.

The Y.IndexedMap class extends [Y.Map][map]. See that module's documentation for
more details on Map fundamentals.

[map]:../sm-map
[es6-maps]:http://people.mozilla.org/~jorendorff/es6-draft.html#sec-15.14


Features
--------

* Efficient indexed key/value data structure that maintains insertion order.

* Use any JavaScript value (including objects, arrays, functions, `NaN`, even
  DOM elements) as keys.

* Look up values quickly either by key or by numerical index.

* Supports all your favorite array-like operations: `push()`, `pop()`,
  `shift()`, `splice()`, and more.

* Iterate over the map using `each()`, retrieve an array of entries with
  `entries()`, retrieve an array of keys with `keys()`, or retrieve an array of
  values with `values()`.

* O(1) lookup time for string keys. O(n) lookup time for other key types.

* Set the `objectIdName` property to the name of a property to use as a unique
  id string for object keys, enabling much faster O(1) lookups for object keys
  that already have meaningful unique ids.

* Or enable the `autoStamp` option to automatically stamp object keys with
  unique ids, enabling much faster O(1) lookups for object keys with no effort
  on your part.


Useful Links
------------

* [API Docs][api-docs]

[api-docs]:http://smugmug.github.io/yui-gallery/api/classes/IndexedMap.html
