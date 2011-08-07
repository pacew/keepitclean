var keepitclean = {};
keepitclean.verbose = 0;

keepitclean.initial_load = function(ev) {
    // Find the most recently used window
    var mediator
	= Components.classes['@mozilla.org/appshell/window-mediator;1']
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

    itemLabel.value = "validator loading...";

    keepitclean.count = 0;
    keepitclean.toolbar_icon = itemLabel;

    keepitclean.ready = 1;
};

/* tidyBrowser.js:getHtmlFromCache() */
keepitclean.get_html_from_cache = function () {
    var doc = window.content.document;

    var webNav = null;

    var win = doc.defaultView;
    if (win == window) {
	win = _content;
    }

    var ifRequestor
	= win.QueryInterface(Components.interfaces.nsIInterfaceRequestor);

    webNav = ifRequestor.getInterface(Components.interfaces.nsIWebNavigation);

    var PageLoader
	= webNav.QueryInterface (Components.interfaces.nsIWebPageDescriptor);

    var pageCookie = PageLoader.currentDescriptor;

    var shEntry = pageCookie.QueryInterface(Components.interfaces.nsISHEntry);

    var url = doc.URL;
    var urlCharset = doc.characterSet;

    var ios = Components.classes["@mozilla.org/network/io-service;1"]
	.getService(Components.interfaces.nsIIOService);
    var channel = ios.newChannel (url, urlCharset, null);

    channel.loadFlags |= Components.interfaces.nsIRequest.VALIDATE_NEVER;
    channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_FROM_CACHE;
    channel.loadFlags
	|= Components.interfaces.nsICachingChannel.LOAD_ONLY_FROM_CACHE;

    var cacheChannel
	= channel.QueryInterface(Components.interfaces.nsICachingChannel);
    
    cacheChannel.cacheKey = shEntry.cacheKey;

    var stream = channel.open ();

    const scriptableStream
	= Components.classes["@mozilla.org/scriptableinputstream;1"]
	.createInstance(Components.interfaces.nsIScriptableInputStream);

    scriptableStream.init (stream);

    var s = "";
    while (scriptableStream.available () > 0) {
	s += scriptableStream.read (scriptableStream.available ());
    }

    scriptableStream.close ();
    stream.close ();

    var ucConverter
	= Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
	.getService (Components.interfaces.nsIScriptableUnicodeConverter);
    ucConverter.charset = urlCharset;
    var s2 = ucConverter.ConvertToUnicode (s);

    return (s2);
}

keepitclean.set_status = function (flag, msg) {
    var style;

    if (0) {
	msg = msg + " (" + keepitclean.count + ")";
    }

    if (flag == 0) {
	style = "color:red";
    } else {
	style = "color:green";
    }

    keepitclean.toolbar_icon.value = msg;
    keepitclean.toolbar_icon.setAttribute ("style", style);

    keepitclean.validation_result = msg;
}

keepitclean.every_page_load = function (ev) {
    if (! keepitclean || ! keepitclean.ready)
	return;

    var doc = ev.originalTarget;

    if (! doc instanceof HTMLDocument)
	return;

    while (doc.defaultView.frameElement)
	doc = doc.defaultView.frameElement.ownerDocument;

    if (keepitclean.verbose)
	dump ("loaded " + doc + "\n");			       

    keepitclean.count++;

    var html = keepitclean.get_html_from_cache ();

    var results = h5val.validate (html);

    if (results == null) {
	keepitclean.set_status (1, "ok");
    } else {
	keepitclean.set_status (0, results);
    }
} 



window.addEventListener("load",
			function () {keepitclean.initial_load();},
			false);

gBrowser.addEventListener ("load",
			   function (ev) { keepitclean.every_page_load (ev); },
			   true);
