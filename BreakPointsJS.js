
(function($) {
var App = {

		wW : $(window).width(),
		wH : $(window).height(),
		is_mobile : false,	
		is_landscape : false,	
		small_screen : false,
		big_screen : false,
		widthMin_desktop : 640,
		callbacks : new Array(),
		option_viewport : false,
		namespace : 'default',

		/**
		 * Init
		 * @param boolean : true si on utilise le changement de viewport sur mobile/tablette
		 */
		init : function(options){			
			for(var i in options) {
				this[i] = options[i];
			}
			this.addEventsListener();
		},

		/**
		 * Ready
		 * @param
		 */
		ready : function() {			
			this.ready_test_device();			
		},

		/**
		 * Load
		 * @param 
		 */
		load : function() {
			this.load_test_device();
		},

		/**
		 * Resize
		 * @param
		 */
		resize: function() {
			this.wW = $(window).width();
			this.resize_test_device();
		},

		addEventsListener : function() {
			var that = this;
			$(document).on('ready_big_screen.'+this.namespace,
				function()
					{		
						that.exec_callback('callback_big_screen');				
					} 
				);
			$(document).on('ready_small_screen.'+this.namespace,
				function()
					{
						that.exec_callback('callback_small_screen');				
					} 
				);
			$(document).on('ready_become_small_screen.'+this.namespace,
				function()
					{
						that.exec_callback('callback_become_small_screen');
					} 
				);
			$(document).on('ready_become_big_screen.'+this.namespace,
				function()
					{						
						that.exec_callback('callback_become_big_screen');
					} 
				);		


			$(document).on('load_big_screen.'+this.namespace,
				function()
					{					
						that.exec_callback('callback_load_big_screen');

					} 
				);
			$(document).on('load_small_screen.'+this.namespace,
				function()
					{
						that.exec_callback('callback_load_small_screen');
					} 
				);
			$(document).on('load_become_small_screen.'+this.namespace,
				function()
					{
						that.exec_callback('callback_load_become_big_screen');
					} 
				);
			$(document).on('load_become_big_screen.'+this.namespace,
				function()
					{
						that.exec_callback('callback_load_become_small_screen');
					} 
				);											

			$(window).on( "orientationchange."+this.namespace, 
				function()
					{							
						that.change_landscape_delay();

						if(this.option_viewport) {
							that.change_viewport_delay();
						}				
					} 
				);
			
		},

		on_big_screen : function(callback) {
			this.set_callback(callback, 'callback_big_screen');
		},
		on_small_screen : function(callback) {
			this.set_callback(callback, 'callback_small_screen');
		},
		on_become_big_screen : function(callback) {
			this.set_callback(callback, 'callback_become_big_screen');
		},
		on_become_small_screen : function(callback) {
				this.set_callback(callback, 'callback_become_small_screen');
			},
		on_load_big_screen : function(callback) {
				this.set_callback(callback, 'callback_load_big_screen');
			},
		on_load_small_screen : function(callback) {
				this.set_callback(callback, 'callback_load_small_screen');
			},
		on_load_become_big_screen : function(callback) {
				this.set_callback(callback, 'callback_load_become_big_screen');
			},
		on_load_become_small_screen : function(callback) {
				this.set_callback(callback, 'callback_load_become_small_screen');
			},

		set_callback : function(callback, key) {
			if(typeof this.callbacks[key] != 'object')
				this.callbacks[key] = new Array();

			this.callbacks[key].push(callback);
		},

		exec_callback : function(key)
		{
			if (typeof this.callbacks[key] != "undefined") {
				var nbFct = this.callbacks[key].length;
				for(var i = 0; i < nbFct; i++)
					this.callbacks[key][i]();
			}
		},

		ready_test_device : function  (widthMin_desktop) {
			
			if (this.wW > this.widthMin_desktop) {
				this.big_screen = true;
				$(document).trigger('ready_big_screen.'+this.namespace);
			}
			else {
				this.small_screen = true;
				$(document).trigger('ready_small_screen.'+this.namespace);
			}

			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

				this.is_mobile = true;

				if(this.option_viewport)
				{
					this.change_viewport();
				}				
				if (this.wW > this.wH) {						
					this.is_landscape = true;							
					$('body').addClass('is_landscape');	
				}				
			}
			
		},

		load_test_device : function () {			
			if (this.big_screen) {				
				$(document).trigger('load_big_screen.'+this.namespace);
			}
			else {
				$(document).trigger('load_small_screen.'+this.namespace);			
			}
		},

		resize_test_device : function (widthMin_desktop) {				
			if (!this.is_mobile) {				
				if (this.wW >= this.widthMin_desktop) {				
					if (!this.big_screen) {						
		        		$(document).trigger('ready_become_big_screen.'+this.namespace);  
		        		$(document).trigger('load_become_big_screen.'+this.namespace);
					}
		            this.small_screen = false;              
		            this.big_screen = true; 	
				}
				else {		            
					if (!this.small_screen || this.is_mobile) {
						$(document).trigger('ready_become_small_screen.'+this.namespace);	
						$(document).trigger('load_become_small_screen.'+this.namespace);
					}
					this.small_screen = true;
		        	this.big_screen = false;
				}
			}
		},

		change_viewport : function () {
			//alert('viewport change');
	        var vpw = '1024';
	        var viewport = document.querySelector("meta[name=viewport]");

	        windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
	        windowHeight = window.innerHeight ? window.innerHeight : $(window).height();

	        //calcul width and Height for Firefox Android
	        screenAvailWidth = screen.availWidth;
	        screenAvailHeight = screen.availHeight;        

	        if (windowHeight < windowWidth && !$('html').hasClass('ff')) {
	            vpw = '1024';
	            viewport.setAttribute('content', 'width=' + vpw);
	        }
	        else if (windowHeight > windowWidth && !$('html').hasClass('ff')) {
	            vpw = '640';
	            viewport.setAttribute('content', 'width=' + vpw);
	        }
	        else if (screenAvailHeight < screenAvailWidth && $('html').hasClass('ff')) {
	            vpw = '1024';
	            $('head').append("<meta name='viewport' content='width=" + vpw + ">");
	        }
	        else if (screenAvailHeight > screenAvailWidth && $('html').hasClass('ff')) {
	            vpw = '640';
	            $('head').append("<meta name='viewport' content='width=" + vpw + ">");
	        };		
		},

		change_viewport_delay : function() {
			setTimeout(this.change_viewport, 500);
		},

		change_landscape_delay : function() {
			setTimeout(this.change_landscape, 100);
		},

		change_landscape : function () {	
			windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
	        windowHeight = window.innerHeight ? window.innerHeight : $(window).height();

			if (windowHeight < windowWidth) {
	           this.is_landscape = true;		           
	           $('body').addClass('is_landscape');
	        }
	        else {
	            this.is_landscape = false;
	            $('body').removeClass('is_landscape');
	        }	        
			
		}
	}

window.AppCreate = App;

$(document).trigger('appReady');

})(jQuery);
