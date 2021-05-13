var WIDGET_HEIGHT = 0,
    MIN_WIDGET_HEIGHT = 500;
window.addEventListener('message', widget_comunicator_callback, false);

function widget_comunicator_callback(event) {
    try {
        if (event === undefined || event === null) {
            return false;
        }
        if (event.data === undefined) {
            return;
        }
        if (event.data !== null) {
            if (event.data.indexOf("{") > -1) {
                var msg = JSON.parse(event.data);
                switch (msg.type) {
                    case 'SET_LC_CUSTOM_VAR':
                        var vars = [];
                        for (var name in msg.body) {
                            vars.push({
                                name: name,
                                value: msg.body[name]
                            });
                        }
                        if (document.readyState === 'complete') {
                            LC_API.set_custom_variables(vars);
                        } else {
                            var lc_loaded_listener = addEventListener('load', function() {
                                removeEventListener('load', lc_loaded_listener);
                                LC_API.set_custom_variables(vars);
                            });
                        }
                        break;
                    case 'email_duplication':
                        break;
                    case 'WIDGET_POPUP_SIZE':
                        var IFRAME_MIN_WIDGET_HEIGHT = jQuery('iframe').attr('height');
                        var widgetID = '#' + msg.body.widget;
                        var height = msg.body.height;
                        if (height === undefined || height === null) {
                            return false;
                        } else if (height < MIN_WIDGET_HEIGHT) {
                            return false;
                        } else if (height < IFRAME_MIN_WIDGET_HEIGHT) {
                            return false;
                        } else if (height <= WIDGET_HEIGHT) {
                            return false;
                        }
                        var iFrameHeight = msg.body.height + 10;
                        WIDGET_HEIGHT = height;
                        jQuery(widgetID).height(iFrameHeight + 'px');
                        if (widgetID == '#forgotlogin' || widgetID == '#registration') {
                            jQuery('#login').height(iFrameHeight + 'px');
                        }
                        break;
                    case 'accountdetails_success':
                        break;
                }
            }
        }
    } catch (err) {}
}