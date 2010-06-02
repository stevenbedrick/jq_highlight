/*
*       JQ_Highlight
*       Emily Campbell, Steven Bedrick
*
*
*   A JQuery plugin to handle user selection of text in an element. By default, this plugin
*   wraps user-selected text in a <span> element with a class name of 'selected'. 
*   Options:
*       wrap_node: (default: true) whether or not to wrap selected text in a new node.
*       wrapper_class_name: (default: 'selected') the class name to apply to the wrapper node
*       wrapper_id_template: (default: 'select_wrap_') the template to use for the wrapper node DOM id. 
*                               It will be automatically followed by a simple counter variable 
*                               (e.g., 'select_wrap_1','select_wrap_2', etc.)
*       on_select_callback_fn: (default: null) a callback function that fires after the selection
*                               takes place. Five arguments are given to the callback:
*                                1. The DOM object that the selection originated from
*                                2. The Range object created by the selection
*                                3. The selected text
*                                4. The DOM wrapper node, if wrap_node is true.
*                                5. A flag indicating whether or not an exception occurred due  
*                                   to a badly-overlapping selection (see note below). True, or null
*                               If no text is selected (i.e., the user somehow manages to create
*                                a zero-length selection), the callback function will not fire.
*
*
*
*   KNOWN LIMITATIONS:
*       -   The plugin's behavior is undefined when selections overlap. Anybody who feels like
*           dealing with this, please feel free. Different user agents seem to handle this differently.
*       -   If an overlapping selection ends in the middle of an existing selection (rather than 
*           completely enclosing an existing selection), an exception occurs. If this happens, the plugin
*           passes a flag to that effect to the callback function. Again, different user agents seem to
*           handle this situation differently. See previous note about external help being welcome.
*       -   If the user's selection ends outside of the element that enable_select is called on,
*           JQ_Highlight doesn't get the mouseup even and therefore doesn't catch the selection.
*           Anybody who wants to help, etc.
*
*/

jQuery.fn.enable_select = function(options) {

    settings = jQuery.extend({
        wrap_node: true,
        wrapper_class_name: 'selected',
        wrapper_id_template: 'select_wrap_',
        on_select_callback_fn: null
    },
    options);
    
    // setup code stolen from tinymce:
    var ua = navigator.userAgent;
    
    // Browser checks
	this.isOpera = window.opera && opera.buildNumber;
	this.isWebKit = /WebKit/.test(ua);
	this.isIE = !this.isWebKit && !this.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(navigator.appName);
	this.isIE6 = this.isIE && /MSIE [56]/.test(ua);
	this.isGecko = !this.isWebKit && /Gecko/.test(ua);
	this.isMac = ua.indexOf('Mac') != -1;
	this.isAir = /adobeair/i.test(ua);
    
    
    

    var select_count = 0; // used to calculate IDs for selection wrapper nodes

    /* ----------------------------------------------------------------------
   * getRangeOjbect()
   * stolen from QuirksMode page on ranges
   * ----------------------------------------------------------------------*/
    var getRangeObject = function(selectionObject) {
        if (selectionObject.getRangeAt) {
            return selectionObject.getRangeAt(0);
        } else {
            // Safari!
            var range = document.createRange();
            range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
            range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
            return range;
        }
    };


    // wrap_node: boolean, whether to wrap selection in a node
    // wrapper_node_id: id template to use for wrapper node
    // wrapper_node_class: class to use for wrapper node
    var highlightText = function(wrap_node, wrapper_node_id, wrapper_node_class) {

        var userSelection;
        var selectedText;


        var to_return = {}

        //get the userSelection;
        if (window.getSelection) {
            userSelection = window.getSelection();
        } else if (document.selection) {
            // should come last; Opera!
            userSelection = document.selection.createRange();
        }

        if (userSelection.text) {
            selectedText = userSelection.Text;
        } else {
            selectedText = userSelection;
        }

        to_return['selected_text'] = selectedText;

        // ignore clicks in the document area where no text was selected
        if (selectedText.toString().length > 0) {
            // do we want to do a wrapper node?
            if (wrap_node) {
                rangeObject = getRangeObject(userSelection);

                to_return['range_object'] = rangeObject;

                var newNode = document.createElement("span");

                // figure out what to use for an id for the wrapper:
                select_count++;
                var wrapper_id_to_use = wrapper_node_id + select_count;

                newNode.id = wrapper_id_to_use;
                newNode.className = wrapper_node_class;
                try {
                    rangeObject.surroundContents(newNode);
                    to_return['wrapper_node'] = newNode;
                } catch (e) {
                    // almost certainly here because of a badly-overlapping selection- do nothing
                    // and leave to_return['wrapper_node'] empty.
                    to_return['bad_overlap'] = true;
                }

                
            }
        } else {
            // no text selected- return null
            to_return = null;
        }

        return to_return;

    };

    this.mouseup(function() {

        var results = highlightText(settings['wrap_node'], settings['wrapper_id_template'], settings['wrapper_class_name']);

        // do callback?
        if (results) {
            if (settings['on_select_callback_fn'] != null) {
                settings['on_select_callback_fn'](this, results['range_object'], results['selected_text'], results['wrapper_node'], results['bad_overlap']);
            }
        }

    });
    // ends mouseup

};