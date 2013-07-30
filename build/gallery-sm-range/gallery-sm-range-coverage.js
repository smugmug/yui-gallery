if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-range/gallery-sm-range.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].code=["YUI.add('gallery-sm-range', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","// Fun fact! The YUI Gallery currently doesn't support conditional loading of","// modules based on feature detection like YUI core does, so that's why all the","// legacy compat code is baked in here instead of in a separate conditionally","// loaded module.","","/**","Provides the `Range` class, which normalizes Range behavior across browsers.","","@module gallery-sm-selection","@submodule gallery-sm-range","**/","","/**","Provides a friendly cross-browser Range API similar to the API defined in the","DOM Range specification.","","@class Range","@param {window.Range} [range] Native Range object to wrap. If not provided, a","    new Range will be created.","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.Range && doc.createRange),","","    ELEMENT_NODE = 1,","    TEXT_NODE = 3;","","var Range = isHTML5 ? function (range) {","    this._range = range || doc.createRange();","} : function (range) {","    this._range = range || doc.body.createTextRange();","};","","Range.prototype = {","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns a new Range object with the same boundary points as this range.","","    The returned Range is a copy, not a reference, so modifying it will not","    affect this range (and vice versa).","","    @method clone","    @return {Range} New Range object with the same boundary points as this","        range.","    **/","    clone: isHTML5 ? function () {","        return new Y.Range(this._range.cloneRange());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns a Node instance containing a document fragment with a copy of this","    range's contents.","","    Event listeners are not copied.","","    Element ids _are_ copied. This could lead to duplicate ids, so be careful.","","    Partially selected nodes will include parent tags to ensure that the","    fragment is valid.","","    @method cloneContents","    @return {Node} Node instance containing a document fragment with a copy of","        this range's contents.","    **/","    cloneContents: isHTML5 ? function () {","        return Y.one(this._range.cloneContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Collapses this range by setting the start and end points to the same","    position, thus resulting in an empty range.","","    @method collapse","    @param {Object} [options] Options.","        @param {Boolean} [options.toStart=false] If `true`, this range will be","            collapsed by moving the end point to the start point. Otherwise, the","            start point will be moved to the end point.","    @chainable","    **/","    collapse: function (options) {","        this._range.collapse(options && options.toStart);","        return this;","    },","","    /**","    Compares the start or end boundary of this range with the start or end","    boundary of another range.","","    @method compare","    @param {Range} otherRange Range to compare to.","    @param {Object} [options] Options.","","        @param {String} [options.myPoint='start'] Specifies which boundary point","            on this range should be used for the comparison. Valid values are","            'start' to use this range's start point for the comparison, or 'end'","            to use this range's end point.","","        @param {String} [options.otherPoint='start'] Specifies which boundary","            point on _otherRange_ should be used for the comparison. Valid","            values are 'start' to use _otherRange_'s start point for the","            comparison, or 'end' to use _otherRange_'s end point.","","    @return {Number} -1, 0, or 1, indicating whether this range's boundary is","        respectively before, equal to, or after the other range's boundary.","    **/","    compare: isHTML5 ? function (otherRange, options) {","        // Make sure we're working with a native range, not a YUI range.","        if (otherRange._range) {","            otherRange = otherRange._range;","        }","","        var myPoint    = (options && options.myPoint) || 'start',","            otherPoint = (options && options.otherPoint) || 'start';","","        var how = win.Range[otherPoint.toUpperCase() + '_TO_' +","                    myPoint.toUpperCase()];","","        return this._range.compareBoundaryPoints(how, otherRange);","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Removes the contents of this range from the DOM.","","    @method deleteContents","    @chainable","    **/","    deleteContents: isHTML5 ? function () {","        this._range.deleteContents();","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the node that contains the end point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the end point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the end point to be placed immediately before","    _node_ (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    _node_ (not inside it).","","    @method endNode","    @param {HTMLElement|Node|String} [node] Node to set the end point to. May be","        specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current end point will be returned.","    @param {Number|String} [offset=0] Offset position of the new end point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the end point of this range.","    **/","    endNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setEnd(el, offset);","            } else if (offset === 'before') {","                this._range.setEndBefore(el);","            } else if (offset === 'after') {","                this._range.setEndAfter(el);","            }","        }","","        return Y.one(this._range.endContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this selection's end position inside the end","    node.","","    If the end node is a text node, the offset represents a character position.","    If the end node can contain child nodes, then the offset represents a child","    index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the end point to be placed immediately before","    the current end node (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    the current end node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the end node. To","    get the new end node, call `endNode()`.","","    @method endOffset","    @param {Number|String} [offset] Offset position of the new end point","        relative to the current end node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this selection's end position inside the end","        node.","    **/","    endOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.endNode(this._range.endContainer, offset);","        }","","        return this._range.endOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Attempts to expand the range to include element nodes while","    still being equivalent to the current range. Start and End nodes","    are not guaranteed to be element nodes after this method is executed.","","    Examples:","","        [] = startContainer, {} = endContainer, s:e = start/end offset","","    given the HTML","","        <div><span>Lorem</span></div>","","    an initial range of","","        <div><span>[{Lorem]}</span></div>  s0:e5","","    after expansion would be","","        [{<div><span>Lorem</span></div>}]  s0:e1","","    @method expand","    @param {HTMLElement|Node} [container] If provided, do not expand the range","        past this container","    @chainable","    **/","    expand: function(container) {","        return this.expandStart(container).expandEnd(container);","    },","","    /**","    Attempts to expand the range end to include element nodes while","    still being equivalent to the current range. End node is not","    guaranteed to be an element node after this method is executed.","","    @method expandEnd","    @param {HTMLElement|Node} [container] If provided, do not expand the range","        past this container","    @chainable","    **/","    expandEnd: function(container) {","        var endNode = this.endNode()._node,","            offset = this.endOffset(),","            nodeType = endNode.nodeType,","            parentNode = endNode.parentNode;","","        container = Y.one(container);","","        if (TEXT_NODE === nodeType && endNode.length === offset && !endNode.nextSibling","                && (!container || container._node !== parentNode)) {","            this.endNode(parentNode, 'after');","        }","","        return this;","    },","","    /**","    Attempts to expand the range start to include element nodes while","    still being equivalent to the current range. Start node is not","    guaranteed to be an element node after this method is executed.","","    @method expandStart","    @param {HTMLElement|Node} [container] If provided, do not expand the range","        past this container","    @chainable","    **/","    expandStart: function(container) {","        var startNode = this.startNode()._node,","            offset = this.startOffset(),","            nodeType = startNode.nodeType,","            parentNode = startNode.parentNode;","","        container = Y.one(container);","","        if (TEXT_NODE === nodeType && 0 === offset && !startNode.previousSibling","                && (!container || container._node !== parentNode)) {","            this.startNode(parentNode, 'before');","        }","","        return this;","    },","","    /**","    Moves this range's contents into a document fragment and returns a Node","    instance containing that fragment.","","    Event listeners are not retained.","","    If this range splits a non-text element, the resulting fragment will include","    a clone of that element, including its id (if it has one). This could lead","    to duplicate ids, so be careful.","","    @method extractContents","    @return {Node} Node instance containing a document fragment with this","        range's contents.","    **/","    extractContents: isHTML5 ? function () {","        return Y.one(this._range.extractContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Inserts a node at the start of this range.","","    @method insertNode","    @param {HTMLElement|Node|String} node Node instance, HTMLElement, or","        selector string of a node to insert.","    @return {Node} Inserted node.","    **/","    insertNode: isHTML5 ? function (node) {","        node = Y.one(node);","        this._range.insertNode(node._node);","        return node;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range is collapsed, `false` otherwise.","","    A `true` value means that the start and end points are the same and the","    range is empty, whereas a `false` value means that the start and end points","    are different and the range is not empty.","","    @method isCollapsed","    @return {Boolean} `true` if this range is collapsed, `false` otherwise.","    **/","    isCollapsed: isHTML5 ? function () {","        return this._range.collapsed;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range has the same boundaries as _otherRange_,","    `false` otherwise.","","    @method isEquivalent","    @param {Range} otherRange Range to compare this range to.","    @return {Boolean} `true` if this range has the same boundaries as","        _otherRange_, `false` otherwise.","    **/","    isEquivalent: function (otherRange) {","        return otherRange && this.compare(otherRange) === 0 &&","                this.compare(otherRange, {myPoint: 'end', otherPoint: 'end'}) === 0;","    },","","    /**","    Returns `true` if this range is entirely contained within the given _node_.","","    @method isInsideNode","    @param {HTMLElement|Node|String} node Node instance, HTML element, or","        selector string of the container.","    @return {Boolean} `true` if this range is entirely contained within the","        given _node_, `false` otherwise.","    **/","    isInsideNode: function (node) {","        var el       = Y.one(node)._node,","            parentEl = this.parentNode()._node;","","        if (el === parentEl) {","            return true;","        }","","        while (parentEl = parentEl.parentNode) {","            if (el === parentEl) {","                return true;","            }","        }","","        return false;","    },","","    /**","    Returns the nearest common ancestor node that fully contains all nodes","    within this range.","","    @method parentNode","    @return {Node} Nearest common ancestor node that fully contains all nodes","        within this range.","    **/","    parentNode: isHTML5 ? function () {","        return Y.one(this._range.commonAncestorContainer);","    } : function () {","        return Y.one(this._range.parentElement());","    },","","    /**","    Sets the Range to contain the Node and its contents.","","    The parent Node of the start and end of the Range will be the same as the","    parent of the given node.","","    @method selectNode","    @param {HTMLElement|Node} node Node or HTMLElement to select","    @chainable","    **/","    selectNode: isHTML5 ? function (node) {","        this._range.selectNode(Y.one(node)._node);","        return this;","    } : function (node) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Sets the Range to contain the contents of a Node.","","    The parent Node of the start and end of the Range will be the given node.","    The startOffset is 0, and the endOffset is the number of child Nodes or","    number of characters contained in the reference node.","","    @method selectNodeContents","    @param {HTMLElement|Node} node Node or HTMLElement to select","    @chainable","    **/","    selectNodeContents: isHTML5 ? function (node) {","        this._range.selectNodeContents(Y.one(node)._node);","        return this;","    } : function (node) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Shrinks the start and end containers of the range to just the text nodes","    containing the selected text.","","    Useful for normalizing a range after double clicking to select since the","    range start/end containers vary by browser as explained below:","","    Chrome and IE use the first text node that contains the selected text","    as the startContainer with an offset to exclude any leading whitespace.","","    Firefox will use a text node *before* the selected text","    as the startContainer, with a positive offset set to the end","    of the node. If there is no previous sibling of the selected text","    or the previous sibling is not a text node, the behavior is the","    same as Chrome/IE.","","    Chrome uses the last text node that contains the selected text as the","    endContainer, with an offset to exclude trailing whitespace.","","    Firefox follows the mostly the same rules for the endContainer","    as it does for the startContainer. Any sibling text node","    *after* the selected text will be used as the endContainer,","    but with a 0 offset. If there is no next sibling or the next sibling","    is not a text node, the endContainer will be the same as the","    startContainer, with an offset to exclude any trailing whitespace.","","    IE will aways use a following text node as the endContainer,","    even if it is a child of a sibling. The offset will *include all*","    leading whitespace. If there is no following text node,","    the endContainer will be the same as the startContainer, with an","    offset to *include all* trailing whitespace.","","    Examples:","        [] = startContainer, {} = endContainer, s:e = start/end offset","","    given the HTML","        Lorem <b>Ipsum</b> Dolor Sit","","    dbl clicking to select the text `Lorem`","        Chrome:  `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5","        Firefox: `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5","        IE:      `[Lorem ]<b>{Ipsum}</b> Dolor Sit`  s0:e0","","    dbl clicking to select the text `Ipsum`","        Chrome:  `Lorem <b>[{Ipsum}]</b> Dolor Sit`  s0:e5","        Firefox: `[Lorem ]<b>Ipsum</b>{ Dolor Sit}`  s6:e0","        IE:      `Lorem <b>[Ipsum]</b>{ Dolor Sit}`  s0:e1","","    dbl clicking to select the text `Dolor`","        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6","        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6","        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e7","","    dbl clicking to select the text `Sit`","        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","","    @method shrink","    @param {Object} [options]","      @param {Boolean} [options.trim=false] If `true` whitespace will be","        ignored when shrinking the start and end containers. Offsets will","        be set to exclude any leading whitespace from the startContainer and","        trailing whitespace from the endContainer.","    @chainable","    **/","    shrink: function(options) {","        return this.shrinkStart(options).shrinkEnd(options);","    },","","    /**","    Shrinks the endContainer of the range to just the text node containing","    the selected text.","","    Browsers are inconsistent in how they define a range, sometimes using","    offsets of sibling or parent nodes instead of the actual text node","    containing the selected text.","","    @method shrinkEnd","    @param {Object} [options]","      @param {Boolean} [options.trim=false] If `true` whitespace will be","        ignored when shrinking the endContainer and an offset will be set to","        exclude any trailing whitespace from the shrunken endContainer.","    @chainable","    **/","    shrinkEnd: function(options) {","        var trim = options && options.trim;","","        if (!this.isCollapsed()) {","            var initialEndNode = this.endNode(),","                endNode = initialEndNode,","                endOffset = this.endOffset(),","                endType = endNode.get('nodeType'),","                endText, endTrim;","","            // Note: Check for explicit node types since empty element nodes","            // will return falsy for assertions on firstChild, lastChild etc.","","            if (TEXT_NODE === endType) {","                endText = endNode.get('text');","                endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));","","                if (!endOffset || endTrim) {","                    // If there is no endOffset, the previousSibling contains","                    // the the selected text","                    var sibling;","","                    // The endNode might be a child of a sibling node, so","                    // walk up the DOM to find the right node","                    while (!(sibling = endNode.get('previousSibling'))) {","                        endNode = endNode.get('parentNode');","                    }","","                    endNode = sibling;","                } else if (!trim) {","                    // have the correct textNode and not trimming it","                    return this;","                }","            } else if (endOffset) {","                // the endOffset references a childNode","                endNode = endNode.get('childNodes').item(endOffset - 1);","            }","","            // at this point endNode could be an element node or a text node","            // if it is still an element node, traverse to find the","            // last textNode child","            if (ELEMENT_NODE === endNode.get('nodeType')) {","                this.endNode(endNode, endNode.get('childNodes').size());","","                this.traverse(function(node) {","                    if (TEXT_NODE === node.get('nodeType')) {","                        endNode = node;","                    }","                });","            }","","            if (initialEndNode !== endNode) {","                // a different node than we started with. reset the offset","                endOffset = endNode.get('text').length;","            }","","            endText = endNode.get('text').substring(0, endOffset);","            endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;","","            this.endNode(endNode, endOffset);","        }","","        return this;","    },","","    /**","    Shrinks the startContainer of the range to just the text node containing","    the selected text.","","    Browsers are inconsistent in how they define a range, sometimes using","    offsets of sibling or parent nodes instead of the actual text node","    containing the selected text.","","    @method shrinkStart","    @param {Object} [options]","      @param {Boolean} [options.trim=false] If `true` whitespace will be","        ignored when shrinking the startContainer and an offset will be set to","        exclude any leading whitespace from the shrunken startContainer.","    @chainable","    **/","    shrinkStart: function(options) {","        var trim = options && options.trim;","","        if (!this.isCollapsed()) {","            var initialStartNode = this.startNode(),","                startNode = initialStartNode,","                startOffset = this.startOffset(),","                startType = startNode.get('nodeType'),","                startText, startTrim;","","            // Note: Check for explicit node types since empty element nodes","            // will return falsy for assertions on firstChild, lastChild etc.","","            if (TEXT_NODE === startType) {","                startText = startNode.get('text');","                startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));","","                if (startText.length === startOffset || startTrim) {","                    // startOffset is at the end of the startContainer.","                    // nextSibling contains the selected text","                    var sibling;","","                    // The startNode might be a child of a sibling node, so","                    // walk up the DOM to find the right node","                    while (!(sibling = startNode.get('nextSibling'))) {","                        startNode = startNode.get('parentNode');","                    }","","                    startNode = sibling;","                } else if (!trim) {","                    // have the correct textNode and not trimming it","                    return this;","                }","            } else if (startOffset) {","                // the startOffset references a childNode","                startNode = startNode.get('childNodes').item(startOffset - 1);","            }","","            // at this point startNode could be an element node or a text node","            // if it is still an element node, traverse to find the","            // first textNode child, stopping traversal when found","            if (ELEMENT_NODE === startNode.get('nodeType')) {","                this.startNode(startNode);","","                this.traverse(function(node) {","                    if (TEXT_NODE === node.get('nodeType')) {","                        startNode = node;","                        return true; // stops traversal","                    }","                });","            }","","            if (initialStartNode !== startNode) {","                // a different node than we started with. reset the offset","                startOffset = 0;","            }","","            startText = startNode.get('text').substring(startOffset);","            startOffset += trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;","","            this.startNode(startNode, startOffset);","        }","","        return this;","    },","","    /**","    Gets or sets the node that contains the start point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the start point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the start point to be placed immediately","    before _node_ (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    _node_ (not inside it).","","    @method startNode","    @param {HTMLElement|Node|String} [node] Node to set the start point to. May","        be specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current start point will be returned.","    @param {Number|String} [offset=0] Offset position of the new start point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the start point of this range.","    **/","    startNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setStart(el, offset);","            } else if (offset === 'before') {","                this._range.setStartBefore(el);","            } else if (offset === 'after') {","                this._range.setStartAfter(el);","            }","        }","","        return Y.one(this._range.startContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this range's start position inside the start","    node.","","    If the start node is a text node, the offset represents a character","    position. If the start node can contain child nodes, then the offset","    represents a child index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the start point to be placed immediately","    before the current start node (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    the current start node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the start node.","    To get the new start node, call `startNode()`.","","    @method startOffset","    @param {Number|String} [offset] Offset position of the new start point","        relative to the current start node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this range's start position inside the start","        node.","    **/","    startOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.startNode(this._range.startContainer, offset);","        }","","        return this._range.startOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the HTML content of this range.","","    @method toHTML","    @return {HTML} HTML content of this range.","    **/","    toHTML: isHTML5 ? function () {","        var div = doc.createElement('div');","        div.appendChild(this._range.cloneContents());","","        return div.innerHTML;","    } : function () {","        return this._range.htmlText;","    },","","    /**","    Returns the plain text content of this range.","","    @method toString","    @return {String} Plain text content of this range.","    **/","    toString: isHTML5 ? function () {","        return this._range.toString();","    } : function () {","        return this._range.text;","    },","","    /**","    Traverses the contents of the range, passing each node and its children to","    the supplied callback in document order.","","    For example, if the range includes the following HTML...","","        lorem ipsum <b>dolor <i>sit</i></b> amet","","    ...then this `traverse()` call...","","        range.traverse(function (node) {","            console.log(Y.Node.getDOMNode(node));","        });","","    ...would result in the following console output:","","        \"lorem ipsum \"","        <b> element","        \"dolor \"","        <i> element","        \"sit\"","        \" amet\"","","    The entire start and end node will be included even if the range only","    includes a portion of them. Use the `startOffset()` and `endOffset()`","    methods to determine where the precise boundaries are if necessary.","","    Returning `true` from the callback function will stop traversal","","    @method traverse","    @param {Function} callback Callback function.","        @param {Node} callback.node Node instance.","    @param {Object} [thisObj] `this` object to use when calling the callback","        function.","    @chainable","    **/","    traverse: function (callback, thisObj) {","        if (this.isCollapsed()) {","            return this;","        }","","        var container = this.parentNode()._node,","            end       = this.endNode()._node,","            endOffset = this.endOffset();","","        // If there's a positive offset and the end node has children, we need","        // to take the offset into account when traversing. Otherwise we can","        // ignore it.","        if (endOffset && end.childNodes.length) {","            end = end.childNodes[endOffset - 1];","","            while (end.lastChild) {","                end = end.lastChild;","            }","        }","","        function traverseDOMNode(domNode) {","            var stop = callback.call(thisObj, Y.one(domNode));","","            if (stop || domNode === end) {","                return;","            }","","            if (domNode.firstChild) {","                traverseDOMNode(domNode.firstChild);","            } else if (domNode.nextSibling) {","                traverseDOMNode(domNode.nextSibling);","            } else {","                var node = domNode;","","                while (node = node.parentNode) {","                    if (node !== container && node.nextSibling) {","                        traverseDOMNode(node.nextSibling);","                        break;","                    }","                }","            }","        }","","        traverseDOMNode(this.startNode()._node);","","        return this;","    },","","    /**","    Wraps this range in the specified HTML and returns the new wrapper node.","","    @method wrap","    @param {HTML} html HTML string.","    @param {Object} [options] Options.","        @param {Boolean} [options.includeWrapper=false] If `true`, this range","            will be updated to include the new wrapper node.","    @return {Node} New wrapper node.","    **/","    wrap: isHTML5 ? function (html, options) {","        // We have to manually extract the range's contents and append them to","        // the wrapper instead of just using Range#surroundContents(), because","        // surroundContents() will throw an exception if one of the Range's","        // boundary points splits a non-text node.","        //","        // It's puzzling that this is part of the Range spec, because the error","        // doesn't do anyone any good, and extractContents() (which is used","        // internally by surroundContents()) already requires the browser to","        // implement node splitting anyway. But whatevs.","        var contents  = this._range.extractContents(),","            container = Y.DOM.create(html); // TODO: handle fragments?","","        container.appendChild(contents);","        this._range.insertNode(container);","","        if (options && options.includeWrapper) {","            this._range.selectNode(container);","        } else {","            this._range.selectNodeContents(container);","        }","","        return Y.one(container);","    } : function (html) {","        throw new Error('Not yet implemented.');","    }","};","","Y.Range = Range;","","","}, '@VERSION@', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].lines = {"1":0,"27":0,"35":0,"36":0,"38":0,"41":0,"55":0,"57":0,"76":0,"78":0,"93":0,"94":0,"120":0,"121":0,"124":0,"127":0,"130":0,"132":0,"142":0,"143":0,"145":0,"177":0,"178":0,"180":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"191":0,"193":0,"226":0,"227":0,"230":0,"232":0,"262":0,"276":0,"281":0,"283":0,"285":0,"288":0,"302":0,"307":0,"309":0,"311":0,"314":0,"332":0,"334":0,"346":0,"347":0,"348":0,"350":0,"364":0,"366":0,"379":0,"393":0,"396":0,"397":0,"400":0,"401":0,"402":0,"406":0,"418":0,"420":0,"434":0,"435":0,"437":0,"452":0,"453":0,"455":0,"525":0,"544":0,"546":0,"547":0,"556":0,"557":0,"558":0,"560":0,"563":0,"567":0,"568":0,"571":0,"572":0,"574":0,"576":0,"578":0,"584":0,"585":0,"587":0,"588":0,"589":0,"594":0,"596":0,"599":0,"600":0,"602":0,"605":0,"624":0,"626":0,"627":0,"636":0,"637":0,"638":0,"640":0,"643":0,"647":0,"648":0,"651":0,"652":0,"654":0,"656":0,"658":0,"664":0,"665":0,"667":0,"668":0,"669":0,"670":0,"675":0,"677":0,"680":0,"681":0,"683":0,"686":0,"718":0,"719":0,"721":0,"723":0,"724":0,"725":0,"726":0,"727":0,"728":0,"732":0,"734":0,"767":0,"768":0,"771":0,"773":0,"783":0,"784":0,"786":0,"788":0,"798":0,"800":0,"840":0,"841":0,"844":0,"851":0,"852":0,"854":0,"855":0,"859":0,"860":0,"862":0,"863":0,"866":0,"867":0,"868":0,"869":0,"871":0,"873":0,"874":0,"875":0,"876":0,"882":0,"884":0,"907":0,"910":0,"911":0,"913":0,"914":0,"916":0,"919":0,"921":0,"925":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].functions = {"(anonymous 2):35":0,"}:37":0,"(anonymous 3):54":0,"}:56":0,"(anonymous 4):75":0,"}:77":0,"collapse:92":0,"(anonymous 5):118":0,"}:131":0,"(anonymous 6):141":0,"}:144":0,"(anonymous 7):176":0,"}:192":0,"(anonymous 8):225":0,"}:231":0,"expand:261":0,"expandEnd:275":0,"expandStart:301":0,"(anonymous 9):331":0,"}:333":0,"(anonymous 10):345":0,"}:349":0,"(anonymous 11):363":0,"}:365":0,"isEquivalent:378":0,"isInsideNode:392":0,"(anonymous 12):417":0,"}:419":0,"(anonymous 13):433":0,"}:436":0,"(anonymous 14):451":0,"}:454":0,"shrink:524":0,"(anonymous 15):587":0,"shrinkEnd:543":0,"(anonymous 16):667":0,"shrinkStart:623":0,"(anonymous 17):717":0,"}:733":0,"(anonymous 18):766":0,"}:772":0,"(anonymous 19):782":0,"}:787":0,"(anonymous 20):797":0,"}:799":0,"traverseDOMNode:859":0,"traverse:839":0,"(anonymous 21):897":0,"}:920":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredLines = 177;
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredFunctions = 50;
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 1);
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

_yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 27);
var doc = Y.config.doc,
    win = Y.config.win,

    isHTML5 = !!(win && win.Range && doc.createRange),

    ELEMENT_NODE = 1,
    TEXT_NODE = 3;

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 35);
var Range = isHTML5 ? function (range) {
    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 2)", 35);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 36);
this._range = range || doc.createRange();
} : function (range) {
    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 37);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 38);
this._range = range || doc.body.createTextRange();
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 41);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 3)", 54);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 55);
return new Y.Range(this._range.cloneRange());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 56);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 57);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 4)", 75);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 76);
return Y.one(this._range.cloneContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 77);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 78);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "collapse", 92);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 93);
this._range.collapse(options && options.toStart);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 94);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 5)", 118);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 120);
if (otherRange._range) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 121);
otherRange = otherRange._range;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 124);
var myPoint    = (options && options.myPoint) || 'start',
            otherPoint = (options && options.otherPoint) || 'start';

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 127);
var how = win.Range[otherPoint.toUpperCase() + '_TO_' +
                    myPoint.toUpperCase()];

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 130);
return this._range.compareBoundaryPoints(how, otherRange);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 131);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 132);
throw new Error('Not yet implemented.');
    },

    /**
    Removes the contents of this range from the DOM.

    @method deleteContents
    @chainable
    **/
    deleteContents: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 6)", 141);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 142);
this._range.deleteContents();
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 143);
return this;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 144);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 145);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 7)", 176);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 177);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 178);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 180);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 182);
if (typeof offset === 'number') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 183);
this._range.setEnd(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 184);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 185);
this._range.setEndBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 186);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 187);
this._range.setEndAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 191);
return Y.one(this._range.endContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 192);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 193);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 8)", 225);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 226);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 227);
this.endNode(this._range.endContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 230);
return this._range.endOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 231);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 232);
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

        <div><span>[{Lorem]}</span></div>  s0:e5

    after expansion would be

        [{<div><span>Lorem</span></div>}]  s0:e1

    @method expand
    @param {HTMLElement|Node} [container] If provided, do not expand the range
        past this container
    @chainable
    **/
    expand: function(container) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "expand", 261);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 262);
return this.expandStart(container).expandEnd(container);
    },

    /**
    Attempts to expand the range end to include element nodes while
    still being equivalent to the current range. End node is not
    guaranteed to be an element node after this method is executed.

    @method expandEnd
    @param {HTMLElement|Node} [container] If provided, do not expand the range
        past this container
    @chainable
    **/
    expandEnd: function(container) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "expandEnd", 275);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 276);
var endNode = this.endNode()._node,
            offset = this.endOffset(),
            nodeType = endNode.nodeType,
            parentNode = endNode.parentNode;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 281);
container = Y.one(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 283);
if (TEXT_NODE === nodeType && endNode.length === offset && !endNode.nextSibling
                && (!container || container._node !== parentNode)) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 285);
this.endNode(parentNode, 'after');
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 288);
return this;
    },

    /**
    Attempts to expand the range start to include element nodes while
    still being equivalent to the current range. Start node is not
    guaranteed to be an element node after this method is executed.

    @method expandStart
    @param {HTMLElement|Node} [container] If provided, do not expand the range
        past this container
    @chainable
    **/
    expandStart: function(container) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "expandStart", 301);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 302);
var startNode = this.startNode()._node,
            offset = this.startOffset(),
            nodeType = startNode.nodeType,
            parentNode = startNode.parentNode;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 307);
container = Y.one(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 309);
if (TEXT_NODE === nodeType && 0 === offset && !startNode.previousSibling
                && (!container || container._node !== parentNode)) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 311);
this.startNode(parentNode, 'before');
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 314);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 9)", 331);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 332);
return Y.one(this._range.extractContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 333);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 334);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 10)", 345);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 346);
node = Y.one(node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 347);
this._range.insertNode(node._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 348);
return node;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 349);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 350);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 11)", 363);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 364);
return this._range.collapsed;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 365);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 366);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isEquivalent", 378);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 379);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isInsideNode", 392);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 393);
var el       = Y.one(node)._node,
            parentEl = this.parentNode()._node;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 396);
if (el === parentEl) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 397);
return true;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 400);
while (parentEl = parentEl.parentNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 401);
if (el === parentEl) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 402);
return true;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 406);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 12)", 417);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 418);
return Y.one(this._range.commonAncestorContainer);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 419);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 420);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 13)", 433);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 434);
this._range.selectNode(Y.one(node)._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 435);
return this;
    } : function (node) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 436);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 437);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 14)", 451);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 452);
this._range.selectNodeContents(Y.one(node)._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 453);
return this;
    } : function (node) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 454);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 455);
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
    shrink: function(options) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrink", 524);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 525);
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
    shrinkEnd: function(options) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrinkEnd", 543);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 544);
var trim = options && options.trim;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 546);
if (!this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 547);
var initialEndNode = this.endNode(),
                endNode = initialEndNode,
                endOffset = this.endOffset(),
                endType = endNode.get('nodeType'),
                endText, endTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 556);
if (TEXT_NODE === endType) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 557);
endText = endNode.get('text');
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 558);
endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 560);
if (!endOffset || endTrim) {
                    // If there is no endOffset, the previousSibling contains
                    // the the selected text
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 563);
var sibling;

                    // The endNode might be a child of a sibling node, so
                    // walk up the DOM to find the right node
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 567);
while (!(sibling = endNode.get('previousSibling'))) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 568);
endNode = endNode.get('parentNode');
                    }

                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 571);
endNode = sibling;
                } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 572);
if (!trim) {
                    // have the correct textNode and not trimming it
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 574);
return this;
                }}
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 576);
if (endOffset) {
                // the endOffset references a childNode
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 578);
endNode = endNode.get('childNodes').item(endOffset - 1);
            }}

            // at this point endNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // last textNode child
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 584);
if (ELEMENT_NODE === endNode.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 585);
this.endNode(endNode, endNode.get('childNodes').size());

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 587);
this.traverse(function(node) {
                    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 15)", 587);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 588);
if (TEXT_NODE === node.get('nodeType')) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 589);
endNode = node;
                    }
                });
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 594);
if (initialEndNode !== endNode) {
                // a different node than we started with. reset the offset
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 596);
endOffset = endNode.get('text').length;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 599);
endText = endNode.get('text').substring(0, endOffset);
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 600);
endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 602);
this.endNode(endNode, endOffset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 605);
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
    shrinkStart: function(options) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrinkStart", 623);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 624);
var trim = options && options.trim;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 626);
if (!this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 627);
var initialStartNode = this.startNode(),
                startNode = initialStartNode,
                startOffset = this.startOffset(),
                startType = startNode.get('nodeType'),
                startText, startTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 636);
if (TEXT_NODE === startType) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 637);
startText = startNode.get('text');
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 638);
startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 640);
if (startText.length === startOffset || startTrim) {
                    // startOffset is at the end of the startContainer.
                    // nextSibling contains the selected text
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 643);
var sibling;

                    // The startNode might be a child of a sibling node, so
                    // walk up the DOM to find the right node
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 647);
while (!(sibling = startNode.get('nextSibling'))) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 648);
startNode = startNode.get('parentNode');
                    }

                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 651);
startNode = sibling;
                } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 652);
if (!trim) {
                    // have the correct textNode and not trimming it
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 654);
return this;
                }}
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 656);
if (startOffset) {
                // the startOffset references a childNode
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 658);
startNode = startNode.get('childNodes').item(startOffset - 1);
            }}

            // at this point startNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // first textNode child, stopping traversal when found
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 664);
if (ELEMENT_NODE === startNode.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 665);
this.startNode(startNode);

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 667);
this.traverse(function(node) {
                    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 16)", 667);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 668);
if (TEXT_NODE === node.get('nodeType')) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 669);
startNode = node;
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 670);
return true; // stops traversal
                    }
                });
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 675);
if (initialStartNode !== startNode) {
                // a different node than we started with. reset the offset
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 677);
startOffset = 0;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 680);
startText = startNode.get('text').substring(startOffset);
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 681);
startOffset += trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 683);
this.startNode(startNode, startOffset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 686);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 17)", 717);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 718);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 719);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 721);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 723);
if (typeof offset === 'number') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 724);
this._range.setStart(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 725);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 726);
this._range.setStartBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 727);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 728);
this._range.setStartAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 732);
return Y.one(this._range.startContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 733);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 734);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 18)", 766);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 767);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 768);
this.startNode(this._range.startContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 771);
return this._range.startOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 772);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 773);
throw new Error('Not yet implemented.');
    },

    /**
    Returns the HTML content of this range.

    @method toHTML
    @return {HTML} HTML content of this range.
    **/
    toHTML: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 19)", 782);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 783);
var div = doc.createElement('div');
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 784);
div.appendChild(this._range.cloneContents());

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 786);
return div.innerHTML;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 787);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 788);
return this._range.htmlText;
    },

    /**
    Returns the plain text content of this range.

    @method toString
    @return {String} Plain text content of this range.
    **/
    toString: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 20)", 797);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 798);
return this._range.toString();
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 799);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 800);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverse", 839);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 840);
if (this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 841);
return this;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 844);
var container = this.parentNode()._node,
            end       = this.endNode()._node,
            endOffset = this.endOffset();

        // If there's a positive offset and the end node has children, we need
        // to take the offset into account when traversing. Otherwise we can
        // ignore it.
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 851);
if (endOffset && end.childNodes.length) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 852);
end = end.childNodes[endOffset - 1];

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 854);
while (end.lastChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 855);
end = end.lastChild;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 859);
function traverseDOMNode(domNode) {
            _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverseDOMNode", 859);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 860);
var stop = callback.call(thisObj, Y.one(domNode));

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 862);
if (stop || domNode === end) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 863);
return;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 866);
if (domNode.firstChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 867);
traverseDOMNode(domNode.firstChild);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 868);
if (domNode.nextSibling) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 869);
traverseDOMNode(domNode.nextSibling);
            } else {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 871);
var node = domNode;

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 873);
while (node = node.parentNode) {
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 874);
if (node !== container && node.nextSibling) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 875);
traverseDOMNode(node.nextSibling);
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 876);
break;
                    }
                }
            }}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 882);
traverseDOMNode(this.startNode()._node);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 884);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 21)", 897);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 907);
var contents  = this._range.extractContents(),
            container = Y.DOM.create(html); // TODO: handle fragments?

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 910);
container.appendChild(contents);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 911);
this._range.insertNode(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 913);
if (options && options.includeWrapper) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 914);
this._range.selectNode(container);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 916);
this._range.selectNodeContents(container);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 919);
return Y.one(container);
    } : function (html) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 920);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 921);
throw new Error('Not yet implemented.');
    }
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 925);
Y.Range = Range;


}, '@VERSION@', {"requires": ["node-base"]});
