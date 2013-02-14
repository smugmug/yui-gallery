SmugMug Focus Manager
=====================

A `Y.Node` plugin that makes it easy to manage keyboard focus among the
descendants of a node.

Useful Links
------------

* [Example][example]
* [API Docs][api-docs]

[api-docs]:http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-focusmanager.html
[example]:http://jsbin.com/odizof/2


Usage
-----

## Simple flat list

```html
<ul id="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<script>
YUI().use('gallery-sm-focusmanager', function (Y) {
    // Make the list items in #list keyboard-focusable using the arrow keys.
    Y.one('#list').plug(Y.Plugin.FocusManager);
});
</script>
```

## Hierarchical list

```html
<ul id="list">
    <li>
        Item 1
        <ul>
            <li>Item 1.1</li>
            <li>
                Item 1.2
                <ul>
                    <li>Item 1.2.1</li>
                    <li>Item 1.2.2</li>
                </ul>
            </li>
        </ul>
    </li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<script>
YUI().use('gallery-sm-focusmanager', function (Y) {
    // Make the list items in #list keyboard-focusable and allow
    // descending/ascending into and out of nested lists using the right and
    // left arrow keys.
    Y.one('#list').plug(Y.Plugin.FocusManager, {
        containerSelector: 'ul'
    });
});
</script>
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
