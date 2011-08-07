function dump_obj (obj) {
    var name;
    dump ("dump_obj(" + obj + ")\n");
    for (name in obj) {
	var val = obj[name];
	if (val == null || val == "")
	    continue;
	if (typeof val == "function") {
	    /* nothing */
	} else {
	    dump (name + " = " + obj[name] + "\n");
	}
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


dump ("viewsource.js\n");

if (0 && window.opener) {
    dump ("validation result = ");
    dump (window.opener.keepitclean.validation_result);
    dump ("\n");
}

/*
var elt = document.getElementById ("status-bar");
dump_val ("elt", elt);
*/

window.addEventListener (
    "load",
    function () {
	var message = window.opener.keepitclean.validation_result;
	dump_val ("msg", message);

	var elt = document.getElementById ("keepitclean-message");
	elt.setAttribute ("value", message);
    },
    false);

