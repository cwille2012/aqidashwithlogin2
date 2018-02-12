$("#btn-logout").click(() => {
    localStorage.removeItem("dataDashFullName");
    localStorage.removeItem("dataDashEmail");
    localStorage.removeItem("dataDashUserName");
    localStorage.removeItem("dataDashCountry");
    localStorage.removeItem("dataDashUserID");
    localStorage.removeItem("dataDashPassHash");
    localStorage.removeItem("dataDashDefaultColor");
    localStorage.removeItem("dataDashDefaultNavPos");
    $.ajax({
        url: "/logout",
        type: "POST",
        data: {
            logout: true
        },
        success: function(data) {
            console.log("hup");
            location.reload();
        },
        error: function(jqXHR) {
            console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
        }
    });
});