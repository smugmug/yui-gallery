SmugMug Menu History
====================

## git

* The `show()` method will now render the menu if it hasn't already been
  rendered.

## 2013-03-27

* Fixed: Clicking a menu item didn't open its submenu.

* Fixed: Intelligent menu positioning broke in the last release. Oops.

## 2013-03-20

* Now using `Y.Tree` from YUI core, which means Menu requires YUI 3.9.0+.

* Y.Menu.Item's `isDisabled()` and `isHidden()` methods now return `true` if any
  ancestor of the item is disabled or hidden, respectively.

* Fixed: Menus take up space even when they're hidden. [#8]

## 2013-02-07

* Initial release.
