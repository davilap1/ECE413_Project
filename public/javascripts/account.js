// public/javasciprts/account.js
$(function (){
    $('#btnLogOut').click(logout);
    $('#btnChangePassword').click(changePasswordPage);
    $('#btnDevices').click(editDevices);

    $.ajax({
        url: '/customers/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});



function logout() {
    localStorage.removeItem("token");
    window.location.replace("index.html");
}

function changePasswordPage() {
    window.location.replace("changePass.html");
}

function editDevices() {
    window.location.replace("editDevice.html");
}
