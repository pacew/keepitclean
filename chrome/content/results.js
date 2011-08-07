window.addEventListener("load",
			function () {
			    dump ("*** results window loaded\n");
			    var r = window.opener.validation_results;
			    var elt = document
				.getElementById ("validation-results-text");

			    if (r && elt) {
				dump ("results: ");
				dump (r);
				dump ("\n");
				elt.setAttribute ("value", r);
			    }
			}, false);

