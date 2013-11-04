YUI.add('gallery-sm-range', function (Y, NAME) {

/*jshint expr:true, onevar:false */

// Fun fact! The YUI Gallery currently doesn't support conditional loading of
// modules based on feature detection like YUI core does, so that's why all the
// legacy compat code is baked in here instead of in a separate conditionally
// loaded module.

/**
Provides the `Range` class, which normalizes Range behavior across browsers.

@module gallery-sm-selection
@submodule gallery-sm-range
**/

/**
Provides a friendly cross-browser Range API similar to the API defined in the
DOM Range specification.

@class Range
@param {window.Range} [range] Native Range object to wrap. If not provided, a
    new Range will be created.
@constructor
**/

var doc = Y.config.doc,
    win = Y.config.win,

    isHTML5 = !!(win && win.Range && doc.createRange),

    ELEMENT_NODE = 1,
    TEXT_NODE = 3;

var Range = isHTML5 ? function (range) {
    this._range = range || doc.createRange();
} : function (range) {
    this._range = range || doc.body.createTextRange();
};

Range.prototype = {
    // -- Public Methods -------------------------------------------------------

    /**
    Returns a new Range object with the same boundary points as this range.

    The returned Range is a copy, not a reference, so modifying it will not
    affect this range (and vice versa).

    @method clone
    @return {Range} New Range object with the same boundary points as this
        range.
    **/
    clone: isHTML5 ? function () {
        return new Y.Range(this._range.cloneRange());
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Returns a Node instance containing a document fragment with a copy of this
    range's contents.

    Event listeners are not copied.

    Element ids _are_ copied. This could lead to duplicate ids, so be careful.

    Partially selected nodes will include parent tags to ensure that the
    fragment is valid.

    @method cloneContents
    @return {Node} Node instance containing a document fragment with a copy of
        this range's contents.
    **/
    cloneContents: isHTML5 ? function () {
        return Y.one(this._range.cloneContents());
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Collapses this range by setting the start and end points to the same
    position, thus resulting in an empty range.

    @method collapse
    @param {Object} [options] Options.
        @param {Boolean} [options.toStart=false] If `true`, this range will be
            collapsed by moving the end point to the start point. Otherwise, the
            start point will be moved to the end point.
    @chainable
    **/
    collapse: function (options) {
        this._range.collapse(options && options.toStart);
        return this;
    },

    /**
    Compares the start or end boundary of this range with the start or end
    boundary of another range.

    @method compare
    @param {Range} otherRange Range to compare to.
    @param {Object} [options] Options.

        @param {String} [options.myPoint='start'] Specifies which boundary point
            on this range should be used for the comparison. Valid values are
            'start' to use this range's start point for the comparison, or 'end'
            to use this range's end point.

        @param {String} [options.otherPoint='start'] Specifies which boundary
            point on _otherRange_ should be used for the comparison. Valid
            values are 'start' to use _otherRange_'s start point for the
            comparison, or 'end' to use _otherRange_'s end point.

    @return {Number} -1, 0, or 1, indicating whether this range's boundary is
        respectively before, equal to, or after the other range's boundary.
    **/
    compare: isHTML5 ? function (otherRange, options) {
        // Make sure we're working with a native range, not a YUI range.
        if (otherRange._range) {
            otherRange = otherRange._range;
        }

        var myPoint    = (options && options.myPoint) || 'start',
            otherPoint = (options && options.otherPoint) || 'start';

        var how = win.Range[otherPoint.toUpperCase() + '_TO_' +
                    myPoint.toUpperCase()];

        return this._range.compareBoundaryPoints(how, otherRange);
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Removes the contents of this range from the DOM.

    @method deleteContents
    @chainable
    **/
    deleteContents: isHTML5 ? function () {
        this._range.deleteContents();
        return this;
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Gets or sets the node that contains the end point of this range.

    When specifying an _offset_, you may specify either a number or the string
    "before" or "after".

    A numerical offset will position the end point at that offset inside the
    _node_. If _node_ is a text node, the offset will represent a character
    position. If _node_ can contain child nodes, then the offset will represent
    a child index.

    The offset "before" will cause the end point to be placed immediately before
    _node_ (not inside it).

    The offset "after" will cause the end point to be placed immediately after
    _node_ (not inside it).

    @method endNode
    @param {HTMLElement|Node|String} [node] Node to set the end point to. May be
        specified as a Node instance, HTMLElement, or selector string. If not
        specified, the current end point will be returned.
    @param {Number|String} [offset=0] Offset position of the new end point
        relative to the _node_. If this is a number, it will be used as an
        offset position inside _node_. To specify a position immediately before
        _node_, use the string "before". To specify a position immediately after
        _node_, use the string "after".
    @return {Node} Node that contains the end point of this range.
    **/
    endNode: isHTML5 ? function (node, offset) {
        if (node) {
            var el = Y.one(node)._node;

            offset || (offset = 0);

            if (typeof offset === 'number') {
                this._range.setEnd(el, offset);
            } else if (offset === 'before') {
                this._range.setEndBefore(el);
            } else if (offset === 'after') {
                this._range.setEndAfter(el);
            }
        }

        return Y.one(this._range.endContainer);
    } : function (node, offset) {
        throw new Error('Not yet implemented.');
    },

    /**
    Gets or sets the offset of this selection's end position inside the end
    node.

    If the end node is a text node, the offset represents a character position.
    If the end node can contain child nodes, then the offset represents a child
    index.

    When setting an offset, you may use a numerical offset (which behaves as
    described above) or the string "before" or "after".

    The offset "before" will cause the end point to be placed immediately before
    the current end node (not inside it).

    The offset "after" will cause the end point to be placed immediately after
    the current end node (not inside it).

    Note that setting a "before" or "after" offset will change the end node. To
    get the new end node, call `endNode()`.

    @method endOffset
    @param {Number|String} [offset] Offset position of the new end point
        relative to the current end node. If this is a number, it will be used
        as an offset position inside the node. To specify a position immediately
        before the node, use the string "before". To specify a position
        immediately after the node, use the string "after".
    @return {Number} Offset of this selection's end position inside the end
        node.
    **/
    endOffset: isHTML5 ? function (offset) {
        if (offset || offset === 0) {
            this.endNode(this._range.endContainer, offset);
        }

        return this._range.endOffset;
    } : function (offset) {
        throw new Error('Not yet implemented.');
    },

    /**
    Attempts to expand the range to include element nodes while
    still being equivalent to the current range. Start and End nodes
    are not guaranteed to be element nodes after this method is executed.

    Examples:

        [] = startContainer, {} = endContainer, s:e = start/end offset

    given the HTML

        <div><span>Lorem</span></div>

    an initial range of

        <div><span>[{Lorem]}</span></div>  #text s0 : #text e5

    after expansion with stopAt = `span`

        <div><span>[{Lorem]}</span></div>  SPAN s0 : SPAN e1

    after expansion with stopAt = `div`

        <div>[{<span>Lorem</span>}]</div>  DIV s0 : DIV e1

    @method expand
    @param {Object} [options]
        @param {String|Function|HTMLElement|Node} [options.stopAt] If provided,
        does not expand the range past this node.
        Strings will be used as selectors to match ancestor nodes of the start
        and end nodes of the range (inclusive).
        Functions will test ancestors of the start and end nodes of the range
        (inclusive) and will receive the node being tested as the only argument.
    @chainable
    **/
    expand: function (options) {
        return this.expandStart(options).expandEnd(options);
    },

    /**
    Attempts to expand the range end to include element nodes while
    still being equivalent to the current range. End node is not
    guaranteed to be an element node after this method is executed.

    @method expandEnd
    @param {Object} [options]
        @param {String|Function|HTMLElement|Node} [options.stopAt] If provided,
        does not expand the range past this node.
        Strings will be used as selectors to match ancestor nodes of the end
        node of the range (inclusive).
        Functions will test ancestors of the end node of the range (inclusive)
        and will receive the node being tested as the only argument.
    @chainable
    **/
    expandEnd: function (options) {
        var endNode = this.endNode(),
            endOffset = this.endOffset(),
            stopNode, parentNode;

        options || (options = {});
        options.stopAt && (stopNode = options.stopAt);

        function maxOffset (node) {
            var maxOffset;

            node = node._node;

            if (TEXT_NODE === node.nodeType) {
                maxOffset = node.length;
            } else {
                maxOffset = node.childNodes.length;
            }

            return maxOffset;
        }

        if ('string' === typeof stopNode || 'function' === typeof stopNode) {
            stopNode = endNode.ancestor(stopNode, true);
        } else {
            stopNode = Y.one(stopNode);
        }

        while (endNode !== stopNode && maxOffset(endNode) === endOffset) {
            parentNode = endNode.get('parentNode');

            endOffset = parentNode.get('childNodes').indexOf(endNode) + 1;
            endNode = parentNode;
        }

        this.endNode(endNode, endOffset);

        return this;
    },

    /**
    Attempts to expand the range start to include element nodes while
    still being equivalent to the current range. Start node is not
    guaranteed to be an element node after this method is executed.

    @method expandStart
        @param {String|Function|HTMLElement|Node} [options.stopAt] If provided,
        does not expand the range past this node.
        Strings will be used as selectors to match ancestor nodes of the start
        node of the range (inclusive).
        Functions will test ancestors of the start node of the range (inclusive)
        and will receive the node being tested as the only argument.
    @chainable
    **/
    expandStart: function (options) {
        var startNode = this.startNode(),
            startOffset = this.startOffset(),
            stopNode, parentNode;

        options || (options = {});
        options.stopAt && (stopNode = options.stopAt);

        if ('string' === typeof stopNode || 'function' === typeof stopNode) {
            stopNode = startNode.ancestor(stopNode, true);
        } else {
            stopNode = Y.one(stopNode);
        }

        while (startNode !== stopNode && 0 === startOffset) {
            parentNode = startNode.get('parentNode');

            startOffset = parentNode.get('childNodes').indexOf(startNode);
            startNode = parentNode;
        }

        this.startNode(startNode, startOffset);

        return this;
    },

    /**
    Moves this range's contents into a document fragment and returns a Node
    instance containing that fragment.

    Event listeners are not retained.

    If this range splits a non-text element, the resulting fragment will include
    a clone of that element, including its id (if it has one). This could lead
    to duplicate ids, so be careful.

    @method extractContents
    @return {Node} Node instance containing a document fragment with this
        range's contents.
    **/
    extractContents: isHTML5 ? function () {
        return Y.one(this._range.extractContents());
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Inserts a node at the start of this range.

    @method insertNode
    @param {HTMLElement|Node|String} node Node instance, HTMLElement, or
        selector string of a node to insert.
    @return {Node} Inserted node.
    **/
    insertNode: isHTML5 ? function (node) {
        node = Y.one(node);
        this._range.insertNode(node._node);
        return node;
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Returns `true` if this range is collapsed, `false` otherwise.

    A `true` value means that the start and end points are the same and the
    range is empty, whereas a `false` value means that the start and end points
    are different and the range is not empty.

    @method isCollapsed
    @return {Boolean} `true` if this range is collapsed, `false` otherwise.
    **/
    isCollapsed: isHTML5 ? function () {
        return this._range.collapsed;
    } : function () {
        throw new Error('Not yet implemented.');
    },

    /**
    Returns `true` if this range has the same boundaries as _otherRange_,
    `false` otherwise.

    @method isEquivalent
    @param {Range} otherRange Range to compare this range to.
    @return {Boolean} `true` if this range has the same boundaries as
        _otherRange_, `false` otherwise.
    **/
    isEquivalent: function (otherRange) {
        return otherRange && this.compare(otherRange) === 0 &&
                this.compare(otherRange, {myPoint: 'end', otherPoint: 'end'}) === 0;
    },

    /**
    Returns `true` if this range is entirely contained within the given _node_.

    @method isInsideNode
    @param {HTMLElement|Node|String} node Node instance, HTML element, or
        selector string of the container.
    @return {Boolean} `true` if this range is entirely contained within the
        given _node_, `false` otherwise.
    **/
    isInsideNode: function (node) {
        var el       = Y.one(node)._node,
            parentEl = this.parentNode()._node;

        if (el === parentEl) {
            return true;
        }

        while (parentEl = parentEl.parentNode) {
            if (el === parentEl) {
                return true;
            }
        }

        return false;
    },

    /**
    Returns the nearest common ancestor node that fully contains all nodes
    within this range.

    @method parentNode
    @return {Node} Nearest common ancestor node that fully contains all nodes
        within this range.
    **/
    parentNode: isHTML5 ? function () {
        return Y.one(this._range.commonAncestorContainer);
    } : function () {
        return Y.one(this._range.parentElement());
    },

    /**
    Sets the Range to contain the Node and its contents.

    The parent Node of the start and end of the Range will be the same as the
    parent of the given node.

    @method selectNode
    @param {HTMLElement|Node} node Node or HTMLElement to select
    @chainable
    **/
    selectNode: isHTML5 ? function (node) {
        this._range.selectNode(Y.one(node)._node);
        return this;
    } : function (node) {
        throw new Error('Not yet implemented.');
    },

    /**
    Sets the Range to contain the contents of a Node.

    The parent Node of the start and end of the Range will be the given node.
    The startOffset is 0, and the endOffset is the number of child Nodes or
    number of characters contained in the reference node.

    @method selectNodeContents
    @param {HTMLElement|Node} node Node or HTMLElement to select
    @chainable
    **/
    selectNodeContents: isHTML5 ? function (node) {
        this._range.selectNodeContents(Y.one(node)._node);
        return this;
    } : function (node) {
        throw new Error('Not yet implemented.');
    },

    /**
    Shrinks the start and end containers of the range to just the text nodes
    containing the selected text.

    Useful for normalizing a range after double clicking to select since the
    range start/end containers vary by browser as explained below:

    Chrome and IE use the first text node that contains the selected text
    as the startContainer with an offset to exclude any leading whitespace.

    Firefox will use a text node *before* the selected text
    as the startContainer, with a positive offset set to the end
    of the node. If there is no previous sibling of the selected text
    or the previous sibling is not a text node, the behavior is the
    same as Chrome/IE.

    Chrome uses the last text node that contains the selected text as the
    endContainer, with an offset to exclude trailing whitespace.

    Firefox follows the mostly the same rules for the endContainer
    as it does for the startContainer. Any sibling text node
    *after* the selected text will be used as the endContainer,
    but with a 0 offset. If there is no next sibling or the next sibling
    is not a text node, the endContainer will be the same as the
    startContainer, with an offset to exclude any trailing whitespace.

    IE will aways use a following text node as the endContainer,
    even if it is a child of a sibling. The offset will *include all*
    leading whitespace. If there is no following text node,
    the endContainer will be the same as the startContainer, with an
    offset to *include all* trailing whitespace.

    Examples:
        [] = startContainer, {} = endContainer, s:e = start/end offset

    given the HTML
        Lorem <b>Ipsum</b> Dolor Sit

    dbl clicking to select the text `Lorem`
        Chrome:  `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5
        Firefox: `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5
        IE:      `[Lorem ]<b>{Ipsum}</b> Dolor Sit`  s0:e0

    dbl clicking to select the text `Ipsum`
        Chrome:  `Lorem <b>[{Ipsum}]</b> Dolor Sit`  s0:e5
        Firefox: `[Lorem ]<b>Ipsum</b>{ Dolor Sit}`  s6:e0
        IE:      `Lorem <b>[Ipsum]</b>{ Dolor Sit}`  s0:e1

    dbl clicking to select the text `Dolor`
        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6
        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6
        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e7

    dbl clicking to select the text `Sit`
        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10
        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10
        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10

    @method shrink
    @param {Object} [options]
      @param {Boolean} [options.trim=false] If `true` whitespace will be
        ignored when shrinking the start and end containers. Offsets will
        be set to exclude any leading whitespace from the startContainer and
        trailing whitespace from the endContainer.
    @chainable
    **/
    shrink: function (options) {
        return this.shrinkStart(options).shrinkEnd(options);
    },

    /**
    Shrinks the endContainer of the range to just the text node containing
    the selected text.

    Browsers are inconsistent in how they define a range, sometimes using
    offsets of sibling or parent nodes instead of the actual text node
    containing the selected text.

    @method shrinkEnd
    @param {Object} [options]
      @param {Boolean} [options.trim=false] If `true` whitespace will be
        ignored when shrinking the endContainer and an offset will be set to
        exclude any trailing whitespace from the shrunken endContainer.
    @chainable
    **/
    shrinkEnd: function (options) {
        var trim = options && options.trim;

        if (!this.isCollapsed()) {
            var initialEndNode = this.endNode(),
                endNode = initialEndNode,
                endOffset = this.endOffset(),
                endType = endNode.get('nodeType'),
                endText, endTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            if (TEXT_NODE === endType) {
                endText = endNode.get('text');
                endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));

                if (!endOffset || endTrim) {
                    // If there is no endOffset, the previousSibling contains
                    // the the selected text
                    var sibling;

                    // The endNode might be a child of a sibling node, so
                    // walk up the DOM to find the right node
                    while (!(sibling = endNode.get('previousSibling'))) {
                        endNode = endNode.get('parentNode');
                    }

                    endNode = sibling;
                } else if (!trim) {
                    // have the correct textNode and not trimming it
                    return this;
                }
            } else {
                // the endOffset references a point *after* a childNode
                // so grab the node preceding the offset
                var childNodes = endNode.get('childNodes'),
                    node = childNodes.item(endOffset - 1);

                if (node) {
                    endNode = node;
                }
            }

            // at this point endNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // last textNode child
            if (ELEMENT_NODE === endNode.get('nodeType')) {
                this.endNode(endNode, endNode.get('childNodes').size());

                this.traverse(function (node) {
                    if (TEXT_NODE === node.get('nodeType')) {
                        endNode = node;
                    }
                });
            }

            if (initialEndNode !== endNode) {
                // a different node than we started with. reset the offset
                endOffset = endNode.get('text').length;
            }

            endText = endNode.get('text').substring(0, endOffset);
            endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;

            this.endNode(endNode, endOffset);
        }

        return this;
    },

    /**
    Shrinks the startContainer of the range to just the text node containing
    the selected text.

    Browsers are inconsistent in how they define a range, sometimes using
    offsets of sibling or parent nodes instead of the actual text node
    containing the selected text.

    @method shrinkStart
    @param {Object} [options]
      @param {Boolean} [options.trim=false] If `true` whitespace will be
        ignored when shrinking the startContainer and an offset will be set to
        exclude any leading whitespace from the shrunken startContainer.
    @chainable
    **/
    shrinkStart: function (options) {
        var trim = options && options.trim;

        if (!this.isCollapsed()) {
            var initialStartNode = this.startNode(),
                startNode = initialStartNode,
                startOffset = this.startOffset(),
                startType = startNode.get('nodeType'),
                startText, startTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            if (TEXT_NODE === startType) {
                startText = startNode.get('text');
                startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));

                if (startText.length === startOffset || startTrim) {
                    // startOffset is at the end of the startContainer.
                    // nextSibling contains the selected text
                    var sibling;

                    // The startNode might be a child of a sibling node, so
                    // walk up the DOM to find the right node
                    while (!(sibling = startNode.get('nextSibling'))) {
                        startNode = startNode.get('parentNode');
                    }

                    startNode = sibling;
                } else if (!trim) {
                    // have the correct textNode and not trimming it
                    return this;
                }
            } else {
                // the startOffset references a point *before* a childNode
                // so grab the node following the offset (which is
                // indexed by the offset, unlike the endOffset)
                var childNodes = startNode.get('childNodes'),
                    node = childNodes.item(startOffset);

                if (node) {
                    startNode = node;
                }
            }

            // at this point startNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // first textNode child, stopping traversal when found
            if (ELEMENT_NODE === startNode.get('nodeType')) {
                this.startNode(startNode);

                this.traverse(function (node) {
                    if (TEXT_NODE === node.get('nodeType')) {
                        startNode = node;
                        return true; // stops traversal
                    }
                });
            }

            if (initialStartNode !== startNode) {
                // a different node than we started with. reset the offset
                startOffset = 0;
            }

            startText = startNode.get('text').substring(startOffset);
            startOffset += trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;

            this.startNode(startNode, startOffset);
        }

        return this;
    },

    /**
    Gets or sets the node that contains the start point of this range.

    When specifying an _offset_, you may specify either a number or the string
    "before" or "after".

    A numerical offset will position the start point at that offset inside the
    _node_. If _node_ is a text node, the offset will represent a character
    position. If _node_ can contain child nodes, then the offset will represent
    a child index.

    The offset "before" will cause the start point to be placed immediately
    before _node_ (not inside it).

    The offset "after" will cause the start point to be placed immediately after
    _node_ (not inside it).

    @method startNode
    @param {HTMLElement|Node|String} [node] Node to set the start point to. May
        be specified as a Node instance, HTMLElement, or selector string. If not
        specified, the current start point will be returned.
    @param {Number|String} [offset=0] Offset position of the new start point
        relative to the _node_. If this is a number, it will be used as an
        offset position inside _node_. To specify a position immediately before
        _node_, use the string "before". To specify a position immediately after
        _node_, use the string "after".
    @return {Node} Node that contains the start point of this range.
    **/
    startNode: isHTML5 ? function (node, offset) {
        if (node) {
            var el = Y.one(node)._node;

            offset || (offset = 0);

            if (typeof offset === 'number') {
                this._range.setStart(el, offset);
            } else if (offset === 'before') {
                this._range.setStartBefore(el);
            } else if (offset === 'after') {
                this._range.setStartAfter(el);
            }
        }

        return Y.one(this._range.startContainer);
    } : function (node, offset) {
        throw new Error('Not yet implemented.');
    },

    /**
    Gets or sets the offset of this range's start position inside the start
    node.

    If the start node is a text node, the offset represents a character
    position. If the start node can contain child nodes, then the offset
    represents a child index.

    When setting an offset, you may use a numerical offset (which behaves as
    described above) or the string "before" or "after".

    The offset "before" will cause the start point to be placed immediately
    before the current start node (not inside it).

    The offset "after" will cause the start point to be placed immediately after
    the current start node (not inside it).

    Note that setting a "before" or "after" offset will change the start node.
    To get the new start node, call `startNode()`.

    @method startOffset
    @param {Number|String} [offset] Offset position of the new start point
        relative to the current start node. If this is a number, it will be used
        as an offset position inside the node. To specify a position immediately
        before the node, use the string "before". To specify a position
        immediately after the node, use the string "after".
    @return {Number} Offset of this range's start position inside the start
        node.
    **/
    startOffset: isHTML5 ? function (offset) {
        if (offset || offset === 0) {
            this.startNode(this._range.startContainer, offset);
        }

        return this._range.startOffset;
    } : function (offset) {
        throw new Error('Not yet implemented.');
    },

    /**
    Returns the HTML content of this range.

    @method toHTML
    @return {HTML} HTML content of this range.
    **/
    toHTML: isHTML5 ? function () {
        var div = doc.createElement('div');
        div.appendChild(this._range.cloneContents());

        return div.innerHTML;
    } : function () {
        return this._range.htmlText;
    },

    /**
    Returns the plain text content of this range.

    @method toString
    @return {String} Plain text content of this range.
    **/
    toString: isHTML5 ? function () {
        return this._range.toString();
    } : function () {
        return this._range.text;
    },

    /**
    Traverses the contents of the range, passing each node and its children to
    the supplied callback in document order.

    For example, if the range includes the following HTML...

        lorem ipsum <b>dolor <i>sit</i></b> amet

    ...then this `traverse()` call...

        range.traverse(function (node) {
            console.log(Y.Node.getDOMNode(node));
        });

    ...would result in the following console output:

        "lorem ipsum "
        <b> element
        "dolor "
        <i> element
        "sit"
        " amet"

    The entire start and end node will be included even if the range only
    includes a portion of them. Use the `startOffset()` and `endOffset()`
    methods to determine where the precise boundaries are if necessary.

    Returning `true` from the callback function will stop traversal

    @method traverse
    @param {Function} callback Callback function.
        @param {Node} callback.node Node instance.
    @param {Object} [thisObj] `this` object to use when calling the callback
        function.
    @chainable
    **/
    traverse: function (callback, thisObj) {
        if (this.isCollapsed()) {
            return this;
        }

        var container = this.parentNode()._node,
            end       = this.endNode()._node,
            endOffset = this.endOffset();

        // If there's a positive offset and the end node has children, we need
        // to take the offset into account when traversing. Otherwise we can
        // ignore it.
        if (endOffset && end.childNodes.length) {
            end = end.childNodes[endOffset - 1];

            while (end.lastChild) {
                end = end.lastChild;
            }
        }

        function traverseDOMNode(domNode) {
            var stop = callback.call(thisObj, Y.one(domNode));

            if (stop || domNode === end) {
                return;
            }

            if (domNode.firstChild) {
                traverseDOMNode(domNode.firstChild);
            } else if (domNode.nextSibling) {
                traverseDOMNode(domNode.nextSibling);
            } else {
                var node = domNode;

                while (node = node.parentNode) {
                    if (node !== container && node.nextSibling) {
                        traverseDOMNode(node.nextSibling);
                        break;
                    }
                }
            }
        }

        traverseDOMNode(this.startNode()._node);

        return this;
    },

    /**
    Wraps this range in the specified HTML and returns the new wrapper node.

    @method wrap
    @param {HTML} html HTML string.
    @param {Object} [options] Options.
        @param {Boolean} [options.includeWrapper=false] If `true`, this range
            will be updated to include the new wrapper node.
    @return {Node} New wrapper node.
    **/
    wrap: isHTML5 ? function (html, options) {
        // We have to manually extract the range's contents and append them to
        // the wrapper instead of just using Range#surroundContents(), because
        // surroundContents() will throw an exception if one of the Range's
        // boundary points splits a non-text node.
        //
        // It's puzzling that this is part of the Range spec, because the error
        // doesn't do anyone any good, and extractContents() (which is used
        // internally by surroundContents()) already requires the browser to
        // implement node splitting anyway. But whatevs.
        var contents  = this._range.extractContents(),
            container = Y.DOM.create(html); // TODO: handle fragments?

        container.appendChild(contents);
        this._range.insertNode(container);

        if (options && options.includeWrapper) {
            this._range.selectNode(container);
        } else {
            this._range.selectNodeContents(container);
        }

        return Y.one(container);
    } : function (html) {
        throw new Error('Not yet implemented.');
    }
};

Y.Range = Range;


}, '@VERSION@', {"requires": ["node-base"]});
