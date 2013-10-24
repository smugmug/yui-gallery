YUI.add("gallery-sm-editor-base",function(e,t){e.Node.DOM_EVENTS.paste=1;var n=e.config.doc,r=e.config.win,i=e.ClassNameManager.getClassName,s=e.Editor.DOM,o="blur",u="focus",a="render",f="selectionChange",l=e.Base.create("editorBase",e.View,[],{classNames:{cursor:i("sm-editor-cursor",!0),editor:i("sm-editor",!0),input:i("sm-editor-input",!0)},commands:{insertHTML:{commandFn:"_insertHTML"},insertText:{commandFn:"_insertText"}},supportedTags:"a, br, div, p, span",initializer:function(){this.selection=new e.Selection,this.selectors={},this._cursorHTML='<span class="'+this.classNames.cursor+'"></span>',e.Object.each(this.classNames,function(e,t){this.selectors[t]="."+e},this),this._attachEvents()},destructor:function(){this._detachEvents(),this.selection=null},blur:function(){return this._rendered&&this._inputNode.blur(),this},command:function(t){var n,r,i=t,s=e.Array(arguments,1,!0);return"string"==typeof i&&(n=this.commands[i],n&&(i=n.commandFn,n.style&&s.unshift(t)),"string"==typeof i&&(i=this[i])),this.focus(),"function"==typeof i&&(r=i.apply(this,s),this._updateSelection({force:!0})),r||this.query(t)},focus:function(){return this._rendered&&this._inputNode.focus(),this},query:function(t){var n,r,i=t,s=e.Array(arguments,0,!0);return"string"==typeof i&&(n=this.commands[i],n&&(i=n.queryFn),i=this[i]),this.focus(),"function"==typeof i&&(r=i.apply(this,s)),r},render:function(){var e=this.get("container"),t=e.one(this.selectors.input);e.addClass(this.classNames.editor),t||(t=e.appendChild("<div/>").addClass(this.classNames.input));var n=this.get("html"),r=this.get("text");return n?t.setHTML(n):r?t.set("text",r):t.setHTML("<p><br></p>"),t.set("contentEditable",!0),this._inputNode=t,this._rendered=!0,this.fire(a),this},_attachEvents:function(){if(this._events)return;var e=this.get("container"),t=this.selectors;this._events=[e.delegate("blur",this._onBlur,t.input,this),e.delegate("copy",this._onCopy,t.input,this),e.delegate("cut",this._onCut,t.input,this),e.delegate("dblclick",this._onDblClick,t.input,this),e.delegate("focus",this._onFocus,t.input,this),e.delegate("paste",this._onPaste,t.input,this)]},_detachEvents:function(){this._events&&((new e.EventHandle(this._events)).detach(),this._events=null)},_execCommand:function(e,t){if(!n.queryCommandSupported(e)||!n.queryCommandEnabled(e))return;n.execCommand(e,!1,t)},_getHTML:function(e){return this._rendered?this._inputNode.getHTML():e},_getNodes:function(t,n){var r,i,o,u=[];t=t.clone().shrink(),r=t.startNode(),i=t.startOffset();if(t.isCollapsed()){var a=r.get("childNodes");!s.isTextNode(r)&&a.item(i-1)?o=a.item(i-1):o=r}else o=r.get("parentNode");while(o&&o!==this._inputNode&&this._inputNode.contains(o))o.test(n)&&u.push(o),o=o.get("parentNode");return t.traverse(function(e){e.test(n)&&u.push(e)}),e.all(u)},_getText:function(e){return this._rendered?this._inputNode.get("text"):e},_insertHTML:function(t){var n=typeof t=="string"?e.Node.create(t):t,r=this.selection,i=r.range();if(!i)return;return i.expand({stopAt:this._inputNode}),n=i.deleteContents().insertNode(n),i.collapse(),r.select(i),n},_insertTab:function(){this._insertHTML('<span style="white-space:pre;">	</span>')},_insertText:function(e){return e=e.replace(/\n+/g," "),this._insertHTML(n.createTextNode(e))},_queryCommandValue:function(e){return n.queryCommandSupported(e)?n.queryCommandValue(e):null},_setHTML:function(e){return this._rendered&&this._inputNode.setHTML(e),e},_setText:function(e){return this._rendered&&this._inputNode.set("text",e),e},_updateSelection:function(e){var t=this._selectedRange||null,n=this.selection.range()||null,r=e&&e.force,i=e&&e.silent;if(!r&&(n===t||t&&t.isEquivalent(n)&&t.toHTML()===n.toHTML()))return;this._selectedRange=n,!i&&(!n||n.isInsideNode(this._inputNode))&&this.fire(f,{prevRange:t,range:n,selection:this.selection})},_onBlur:function(){if(!this._rendered)return;clearInterval(this._selectionMonitor),this.fire(o)},_onCopy:function(e){var t=e._event.clipboardData||r.clipboardData,n=this.selection.range(),i=n.cloneContents().getHTML();e.preventDefault();try{t.setData("text/html",i),t.setData("text/plain",i)}catch(s){t.setData("text",i)}},_onCut:function(e){var t=e._event.clipboardData||r.clipboardData,n=this.selection.range(),i;n.expand({stopAt:this._inputNode}),i=n.extractContents().getHTML(),e.preventDefault(),this.selection.select(n);try{t.setData("text/html",i),t.setData("text/plain",i)}catch(s){t.setData("text",i)}},_onDblClick:function(){var e=this.selection.range();this.selection.select(e.shrink({trim:!0}))},_onFocus:function(){var t=this,n=this.selection,r;if(!this._rendered)return;if(!(r=this._selectedRange)){var i=this._inputNode.get("firstChild")||this._inputNode;r=new e.Range,r.selectNodeContents(i),r.collapse({toStart:!0})}n.select(r),this._updateSelection(),clearInterval(this._selectionMonitor),this._selectionMonitor=setInterval(function(){t._updateSelection()},200),this.fire(u)},_onPaste:function(t){var n=t._event.clipboardData||r.clipboardData,i=n.getData("text");t.preventDefault(),i=e.Node.create(i).get("text"),this.command("insertText",i)}},{ATTRS:{html:{getter:"_getHTML",setter:"_setHTML",value:""},outputName:{value:"editor",writeOnce:"initOnly"},text:{getter:"_getText",setter:"_setText",value:""}}});e.namespace("Editor").Base=l},"@VERSION@",{requires:["base-build","classnamemanager","event-focus","gallery-sm-editor-dom","gallery-sm-selection","view"]});
