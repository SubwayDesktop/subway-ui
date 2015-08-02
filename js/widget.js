var Widget = {
    TabContent: document.registerElement('widget-tab-content', {
	prototype: {
	    createdCallback: function(){
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
	    __proto__: HTMLElement.prototype
	}
    }),
    Tab: document.registerElement('widget-tab', {
	prototype: {
	    createdCallback: function(){
		this.draggable = true;
		this.tab_list = null;
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    TabLabel: document.registerElement('widget-tab-label', {
	prototype: {
	    createdCallback: function(){

	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    TabCloseButton: document.registerElement('widget-tab-close-button',{
	prototype: {
	    createdCallback: function(){
		this.textContent = '\u00D7';
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    TabList: document.registerElement('widget-tab-list', {
	prototype: {
	    createdCallback: function(){
		this.$widget_map = new Map();
		this.$parent_map = new Map();
		this.$currentTab = null;
		this.$dragSrc = null;
	    },
	    addTab: function(widget, parent, label_text, closable){
		var tabList = this;
		var label = create('widget-tab-label', label_text);
		var close_button;
		if(closable)
		    close_button = create('widget-tab-close-button');
		var tab = create('widget-tab', [label, close_button]);
		if(this.children.length){
		    tab.dataset.current = 'false';
		}else{
		    this.$currentTab = tab;
		    tab.dataset.current = 'true';
		}
		this.$widget_map.set(tab, widget);
		this.$parent_map.set(tab, parent);
		// ----
		var tab_clicked = function(){
		    tabList.$change(this);
		};
		var drag_start = function(ev){
		    tabList.$dragSrc = this;
		    ev.dataTransfer.effectAllowed = 'move';
		    ev.dataTransfer.setDragImage(new Image(), 0 ,0);
		    ev.dataTransfer.setData('text/plain', 'anything');
		};
		var drag_over = function(ev){
		    ev.preventDefault();
		    ev.dataTransfer.dropEffect = 'move';
		};
		var drag_enter = function(ev){
		    var iterator = nextElementIterator(tabList.$dragSrc);
		    var top2bottom = false;
		    for(let node of iterator){
			if(node == this){
			    top2bottom = true;
			    break;
			}
		    }
		    this.dataset.drag_enter_state = top2bottom? 'top2bottom': 'bottom2top';
		};
		var drag_leave = function(ev){
		    delete this.dataset.drag_enter_state;
		};
		var drop = function(ev){
		    var src = tabList.$dragSrc;
		    ev.preventDefault();
		    ev.stopPropagation();
		    delete this.dataset.drag_enter_state;
		    /* avoid dragging from another tab list */
		    if(!src)
			return;
		    if(this != src)
			tabList.$moveTab(this, src);
		    tabList.$dragSrc = null;
		};
		tab.addEventListener('click', tab_clicked);
		tab.addEventListener('dragstart', drag_start);
		tab.addEventListener('dragover', drag_over);
		tab.addEventListener('dragenter', drag_enter);
		tab.addEventListener('dragleave', drag_leave);
		tab.addEventListener('drop', drop);
		var close_button_clicked;
		if(closable){
		    close_button_clicked = function(ev){
			tabList.$tabclose(this.parentElement);
			ev.stopPropagation();
		    };
		    close_button.addEventListener('click', close_button_clicked);
		}
		this.appendChild(tab);
	    },
	    $moveTab: function(tab1, tab2){
		if(!tab1.nextElementSibling){
		    this.appendChild(tab2);
		}else{
		    let iterator = nextElementIterator(tab2);
		    let top2bottom = false;
		    for(let node of iterator){
			if(node == tab1){
			    top2bottom = true;
			    break;
			}
		    }
		    if(top2bottom){
			if(!tab1.nextElementSibling)
			    this.appendChild(tab2);
			else
			    this.insertBefore(tab2, tab1.nextElementSibling);
		    }else{
			this.insertBefore(tab2, tab1);
		    }
		}
	    },
	    $change: function(tab){
		var widget = this.$widget_map.get(tab);
		this.$currentTab.dataset.current = 'false';
		tab.dataset.current = 'true';
		this.$currentTab = tab;
		
		var ev = new CustomEvent('change', {
		    detail: {
			widget: widget
		    }
		});
		this.dispatchEvent(ev);
	    },
	    $tabclose: function(tab){
		var widget = this.$widget_map.get(tab);
		var prev = tab.previousElementSibling;
		var next = tab.nextElementSibling;
		if(tab == this.$currentTab){
		    if(next)
			this.$change(next);
		    else if(prev)
			this.$change(prev);
		    else
			this.$currentTab = null;
		}
		this.removeChild(tab);
		this.$widget_map.delete(tab);
		
		var ev = new CustomEvent('tabclose', {
		    detail: {
			widget: widget,
			prev: (prev)? this.$widget_map.get(prev): null,
			next: (next)? this.$widget_map.get(next): null
		    }
		});
		this.dispatchEvent(ev);
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    ListItem: document.registerElement('widget-list-item', {
	prototype: {
	    createdCallback: function(){

	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    ListView: document.registerElement('widget-list-view', {
	prototype: {
	    createdCallback: function(){

	    },
	    insert: function(item, next_sibling){
		if(next_sibling)
		    this.insertBefore(item, next_sibling);
		else
		    this.appendChild(item);
	    },
	    remove: function(item){
		this.removeChild(item);
	    },
	    empty: function(){
		while(this.firstChild)
		    this.removeChild(this.firstChild);
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    ModalDialog: document.registerElement('widget-modal-dialog', {

    })
}


var Binding = {
    TabWidget: function(tab_list, tab_content){
	var tabWidget = this;
	var tabChanged = function(ev){
	    tab_content.setCurrentWidget(ev.detail.widget);
	};
	var tabClosed = function(ev){
	    tab_content.removeWidget(ev.detail.widget, ev.detail.prev, ev.detail.next);
	};
	tab_list.addEventListener('change', tabChanged);
	tab_list.addEventListener('tabclose', tabClosed);
	if(!Binding.TabWidget.$init){
	    assignMethods(Binding.TabWidget, {
		addTab: function(widget, parent, label, closable){
		    tab_content.addWidget(widget);
		    tab_list.addTab(widget, parent, label, closable);
		}
	    });
	    Binding.TabWidget.$init = true;
	}
    }
};


