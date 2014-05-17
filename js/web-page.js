var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Controller = (function(gadgets) {
  "use strict";

  // private variables
  var _prefs = null,
      _url = "",
      _dataRefresh = null,
      _intervalId = null,
      _initialLoad = true;

  // private functions
  function _createPage(){
    var container = document.getElementById('webpage-container'),
        frame = container.firstElementChild,
        aspectRatio =  (_prefs.getInt("rsH")/_prefs.getInt("rsW")) * 100,
        scrollHoriz = (_prefs.getInt("scroll-horizontal") > 0
            ? _prefs.getInt("scroll-horizontal") : 0),
        scrollVert = (_prefs.getInt("scroll-vertical") > 0
            ? _prefs.getInt("scroll-vertical") : 0),
        zoom = _prefs.getInt("zoom");

    /* Hiding iframe container, visible when the iframe successfully loads */
    container.style.visibility = "hidden";

    /* set the padding-bottom with the aspect ratio % (responsive)
     */
    container.setAttribute("style","padding-bottom:" + aspectRatio + "%");

    /* setting the scroll margins on the iframe */
    frame.setAttribute("style", "margin: " + "-" + scrollVert + "px 0 0 -" +
      scrollHoriz + "px");

    //TODO: Apply scalability (zoom) CSS to iframe

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
    _loadFrame();
  }

  function _loadFrame() {
    var container = document.getElementById('webpage-container'),
        frame = container.firstElementChild;

    if(_initialLoad){
      frame.onload = function() {
        _initialLoad = false;
        frame.onload = null;
        _readyEvent();
      }
    }

    frame.setAttribute("src", _url);
  }

  function _readyEvent(){
    var container = document.getElementById('webpage-container');

    /* Show the iframe container */
    container.style.visibility = "visible";

    /* Run setInterval to reload page based on the data refresh value */
    if(_dataRefresh > 0){
      _intervalId = setInterval(function() {
        _loadFrame();
      }, _dataRefresh);
    }

    /* Send the ready event to the player */
    gadgets.rpc.call('', 'rsevent_ready', null, _prefs.getString("id"),
      false, false, false, true, false);
  }

  // public space
  return {
    init: function(){
      _prefs = new gadgets.Prefs();
      _dataRefresh = _prefs.getInt("data-refresh");

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

