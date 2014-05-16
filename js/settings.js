var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Settings = (function($,gadgets, i18n) {
  "use strict";

  // private variables
  var _prefs = null;

  // private functions
  function _bind(){
    // Add event handlers
    $("#save").on("click", function() {
      _saveSettings();
    });

    $("#cancel, #settings-close").on("click", function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function() {
      window.open("http://www.risevision.com/help/users/what-are-gadgets/" +
        "free-gadgets/rise-vision-url/", "_blank");
    });

    $("#interactive").on("click", function(event) {
      if ($(this).is(":checked")) {
        $("#interactivity > div + div.checkbox").show();
      } else {
        if ($("#scrollbars").is(":checked")) {
          $("#scrollbars").click();
        }
        $("#interactivity > div + div.checkbox").hide();
      }
    });
  }

  function _getValidationsMap(){
    return {
      "required": {
        fn: RiseVision.Common.Validation.required,
        localize: "validation.required",
        conditional: null
      },
      "url": {
        fn: RiseVision.Common.Validation.url,
        localize: "validation.valid_url",
        conditional: null
      },
      "numeric": {
        fn: RiseVision.Common.Validation.numeric,
        localize: "validation.numeric",
        conditional: null
      },
      "horizontal_scroll": {
        fn: RiseVision.Common.Validation.lessThan,
        localize: "validation.scroll_size",
        conditional: _prefs.getString("rsW")
      },
      "vertical_scroll": {
        fn: RiseVision.Common.Validation.lessThan,
        localize: "validation.scroll_size",
        conditional: _prefs.getString("rsH")
      }
    }
  }

  function _getAdditionalParams(){
    var additionalParams = {};

    additionalParams["url"] = $("#url").val();

    return additionalParams;
  }

  function _getParams(){
    var params = "&up_scroll-horizontal=" +
      $.trim($("#scroll-horizontal").val()) + "&up_scroll-vertical=" +
      $.trim($("#scroll-vertical").val()) + "&up_zoom=" +
      $("#zoom").val() + "&up_interactive=" +
      $("#interactive").is(":checked").toString() + "&up_scrollbars=" +
      $("#scrollbars").is(":checked").toString() + "&up_data-refresh=" +
      $("#refresh").val();

    return params;
  }

  function _saveSettings(){
    var settings = null;

    // validate
    if(!_validate()){
      $("#settings-alert").show();
      $(".widget-wrapper").scrollTop(0);
    } else {
      //construct settings object
      settings = {
        "params" : _getParams(),
        "additionalParams" : JSON.stringify(_getAdditionalParams())
      }

      gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
    }
  }

  function _validate(){
    var itemsToValidate = [
          { el: document.getElementById("url"),
            rules: "required|url",
            fieldName: "URL"
          },
          {
            el: document.getElementById("scroll-horizontal"),
            rules: "required|numeric|horizontal_scroll",
            fieldName: "Horizontal Scroll"
          },{
            el: document.getElementById("scroll-vertical"),
            rules: "required|numeric|vertical_scroll",
            fieldName: "Vertical Scroll"
          }
        ],
        passed = true;

    $("#settings-alert").empty().hide();

    for(var i = 0; i < itemsToValidate.length; i++){
      if(!_validateItem(itemsToValidate[i])){
        passed = false;
        break;
      }
    }

    return passed;
  }

  function _validateItem(item){
    var rules = item.rules.split('|'),
        validationsMap = _getValidationsMap(),
        alerts = document.getElementById("settings-alert"),
        passed = true;

    for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
      var rule = rules[i];

      if (validationsMap[rule].fn.apply(null, [item.el,validationsMap[rule].conditional]) === false) {
        passed = false;
        alerts.innerHTML = i18n.t(validationsMap[rule].localize,
          { fieldName: item.fieldName });
        break;
      }
    }

    return passed;
  }

  // public space
  return {
    init: function(){

      _bind();

      $("#settings-alert").hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          $("#scroll-horizontal").val(_prefs.getString("scroll-horizontal"));
          $("#scroll-vertical").val(_prefs.getString("scroll-vertical"));
          $("#zoom").val(_prefs.getString("zoom"));
          $("#interactive").attr("checked", _prefs.getBool("interactive"));
          $("#scrollbars").attr("checked", _prefs.getBool("scrollbars"));
          $("#refresh").val(_prefs.getString("data-refresh"));

          //Additional params
          $("#url").val(result["url"]);

        } else {
          // initialize input elements with defaults
          $("#scroll-horizontal").val(0);
          $("#scroll-vertical").val(0);
        }

        /* Manually trigger event handlers so that the visibility of fields
           can be set. */
        $("#interactive").triggerHandler("click");

        i18n.init({ fallbackLng: "en" }, function(t) {
          $(".widget-wrapper").i18n().show();
          $(".form-control").selectpicker();

          // Set tooltips only after i18n has shown
          $("label[for='scroll-horizontal'] + button, " +
            "label[for='scroll-vertical'] + button, " +
            "label[for='interactive'] + button").popover({trigger:'click'});

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
              container : $(".widget-wrapper"),
              topSpacing : 41,	//top margin + border of wrapper
              getWidthFrom : $(".widget-wrapper")
          });

        });
      });
    }
  };
})($,gadgets, i18n);

