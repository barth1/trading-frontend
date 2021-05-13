(function($, Drupal) {
    Drupal.PTracker = (function() {
        var TRACKING_COOKIES_NAME = 'tracking';
        var TRACKING_VISITOR_VALUE = 'km_ai';
        var TRACKING_COOKIES_LIFETIME = 30;
        var ADD_TRACKING_PARAMETERS_CLASS = 'add-tracking-parameters';
        var trackingParameters = {};
        var internalParameters = ["from_search"];
        var readCookies = function() {
            var data = Cookies.get(TRACKING_COOKIES_NAME);
            if (data) {
                data = JSON.parse(data);
                for (var name in data) {
                    if (data.hasOwnProperty(name)) {
                        trackingParameters[name] = data[name];
                    }
                }
            }
        };
        var writeCookies = function() {
            Cookies.set(TRACKING_COOKIES_NAME, JSON.stringify(trackingParameters), {
                expires: TRACKING_COOKIES_LIFETIME
            });
        };
        var readTrackingParameters = function() {
            var data = Drupal.Infra.getSearchParameters();
            var removeOldParams = false;
            for (var name in data) {
                if (data.hasOwnProperty(name) && data[name] !== '' && internalParameters.indexOf(name) == -1) {
                    if (!removeOldParams) {
                        removeOldParams = true;
                        trackingParameters = {};
                    }
                    trackingParameters[name] = data[name];
                }
            }
            var tracking_visitor_value = Cookies.get(TRACKING_VISITOR_VALUE);
            if (tracking_visitor_value) {
                trackingParameters.uid = tracking_visitor_value;
            } else {
                if (typeof _kmq !== 'undefined') {
                    _kmq.push(function() {
                        trackingParameters.uid = KM.i();
                        dcLoginToLivePlatform($("a[data-function='dcLoginToLivePlatform']"));
                        dcLoginToDemoPlatform($("a[data-function='dcLoginToDemoPlatform']"));
                        processUrlsWithTrackingParameters(document);
                    });
                } else {
                    trackingParameters.uid = 'unknown';
                }
            }
        };
        var processUrlsWithTrackingParameters = function(context) {
            $('.' + ADD_TRACKING_PARAMETERS_CLASS, context).each(function() {
                var attrMapping = {
                    'a': 'href',
                    'iframe': 'src',
                    'img': 'src'
                };
                var attrName = $(this).prop('tagName').toLowerCase();
                if (typeof attrMapping[attrName] !== 'undefined' && typeof $(this).attr(attrMapping[attrName]) !== 'undefined') {
                    var url = Drupal.Infra.addUrlParameters($(this).attr(attrMapping[attrName]), trackingParameters);
                    $(this).attr(attrMapping[attrName], url);
                } else {
                    Drupal.Infra.log("Was found element with class '" + ADD_TRACKING_PARAMETERS_CLASS + "', but system does not know how to add tracking parameters to it (<" + attrName + ">)");
                }
            });
            if ($(this).hasClass(ADD_TRACKING_PARAMETERS_CLASS)) {
                var url = Drupal.Infra.addUrlParameters($(this).attr('href'), trackingParameters);
                $(this).attr('href', url);
            }
        };
        var init = function() {
            try {
                if (typeof Drupal.settings.marketingTracking.dcTrackingCookiesLifeTime !== 'undefined') {
                    TRACKING_COOKIES_LIFETIME = parseInt(Drupal.settings.marketingTracking.dcTrackingCookiesLifeTime);
                }
            } catch (e) {}
        };
        var initGetParametersTracking = function() {
            readCookies();
            readTrackingParameters();
            writeCookies();
        };
        return {
            init: init,
            processUrlsWithTrackingParameters: processUrlsWithTrackingParameters,
            initGetParametersTracking: initGetParametersTracking
        }
    }());
    Drupal.behaviors.dynamicContentBehavior = {
        attach: function(context, settings) {
            $('body', context).once(function() {
                Drupal.PTracker.init();
                Drupal.PTracker.initGetParametersTracking();
                Drupal.PTracker.processUrlsWithTrackingParameters(context);
            });
        }
    };
})(jQuery, Drupal);