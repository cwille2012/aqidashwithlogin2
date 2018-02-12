function loadDefaults() {
    if (String(localStorage.getItem("dataDashDefaultColor")) == "purple") {
        console.log("default color is purple");
        if ($('#mainNav').hasClass('bg-dark')) {
            $('#mainNav').removeClass('bg-dark');
        }
        if ($('#mainNav').hasClass('navbar-dark')) {
            $('#mainNav').removeClass('navbar-dark');
        }
        if ($('#mainNav').hasClass('bg-dark')) {
            $('#page-top').removeClass('bg-dark');
        }

        if ($('#mainNav').hasClass('bg-purple')) {
            //do nothing
        } else {
            $('#mainNav').addClass('bg-purple')
        }
        if ($('#mainNav').hasClass('navbar-purple')) {
            //do nothing
        } else {
            $('#mainNav').addClass('navbar-purple')
        }
        if ($('#page-top').hasClass('bg-purple')) {
            //do nothing
        } else {
            $('#page-top').addClass('bg-purple')
        }
    } else if (String(localStorage.getItem("dataDashDefaultColor")) == "dark") {
        console.log("default color is dark");
        if ($('#mainNav').hasClass('bg-purple')) {
            $('#mainNav').removeClass('bg-purple');
        }
        if ($('#mainNav').hasClass('navbar-purple')) {
            $('#mainNav').removeClass('navbar-purple');
        }
        if ($('#page-top').hasClass('bg-purple')) {
            $('#page-top').removeClass('bg-purple');
        }

        if ($('#mainNav').hasClass('bg-dark')) {
            //do nothing
        } else {
            $('#mainNav').addClass('bg-dark');
        }
        if ($('#mainNav').hasClass('navbar-dark')) {
            //do nothing
        } else {
            $('#mainNav').addClass('navbar-dark');
        }
        if ($('#mainNav').hasClass('bg-dark')) {
            //do nothing
        } else {
            $('#mainNav').addClass('bg-dark');
        }
    } else {
        //error
        console.log("Error: undefined default color");
    }

    if (String(localStorage.getItem("dataDashDefaultNavPos")) == "fixed") {
        console.log("default position is fixed");
    } else if (String(localStorage.getItem("dataDashDefaultNavPos")) == "static") {
        console.log("default position is static");
    } else {
        //error
        console.log("Error: undefined default position");
    }
}