(function($) {
    Drupal.googleanalytics = {};
    $(document).ready(function() {
        $(document.body).bind("mousedown keyup touchstart", function(event) {
            $(event.target).closest("a,area").each(function() {
                if (Drupal.googleanalytics.isInternal(this.href)) {
                    if ($(this).is('.colorbox') && (Drupal.settings.googleanalytics.trackColorbox)) {} else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
                        ga("send", {
                            "hitType": "event",
                            "eventCategory": "Downloads",
                            "eventAction": Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(),
                            "eventLabel": Drupal.googleanalytics.getPageUrl(this.href),
                            "transport": "beacon"
                        });
                    } else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
                        ga("send", {
                            "hitType": "pageview",
                            "page": Drupal.googleanalytics.getPageUrl(this.href),
                            "transport": "beacon"
                        });
                    }
                } else {
                    if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
                        ga("send", {
                            "hitType": "event",
                            "eventCategory": "Mails",
                            "eventAction": "Click",
                            "eventLabel": this.href.substring(7),
                            "transport": "beacon"
                        });
                    } else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
                        if (Drupal.settings.googleanalytics.trackDomainMode !== 2 || (Drupal.settings.googleanalytics.trackDomainMode === 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
                            ga("send", {
                                "hitType": "event",
                                "eventCategory": "Outbound links",
                                "eventAction": "Click",
                                "eventLabel": this.href,
                                "transport": "beacon"
                            });
                        }
                    }
                }
            });
        });
        if (Drupal.settings.googleanalytics.trackUrlFragments) {
            window.onhashchange = function() {
                ga("send", {
                    "hitType": "pageview",
                    "page": location.pathname + location.search + location.hash
                });
            };
        }
        if (Drupal.settings.googleanalytics.trackColorbox) {
            $(document).bind("cbox_complete", function() {
                var href = $.colorbox.element().attr("href");
                if (href) {
                    ga("send", {
                        "hitType": "pageview",
                        "page": Drupal.googleanalytics.getPageUrl(href)
                    });
                }
            });
        }
    });
    Drupal.googleanalytics.isCrossDomain = function(hostname, crossDomains) {
        if (!crossDomains) {
            return false;
        } else {
            return $.inArray(hostname, crossDomains) > -1 ? true : false;
        }
    };
    Drupal.googleanalytics.isDownload = function(url) {
        var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
        return isDownload.test(url);
    };
    Drupal.googleanalytics.isInternal = function(url) {
        var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
        return isInternal.test(url);
    };
    Drupal.googleanalytics.isInternalSpecial = function(url) {
        var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
        return isInternalSpecial.test(url);
    };
    Drupal.googleanalytics.getPageUrl = function(url) {
        var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
        return url.replace(extractInternalUrl, '');
    };
    Drupal.googleanalytics.getDownloadExtension = function(url) {
        var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
        var extension = extractDownloadextension.exec(url);
        return (extension === null) ? '' : extension[1];
    };
})(jQuery);