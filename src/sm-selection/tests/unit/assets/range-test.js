/*jshint white:false */

YUI.add('range-test', function (Y) {

var doc = Y.config.doc,
    win = Y.config.win,

    Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    Mock        = Y.Mock,

    Range = Y.Range,

    mainSuite = Y.RangeTestSuite = new Y.Test.Suite('Range');

// -- Lifecycle ----------------------------------------------------------------
mainSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'constructor should create a new empty Range by default': function () {
        var range = new Range();

        Assert.areSame(doc, range.startNode()._node, 'startNode should be the document');
        Assert.areSame(doc, range.endNode()._node, 'endNode should be the document');
        Assert.areSame(0, range.startOffset(), 'startOffset should be 0');
        Assert.areSame(0, range.endOffset(), 'endOffset should be 0');
    },

    'constructor should wrap a native Range if one is provided': function () {
        var nativeRange = doc.createRange(),
            range       = new Range(nativeRange);

        Assert.areSame(nativeRange, range._range);
    }
}));

// -- Methods ------------------------------------------------------------------
mainSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.html = '<span id="partial-container"><span id="marker-start"></span>lorem ipsum <span id="marker-dolor">dolor</span> sit</span> amet<span id="marker-end">marker end text</span>';
        Y.one('#test').setHTML(this.html);

        this.range = new Y.Range();
        this.range.startNode('#marker-start');
        this.range.endNode('#marker-end', 1);
    },

    tearDown: function () {
        delete this.html;
        delete this.range;

        Y.one('#test').empty();
    },


    'clone() should return a new Range object with the same boundaries': function () {
        var clone = this.range.clone();

        Assert.areNotSame(this.range, clone, 'should not actually be the same Range instance');
        Assert.areNotSame(this.range._range, clone._range, 'should not actually ');
        Assert.isTrue(clone.isEquivalent(this.range), 'ranges should be equivalent');
    },

    'cloneContents() should return a Node instance with a copy of the Range\'s contents': function () {
        var contents = this.range.cloneContents(),
            div      = Y.Node.create('<div/>');

        div.append(contents);

        Assert.isInstanceOf(Y.Node, contents, 'should return a Node instance');
        Assert.areSame(this.html, div.getHTML(), 'should contain the same HTML as the range');
        Assert.isFalse(this.range.isCollapsed(), 'should not delete the contents of the range');
    },

    'collapse() should move the start point to the end point': function () {
        var end   = this.range.endNode(),
            start = this.range.startNode();

        Assert.isFalse(this.range.isCollapsed(), 'should not already be collapsed (sanity)');
        Assert.areNotSame(start, end, 'start and end node should not already be the same (sanity)');

        this.range.collapse();

        Assert.areSame(end, this.range.endNode(), 'end node should not change');
        Assert.areSame(end, this.range.startNode(), 'start point should be same as the end point');
        Assert.isTrue(this.range.isCollapsed(), 'range should be collapsed');
    },

    'collapse({toStart: true}) should move the end point to the start point': function () {
        var end   = this.range.endNode(),
            start = this.range.startNode();

        Assert.isFalse(this.range.isCollapsed(), 'should not already be collapsed (sanity)');
        Assert.areNotSame(start, end, 'start and end node should not already be the same (sanity)');

        this.range.collapse({toStart: true});

        Assert.areSame(start, this.range.startNode(), 'start node should not change');
        Assert.areSame(start, this.range.endNode(), 'start point should be same as the end point');
        Assert.isTrue(this.range.isCollapsed(), 'range should be collapsed');
    },

    'collapse() should be chainable': function () {
        Assert.areSame(this.range, this.range.collapse());
    },

    'compare() should compare the start point of two ranges': function () {
        var range1 = new Y.Range(),
            range2 = new Y.Range();

        range1.startNode('#marker-dolor');
        range1.endNode('#marker-end');

        range2.startNode('#marker-dolor');
        range2.endNode('#marker-end');

        Assert.areSame(0, range1.compare(range2), 'should return 0 when start points match');

        range1.startNode('#marker-start');
        Assert.areSame(-1, range1.compare(range2), 'should return -1 when this range starts before the other range');

        range1.startNode('#marker-end');
        Assert.areSame(1, range1.compare(range2), 'should return 1 when this range starts after the other range');
    },

    'compare() should accept `myPoint` and `otherPoint` options to customize which points are compared': function () {

        var range1 = new Y.Range(),
            range2 = new Y.Range();

        range1.startNode('#marker-start');
        range1.endNode('#marker-end');

        range2.startNode('#marker-dolor');
        range2.endNode('#marker-end');

        Assert.areSame(-1, range1.compare(range2, {
            otherPoint: 'end'
        }), "range1's start point is before range2's end point");

        Assert.areSame(0, range1.compare(range2, {
            myPoint   : 'end',
            otherPoint: 'end'
        }), "end points are the same");

        Assert.areSame(1, range1.compare(range2, {
            myPoint: 'end'
        }), "range1's end point is after range2's start point");
    },

    'deleteContents() should remove the contents of the range from the DOM': function () {
        this.range.deleteContents();

        Assert.areSame(
            '<span id="partial-container"><span id="marker-start"></span></span><span id="marker-end"></span>',
            Y.one('#test').getHTML()
        );
    },

    'deleteContents() should be chainable': function () {
        Assert.areSame(this.range, this.range.deleteContents());
    },

    'endNode() should return the end node of the range': function () {
        Assert.areSame(Y.one('#marker-end'), this.range.endNode());
    },

    'endNode(node) should set the end node of the range': function () {
        Assert.areSame(Y.one('#marker-dolor'), this.range.endNode('#marker-dolor'));
        Assert.areSame(Y.one('#marker-dolor'), this.range.endNode());
    },

    'endNode(node, offset) should set both the end node and the offset relative to that node': function () {
        var endNode = Y.one('#marker-dolor')._node.nextSibling;
        Assert.areSame(Y.one(endNode), this.range.endNode(endNode, 3));
        Assert.areSame(3, this.range.endOffset());
    },

    'endOffset() should return the end offset': function () {
        var endNode = Y.one('#marker-dolor')._node.nextSibling;

        Assert.areSame(1, this.range.endOffset());
        this.range.endNode(endNode, 3);
        Assert.areSame(3, this.range.endOffset());
    },

    'endOffset(offset) should set the end offset': function () {
        var endNode = Y.one('#marker-dolor')._node.nextSibling;

        Assert.areSame(1, this.range.endOffset());
        this.range.endNode(endNode);
        this.range.endOffset(4);
        Assert.areSame(4, this.range.endOffset());
    },

    'extractContents() should extract and return a Node containing the contents of the range': function () {
        var contents = this.range.extractContents(),
            div      = Y.Node.create('<div/>');

        div.append(contents);

        Assert.isInstanceOf(Y.Node, contents, 'should return a Node instance');
        Assert.areSame(this.html, div.getHTML(), 'should contain the same HTML as the range');
        Assert.isTrue(this.range.isCollapsed(), 'should delete the contents of the range');
    },

    'insertNode(node) should insert a node at the start of the range': function () {
        var node = Y.Node.create('<span/>');

        Assert.areSame(node, this.range.insertNode(node), 'should return the inserted node');
        Assert.areSame(node, this.range.startNode().get('children').item(0), 'should actually insert the node');
    },

    'isCollapsed() should return true if the range is collapsed, false otherwise': function () {
        Assert.isFalse(this.range.isCollapsed(), 'should not be collapsed');

        this.range.collapse();
        Assert.isTrue(this.range.isCollapsed(), 'should be collapsed');
    },

    'isEquivalent(otherRange) should return true if the range shares the same boundaries as otherRange': function () {

        var range1 = new Y.Range(),
            range2 = new Y.Range();

        range1.startNode('#marker-dolor');
        range1.endNode('#marker-end');

        range2.startNode('#marker-dolor');
        range2.endNode('#marker-end');

        Assert.isTrue(range1.isEquivalent(range2), 'ranges should be equivalent');
        Assert.isTrue(range1.isEquivalent(range2._range), 'should support native range as argument');

        range2.collapse();
        Assert.isFalse(range1.isEquivalent(range2), 'ranges should not be equivalent');
    },

    'isInsideNode(node) should return true if the range is entirely contained inside the given node': function () {
        Assert.isTrue(this.range.isInsideNode(Y.one('#test')));
        Assert.isFalse(this.range.isInsideNode(Y.one('#partial-container')));
    },

    'parentNode() should return the nearest common ancestor node that fully contains this range': function () {
        Assert.areSame(Y.one('#test'), this.range.parentNode());
    },

    'startNode() should return the start node of the range': function () {
        Assert.areSame(Y.one('#marker-start'), this.range.startNode());
    },

    'startNode(node) should set the start node of the range': function () {
        Assert.areSame(Y.one('#marker-dolor'), this.range.startNode('#marker-dolor'));
        Assert.areSame(Y.one('#marker-dolor'), this.range.startNode());
    },

    'startNode(node, offset) should set both the start node and the offset relative to that node': function () {
        var startNode = Y.one('#marker-dolor')._node.nextSibling;
        Assert.areSame(Y.one(startNode), this.range.startNode(startNode, 3));
        Assert.areSame(3, this.range.startOffset());
    },

    'startOffset() should return the start offset': function () {
        var startNode = Y.one('#marker-dolor')._node.nextSibling;

        Assert.areSame(0, this.range.startOffset());
        this.range.startNode(startNode, 3);
        Assert.areSame(3, this.range.startOffset());
    },

    'startOffset(offset) should set the start offset': function () {
        var startNode = Y.one('#marker-dolor')._node.nextSibling;

        Assert.areSame(0, this.range.startOffset());
        this.range.startNode(startNode);
        this.range.startOffset(4);
        Assert.areSame(4, this.range.startOffset());
    },

    'toHTML() should return the HTML content of the range as a String': function () {
        Assert.areSame(this.html, this.range.toHTML());
    },

    'toString() should return the plain text content of the range': function () {
        Assert.areSame('lorem ipsum dolor sit ametmarker end text', this.range.toString());
    },

    'traverse(callback) should traverse the contents of the range': function () {
        var nodes = [];

        this.range.traverse(function (node) {
            Assert.areSame(win, this, 'thisObj should be the global');
            nodes.push(node);
        });

        Assert.areSame(Y.one('#marker-start'), nodes[0]);
        Assert.areSame('lorem ipsum ', nodes[1].get('text'));
        Assert.areSame(Y.one('#marker-dolor'), nodes[2]);
        Assert.areSame('dolor', nodes[3].get('text'));
        Assert.areSame(' sit', nodes[4].get('text'));
        Assert.areSame(' amet', nodes[5].get('text'));
        Assert.areSame(Y.one('#marker-end'), nodes[6]);
        Assert.areSame('marker end text', nodes[7].get('text'));
        Assert.areSame(8, nodes.length);
    },

    'traverse(callback, thisObj) should execute the callback with thisObj as its `this` object': function () {
        var calls   = 0,
            thisObj = {};

        this.range.traverse(function (node) {
            calls += 1;

            if (calls === 1) {
                Assert.areSame(thisObj, this);
            }
        }, thisObj);

        Assert.areSame(8, calls);
    },

    'traverse() should never call the callback if the range is collapsed': function () {
        this.range.collapse();

        this.range.traverse(function () {
            Assert.fail('callback should not be called');
        });
    },

    'traverse() should be chainable': function () {
        Assert.areSame(this.range, this.range.traverse(function () {}));
    },

    'wrap(html) should wrap the given HTML string around the contents of the range': function () {
        var range = new Range();

        range.startNode(doc.getElementById('marker-start').nextSibling);
        range.endNode(range.startNode(), 12);

        var wrapper = range.wrap('<span id="foo"></span>');

        Assert.areSame('foo', wrapper.get('id'));

        Assert.areSame(
            '<span id="partial-container"><span id="marker-start"></span><span id="foo">lorem ipsum </span><span id="marker-dolor">dolor</span> sit</span> amet<span id="marker-end">marker end text</span>',
            Y.one('#test').getHTML()
        );

        Assert.areSame('lorem ipsum ', range.toHTML(), 'range should not contain the wrapper');
    },

    'wrap(html, {includeWrapper: true}) should wrap the range, then extend the range\'s boundaries to include the wrapper': function () {
        var range = new Range();

        range.startNode(doc.getElementById('marker-start').nextSibling);
        range.endNode(range.startNode(), 12);

        var wrapper = range.wrap('<span id="foo"></span>', {includeWrapper: true});

        Assert.areSame('<span id="foo">lorem ipsum </span>', range.toHTML());
    }
}));

}, '@VERSION@', {
    requires: ['gallery-sm-range', 'node', 'test']
});
