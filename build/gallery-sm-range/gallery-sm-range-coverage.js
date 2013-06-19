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
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].code=["YUI.add('gallery-sm-range', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","// Fun fact! The YUI Gallery currently doesn't support conditional loading of","// modules based on feature detection like YUI core does, so that's why all the","// legacy compat code is baked in here instead of in a separate conditionally","// loaded module.","","/**","Provides the `Range` class, which normalizes Range behavior across browsers.","","@module gallery-sm-selection","@submodule gallery-sm-range","**/","","/**","Provides a friendly cross-browser Range API similar to the API defined in the","DOM Range specification.","","@class Range","@param {window.Range} [range] Native Range object to wrap. If not provided, a","    new Range will be created.","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.Range && doc.createRange);","","var Range = isHTML5 ? function (range) {","    this._range = range || doc.createRange();","} : function (range) {","    this._range = range || doc.body.createTextRange();","};","","Range.prototype = {","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns a new Range object with the same boundary points as this range.","","    The returned Range is a copy, not a reference, so modifying it will not","    affect this range (and vice versa).","","    @method clone","    @return {Range} New Range object with the same boundary points as this","        range.","    **/","    clone: isHTML5 ? function () {","        return new Y.Range(this._range.cloneRange());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns a Node instance containing a document fragment with a copy of this","    range's contents.","","    Event listeners are not copied.","","    Element ids _are_ copied. This could lead to duplicate ids, so be careful.","","    Partially selected nodes will include parent tags to ensure that the","    fragment is valid.","","    @method cloneContents","    @return {Node} Node instance containing a document fragment with a copy of","        this range's contents.","    **/","    cloneContents: isHTML5 ? function () {","        return Y.one(this._range.cloneContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Collapses this range by setting the start and end points to the same","    position, thus resulting in an empty range.","","    @method collapse","    @param {Object} [options] Options.","        @param {Boolean} [options.toStart=false] If `true`, this range will be","            collapsed by moving the end point to the start point. Otherwise, the","            start point will be moved to the end point.","    @chainable","    **/","    collapse: function (options) {","        this._range.collapse(options && options.toStart);","        return this;","    },","","    /**","    Compares the start or end boundary of this range with the start or end","    boundary of another range.","","    @method compare","    @param {Range} otherRange Range to compare to.","    @param {Object} [options] Options.","","        @param {String} [options.myPoint='start'] Specifies which boundary point","            on this range should be used for the comparison. Valid values are","            'start' to use this range's start point for the comparison, or 'end'","            to use this range's end point.","","        @param {String} [options.otherPoint='start'] Specifies which boundary","            point on _otherRange_ should be used for the comparison. Valid","            values are 'start' to use _otherRange_'s start point for the","            comparison, or 'end' to use _otherRange_'s end point.","","    @return {Number} -1, 0, or 1, indicating whether this range's boundary is","        respectively before, equal to, or after the other range's boundary.","    **/","    compare: isHTML5 ? function (otherRange, options) {","        // Make sure we're working with a native range, not a YUI range.","        if (otherRange._range) {","            otherRange = otherRange._range;","        }","","        var myPoint    = (options && options.myPoint) || 'start',","            otherPoint = (options && options.otherPoint) || 'start';","","        var how = win.Range[otherPoint.toUpperCase() + '_TO_' +","                    myPoint.toUpperCase()];","","        return this._range.compareBoundaryPoints(how, otherRange);","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Removes the contents of this range from the DOM.","","    @method deleteContents","    @chainable","    **/","    deleteContents: isHTML5 ? function () {","        this._range.deleteContents();","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the node that contains the end point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the end point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the end point to be placed immediately before","    _node_ (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    _node_ (not inside it).","","    @method endNode","    @param {HTMLElement|Node|String} [node] Node to set the end point to. May be","        specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current end point will be returned.","    @param {Number|String} [offset=0] Offset position of the new end point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the end point of this range.","    **/","    endNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setEnd(el, offset);","            } else if (offset === 'before') {","                this._range.setEndBefore(el);","            } else if (offset === 'after') {","                this._range.setEndAfter(el);","            }","        }","","        return Y.one(this._range.endContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this selection's end position inside the end","    node.","","    If the end node is a text node, the offset represents a character position.","    If the end node can contain child nodes, then the offset represents a child","    index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the end point to be placed immediately before","    the current end node (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    the current end node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the end node. To","    get the new end node, call `endNode()`.","","    @method endOffset","    @param {Number|String} [offset] Offset position of the new end point","        relative to the current end node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this selection's end position inside the end","        node.","    **/","    endOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.endNode(this._range.endContainer, offset);","        }","","        return this._range.endOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Moves this range's contents into a document fragment and returns a Node","    instance containing that fragment.","","    Event listeners are not retained.","","    If this range splits a non-text element, the resulting fragment will include","    a clone of that element, including its id (if it has one). This could lead","    to duplicate ids, so be careful.","","    @method extractContents","    @return {Node} Node instance containing a document fragment with this","        range's contents.","    **/","    extractContents: isHTML5 ? function () {","        return Y.one(this._range.extractContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Inserts a node at the start of this range.","","    @method insertNode","    @param {HTMLElement|Node|String} node Node instance, HTMLElement, or","        selector string of a node to insert.","    @return {Node} Inserted node.","    **/","    insertNode: isHTML5 ? function (node) {","        node = Y.one(node);","        this._range.insertNode(node._node);","        return node;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range is collapsed, `false` otherwise.","","    A `true` value means that the start and end points are the same and the","    range is empty, whereas a `false` value means that the start and end points","    are different and the range is not empty.","","    @method isCollapsed","    @return {Boolean} `true` if this range is collapsed, `false` otherwise.","    **/","    isCollapsed: isHTML5 ? function () {","        return this._range.collapsed;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range has the same boundaries as _otherRange_,","    `false` otherwise.","","    @method isEquivalent","    @param {Range} otherRange Range to compare this range to.","    @return {Boolean} `true` if this range has the same boundaries as","        _otherRange_, `false` otherwise.","    **/","    isEquivalent: function (otherRange) {","        return otherRange && this.compare(otherRange) === 0 &&","                this.compare(otherRange, {myPoint: 'end', otherPoint: 'end'}) === 0;","    },","","    /**","    Returns `true` if this range is entirely contained within the given _node_.","","    @method isInsideNode","    @param {HTMLElement|Node|String} node Node instance, HTML element, or","        selector string of the container.","    @return {Boolean} `true` if this range is entirely contained within the","        given _node_, `false` otherwise.","    **/","    isInsideNode: function (node) {","        var el       = Y.one(node)._node,","            parentEl = this.parentNode()._node;","","        if (el === parentEl) {","            return true;","        }","","        while (parentEl = parentEl.parentNode) {","            if (el === parentEl) {","                return true;","            }","        }","","        return false;","    },","","    /**","    Returns the nearest common ancestor node that fully contains all nodes","    within this range.","","    @method parentNode","    @return {Node} Nearest common ancestor node that fully contains all nodes","        within this range.","    **/","    parentNode: isHTML5 ? function () {","        return Y.one(this._range.commonAncestorContainer);","    } : function () {","        return Y.one(this._range.parentElement());","    },","","    /**","    Gets or sets the node that contains the start point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the start point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the start point to be placed immediately","    before _node_ (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    _node_ (not inside it).","","    @method startNode","    @param {HTMLElement|Node|String} [node] Node to set the start point to. May","        be specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current start point will be returned.","    @param {Number|String} [offset=0] Offset position of the new start point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the start point of this range.","    **/","    startNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === 'number') {","                this._range.setStart(el, offset);","            } else if (offset === 'before') {","                this._range.setStartBefore(el);","            } else if (offset === 'after') {","                this._range.setStartAfter(el);","            }","        }","","        return Y.one(this._range.startContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this range's start position inside the start","    node.","","    If the start node is a text node, the offset represents a character","    position. If the start node can contain child nodes, then the offset","    represents a child index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the start point to be placed immediately","    before the current start node (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    the current start node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the start node.","    To get the new start node, call `startNode()`.","","    @method startOffset","    @param {Number|String} [offset] Offset position of the new start point","        relative to the current start node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this range's start position inside the start","        node.","    **/","    startOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.startNode(this._range.startContainer, offset);","        }","","        return this._range.startOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the HTML content of this range.","","    @method toHTML","    @return {HTML} HTML content of this range.","    **/","    toHTML: isHTML5 ? function () {","        var div = doc.createElement('div');","        div.appendChild(this._range.cloneContents());","","        return div.innerHTML;","    } : function () {","        return this._range.htmlText;","    },","","    /**","    Returns the plain text content of this range.","","    @method toString","    @return {String} Plain text content of this range.","    **/","    toString: isHTML5 ? function () {","        return this._range.toString();","    } : function () {","        return this._range.text;","    },","","    /**","    Traverses the contents of the range, passing each node and its children to","    the supplied callback in document order.","","    For example, if the range includes the following HTML...","","        lorem ipsum <b>dolor <i>sit</i></b> amet","","    ...then this `traverse()` call...","","        range.traverse(function (node) {","            console.log(Y.Node.getDOMNode(node));","        });","","    ...would result in the following console output:","","        \"lorem ipsum \"","        <b> element","        \"dolor \"","        <i> element","        \"sit\"","        \" amet\"","","    The entire start and end node will be included even if the range only","    includes a portion of them. Use the `startOffset()` and `endOffset()`","    methods to determine where the precise boundaries are if necessary.","","    @method traverse","    @param {Function} callback Callback function.","        @param {Node} callback.node Node instance.","    @param {Object} [thisObj] `this` object to use when calling the callback","        function.","    @chainable","    **/","    traverse: function (callback, thisObj) {","        if (this.isCollapsed()) {","            return this;","        }","","        var container = this.parentNode()._node,","            end       = this.endNode()._node,","            endOffset = this.endOffset();","","        // If there's a positive offset and the end node has children, we need","        // to take the offset into account when traversing. Otherwise we can","        // ignore it.","        if (endOffset && end.childNodes.length) {","            end = end.childNodes[endOffset - 1];","","            while (end.childNodes.length) {","                end = end.lastChild;","            }","        }","","        function traverseDOMNode(domNode) {","            callback.call(thisObj, Y.one(domNode));","","            if (domNode === end) {","                return;","            }","","            if (domNode.firstChild) {","                traverseDOMNode(domNode.firstChild);","            } else if (domNode.nextSibling) {","                traverseDOMNode(domNode.nextSibling);","            } else {","                var node = domNode;","","                while (node = node.parentNode) {","                    if (node !== container && node.nextSibling) {","                        traverseDOMNode(node.nextSibling);","                        break;","                    }","                }","            }","        }","","        traverseDOMNode(this.startNode()._node);","","        return this;","    },","","    /**","    Wraps this range in the specified HTML and returns the new wrapper node.","","    @method wrap","    @param {HTML} html HTML string.","    @param {Object} [options] Options.","        @param {Boolean} [options.includeWrapper=false] If `true`, this range","            will be updated to include the new wrapper node.","    @return {Node} New wrapper node.","    **/","    wrap: isHTML5 ? function (html, options) {","        // We have to manually extract the range's contents and append them to","        // the wrapper instead of just using Range#surroundContents(), because","        // surroundContents() will throw an exception if one of the Range's","        // boundary points splits a non-text node.","        //","        // It's puzzling that this is part of the Range spec, because the error","        // doesn't do anyone any good, and extractContents() (which is used","        // internally by surroundContents()) already requires the browser to","        // implement node splitting anyway. But whatevs.","        var contents  = this._range.extractContents(),","            container = Y.DOM.create(html); // TODO: handle fragments?","","        container.appendChild(contents);","        this._range.insertNode(container);","","        if (options && options.includeWrapper) {","            this._range.selectNode(container);","        } else {","            this._range.selectNodeContents(container);","        }","","        return Y.one(container);","    } : function (html) {","        throw new Error('Not yet implemented.');","    }","};","","Y.Range = Range;","","","}, '@VERSION@', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].lines = {"1":0,"27":0,"32":0,"33":0,"35":0,"38":0,"52":0,"54":0,"73":0,"75":0,"90":0,"91":0,"117":0,"118":0,"121":0,"124":0,"127":0,"129":0,"139":0,"140":0,"142":0,"174":0,"175":0,"177":0,"179":0,"180":0,"181":0,"182":0,"183":0,"184":0,"188":0,"190":0,"223":0,"224":0,"227":0,"229":0,"247":0,"249":0,"261":0,"262":0,"263":0,"265":0,"279":0,"281":0,"294":0,"308":0,"311":0,"312":0,"315":0,"316":0,"317":0,"321":0,"333":0,"335":0,"367":0,"368":0,"370":0,"372":0,"373":0,"374":0,"375":0,"376":0,"377":0,"381":0,"383":0,"416":0,"417":0,"420":0,"422":0,"432":0,"433":0,"435":0,"437":0,"447":0,"449":0,"487":0,"488":0,"491":0,"498":0,"499":0,"501":0,"502":0,"506":0,"507":0,"509":0,"510":0,"513":0,"514":0,"515":0,"516":0,"518":0,"520":0,"521":0,"522":0,"523":0,"529":0,"531":0,"554":0,"557":0,"558":0,"560":0,"561":0,"563":0,"566":0,"568":0,"572":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].functions = {"(anonymous 2):32":0,"}:34":0,"(anonymous 3):51":0,"}:53":0,"(anonymous 4):72":0,"}:74":0,"collapse:89":0,"(anonymous 5):115":0,"}:128":0,"(anonymous 6):138":0,"}:141":0,"(anonymous 7):173":0,"}:189":0,"(anonymous 8):222":0,"}:228":0,"(anonymous 9):246":0,"}:248":0,"(anonymous 10):260":0,"}:264":0,"(anonymous 11):278":0,"}:280":0,"isEquivalent:293":0,"isInsideNode:307":0,"(anonymous 12):332":0,"}:334":0,"(anonymous 13):366":0,"}:382":0,"(anonymous 14):415":0,"}:421":0,"(anonymous 15):431":0,"}:436":0,"(anonymous 16):446":0,"}:448":0,"traverseDOMNode:506":0,"traverse:486":0,"(anonymous 17):544":0,"}:567":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredLines = 106;
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredFunctions = 38;
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

    isHTML5 = !!(win && win.Range && doc.createRange);

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 32);
var Range = isHTML5 ? function (range) {
    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 2)", 32);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 33);
this._range = range || doc.createRange();
} : function (range) {
    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 34);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 35);
this._range = range || doc.body.createTextRange();
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 38);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 3)", 51);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 52);
return new Y.Range(this._range.cloneRange());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 53);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 54);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 4)", 72);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 73);
return Y.one(this._range.cloneContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 74);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 75);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "collapse", 89);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 90);
this._range.collapse(options && options.toStart);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 91);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 5)", 115);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 117);
if (otherRange._range) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 118);
otherRange = otherRange._range;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 121);
var myPoint    = (options && options.myPoint) || 'start',
            otherPoint = (options && options.otherPoint) || 'start';

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 124);
var how = win.Range[otherPoint.toUpperCase() + '_TO_' +
                    myPoint.toUpperCase()];

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 127);
return this._range.compareBoundaryPoints(how, otherRange);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 128);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 129);
throw new Error('Not yet implemented.');
    },

    /**
    Removes the contents of this range from the DOM.

    @method deleteContents
    @chainable
    **/
    deleteContents: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 6)", 138);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 139);
this._range.deleteContents();
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 140);
return this;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 141);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 142);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 7)", 173);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 174);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 175);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 177);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 179);
if (typeof offset === 'number') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 180);
this._range.setEnd(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 181);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 182);
this._range.setEndBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 183);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 184);
this._range.setEndAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 188);
return Y.one(this._range.endContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 189);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 190);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 8)", 222);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 223);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 224);
this.endNode(this._range.endContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 227);
return this._range.endOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 228);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 229);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 9)", 246);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 247);
return Y.one(this._range.extractContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 248);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 249);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 10)", 260);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 261);
node = Y.one(node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 262);
this._range.insertNode(node._node);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 263);
return node;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 264);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 265);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 11)", 278);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 279);
return this._range.collapsed;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 280);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 281);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isEquivalent", 293);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 294);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isInsideNode", 307);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 308);
var el       = Y.one(node)._node,
            parentEl = this.parentNode()._node;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 311);
if (el === parentEl) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 312);
return true;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 315);
while (parentEl = parentEl.parentNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 316);
if (el === parentEl) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 317);
return true;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 321);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 12)", 332);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 333);
return Y.one(this._range.commonAncestorContainer);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 334);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 335);
return Y.one(this._range.parentElement());
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 13)", 366);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 367);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 368);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 370);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 372);
if (typeof offset === 'number') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 373);
this._range.setStart(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 374);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 375);
this._range.setStartBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 376);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 377);
this._range.setStartAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 381);
return Y.one(this._range.startContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 382);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 383);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 14)", 415);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 416);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 417);
this.startNode(this._range.startContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 420);
return this._range.startOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 421);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 422);
throw new Error('Not yet implemented.');
    },

    /**
    Returns the HTML content of this range.

    @method toHTML
    @return {HTML} HTML content of this range.
    **/
    toHTML: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 15)", 431);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 432);
var div = doc.createElement('div');
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 433);
div.appendChild(this._range.cloneContents());

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 435);
return div.innerHTML;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 436);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 437);
return this._range.htmlText;
    },

    /**
    Returns the plain text content of this range.

    @method toString
    @return {String} Plain text content of this range.
    **/
    toString: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 16)", 446);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 447);
return this._range.toString();
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 448);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 449);
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

    @method traverse
    @param {Function} callback Callback function.
        @param {Node} callback.node Node instance.
    @param {Object} [thisObj] `this` object to use when calling the callback
        function.
    @chainable
    **/
    traverse: function (callback, thisObj) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverse", 486);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 487);
if (this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 488);
return this;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 491);
var container = this.parentNode()._node,
            end       = this.endNode()._node,
            endOffset = this.endOffset();

        // If there's a positive offset and the end node has children, we need
        // to take the offset into account when traversing. Otherwise we can
        // ignore it.
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 498);
if (endOffset && end.childNodes.length) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 499);
end = end.childNodes[endOffset - 1];

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 501);
while (end.childNodes.length) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 502);
end = end.lastChild;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 506);
function traverseDOMNode(domNode) {
            _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverseDOMNode", 506);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 507);
callback.call(thisObj, Y.one(domNode));

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 509);
if (domNode === end) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 510);
return;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 513);
if (domNode.firstChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 514);
traverseDOMNode(domNode.firstChild);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 515);
if (domNode.nextSibling) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 516);
traverseDOMNode(domNode.nextSibling);
            } else {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 518);
var node = domNode;

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 520);
while (node = node.parentNode) {
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 521);
if (node !== container && node.nextSibling) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 522);
traverseDOMNode(node.nextSibling);
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 523);
break;
                    }
                }
            }}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 529);
traverseDOMNode(this.startNode()._node);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 531);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 17)", 544);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 554);
var contents  = this._range.extractContents(),
            container = Y.DOM.create(html); // TODO: handle fragments?

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 557);
container.appendChild(contents);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 558);
this._range.insertNode(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 560);
if (options && options.includeWrapper) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 561);
this._range.selectNode(container);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 563);
this._range.selectNodeContents(container);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 566);
return Y.one(container);
    } : function (html) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 567);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 568);
throw new Error('Not yet implemented.');
    }
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 572);
Y.Range = Range;


}, '@VERSION@', {"requires": ["node-base"]});
