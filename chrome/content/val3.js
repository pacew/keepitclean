function dump_obj (obj) {
    var name;
    dump ("dump_obj(" + obj + ")\n");
    for (name in obj) {
	dump (name + " = " + obj[name] + "\n");
    }
}

function dump_val (str, val) {
    dump (str);
    dump (" = ");
    if (val === null) {
	dump ("(null)");
    } else {
	dump (val);
    }
    dump ("\n");
}

/* tidyBrowser.js:getHtmlFromCache() */
function get_html_from_cache () {
    dump ("get_html_from_cache\n");

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


keepitclean.do_validate = function () {
    dump ("do_validate\n");

    var x = get_html_from_cache ();
    dump_val ("x", x);

    window.validation_results = "results: " + new Date ();

    var r = window.open ("chrome://keepitclean/content/results.xul",
			 "validate-results-window",
			 "chrome,width=600,height=300,centerscreen");
}
