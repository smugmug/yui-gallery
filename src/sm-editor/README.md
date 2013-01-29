SmugMug Editor
==============

A simple but powerful WYSIWYG editor.


Features
--------

* Based on `contentEditable` so there are no awkward, hard-to-style iframes.

* Works great in all modern browsers, including mobile browsers. (Chrome, Firefox, Safari, IE >=9, iOS 5+, Android 3+).

* Supports standard keyboard shortcuts for formatting, undo/redo, etc.

* Totally modular (dude). Use `editor-base` if you only want the core editor functionality, `editor-keys` to add keyboard shortcuts, `editor-undo` to add undo/redo support, or `editor` if you want all of the above.

* Provides a [super friendly API][api-docs] for programmatically manipulating selection, formatting, creating custom keyboard shortcuts, and more.


Useful Links
------------

* [API Docs][api-docs]

[api-docs]:http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-editor.html

Usage
-----

In your HTML, create a container element for the editor. Be sure to add the `yui3-skin-sam` class if you want to use the editor's default skin.

```html
<div id="editor" class="yui3-skin-sam"></div>
```

Load YUI onto the page if you haven't already.

```html
<script src="http://yui.yahooapis.com/3.8.1/build/yui/yui-min.js"></script>
```

In your JS, create an instance of `Y.Editor` and render it into the container element.

```js
YUI().use('gallery-sm-editor', function (Y) {
    // Create a new editor instance.
    var editor = new Y.Editor({
        container: '#editor'
    });

    // Render the editor into the #editor element.
    editor.render();
});
```

That's it!

This user guide is still being fleshed out, but check out the [API docs][api-docs] for more details.


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
