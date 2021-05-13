var form_guid_input_id = "unique_guid";
var client_swf_path_prefix = "/";
var requiredMajorVersion = 9;
var requiredMinorVersion = 0;
var requiredRevision = 124;
var guidKey = "GFCMGUID";
var fallbackTimer = 5000;
var so_ready = false;
var guid = "0000-0000-00000000-0000-000000000000";
var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
var so_timeout_timer;
var unique_guid_elements = [];
window.onload = function() {
    var els = document.getElementsByTagName('input');
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + form_guid_input_id + "(\\s|$)");
    for (i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            unique_guid_elements.push(els[i]);
            j++;
        }
    }
    if (j > 0) {
        embed_guid_flash();
        so_timeout_timer = setTimeout(main_so_logic, fallbackTimer);
    }
};

function flash_so_ready() {
    so_ready = true;
    clearTimeout(so_timeout_timer);
    main_so_logic();
}

function main_so_logic() {
    if (so_ready) {
        so_temp = flash_so_load(guidKey);
        if (is_guid(so_temp)) {
            guid = so_temp;
        } else {
            js_temp = js_cookie_load(guidKey);
            if (is_guid(js_temp)) {
                guid = js_temp;
                flash_so_save(guidKey, guid);
            }
        }
        if (!is_guid(guid)) {
            guid = generate_guid();
            flash_so_save(guidKey, guid);
        }
    } else {
        js_temp = js_cookie_load(guidKey);
        if (is_guid(js_temp)) {
            guid = js_temp;
        }
        if (!is_guid(guid)) {
            guid = generate_guid();
            js_cookie_save(guidKey, guid);
        }
    }
    for (i = 0; i < unique_guid_elements.length; i++) {
        unique_guid_elements[i].value = guid;
    }
    js_cookie_save(guidKey, guid);
}

function generate_guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function is_guid(guid) {
    if (guid == "0000-0000-00000000-0000-000000000000") return false;
    if (!guid) return false;
    GuidRegExp = /^[{|\(]?[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}[\)|}]?$/;
    return GuidRegExp.test(guid);
}

function js_cookie_save(name, value) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * 365 * 5);
    document.cookie = name + "=" + escape(value) + ";expires=" + expire.toGMTString() + "path=/";
}

function js_cookie_load(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function flash_so_save(name, value) {
    var SharedObjectClient = getFlashMovieObject("SharedObjectClient");
    SharedObjectClient.saveLocal(name, value);
}

function flash_so_load(name) {
    var SharedObjectClient = getFlashMovieObject("SharedObjectClient");
    return SharedObjectClient.readLocal(name);
}

function getFlashMovieObject(movieName) {
    if (document.embeds[movieName]) {
        try {
            if (document.embeds[movieName].length > 0) {
                return document.embeds[movieName][0];
            }
        } catch (e) {
            return document.embeds[movieName];
        }
    }
    if (window.document[movieName]) return window.document[movieName];
    if (window[movieName]) return window[movieName];
    if (document[movieName]) return document[movieName];
    return null;
}

function embed_guid_flash() {
    var flash_html = '<noscript><object style="display:none;" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="SharedObjectClient" width="0" height="0" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"> <param name="movie" value="' + client_swf_path_prefix + 'SharedObjectClient.swf" /> <param name="quality" value="high" /> <param name="allowScriptAccess" value="sameDomain" />  <embed src="SharedObjectClient.swf" quality="high" width="0" height="0" name="SharedObjectClient" play="true" loop="false" quality="high" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer"></embed></object></noscript>'
    addHTML(flash_html);
    var hasProductInstall = DetectFlashVer(6, 0, 65);
    var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);
    if (hasProductInstall && !hasRequestedVersion) {
        var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
        var MMredirectURL = window.location;
        document.title = document.title.slice(0, 47) + " - Flash Player Installation";
        var MMdoctitle = document.title;
        AC_FL_RunContent("src", client_swf_path_prefix + "expressInstall", "FlashVars", "MMredirectURL=" + MMredirectURL + '&MMplayerType=' + MMPlayerType + '&MMdoctitle=' + MMdoctitle + "", "id", "SharedObjectClient", "quality", "high", "name", "SharedObjectClient", "allowScriptAccess", "sameDomain", "type", "application/x-shockwave-flash", "pluginspage", "http://www.adobe.com/go/getflashplayer");
    } else if (hasRequestedVersion) {
        AC_FL_RunContent("src", client_swf_path_prefix + "SharedObjectClient", "width", "1px", "height", "1px", "display", "none", "id", "SharedObjectClient", "quality", "high", "name", "SharedObjectClient", "allowScriptAccess", "sameDomain", "type", "application/x-shockwave-flash", "pluginspage", "http://www.adobe.com/go/getflashplayer");
    } else {
        var alternateContent = 'Alternate HTML content should be placed here. ' + 'This content requires the Adobe Flash Player. ' + '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
    }
}

function addHTML(html) {
    if (document.all)
        document.body.insertAdjacentHTML('beforeEnd', html);
    else if (document.createRange) {
        var range = document.createRange();
        range.setStartAfter(document.body.lastChild);
        var cFrag = range.createContextualFragment(html);
        document.body.appendChild(cFrag);
    } else if (document.layers) {
        var X = new Layer(window.innerWidth);
        X.document.open();
        X.document.write(html);
        X.document.close();
        X.top = document.height;
        document.height += X.document.height;
        X.visibility = 'show';
    }
}

function ControlVersion() {
    var version;
    var axo;
    var e;
    try {
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
    } catch (e) {}
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            version = "WIN 6,0,21,0";
            axo.AllowScriptAccess = "always";
            version = axo.GetVariable("$version");
        } catch (e) {}
    }
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = axo.GetVariable("$version");
        } catch (e) {}
    }
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = "WIN 3,0,18,0";
        } catch (e) {}
    }
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            version = "WIN 2,0,0,11";
        } catch (e) {
            version = -1;
        }
    }
    return version;
}

function GetSwfVer() {
    var flashVer = -1;
    if (navigator.plugins != null && navigator.plugins.length > 0) {
        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
            var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");
            var versionMajor = tempArrayMajor[0];
            var versionMinor = tempArrayMajor[1];
            var versionRevision = descArray[3];
            if (versionRevision == "") {
                versionRevision = descArray[4];
            }
            if (versionRevision[0] == "d") {
                versionRevision = versionRevision.substring(1);
            } else if (versionRevision[0] == "r") {
                versionRevision = versionRevision.substring(1);
                if (versionRevision.indexOf("d") > 0) {
                    versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                }
            } else if (versionRevision[0] == "b") {
                versionRevision = versionRevision.substring(1);
            }
            var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
        }
    } else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
    else if (isIE && isWin && !isOpera) {
        flashVer = ControlVersion();
    }
    return flashVer;
}

function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
    versionStr = GetSwfVer();
    if (versionStr == -1) {
        return false;
    } else if (versionStr != 0) {
        if (isIE && isWin && !isOpera) {
            tempArray = versionStr.split(" ");
            tempString = tempArray[1];
            versionArray = tempString.split(",");
        } else {
            versionArray = versionStr.split(".");
        }
        var versionMajor = versionArray[0];
        var versionMinor = versionArray[1];
        var versionRevision = versionArray[2];
        if (versionMajor > parseFloat(reqMajorVer)) {
            return true;
        } else if (versionMajor == parseFloat(reqMajorVer)) {
            if (versionMinor > parseFloat(reqMinorVer))
                return true;
            else if (versionMinor == parseFloat(reqMinorVer)) {
                if (versionRevision >= parseFloat(reqRevision))
                    return true;
            }
        }
        return false;
    }
}

function AC_AddExtension(src, ext) {
    var qIndex = src.indexOf('?');
    if (qIndex != -1) {
        var path = src.substring(0, qIndex);
        if (path.length >= ext.length && path.lastIndexOf(ext) == (path.length - ext.length))
            return src;
        else
            return src.replace(/\?/, ext + '?');
    } else {
        if (src.length >= ext.length && src.lastIndexOf(ext) == (src.length - ext.length))
            return src;
        else
            return src + ext;
    }
}

function AC_Generateobj(objAttrs, params, embedAttrs) {
    var str = '';
    if (isIE && isWin && !isOpera) {
        str += '<object ';
        for (var i in objAttrs)
            str += i + '="' + objAttrs[i] + '" ';
        str += '>';
        for (var i in params)
            str += '<param name="' + i + '" value="' + params[i] + '" /> ';
        str += '</object>';
    } else {
        str += '<embed ';
        for (var i in embedAttrs)
            str += i + '="' + embedAttrs[i] + '" ';
        str += '> </embed>';
    }
    addHTML(str);
}

function AC_FL_RunContent() {
    var ret = AC_GetArgs(arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
    AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType) {
    var ret = new Object();
    ret.embedAttrs = new Object();
    ret.params = new Object();
    ret.objAttrs = new Object();
    for (var i = 0; i < args.length; i = i + 2) {
        var currArg = args[i].toLowerCase();
        switch (currArg) {
            case "classid":
                break;
            case "pluginspage":
                ret.embedAttrs[args[i]] = args[i + 1];
                break;
            case "src":
            case "movie":
                args[i + 1] = AC_AddExtension(args[i + 1], ext);
                ret.embedAttrs["src"] = args[i + 1];
                ret.params[srcParamName] = args[i + 1];
                break;
            case "onafterupdate":
            case "onbeforeupdate":
            case "onblur":
            case "oncellchange":
            case "onclick":
            case "ondblClick":
            case "ondrag":
            case "ondragend":
            case "ondragenter":
            case "ondragleave":
            case "ondragover":
            case "ondrop":
            case "onfinish":
            case "onfocus":
            case "onhelp":
            case "onmousedown":
            case "onmouseup":
            case "onmouseover":
            case "onmousemove":
            case "onmouseout":
            case "onkeypress":
            case "onkeydown":
            case "onkeyup":
            case "onload":
            case "onlosecapture":
            case "onpropertychange":
            case "onreadystatechange":
            case "onrowsdelete":
            case "onrowenter":
            case "onrowexit":
            case "onrowsinserted":
            case "onstart":
            case "onscroll":
            case "onbeforeeditfocus":
            case "onactivate":
            case "onbeforedeactivate":
            case "ondeactivate":
            case "type":
            case "codebase":
                ret.objAttrs[args[i]] = args[i + 1];
                break;
            case "id":
            case "width":
            case "height":
            case "align":
            case "vspace":
            case "hspace":
            case "class":
            case "title":
            case "accesskey":
            case "name":
            case "tabindex":
                ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i + 1];
                break;
            default:
                ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i + 1];
        }
    }
    ret.objAttrs["classid"] = classid;
    if (mimeType) ret.embedAttrs["type"] = mimeType;
    return ret;
}