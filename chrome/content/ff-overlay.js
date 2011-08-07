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
};

window.addEventListener("load", function () { keepitclean.onFirefoxLoad(); }, false);

gBrowser.addEventListener ("load",
			   function (ev) {
			       var doc = ev.originalTarget;

			       if (! doc instanceof HTMLDocument)
				   return;

			       while (doc.defaultView.frameElement)
				   doc = doc.defaultView.frameElement.ownerDocument;

			       dump ("loaded " + doc + "\n");			       
			   }, 
			   true);
