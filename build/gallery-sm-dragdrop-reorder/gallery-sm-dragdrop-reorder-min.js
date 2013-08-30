YUI.add("gallery-sm-dragdrop-reorder",function(e,t){var n=e.ClassNameManager.getClassName,r="reorder",i="reorderafter",s="reorderbefore",o="reorderend",u="reorderstart";e.namespace("Plugin.DragDrop").Reorder=e.Base.create("dragdropReorder",e.Plugin.Base,[],{classNames:{after:n("drag-reorder-after"),before:n("drag-reorder-before")},initializer:function(e){this._host=e.host,this._publishedEvents={},this.get("container")||this.set("container",this._host.get("container")),this._maxDistance=this.get("maxDistance"),this._orientation=this.get("orientation"),this._placeholderNode=this.get("placeholderNode"),this._throttleDelay=this.get("throttleDelay"),this.afterHostMethod("sync",this.sync),this.onHostEvent("dragstart",this._onDragStart),this.afterHostEvent("drag",this._afterDrag),this.afterHostEvent("dragend",this._afterDragEnd),this._attachEvents()},destructor:function(){this._detachEvents(),this._containerRect=null,this._host=null,this._itemRects=null,this._publishedEvents=null,this._reorderTimeout=clearTimeout(this._reorderTimeout)},sync:function(){return this._host._dragState.dragging&&(this._containerRect=this._host._getBoundingRect(this.get("container")._node),this._cacheItemRects()),this},_attachEvents:function(){this._events=[this.after(["containerChange","itemSelectorChange","orientationChange"],this.sync),this.after(["maxDistanceChange","orientationChange","placeholderNodeChange","throttleDelayChange"],this._cacheAttrValue)]},_cacheAttrValue:function(e){this["_"+e.attrName]=e.newVal},_cacheItemRects:function(){var t=this._host,n=t._proxyOrDragNode()._node,r=t._dragState.dragNode._node,i=e.Selector.query(this.get("itemSelector"),this.get("container")._node),s=this._itemRects=[],o,u;for(var a=0,f=i.length;a<f;a++){o=i[a];if(o===n||o===r)continue;u=t._getBoundingRect(o),u.centerX=Math.round(u.width/2)+u.left,u.centerY=Math.round(u.height/2)+u.top,u.el=o,s.push(u)}s.sort(function(e,t){return e.top-t.top||e.left-t.left})},_coordsAreInsideRect:function(e,t,n){return t<=n.bottom&&t>=n.top&&e<=n.right&&e>=n.left},_detachEvents:function(){(new e.EventHandle(this._events)).detach(),this._events=null},_findNearestItem:function(){var e=this._itemRects,t=this._host._dragState,n=this._orientation,r=t.pageXY[0],i=t.pageXY[1],s=n==="column",o=n==="grid",u=n==="row",a,f,l,c,h;for(var p=0,d=e.length;p<d;p++){h=e[p];if(s)l=Math.abs(h.centerY-i);else if(o){if(i<h.top||i>h.bottom)continue;l=Math.abs(h.centerX-r)+Math.abs(h.centerY-i)}else u&&(l=Math.abs(h.centerX-r));if(!f||l<a)a=l,f=h}if(!f||a>this._maxDistance){if(!o)return null;var v=e[e.length-1];if(!(i>v.bottom&&i-v.bottom<this._maxDistance))return null;f=v,c=!0}var m;return m={el:f.el,rect:f,above:i<f.centerY,below:i>f.centerY,inside:this._coordsAreInsideRect(r,i,f),left:r<f.centerX,right:r>f.centerX},m.before=m.left&&!c,m.after=!m.before,m},_fireEnd:function(){var t=this._placeholderNode,n=this._host._dragState,r=n.reorder.nearestItem;t&&t.remove(),r&&r.node.removeClass(this.classNames[r.after?"after":"before"]),n.reorder.active=!1,n.reorder.nearestItem=null,this._publishAndFire(o,e.merge(n,{canceled:!n.reorder.dropped,deltaXY:this._host._getDelta(),state:n}))},_fireStart:function(){var t=this._host._dragState;this._publishAndFire(u,e.merge(t,{deltaXY:this._host._getDelta(),state:t}),{defaultFn:this._defReorderStartFn,preventedFn:this._preventedReorderStartFn})},_isReorderable:function(){var e=this._host._dragState;return this._coordsAreInsideRect(e.pageXY[0],e.pageXY[1],this._containerRect)?e.reorder.active||this._fireStart():e.reorder.active&&this._fireEnd(),e.reorder.active},_publishAndFire:function(e,t,n){return n&&n.silent?n.defaultFn&&n.defaultFn.call(this,t):(n&&!this._publishedEvents[e]&&(this._publishedEvents[e]=this.publish(e,n)),this.fire(e,t)),this},_reorderDrag:function(){var t=this._findNearestItem(),n=this._host._dragState,r=n.reorder.nearestItem;if(r){if(t&&r.el===t.el&&r.before===t.before)return;r.node.removeClass(this.classNames[r.after?"after":"before"]),this.sync()}if(!t){n.reorder.nearestItem=null,this._fireEnd();return}t.node=e.one(t.el),n.reorder.nearestItem=t;var o;o=e.merge(n,t,{deltaXY:this._host._getDelta(),state:n}),t.before?this._publishAndFire(s,o,{defaultFn:this._defReorderBeforeFn,preventedFn:this._preventedReorderBeforeFn}):t.after&&this._publishAndFire(i,o,{defaultFn:this._defReorderAfterFn,preventedFn:this._preventedReorderAfterFn})},_validateOrientation:function(e){return e==="column"||e==="grid"||e==="row"},_afterDrag:function(e){if(this._reorderTimeout||e.state.reorder.prevented)return;this._isReorderable()&&this._reorderDrag();var t=this;this._reorderTimeout=setTimeout(function(){t._reorderTimeout=null},this._throttleDelay)},_afterDragEnd:function(t){var n=t.state,i=n.reorder.active&&n.reorder.nearestItem;i&&this._publishAndFire(r,e.merge(n,i,{deltaXY:this._host._getDelta(),state:n}),{defaultFn:this._defReorderFn}),this._fireEnd()},_defReorderFn:function(e){var t=e.state,n=t.reorder.nearestItem;if(!n)return;t.reorder.dropped=!0,this.get("moveOnEnd")&&n.node.insert(e.dragNode,n.before?"before":"after")},_defReorderAfterFn:function(e){var t=this._placeholderNode;e.node.addClass(this.classNames.after),t&&(e.node.insert(t,"after"),this.sync())},_defReorderBeforeFn:function(e){var t=this._placeholderNode;e.node.addClass(this.classNames.before),t&&(e.node.insert(t,"before"),this.sync())},_defReorderStartFn:function(e){e.state.reorder.active=!0},_onDragStart:function(e){e.state.reorder={}},_preventedReorderAfterFn:function(e){this._fireEnd()},_preventedReorderBeforeFn:function(e){this._fireEnd()},_preventedReorderStartFn:function(e){e.state.reorder.prevented=!0}},{NS:"reorder",ATTRS:{container:{setter:e.one},itemSelector:{},orientation:{validator:"_validateOrientation",value:"grid"},maxDistance:{value:400},moveOnEnd:{value:!0},placeholderNode:{},throttleDelay:{value:20}}})},"@VERSION@",{requires:["base-pluginhost","gallery-sm-dragdrop","plugin"]});
