/*
 * InputCLearButton jQuery Plugin
 * 
 *
 * Copyright (c) 2011 Kuehne Stephan
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 0.1
 */
(function($){
	
	 $.InputClearButtons= function(button,input, options){

		    var $button = $(button);
	    	var $input = $(input);   
	    	var showing = false;
			$.InputClearButtons.defaultOptions = {
				    fadeOpacity: 0.5, // Once a input has focus, how transparent should the label be
						fadeDuration: 300 // How long should it take to animate from 1.0 opacity to the fadeOpacity
			};
			var options=$.extend({},$.InputClearButtons.defaultOptions, options);
			
			function init(){
				// on Reload initialize the Button correct
				if(inputIsEmpty()){
					$button.css({opacity: 0.0,visibility: 'hidden'});					
				}else{
					$button.css({opacity: 1.0,visibility: 'visible'});
					$button.click(onBtnClick);
					showing=true;
				}
				$input.change(onChange)
				.bind('onPropertyChange',onChange)
				.focus(onFocus)
				.bind('cut', onCut)  
				.bind('paste', onPaste)  
				.blur(onBlur);
	        };
	       
	        function hideButton(){
	        	$button.stop().animate({opacity:0}, options.fadeDuration,handleVisibilityAfterHideAnim);
	        }
	        /**
	         * changes the CSS Visibility after the hiding animation
	         */
	        function handleVisibilityAfterHideAnim(){
	    		showing=false;   
	        	$button.unbind('click');
	    		$button.css({visibility:'hidden'});
	        }
	        function showButton(){        	
	        	$button.css({visibility: 'visible'});
	        	$button.click(onBtnClick);
	        	$button.stop().animate({opacity:1}, options.fadeDuration);
	        	showing=true;	
	        }
	        
	        function onBtnClick(event){
			    if(!inputIsEmpty()){
			    	$input.val("");
			    	hideButton();
			    	$input.focus();	
			    	
			    }            
			}
	        
	        /**
			 * onFocus add keyListener
			 **/
			function onFocus(event){
				$input.bind('keydown.inputclearBtn',onKeyStroke);
			};

	        function onBlur(event){
	        	$input.unbind('keydown.inputclearBtn');
	        	if(inputIsEmpty()){
	        		hideButton();
	        	}
	        }
	        function onCut(event){
	        	if(input.selectionStart===0&&input.selectionEnd==input.value.length){
	        		hideButton();
	        		//$input.change();
	        	}
	        }
	        function onPaste(event){
	        	if(inputIsEmpty()){
	        		showButton();
	        		//$input.change();
	        	} 
	        }
	        function onChange(event){
	        	if(!showing){
	        		if(!inputIsEmpty()){
	        	       showButton();
	        		}
	        	}else{
	        		if(inputIsEmpty()){
	        			hideButton();
	        		}
	        	}		
	        	
	        };

			function onKeyStroke(event){
				if(input.value.length>2)
					return;
				switch(event.keyCode){//all the useless keys
					case 16://ctrl
					case 17:
					case 18:
					case 19:
					case 20:
					case 27:
					case 34:
					case 33:
					case 36:
					case 35:
					case 91: //windowstaste
					case 45://Insert
						return;
						break;					
					case  8://delete
					case 46://remove
						//console.log(input.value.length);
						if(input.value.length<=1){
							/* in the case you hold the keys pressed, the hide animation dosn't work
							 * so we unbind the keydown, hide the button and bind a keyup event with 
							 * the rebindkeydown() function, which then changes the keydown keyup events back   
							 */
							$input.unbind('keydown.inputclearBtn');
							hideButton();
							$input.bind('keyup.inputclearBtn',rebindkeydown);
						}
						return;
						break;
				};
				if(inputIsEmpty()&&!showing){
					showButton();
				};
			};
			/**
			 * after you finally release the delete key ;-) 
			 */
			function rebindkeydown(){
				$input.unbind('keyup.inputclearBtn');
				$input.bind('keydown.inputclearBtn',onKeyStroke);
			}
			function inputIsEmpty(){
				return input.value.length==0;
			}
			
			// Run the initialization method
			init();
			
	};  
	    
    $.fn.inputClearButtons  = function(options){
        return this.each(function(){
        		
		// Find input or textarea based on for= attribute
		// The for attribute on the label must contain the ID
		// of the input or textarea element
    	//jQuery("#"+event.currentTarget.attributes['for'].value);
        	
		var for_attr = this.getAttribute('for');
		if( !for_attr ) return; // Nothing to attach, since the for input wasn't used			
		// Find the referenced input or textarea element
		var $input = $(
			"input#" + for_attr + "[type='text']," + 
			"textarea#" + for_attr
			);
		
		if( $input.length == 0) return; // Again, nothing to attach
		
		// Only create object for input[text], input[password], or textarea
        (new $.InputClearButtons(this, $input[0], options));
        });
    };
	
})(jQuery);