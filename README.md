JQ_Highlight
============
By Emily Campbell, [Steven Bedrick](mailto:bedricks@ohsu.edu)

A JQuery plugin to handle user selection of text in an element. By default, this plugin
wraps user-selected text in a `<span>` element with a class name of `'selected'`. 

Options:

`wrap_node`: (default: `true`) whether or not to wrap selected text in a new node.

`wrapper_class_name`: (default: `'selected'`) the class name to apply to the wrapper node

`wrapper_id_template`: (default: `'select_wrap_'`) the template to use for the wrapper node DOM id. It will be automatically followed by a simple counter variable (e.g., `'select_wrap_1'`,`'select_wrap_2'`, etc.)

`on_select_callback_fn`: (default: `null`) a callback function that fires after the selection takes place. Five arguments are given to the callback:

1. The DOM object that the selection originated from
2. The Range object created by the selection
3. The selected text
4. The DOM wrapper node, if wrap_node is true.
5. A flag indicating whether or not an exception occurred due to a badly-overlapping selection (see note below). True, or null

If no text is selected (i.e., the user somehow manages to create a zero-length selection), the callback function will not fire.

KNOWN LIMITATIONS:
------------------
- The plugin's behavior is undefined when selections overlap. Anybody who feels like dealing with this, please feel free. Different user agents seem to handle this differently.
- If an overlapping selection ends in the middle of an existing selection (rather than completely enclosing an existing selection), an exception occurs. If this happens, the plugin passes a flag to that effect to the callback function. Again, different user agents seem to handle this situation differently. See previous note about external help being welcome.
- If the user's selection ends outside of the element that `enable_select()` is called on, JQ_Highlight doesn't get the `mouseup` event and therefore doesn't catch the selection. Anybody who wants to help, etc.

Acknowledgments:
----------------
This project includes some code taken from [QuirksMode.org](http://www.quirksmode.org/) as well as from [TinyMCE](http://tinymce.moxiecode.com).