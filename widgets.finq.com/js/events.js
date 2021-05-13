_ehq = (typeof(_ehq) != 'undefined') ? _ehq : [];
if (typeof event_hub_server_host_client !== 'undefined') {
    _ehq.push(['setTrackerUrl', '//' + event_hub_server_host_client + '/trackEvent.gif']);
}
if (typeof customer_id !== 'undefined' && customer_id != 0) {
    _ehq.push(['setTrackerCustomerId', customer_id]);
}
if (typeof tp_id !== 'undefined' && tp_id != 0) {
    _ehq.push(['setTrackerTradingPlatformId', tp_id]);
}
if (typeof brand !== 'undefined') {
    _ehq.push(['setTrackerBrand', brand]);
}
_ehq.push(['setTrackerAppSource', 'widget']);
if (typeof event_hub_url !== 'undefined') {
    (function() {
        var
            d = document,
            g = d.createElement('script'),
            s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.defer = true;
        g.src = event_hub_url;
        s.parentNode.insertBefore(g, s);
    })();
}
$(document).ready(function() {
    var $contentElm = $("#content");
    var actionType = $contentElm.attr("class");
    var subCategory = "";
    if (typeof customer_id !== 'undefined' && customer_id != 0) {
        communicator.write('setLivechatCustomVariables', {
            customerId: customer_id
        });
    }
    switch (actionType) {
        case "registration":
            subCategory = "leadForm";
            if ($contentElm.find(".blocked_by_jurisdiction").length > 0) {
                send_event(subCategory, "displayIneligibleCountry", {
                    "lang": widgets_locale
                });
            } else {
                send_event(subCategory, "display", {
                    "lang": widgets_locale
                });
            }
            $(".already_registered").on("click", function() {
                send_event(subCategory, "clkHaveAccount", {});
            });
            $(".chat_link a").on("click", function() {
                send_event(subCategory, "clkLiveChat", {});
            });
            $(".app_link a").on("click", function() {
                var mobileDevice = $(this).index() == 0 ? "iOS" : "android";
                send_event(subCategory, "clkMobileDevice", {
                    "mobileDevice": mobileDevice
                });
            });
            $("#submit_registration").on("click", function() {
                send_event(subCategory, "clientSubmit", {});
            });
            break;
        case "login":
            subCategory = "login";
            send_event(subCategory, "display", {
                "lang": widgets_locale
            });
            $("#submit_login").on("click", function() {
                var rememberMeStatus = $("#remember").val() == 1 ? true : false;
                send_event(subCategory, "clkLogin", {
                    "rememberMeStatus": rememberMeStatus
                });
            });
            $("#rememberme").on("click", function() {
                var rememberMeStatus = $("#remember").val() == 1 ? true : false;
                send_event(subCategory, "clkremeberMeCheckBox", {
                    "status": !rememberMeStatus
                });
            });
            $(".app_link a").on("click", function() {
                var mobileDevice = $(this).index() == 0 ? "iOS" : "android";
                send_event(subCategory, "clkMobileDevice", {
                    "mobileDevice": mobileDevice
                });
            });
            $(".forgot_password").on("click", function() {
                send_event(subCategory, "clkForgetPassword", {});
            });
            $("#new_user").on("click", function() {
                send_event(subCategory, "clkCreateNewAccount", {});
            });
            $(".chat_link a").on("click", function() {
                send_event(subCategory, "clkLiveChat", {});
            });
            $(".try-new-platform").on("click", function() {
                send_event(subCategory, "clkNewPlatform", {});
            });
            break;
        case "myaccount_content_wrapper deposit_action":
            subCategory = "cashierDialog";
            send_event(subCategory, "display", {});
            break;
    }
    if ($("body").find(".welcome_bonus").length > 0) {
        subCategory = "depsoitBonusOld";
        send_event(subCategory, "display", {});
        $(".deposit_now").on("click", function() {
            var clientOffer = parseInt($("input[type=radio]").index($("input[type=radio]").filter(':checked')));
            clientOffer++;
            send_event(subCategory, "clkDepositNow", {
                "clientOffer": clientOffer
            });
        });
        $(".accept_bonus_container a:not('#no-bonus-link')").on("click", function() {
            send_event(subCategory, "clkTerms", {});
        });
        $("#no-bonus-link").on("click", function() {
            send_event(subCategory, "clkDepositNoBonus", {});
        });
    }
    PTracker.init();
});

function send_event(category, action, params) {
    _ehq.push(['trackEvent', {
        'category': 'onBoardFlow',
        'subcategory': category,
        'action': action,
        'customData': params
    }]);
}
PTracker = (function() {
    var TRACKING_COOKIES_NAME = 'tracking';
    var TRACKING_RESPONSE_COOKIE_NAME = 'tracking_values';
    var TRACKING_COOKIES_LIFETIME = 30;
    var TRACKING_VISITOR_VALUE = '_eh2_id';
    var TRACKING_REFERRER_VALUE = '_eh2_ref';
    var trackingParameters = {};
    var oldTrackingParameters = {};
    var trackingInitiated = false;
    var black_list = ['email', 'firstname', 'lastname', 'phone', 'password'];
    var JSON = {
        stringify: function(v) {
            var a = [];

            function e(s) {
                a[a.length] = s;
            }

            function g(x) {
                var c, i, l, v;
                switch (typeof x) {
                    case 'object':
                        if (x) {
                            if (x instanceof Array) {
                                e('[');
                                l = a.length;
                                for (i = 0; i < x.length; i += 1) {
                                    v = x[i];
                                    if (typeof v != 'undefined' && typeof v != 'function') {
                                        if (l < a.length) {
                                            e(',');
                                        }
                                        g(v);
                                    }
                                }
                                e(']');
                                return;
                            } else if (typeof x.valueOf == 'function') {
                                e('{');
                                l = a.length;
                                for (i in x) {
                                    v = x[i];
                                    if (typeof v != 'undefined' && typeof v != 'function' && (!v || typeof v != 'object' || typeof v.valueOf == 'function')) {
                                        if (l < a.length) {
                                            e(',');
                                        }
                                        g(i);
                                        e(':');
                                        g(v);
                                    }
                                }
                                return e('}');
                            }
                        }
                        e('null');
                        return;
                    case 'number':
                        e(isFinite(x) ? +x : 'null');
                        return;
                    case 'string':
                        l = x.length;
                        e('"');
                        for (i = 0; i < l; i += 1) {
                            c = x.charAt(i);
                            if (c >= ' ') {
                                if (c == '\\' || c == '"') {
                                    e('\\');
                                }
                                e(c);
                            } else {
                                switch (c) {
                                    case '\b':
                                        e('\\b');
                                        break;
                                    case '\f':
                                        e('\\f');
                                        break;
                                    case '\n':
                                        e('\\n');
                                        break;
                                    case '\r':
                                        e('\\r');
                                        break;
                                    case '\t':
                                        e('\\t');
                                        break;
                                    default:
                                        c = c.charCodeAt();
                                        e('\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16));
                                }
                            }
                        }
                        e('"');
                        return;
                    case 'boolean':
                        e(String(x));
                        return;
                    default:
                        e('null');
                        return;
                }
            }
            g(v);
            return a.join('');
        },
        parse: function(text) {
            return (/^(\s+|[,:{}\[\]]|"(\\["\\\/bfnrtu]|[^\x00-\x1f"\\]+)*"|-?\d+(\.\d*)?([eE][+-]?\d+)?|true|false|null)+$/.test(text)) && eval('(' + text + ')');
        }
    };
    var getSearchParameters = function() {
        var prmstr;
        try {
            prmstr = decodeURIComponent(window.location.search.substr(1));
        } catch (e) {
            if (console) {
                console.log(e);
            } else {}
        }
        return ((prmstr != null && prmstr != "") ? getParamsToAssocArray(prmstr) : {});
    };
    var getParamsToAssocArray = function(prmstr) {
        var params = {};
        var prmarr = prmstr.split("&");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            var tmpindex = tmparr.shift();
            params[tmpindex] = tmparr.join("=");
        }
        return params;
    };
    var readCookies = function(cookie_name) {
        var data = get_cookie(cookie_name);
        var data_obj = {};
        if (data) {
            data = JSON.parse(data);
            for (var name in data) {
                if (data.hasOwnProperty(name) && !black_list.includes(name) && data[name] !== '') {
                    data_obj[name] = data[name];
                }
            }
        }
        return data_obj;
    };
    var writeCookies = function(cookie_name, data, life_time) {
        set_cookie(cookie_name, JSON.stringify(data), life_time, "/", buildWildcardDomainForCookies(document.location.href));
    };
    var readTrackingParameters = function() {
        var data = getSearchParameters();
        var removeOldParams = false;
        for (var name in data) {
            if (data[name] !== '') {
                if (!removeOldParams) {
                    removeOldParams = true;
                    trackingParameters = {};
                }
                if (!black_list.includes(name)) {
                    trackingParameters[name] = data[name];
                }
            }
        }
    };
    var init = function() {
        if (($("#content").hasClass('login') || $("#content").hasClass('registration')) && get_cookie('information_about_user') == null) {
            if (!trackingInitiated) {
                trackingParameters = readCookies(TRACKING_COOKIES_NAME);
                oldTrackingParameters = trackingParameters;
                readTrackingParameters();
                writeCookies(TRACKING_COOKIES_NAME, trackingParameters, TRACKING_COOKIES_LIFETIME);
                delete oldTrackingParameters['uid'];
                delete trackingParameters['uid'];
                if (!isEquivalent(oldTrackingParameters, trackingParameters)) {
                    setTimeout(function() {
                        sendTrackingEvent();
                    }, 1000);
                }
                trackingInitiated = true;
            }
        }
    };
    var capitalize = function(s) {
        return s[0].toUpperCase() + s.substr(1);
    };
    var isEquivalent = function(a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    };
    var sendTrackingEvent = function() {
        var trackingParametersToSend = $.extend({}, trackingParameters);
        if (typeof brand !== 'undefined') {
            trackingParametersToSend['brandName'] = brand;
        }
        trackingParametersToSend['trackEvent'] = true;
        trackingParametersToSend['appSource'] = 'widget';
        if (get_cookie(TRACKING_VISITOR_VALUE)) trackingParametersToSend['uid'] = get_cookie(TRACKING_VISITOR_VALUE);
        if (!trackingParametersToSend.hasOwnProperty('referrer')) {
            if (get_cookie(TRACKING_REFERRER_VALUE)) {
                trackingParametersToSend['referrer'] = get_cookie(TRACKING_REFERRER_VALUE);
            }
        }
        if (typeof tracking_server_path !== 'undefined') {
            sendTrackingRequest(trackingParametersToSend);
        }
    };
    var sendTrackingRequest = function(request) {
        $.ajax({
            url: tracking_server_path,
            dataType: 'json',
            data: request
        }).done(function(data) {
            if (data) {
                var lifetime = TRACKING_COOKIES_LIFETIME;
                if (typeof data['affiliateId'] !== undefined && data['affiliateId'] == 'google') {
                    lifetime = 3 * TRACKING_COOKIES_LIFETIME;
                }
                writeCookies(TRACKING_RESPONSE_COOKIE_NAME, data, lifetime);
            }
        }).fail(function(err) {
            console.log(err.responseText);
        });
    };
    return {
        init: init
    }
}());