var json_parse = (function() {
    "use strict";
    var at, ch, escapee = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
        },
        text, error = function(m) {
            throw {
                name: 'SyntaxError',
                message: m,
                at: at,
                text: text
            };
        },
        next = function(c) {
            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }
            ch = text.charAt(at);
            at += 1;
            return ch;
        },
        number = function() {
            var number, string = '';
            if (ch === '-') {
                string = '-';
                next('-');
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
            if (ch === '.') {
                string += '.';
                while (next() && ch >= '0' && ch <= '9') {
                    string += ch;
                }
            }
            if (ch === 'e' || ch === 'E') {
                string += ch;
                next();
                if (ch === '-' || ch === '+') {
                    string += ch;
                    next();
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (!isFinite(number)) {
                error("Bad number");
            } else {
                return number;
            }
        },
        string = function() {
            var hex, i, string = '',
                uffff;
            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    }
                    if (ch === '\\') {
                        next();
                        if (ch === 'u') {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (typeof escapee[ch] === 'string') {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        },
        white = function() {
            while (ch && ch <= ' ') {
                next();
            }
        },
        word = function() {
            switch (ch) {
                case 't':
                    next('t');
                    next('r');
                    next('u');
                    next('e');
                    return true;
                case 'f':
                    next('f');
                    next('a');
                    next('l');
                    next('s');
                    next('e');
                    return false;
                case 'n':
                    next('n');
                    next('u');
                    next('l');
                    next('l');
                    return null;
            }
            error("Unexpected '" + ch + "'");
        },
        value, array = function() {
            var array = [];
            if (ch === '[') {
                next('[');
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === ']') {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad array");
        },
        object = function() {
            var key, object = {};
            if (ch === '{') {
                next('{');
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                while (ch) {
                    key = string();
                    white();
                    next(':');
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === '}') {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad object");
        };
    value = function() {
        white();
        switch (ch) {
            case '{':
                return object();
            case '[':
                return array();
            case '"':
                return string();
            case '-':
                return number();
            default:
                return ch >= '0' && ch <= '9' ? number() : word();
        }
    };
    return function(source, reviver) {
        var result;
        text = source;
        at = 0;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }
        return typeof reviver === 'function' ? (function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }({
            '': result
        }, '')) : result;
    };
}());
Date.now = Date.now || function() {
    return +new Date;
};
var cookie_driver = {
    cookie_name: "communicator",
    read: function() {
        var cookie_list = document.cookie.split(';');
        for (var i = 0; i < cookie_list.length; i++) {
            var c = cookie_list[i];
            alert("c=" + c);
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(this.cookie_name) == 0) {
                alert("find");
                var item = c.substring(cookie_name.length, c.length);
                alert("item = " + item);
                return item;
            }
        }
        return '';
    },
    write: function(data) {
        var expires = "";
        document.cookie = this.cookie_name + "=" + data + expires + "; path=/";
    }
};
var url_hash_driver = {
    read: function() {
        var hash = window.location.hash;
        if (hash != '') {
            hash = hash.substr(1);
        }
        return hash;
    },
    write: function(data) {
        url = widget_host_url;
        if (self.parent === self) {} else {
            new_url = url + "#" + data;
            parent.location.href = new_url;
        }
    },
    clean: function() {
        window.location.hash = '!';
    }
};
var post_messages_driver = {
    read: function() {
        return 0;
    },
    write: function(data) {
        var parsedObj;
        try {
            parsedObj = JSON.parse(data);
        } catch (e) {
            parsedObj = $.parseJSON(data);
        }
        var newObj = {};
        if (parsedObj.widget_height !== undefined) {
            if (typeof cosmos_registration !== "undefined" && cosmos_registration === true) {
                var MAX_WIDGET_HEIGHT = 600;
                var MAX_WIDGET_WIDTH = 1200;
                if (typeof parsedObj.widget_height.height !== 'undefined') {
                    parsedObj.widget_height.height = ((parsedObj.widget_height.height > MAX_WIDGET_HEIGHT) ? MAX_WIDGET_HEIGHT : parsedObj.widget_height.height);
                }
                if (typeof parsedObj.widget_height.width !== 'undefined') {
                    parsedObj.widget_height.width = ((parsedObj.widget_height.width > MAX_WIDGET_WIDTH) ? MAX_WIDGET_WIDTH : parsedObj.widget_height.width);
                }
            }
            newObj.type = "WIDGET_POPUP_SIZE";
            newObj.body = parsedObj.widget_height;
        }
        if (parsedObj.switch_product_url !== undefined) {
            newObj.type = "SWITCH_PRODUCT_URL";
            newObj.body = parsedObj.switch_product_url;
        }
        if (parsedObj.scroll !== undefined) {
            newObj.type = "SCROLL";
            newObj.body = parsedObj.scroll;
        }
        if (parsedObj.scrollbars !== undefined) {
            newObj.type = "WIDGET_SCROLLBARS";
            newObj.body = parsedObj.scrollbars;
        }
        if (parsedObj.accountdetails_success !== undefined) {
            newObj.type = "LOGIN_SUCCESS_ACCOUNT_DETAILS";
            newObj.body = parsedObj.accountdetails_success;
        }
        if (parsedObj.show_hint !== undefined) {
            newObj.type = "SHOW_HINT";
            newObj.body = parsedObj.show_hint;
        }
        if (parsedObj.show_bonus !== undefined) {
            newObj.type = "SHOW_BONUS";
            newObj.body = parsedObj.show_bonus;
        }
        if (parsedObj.show_loading !== undefined) {
            newObj.type = "SHOW_LOADING";
            newObj.body = parsedObj.show_loading;
        }
        if (parsedObj.registered_product !== undefined) {
            newObj.type = "REGISTERED_PRODUCT";
            newObj.body = parsedObj.registered_product;
        }
        if (parsedObj.company_refreshed !== undefined) {
            newObj.type = "COMPANY_REFRESHED";
            newObj.body = parsedObj.company_refreshed;
        }
        if (parsedObj.email_duplication !== undefined) {
            newObj.type = "REGISTRATION_EMAIL_DUPLICATION";
            newObj.body = parsedObj.email_duplication;
        }
        if (parsedObj.error_sso !== undefined) {
            newObj.type = "SWITCH_PRODUCT_ERROR";
            newObj.body = parsedObj.error_sso;
        }
        if (parsedObj.step !== undefined) {
            newObj.type = "REGISTRATION_STEP_NUMBER";
            newObj.body = parsedObj.step;
        }
        if (parsedObj.form_for_submit !== undefined) {
            newObj.type = "FORM_FOR_SUBMIT";
            newObj.body = parsedObj.form_for_submit;
        }
        if (parsedObj.cosmos_success !== undefined) {
            newObj = parsedObj.cosmos_success;
        }
        if (parsedObj.open_chat !== undefined) {
            newObj.type = "OPEN_CHAT";
            newObj.body = parsedObj.open_chat.data;
        }
        if (parsedObj.setLivechatCustomVariables !== undefined) {
            newObj.type = "SET_LC_CUSTOM_VAR";
            newObj.body = parsedObj.setLivechatCustomVariables;
        }
        var newJsonString = JSON.stringify(newObj);
        parent.postMessage(newJsonString, "*");
    }
};
var communicator = {
    data_class: url_hash_driver,
    write_flag: true,
    timing: [],
    attempts: {},
    running: 0,
    counter: 0,
    read: function() {
        var all_data = this.data_class.read();
        if (all_data == '') {
            all_data = '{}';
        }
        try {
            var json_data = json_parse(all_data);
        } catch (e) {
            return ({});
        }
        return (json_data);
    },
    write: function(id, data) {
        if (use_communicator == 0) {
            return;
        }
        if (typeof(communicator_driver) !== "undefined") {
            this.data_class = window[communicator_driver];
        }
        if (this.write_flag == true) {
            this.running = this.running + 1;
            this.write_flag = false;
            var json_data = {};
            json_data[id] = data;
            json_data = $.toJSON(json_data);
            this.data_class.write(json_data);
        } else {
            this.counter = this.counter + 1;
            this.timing[this.counter] = Date.now();
            setTimeout("communicator.delayed_write('" + id + "'," + $.toJSON(data) + ")", 300);
        }
    },
    delayed_write: function(id, data) {
        if (this.timing[this.running] + 300 <= Date.now()) {
            this.write_flag = true;
            var next_run = this.running + 1;
            if (next_run in this.timing) {
                this.timing[next_run] = Date.now();
            }
        }
        this.write(id, data);
    },
    interval_write: function(id, data) {
        var calculated_data = {};
        for (var i in data) {
            if (typeof data[i] === 'function') {
                calculated_data[i] = (data[i])();
            } else {
                calculated_data[i] = data[i];
            }
        }
        setTimeout(function() {
            communicator.write(id, calculated_data);
            communicator.interval_write(id, data);
        }, 300);
    },
    clean: function() {
        this.data_class.clean();
    },
    host_action: function() {
        msg = this.read();
        if (!$.isEmptyObject(msg)) {
            this.clean();
            widget_comunicator_callback(msg);
        }
    }
};
var main_communicator_interval = 0;
$(document).ready(function() {
    if (self.parent === self) {
        main_communicator_interval = setInterval("communicator.host_action()", 100);
    }
});