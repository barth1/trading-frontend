(function($, Drupal) {
    Drupal.behaviors.clear_search = {
        attach: function(context) {
            $('.block-instruments .form-text', context).once(function() {
                var defaultValue = $(this).val();
                $(this).click(function() {
                    if ($(this).val() == defaultValue) {
                        $(this).val("");
                    }
                    return false;
                }).blur(function() {
                    if ($(this).val() == "") {
                        $(this).val(defaultValue);
                    }
                });
            });
            $('.block-instruments .form-text', context).bind('autocompleteSelect', function() {
                var chosen_instrument = $(this).val();
                $(this).val("");
                window.location = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'instruments/' + chosen_instrument + '/?from_search=1';
            });
        }
    }
})(jQuery, Drupal);