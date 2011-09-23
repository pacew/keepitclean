var keepitclean = {};
keepitclean.verbose = 0;
keepitclean.enabled = 1;
keepitclean.view_win = null;
keepitclean.results = "";

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

    itemLabel.value = "validation ready";

    itemLabel.addEventListener("click",
			       function () {keepitclean.toggle();},
			       false);

    keepitclean.count = 0;
    keepitclean.toolbar_icon = itemLabel;

    keepitclean.ready = 1;
}

keepitclean.enable_click = function (elt) {
    if (elt.checked) {
	dump ("enable validator\n");
	keepitclean.enabled = 1;
	keepitclean.set_status (1, "ready");
    } else {
	dump ("disable validator\n");
	keepitclean.enabled = 0;
	keepitclean.set_status (0, null);
    }
}

keepitclean.view_load = function (win) {
    var XHTML_NS = "http://www.w3.org/1999/xhtml";
    var doc = win.document;
    var parent = doc.getElementById ("kic-view");

    var len = 0;
    if (keepitclean.results)
	len = keepitclean.results.lines.length;

    for (var i = 0; i < len; i++) {
	var arr = keepitclean.results.lines[i];
	var linenum = arr[0];
	var text = arr[1];

	var elt_div = doc.createElementNS (XHTML_NS, "div");
	elt_div.setAttribute ("class", "kic-view-line");

	var elt_linenum = doc.createElementNS (XHTML_NS, "div");
	elt_linenum.setAttribute ("class", "kic-view-linenum");
	elt_linenum.appendChild (doc.createTextNode ("" + linenum));
	elt_div.appendChild (elt_linenum);

	var elt_text = doc.createElementNS (XHTML_NS, "div");

	var classes = "kic-view-text";
	if (keepitclean.results.linenum == linenum)
	    classes += " kic-view-highlight";
	elt_div.setAttribute ("class", classes);

	elt_text.appendChild (doc.createTextNode (text));
	elt_div.appendChild (elt_text);

	parent.appendChild (elt_div);

	var elt_clear = doc.createElementNS (XHTML_NS, "div");
	elt_clear.setAttribute ("class", "kic-view-clear");
	parent.appendChild (elt_clear);
    }

    var elt_summary = doc.createElementNS (XHTML_NS, "h2");
    var summary = keepitclean.summary;
    if (summary) {
	elt_summary.appendChild (doc.createTextNode (summary));
	parent.appendChild (elt_summary);
    }

    var elt_enable = doc.getElementById ("kic-enable");
    if (! keepitclean.enabled)
	elt_enable.checked = false;
    elt_enable.addEventListener("click",
				function () {
				    keepitclean.enable_click(elt_enable);
				},
				false);
}


keepitclean.toggle = function () {
    var win = keepitclean.view_win;

    if (win && ! win.closed ) {
	win.close ();
	keepitclean.view_win = null;
	return;
    }

    win = window.open ("chrome://keepitclean/content/view.xul", "view",
		       "chrome,width=600,height=400");
    keepitclean.view_win = win;
    
    win.addEventListener("load",
			 function () {keepitclean.view_load(win);},
			 false);
}

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

    if (keepitclean.enabled == 0) {
	keepitclean.toolbar_icon.value = "validation disabled";
	keepitclean.toolbar_icon.setAttribute ("style", "");
	return;
    }

    if (msg == null || msg == "") {
	keepitclean.toolbar_icon.value = "validation ready";
	keepitclean.toolbar_icon.setAttribute ("style", "");
	return;
    }

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
    if (! keepitclean || ! keepitclean.ready || ! keepitclean.enabled)
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

    keepitclean.results = h5val.validate (html);

    if (keepitclean.results == null) {
	keepitclean.set_status (1, "ok");
    } else {
	if (keepitclean.verbose) {
	    dump ("results full: \n");
	    dump (keepitclean.results.lines);
	}

	keepitclean.summary = "" + keepitclean.results.linenum + ": " +
	    keepitclean.results.summary;

	keepitclean.set_status (0, keepitclean.summary);
    }
} 

window.addEventListener("load",
			function () {keepitclean.initial_load();},
			false);

gBrowser.addEventListener ("load",
			   function (ev) { keepitclean.every_page_load (ev); },
			   true);
