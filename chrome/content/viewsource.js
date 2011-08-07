window.addEventListener (
    "load",
    function () {
	var message = window.opener.keepitclean.validation_result;

	var elt = document.getElementById ("keepitclean-message");
	elt.label = message;
    },
    false);

