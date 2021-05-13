$(document).ready(function() {
    simulateReadonlyForSelectBox();
    clearFieldsDefaultuser();
    $("form").on("submit", function() {
        setTimeout(function() {
            $('input[type=submit]').attr('disabled', 'disabled');
        }, 50);
    });
    $('input[type=submit]').prop("disabled", false);
    $('img.hover').each(function() {
        var url = $(this).attr('src');
        var arr = url.split(".");
        arr[0] = arr[0] + '_hover.';
        url = arr[0] + arr[1];
        var cache = [];
        var cacheImage = document.createElement('img');
        cacheImage.src = url;
        cache.push(cacheImage);
    });
    $(".intl-tel-input input").each(function() {
        emailWidth = $(this).closest("form").find("#email_row input").width();
        newPhoneWidth = (parseFloat(emailWidth, 10) - parseFloat($(this).css('paddingLeft')) + parseFloat($(this).css('paddingRight'))) + "px";
        $(this).width(newPhoneWidth);
    });
    $(".intl-tel-input input").not("#contact_phone1_main_phone,#contact_phone2_main_phone").on("keydown", function(e) {
        length = $(this).val().length;
        lastChar = $(this).val().substring(length - 1, length);
        plus_num = $(this).val().split("+").length - 1
        if (e.keyCode == 8 && lastChar == "+" && plus_num <= 1) {
            return false;
        }
    });
    if (typeof(cosmos_registration) !== 'undefined') {
        $("#main_phone").on("keyup", function() {
            $("#step1_continue").addClass('hover');
            $("#step1_continue").prop("disabled", false);
            main_phone_val = $(this).val();
            if (main_phone_val.length < 2) {
                $("#step1_continue").removeClass('hover');
                $("#step1_continue").prop("disabled", true);
            }
        });
        $("select").wrap("<div class='styled-select'></div>");
        $('select.error').parents().find('.styled-select').addClass('error');
        $(".styled-select").append("<div class='arrow'></div>");
        $("#document_document_file").wrap("<div class='fileUpload'></div>");
        $(".fileUpload").prepend("<span>Browse</span>");
        $(".fileUpload").before("<input id='uploadFile' placeholder='Choose File' disabled='disabled' />");
        $("#document_document_file").on("change", function() {
            $("#uploadFile").val($(this).val())
        });
        $("#uploadFile").trigger('click', function() {
            $("#document_document_file").trigger("click")
        })
        $("#reg_terms").insertBefore("#checkbox_label");
    }
    $('#toggleBackMenu').on("click", function() {
        $('#sidebar').toggle();
    });
    $("#account_currency_row .currency-selected").prepend($("#account_currency_row input:checked").parent().find('label').text());
    $("#account_currency_row .currency-change").on('click', function() {
        $("#account_currency_row .currency-selected").hide();
        $("#account_currency_row ul.radio_list").show();
        communicator.write('widget_height', {
            "widget": module,
            "height": $("body").height(),
            "width": $("body")[0].scrollWidth
        });
    });
    if ($("#account_currency_row input").is(":checked") && $('#account_currency_row input').length < 2) {
        $("#account_currency_row .currency-change").hide();
    }
    $('.password-eye').on("click", function() {
        if ($(this).hasClass('eye-open')) {
            $(this).removeClass('eye-open').addClass('eye-close');
            $(this).parent().find('input[type="password"]').each(function() {
                $(this).addClass('unhidden-eye').attr('type', 'text');
            });
        } else {
            $(this).removeClass('eye-close').addClass('eye-open');
            $(this).parent().find('.unhidden-eye').each(function() {
                $(this).removeClass('unhidden-eye').attr('type', 'password');
            });
        }
    })
});

function simulateReadonlyForSelectBox() {
    $("select").each(function() {
        if ($(this).attr('readonly') == 'readonly') {
            $(this).prop('disabled', true);
            name = $(this).prop('name');
            form = $(this).parents('form');
            $(this).data('original-name', name);
            var hiddenInput = $('<input/>', {
                type: 'hidden',
                name: name,
                value: $(this).val()
            });
            form.append(hiddenInput);
        }
    });
}

function redirect_parent(url) {
    top.location.href = url;
}

function tellHostToActivateScrollbars() {
    communicator.write("scrollbars", {
        widget: "myaccount",
        state: 'yes'
    });
}

function open_chat(link) {
    window.open(link, '', 'width=460,height=400,resizable=yes');
}

function open_parent_chat() {
    communicator.write_flag = true;
    communicator.write("open_chat", {
        widget: "registration"
    });
}

function set_cookie(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "");
}

function get_cookie(sKey) {
    if (!sKey) {
        return null;
    }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}
$(document).ready(function() {
    $("#deposit_products_real_products").on("change", function() {
        if (this.value != '') {
            $("#deposit_products_real_products").closest("form").trigger("submit");
        }
    });
    $("#deposit_country_country").on("change", function() {
        if (this.value != '') {
            $("#deposit_country_country").closest("form").trigger("submit");
        }
    });
    if (typeof use_mobile !== 'undefined') {
        if (!(window.location.href.indexOf('mobile') + 1) && use_mobile !== true) {
            $(".question").on("mouseenter", function() {
                $(this).html('<div class="tooltip"><span>' + $(this).attr('tooltip') + '</span></div>');
            }).on("mouseleave", function() {
                $(this).html('');
            });
        }
    }
    $('label').each(function() {
        errorString = $(this).attr('title');
        if (errorString != '') {
            $(this).attr('title', '').attr('errorString', errorString);
        }
    });
});
$(document).ready(function() {
    var i = 1;
    var input_main;
    var checked_main;
    $("input.subs_checkbox").each(function() {
        if (i == 1) {
            input_main = this.value;
            checked_main = this.checked;
        } else {
            $(this).css('margin-left', '30px');
            if (checked_main == false) {
                this.checked = false;
                this.disabled = true;
            }
        }
        i = i + 1;
    });
    $("input.subs_checkbox").on("click", function() {
        if (this.value == input_main) {
            var i = 1;
            var check = this.checked;
            $("input.subs_checkbox").each(function() {
                if (this.value != input_main) {
                    this.checked = check;
                    if (check == false) {
                        this.disabled = true;
                    } else {
                        this.disabled = false;
                    }
                }
                i = i + 1;
            });
        }
    });
    if (typeof(input_label) != "undefined" && input_label == true) {
        $('input[type="text"], input[type="password"]').each(function() {
            var parent = $(this).parent().attr("id");
            if (parent == '' || parent === null || parent === undefined) {
                return;
            }
            label = $("#" + parent + " label").attr("id");
            check_value_and_hide_label(this, label);
            $("#" + label).on("click", function() {
                var parent_id = $(this).parent().attr("id");
                input = $("#" + parent + " input");
                $(this).hide();
                $(input).trigger("focus");
                $(input).trigger("change");
            });
        });
        $('input[type="text"], input[type="password"]').on("focus", function() {
            var parent = $(this).parent().attr("id");
            if (parent == '' || parent === null || parent === undefined) {
                return;
            }
            label = $("#" + parent + " label").attr("id");
            $("#" + label).hide();
        });
        setInterval(function() {
            $('input[type="text"], input[type="password"]').each(function() {
                var parent = $(this).parent().attr("id");
                if (parent == '' || parent === null || parent === undefined) {
                    return;
                }
                label_new = $("#" + parent + " label").attr("id");
                check_value_and_hide_label(this, label_new);
            });
        }, 100);
        $('input[type="text"], input[type="password"]').on("blur", function() {
            if ($(this).val() == "") {
                var parent = $(this).parent().attr("id");
                if (parent == '' || parent === null || parent === undefined) {
                    return;
                }
                label = $("#" + parent + " label").attr("id");
                $("#" + label).show();
            }
        });
    }
    if (!get_cookie('LC_opened_declined_deposit') && $("#content").attr("class") == "myaccount_content_wrapper deposit_action") {
        get_payment_status(true);
    }
});

function check_value_and_hide_label(element, label) {
    setTimeout(function() {
        if ($(element).val() != "") {
            $("#" + label).hide();
        }
    }, 50);
}

function clearFieldsDefaultuser() {
    if ($('#registration_first_name').val() == 'John_test_user' && $('#registration_last_name').val() == 'Doe_test_user' && ($('#registration_form_id').val() != '22' && $('#registration_form_id').val() != '23' && $('#registration_form_id').val() != '29')) {
        $('#registration_first_name').val('');
        $('#registration_last_name').val('');
    }
    if ($('#registration_phone_main_phone').val() == '+123 123134679' && ($('#registration_form_id').val() != '22' && $('#registration_form_id').val() != '23')) {
        $('#registration_phone_main_phone').val("");
        $('#registration_phone_main_phone').intlTelInput("selectCountry", countrybyip.toLowerCase());
    }
}

function queryParameters() {
    var result = {};
    var params = window.location.search.split(/\?|\&/);
    params.forEach(function(it) {
        if (it) {
            var param = it.split("=");
            result[param[0]] = param[1];
        }
    });
    return result;
}

function buildWildcardDomainForCookies(url) {
    var TLDs = ["ac", "ad", "ae", "aero", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "arpa", "as", "asia", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "biz", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cat", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "com", "coop", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "edu", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gov", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "info", "int", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jobs", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mil", "ml", "mm", "mn", "mo", "mobi", "mp", "mq", "mr", "ms", "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz", "na", "name", "nc", "ne", "net", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "org", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "pro", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "st", "su", "sv", "sy", "sz", "tc", "td", "tel", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "travel", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "xn--0zwm56d", "xn--11b5bs3a9aj6g", "xn--3e0b707e", "xn--45brj9c", "xn--80akhbyknj4f", "xn--90a3ac", "xn--9t4b11yi5a", "xn--clchc0ea0b2g2a9gcd", "xn--deba0ad", "xn--fiqs8s", "xn--fiqz9s", "xn--fpcrj9c3d", "xn--fzc2c9e2c", "xn--g6w251d", "xn--gecrj9c", "xn--h2brj9c", "xn--hgbk6aj7f53bba", "xn--hlcj6aya9esc7a", "xn--j6w193g", "xn--jxalpdlp", "xn--kgbechtv", "xn--kprw13d", "xn--kpry57d", "xn--lgbbat1ad8j", "xn--mgbaam7a8h", "xn--mgbayh7gpa", "xn--mgbbh1a71e", "xn--mgbc0a9azcg", "xn--mgberp4a5d4ar", "xn--o3cw4h", "xn--ogbpf8fl", "xn--p1ai", "xn--pgbs0dh", "xn--s9brj9c", "xn--wgbh1c", "xn--wgbl6a", "xn--xkc2al3hye2a", "xn--xkc2dl3a5ee0h", "xn--yfro4i67o", "xn--ygbi2ammx", "xn--zckzah", "xxx", "ye", "yt", "za", "zm", "zw"].join();
    url = url.replace(/(^\w+:|^)\/\//, '');
    url = url.replace(/www./g, "");
    var parts = url.split('/');
    url = parts[0];
    parts = url.split('.');
    if (parts[0] === 'www' && parts[1] !== 'com') {
        parts.shift()
    }
    var ln = parts.length,
        i = ln,
        minLength = parts[parts.length - 1].length,
        part;
    while (part = parts[--i]) {
        if (i === 0 || i < ln - 2 || part.length < minLength || TLDs.indexOf(part) < 0) {
            var actual_domain = part;
            break;
        }
    }
    var tid;
    if (typeof parts[ln - 1] != 'undefined' && TLDs.indexOf(parts[ln - 1]) >= 0) {
        tid = '.' + parts[ln - 1];
    }
    if (typeof parts[ln - 2] != 'undefined' && TLDs.indexOf(parts[ln - 2]) >= 0) {
        tid = '.' + parts[ln - 2] + tid;
    }
    if (typeof tid != 'undefined')
        actual_domain = actual_domain + tid;
    else
        actual_domain = actual_domain + '.com';
    return actual_domain;
}

function get_payment_status(callAgain) {
    callAgain = typeof callAgain !== 'undefined' ? callAgain : true;
    var deposit_status_url = "/" + widgets_locale + "/message/GetDepositStatus";
    $.ajax({
        type: "GET",
        url: deposit_status_url
    }).done(function(response_data) {
        if (response_data) {
            response_data_obj = JSON.parse(response_data);
            if (response_data_obj.deposit_declined) {
                callAgain = false;
                communicator.write_flag = true;
                communicator.write("open_chat", {
                    data: response_data_obj
                });
                set_cookie("LC_opened_declined_deposit", true, 1 / 24 / 12, "/", response_data.cookiedomain, null);
            }
        }
        if (callAgain) {
            setTimeout(function() {
                get_payment_status(callAgain);
            }, 5000);
        }
    });
}