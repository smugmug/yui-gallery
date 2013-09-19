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
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].code=["YUI.add('gallery-sm-range', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","// Fun fact! The YUI Gallery currently doesn't support conditional loading of","// modules based on feature detection like YUI core does, so that's why all the","// legacy compat code is baked in here instead of in a separate conditionally","// loaded module.","","/**","Provides the `Range` class, which normalizes Range behavior across browsers.","","@module gallery-sm-selection","@submodule gallery-sm-range","**/","","/**","Provides a friendly cross-browser Range API similar to the API defined in the","DOM Range specification.","","@class Range","@param {window.Range} [range] Native Range object to wrap. If not provided, a","    new Range will be created.","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.Range && doc.createRange),","","    ELEMENT_NODE = 1,","    TEXT_NODE = 3;","","var Range = isHTML5 ? function (range) {","    this._range = range || doc.createRange();","} : function (range) {","    this._range = range || doc.body.createTextRange();","};","","Range.prototype = {","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns a new Range object with the same boundary points as this range.","","    The returned Range is a copy, not a reference, so modifying it will not","    affect this range (and vice versa).","","    @method clone","    @return {Range} New Range object with the same boundary points as this","        range.","    **/","    clone: isHTML5 ? function () {","        return new Y.Range(this._range.cloneRange());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns a Node instance containing a document fragment with a copy of this","    range's contents.","","    Event listeners are not copied.","","    Element ids _are_ copied. This could lead to duplicate ids, so be careful.","","    Partially selected nodes will include parent tags to ensure that the","    fragment is valid.","","    @method cloneContents","    @return {Node} Node instance containing a document fragment with a copy of","        this range's contents.","    **/","    cloneContents: isHTML5 ? function () {","        return Y.one(this._range.cloneContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Collapses this range by setting the start and end points to the same","    position, thus resulting in an empty range.","","    @method collapse","    @param {Object} [options] Options.","        @param {Boolean} [options.toStart=false] If `true`, this range will be","            collapsed by moving the end point to the start point. Otherwise, the","            start point will be moved to the end point.","    @chainable","    **/","    collapse: function (options) {","        this._range.collapse(options && options.toStart);","        return this;","    },","","    /**","    Compares the start or end boundary of this range with the start or end","    boundary of another range.","","    @method compare","    @param {Range} otherRange Range to compare to.","    @param {Object} [options] Options.","","        @param {String} [options.myPoint='start'] Specifies which boundary point","            on this range should be used for the comparison. Valid values are","            'start' to use this range's start point for the comparison, or 'end'","            to use this range's end point.","","        @param {String} [options.otherPoint='start'] Specifies which boundary","            point on _otherRange_ should be used for the comparison. Valid","            values are 'start' to use _otherRange_'s start point for the","            comparison, or 'end' to use _otherRange_'s end point.","","    @return {Number} -1, 0, or 1, indicating whether this range's boundary is","        respectively before, equal to, or after the other range's boundary.","    **/","    compare: isHTML5 ? function (otherRange, options) {","        // Make sure we're working with a native range, not a YUI range.","        if (otherRange._range) {","            otherRange = otherRange._range;","        }","","        var myPoint    = (options && options.myPoint) || 'start',","            otherPoint = (options && options.otherPoint) || 'start';","","        var how = win.Range[otherPoint.toUpperCase() + '_TO_' +","                    myPoint.toUpperCase()];","","        return this._range.compareBoundaryPoints(how, otherRange);","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Removes the contents of this range from the DOM.","","    @method deleteContents","    @chainable","    **/","    deleteContents: isHTML5 ? function () {","        this._range.deleteContents();","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the node that contains the end point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the end point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the end point to be placed immediately before","    _node_ (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    _node_ (not inside it).","","    @method endNode","    @param {HTMLElement|Node|String} [node] Node to set the end point to. May be","        specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current end point will be returned.","    @param {Number|String} [offset=0] Offset position of the new end point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the end point of this range.","    **/","    endNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setEnd(el, offset);","            } else if (offset === 'before') {","                this._range.setEndBefore(el);","            } else if (offset === 'after') {","                this._range.setEndAfter(el);","            }","        }","","        return Y.one(this._range.endContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this selection's end position inside the end","    node.","","    If the end node is a text node, the offset represents a character position.","    If the end node can contain child nodes, then the offset represents a child","    index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the end point to be placed immediately before","    the current end node (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    the current end node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the end node. To","    get the new end node, call `endNode()`.","","    @method endOffset","    @param {Number|String} [offset] Offset position of the new end point","        relative to the current end node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this selection's end position inside the end","        node.","    **/","    endOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.endNode(this._range.endContainer, offset);","        }","","        return this._range.endOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Attempts to expand the range to include element nodes while","    still being equivalent to the current range. Start and End nodes","    are not guaranteed to be element nodes after this method is executed.","","    Examples:","","        [] = startContainer, {} = endContainer, s:e = start/end offset","","    given the HTML","","        <div><span>Lorem</span></div>","","    an initial range of","","        <div><span>[{Lorem]}</span></div>  #text s0 : #text e5","","    after expansion with stopAt = `span`","","        <div><span>[{Lorem]}</span></div>  SPAN s0 : SPAN e1","","    after expansion with stopAt = `div`","","        <div>[{<span>Lorem</span>}]</div>  DIV s0 : DIV e1","","    @method expand","    @param {Object} [options]","        @param {String|Function|HTMLElement|Node} [options.stopAt] If provided,","        does not expand the range past this node.","        Strings will be used as selectors to match ancestor nodes of the start","        and end nodes of the range (inclusive).","        Functions will test ancestors of the start and end nodes of the range","        (inclusive) and will receive the node being tested as the only argument.","    @chainable","    **/","    expand: function (options) {","        return this.expandStart(options).expandEnd(options);","    },","","    /**","    Attempts to expand the range end to include element nodes while","    still being equivalent to the current range. End node is not","    guaranteed to be an element node after this method is executed.","","    @method expandEnd","    @param {Object} [options]","        @param {String|Function|HTMLElement|Node} [options.stopAt] If provided,","        does not expand the range past this node.","        Strings will be used as selectors to match ancestor nodes of the end","        node of the range (inclusive).","        Functions will test ancestors of the end node of the range (inclusive)","        and will receive the node being tested as the only argument.","    @chainable","    **/","    expandEnd: function (options) {","        var endNode = this.endNode(),","            endOffset = this.endOffset(),","            stopNode, parentNode;","","        options || (options = {});","        options.stopAt && (stopNode = options.stopAt);","","        function maxOffset (node) {","            var maxOffset;","","            node = node._node;","","            if (TEXT_NODE === node.nodeType) {","                maxOffset = node.length;","            } else {","                maxOffset = node.childNodes.length;","            }","","            return maxOffset;","        }","","        if ('string' === typeof stopNode || 'function' === typeof stopNode) {","            stopNode = endNode.ancestor(stopNode, true);","        } else {","            stopNode = Y.one(stopNode);","        }","","        while (endNode !== stopNode && maxOffset(endNode) === endOffset) {","            parentNode = endNode.get('parentNode');","","            endOffset = parentNode.get('childNodes').indexOf(endNode) + 1;","            endNode = parentNode;","        }","","        this.endNode(endNode, endOffset);","","        return this;","    },","","    /**","    Attempts to expand the range start to include element nodes while","    still being equivalent to the current range. Start node is not","    guaranteed to be an element node after this method is executed.","","    @method expandStart","        @param {String|Function|HTMLElement|Node} [options.stopAt] If provided,","        does not expand the range past this node.","        Strings will be used as selectors to match ancestor nodes of the start","        node of the range (inclusive).","        Functions will test ancestors of the start node of the range (inclusive)","        and will receive the node being tested as the only argument.","    @chainable","    **/","    expandStart: function (options) {","        var startNode = this.startNode(),","            startOffset = this.startOffset(),","            stopNode, parentNode;","","        options || (options = {});","        options.stopAt && (stopNode = options.stopAt);","","        if ('string' === typeof stopNode || 'function' === typeof stopNode) {","            stopNode = startNode.ancestor(stopNode, true);","        } else {","            stopNode = Y.one(stopNode);","        }","","        while (startNode !== stopNode && 0 === startOffset) {","            parentNode = startNode.get('parentNode');","","            startOffset = parentNode.get('childNodes').indexOf(startNode);","            startNode = parentNode;","        }","","        this.startNode(startNode, startOffset);","","        return this;","    },","","    /**","    Moves this range's contents into a document fragment and returns a Node","    instance containing that fragment.","","    Event listeners are not retained.","","    If this range splits a non-text element, the resulting fragment will include","    a clone of that element, including its id (if it has one). This could lead","    to duplicate ids, so be careful.","","    @method extractContents","    @return {Node} Node instance containing a document fragment with this","        range's contents.","    **/","    extractContents: isHTML5 ? function () {","        return Y.one(this._range.extractContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Inserts a node at the start of this range.","","    @method insertNode","    @param {HTMLElement|Node|String} node Node instance, HTMLElement, or","        selector string of a node to insert.","    @return {Node} Inserted node.","    **/","    insertNode: isHTML5 ? function (node) {","        node = Y.one(node);","        this._range.insertNode(node._node);","        return node;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range is collapsed, `false` otherwise.","","    A `true` value means that the start and end points are the same and the","    range is empty, whereas a `false` value means that the start and end points","    are different and the range is not empty.","","    @method isCollapsed","    @return {Boolean} `true` if this range is collapsed, `false` otherwise.","    **/","    isCollapsed: isHTML5 ? function () {","        return this._range.collapsed;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range has the same boundaries as _otherRange_,","    `false` otherwise.","","    @method isEquivalent","    @param {Range} otherRange Range to compare this range to.","    @return {Boolean} `true` if this range has the same boundaries as","        _otherRange_, `false` otherwise.","    **/","    isEquivalent: function (otherRange) {","        return otherRange && this.compare(otherRange) === 0 &&","                this.compare(otherRange, {myPoint: 'end', otherPoint: 'end'}) === 0;","    },","","    /**","    Returns `true` if this range is entirely contained within the given _node_.","","    @method isInsideNode","    @param {HTMLElement|Node|String} node Node instance, HTML element, or","        selector string of the container.","    @return {Boolean} `true` if this range is entirely contained within the","        given _node_, `false` otherwise.","    **/","    isInsideNode: function (node) {","        var el       = Y.one(node)._node,","            parentEl = this.parentNode()._node;","","        if (el === parentEl) {","            return true;","        }","","        while (parentEl = parentEl.parentNode) {","            if (el === parentEl) {","                return true;","            }","        }","","        return false;","    },","","    /**","    Returns the nearest common ancestor node that fully contains all nodes","    within this range.","","    @method parentNode","    @return {Node} Nearest common ancestor node that fully contains all nodes","        within this range.","    **/","    parentNode: isHTML5 ? function () {","        return Y.one(this._range.commonAncestorContainer);","    } : function () {","        return Y.one(this._range.parentElement());","    },","","    /**","    Sets the Range to contain the Node and its contents.","","    The parent Node of the start and end of the Range will be the same as the","    parent of the given node.","","    @method selectNode","    @param {HTMLElement|Node} node Node or HTMLElement to select","    @chainable","    **/","    selectNode: isHTML5 ? function (node) {","        this._range.selectNode(Y.one(node)._node);","        return this;","    } : function (node) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Sets the Range to contain the contents of a Node.","","    The parent Node of the start and end of the Range will be the given node.","    The startOffset is 0, and the endOffset is the number of child Nodes or","    number of characters contained in the reference node.","","    @method selectNodeContents","    @param {HTMLElement|Node} node Node or HTMLElement to select","    @chainable","    **/","    selectNodeContents: isHTML5 ? function (node) {","        this._range.selectNodeContents(Y.one(node)._node);","        return this;","    } : function (node) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Shrinks the start and end containers of the range to just the text nodes","    containing the selected text.","","    Useful for normalizing a range after double clicking to select since the","    range start/end containers vary by browser as explained below:","","    Chrome and IE use the first text node that contains the selected text","    as the startContainer with an offset to exclude any leading whitespace.","","    Firefox will use a text node *before* the selected text","    as the startContainer, with a positive offset set to the end","    of the node. If there is no previous sibling of the selected text","    or the previous sibling is not a text node, the behavior is the","    same as Chrome/IE.","","    Chrome uses the last text node that contains the selected text as the","    endContainer, with an offset to exclude trailing whitespace.","","    Firefox follows the mostly the same rules for the endContainer","    as it does for the startContainer. Any sibling text node","    *after* the selected text will be used as the endContainer,","    but with a 0 offset. If there is no next sibling or the next sibling","    is not a text node, the endContainer will be the same as the","    startContainer, with an offset to exclude any trailing whitespace.","","    IE will aways use a following text node as the endContainer,","    even if it is a child of a sibling. The offset will *include all*","    leading whitespace. If there is no following text node,","    the endContainer will be the same as the startContainer, with an","    offset to *include all* trailing whitespace.","","    Examples:","        [] = startContainer, {} = endContainer, s:e = start/end offset","","    given the HTML","        Lorem <b>Ipsum</b> Dolor Sit","","    dbl clicking to select the text `Lorem`","        Chrome:  `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5","        Firefox: `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5","        IE:      `[Lorem ]<b>{Ipsum}</b> Dolor Sit`  s0:e0","","    dbl clicking to select the text `Ipsum`","        Chrome:  `Lorem <b>[{Ipsum}]</b> Dolor Sit`  s0:e5","        Firefox: `[Lorem ]<b>Ipsum</b>{ Dolor Sit}`  s6:e0","        IE:      `Lorem <b>[Ipsum]</b>{ Dolor Sit}`  s0:e1","","    dbl clicking to select the text `Dolor`","        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6","        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6","        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e7","","    dbl clicking to select the text `Sit`","        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","","    @method shrink","    @param {Object} [options]","      @param {Boolean} [options.trim=false] If `true` whitespace will be","        ignored when shrinking the start and end containers. Offsets will","        be set to exclude any leading whitespace from the startContainer and","        trailing whitespace from the endContainer.","    @chainable","    **/","    shrink: function (options) {","        return this.shrinkStart(options).shrinkEnd(options);","    },","","    /**","    Shrinks the endContainer of the range to just the text node containing","    the selected text.","","    Browsers are inconsistent in how they define a range, sometimes using","    offsets of sibling or parent nodes instead of the actual text node","    containing the selected text.","","    @method shrinkEnd","    @param {Object} [options]","      @param {Boolean} [options.trim=false] If `true` whitespace will be","        ignored when shrinking the endContainer and an offset will be set to","        exclude any trailing whitespace from the shrunken endContainer.","    @chainable","    **/","    shrinkEnd: function (options) {","        var trim = options && options.trim;","","        if (!this.isCollapsed()) {","            var initialEndNode = this.endNode(),","                endNode = initialEndNode,","                endOffset = this.endOffset(),","                endType = endNode.get('nodeType'),","                endText, endTrim;","","            // Note: Check for explicit node types since empty element nodes","            // will return falsy for assertions on firstChild, lastChild etc.","","            if (TEXT_NODE === endType) {","                endText = endNode.get('text');","                endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));","","                if (!endOffset || endTrim) {","                    // If there is no endOffset, the previousSibling contains","                    // the the selected text","                    var sibling;","","                    // The endNode might be a child of a sibling node, so","                    // walk up the DOM to find the right node","                    while (!(sibling = endNode.get('previousSibling'))) {","                        endNode = endNode.get('parentNode');","                    }","","                    endNode = sibling;","                } else if (!trim) {","                    // have the correct textNode and not trimming it","                    return this;","                }","            } else if (endOffset) {","                // the endOffset references a childNode","                endNode = endNode.get('childNodes').item(endOffset - 1);","            }","","            // at this point endNode could be an element node or a text node","            // if it is still an element node, traverse to find the","            // last textNode child","            if (ELEMENT_NODE === endNode.get('nodeType')) {","                this.endNode(endNode, endNode.get('childNodes').size());","","                this.traverse(function (node) {","                    if (TEXT_NODE === node.get('nodeType')) {","                        endNode = node;","                    }","                });","            }","","            if (initialEndNode !== endNode) {","                // a different node than we started with. reset the offset","                endOffset = endNode.get('text').length;","            }","","            endText = endNode.get('text').substring(0, endOffset);","            endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;","","            this.endNode(endNode, endOffset);","        }","","        return this;","    },","","    /**","    Shrinks the startContainer of the range to just the text node containing","    the selected text.","","    Browsers are inconsistent in how they define a range, sometimes using","    offsets of sibling or parent nodes instead of the actual text node","    containing the selected text.","","    @method shrinkStart","    @param {Object} [options]","      @param {Boolean} [options.trim=false] If `true` whitespace will be","        ignored when shrinking the startContainer and an offset will be set to","        exclude any leading whitespace from the shrunken startContainer.","    @chainable","    **/","    shrinkStart: function (options) {","        var trim = options && options.trim;","","        if (!this.isCollapsed()) {","            var initialStartNode = this.startNode(),","                startNode = initialStartNode,","                startOffset = this.startOffset(),","                startType = startNode.get('nodeType'),","                startText, startTrim;","","            // Note: Check for explicit node types since empty element nodes","            // will return falsy for assertions on firstChild, lastChild etc.","","            if (TEXT_NODE === startType) {","                startText = startNode.get('text');","                startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));","","                if (startText.length === startOffset || startTrim) {","                    // startOffset is at the end of the startContainer.","                    // nextSibling contains the selected text","                    var sibling;","","                    // The startNode might be a child of a sibling node, so","                    // walk up the DOM to find the right node","                    while (!(sibling = startNode.get('nextSibling'))) {","                        startNode = startNode.get('parentNode');","                    }","","                    startNode = sibling;","                } else if (!trim) {","                    // have the correct textNode and not trimming it","                    return this;","                }","            } else if (startOffset) {","                // the startOffset references a childNode","                startNode = startNode.get('childNodes').item(startOffset - 1);","            }","","            // at this point startNode could be an element node or a text node","            // if it is still an element node, traverse to find the","            // first textNode child, stopping traversal when found","            if (ELEMENT_NODE === startNode.get('nodeType')) {","                this.startNode(startNode);","","                this.traverse(function (node) {","                    if (TEXT_NODE === node.get('nodeType')) {","                        startNode = node;","                        return true; // stops traversal","                    }","                });","            }","","            if (initialStartNode !== startNode) {","                // a different node than we started with. reset the offset","                startOffset = 0;","            }","","            startText = startNode.get('text').substring(startOffset);","            startOffset += trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;","","            this.startNode(startNode, startOffset);","        }","","        return this;","    },","","    /**","    Gets or sets the node that contains the start point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the start point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the start point to be placed immediately","    before _node_ (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    _node_ (not inside it).","","    @method startNode","    @param {HTMLElement|Node|String} [node] Node to set the start point to. May","        be specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current start point will be returned.","    @param {Number|String} [offset=0] Offset position of the new start point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the start point of this range.","    **/","    startNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setStart(el, offset);","            } else if (offset === 'before') {","                this._range.setStartBefore(el);","            } else if (offset === 'after') {","                this._range.setStartAfter(el);","            }","        }","","        return Y.one(this._range.startContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this range's start position inside the start","    node.","","    If the start node is a text node, the offset represents a character","    position. If the start node can contain child nodes, then the offset","    represents a child index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the start point to be placed immediately","    before the current start node (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    the current start node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the start node.","    To get the new start node, call `startNode()`.","","    @method startOffset","    @param {Number|String} [offset] Offset position of the new start point","        relative to the current start node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this range's start position inside the start","        node.","    **/","    startOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.startNode(this._range.startContainer, offset);","        }","","        return this._range.startOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the HTML content of this range.","","    @method toHTML","    @return {HTML} HTML content of this range.","    **/","    toHTML: isHTML5 ? function () {","        var div = doc.createElement('div');","        div.appendChild(this._range.cloneContents());","","        return div.innerHTML;","    } : function () {","        return this._range.htmlText;","    },","","    /**","    Returns the plain text content of this range.","","    @method toString","    @return {String} Plain text content of this range.","    **/","    toString: isHTML5 ? function () {","        return this._range.toString();","    } : function () {","        return this._range.text;","    },","","    /**","    Traverses the contents of the range, passing each node and its children to","    the supplied callback in document order.","","    For example, if the range includes the following HTML...","","        lorem ipsum <b>dolor <i>sit</i></b> amet","","    ...then this `traverse()` call...","","        range.traverse(function (node) {","            console.log(Y.Node.getDOMNode(node));","        });","","    ...would result in the following console output:","","        \"lorem ipsum \"","        <b> element","        \"dolor \"","        <i> element","        \"sit\"","        \" amet\"","","    The entire start and end node will be included even if the range only","    includes a portion of them. Use the `startOffset()` and `endOffset()`","    methods to determine where the precise boundaries are if necessary.","","    Returning `true` from the callback function will stop traversal","","    @method traverse","    @param {Function} callback Callback function.","        @param {Node} callback.node Node instance.","    @param {Object} [thisObj] `this` object to use when calling the callback","        function.","    @chainable","    **/","    traverse: function (callback, thisObj) {","        if (this.isCollapsed()) {","            return this;","        }","","        var container = this.parentNode()._node,","            end       = this.endNode()._node,","            endOffset = this.endOffset();","","        // If there's a positive offset and the end node has children, we need","        // to take the offset into account when traversing. Otherwise we can","        // ignore it.","        if (endOffset && end.childNodes.length) {","            end = end.childNodes[endOffset - 1];","","            while (end.lastChild) {","                end = end.lastChild;","            }","        }","","        function traverseDOMNode(domNode) {","            var stop = callback.call(thisObj, Y.one(domNode));","","            if (stop || domNode === end) {","                return;","            }","","            if (domNode.firstChild) {","                traverseDOMNode(domNode.firstChild);","            } else if (domNode.nextSibling) {","                traverseDOMNode(domNode.nextSibling);","            } else {","                var node = domNode;","","                while (node = node.parentNode) {","                    if (node !== container && node.nextSibling) {","                        traverseDOMNode(node.nextSibling);","                        break;","                    }","                }","            }","        }","","        traverseDOMNode(this.startNode()._node);","","        return this;","    },","","    /**","    Wraps this range in the specified HTML and returns the new wrapper node.","","    @method wrap","    @param {HTML} html HTML string.","    @param {Object} [options] Options.","        @param {Boolean} [options.includeWrapper=false] If `true`, this range","            will be updated to include the new wrapper node.","    @return {Node} New wrapper node.","    **/","    wrap: isHTML5 ? function (html, options) {","        // We have to manually extract the range's contents and append them to","        // the wrapper instead of just using Range#surroundContents(), because","        // surroundContents() will throw an exception if one of the Range's","        // boundary points splits a non-text node.","        //","        // It's puzzling that this is part of the Range spec, because the error","        // doesn't do anyone any good, and extractContents() (which is used","        // internally by surroundContents()) already requires the browser to","        // implement node splitting anyway. But whatevs.","        var contents  = this._range.extractContents(),","            container = Y.DOM.create(html); // TODO: handle fragments?","","        container.appendChild(contents);","        this._range.insertNode(container);","","        if (options && options.includeWrapper) {","            this._range.selectNode(container);","        } else {","            this._range.selectNodeContents(container);","        }","","        return Y.one(container);","    } : function (html) {","        throw new Error('Not yet implemented.');","    }","};","","Y.Range = Range;","","","}, '@VERSION@', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].lines = {"1":0,"27":0,"35":0,"36":0,"38":0,"41":0,"55":0,"57":0,"76":0,"78":0,"93":0,"94":0,"120":0,"121":0,"124":0,"127":0,"130":0,"132":0,"142":0,"143":0,"145":0,"177":0,"178":0,"180":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"191":0,"193":0,"226":0,"227":0,"230":0,"232":0,"271":0,"290":0,"294":0,"295":0,"297":0,"298":0,"300":0,"302":0,"303":0,"305":0,"308":0,"311":0,"312":0,"314":0,"317":0,"318":0,"320":0,"321":0,"324":0,"326":0,"344":0,"348":0,"349":0,"351":0,"352":0,"354":0,"357":0,"358":0,"360":0,"361":0,"364":0,"366":0,"384":0,"386":0,"398":0,"399":0,"400":0,"402":0,"416":0,"418":0,"431":0,"445":0,"448":0,"449":0,"452":0,"453":0,"454":0,"458":0,"470":0,"472":0,"486":0,"487":0,"489":0,"504":0,"505":0,"507":0,"577":0,"596":0,"598":0,"599":0,"608":0,"609":0,"610":0,"612":0,"615":0,"619":0,"620":0,"623":0,"624":0,"626":0,"628":0,"630":0,"636":0,"637":0,"639":0,"640":0,"641":0,"646":0,"648":0,"651":0,"652":0,"654":0,"657":0,"676":0,"678":0,"679":0,"688":0,"689":0,"690":0,"692":0,"695":0,"699":0,"700":0,"703":0,"704":0,"706":0,"708":0,"710":0,"716":0,"717":0,"719":0,"720":0,"721":0,"722":0,"727":0,"729":0,"732":0,"733":0,"735":0,"738":0,"770":0,"771":0,"773":0,"775":0,"776":0,"777":0,"778":0,"779":0,"780":0,"784":0,"786":0,"819":0,"820":0,"823":0,"825":0,"835":0,"836":0,"838":0,"840":0,"850":0,"852":0,"892":0,"893":0,"896":0,"903":0,"904":0,"906":0,"907":0,"911":0,"912":0,"914":0,"915":0,"918":0,"919":0,"920":0,"921":0,"923":0,"925":0,"926":0,"927":0,"928":0,"934":0,"936":0,"959":0,"962":0,"963":0,"965":0,"966":0,"968":0,"971":0,"973":0,"977":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].functions = {"(anonymous 2):35":0,"}:37":0,"(anonymous 3):54":0,"}:56":0,"(anonymous 4):75":0,"}:77":0,"collapse:92":0,"(anonymous 5):118":0,"}:131":0,"(anonymous 6):141":0,"}:144":0,"(anonymous 7):176":0,"}:192":0,"(anonymous 8):225":0,"}:231":0,"expand:270":0,"maxOffset:297":0,"expandEnd:289":0,"expandStart:343":0,"(anonymous 9):383":0,"}:385":0,"(anonymous 10):397":0,"}:401":0,"(anonymous 11):415":0,"}:417":0,"isEquivalent:430":0,"isInsideNode:444":0,"(anonymous 12):469":0,"}:471":0,"(anonymous 13):485":0,"}:488":0,"(anonymous 14):503":0,"}:506":0,"shrink:576":0,"(anonymous 15):639":0,"shrinkEnd:595":0,"(anonymous 16):719":0,"shrinkStart:675":0,"(anonymous 17):769":0,"}:785":0,"(anonymous 18):818":0,"}:824":0,"(anonymous 19):834":0,"}:839":0,"(anonymous 20):849":0,"}:851":0,"traverseDOMNode:911":0,"traverse:891":0,"(anonymous 21):949":0,"}:972":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredLines = 198;
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredFunctions = 51;
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "expand", 270);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 271);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "expandEnd", 289);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 290);
var endNode = this.endNode(),
            endOffset = this.endOffset(),
            stopNode, parentNode;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 294);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 295);
options.stopAt && (stopNode = options.stopAt);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 297);
function maxOffset (node) {
            _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "maxOffset", 297);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 298);
var maxOffset;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 300);
node = node._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 302);
if (TEXT_NODE === node.nodeType) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 303);
maxOffset = node.length;
            } else {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 305);
maxOffset = node.childNodes.length;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 308);
return maxOffset;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 311);
if ('string' === typeof stopNode || 'function' === typeof stopNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 312);
stopNode = endNode.ancestor(stopNode, true);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 314);
stopNode = Y.one(stopNode);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 317);
while (endNode !== stopNode && maxOffset(endNode) === endOffset) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 318);
parentNode = endNode.get('parentNode');

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 320);
endOffset = parentNode.get('childNodes').indexOf(endNode) + 1;
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 321);
endNode = parentNode;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 324);
this.endNode(endNode, endOffset);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 326);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "expandStart", 343);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 344);
var startNode = this.startNode(),
            startOffset = this.startOffset(),
            stopNode, parentNode;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 348);
options || (options = {});
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 349);
options.stopAt && (stopNode = options.stopAt);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 351);
if ('string' === typeof stopNode || 'function' === typeof stopNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 352);
stopNode = startNode.ancestor(stopNode, true);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 354);
stopNode = Y.one(stopNode);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 357);
while (startNode !== stopNode && 0 === startOffset) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 358);
parentNode = startNode.get('parentNode');

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 360);
startOffset = parentNode.get('childNodes').indexOf(startNode);
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 361);
startNode = parentNode;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 364);
this.startNode(startNode, startOffset);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 366);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 9)", 383);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 384);
return Y.one(this._range.extractContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 385);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 386);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 10)", 397);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 398);
node = Y.one(node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 399);
this._range.insertNode(node._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 400);
return node;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 401);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 402);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 11)", 415);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 416);
return this._range.collapsed;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 417);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 418);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isEquivalent", 430);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 431);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isInsideNode", 444);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 445);
var el       = Y.one(node)._node,
            parentEl = this.parentNode()._node;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 448);
if (el === parentEl) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 449);
return true;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 452);
while (parentEl = parentEl.parentNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 453);
if (el === parentEl) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 454);
return true;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 458);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 12)", 469);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 470);
return Y.one(this._range.commonAncestorContainer);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 471);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 472);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 13)", 485);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 486);
this._range.selectNode(Y.one(node)._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 487);
return this;
    } : function (node) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 488);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 489);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 14)", 503);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 504);
this._range.selectNodeContents(Y.one(node)._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 505);
return this;
    } : function (node) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 506);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 507);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrink", 576);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 577);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrinkEnd", 595);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 596);
var trim = options && options.trim;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 598);
if (!this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 599);
var initialEndNode = this.endNode(),
                endNode = initialEndNode,
                endOffset = this.endOffset(),
                endType = endNode.get('nodeType'),
                endText, endTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 608);
if (TEXT_NODE === endType) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 609);
endText = endNode.get('text');
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 610);
endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 612);
if (!endOffset || endTrim) {
                    // If there is no endOffset, the previousSibling contains
                    // the the selected text
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 615);
var sibling;

                    // The endNode might be a child of a sibling node, so
                    // walk up the DOM to find the right node
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 619);
while (!(sibling = endNode.get('previousSibling'))) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 620);
endNode = endNode.get('parentNode');
                    }

                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 623);
endNode = sibling;
                } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 624);
if (!trim) {
                    // have the correct textNode and not trimming it
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 626);
return this;
                }}
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 628);
if (endOffset) {
                // the endOffset references a childNode
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 630);
endNode = endNode.get('childNodes').item(endOffset - 1);
            }}

            // at this point endNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // last textNode child
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 636);
if (ELEMENT_NODE === endNode.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 637);
this.endNode(endNode, endNode.get('childNodes').size());

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 639);
this.traverse(function (node) {
                    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 15)", 639);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 640);
if (TEXT_NODE === node.get('nodeType')) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 641);
endNode = node;
                    }
                });
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 646);
if (initialEndNode !== endNode) {
                // a different node than we started with. reset the offset
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 648);
endOffset = endNode.get('text').length;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 651);
endText = endNode.get('text').substring(0, endOffset);
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 652);
endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 654);
this.endNode(endNode, endOffset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 657);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrinkStart", 675);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 676);
var trim = options && options.trim;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 678);
if (!this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 679);
var initialStartNode = this.startNode(),
                startNode = initialStartNode,
                startOffset = this.startOffset(),
                startType = startNode.get('nodeType'),
                startText, startTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 688);
if (TEXT_NODE === startType) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 689);
startText = startNode.get('text');
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 690);
startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 692);
if (startText.length === startOffset || startTrim) {
                    // startOffset is at the end of the startContainer.
                    // nextSibling contains the selected text
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 695);
var sibling;

                    // The startNode might be a child of a sibling node, so
                    // walk up the DOM to find the right node
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 699);
while (!(sibling = startNode.get('nextSibling'))) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 700);
startNode = startNode.get('parentNode');
                    }

                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 703);
startNode = sibling;
                } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 704);
if (!trim) {
                    // have the correct textNode and not trimming it
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 706);
return this;
                }}
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 708);
if (startOffset) {
                // the startOffset references a childNode
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 710);
startNode = startNode.get('childNodes').item(startOffset - 1);
            }}

            // at this point startNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // first textNode child, stopping traversal when found
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 716);
if (ELEMENT_NODE === startNode.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 717);
this.startNode(startNode);

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 719);
this.traverse(function (node) {
                    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 16)", 719);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 720);
if (TEXT_NODE === node.get('nodeType')) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 721);
startNode = node;
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 722);
return true; // stops traversal
                    }
                });
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 727);
if (initialStartNode !== startNode) {
                // a different node than we started with. reset the offset
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 729);
startOffset = 0;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 732);
startText = startNode.get('text').substring(startOffset);
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 733);
startOffset += trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 735);
this.startNode(startNode, startOffset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 738);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 17)", 769);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 770);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 771);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 773);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 775);
if (typeof offset === 'number') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 776);
this._range.setStart(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 777);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 778);
this._range.setStartBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 779);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 780);
this._range.setStartAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 784);
return Y.one(this._range.startContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 785);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 786);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 18)", 818);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 819);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 820);
this.startNode(this._range.startContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 823);
return this._range.startOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 824);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 825);
throw new Error('Not yet implemented.');
    },

    /**
    Returns the HTML content of this range.

    @method toHTML
    @return {HTML} HTML content of this range.
    **/
    toHTML: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 19)", 834);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 835);
var div = doc.createElement('div');
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 836);
div.appendChild(this._range.cloneContents());

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 838);
return div.innerHTML;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 839);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 840);
return this._range.htmlText;
    },

    /**
    Returns the plain text content of this range.

    @method toString
    @return {String} Plain text content of this range.
    **/
    toString: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 20)", 849);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 850);
return this._range.toString();
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 851);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 852);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverse", 891);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 892);
if (this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 893);
return this;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 896);
var container = this.parentNode()._node,
            end       = this.endNode()._node,
            endOffset = this.endOffset();

        // If there's a positive offset and the end node has children, we need
        // to take the offset into account when traversing. Otherwise we can
        // ignore it.
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 903);
if (endOffset && end.childNodes.length) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 904);
end = end.childNodes[endOffset - 1];

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 906);
while (end.lastChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 907);
end = end.lastChild;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 911);
function traverseDOMNode(domNode) {
            _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverseDOMNode", 911);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 912);
var stop = callback.call(thisObj, Y.one(domNode));

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 914);
if (stop || domNode === end) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 915);
return;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 918);
if (domNode.firstChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 919);
traverseDOMNode(domNode.firstChild);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 920);
if (domNode.nextSibling) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 921);
traverseDOMNode(domNode.nextSibling);
            } else {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 923);
var node = domNode;

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 925);
while (node = node.parentNode) {
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 926);
if (node !== container && node.nextSibling) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 927);
traverseDOMNode(node.nextSibling);
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 928);
break;
                    }
                }
            }}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 934);
traverseDOMNode(this.startNode()._node);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 936);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 21)", 949);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 959);
var contents  = this._range.extractContents(),
            container = Y.DOM.create(html); // TODO: handle fragments?

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 962);
container.appendChild(contents);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 963);
this._range.insertNode(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 965);
if (options && options.includeWrapper) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 966);
this._range.selectNode(container);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 968);
this._range.selectNodeContents(container);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 971);
return Y.one(container);
    } : function (html) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 972);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 973);
throw new Error('Not yet implemented.');
    }
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 977);
Y.Range = Range;


}, '@VERSION@', {"requires": ["node-base"]});
