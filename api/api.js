YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DragDrop",
        "Editor",
        "Editor.Base",
        "Editor.Block",
        "Editor.DOM",
        "Editor.Delete",
        "Editor.Format",
        "Editor.Keys",
        "Editor.Link",
        "Editor.Queue",
        "Editor.Style",
        "Editor.Undo",
        "IndexedMap",
        "Map",
        "Menu",
        "Menu.Base",
        "Menu.Item",
        "Menu.Templates",
        "Plugin.DragDrop.Reorder",
        "Plugin.FocusManager",
        "Plugin.Menu",
        "Promise.EventNotifier",
        "Range",
        "Selection",
        "TreeView",
        "TreeView.Sortable"
    ],
    "modules": [
        "gallery-sm-dragdrop",
        "gallery-sm-dragdrop-reorder",
        "gallery-sm-editor",
        "gallery-sm-editor-base",
        "gallery-sm-editor-block",
        "gallery-sm-editor-delete",
        "gallery-sm-editor-dom",
        "gallery-sm-editor-format",
        "gallery-sm-editor-keys",
        "gallery-sm-editor-link",
        "gallery-sm-editor-queue",
        "gallery-sm-editor-style",
        "gallery-sm-focusmanager",
        "gallery-sm-indexed-map",
        "gallery-sm-map",
        "gallery-sm-menu",
        "gallery-sm-menu-base",
        "gallery-sm-menu-item",
        "gallery-sm-menu-plugin",
        "gallery-sm-menu-templates",
        "gallery-sm-promise-events",
        "gallery-sm-range",
        "gallery-sm-selection",
        "gallery-sm-treeview",
        "gallery-sm-treeview-sortable"
    ],
    "allModules": [
        {
            "displayName": "dom-form-values",
            "name": "dom-form-values",
            "description": "Adds a `Y.DOM.formToObject(identifier)` method to extract the values from a\n`<form>` element and return an object map of element name to value(s)."
        },
        {
            "displayName": "gallery-sm-dragdrop",
            "name": "gallery-sm-dragdrop",
            "description": "Provides the `DragDrop` class, a simpler and more efficient drag and drop\nimplementation than the one in YUI core."
        },
        {
            "displayName": "gallery-sm-dragdrop-reorder",
            "name": "gallery-sm-dragdrop-reorder",
            "description": "Provides the `Plugin.DragDrop.Reorder` class, a `DragDrop` plugin that adds\ndrag-to-reorder functionality to a collection of nodes."
        },
        {
            "displayName": "gallery-sm-editor",
            "name": "gallery-sm-editor",
            "description": "Provides `Y.Editor`, a simple but powerful WYSIWYG editor."
        },
        {
            "displayName": "gallery-sm-editor-base",
            "name": "gallery-sm-editor-base",
            "description": "Provides `Y.Editor.Base`, the core implementation of the SmugMug editor."
        },
        {
            "displayName": "gallery-sm-editor-block",
            "name": "gallery-sm-editor-block",
            "description": "Provides the `Editor.Block` extension."
        },
        {
            "displayName": "gallery-sm-editor-delete",
            "name": "gallery-sm-editor-delete",
            "description": "Provides the `Editor.Delete` extension."
        },
        {
            "displayName": "gallery-sm-editor-dom",
            "name": "gallery-sm-editor-dom",
            "description": "Provides the `Editor.DOM` utility class."
        },
        {
            "displayName": "gallery-sm-editor-format",
            "name": "gallery-sm-editor-format",
            "description": "Provides the `Editor.Format` extension."
        },
        {
            "displayName": "gallery-sm-editor-keys",
            "name": "gallery-sm-editor-keys",
            "description": "Provides the `Editor.Keys` extension."
        },
        {
            "displayName": "gallery-sm-editor-link",
            "name": "gallery-sm-editor-link",
            "description": "Provides the `Editor.Link` extension."
        },
        {
            "displayName": "gallery-sm-editor-queue",
            "name": "gallery-sm-editor-queue",
            "description": "Provides the `Editor.Queue` extension."
        },
        {
            "displayName": "gallery-sm-editor-style",
            "name": "gallery-sm-editor-style",
            "description": "Provides the `Editor.Style` extension."
        },
        {
            "displayName": "gallery-sm-focusmanager",
            "name": "gallery-sm-focusmanager",
            "description": "Provides the FocusManager Node plugin, which makes it easy to manage keyboard\nfocus among the descendants of a node."
        },
        {
            "displayName": "gallery-sm-indexed-map",
            "name": "gallery-sm-indexed-map",
            "description": "Provides the `Y.IndexedMap` data structure."
        },
        {
            "displayName": "gallery-sm-map",
            "name": "gallery-sm-map",
            "description": "Provides the `Y.Map` data structure."
        },
        {
            "displayName": "gallery-sm-menu",
            "name": "gallery-sm-menu",
            "description": "Provides the `Y.Menu` widget."
        },
        {
            "displayName": "gallery-sm-menu-base",
            "name": "gallery-sm-menu-base",
            "description": "Provides `Menu.Base`."
        },
        {
            "displayName": "gallery-sm-menu-item",
            "name": "gallery-sm-menu-item",
            "description": "Provides the `Menu.Item` class."
        },
        {
            "displayName": "gallery-sm-menu-plugin",
            "name": "gallery-sm-menu-plugin",
            "description": "Provides the `Y.Plugin.Menu` Node plugin."
        },
        {
            "displayName": "gallery-sm-menu-templates",
            "name": "gallery-sm-menu-templates",
            "description": "Provides templates for `Menu`."
        },
        {
            "displayName": "gallery-sm-promise-events",
            "name": "gallery-sm-promise-events",
            "description": "Provides a `Y.Promise.EventNotifier` class. Instances can be used to decorate\n`Y.Promise` instances with an `on()` method to allow for non-resolution related\nevent notifications such as cancelation or progress. Additionally, the\npromise's `then` method is \"infected\" to propagate the mixin to its returned\npromises as well, allowing notifications to cascade throughout a promise chain."
        },
        {
            "displayName": "gallery-sm-range",
            "name": "gallery-sm-range",
            "description": "Provides the `Range` class, which normalizes Range behavior across browsers."
        },
        {
            "displayName": "gallery-sm-selection",
            "name": "gallery-sm-selection",
            "description": "Provides the `Selection` class, which normalizes text selection functionality\nacross browsers."
        },
        {
            "displayName": "gallery-sm-treeview",
            "name": "gallery-sm-treeview",
            "description": "Provides the `Y.TreeView` widget."
        },
        {
            "displayName": "gallery-sm-treeview-sortable",
            "name": "gallery-sm-treeview-sortable",
            "description": "Provides `Y.TreeView.Sortable`, a `Y.TreeView` extension that mixes in\n`Y.Tree.Sortable` and provides related TreeView-specific functionality."
        }
    ]
} };
});