keepitclean.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ keepitclean.showFirefoxContextMenu(e); }, false);
};

keepitclean.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
//  document.getElementById("context-keepitclean").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { keepitclean.onFirefoxLoad(); }, false);
