SmugMug YUI Gallery Modules
===========================

This repo contains open source YUI components that have been contributed to the
[YUI Gallery](http://yuilibrary.com/gallery/) by
[SmugMug](http://www.smugmug.com).


Modules
-------

### [gallery-sm-dom-form-values](src/sm-dom-form-values)

Adds a `Y.DOM.formToObject(identifier)` method to extract form values from the
DOM.

### [gallery-sm-indexed-map](src/sm-indexed-map)

An ordered, indexed hash map data structure. Like [Map](src/sm-map) and Array
got together and had a beautiful baby.

### [gallery-sm-map](src/sm-map)

An ordered hash map data structure with an interface and behavior similar to
(but not exactly the same as) ECMAScript 6 Maps.

### [gallery-sm-menu](src/sm-menu)

An awesome menu widget that makes it easy to create standalone menus, dropdown
menus, and context menus.

### [gallery-sm-promise-events](src/sm-promise-events)

Add an event notification interface to a `Y.Promise` and any child promises it
spawns. Useful for cascading things like cancelation or progress through a
promise chain.

### [gallery-sm-treeview](src/sm-treeview)

A powerful, easy to use, and extremely fast TreeView widget.


Experiments
-----------

These are experimental or work-in-progress modules that may not be fully stable
yet. Feel free to try them out and send feedback though!

### [gallery-sm-dragdrop](src/sm-dragdrop)

A simpler and more efficient drag and drop implementation than the one in YUI
core. Highly optimized for delegation-based drag targets, remaining responsive
and memory-efficient even when managing thousands of draggable nodes.

### [gallery-sm-editor](src/sm-editor)

A simple but powerful contentEditable-based WYSIWYG editor.

### [gallery-sm-focusmanager](src/sm-focusmanager)

A Y.Node plugin that makes it easy to manage keyboard focus among the
descendants of a node. This is a replacement for the soon-to-be-deprecated core
Y.Plugin.NodeFocusManager component in YUI.

### [gallery-sm-selection](src/sm-selection)

Cross-browser Selection and Range APIs.


Useful Links
------------

* [API Docs](http://smugmug.github.com/yui-gallery/api/)


Running Benchmarks
------------------

Some components have Node.js-based performance benchmarks. Here's how to run
them.

First, install [Node.js](http://nodejs.org/) 0.10.x or higher. Then install this
repo's dev dependencies by running the following command from the root of the
repo:

```
$ npm i -g grunt-cli && npm i
```

Next, create a symlink that points to a local clone of the
[YUI](https://github.com/yui/yui3) repo. Don't have a local YUI clone? Create
one!

```
$ ln -s /path/to/yui/repo yui
```

Finally, run the benchmarks:

```
$ grunt benchmark
```

Or, to run the benchmarks for a single component, run
`grunt benchmark:module-name`. For example:

```
$ grunt benchmark:gallery-sm-map
```

License
-------

Copyright (c) 2013 SmugMug, Inc.

Redistribution and use of this software in source and binary forms, with or
without modification, are permitted provided that the following conditions are
met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of SmugMug, Inc. nor the names of this project's
    contributors may be used to endorse or promote products derived from this
    software without specific prior written permission of SmugMug, Inc.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
