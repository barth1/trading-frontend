(function($, Drupal) {
    Drupal.Markets = function() {
        const TRACKING_PARAMETERS_UPDATED_EVENT_NAME = 'tfxl:tracking-parameters-updated';
        const USER_INFO_COOKIE = 'userinfo';
        const USER_INFO_COOKIE_LIFETIME = 180;
        const ENCODED_VALUE_PREFIX = '__ENCRYPTED__';
        const TRACKING_VISITOR_VALUE = '_eh2_id';
        var writeCookies = function() {
            Cookies.set(USER_INFO_COOKIE, ENCODED_VALUE_PREFIX + Base64.encode(serialize(JSON.stringify({
                'newsite': 1
            }))), {
                path: '/',
                domain: Drupal.Infra.buildWildcardDomainForCookies(document.domain),
                expires: USER_INFO_COOKIE_LIFETIME
            })
        };
        var initUID = function() {
            var uid = 'unknown';
            var tracking_visitor_value = Cookies.get(TRACKING_VISITOR_VALUE);
            if (tracking_visitor_value) {
                uid = tracking_visitor_value;
            } else {
                if (typeof _ehq === 'undefined') {
                    _ehq = [];
                }
                _ehq.push([function() {
                    uid = this.getTrackerVisitorUUID();
                    $(document).trigger(TRACKING_PARAMETERS_UPDATED_EVENT_NAME, {
                        uid: uid
                    });
                }]);
            }
            $(document).trigger(TRACKING_PARAMETERS_UPDATED_EVENT_NAME, {
                uid: uid
            });
        };
        var init = function() {
            writeCookies();
            initUID();
        };
        return {
            init: init
        }
    }();
    Drupal.behaviors.marketsBehavior = {
        attach: function(context, settings) {
            $('body', context).once(function() {
                Drupal.Markets.init();
            });
        },
        weight: 100
    };
})(jQuery, Drupal);