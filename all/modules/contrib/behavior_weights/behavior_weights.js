(function() {
    function sortDrupalBehaviors() {
        var weights = {};
        for (var k in Drupal.behaviors) {
            var v = Drupal.behaviors[k];
            var pieces = k.split('.');
            if (pieces.length == 2 && pieces[1] === 'weight') {
                weights[pieces[0]] = v;
                delete Drupal.behaviors[k];
            } else if (typeof weights[k] != 'number') {
                if (typeof v == 'object' && v && typeof v.weight == 'number') {
                    weights[k] = v.weight;
                } else if (weights[k] == undefined) {
                    weights[k] = false;
                }
            }
        }
        var ww = [0];
        var by_weight = {
            0: {}
        };
        for (var k in weights) {
            if (Drupal.behaviors[k] == undefined) {
                continue;
            }
            var w = weights[k];
            w = (typeof w == 'number') ? w : 0;
            if (by_weight[w] == undefined) {
                by_weight[w] = {};
                ww.push(w);
            }
            by_weight[w][k] = Drupal.behaviors[k];
        }
        ww.sort(function(a, b) {
            return a - b;
        });
        Drupal.behaviors = by_weight[0];
        var sorted = [];
        for (var i = 0; i < ww.length; ++i) {
            var w = ww[i];
            sorted.push(by_weight[w]);
        }
        return sorted;
    }
    var attachBehaviors_original = Drupal.attachBehaviors;
    Drupal.attachBehaviors = function(context, settings) {
        var sorted = sortDrupalBehaviors();
        Drupal.attachBehaviors = function(context, settings) {
            context = context || document;
            settings = settings || Drupal.settings;
            for (var i = 0; i < sorted.length; ++i) {
                jQuery.each(sorted[i], function() {
                    if (typeof this.attach == 'function') {
                        this.attach(context, settings);
                    }
                });
            }
        }
        Drupal.attachBehaviors.apply(this, [context, settings]);
    };
})();