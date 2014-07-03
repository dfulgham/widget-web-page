var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Settings = (function ($, window, document, gadgets, i18n) {
  "use strict";

  // private variables
  var _prefs = null, _currentZoom = 1, _el;

  // private functions
  function _cache() {
    _el = {
      $wrapperCtn:           $(".widget-wrapper"),
      $urlInp:               $("#url"),
      $alertCtn:             $("#settings-alert"),
      $scrollHorizInp:       $("#scroll-horizontal"),
      $scrollVertInp:        $("#scroll-vertical"),
      $interactiveCB:        $("#interactive"),
      $scrollbarsCtn:        $("#interactivity > div + div.checkbox"),
      $scrollbarsCB:         $("#scrollbars"),
      $zoomSel:              $("#zoom"),
      $dataRefreshSel:       $("#refresh")
    };
  }

  function _getAdditionalParams() {
    var additionalParams = {};

    additionalParams.url = _el.$urlInp.val();

    return additionalParams;
  }

  function _getParams() {
    return "&up_scroll-horizontal=" +
      $.trim(_el.$scrollHorizInp.val()) + "&up_scroll-vertical=" +
      $.trim(_el.$scrollVertInp.val()) + "&up_zoom=" +
      _el.$zoomSel.val() + "&up_interactive=" +
      _el.$interactiveCB.is(":checked").toString() + "&up_scrollbars=" +
      _el.$scrollbarsCB.is(":checked").toString() + "&up_data-refresh=" +
      _el.$dataRefreshSel.val();
  }

  function _getValidationsMap() {
    return {
      "required": {
        fn: RiseVision.Common.Validation.isValidRequired,
        localize: "validation.required",
        conditional: null
      },
      "url": {
        fn: RiseVision.Common.Validation.isValidURL,
        localize: "validation.valid_url",
        conditional: null
      },
      "numeric": {
        fn: RiseVision.Common.Validation.isValidNumber,
        localize: "validation.numeric",
        conditional: null
      },
      "horizontal_scroll": {
        fn: RiseVision.Common.Validation.isLessThan,
        localize: "validation.scroll_size",
        conditional: _prefs.getString("rsW")
      },
      "vertical_scroll": {
        fn: RiseVision.Common.Validation.isLessThan,
        localize: "validation.scroll_size",
        conditional: _prefs.getString("rsH")
      }
    };
  }

  function _validateItem(item) {
    var rules = item.rules.split('|'),
      validationsMap = _getValidationsMap(),
      alerts = document.getElementById("settings-alert"),
      passed = true,
      i, ruleLength, rule;

    for (i = 0, ruleLength = rules.length; i < ruleLength; i += 1) {
      rule = rules[i];

      if (validationsMap[rule].fn.apply(null,
          [item.el, validationsMap[rule].conditional]) === false) {
        passed = false;
        alerts.innerHTML = i18n.t(validationsMap[rule].localize,
          { fieldName: item.fieldName });
        break;
      }
    }

    return passed;
  }

  function _validate() {
    var itemsToValidate =
        [
          { el: document.getElementById("url"),
            rules: "required|url",
            fieldName: i18n.t("url")
            },
          {
            el: document.getElementById("scroll-horizontal"),
            rules: "required|numeric|horizontal_scroll",
            fieldName: i18n.t("scroll-horizontal.label")
          },
          {
            el: document.getElementById("scroll-vertical"),
            rules: "required|numeric|vertical_scroll",
            fieldName: i18n.t("scroll-vertical.label")
          }
        ],
      passed = true, i;

    _el.$alertCtn.empty().hide();

    for (i = 0; i < itemsToValidate.length; i += 1) {
      if (!_validateItem(itemsToValidate[i])) {
        passed = false;
        break;
      }
    }

    return passed;
  }

  function _saveSettings() {
    var settings = null;

    // validate
    if (!_validate()) {
      _el.$alertCtn.show();
      _el.$wrapperCtn.scrollTop(0);
    } else {
      //construct settings object
      settings = {
        "params" : _getParams(),
        "additionalParams" : JSON.stringify(_getAdditionalParams())
      };

      gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
    }
  }

  function _bind() {
    // Add event handlers
    $("#save").on("click", function () {
      _saveSettings();
    });

    $("#cancel, #settings-close").on("click", function () {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function () {
      window.open("http://www.risevision.com/help/users/what-are-gadgets/" +
        "free-gadgets/rise-vision-url/", "_blank");
    });

    _el.$zoomSel.on('change', function () {
      //alert( this.value ); // or $(this).val()
      if ($(this).val() > 1) {
        if (!_el.$scrollbarsCB.is(':disabled')) {
          if (_el.$scrollbarsCB.is(":checked")) {
            _el.$scrollbarsCB.click();
          }
          _el.$scrollbarsCB.prop('disabled', true);
          $("label[for='scrollbars']")
            .addClass('label-disabled')
            .css('cursor', 'default');
        }
        _currentZoom = $(this).val();
      } else {
        if (_el.$scrollbarsCB.is(':disabled')) {
          _el.$scrollbarsCB.prop('disabled', false);
          $("label[for='scrollbars']")
            .removeClass('label-disabled')
            .css('cursor', 'pointer');
        }
      }
    });

    _el.$interactiveCB.on("click", function () {
      if ($(this).is(":checked")) {
        _el.$scrollbarsCtn.show();
      } else {
        if (_currentZoom <= 1 && _el.$scrollbarsCB.is(":checked")) {
          _el.$scrollbarsCB.click();
        }
        _el.$scrollbarsCtn.hide();
      }
    });
  }

  // public space
  return {
    init: function () {

      _cache();
      _bind();

      _el.$alertCtn.hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function (result) {

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          _el.$scrollHorizInp.val(_prefs.getString("scroll-horizontal"));
          _el.$scrollVertInp.val(_prefs.getString("scroll-vertical"));
          _el.$zoomSel.val(_prefs.getString("zoom"));
          _el.$interactiveCB.attr("checked", _prefs.getBool("interactive"));
          _el.$scrollbarsCB.attr("checked", _prefs.getBool("scrollbars"));
          if (_prefs.getString("zoom") > 1) {
            _el.$scrollbarsCB.prop('disabled', true);
            $("label[for='scrollbars']")
              .addClass('label-disabled')
              .css('cursor', 'default');
          }
          _el.$dataRefreshSel.val(_prefs.getString("data-refresh"));

          //Additional params
          _el.$urlInp.val(result.url);

        } else {
          // initialize input elements with defaults
          _el.$scrollHorizInp.val(0);
          _el.$scrollVertInp.val(0);
        }

        /* Manually trigger event handlers so that the visibility of fields
           can be set. */
        _el.$interactiveCB.triggerHandler("click");

        i18n.init({ fallbackLng: "en" }, function () {
          _el.$wrapperCtn.i18n().show();
          $(".form-control").selectpicker();

          // Set tooltips only after i18n has shown
          $("label[for='scroll-horizontal'] + button, " +
            "label[for='scroll-vertical'] + button, " +
            "label[for='zoom'] + button, " +
            "label[for='interactive'] + button").popover({trigger: 'click'});

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
            container : _el.$wrapperCtn,
            topSpacing : 41, //top margin + border of wrapper
            getWidthFrom : _el.$wrapperCtn
          });

        });
      });
    }
  };
})(jQuery, window, document, gadgets, i18n);

RiseVision.WebPage.Settings.init();

