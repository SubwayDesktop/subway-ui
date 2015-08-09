'use strict';


var Layout = {
    Container: document.registerElement('layout-container', {
	prototype: {
	    createdCallback: function(){
		Object.defineProperty(this, 'full', {
		    get: function(){
			return this.getAttribute('full');
		    },
		    set: function(value){
			this.setAttribute('full', value);
		    }
		});
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    HBoxLayout: document.registerElement('layout-HBox', {
	prototype: {
	    __proto__: HTMLElement.prototype
	}
    }),
    VBoxLayout: document.registerElement('layout-VBox', {
	prototype: {
	    __proto__: HTMLElement.prototype
	}
    }),
    Cell: document.registerElement('layout-cell', {
	prototype: {
	    __proto__: HTMLElement.prototype,
	    createdCallback: function(){
		Object.defineProperty(this, 'fixed', {
		    get: function(){
			return this.getAttribute('fixed');
		    },
		    set: function(value){
			this.setAttribute('fixed', value);
		    }
		});
	    }
	}
    })
};


