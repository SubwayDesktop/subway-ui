(function(){


var handlers = {
    drag: {
	start: function(ev){
	    if(!this.draggable)
		return false;
	    var list = this.parentElement;
	    list.$dragSrc = this;
	    ev.dataTransfer.effectAllowed = 'move';
	    ev.dataTransfer.setDragImage(new Image(), 0 ,0);
	    ev.dataTransfer.setData('text/plain', 'anything');
	},
	over: function(ev){
	    if(!this.draggable)
		return false;
	    ev.preventDefault();
	    ev.dataTransfer.dropEffect = 'move';
	},
	enter: function(ev){
	    if(!this.draggable)
		return false;
	    var list = this.parentElement;
	    var iterator = nextElementIterator(list.$dragSrc);
	    var top2bottom = false;
	    for(let node of iterator){
		if(node == this){
		    top2bottom = true;
		    break;
		}
	    }
	    this.dataset.drag_enter_state = top2bottom? 'top2bottom': 'bottom2top';
	},
	leave: function(ev){
	    if(!this.draggable)
		return false;
	    delete this.dataset.drag_enter_state;
	},
	drop: function(ev){
	    if(!this.draggable)
		return false;
	    var list = this.parentElement;
	    var src = list.$dragSrc;
	    var insert = Widget.ListView.prototype.insert.bind(list);
	    ev.preventDefault();
	    ev.stopPropagation();
	    delete this.dataset.drag_enter_state;
	    /* avoid dragging from another tab list */
	    if(!src)
		return;
	    if(this != src){
		if(!this.nextElementSibling){
		    insert(src);
		}else{
		    let iterator = nextElementIterator(src);
		    let top2bottom = false;
		    for(let node of iterator){
			if(node == this){
			    top2bottom = true;
			    break;
			}
		    }
		    if(top2bottom){
			insert(src, this.nextElementSibling);
		    }else{
			insert(src, this);
		    }
		}
	    }
	    list.$dragSrc = null;
	}
    },
    tab: {
	click: function(){
	    var tab_bar = this.parentElement;
	    tab_bar.setCurrentTab(tab_bar.$widget_map.get(this));
	}
    }
};
    

var Widget = {};


Widget.Widget = document.registerElement('widget-widget', {
    prototype: {
	createdCallback: function(){
	    
	},
	__proto__: HTMLElement.prototype
    }
});


Widget.TextButton = document.registerElement('widget-text-button', {
    prototype: {
	createdCallback: function(){
	    Widget.Widget.prototype.createdCallback.call(this);
	    Object.defineProperty(this, 'default_hidden', {
		get: function(){
		    return this.getAttribute('default_hidden');	
		},
		set: function(value){
		    this.setAttribute('default_hidden');
		}
	    });
	},
	__proto__: Widget.Widget.prototype
    }
});


Widget.ListItem = document.registerElement('widget-list-item', {
    prototype: {
	createdCallback: function(){
	    Widget.Widget.prototype.createdCallback.call(this);
	    this.addEventListener('dragstart', handlers.drag.start);
	    this.addEventListener('dragover', handlers.drag.over);
	    this.addEventListener('dragenter', handlers.drag.enter);
	    this.addEventListener('dragleave', handlers.drag.leave);
	    this.addEventListener('drop', handlers.drag.drop);
	},
	__proto__: Widget.Widget.prototype
    }
});


Widget.ListView = document.registerElement('widget-list-view', {
    prototype: {
	createdCallback: function(){
	    Widget.Widget.prototype.createdCallback.call(this);
	    this.$dragSrc = null;
	    this.$item_draggable = false;
	    Object.defineProperty(this, 'item_draggable', {
		get: function(){
		    return this.$item_draggable;
		},
		set: function(value){
		    for(let item of this.childNodes)
			item.draggable = value;
		    this.$item_draggable = value;
		}
	    });
	    var observer = new MutationObserver(function(mutations){
		for(let I of mutations){
		    for(let node of I.addedNodes)
			node.draggable = I.target.$item_draggable;
		}
	    });
	    observer.observe(this, { childList: true });
	},
	insert: function(items, next_sibling){
	    if(!Array.isArray(items))
		items = [items];
	    for(let item of items){
		if(next_sibling)
		    this.insertBefore(item, next_sibling);
		else
		    this.appendChild(item);
	    }	
	},
	remove: function(items){
	    if(!Array.isArray(items))
		items = [items];
	    for(let item of items)
		this.removeChild(item);
	},
	empty: function(){
	    while(this.firstChild)
		this.removeChild(this.firstChild);
	},
	__proto__: Widget.Widget.prototype
    }
});


Widget.Set = document.registerElement('widget-set', {
    prototype: {
	createdCallback: function(){
	    Widget.Widget.prototype.createdCallback.call(this);
	    this.$currentWidget = null;
	},
	addWidget: function(widget){
	    if(this.children.length)
		hide(widget);
	    else
		this.$currentWidget = widget;
	    this.appendChild(widget);
	},
	removeWidget: function(widget, prev, next){
	    if(widget == this.$currentWidget){
		if(next){
		    show(next);
		    this.$currentWidget = next;
		}else if(prev){
		    show(prev);
		    this.$currentWidget = prev;
		}else{
		    this.$currentWidget = null;
		}
	    }
	    this.removeChild(widget);
	},
	setCurrentWidget: function(widget){
	    hide(this.$currentWidget);
	    show(widget);
	    this.$currentWidget = widget;
	},
	getCurrentWidget: function(){
	    return this.$currentWidget;
	},
	__proto__: Widget.Widget.prototype
    }
});


Widget.Tab = document.registerElement('widget-tab', {
    prototype: {
	createdCallback: function(){
	    Widget.ListItem.prototype.createdCallback.call(this);
	    Object.defineProperty(this, 'current', {
		get: function(){
		    return this.getAttribute('current');
		},
		set: function(value){
		    this.setAttribute('current', value);
		}
	    });
	},
	__proto__: Widget.ListItem.prototype
    }
});


Widget.TabBar = document.registerElement('widget-tab-bar', {
    prototype: {
	createdCallback: function(){
	    Widget.ListView.prototype.createdCallback.call(this);	    
	    this.$widget_map = new Map();
	    this.$tab_map = new Map();
	    this.$currentTab = null;		
	    Object.defineProperty(this, 'currentTab', {
		get: this.getCurrentTab,
		set: this.setCurrentTab
	    });
	    Object.defineProperty(this, 'layout', {
		get: function(){
		    return this.getAttribute('layout');
		},
		set: function(value){
		    this.setAttribute('layout', value);
		}
	    });
	},
	addTab: function(widget, label_text){
	    /* The argument 'widget' can be a symbol of all types.
	     * String, HTMLElement and Symbol are all OK.
	     */
	    var tab_bar = this;
	    var tab = create('widget-tab', label_text);
	    if(this.children.length){
		tab.current = false;
	    }else{
		this.$currentTab = tab;
		tab.current = true;
	    }
	    this.$widget_map.set(tab, widget);
	    this.$tab_map.set(widget, tab);
	    tab.addEventListener('click', handlers.tab.click);
	    this.insert(tab);
	},
	getCurrentTab: function(){
	    return this.$currentTab;
	},
	setCurrentTab: function(widget){
	    var tab = this.$tab_map.get(widget);
	    this.$currentTab.current = false;
	    tab.current = true;
	    this.$currentTab = tab;
	    
	    var ev = new CustomEvent('change', {
		detail: {
		    widget: widget
		}
	    });
	    this.dispatchEvent(ev);
	},
	removeTab: function(widget){
	    var tab = this.$tab_map.get(widget);
	    var prev = tab.previousElementSibling;
	    var next = tab.nextElementSibling;
	    var prev_widget = this.$widget_map(prev);
	    var next_widget = this.$widget_map(next);
	    if(tab == this.$currentTab){
		if(next)
		    this.setCurrentTab(next_widget);
		else if(prev)
		    this.setCurrentTab(prev_widget);
		else
		    this.$currentTab = null;
	    }
	    this.remove(tab);
	    this.$widget_map.delete(tab);
	    this.$tab_map.delete(widget);
	    
	    var ev = new CustomEvent('tabclose', {
		detail: {
		    widget: widget,
		    prev: (prev)? prev_widget: null,
		    next: (next)? next_widget: null
		}
	    });
	    this.dispatchEvent(ev);
	},
	__proto__: Widget.ListView.prototype
    }
});


Widget.ModalDialog = document.registerElement('widget-modal-dialog', {
    prototype: {
	createdCallback: function(){
	    Widget.Widget.prototype.createdCallback.call(this);	    
	},
	__proto__: Widget.Widget.prototype
    }
});
 

var Binding = {
    TabWidget: function(tab_bar, widget_set){
	var tabWidget = this;
	var tabChanged = function(ev){
	    widget_set.setCurrentWidget(ev.detail.widget);
	};
	var tabClosed = function(ev){
	    widget_set.removeWidget(ev.detail.widget, ev.detail.prev, ev.detail.next);
	};
	tab_bar.addEventListener('change', tabChanged);
	tab_bar.addEventListener('tabclose', tabClosed);
	if(!Binding.TabWidget.$init){
	    assignMethods(Binding.TabWidget, {
		addTab: function(widget, label){
		    widget_set.addWidget(widget);
		    tab_bar.addTab(widget, label);
		}
	    });
	    Binding.TabWidget.$init = true;
	}
    }
};


window.Widget = Widget;
window.Binding = Binding;


})();


