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
    var placeholderWidth = _prefs.getInt("rsW"),
        placeholderHeight = _prefs.getInt("rsH"),
        scrollHoriz = (_prefs.getInt("scroll-horizontal") > 0
          ? _prefs.getInt("scroll-horizontal") : 0),
        scrollVert = (_prefs.getInt("scroll-vertical") > 0
          ? _prefs.getInt("scroll-vertical") : 0),
        zoom = _prefs.getInt("zoom");

    //TODO: Apply scalability (zoom) CSS to iframe

    var container = document.getElementById('webpage-container'),
        frame = container.firstElementChild,
        aspectRatio = placeholderHeight/placeholderWidth * 100;
    container.style.visibility = "hidden";

    /* set the padding-bottom with the aspect ratio % to complete implementation
       of responsiveness
     */
    container.setAttribute("style","padding-bottom:" + aspectRatio + "%");
    frame.setAttribute("style", "margin: " + "-" + scrollVert + "px 0 0 -" +
      scrollHoriz + "px");

    frame.onload = function() {
      _readyEvent();
    };

    frame.setAttribute("src", _url);
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
      }
    }

    _createPage();
  }

  function _readyEvent(){
    var container = document.getElementById('webpage-container');

    container.style.visibility = "visible";

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

