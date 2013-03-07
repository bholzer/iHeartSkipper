var s = document.createElement('script');
s.src = chrome.extension.getURL("skipper.js");
var bgImage = chrome.extension.getURL("images/player_btns.png");
s.setAttribute('bgImage',bgImage);
s.id = "inject"
s.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

