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
        var errorFound = false;

        //$("#settings-alert").empty();

        //TODO: Perform validation

        if (errorFound) {
            //$("#settings-alert").show();
            // $(".widget-wrapper").scrollTop(0);
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

    // public space
    return {
        init: function(){

            console.log("Settings::init()");
            //TODO: initialization things

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

                //TODO: Manually trigger event handlers so that the visibility of fields can be set.


                //TODO: Translate
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

