YUI.add("gallery-sm-treeview-sortable",function(e,t){var n=e.TreeView.Sortable=function(){};e.mix(n.prototype,e.Tree.Sortable.prototype),n.prototype._attachTreeViewEvents=function(){e.TreeView.prototype._attachTreeViewEvents.call(this),this._treeViewEvents.push(this.after("sort",this._afterSort))},n.prototype._afterSort=function(e){var t=e.node;if(!this.rendered||!t.state.renderedChildren)return;this.renderChildren(t,{container:this.getHTMLNode(t)})}},"@VERSION@",{requires:["gallery-sm-treeview","tree-sortable"]});