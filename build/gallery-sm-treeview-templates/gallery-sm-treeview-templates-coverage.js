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
_yuitest_coverage["build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js",
    code: []
};
_yuitest_coverage["build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js"].code=["YUI.add('gallery-sm-treeview-templates', function (Y, NAME) {","","var Micro = Y.Template.Micro;","","Y.namespace('TreeView').Templates = {","    children: Micro.compile(","        '<ul class=\"<%= data.classNames.children %>\" ' +","","            '<% if (data.node.isRoot()) { %>' +","                'role=\"tree\" tabindex=\"0\"' +","            '<% } else { %>' +","                'role=\"group\"' +","            '<% } %>' +","","        '></ul>'","    ),","","    node: Micro.compile(","        '<li id=\"<%= data.node.id %>\" class=\"<%= data.nodeClassNames.join(\" \") %>\" role=\"treeitem\" aria-labelled-by=\"<%= data.node.id %>-label\">' +","            '<div class=\"<%= data.classNames.row %>\" data-node-id=\"<%= data.node.id %>\">' +","                '<span class=\"<%= data.classNames.indicator %>\"><s></s></span>' +","                '<span class=\"<%= data.classNames.icon %>\"></span>' +","                '<span id=\"<%= data.node.id %>-label\" class=\"<%= data.classNames.label %>\"><%== data.node.label %></span>' +","            '</div>' +","        '</li>'","    )","};","","","}, '@VERSION@', {\"requires\": [\"template-micro\"]});"];
_yuitest_coverage["build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js"].lines = {"1":0,"3":0,"5":0};
_yuitest_coverage["build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js"].coveredLines = 3;
_yuitest_coverage["build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js"].coveredFunctions = 1;
_yuitest_coverline("build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js", 1);
YUI.add('gallery-sm-treeview-templates', function (Y, NAME) {

_yuitest_coverfunc("build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js", 3);
var Micro = Y.Template.Micro;

_yuitest_coverline("build/gallery-sm-treeview-templates/gallery-sm-treeview-templates.js", 5);
Y.namespace('TreeView').Templates = {
    children: Micro.compile(
        '<ul class="<%= data.classNames.children %>" ' +

            '<% if (data.node.isRoot()) { %>' +
                'role="tree" tabindex="0"' +
            '<% } else { %>' +
                'role="group"' +
            '<% } %>' +

        '></ul>'
    ),

    node: Micro.compile(
        '<li id="<%= data.node.id %>" class="<%= data.nodeClassNames.join(" ") %>" role="treeitem" aria-labelled-by="<%= data.node.id %>-label">' +
            '<div class="<%= data.classNames.row %>" data-node-id="<%= data.node.id %>">' +
                '<span class="<%= data.classNames.indicator %>"><s></s></span>' +
                '<span class="<%= data.classNames.icon %>"></span>' +
                '<span id="<%= data.node.id %>-label" class="<%= data.classNames.label %>"><%== data.node.label %></span>' +
            '</div>' +
        '</li>'
    )
};


}, '@VERSION@', {"requires": ["template-micro"]});
