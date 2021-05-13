(function($) {
    Drupal.behaviors.addthis = {
        scriptLoaded: false,
        attach: function(context, settings) {
            if (!this.isConfigLoaded() && this.isSettingsLoaded()) {
                this.initConfig();
                if (!this.scriptLoaded) {
                    this.loadDomready();
                }
            } else if (!this.isConfigLoaded() && !this.isSettingsLoaded()) {}
            if (context != window.document) {
                Drupal.behaviors.addthis.ajaxLoad(context, settings);
            }
        },
        isSettingsLoaded: function() {
            if (typeof Drupal.settings.addthis == 'undefined') {
                return false;
            }
            return true;
        },
        isConfigLoaded: function() {
            if (typeof addthis_config == 'undefined' || typeof addthis_share == 'undefined') {
                return false;
            }
            return true;
        },
        initConfig: function() {
            addthis_config = Drupal.settings.addthis.addthis_config;
            addthis_share = Drupal.settings.addthis.addthis_share;
        },
        loadDomready: function() {
            if (!this.scriptLoaded && this.isConfigLoaded() && Drupal.settings.addthis.domready) {
                $.getScript(Drupal.settings.addthis.widget_url, Drupal.behaviors.addthis.scriptReady);
            }
        },
        scriptReady: function() {
            this.scriptLoaded = true;
        },
        ajaxLoad: function(context, settings) {
            if (typeof window.addthis != 'undefined' && typeof window.addthis.toolbox == 'function') {
                window.addthis.toolbox('.addthis_toolbox');
            }
        }
    };
    if (Drupal.behaviors.addthis.isConfigLoaded()) {
        addthis_config = Drupal.settings.addthis.addthis_config;
        addthis_share = Drupal.settings.addthis.addthis_share;
    }
    $(document).ready(function() {
        Drupal.behaviors.addthis.loadDomready();
    });
}(jQuery));