var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Controller = (function($,gadgets) {
  "use strict";

  // private variables
  var _prefs = null;

  // private functions

  // public space
  return {
    init: function(){
      _prefs = new gadgets.Prefs();
    }
  }

})($,gadgets);

