$(document).ready(function() {

    $("#btn-logout").click(() => {
        console.log("click")
        $.ajax({
            url: "/logout",
            type: "POST",
            data: {
                logout: true
            },
            success: function(data) {
                console.log("hup");
                location.reload();
                //that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
            },
            error: function(jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    });

});