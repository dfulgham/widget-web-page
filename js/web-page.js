var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Controller = (function(gadgets) {
  "use strict";

  // private variables
  var _prefs = null, _url = "", _dataRefresh = null,
      _intervalId = null, _initialLoad = true;

  // private functions
  function _createPage(){
    var container = document.getElementById('webpage-container'),
        frame = document.getElementById('webpage-frame'),
        blocker = container.getElementsByClassName('blocker')[0],
        aspectRatio =  (_prefs.getInt("rsH")/_prefs.getInt("rsW")) * 100,
        scrollHorizVal = (_prefs.getInt("scroll-horizontal") > 0
            ? _prefs.getInt("scroll-horizontal") : 0),
        scrollVertVal = (_prefs.getInt("scroll-vertical") > 0
            ? _prefs.getInt("scroll-vertical") : 0),
        zoom = _prefs.getFloat("zoom"),
        zoomStyle, marginStyle;

    /* Hiding iframe container, visible when the iframe successfully loads */
    container.style.visibility = "hidden";

    /* set the padding-bottom with the aspect ratio % (responsive)
     */
    container.setAttribute("style","padding-bottom:" + aspectRatio + "%");

    /* Configure interactivity of iframe */
    blocker.style.display = (_prefs.getBool("interactive")) ? "none" : "block";
    frame.setAttribute("scrolling",
      (_prefs.getBool('scrollbars')) ? 'yes' : 'no');

    /* Configure the zoom (scale) styling */
    zoomStyle = "-ms-zoom:" + zoom + ";" +
      "-moz-transform: scale(" + zoom + ");" +
      "-moz-transform-origin: 0 0;" +
      "-o-transform: scale(" + zoom + ");" +
      "-o-transform-origin: 0 0;" +
      "-webkit-transform: scale(" + zoom + ");" +
      "-webkit-transform-origin: 0 0;";

    /* Apply the zoom (scale) on the iframe */
    frame.setAttribute("style", zoomStyle);

    /* Configure the negative margin values */
    if(scrollHorizVal !== 0){
      scrollHorizVal = (zoom !== 1) ?
       (scrollHorizVal/frame.getBoundingClientRect().width) * 100 :
       (scrollHorizVal/frame.offsetWidth) * 100;
    }

    if(scrollVertVal !== 0){
      scrollVertVal = (zoom !== 1) ?
        (scrollVertVal/frame.getBoundingClientRect().height) * 100 :
        (scrollVertVal/frame.offsetHeight) * 100;
    }

    if(scrollHorizVal !== 0 || scrollVertVal !== 0){
      /* Configure the margin styling */
      marginStyle = "margin: " + "-" + scrollVertVal + "% 0 0 -" +
        scrollHorizVal + "%;";

      /* Apply the margin styling on the iframe while maintaining
       the zoom styling */
      frame.setAttribute("style", zoomStyle + marginStyle);
    }
  }

  function _onAdditionalParams(name, value){

    if (name == "additionalParams") {
      if (value) {
        value = JSON.parse(value);

        // Configure the value for _url
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
        frame = document.getElementById('webpage-frame'),
        refreshURL = _url + "?dummyVar=" + Math.ceil(Math.random() * 100);

    if(_initialLoad){
      frame.onload = function() {
        _initialLoad = false;
        frame.onload = null;
        _readyEvent();
      }
    }

    frame.setAttribute("src", refreshURL);
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

// Add Analytics code.
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-41395348-11']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
    'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

// Disable context menu (right click menu)
window.oncontextmenu = function() {
  return false;
};

// Initialize Web Page Controller
RiseVision.WebPage.Controller.init();

