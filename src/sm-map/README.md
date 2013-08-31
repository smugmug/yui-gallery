SmugMug Map
===========

An ordered map data structure with an interface and behavior similar to (but not
exactly the same as) [ECMAScript 6 Maps][es6-maps].

[es6-maps]:http://people.mozilla.org/~jorendorff/es6-draft.html#sec-15.14


Features
--------

* Efficient key/value data structure that maintains insertion order.

* Use any JavaScript value (including objects, arrays, functions, `NaN`, even
  DOM elements) as keys.

* Iterate over the map using `each()`, retrieve an array of entries with
  `entries()`, retrieve an array of keys with `keys()`, or retrieve an array of
  values with `values()`.

* O(1) lookup time for string keys. O(n) lookup time for other key types.


Useful Links
------------

* [API Docs][api-docs]

[api-docs]:http://smugmug.github.io/yui-gallery/api/classes/Map.html


Example
-------

_**Note:** gallery-sm-map isn't yet available on the Y! CDN, but feel free to
grab it from this git repo!_

[Run this example!](http://codepen.io/rgrove/pen/ImcsL)

```js
YUI().use('gallery-sm-map', function (Y) {
    var map = new Y.Map();

    // String keys are super efficient.
    map.set('foo', 'bar');
    console.log(map.get('foo')); // => 'bar'

    // ...but object keys can be super convenient.
    var object = {};
    map.set(object, 'my key is an object!');
    console.log(map.get(object)); // => 'my key is an object!'

    // Even NaN can be a key!
    map.set(NaN, 'my key is not a number!');
    console.log(map.get(NaN)); // => 'my key is not a number!'

    // Iteration is easy.
    map.each(function (value, key) {
        // ...
    });
});
```


Differences from ES6 Maps
-------------------------

* `delete()` and `remove()` are equivalent for backwards compatibility with
  browsers that don't support reserved words as property names (in ES6, only
  `delete()` is defined).

* `each()` and `forEach()` are equivalent (in ES6, only `forEach()` is defined).

* `each()` and `forEach()` are chainable.

* `get()` supports an optional `defaultValue` argument that will be returned if
  the given key isn't found.

* `toJSON()` is an alias for `entries()` (ES6 doesn't define `toJSON()`).

* Does not support ES6 iterators, as most browsers don't implement them yet.

* The Y.Map constructor doesn't accept a `comparator` argument, whereas the ES6
  Map constructor does. Its only valid value in ES6 is the string "is", which
  causes an ES6 Map to treat `0` and `-0` as distinct values. If you care about
  this for some reason, I'd love to know why.

* In older browsers (notably IE8 and lower), the `size` property is enumerable
  and writable. This is unavoidable due to limitations in these browsers.

* In older browsers that don't support `Object.create()` (IE8 and lower), string
  keys with names that conflict with property names on `Object.prototype` will
  have O(n) lookup times.
