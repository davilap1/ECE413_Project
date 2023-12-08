// public/javasciprts/account.js
$(function (){
    $('#btnLogOut').click(logout);
    $('#btnChangePassword').click(changePasswordPage);
    $('#btnDevices').click(editDevices);
    $('#btnViewGraphs').click(viewGraphs);
    // Shows the user info (email, last access, devices, and ID) in the text area.
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

// Removes the token, effectively logs out the user
function logout() {
    localStorage.removeItem("token");
    window.location.replace("index.html");
}

// Moves to the changePass screen
function changePasswordPage() {
    window.location.replace("changePass.html");
}

// Moves to the Edit Devices screen
function editDevices() {
    window.location.replace("editDevice.html");
}

// Moves to the Graphs screen
function viewGraphs() {
    window.location.replace("graphs.html");
}
