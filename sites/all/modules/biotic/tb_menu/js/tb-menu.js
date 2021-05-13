(function($) {
    var undef;
    if (jQuery.browser == undef) {
        jQuery.browser = {};
        (function() {
            jQuery.browser.msie = false;
            jQuery.browser.version = 0;
            if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                jQuery.browser.msie = true;
                jQuery.browser.version = RegExp.$1;
            }
        })();
    }
    Drupal.behaviors.BioticMenu = {
        attach: function(context, settings) {
            $("nav ul.tb-menu li").each(function() {
                var $this = jQuery(this),
                    $win = jQuery(window);
                if ($this.offset().left + 250 > $win.width() + $win.scrollLeft() - $this.width()) {
                    $this.addClass("nav-shift");
                }
            });
            if ($.browser.msie && $.browser.version.substr(0, 1) < 7) {
                $('li').has('ul').mouseover(function() {
                    $(this).children('ul').css('visibility', 'visible');
                }).mouseout(function() {
                    $(this).children('ul').css('visibility', 'hidden');
                })
            }
        }
    };
})(jQuery);