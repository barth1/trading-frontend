$(document).ready(function() {});

function IsSafari() {
    var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && navigator.userAgent.indexOf('CriOS') == -1 && navigator.userAgent.indexOf('FxiOS') == -1;
    if (isSafari) {
        $("#front-page #registration h2").text("Safari");
    } else {
        $("#front-page #registration h2").text("No Safari");
    }
}

function SetupInstrumentsMarketPrice(instruments) {
    var length = instruments.length;
    for (var i = 0; i < length; i++) {
        SetInstrumentsData(instruments[i]);
    }
}

function SetInstrumentsData(name) {
    var apuUrl = "https://api-v2.finq.com/quotesv2?key=1&callback=callbackQuotes&q=" + name;
    $.ajax({
        url: apuUrl,
        success: function(result) {
            eval(result);
        }
    });
}

function callbackQuotes(data) {
    for (var key in data) {
        $("#" + key + "-instrument .info .sell b").text(data[key].sell);
        $("#" + key + "-instrument .info .buy b").text(data[key].buy);
    }
}

function GetInstrumentsSentiment(callBack) {
    var apuUrl = "https://api-v2.trade.com/sentiment?key=1&brand=trade";
    $.ajax({
        url: apuUrl,
        success: function(result) {
            callBack(result);
        }
    });
}

function SetInstrumentsSentimentCarousel(data) {
    for (var key in data) {
        var obj = data[key];
        $("#" + key + "-instrument .percentage .red").css("width", obj.percentageOfShorts + "%");
        $("#" + key + "-instrument .percentage-descr .sell b").text(obj.percentageOfLongs + "%");
        $("#" + key + "-instrument .percentage-descr .buy b").text(obj.percentageOfShorts + "%");
    }
}