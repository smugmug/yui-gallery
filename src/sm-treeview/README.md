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
