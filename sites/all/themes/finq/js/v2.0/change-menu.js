var num = 1;

function codeAddress() {
    var x = document.getElementsByClassName("logo");
    x[0].src = "/sites/all/themes/finq/images/v2.0/logos/logo" + num + ".png";
    x[0].width = "180";
    if (num == 9) {
        x[0].width = "140";
    }
    var h = document.getElementsByClassName("header");
    if (num == 2 || num == 3 || num == 4 || num == 5 || num == 8 || num == 9 || num == 10 || num == 11) {
        h[1].style.backgroundColor = "#000000";
    }
    if (num == 1 || num == 6 || num == 7) {
        h[1].style.backgroundColor = "#ffffff";
    }
    var s = document.getElementsByClassName("navbar-nav ");
    var links = s[0].getElementsByTagName('SPAN');
    var icons = s[0].getElementsByTagName('I');
    if (num == 2 || num == 3 || num == 4 || num == 5 || num == 8 || num == 9 || num == 10 || num == 11) {
        h[1].style.backgroundColor = "#000000";
        for (i = 0; i < links.length; i++) {
            links[i].style.color = "#ffffff";
        }
        for (i = 0; i < icons.length; i++) {
            icons[i].style.color = "#ffffff";
        }
    }
    if (num == 1 || num == 6 || num == 7) {
        h[1].style.Color = "#ffffff";
        for (i = 0; i < links.length; i++) {
            links[i].style.color = "#000000";
        }
        for (i = 0; i < icons.length; i++) {
            icons[i].style.color = "#000000";
        }
    }
    for (i = 0; i < links.length; i++) {
        links[i]
    }
    var dm = document.getElementsByClassName("dropdown-menu ");
    var linksDM = dm[0].getElementsByTagName('SPAN');
    if (num == 2 || num == 4 || num == 5 || num == 8 || num == 3) {
        for (i = 0; i < linksDM.length; i++) {
            linksDM[i].style.color = "#dcad54";
        }
    }
    if (num == 1 || num == 6 || num == 7) {
        for (i = 0; i < linksDM.length; i++) {
            linksDM[i].style.color = "#dcad54";
        }
    }
    for (i = 0; i < links.length; i++) {
        linksDM[i]
    }
    num++;
    if (num > 11) {
        num = 1;
    }
}
var change = true;

function changeFooter() {
    console.log('Hello');
    var footer = document.getElementById("footer-width");
    var width_foot = footer.getElementsByClassName("theme-content");
    if (change) {
        width_foot[0].style.width = "1150px";
        change = false;
    } else {
        width_foot[0].style.width = "1850px";
        change = true;
    }
}