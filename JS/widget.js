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
		    if(!prev)
			prev = widget.previousElementSibling;
		    if(!next)
			next = widget.nextElementSibling;
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
		this.tab_list = null;
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    TabList: document.registerElement('widget-tab-list', {
	prototype: {
	    createdCallback: function(){
		this.$map = new Map();
		this.$currentTab = null;
		this.$dragSrc = null;
	    },
	    addTab: function(widget, label_text, closable){
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
		this.$map.set(tab, widget);
		// ----
		var tabClicked = function(){
		    tabList.$change(this);
		};
		var dragstart = function(ev){
		    tabList.$dragSrc = this;
		    ev.dataTransfer.effectAllowed = 'move';
		    ev.dataTransfer.setData('text/plain', 'anything');
		};
		var dragover = function(ev){
		    ev.preventDefault();
		};
		var drop = function(ev){
		    var src = tabList.$dragSrc;
		    ev.preventDefault();
		    ev.stopPropagation();
		    /* avoid dragging from another tab list */
		    if(!src)
			return;
		    if(this != src)
			tabList.$swapTab(this, src);
		    tabList.$dragSrc = null;
		};
		tab.addEventListener('click', tabClicked);
		tab.addEventListener('dragstart', dragstart);
		tab.addEventListener('dragover', dragover);
		tab.addEventListener('drop', drop);
		var closeButtonClicked;
		if(closable){
		    closeButtonClicked = function(ev){
			tabList.$tabclose(this.parentElement);
			ev.stopPropagation();
		    };
		    close_button.addEventListener('click', closeButtonClicked);
		}
		this.appendChild(tab);
	    },
	    $swapTab: function(tab1, tab2){
		var temp = create('widget-tab');
		this.insertBefore(temp, tab1);
		this.insertBefore(tab1, tab2);
		this.insertBefore(tab2, temp);
		this.removeChild(temp);
	    },
	    $change: function(tab){
		var widget = this.$map.get(tab);
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
		var widget = this.$map.get(tab);
		var prev = tab.previousElementSibling;
		var next = tab.nextElementSibling;
		if(tab == this.$currentTab){
		    if(next){
			this.$currentTab = next;
			next.dataset.current = 'true';
		    }else if(prev){
			this.$currentTab = prev;
			prev.dataset.current = 'true';
		    }else{
			this.$currentTab = null;
		    }
		}
		this.removeChild(tab);
		this.$map.delete(tab);
		
		var ev = new CustomEvent('tabclose', {
		    detail: {
			widget: widget,
			prev: (prev)? this.$map.get(prev): null,
			next: (next)? this.$map.get(next): null
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
    Message: document.registerElement('widget-message', {
	prototype: {
	    createdCallback: function(){

	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    MessageStream: document.registerElement('widget-message-stream', {
	prototype: {
	    createdCallback: function(){

	    },
	    __proto__: HTMLElement.prototype
	}
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
		addTab: function(widget, label, closable){
		    tab_content.addWidget(widget);
		    tab_list.addTab(widget, label, closable);
		}
	    });
	    Binding.TabWidget.$init = true;
	}
    }
};


