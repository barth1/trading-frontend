if (!require_msg) {
    var require_msg = '%field_name% field is required';
}
if (!form_submitted) {
    var form_submitted = false;
}
if (!last_clicked) {
    var last_clicked = '';
}

function validate_all() {
    is_valid = true;
    var first_focus = null;
    $("input[type=text], input[type=number], input[type=password],input[type=radio], input[type=checkbox], select").each(function() {
        if ($(this).attr('rule') && ($(this).attr('disabled') !== 'disabled')) {
            eval('res=' + $(this).attr('rule'));
            if (!validate_single(res, this)) {
                is_valid = false;
                withdrawal_destination_countries
                if (first_focus == null) {
                    first_focus = $(this).offset();
                }
            }
        }
    });
    error_format = getURLParameter('error_format');
    var errorList = "";
    if (error_format == 'alert') {
        var error_items = $('.error_item');
        if (error_items.length) {
            error_items.each(function(index) {
                var currentError = $(this).contents().filter(function() {
                    return this.nodeType == 3
                }).text();
                if (currentError != '') {
                    errorList += currentError + "\n\n";
                }
            });
            error_items.remove();
            if (errorList != '') {
                alert(errorList);
            }
            $("input[type=submit]").prop("disabled", false);
        }
    }
    communicator.write('widget_height', {
        "widget": module,
        "height": $("body").height(),
        "width": $("body")[0].scrollWidth
    });
    if (first_focus != null) {
        communicator.write('scroll', {
            "widget": module,
            "position": first_focus.top
        });
    }
    return is_valid;
}

function validate_single_on_blur(res, current) {
    if (!form_submitted) {
        validate_single(res, current);
    }
}

function validate_single(res, current) {
    if (res.msg) {
        $(current).parents('.form_row').addClass('with-error');
        if ($('#' + res.field_name + '_error .error_item').html() != null) {
            $('#' + res.field_name + '_error .error_item').html(res.msg);
            communicator.write('widget_height', {
                "widget": module,
                "height": $("body").height(),
                "width": $("body")[0].scrollWidth
            });
            var focus_pos = $(":focus").offset();
            if (focus_pos == null) {
                focus_pos = $(current).offset();
            }
        } else {
            add_error_msg(res, current);
        }
        return false;
    } else {
        $(current).parents('.form_row').removeClass('with-error');
        if (res.multiple) {
            setTimeout(function() {
                check_multiple_fields(res, current);
            }, 10);
        } else {
            $('#' + res.field_name + '_error .error_item').html('');
            var url = window.location.href;
            if (url.indexOf('mobile') + 1) {
                $('#' + res.field_name + '_row input').removeClass('error_input');
            } else if (url.indexOf('25') + 1) {
                $('#' + res.field_name + '_row input').removeClass('error');
                $('#' + res.field_name + '_row select').removeClass('error');
            }
        }
        return true;
    }
}

function add_error_msg(res, current) {
    var divTag = document.createElement('div');
    divTag.className = 'error_list';
    divTag.id = res.field_name + '_error';
    var spanTag = document.createElement('span');
    spanTag.className = 'error_item';
    $(divTag).css("display", "none");
    spanTag.innerHTML = res.msg;
    divTag.appendChild(spanTag);
    if (res.parent) {
        var parent = $(current).parents('#' + res.parent);
        parent.append(divTag);
        var url = window.location.href;
        if (url.indexOf('mobile') + 1) {
            $('label', parent).addClass('error_label');
            $('input', parent).addClass('error_input');
            var input = $('input', parent);
            if (input.attr("type") != "checkbox") {
                $('input', parent).val('');
            }
        } else if (url.indexOf('25') + 1) {
            $('input', parent).addClass('error');
            $('select', parent).addClass('error');
            $('.question', parent).hide();
        } else {
            $('.question', parent).hide();
        }
    } else {
        var parent = $(current).parent();
        if (parent.hasClass('styled-select')) {
            parent = $(current).parent().parent();
        }
        parent.append(divTag);
        var url = window.location.href;
        if (url.indexOf('mobile') + 1) {
            $('label', parent).addClass('error_label');
            $('input', parent).addClass('error_input');
            var input = $('input', parent);
            if (input.attr("type") != "checkbox") {
                $('input', parent).val('');
            }
        } else if (url.indexOf('25') + 1) {
            $(current).addClass('error');
            $('.question', parent).hide();
        } else {
            parent.children('.question').hide();
        }
    }
    setTimeout(function() {
        var focus_pos = $(":focus").offset();
        if (focus_pos == null) {
            focus_pos = $(current).offset();
        }
        if (focus_pos != null) {}
        if (getURLParameter('error_format') !== 'alert') {
            $(divTag).css("display", "block");
            communicator.write('widget_height', {
                "widget": module,
                "height": $("body").height(),
                "width": $("body")[0].scrollWidth
            });
        }
    }, 1000);
}

function validate(type, obj, require, valid_obj, msg, valid_if_hidden) {
    var res;
    var message = '';
    res = valid_require(require, obj, valid_if_hidden);
    if (res == false) {
        if (msg.msg_require) {
            message = msg.msg_require;
        } else {
            if (msg.parent) {
                var field_name = $('#' + msg.parent).children('label').text();
            } else {
                var field_name = $(obj).parents().children('label').text();
            }
            field_name = field_name.replace('*', "");
            field_name = field_name.replace(':', "");
            field_name = field_name.toLowerCase();
            var first_letter = field_name.substr(0, 1);
            field_name = first_letter.toUpperCase() + field_name.substr(1);
            message = require_msg.replace('%field_name%', field_name);
        }
    } else if (valid_if_hidden !== true && $(obj).is(':visible')) {
        switch (type) {
            case 'string':
                res = valid_string(valid_obj, obj);
                break;
            case 'integer':
                res = valid_integer(valid_obj, obj);
                break;
            case 'email':
                res = valid_email(obj);
                break;
            case 'phone':
                res = valid_phone(obj);
                break;
            case 'full_phone':
                res = valid_full_phone(obj);
                break;
            case 'select':
                res = valid_select(valid_obj, obj);
                break;
            case 'dob':
                res = valid_dob(valid_obj, obj);
                break;
            case 'check_box':
                res = valid_check_box(valid_obj, obj);
                break;
            case 'radiobutton':
                res = valid_radiobutton(valid_obj, obj);
                break;
            case 'date':
                res = valid_date(valid_obj, obj);
                break;
            case 'check_box_group':
                res = valid_check_box_group(valid_obj, obj);
        }
        if (res === false) {
            message = msg.msg;
            for (var key in msg.params) {
                message = message.replace('%' + key + '%', msg.params[key]);
            }
        }
    }
    var parent = null;
    if (msg.parent) {
        parent = msg.parent;
    }
    var multiple = null;
    if (msg.multiple_class) {
        multiple = msg.multiple_class;
    }
    var msg_obj = {
        'msg': message,
        'field_name': msg.field_name,
        'parent': parent,
        'multiple': multiple
    };
    return msg_obj;
}

function valid_require(require, obj, valid_if_hidden) {
    if (require == true) {
        if (typeof valid_if_hidden !== 'undefined' && $(obj).is(':hidden')) {
            return true;
        }
        if ($(obj).val() == '' && typeof $(obj)[0] !== 'undefined' && $(obj)[0].type != 'checkbox') {
            return false;
        }
        if ($(obj)[0].type == 'radio') {
            name = $(obj)[0].name;
            return $("input[name='" + name + "']").is(':checked');
        }
    }
    return true;
}

function valid_string(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'min':
                if ($(obj).val().length > 0 && $(obj).val().length < valid_obj[key]) return false;
                break;
            case 'max':
                if ($(obj).val().length > 0 && $(obj).val().length > valid_obj[key]) return false;
                break;
            case 'equal':
                if ($("#" + valid_obj[key]).val() != $(obj).val()) return false;
                break;
            case 'password':
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test($(obj).val())) return false;
                break;
        }
    }
    return true;
}

function valid_date(valid_obj, obj) {
    var inputDate = new Date(obj.value);
    if (Object.prototype.toString.call(inputDate) === "[object Date]") {
        if (isNaN(inputDate.getTime())) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function valid_integer(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'min':
                if ($(obj).val() < valid_obj[key]) return false;
                break;
            case 'max':
                if ($(obj).val() > valid_obj[key]) return false;
                break;
            case 'min_len':
                if ($(obj).val().length < valid_obj[key]) return false;
                break;
            case 'max_len':
                if ($(obj).val().length > valid_obj[key]) return false;
                break;
            case 'number_only':
                if (valid_obj[key] == true && $(obj).val().replace(/[0-9#]/g, '') != '') return false;
        }
    }
    return true;
}

function valid_email(obj) {
    var ATOM = '[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]';
    var IP_DOMAIN = '\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]';
    var DOMAIN = "((" + ATOM + "+\\.)+" + ATOM + "{2,})";
    var regex = new RegExp("^" + ATOM + "+(\\." + ATOM + "+)*@" + DOMAIN + "|" + IP_DOMAIN + "$", 'i');
    var val = $(obj).val();
    if (regex.test(stripslashes(val)) == false) {
        return false;
    }
    return true;
}

function valid_phone(obj) {
    var numsOnly = $(obj).val().replace(/[^0-9]/g, '');
    var noRepeat = RegExp(numsOnly.substr(0, 1), "g");
    if ($(obj).val().indexOf("#") == -1 && $(obj).val().length > 12) {
        return false;
    }
    if ($(obj).val().indexOf("#") != -1 && $(obj).val().length > 16) {
        return false;
    }
    if (numsOnly.replace(noRepeat, "") == "") {
        return false;
    }
    if ($(obj).val().replace(/[0-9#]/g, '') != '') {
        return false;
    }
    if ("01234567890".indexOf(numsOnly) != -1 || "09876543210".indexOf(numsOnly) != -1) {
        return false;
    }
    return true;
}

function valid_full_phone(obj) {
    if ($(obj).val() == '') {
        return true;
    }
    pattern = false;
    pattern2 = false;
    var phoneRegEx = "^([\+])?[0-9]{6,20}#[0-9]{1,4}$";
    var phoneRegEx2 = "^([\+])?[0-9]{6,20}$";
    var numsOnly = $(obj).val();
    numsOnly = numsOnly.replace(/[\-/\s]/g, '');
    pattern = new RegExp(phoneRegEx);
    pattern2 = new RegExp(phoneRegEx2);
    if (!((pattern && pattern.test(numsOnly)) || (pattern2 && pattern2.test(numsOnly)))) {
        return false;
    }
    $(obj).val($(obj).val().replace(/[\-]+/g, ''));
    selected_country_data = telInput.intlTelInput("getSelectedCountryData");
    main_phone_length = numsOnly.replace(/\D/g, '').length - selected_country_data.dialCode.length - 2;
    if (main_phone_length < 4) {
        return false;
    }
    if ("01234567890".indexOf(numsOnly) != -1 || "09876543210".indexOf(numsOnly) != -1) {
        return false;
    }
    return true;
}

function valid_dob(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'min_age':
                if ($('.dob_year').val() != '' && $('.dob_month').val() != '' && $('.dob_day').val() != '') {
                    if (getAge($('.dob_year').val() + "-" + $('.dob_month').val() + "-" + $('.dob_day').val()) < valid_obj[key]) {
                        return false;
                    }
                }
                break;
        }
    }
    return true;
}

function valid_select(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'require':
                if ($(obj).val() == '') {
                    return false;
                }
                break;
        }
    }
    return true;
}

function valid_check_box(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'require':
                return $(obj).prop('checked');
                break;
        }
    }
    return true;
}

function valid_check_box_group(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'require':
                var count_of_checked_elements = $(obj).closest(".form_row").find("input[type='checkbox']:checked").length;
                return (count_of_checked_elements > 0);
                break;
        }
    }
    return true;
}

function valid_radiobutton(valid_obj, obj) {
    for (var key in valid_obj) {
        switch (key) {
            case 'require':
                name = $(obj)[0].name;
                return $("input[name='" + name + "']").is(':checked');
                break;
        }
    }
    return true;
}

function check_multiple_fields(res, current) {
    var tag_error = false;
    var res1 = null;
    if (in_array(last_clicked, res.multiple) === false) {
        for (var friend in res.multiple) {
            if (res.multiple[friend] != ($(current).className)) {
                eval('res1=' + $('.' + res.multiple[friend]).attr('rule'));
                if (res1.msg) {
                    tag_error = true;
                    break;
                }
            }
        }
    }
    if (tag_error === false) {
        $('#' + res.field_name + '_error .error_item').html('');
        var url = window.location.href;
        if (url.indexOf('mobile') + 1) {
            for (var friend in res.multiple) {
                $('.' + res.multiple[friend]).removeClass('error_input');
            }
            $('#' + res.parent + ' label').removeClass('error_label');
        } else if (url.indexOf('25') + 1) {
            for (var friend in res.multiple) {
                $('#' + res.field_name + '_row input').removeClass('error');
                $('#' + res.field_name + '_row select').removeClass('error');
            }
            $('#' + res.parent + ' label').removeClass('error_label');
        }
    } else {
        if ($('#' + res.field_name + '_error').html() == null) {
            add_error_msg(res1, current);
        } else {
            $('#' + res.field_name + '_error .error_item').html(res1.msg);
        }
    }
}
var normal_border;
$(document).ready(function() {
    normal_border = $('input[type=text]').css('border-left-style');
    $('input[type=text], input[type=password],input[type=date], input[type=email], select').on('blur', execute_validation);
    $('input[type=checkbox]').on('click', execute_validation);
    $('input[type=radio]').on('click', execute_validation);
    $('input[type=text], input[type=password], input[type=radio], input[type=checkbox], select').on('focus', function() {
        last_clicked = $(this).attr('class') ? $(this).attr('class') : 'NOCLASSWHATSOEVER';
        $("input[type=submit]").prop("disabled", false);
    });
    $('input[type=checkbox]').on('click', function() {
        last_clicked = $(this).attr('class') ? $(this).attr('class') : 'NOCLASSWHATSOEVER';
        $("input[type=submit]").prop("disabled", false);
    });
    $("form").on("submit", function() {
        if (!js_validation_enabled) {
            return true;
        }
        form_submitted = false;
        if ($(this).find('.submit_btn').hasClass('prereg')) {
            if (validate_all()) {
                prereg_send($(this));
                return false;
            }
        }
        validate_all = validate_all();
        return validate_all;
    });
});

function execute_validation(event) {
    if (!js_validation_enabled) {
        return;
    }
    if ($(this).attr('rule')) {
        eval('res=' + $(this).attr('rule'));
        var _this = this;
        setTimeout(function() {
            validate_single_on_blur(res, _this);
        }, 100);
    }
    return true;
}

function in_array(needle, haystack) {
    var len = haystack.length;
    for (var i = 0; i < len; i++) {
        if (haystack[i] === needle) {
            return true;
        }
    }
    return false;
}

function stripslashes(str) {
    return (str + '').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

function prereg_send(form) {
    if (!queryParameters().skin_id || queryParameters().skin_id == 'cosmos') {
        $('body').css('background', '#000');
    };
    $('#content').css('opacity', 0.2);
    $('.loader--splasher').show();
    $("#main_error").hide();
    $.ajax({
        url: $(form).attr('action'),
        type: "post",
        data: $(form).serialize(),
        success: function(data) {
            if (data.indexOf("email_duplication") == -1 && data.indexOf("error has occurred") == -1 && data.indexOf('flash_wrap') == -1 && (data[0] == 'h' || data[0] == '/')) {
                if (data.indexOf("cosmosPreregComplete") > -1) {
                    window.location = data;
                } else {
                    window.parent.location = data;
                }
            } else {
                html_data = $.parseHTML(data);
                $("#main_error .error_item").text($(html_data).find("#main_error .error_item").text());
                $("#main_error").show();
                if (typeof communicator != 'undefined') {
                    communicator.interval_write("widget_height", {
                        "widget": "registration",
                        "height": function() {
                            return $('body').height()
                        },
                        "width": function() {
                            return $('body')[0].scrollWidth
                        }
                    });
                }
                $('#content').css('opacity', 1);
                $('.loader--splasher').hide();
            }
        }
    });
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}