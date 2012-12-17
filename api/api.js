YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Plugin.Tree.Lazy",
        "Tree",
        "Tree.Node",
        "TreeView"
    ],
    "modules": [
        "gallery-sm-tree",
        "gallery-sm-tree-lazy",
        "gallery-sm-tree-node",
        "gallery-sm-treeview"
    ],
    "allModules": [
        {
            "displayName": "gallery-sm-tree",
            "name": "gallery-sm-tree",
            "description": "Provides the `Tree` class."
        },
        {
            "displayName": "gallery-sm-tree-lazy",
            "name": "gallery-sm-tree-lazy",
            "description": "Provides `Plugin.Tree.Lazy`, a plugin for `Tree` that makes it easy to lazily\nload and populate the contents of tree nodes the first time they're opened."
        },
        {
            "displayName": "gallery-sm-tree-node",
            "name": "gallery-sm-tree-node",
            "description": "Provides the `Tree.Node` class, which represents a tree node contained in a\n`Tree` data structure."
        },
        {
            "displayName": "gallery-sm-treeview",
            "name": "gallery-sm-treeview",
            "description": "Provides the `Y.TreeView` widget."
        }
    ]
} };
});