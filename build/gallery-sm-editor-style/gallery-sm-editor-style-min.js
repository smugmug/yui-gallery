YUI.add("gallery-sm-editor-style",function(e,t){(function(){var t=e.config.doc,n=e.config.win,r=e.Editor.DOM,i="<span></span>",s=e.Base.create("editorStyle",e.Base,[],{styleCommands:{bold:{property:"fontWeight",valueOn:"bold",valueOff:"normal"},fontName:{property:"fontFamily"},fontSize:{property:"fontSize"},italic:{property:"fontStyle",valueOn:"italic",valueOff:"normal"},underline:{property:"textDecoration",valueOn:"underline",valueOff:"none"}},styleKeyCommands:{backspace:{fn:"_afterDelete",allowDefault:!0,async:!0},"delete":{fn:"_afterDelete",allowDefault:!0,async:!0}},initializer:function(){this.keyCommands&&(this.keyCommands=e.merge(this.keyCommands,this.styleKeyCommands))},destructor:function(){},bold:function(){return this.command("bold","toggle"),this},italic:function(){return this.command("italic","toggle"),this},styles:function(e){var t={},n;if(e)for(n in e)e.hasOwnProperty(n)&&(t[n]=this.command(n,e[n]));else{var r=this.styleCommands;for(n in r)r.hasOwnProperty(n)&&(t[n]=this._queryCommandValue(n))}return t},underline:function(){return this.command("underline","toggle"),this},_execCommand:function(t,n){var i=this.styleCommands[t],s=this.selection.range(),o,u;if(!s)return;if(!i)return e.Editor.Base.prototype._execCommand.call(this,t,n);o=this._getStyleNodes(s),u=o.item(0)._node.style[i.property],this.boolCommands[t]&&"toggle"===n?u&&""!==u?u="":u=i.valueOn:u=n,o.setStyle(i.property,u),s.expand(this._inputNode).deleteContents(),this._splitAfterRange(s,o),s.startNode(o.item(0),0),s.endNode(o.item(o.size()-1)),s.endOffset(r.maxOffset(s.endNode())),this.selection.select(s)},_formatHTML:function(n){function s(t){var n=t.get("childNodes")._nodes;e.Array.each(n.reverse(),function(t){var n;t=e.one(t),n=t.get("parentNode"),r.isTextNode(t)?r.isContainer(n)?t.wrap(i):t.get("previousSibling")&&r.split(n,t):(r.isContainer(n)||(n.insert(t,"after"),t.addClass(n.get("className")),r.copyStyles(n,t,u,{explicit:!0,overwrite:!1})),s(t),!r.isContainer(t)&&r.isEmptyNode(t)&&t.remove(!0),t.removeAttribute("id"))})}var o,u=[];return e.Object.each(this.styleCommands,function(e){u.push(e.property)}),o=e.one(t.createDocumentFragment()).setHTML(n),s(o),o},_getHTML:function(t){return t=e.Editor.Base.prototype._getHTML.call(this,t),this.get("formatFn")(t).getHTML()},_getStyledAncestor:function(e,t,n){return e.ancestor(function(e){return r.isElementNode(e)?!!e._node.style[t]:!1},n,this.selectors.input)},_getStyleNodes:function(t){var n,s,o;t.expand(this._inputNode),n=r.getAncestorElement(t.parentNode(),r.isInlineElement);if(n){if(t.toString()===n.get("text"))return new e.NodeList([n]);s=n}else s=e.Node.create(i);return o=t.cloneContents().get("childNodes"),o.each(function(e,t){r.isTextNode(e)&&o.splice(t,1,s.cloneNode(!1).append(e))}),o},_setHTML:function(t){return t=this.get("formatFn")(t).getHTML(),e.Editor.Base.prototype._setHTML.call(this,t)},_splitAfterRange:function(e,t){var n,i;n=e.endNode(),i=e.endOffset();while(!r.isContainer(n)&&i===r.maxOffset(n))i=e.endOffset("after"),n=e.endNode();while(!r.isContainer(n))i=r.split(n,i),n=i.get("parentNode");return t&&n.insert(t,i),i._node||(i=n.get("childNodes").item(i)),i},_queryCommandValue:function(t){var n=this.styleCommands[t],i=this.selection.range(),s,o,u;return n?(i&&(s=i.shrink().parentNode(),o=this._getStyledAncestor(s,n.property,!0),o||(o=r.getAncestorElement(s)),u=o.getStyle(n.property)),this.boolCommands[t]?u=u===n.valueOn:""===u&&(u=null),u):e.Editor.Base.prototype._queryCommandValue.call(this,t)},_afterDelete:function(){this._clearCommandQueue(),this._updateSelection({force:!0})},_onPaste:function(e){var t=e._event.clipboardData||n.clipboardData,r=t.getData("text"),i=this.selection.range();e.preventDefault(),r=this.get("formatFn")(r),i.isCollapsed()||(i.expand(this._inputNode),i.deleteContents()),i.endNode(this._splitAfterRange(i,r),"before"),this.selection.select(i.collapse()),this._updateSelection({force:!0})}},{ATTRS:{formatFn:{readOnly:!0,setter:function(t){return e.bind(t,this)},validator:e.Lang.isFunction,valueFn:function(){return this._formatHTML}}}});e.namespace("Editor").Style=s})()},"@VERSION@",{requires:["gallery-sm-editor-base","gallery-sm-editor-dom","gallery-sm-editor-keys","gallery-sm-editor-queue","node-style"]});
