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
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].code=["YUI.add('gallery-sm-range', function (Y, NAME) {","","/*jshint expr:true, onevar:false */","","// Fun fact! The YUI Gallery currently doesn't support conditional loading of","// modules based on feature detection like YUI core does, so that's why all the","// legacy compat code is baked in here instead of in a separate conditionally","// loaded module.","","/**","Provides the `Range` class, which normalizes Range behavior across browsers.","","@module gallery-sm-selection","@submodule gallery-sm-range","**/","","/**","Provides a friendly cross-browser Range API similar to the API defined in the","DOM Range specification.","","@class Range","@constructor","**/","","var doc = Y.config.doc,","    win = Y.config.win,","","    isHTML5 = !!(win && win.Range && doc.createRange);","","var Range = isHTML5 ? function (range) {","    this._range = range || doc.createRange();","} : function (range) {","    this._range = range || doc.body.createTextRange();","};","","Range.prototype = {","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns a new Range object with the same boundary points as this range.","","    The returned Range is a copy, not a reference, so modifying it will not","    affect this range (and vice versa).","","    @method clone","    @return {Range} New Range object with the same boundary points as this","        range.","    **/","    clone: isHTML5 ? function () {","        return this._range.cloneRange();","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns a Node instance containing a document fragment with a copy of this","    range's contents.","","    Event listeners are not copied.","","    Element ids _are_ copied. This could lead to duplicate ids, so be careful.","","    Partially selected nodes will include parent tags to ensure that the","    fragment is valid.","","    @method cloneContents","    @return {Node} Node instance containing a document fragment with a copy of","        this range's contents.","    **/","    cloneContents: isHTML5 ? function () {","        return Y.one(this._range.cloneContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Collapses this range by setting the start and end points to the same","    position, thus resulting in an empty range.","","    @method collapse","    @param {Object} [options] Options.","        @param {Boolean} [options.toStart=false] If `true`, this range will be","            collapsed by moving the end point to the start point. Otherwise, the","            start point will be moved to the end point.","    @chainable","    **/","    collapse: function (options) {","        this._range.collapse(options && options.toStart);","        return this;","    },","","    /**","    Compares the start or end boundary of this range with the start or end","    boundary of another range.","","    @method compare","    @param {Range} otherRange Range to compare to.","    @param {Object} [options] Options.","","        @param {String} [options.myPoint='start'] Specifies which boundary point","            on this range should be used for the comparison. Valid values are","            'start' to use this range's start point for the comparison, or 'end'","            to use this range's end point.","","        @param {String} [options.otherPoint='start'] Specifies which boundary","            point on _otherRange_ should be used for the comparison. Valid","            values are 'start' to use _otherRange_'s start point for the","            comparison, or 'end' to use _otherRange_'s end point.","","    @return {Number} -1, 0, or 1, indicating whether the other range's boundary","        is respectively before, equal to, or after this range's boundary.","    **/","    compare: isHTML5 ? function (otherRange, options) {","        // Make sure we're working with a native range, not a YUI range.","        if (otherRange._range) {","            otherRange = otherRange._range;","        }","","        options = Y.merge({","            myPoint   : 'start',","            otherPoint: 'start'","        }, options);","","        var how = win.Range[options.myPoint.toUpperCase() + '_TO_' +","                    options.otherPoint.toUpperCase()];","","        return this._range.compareBoundaryPoints(how, otherRange);","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Removes the contents of this range from the DOM.","","    @method deleteContents","    @chainable","    **/","    deleteContents: isHTML5 ? function () {","        this._range.deleteContents();","        return this;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the node that contains the end point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the end point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the end point to be placed immediately before","    _node_ (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    _node_ (not inside it).","","    @method endNode","    @param {HTMLElement|Node|String} [node] Node to set the end point to. May be","        specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current end point will be returned.","    @param {Number|String} [offset=0] Offset position of the new end point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the end point of this range.","    **/","    endNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === Number) {","                this._range.setEnd(el, offset);","            } else if (offset === 'before') {","                this._range.setEndBefore(el);","            } else if (offset === 'after') {","                this._range.setEndAfter(el);","            }","        }","","        return Y.one(this._range.endContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this selection's end position inside the end","    node.","","    If the end node is a text node, the offset represents a character position.","    If the end node can contain child nodes, then the offset represents a child","    index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the end point to be placed immediately before","    the current end node (not inside it).","","    The offset \"after\" will cause the end point to be placed immediately after","    the current end node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the end node. To","    get the new end node, call `endNode()`.","","    @method endOffset","    @param {Number|String} [offset] Offset position of the new end point","        relative to the current end node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this selection's end position inside the end","        node.","    **/","    endOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.endNode(this._range.endContainer, offset);","        }","","        return this._range.endOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Moves this range's contents into a document fragment and returns a Node","    instance containing that fragment.","","    Event listeners are not retained.","","    If this range splits a non-text element, the resulting fragment will include","    a clone of that element, including its id (if it has one). This could lead","    to duplicate ids, so be careful.","","    @method extractContents","    @return {Node} Node instance containing a document fragment with this","        range's contents.","    **/","    extractContents: isHTML5 ? function () {","        return Y.one(this._range.extractContents());","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Inserts a node at the start of this range.","","    @method insertNode","    @param {HTMLElement|Node|String} node Node instance, HTMLElement, or","        selector string of a node to insert.","    @return {Node} Inserted node.","    **/","    insertNode: isHTML5 ? function (node) {","        node = Y.one(node);","        this._range.insertNode(node._node);","        return node;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns `true` if this range is collapsed, `false` otherwise.","","    A `true` value means that the start and end points are the same and the","    range is empty, whereas a `false` value means that the start and end points","    are different and the range is not empty.","","    @method isCollapsed","    @return {Boolean} `true` if this range is collapsed, `false` otherwise.","    **/","    isCollapsed: isHTML5 ? function () {","        return this._range.collapsed;","    } : function () {","        throw new Error('Not yet implemented.');","    },","","","    /**","    Returns `true` if this range has the same boundaries as _otherRange_,","    `false` otherwise.","","    @method isEquivalent","    @param {Range} otherRange Range to compare this range to.","    @return {Boolean} `true` if this range has the same boundaries as","        _otherRange_, `false` otherwise.","    **/","    isEquivalent: function (otherRange) {","        return otherRange && this.compare(otherRange) === 0 &&","                this.compare(otherRange, {myPoint: 'end', otherPoint: 'end'}) === 0;","    },","","    /**","    Returns `true` if this range is entirely contained within the given _node_.","","    @method isInsideNode","    @param {HTMLElement|Node|String} node Node instance, HTML element, or","        selector string of the container.","    @return {Boolean} `true` if this range is entirely contained within the","        given _node_, `false` otherwise.","    **/","    isInsideNode: function (node) {","        var el       = Y.one(node)._node,","            parentEl = this.parentNode()._node;","","        if (el === parentEl) {","            return true;","        }","","        while (parentEl = parentEl.parentNode) {","            if (el === parentEl) {","                return true;","            }","        }","","        return false;","    },","","    /**","    Returns the nearest common ancestor node that fully contains all nodes","    within this range.","","    @method parentNode","    @return {Node} Nearest common ancestor node that fully contains all nodes","        within this range.","    **/","    parentNode: isHTML5 ? function () {","        return Y.one(this._range.commonAncestorContainer);","    } : function () {","        return Y.one(this._range.parentElement());","    },","","    /**","    Gets or sets the node that contains the start point of this range.","","    When specifying an _offset_, you may specify either a number or the string","    \"before\" or \"after\".","","    A numerical offset will position the start point at that offset inside the","    _node_. If _node_ is a text node, the offset will represent a character","    position. If _node_ can contain child nodes, then the offset will represent","    a child index.","","    The offset \"before\" will cause the start point to be placed immediately","    before _node_ (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    _node_ (not inside it).","","    @method startNode","    @param {HTMLElement|Node|String} [node] Node to set the start point to. May","        be specified as a Node instance, HTMLElement, or selector string. If not","        specified, the current start point will be returned.","    @param {Number|String} [offset=0] Offset position of the new start point","        relative to the _node_. If this is a number, it will be used as an","        offset position inside _node_. To specify a position immediately before","        _node_, use the string \"before\". To specify a position immediately after","        _node_, use the string \"after\".","    @return {Node} Node that contains the start point of this range.","    **/","    startNode: isHTML5 ? function (node, offset) {","        if (node) {","            var el = Y.one(node)._node;","","            offset || (offset = 0);","","            if (typeof offset === Number) {","                this._range.setStart(el, offset);","            } else if (offset === 'before') {","                this._range.setStartBefore(el);","            } else if (offset === 'after') {","                this._range.setStartAfter(el);","            }","        }","","        return Y.one(this._range.startContainer);","    } : function (node, offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Gets or sets the offset of this range's start position inside the start","    node.","","    If the start node is a text node, the offset represents a character","    position. If the start node can contain child nodes, then the offset","    represents a child index.","","    When setting an offset, you may use a numerical offset (which behaves as","    described above) or the string \"before\" or \"after\".","","    The offset \"before\" will cause the start point to be placed immediately","    before the current start node (not inside it).","","    The offset \"after\" will cause the start point to be placed immediately after","    the current start node (not inside it).","","    Note that setting a \"before\" or \"after\" offset will change the start node.","    To get the new start node, call `startNode()`.","","    @method startOffset","    @param {Number|String} [offset] Offset position of the new start point","        relative to the current start node. If this is a number, it will be used","        as an offset position inside the node. To specify a position immediately","        before the node, use the string \"before\". To specify a position","        immediately after the node, use the string \"after\".","    @return {Number} Offset of this range's start position inside the start","        node.","    **/","    startOffset: isHTML5 ? function (offset) {","        if (offset || offset === 0) {","            this.startNode(this._range.startContainer, offset);","        }","","        return this._range.startOffset;","    } : function (offset) {","        throw new Error('Not yet implemented.');","    },","","    /**","    Returns the HTML content of this range.","","    @method toHTML","    @return {HTML} HTML content of this range.","    **/","    toHTML: isHTML5 ? function () {","        var div = doc.createElement('div');","        div.appendChild(this._range.cloneContents());","","        return div.innerHTML;","    } : function () {","        return this._range.htmlText;","    },","","    /**","    Returns the plain text content of this range.","","    @method toString","    @return {String} Plain text content of this range.","    **/","    toString: isHTML5 ? function () {","        return this._range.toString();","    } : function () {","        return this._range.text;","    },","","    /**","    Traverses the contents of the range, passing each node and its children to","    the supplied callback in document order.","","    For example, if the range includes the following HTML...","","        lorem ipsum <b>dolor <i>sit</i></b> amet","","    ...then this `traverse()` call...","","        range.traverse(function (node) {","            console.log(Y.Node.getDOMNode(node));","        });","","    ...would result in the following console output:","","        \"lorem ipsum \"","        <b> element","        \"dolor \"","        <i> element","        \"sit\"","        \" amet\"","","    The entire start and end node will be included even if the range only","    includes a portion of them. Use the `startOffset()` and `endOffset()`","    methods to determine where the precise boundaries are if necessary.","","    @method traverse","    @param {Function} callback Callback function.","        @param {Node} callback.node Node instance.","    @param {Object} [thisObj] `this` object to use when calling the callback","        function.","    @chainable","    **/","    traverse: function (callback, thisObj) {","        if (this.isCollapsed()) {","            return this;","        }","","        var container = this.parentNode()._node,","            end       = this.endNode()._node,","            endOffset = this.endOffset();","","        // If there's a positive offset and the end node has children, we need","        // to take the offset into account when traversing. Otherwise we can","        // ignore it.","        if (endOffset && end.childNodes.length) {","            end = end.childNodes[endOffset];","        }","","        function traverseDOMNode(domNode) {","            callback.call(thisObj, Y.one(domNode));","","            if (domNode === end) {","                return;","            }","","            if (domNode.firstChild) {","                traverseDOMNode(domNode.firstChild);","            } else if (domNode.nextSibling) {","                traverseDOMNode(domNode.nextSibling);","            } else {","                var node = domNode;","","                while (node = node.parentNode) {","                    if (node !== container && node.nextSibling) {","                        traverseDOMNode(node.nextSibling);","                        break;","                    }","                }","            }","        }","","        traverseDOMNode(this.startNode()._node);","","        return this;","    },","","    /**","    Wraps this range in the specified HTML and returns the new wrapper node.","","    @method wrap","    @param {HTML} html HTML string.","    @param {Object} [options] Options.","        @param {Boolean} [options.includeWrapper=false] If `true`, this range","            will be updated to include the new wrapper node.","    @return {Node} New wrapper node.","    **/","    wrap: isHTML5 ? function (html, options) {","        // We have to manually extract the range's contents and append them to","        // the wrapper instead of just using Range#surroundContents(), because","        // surroundContents() will throw an exception if one of the Range's","        // boundary points splits a non-text node.","        //","        // It's puzzling that this is part of the Range spec, because the error","        // doesn't do anyone any good, and extractContents() (which is used","        // internally by surroundContents()) already requires the browser to","        // implement node splitting anyway. But whatevs.","        var contents  = this._range.extractContents(),","            container = Y.DOM.create(html); // TODO: handle fragments?","","        container.appendChild(contents);","        this._range.insertNode(container);","","        if (options && options.includeWrapper) {","            this._range.selectNode(container);","        } else {","            this._range.selectNodeContents(container);","        }","","        return container;","    } : function (html) {","        throw new Error('Not yet implemented.');","    }","};","","Y.Range = Range;","","","}, '@VERSION@', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].lines = {"1":0,"25":0,"30":0,"31":0,"33":0,"36":0,"50":0,"52":0,"71":0,"73":0,"88":0,"89":0,"115":0,"116":0,"119":0,"124":0,"127":0,"129":0,"139":0,"140":0,"142":0,"174":0,"175":0,"177":0,"179":0,"180":0,"181":0,"182":0,"183":0,"184":0,"188":0,"190":0,"223":0,"224":0,"227":0,"229":0,"247":0,"249":0,"261":0,"262":0,"263":0,"265":0,"279":0,"281":0,"295":0,"309":0,"312":0,"313":0,"316":0,"317":0,"318":0,"322":0,"334":0,"336":0,"368":0,"369":0,"371":0,"373":0,"374":0,"375":0,"376":0,"377":0,"378":0,"382":0,"384":0,"417":0,"418":0,"421":0,"423":0,"433":0,"434":0,"436":0,"438":0,"448":0,"450":0,"488":0,"489":0,"492":0,"499":0,"500":0,"503":0,"504":0,"506":0,"507":0,"510":0,"511":0,"512":0,"513":0,"515":0,"517":0,"518":0,"519":0,"520":0,"526":0,"528":0,"551":0,"554":0,"555":0,"557":0,"558":0,"560":0,"563":0,"565":0,"569":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].functions = {"(anonymous 2):30":0,"}:32":0,"(anonymous 3):49":0,"}:51":0,"(anonymous 4):70":0,"}:72":0,"collapse:87":0,"(anonymous 5):113":0,"}:128":0,"(anonymous 6):138":0,"}:141":0,"(anonymous 7):173":0,"}:189":0,"(anonymous 8):222":0,"}:228":0,"(anonymous 9):246":0,"}:248":0,"(anonymous 10):260":0,"}:264":0,"(anonymous 11):278":0,"}:280":0,"isEquivalent:294":0,"isInsideNode:308":0,"(anonymous 12):333":0,"}:335":0,"(anonymous 13):367":0,"}:383":0,"(anonymous 14):416":0,"}:422":0,"(anonymous 15):432":0,"}:437":0,"(anonymous 16):447":0,"}:449":0,"traverseDOMNode:503":0,"traverse:487":0,"(anonymous 17):541":0,"}:564":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-range/gallery-sm-range.js"].coveredLines = 104;
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
@constructor
**/

_yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 25);
var doc = Y.config.doc,
    win = Y.config.win,

    isHTML5 = !!(win && win.Range && doc.createRange);

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 30);
var Range = isHTML5 ? function (range) {
    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 2)", 30);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 31);
this._range = range || doc.createRange();
} : function (range) {
    _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 32);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 33);
this._range = range || doc.body.createTextRange();
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 36);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 3)", 49);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 50);
return this._range.cloneRange();
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 51);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 52);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 4)", 70);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 71);
return Y.one(this._range.cloneContents());
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 72);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 73);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "collapse", 87);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 88);
this._range.collapse(options && options.toStart);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 89);
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

    @return {Number} -1, 0, or 1, indicating whether the other range's boundary
        is respectively before, equal to, or after this range's boundary.
    **/
    compare: isHTML5 ? function (otherRange, options) {
        // Make sure we're working with a native range, not a YUI range.
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 5)", 113);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 115);
if (otherRange._range) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 116);
otherRange = otherRange._range;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 119);
options = Y.merge({
            myPoint   : 'start',
            otherPoint: 'start'
        }, options);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 124);
var how = win.Range[options.myPoint.toUpperCase() + '_TO_' +
                    options.otherPoint.toUpperCase()];

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
if (typeof offset === Number) {
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isEquivalent", 294);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 295);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "isInsideNode", 308);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 309);
var el       = Y.one(node)._node,
            parentEl = this.parentNode()._node;

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 312);
if (el === parentEl) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 313);
return true;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 316);
while (parentEl = parentEl.parentNode) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 317);
if (el === parentEl) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 318);
return true;
            }
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 322);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 12)", 333);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 334);
return Y.one(this._range.commonAncestorContainer);
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 335);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 336);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 13)", 367);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 368);
if (node) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 369);
var el = Y.one(node)._node;

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 371);
offset || (offset = 0);

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 373);
if (typeof offset === Number) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 374);
this._range.setStart(el, offset);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 375);
if (offset === 'before') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 376);
this._range.setStartBefore(el);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 377);
if (offset === 'after') {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 378);
this._range.setStartAfter(el);
            }}}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 382);
return Y.one(this._range.startContainer);
    } : function (node, offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 383);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 384);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 14)", 416);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 417);
if (offset || offset === 0) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 418);
this.startNode(this._range.startContainer, offset);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 421);
return this._range.startOffset;
    } : function (offset) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 422);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 423);
throw new Error('Not yet implemented.');
    },

    /**
    Returns the HTML content of this range.

    @method toHTML
    @return {HTML} HTML content of this range.
    **/
    toHTML: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 15)", 432);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 433);
var div = doc.createElement('div');
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 434);
div.appendChild(this._range.cloneContents());

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 436);
return div.innerHTML;
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 437);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 438);
return this._range.htmlText;
    },

    /**
    Returns the plain text content of this range.

    @method toString
    @return {String} Plain text content of this range.
    **/
    toString: isHTML5 ? function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 16)", 447);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 448);
return this._range.toString();
    } : function () {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 449);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 450);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverse", 487);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 488);
if (this.isCollapsed()) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 489);
return this;
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 492);
var container = this.parentNode()._node,
            end       = this.endNode()._node,
            endOffset = this.endOffset();

        // If there's a positive offset and the end node has children, we need
        // to take the offset into account when traversing. Otherwise we can
        // ignore it.
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 499);
if (endOffset && end.childNodes.length) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 500);
end = end.childNodes[endOffset];
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 503);
function traverseDOMNode(domNode) {
            _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "traverseDOMNode", 503);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 504);
callback.call(thisObj, Y.one(domNode));

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 506);
if (domNode === end) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 507);
return;
            }

            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 510);
if (domNode.firstChild) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 511);
traverseDOMNode(domNode.firstChild);
            } else {_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 512);
if (domNode.nextSibling) {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 513);
traverseDOMNode(domNode.nextSibling);
            } else {
                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 515);
var node = domNode;

                _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 517);
while (node = node.parentNode) {
                    _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 518);
if (node !== container && node.nextSibling) {
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 519);
traverseDOMNode(node.nextSibling);
                        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 520);
break;
                    }
                }
            }}
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 526);
traverseDOMNode(this.startNode()._node);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 528);
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
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "(anonymous 17)", 541);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 551);
var contents  = this._range.extractContents(),
            container = Y.DOM.create(html); // TODO: handle fragments?

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 554);
container.appendChild(contents);
        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 555);
this._range.insertNode(container);

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 557);
if (options && options.includeWrapper) {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 558);
this._range.selectNode(container);
        } else {
            _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 560);
this._range.selectNodeContents(container);
        }

        _yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 563);
return container;
    } : function (html) {
        _yuitest_coverfunc("build/gallery-sm-range/gallery-sm-range.js", "}", 564);
_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 565);
throw new Error('Not yet implemented.');
    }
};

_yuitest_coverline("build/gallery-sm-range/gallery-sm-range.js", 569);
Y.Range = Range;


}, '@VERSION@', {"requires": ["node-base"]});
