$(document).ready(function() {
    $(".sub-category-tab").click(function() {
        var isActive = $(this).hasClass("active");
        if (!isActive) {
            $(this).parent().find(".sub-category-tab.active").removeClass("active").removeClass("btn").removeClass("btn-promo");
            $(this).addClass("active btn btn-promo");
        }
    });
    $(".theme-tabs .theme-tab-nav").click(function() {
        if (!$(this).hasClass("active")) {
            var activate = $(this).attr("tab");
            $(".theme-tab.active").removeClass("active").fadeOut(0);
            $(activate).addClass("active").fadeIn(300);
            $(".theme-tab-nav.active").addClass("disabled").removeClass("active");
            $(this).removeClass("disabled").addClass("active");
        }
    });
    $(".theme-tabs .theme-tab-nav").click(function() {
        if (!$(this).hasClass("active")) {
            var activate = $(this).attr("tab");
            $(".theme-tab.active").removeClass("active").fadeOut(0);
            $(activate).addClass("active").fadeIn(300);
            $(".theme-tab-nav.active").addClass("disabled").removeClass("active");
            $(this).removeClass("disabled").addClass("active");
        }
    });
    var currentURL = window.location.href;
    if (currentURL.indexOf('platform=apptrade') > 0) {
        $(".theme-tab.active").removeClass("active").fadeOut(0);
        $('.theme-tab-nav.active').removeClass('active').addClass('disabled');
        $('#tab2').addClass("active").fadeIn(300);
        $('#tab2Btn').removeClass("disabled").addClass("active");
    } else if (currentURL.indexOf('platform=metatrader-4') > 0) {
        $(".theme-tab.active").removeClass("active").fadeOut(0);
        $('.theme-tab-nav.active').removeClass('active').addClass('disabled');
        $('#tab3').addClass("active").fadeIn(300);
        $('#tab3Btn').removeClass("disabled").addClass("active");
    }
    var isNewsArticle = $('.node-my-news').length;
    if (isNewsArticle > 0) {
        var img = $('.my_news_image').html();
        var content = $('.my_news_body').html();
        var article = '<div class="news-content full">';
        article += '<div class="my_news_image">' + img + '</div>';
        article += '<div class="my_news_body">' + content + '</div>';
        article += '</div>';
        $('.my_news_body').remove();
        $('.my_news_image').html(article).removeClass('my_news_image');
    }
});