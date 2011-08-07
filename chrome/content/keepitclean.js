var keepitclean = {};

keepitclean.toolbar_button_validate = function(e) {
    keepitclean.do_validate ();
}

keepitclean.onFirefoxLoad = function(event) {
    dump ("onFirefoxLoad()\n");

    // Find the most recently used window
    var mediator = Components.classes['@mozilla.org/appshell/window-mediator;1']
        .getService(Components.interfaces.nsIWindowMediator);
    var doc = mediator.getMostRecentWindow("navigator:browser").document;

    // Get the add-on bar for that window
    var addonBar = doc.getElementById("addon-bar");

    // Construct the new toolbar item
    var newItem = doc.createElement("toolbaritem");
    var itemLabel = doc.createElement("label");
    // Add the item to the toolbar and set its text label
    newItem.appendChild(itemLabel);
    addonBar.appendChild(newItem);

    itemLabel.value = "Hello world";

    keepitclean.count = 0;
    keepitclean.toolbar_icon = itemLabel;

    keepitclean.ready = 1;
};

window.addEventListener("load", function () { keepitclean.onFirefoxLoad(); }, false);

keepitclean.set_status = function (flag) {
    var msg, style;

    if (flag == 0) {
	msg = "validation error " + keepitclean.count;
	style = "color:red";
    } else {
	msg = "validate ok " + keepitclean.count;
	style = "color:green";
    }

    keepitclean.toolbar_icon.value = msg;
    keepitclean.toolbar_icon.setAttribute ("style", style);

    keepitclean.validation_result = msg;
}

gBrowser.addEventListener (
    "load",
    function (ev) {
	dump ("gBrowser load event\n");
	
	if (! keepitclean || ! keepitclean.ready)
	    return;

	var doc = ev.originalTarget;

	if (! doc instanceof HTMLDocument)
	    return;

	while (doc.defaultView.frameElement)
	    doc = doc.defaultView.frameElement.ownerDocument;

	dump ("loaded " + doc + "\n");			       

	window.foobar = "foobar\n";

	keepitclean.count++;
	keepitclean.set_status (keepitclean.count & 1);
    }, 
    true);
