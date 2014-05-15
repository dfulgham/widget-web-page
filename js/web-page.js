var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Controller = (function(gadgets) {
  "use strict";

  // private variables
  var _prefs = null,
      _url = "",
      _intervalId = null;

  // private functions
  function _createPage(){
    var gadgetWidth = _prefs.getInt("rsW"),
        gadgetHeight = _prefs.getInt("rsH"),
        scrollHoriz = _prefs.getInt("scroll-horizontal"),
        scrollVert = _prefs.getInt("scroll-vertical"),
        zoom = _prefs.getInt("zoom");

    console.log(gadgetWidth, gadgetHeight, scrollHoriz, scrollVert, zoom);

    // TODO: Apply CSS, load iframe, callback handler should send ready event

    // TODO: temporarily calling it here for testing, will be moved later
    _readyEvent();
  }

  function _onAdditionalParams(name, value){

    if (name == "additionalParams") {
      if (value) {
        value = JSON.parse(value);

        _url = value["url"];

        // Add http:// if no protocol parameter exists
        if (_url.indexOf("://") == -1) {
          _url = "http://" + _url;
        }

        console.log(_url);
      }
    }

    _createPage();
  }

  function _readyEvent(){
    gadgets.rpc.call('', 'rsevent_ready', null, _prefs.getString("id"),
      false, false, false, true, false);
  }

  function _refreshPage() {

  }

  // public space
  return {
    init: function(){
      _prefs = new gadgets.Prefs();

      var id = _prefs.getString("id"),
          backgroundColor = _prefs.getString("backgroundColor");

      // Set background colour
      if (backgroundColor != "") {
        document.body.style.background = backgroundColor;
      }

      // Retrieve additional params
      if (id) {
        gadgets.rpc.register("rsparam_set_" + id, _onAdditionalParams);
        gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
      }

    }
  }

})(gadgets);

