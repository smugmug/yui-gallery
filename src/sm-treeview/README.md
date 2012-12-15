SmugMug TreeView
=================

A powerful, easy to use, and extremely fast TreeView widget for YUI.

Usage
-----

Basic usage is simple. Create an instance of `Y.TreeView`, specify some nodes
to add to the tree, then render the view into a container node.

```js
YUI().use('gallery-sm-treeview', function (Y) {

    // Create a new TreeView with a few nodes.
    var treeview = new Y.TreeView({
            container: '#treeview',

            nodes: [
                {label: 'One'},
                {label: 'Two', children: [
                    {label: 'Two-One'},
                    {label: 'Two-Two'}
                ]},
                {label: 'Three'}
            ]
        });

    // Render the treeview inside the #container element.
    treeview.render();

});
```

Modules
-------

### gallery-sm-treeview

Provides the `Y.TreeView` component.

### gallery-sm-treeview-templates

Provides the static `Y.TreeView.Templates` namespace, which contains
micro-templates used by `Y.TreeView`.

License
-------

Copyright (c) 2012 SmugMug, Inc.

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
