var _hasSetEmail = false;
window.addEventListener('message', WidgetComunicatorCallback, false);

function hasSetEmail() {
    return _hasSetEmail;
}

function postMailToContentWindow() {
    var email = getMail();
    if (email !== '') {
        var target = "*";
        var message = {
            email: email
        };
        var contentWindow = document.getElementById('registrationframe').contentWindow;
        contentWindow.postMessage({
            message
        }, target);
    }
}

function WidgetComunicatorCallback(event) {
    try {
        if (event === undefined || event === null) {
            return false;
        }
        if (event.data !== null) {
            if (event.data.indexOf("{") > -1) {
                var msg = JSON.parse(event.data);
                switch (msg.type) {
                    case 'WIDGET_POPUP_SIZE':
                        if (!hasSetEmail()) {
                            _hasSetEmail = true;
                            postMailToContentWindow();
                        }
                        break;
                }
            }
        }
    } catch (err) {}
}

function getMail() {
    return getCookieValue("_email");
}

function getCookieValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}