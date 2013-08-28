SmugMug Promise Events Mixin
============================

Adds an `on()` method to a promise to allow for non-resolution related event
notifications such as cancelation or progress. Additionally, the promise's
`then` method is "infected" to propagate the mixin to its returned promises as
well, allowing notifications to cascade throughout a promise chain.

Useful Links
------------

* [API Docs][api-docs]

[api-docs]:http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-promise-events.html

Usage
-----

Create a `Y.Promise.Events` instance. Create a Promise and pass it to the
instance's `addEvents` method. The Promise is now decorated with an
`on(type, callback)` method and its `then` method will return promises
similarly decorated and linked to your `Y.Promise.Events` instance.

```js
YUI({
    gallery: 'gallery-2013.03.27-22-06'
}).use('node', 'gallery-sm-promise-events', function (Y) {
    var notifier = new Y.Promise.Events(),
        promise, chainedPromise, interval, cancel;

    // Wire up a button to cancel the promise transaction
    cancel = Y.once('#cancel').on('click', function () {
        clearInterval(interval);

        this.set('disabled', true);

        notifier.fire('cancel');
    });

    // Create a promise that will resolve in 10 seconds unless canceled by the
    // button click. The promise transaction also notifies of its progress
    // every second.
    promise = new Y.Promise(function (resolve, reject) {
        var complete = 0;

        // notify subscribers of progress every second until it is done
        interval = setInterval(function () {
            complete += 10;

            notifier.fire('progress', { percent: complete });

            if (complete >= 100) {
                cancel.detach();

                resolve();
            }
        }, 1000);
    });

    // decorate the promise with an on() method and register with notifier
    notifier.addEvents(promise);

    promise.on('progress', function (e) {
        // e.type === 'progress'
        Y.one('#progress-indicator').setStyle('width', e.percent + '%');
    });

    // chained promises are automatically registered and decorated with on()
    chainedPromise = promise.then(function () {
        Y.one('#message').setHTML('All done!').show();
    });

    chainedPromise.on('cancel', function (e) {
        Y.one('#message').setHTML('Canceled!').show();
        Y.one('#progress-indicator').hide();
    });
}
```

Documentation
--------------

* [API Docs](http://smugmug.github.com/yui-gallery/api/modules/gallery-sm-promise-events.html)

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
