// create namespace (if not already created)
if (!Namespace.exist('RiseVision.WebPage')) {
    Namespace('RiseVision.WebPage');
}

RiseVision.WebPage.Settings = (function($,gadgets, i18n) {
    "use strict";

    // private variables

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
            window.open("http://www.risevision.com/help/users/what-are-gadgets/premium-gadgets/rise-vision-weather/", "_blank");
        });
    }

    function _getAdditionalParams(){
        var additionalParams = {};

        additionalParams["url"] = $("#url").val();

        return additionalParams;
    }

    function _getParams(){
        var params = "";

        //TODO: Construct parameters string to pass to RVA.

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
        var alerts = document.getElementById("settings-alert");

        $("#settings-alert").empty().hide();

        if(!_validateRequired($("#url"), alerts, "URL")){ return false; }
        if(!_validateURL($("#url"), alerts, "URL")){ return false; }
        if(!_validateRequired($("#scroll-horizontal"), alerts, "Horizontal Scroll")){ return false; }
        if(!_validateRequired($("#scroll-vertical"), alerts, "Vertical Scroll")){ return false; }

        return true;
    }

    function _validateRequired($element, errors, fieldName){
        //Don't validate element if it's hidden.
        if (!$element.is(":visible")) {
            return true;
        } else {
            if (!$.trim($element.val())) {
                errors.innerHTML += fieldName + " is a required field.<br />";
                return false;
            }
        }

        return true;
    }

    function _validateURL($element, errors, fieldName){
        /*
         Discussion
         http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491

         Using
         https://github.com/component/regexps/blob/master/index.js#L3

         */
        var urlRegExp = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;

        //Don't validate element if it's hidden.
        if (!$element.is(":visible")) {
            return true;
        } else {
            if (!urlRegExp.test($.trim($element.val()))){
                errors.innerHTML += fieldName + " is invalid. Please enter a valid URL.<br />";
                return false;
            }
        }

        return true;
    }

    // public space
    return {
        init: function(){
            var self = this;

            _bind();

            $("#settings-alert").hide();

            //Request additional parameters from the Viewer.
            gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {

                if (result) {
                    var prefs = new gadgets.Prefs();

                    result = JSON.parse(result);
                    self.result = result;

                    //TODO: initialize with params

                } else {
                    // initialize input elements with defaults
                    $("#scroll-horizontal").val(0);
                    $("#scroll-vertical").val(0);
                }

                i18n.init({ fallbackLng: "en" }, function(t) {
                    $(".widget-wrapper").i18n().show();
                    $(".form-control").selectpicker();

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

// imports all properties from RiseVision.WebPage into the global space
Namespace.use('RiseVision.WebPage.*');

