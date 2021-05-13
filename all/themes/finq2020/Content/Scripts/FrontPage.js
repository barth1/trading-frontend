function FrontPage(instruments) {
    SetupInstrumentsMarketPrice(instruments);
    GetInstrumentsSentiment(SetInstrumentsSentimentCarousel);
}
$(document).ready(function() {
    var direction = $("html").attr("dir");
    var rtlDirection = false;
    if (direction === "rtl") {
        rtlDirection = true;
    }
    $('#testimonials-carousel').slick({
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        speed: 300,
        rtl: rtlDirection,
        responsive: [{
            breakpoint: 768,
            settings: {
                dots: true,
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 576,
            settings: {
                dots: true,
                centerMode: true,
                initialSlide: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                centerPadding: '30px'
            }
        }]
    });
    $('#forex-carousel, #stocks-carousel, #commodities-carousel, #indices-carousel, #popular-carousel').slick({
        dots: true,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        speed: 300,
        rtl: rtlDirection,
        responsive: [{
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 576,
            settings: {
                centerMode: true,
                initialSlide: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                centerPadding: '50px'
            }
        }]
    });
    $("input#phone_code, input#phone_number").change(function() {
        var code = $("input#phone_code").val();
        var number = $("input#phone_number").val();
        number = code + number;
        number = number.replace("+", "00");
        $("input#phone").val(number);
    });
});