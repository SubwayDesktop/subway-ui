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
    HBox: document.registerElement('layout-hbox', {
	prototype: {
	    createdCallback: function(){
		Object.defineProperty(this, 'grow', {
		    get: function(){
			return this.getAttribute('grow');
		    },
		    set: function(value){
			this.setAttribute('grow', value);
		    }
		});
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    VBox: document.registerElement('layout-vbox', {
	prototype: {
	    createdCallback: function(){
		Object.defineProperty(this, 'grow', {
		    get: function(){
			return this.getAttribute('grow');
		    },
		    set: function(value){
			this.setAttribute('grow', value);
		    }
		});
	    },
	    __proto__: HTMLElement.prototype
	}
    }),
    Cell: document.registerElement('layout-cell', {
	prototype: {
	    createdCallback: function(){
		Object.defineProperty(this, 'grow', {
		    get: function(){
			return this.getAttribute('grow');
		    },
		    set: function(value){
			this.setAttribute('grow', value);
		    }
		});
	    },
	    __proto__: HTMLElement.prototype
	}
    })
};


