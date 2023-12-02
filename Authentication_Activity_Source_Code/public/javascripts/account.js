// public/javasciprts/account.js
$(function (){
    $('#btnLogOut').click(logout);
    $('#btnChangePass').click(changePass);

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

function changePass() {
    
    if ($('#newPassword').val().length < 10 || $('#newPassword').val().length > 20) {
        // errorString += "<li>Password must be between 10 and 20 characters.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must be between 10 and 20 characters.");
        return;
    }
    if (!(/[a-z]/.test($('#newPassword').val()))) {
        // errorString += "<li>Password must contain at least one lowercase character.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must contain at least one lowercase character.");
        return;
    }
    if (!(/[A-Z]/.test($('#newPassword').val()))) {
        // errorString += "<li>Password must contain at least one uppercase character.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must contain at least one uppercase character.");
        return;
    }
    if (!(/[0-9]/.test($('#newPassword').val()))) {
        // errorString += "<li>Password must contain at least one digit.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must contain at least one digit.");
        return;
    }
    if ($('#newPassword').val() == $('#oldPassword').val()) {
        window.alert("New Password must be different from Old Password");
        return;
    }

    var data2 = {
        confirmEmail: $('#email').val(),
        oldPassword: $('#oldPassword').val(),
        newPassword: $('#newPassword').val()
    }
    $.ajax({
        type: "POST",
        url: '/customers/changePassword',
        headers: { 'x-auth': window.localStorage.getItem("token")},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data2),
        // success: function (response) {
        //     // Handle success response
        //     document.getElementById("result").innerText = "Password changed successfully!";
        // },
        // error: function (error) {
        //     // Handle error response
        //     document.getElementById("result").innerText = "Error changing password. Please try again.";
        // }
    })
    .done(function (data, textStatus, jqXHR) {
        document.getElementById("result").innerText = "Password changed successfully!";
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        // Handle error response
        document.getElementById("result").innerText = "Error changing password. Please try again.";
    });
    
}