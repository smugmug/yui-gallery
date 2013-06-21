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
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].code=["YUI.add('gallery-sm-range', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","// Fun fact! The YUI Gallery currently doesn't support conditional loading of","// modules based on feature detection like YUI core does, so that's why all the","// legacy compat code is baked in here instead of in a separate conditionally","// loaded module.","","/**","Provides the `Range` class, which normalizes Range behavior across browsers.","","@module gallery-sm-selection","@submodule gallery-sm-range","**/","","/**","Provides a friendly cross-browser Range API similar to the API defined in the","DOM Range specification.","","@class Range","@param {window.Range} [range] Native Range object to wrap. If not provided, a","    new Range will be created.","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.Range && doc.createRange),","","    ELEMENT_NODE = 1,","    TEXT_NODE = 3;","","var Range = isHTML5 ? function (range) {","    this._range = range || doc.createRange();","} : function (range) {","    this._range = range || doc.body.createTextRange();","};","","Range.prototype = {","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns a new Range object with the same boundary points as this range.","","    The returned Range is a copy, not a reference, so modifying it will not","    affect this range (and vice versa).","","    @method clone","    @return {Range} New Range object with the same boundary points as this","        range.","    **/","    clone: isHTML5 ? function () {","        return new Y.Range(this._range.cloneRange());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns a Node instance containing a document fragment with a copy of this","    range's contents.","","    Event listeners are not copied.","","    Element ids _are_ copied. This could lead to duplicate ids, so be careful.","","    Partially selected nodes will include parent tags to ensure that the","    fragment is valid.","","    @method cloneContents","    @return {Node} Node instance containing a document fragment with a copy of","        this range's contents.","    **/","    cloneContents: isHTML5 ? function () {","        return Y.one(this._range.cloneContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Collapses this range by setting the start and end points to the same","    position, thus resulting in an empty range.","","    @method collapse","    @param {Object} [options] Options.","        @param {Boolean} [options.toStart=false] If `true`, this range will be","            collapsed by moving the end point to the start point. Otherwise, the","            start point will be moved to the end point.","    @chainable","    **/","    collapse: function (options) {","        this._range.collapse(options && options.toStart);","        return this;","    },","","    /**","    Compares the start or end boundary of this range with the start or end","    boundary of another range.","","    @method compare","    @param {Range} otherRange Range to compare to.","    @param {Object} [options] Options.","","        @param {String} [options.myPoint='start'] Specifies which boundary point","            on this range should be used for the comparison. Valid values are","            'start' to use this range's start point for the comparison, or 'end'","            to use this range's end point.","","        @param {String} [options.otherPoint='start'] Specifies which boundary","            point on _otherRange_ should be used for the comparison. Valid","            values are 'start' to use _otherRange_'s start point for the","            comparison, or 'end' to use _otherRange_'s end point.","","    @return {Number} -1, 0, or 1, indicating whether this range's boundary is","        respectively before, equal to, or after the other range's boundary.","    **/","    compare: isHTML5 ? function (otherRange, options) {","        // Make sure we're working with a native range, not a YUI range.","        if (otherRange._range) {","            otherRange = otherRange._range;","        }","","        var myPoint    = (options && options.myPoint) || 'start',","            otherPoint = (options && options.otherPoint) || 'start';","","        var how = win.Range[otherPoint.toUpperCase() + '_TO_' +","                    myPoint.toUpperCase()];","","        return this._range.compareBoundaryPoints(how, otherRange);","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Removes the contents of this range from the DOM.","","    @method deleteContents","    @chainable","    **/","    deleteContents: isHTML5 ? function () {","        this._range.deleteContents();","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the node that contains the end point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the end point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the end point to be placed immediately before","    _node_ (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    _node_ (not inside it).","","    @method endNode","    @param {HTMLElement|Node|String} [node] Node to set the end point to. May be","        specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current end point will be returned.","    @param {Number|String} [offset=0] Offset position of the new end point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the end point of this range.","    **/","    endNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setEnd(el, offset);","            } else if (offset === 'before') {","                this._range.setEndBefore(el);","            } else if (offset === 'after') {","                this._range.setEndAfter(el);","            }","        }","","        return Y.one(this._range.endContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this selection's end position inside the end","    node.","","    If the end node is a text node, the offset represents a character position.","    If the end node can contain child nodes, then the offset represents a child","    index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the end point to be placed immediately before","    the current end node (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    the current end node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the end node. To","    get the new end node, call `endNode()`.","","    @method endOffset","    @param {Number|String} [offset] Offset position of the new end point","        relative to the current end node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this selection's end position inside the end","        node.","    **/","    endOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.endNode(this._range.endContainer, offset);","        }","","        return this._range.endOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Moves this range's contents into a document fragment and returns a Node","    instance containing that fragment.","","    Event listeners are not retained.","","    If this range splits a non-text element, the resulting fragment will include","    a clone of that element, including its id (if it has one). This could lead","    to duplicate ids, so be careful.","","    @method extractContents","    @return {Node} Node instance containing a document fragment with this","        range's contents.","    **/","    extractContents: isHTML5 ? function () {","        return Y.one(this._range.extractContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Inserts a node at the start of this range.","","    @method insertNode","    @param {HTMLElement|Node|String} node Node instance, HTMLElement, or","        selector string of a node to insert.","    @return {Node} Inserted node.","    **/","    insertNode: isHTML5 ? function (node) {","        node = Y.one(node);","        this._range.insertNode(node._node);","        return node;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range is collapsed, `false` otherwise.","","    A `true` value means that the start and end points are the same and the","    range is empty, whereas a `false` value means that the start and end points","    are different and the range is not empty.","","    @method isCollapsed","    @return {Boolean} `true` if this range is collapsed, `false` otherwise.","    **/","    isCollapsed: isHTML5 ? function () {","        return this._range.collapsed;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range has the same boundaries as _otherRange_,","    `false` otherwise.","","    @method isEquivalent","    @param {Range} otherRange Range to compare this range to.","    @return {Boolean} `true` if this range has the same boundaries as","        _otherRange_, `false` otherwise.","    **/","    isEquivalent: function (otherRange) {","        return otherRange && this.compare(otherRange) === 0 &&","                this.compare(otherRange, {myPoint: 'end', otherPoint: 'end'}) === 0;","    },","","    /**","    Returns `true` if this range is entirely contained within the given _node_.","","    @method isInsideNode","    @param {HTMLElement|Node|String} node Node instance, HTML element, or","        selector string of the container.","    @return {Boolean} `true` if this range is entirely contained within the","        given _node_, `false` otherwise.","    **/","    isInsideNode: function (node) {","        var el       = Y.one(node)._node,","            parentEl = this.parentNode()._node;","","        if (el === parentEl) {","            return true;","        }","","        while (parentEl = parentEl.parentNode) {","            if (el === parentEl) {","                return true;","            }","        }","","        return false;","    },","","    /**","    Returns the nearest common ancestor node that fully contains all nodes","    within this range.","","    @method parentNode","    @return {Node} Nearest common ancestor node that fully contains all nodes","        within this range.","    **/","    parentNode: isHTML5 ? function () {","        return Y.one(this._range.commonAncestorContainer);","    } : function () {","        return Y.one(this._range.parentElement());","    },","","    /**","    Shrinks the start and end containers of the range to just the text nodes","    containing the selected text.","","    Useful for normalizing a range after double clicking to select since the","    range start/end containers vary by browser as explained below:","","    Chrome and IE use the first text node that contains the selected text","    as the startContainer with an offset to exclude any leading whitespace.","","    Firefox will use a text node *before* the selected text","    as the startContainer, with a positive offset set to the end","    of the node. If there is no previous sibling of the selected text","    or the previous sibling is not a text node, the behavior is the","    same as Chrome/IE.","","    Chrome uses the last text node that contains the selected text as the","    endContainer, with an offset to exclude trailing whitespace.","","    Firefox follows the mostly the same rules for the endContainer","    as it does for the startContainer. Any sibling text node","    *after* the selected text will be used as the endContainer,","    but with a 0 offset. If there is no next sibling or the next sibling","    is not a text node, the endContainer will be the same as the","    startContainer, with an offset to exclude any trailing whitespace.","","    IE will aways use a following text node as the endContainer,","    even if it is a child of a sibling. The offset will *include all*","    leading whitespace. If there is no following text node,","    the endContainer will be the same as the startContainer, with an","    offset to *include all* trailing whitespace.","","    Examples:","        [] = startContainer, {} = endContainer, s:e = start/end offset","","    given the HTML","        Lorem <b>Ipsum</b> Dolor Sit","","    dbl clicking to select the text `Lorem`","        Chrome:  `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5","        Firefox: `[{Lorem }]<b>Ipsum</b> Dolor Sit`  s0:e5","        IE:      `[Lorem ]<b>{Ipsum}</b> Dolor Sit`  s0:e0","","    dbl clicking to select the text `Ipsum`","        Chrome:  `Lorem <b>[{Ipsum}]</b> Dolor Sit`  s0:e5","        Firefox: `[Lorem ]<b>Ipsum</b>{ Dolor Sit}`  s6:e0","        IE:      `Lorem <b>[Ipsum]</b>{ Dolor Sit}`  s0:e1","","    dbl clicking to select the text `Dolor`","        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6","        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e6","        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s1:e7","","    dbl clicking to select the text `Sit`","        Chrome:  `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","        Firefox: `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","        IE:      `Lorem <b>Ipsum</b>[{ Dolor Sit}]`  s7:e10","","    @method shrink","    @param {Boolean} [trim] Ignore and trim whitespace","    @chainable","    **/","    shrink: function(trim) {","        return this.shrinkStart(trim).shrinkEnd(trim);","    },","","    /**","    Shrinks the endContainer of the range to just the text node containing","    the selected text.","","    Browsers are inconsistent in how they define a range, sometimes using","    offsets of sibling or parent nodes instead of the actual text node","    containing the selected text.","","    @method shrinkEnd","    @param {Boolean} [trim] Ignore and trim trailing whitespace","    @chainable","    **/","    shrinkEnd: function(trim) {","        if (!this.isCollapsed()) {","            var endNode = this.endNode(),","                endOffset = this.endOffset(),","                endType = endNode.get('nodeType'),","                endText, endTrim;","","            // Note: Check for explicit node types since empty element nodes","            // will return falsy for assertions on firstChild, lastChild etc.","","            if (TEXT_NODE === endType) {","                endText = endNode.get('text');","                endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));","","                // If there is no endOffset, the previousSibling contains","                // the the selected text","                if (!endOffset || endTrim) {","                    // IE will put the endNode in a child of a sibling node, so use the","                    // startNode if the current endNode doesn't have a previous sibling","                    endNode = endNode.get('previousSibling') || this.startNode();","                } else if (!trim) {","                    // have the correct textNode and not trimming it","                    return this;","                }","            } else if (endOffset) {","                // the endOffset references a childNode","                endNode = endNode.get('childNodes').item(endOffset - 1);","            }","","            // at this point endNode could be an element node or a text node","            // if it is still an element node, traverse to find the","            // last textNode child","            if (ELEMENT_NODE === endNode.get('nodeType')) {","                this.endNode(endNode, endNode.get('childNodes').size());","","                this.traverse(function(node) {","                    if (TEXT_NODE === node.get('nodeType')) {","                        endNode = node;","                    }","                });","            }","","            endText = endNode.get('text');","            endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;","","            this.endNode(endNode, endOffset);","        }","","        return this;","    },","","    /**","    Shrinks the startContainer of the range to just the text node containing","    the selected text.","","    Browsers are inconsistent in how they define a range, sometimes using","    offsets of sibling or parent nodes instead of the actual text node","    containing the selected text.","","    @method shrinkStart","    @param {Boolean} [trim] Ignore and trim leading whitespace","    @chainable","    **/","    shrinkStart: function(trim) {","        if (!this.isCollapsed()) {","            var startNode = this.startNode(),","                startOffset = this.startOffset(),","                startType = startNode.get('nodeType'),","                startText, startTrim;","","            // Note: Check for explicit node types since empty element nodes","            // will return falsy for assertions on firstChild, lastChild etc.","","            if (TEXT_NODE === startType) {","                // text node, might be an empty selection in a sibling node","                startText = startNode.get('text');","                startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));","","                if (startText.length === startOffset || startTrim) {","                    // startOffset is at the end of the startContainer.","                    // nextSibling contains the selected text","                    startNode = startNode.get('nextSibling');","                } else if (!trim) {","                    // have the correct textNode and not trimming it","                    return this;","                }","            } else if (startOffset) {","                // the startOffset references a childNode","                startNode = startNode.get('childNodes').item(startOffset - 1);","            }","","            // at this point startNode could be an element node or a text node","            // if it is still an element node, traverse to find the","            // first textNode child, stopping traversal when found","            if (ELEMENT_NODE === startNode.get('nodeType')) {","                this.startNode(startNode);","","                this.traverse(function(node) {","                    if (TEXT_NODE === node.get('nodeType')) {","                        startNode = node;","                        return true; // stops traversal","                    }","                });","            }","","            startText = startNode.get('text');","            startOffset = trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;","","            this.startNode(startNode, startOffset);","        }","","        return this;","    },","","    /**","    Gets or sets the node that contains the start point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the start point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the start point to be placed immediately","    before _node_ (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    _node_ (not inside it).","","    @method startNode","    @param {HTMLElement|Node|String} [node] Node to set the start point to. May","        be specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current start point will be returned.","    @param {Number|String} [offset=0] Offset position of the new start point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the start point of this range.","    **/","    startNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setStart(el, offset);","            } else if (offset === 'before') {","                this._range.setStartBefore(el);","            } else if (offset === 'after') {","                this._range.setStartAfter(el);","            }","        }","","        return Y.one(this._range.startContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this range's start position inside the start","    node.","","    If the start node is a text node, the offset represents a character","    position. If the start node can contain child nodes, then the offset","    represents a child index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the start point to be placed immediately","    before the current start node (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    the current start node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the start node.","    To get the new start node, call `startNode()`.","","    @method startOffset","    @param {Number|String} [offset] Offset position of the new start point","        relative to the current start node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this range's start position inside the start","        node.","    **/","    startOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.startNode(this._range.startContainer, offset);","        }","","        return this._range.startOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the HTML content of this range.","","    @method toHTML","    @return {HTML} HTML content of this range.","    **/","    toHTML: isHTML5 ? function () {","        var div = doc.createElement('div');","        div.appendChild(this._range.cloneContents());","","        return div.innerHTML;","    } : function () {","        return this._range.htmlText;","    },","","    /**","    Returns the plain text content of this range.","","    @method toString","    @return {String} Plain text content of this range.","    **/","    toString: isHTML5 ? function () {","        return this._range.toString();","    } : function () {","        return this._range.text;","    },","","    /**","    Traverses the contents of the range, passing each node and its children to","    the supplied callback in document order.","","    For example, if the range includes the following HTML...","","        lorem ipsum <b>dolor <i>sit</i></b> amet","","    ...then this `traverse()` call...","","        range.traverse(function (node) {","            console.log(Y.Node.getDOMNode(node));","        });","","    ...would result in the following console output:","","        \"lorem ipsum \"","        <b> element","        \"dolor \"","        <i> element","        \"sit\"","        \" amet\"","","    The entire start and end node will be included even if the range only","    includes a portion of them. Use the `startOffset()` and `endOffset()`","    methods to determine where the precise boundaries are if necessary.","","    Returning `true` from the callback function will stop traversal","","    @method traverse","    @param {Function} callback Callback function.","        @param {Node} callback.node Node instance.","    @param {Object} [thisObj] `this` object to use when calling the callback","        function.","    @chainable","    **/","    traverse: function (callback, thisObj) {","        if (this.isCollapsed()) {","            return this;","        }","","        var container = this.parentNode()._node,","            end       = this.endNode()._node,","            endOffset = this.endOffset();","","        // If there's a positive offset and the end node has children, we need","        // to take the offset into account when traversing. Otherwise we can","        // ignore it.","        if (endOffset && end.childNodes.length) {","            end = end.childNodes[endOffset - 1];","","            while (end.lastChild) {","                end = end.lastChild;","            }","        }","","        function traverseDOMNode(domNode) {","            var stop = callback.call(thisObj, Y.one(domNode));","","            if (stop || domNode === end) {","                return;","            }","","            if (domNode.firstChild) {","                traverseDOMNode(domNode.firstChild);","            } else if (domNode.nextSibling) {","                traverseDOMNode(domNode.nextSibling);","            } else {","                var node = domNode;","","                while (node = node.parentNode) {","                    if (node !== container && node.nextSibling) {","                        traverseDOMNode(node.nextSibling);","                        break;","                    }","                }","            }","        }","","        traverseDOMNode(this.startNode()._node);","","        return this;","    },","","    /**","    Wraps this range in the specified HTML and returns the new wrapper node.","","    @method wrap","    @param {HTML} html HTML string.","    @param {Object} [options] Options.","        @param {Boolean} [options.includeWrapper=false] If `true`, this range","            will be updated to include the new wrapper node.","    @return {Node} New wrapper node.","    **/","    wrap: isHTML5 ? function (html, options) {","        // We have to manually extract the range's contents and append them to","        // the wrapper instead of just using Range#surroundContents(), because","        // surroundContents() will throw an exception if one of the Range's","        // boundary points splits a non-text node.","        //","        // It's puzzling that this is part of the Range spec, because the error","        // doesn't do anyone any good, and extractContents() (which is used","        // internally by surroundContents()) already requires the browser to","        // implement node splitting anyway. But whatevs.","        var contents  = this._range.extractContents(),","            container = Y.DOM.create(html); // TODO: handle fragments?","","        container.appendChild(contents);","        this._range.insertNode(container);","","        if (options && options.includeWrapper) {","            this._range.selectNode(container);","        } else {","            this._range.selectNodeContents(container);","        }","","        return Y.one(container);","    } : function (html) {","        throw new Error('Not yet implemented.');","    }","};","","Y.Range = Range;","","","}, '@VERSION@', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].lines = {"1":0,"27":0,"35":0,"36":0,"38":0,"41":0,"55":0,"57":0,"76":0,"78":0,"93":0,"94":0,"120":0,"121":0,"124":0,"127":0,"130":0,"132":0,"142":0,"143":0,"145":0,"177":0,"178":0,"180":0,"182":0,"183":0,"184":0,"185":0,"186":0,"187":0,"191":0,"193":0,"226":0,"227":0,"230":0,"232":0,"250":0,"252":0,"264":0,"265":0,"266":0,"268":0,"282":0,"284":0,"297":0,"311":0,"314":0,"315":0,"318":0,"319":0,"320":0,"324":0,"336":0,"338":0,"404":0,"420":0,"421":0,"429":0,"430":0,"431":0,"435":0,"438":0,"439":0,"441":0,"443":0,"445":0,"451":0,"452":0,"454":0,"455":0,"456":0,"461":0,"462":0,"464":0,"467":0,"483":0,"484":0,"492":0,"494":0,"495":0,"497":0,"500":0,"501":0,"503":0,"505":0,"507":0,"513":0,"514":0,"516":0,"517":0,"518":0,"519":0,"524":0,"525":0,"527":0,"530":0,"562":0,"563":0,"565":0,"567":0,"568":0,"569":0,"570":0,"571":0,"572":0,"576":0,"578":0,"611":0,"612":0,"615":0,"617":0,"627":0,"628":0,"630":0,"632":0,"642":0,"644":0,"684":0,"685":0,"688":0,"695":0,"696":0,"698":0,"699":0,"703":0,"704":0,"706":0,"707":0,"710":0,"711":0,"712":0,"713":0,"715":0,"717":0,"718":0,"719":0,"720":0,"726":0,"728":0,"751":0,"754":0,"755":0,"757":0,"758":0,"760":0,"763":0,"765":0,"769":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].functions = {"(anonymous 2):35":0,"}:37":0,"(anonymous 3):54":0,"}:56":0,"(anonymous 4):75":0,"}:77":0,"collapse:92":0,"(anonymous 5):118":0,"}:131":0,"(anonymous 6):141":0,"}:144":0,"(anonymous 7):176":0,"}:192":0,"(anonymous 8):225":0,"}:231":0,"(anonymous 9):249":0,"}:251":0,"(anonymous 10):263":0,"}:267":0,"(anonymous 11):281":0,"}:283":0,"isEquivalent:296":0,"isInsideNode:310":0,"(anonymous 12):335":0,"}:337":0,"shrink:403":0,"(anonymous 13):454":0,"shrinkEnd:419":0,"(anonymous 14):516":0,"shrinkStart:482":0,"(anonymous 15):561":0,"}:577":0,"(anonymous 16):610":0,"}:616":0,"(anonymous 17):626":0,"}:631":0,"(anonymous 18):641":0,"}:643":0,"traverseDOMNode:703":0,"traverse:683":0,"(anonymous 19):741":0,"}:764":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredLines = 148;
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredFunctions = 43;
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 9)", 249);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 250);
return Y.one(this._range.extractContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 251);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 252);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 10)", 263);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 264);
node = Y.one(node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 265);
this._range.insertNode(node._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 266);
return node;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 267);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 268);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 11)", 281);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 282);
return this._range.collapsed;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 283);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 284);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isEquivalent", 296);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 297);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isInsideNode", 310);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 311);
var el       = Y.one(node)._node,
            parentEl = this.parentNode()._node;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 314);
if (el === parentEl) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 315);
return true;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 318);
while (parentEl = parentEl.parentNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 319);
if (el === parentEl) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 320);
return true;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 324);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 12)", 335);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 336);
return Y.one(this._range.commonAncestorContainer);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 337);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 338);
return Y.one(this._range.parentElement());
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
    @param {Boolean} [trim] Ignore and trim whitespace
    @chainable
    **/
    shrink: function(trim) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrink", 403);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 404);
return this.shrinkStart(trim).shrinkEnd(trim);
    },

    /**
    Shrinks the endContainer of the range to just the text node containing
    the selected text.

    Browsers are inconsistent in how they define a range, sometimes using
    offsets of sibling or parent nodes instead of the actual text node
    containing the selected text.

    @method shrinkEnd
    @param {Boolean} [trim] Ignore and trim trailing whitespace
    @chainable
    **/
    shrinkEnd: function(trim) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrinkEnd", 419);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 420);
if (!this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 421);
var endNode = this.endNode(),
                endOffset = this.endOffset(),
                endType = endNode.get('nodeType'),
                endText, endTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 429);
if (TEXT_NODE === endType) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 430);
endText = endNode.get('text');
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 431);
endTrim = trim && '' === Y.Lang.trim(endText.substring(0, endOffset));

                // If there is no endOffset, the previousSibling contains
                // the the selected text
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 435);
if (!endOffset || endTrim) {
                    // IE will put the endNode in a child of a sibling node, so use the
                    // startNode if the current endNode doesn't have a previous sibling
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 438);
endNode = endNode.get('previousSibling') || this.startNode();
                } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 439);
if (!trim) {
                    // have the correct textNode and not trimming it
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 441);
return this;
                }}
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 443);
if (endOffset) {
                // the endOffset references a childNode
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 445);
endNode = endNode.get('childNodes').item(endOffset - 1);
            }}

            // at this point endNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // last textNode child
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 451);
if (ELEMENT_NODE === endNode.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 452);
this.endNode(endNode, endNode.get('childNodes').size());

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 454);
this.traverse(function(node) {
                    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 13)", 454);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 455);
if (TEXT_NODE === node.get('nodeType')) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 456);
endNode = node;
                    }
                });
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 461);
endText = endNode.get('text');
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 462);
endOffset = (trim ? Y.Lang.trimRight(endText) : endText).length;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 464);
this.endNode(endNode, endOffset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 467);
return this;
    },

    /**
    Shrinks the startContainer of the range to just the text node containing
    the selected text.

    Browsers are inconsistent in how they define a range, sometimes using
    offsets of sibling or parent nodes instead of the actual text node
    containing the selected text.

    @method shrinkStart
    @param {Boolean} [trim] Ignore and trim leading whitespace
    @chainable
    **/
    shrinkStart: function(trim) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "shrinkStart", 482);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 483);
if (!this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 484);
var startNode = this.startNode(),
                startOffset = this.startOffset(),
                startType = startNode.get('nodeType'),
                startText, startTrim;

            // Note: Check for explicit node types since empty element nodes
            // will return falsy for assertions on firstChild, lastChild etc.

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 492);
if (TEXT_NODE === startType) {
                // text node, might be an empty selection in a sibling node
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 494);
startText = startNode.get('text');
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 495);
startTrim = trim && '' === Y.Lang.trim(startText.substring(startOffset));

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 497);
if (startText.length === startOffset || startTrim) {
                    // startOffset is at the end of the startContainer.
                    // nextSibling contains the selected text
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 500);
startNode = startNode.get('nextSibling');
                } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 501);
if (!trim) {
                    // have the correct textNode and not trimming it
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 503);
return this;
                }}
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 505);
if (startOffset) {
                // the startOffset references a childNode
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 507);
startNode = startNode.get('childNodes').item(startOffset - 1);
            }}

            // at this point startNode could be an element node or a text node
            // if it is still an element node, traverse to find the
            // first textNode child, stopping traversal when found
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 513);
if (ELEMENT_NODE === startNode.get('nodeType')) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 514);
this.startNode(startNode);

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 516);
this.traverse(function(node) {
                    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 14)", 516);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 517);
if (TEXT_NODE === node.get('nodeType')) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 518);
startNode = node;
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 519);
return true; // stops traversal
                    }
                });
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 524);
startText = startNode.get('text');
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 525);
startOffset = trim ? startText.indexOf(Y.Lang.trimLeft(startText)) : 0;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 527);
this.startNode(startNode, startOffset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 530);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 15)", 561);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 562);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 563);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 565);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 567);
if (typeof offset === 'number') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 568);
this._range.setStart(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 569);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 570);
this._range.setStartBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 571);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 572);
this._range.setStartAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 576);
return Y.one(this._range.startContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 577);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 578);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 16)", 610);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 611);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 612);
this.startNode(this._range.startContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 615);
return this._range.startOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 616);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 617);
throw new Error('Not yet implemented.');
    },

    /**
    Returns the HTML content of this range.

    @method toHTML
    @return {HTML} HTML content of this range.
    **/
    toHTML: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 17)", 626);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 627);
var div = doc.createElement('div');
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 628);
div.appendChild(this._range.cloneContents());

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 630);
return div.innerHTML;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 631);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 632);
return this._range.htmlText;
    },

    /**
    Returns the plain text content of this range.

    @method toString
    @return {String} Plain text content of this range.
    **/
    toString: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 18)", 641);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 642);
return this._range.toString();
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 643);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 644);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverse", 683);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 684);
if (this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 685);
return this;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 688);
var container = this.parentNode()._node,
            end       = this.endNode()._node,
            endOffset = this.endOffset();

        // If there's a positive offset and the end node has children, we need
        // to take the offset into account when traversing. Otherwise we can
        // ignore it.
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 695);
if (endOffset && end.childNodes.length) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 696);
end = end.childNodes[endOffset - 1];

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 698);
while (end.lastChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 699);
end = end.lastChild;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 703);
function traverseDOMNode(domNode) {
            _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverseDOMNode", 703);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 704);
var stop = callback.call(thisObj, Y.one(domNode));

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 706);
if (stop || domNode === end) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 707);
return;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 710);
if (domNode.firstChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 711);
traverseDOMNode(domNode.firstChild);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 712);
if (domNode.nextSibling) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 713);
traverseDOMNode(domNode.nextSibling);
            } else {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 715);
var node = domNode;

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 717);
while (node = node.parentNode) {
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 718);
if (node !== container && node.nextSibling) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 719);
traverseDOMNode(node.nextSibling);
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 720);
break;
                    }
                }
            }}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 726);
traverseDOMNode(this.startNode()._node);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 728);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 19)", 741);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 751);
var contents  = this._range.extractContents(),
            container = Y.DOM.create(html); // TODO: handle fragments?

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 754);
container.appendChild(contents);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 755);
this._range.insertNode(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 757);
if (options && options.includeWrapper) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 758);
this._range.selectNode(container);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 760);
this._range.selectNodeContents(container);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 763);
return Y.one(container);
    } : function (html) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 764);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 765);
throw new Error('Not yet implemented.');
    }
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 769);
Y.Range = Range;


}, '@VERSION@', {"requires": ["node-base"]});
