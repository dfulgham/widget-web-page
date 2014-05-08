// create namespace (if not already created)
if (!Namespace.exist('RiseVision.WebPage')) {
    Namespace('RiseVision.WebPage');
}

RiseVision.WebPage.Settings = (function($,gadgets, i18n) {

    // private variables
    var _params,
        _additionalParams = {};

    // private functions
    function _getSettings(){
        var alerts = document.getElementById("settings-alert"),
            errorFound = false;

        $("#settings-alert").empty().hide();

        //TODO: Perform validation
        errorFound = (_validateRequired($("#url"), alerts, "URL")) ? true : errorFound;
        errorFound = (_validateRequired($("#scroll-horizontal"), alerts, "Horizontal Scroll")) ? true : errorFound;
        errorFound = (_validateRequired($("#scroll-vertical"), alerts, "Vertical Scroll")) ? true : errorFound;

        if (errorFound) {
            $("#settings-alert").show();
            $(".widget-wrapper").scrollTop(0);
        } else {


            //TODO: Pass the custom Widget URL First.


            //TODO: Construct parameters string to pass to RVA.

            /*settings = {
             "params" : params,
             "additionalParams" : JSON.stringify(*//* call saveAdditionalParams() *//*);
             }*/

            //$("#settings-alert").hide();

            //gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
        }
    }

    function _saveAdditionalParams(){

        //TODO: Configure all additional params

        return _additionalParams;
    }

    function _validateRequired($element, errors, fieldName){
        //Don't validate element if it's hidden.
        if (!$element.is(":visible")) {
            return false;
        } else {
            if (!$.trim($element.val())) {
                errors.innerHTML += fieldName + " is a required field.<br />";
                return true;
            }
            else {
                return false;
            }
        }
    }

    // public space
    return {
        init: function(){
            var self = this;

            // Add event handlers
            $("#save").on("click", function() {
                _getSettings();
            });

            $("#cancel, #settings-close").on("click", function() {
                gadgets.rpc.call("", "rscmd_closeSettings", null);
            });

            $("#help").on("click", function() {
                window.open("http://www.risevision.com/help/users/what-are-gadgets/premium-gadgets/rise-vision-weather/", "_blank");
            });

            $("#settings-alert").hide();

            //Request additional parameters from the Viewer.
            gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
                if (result) {
                    var prefs = new gadgets.Prefs();

                    result = JSON.parse(result);
                    self.result = result;

                    //TODO: initialize with params

                } else {

                    //TODO: initialize with defaults
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

