var keepitclean = {
    onLoad: function() {
	this.strings = document.getElementById("keepitclean-strings");
	dump ("keepitclean loaded\n");
    },

    toolbar_button_validate: function(e) {
	keepitclean.do_validate ();
    }
};

window.addEventListener("load", function () { keepitclean.onLoad(); }, false);
    
