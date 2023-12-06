function changePassword() {
    console.log("WHY!!!!?????");
    if ($("#newPassword").val() != $("#confirmPassword").val()) {
        window.alert("New password does NOT match!!");
        return;
    }
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
    if ($('#newPassword').val() == $('#currentPass').val()) {
        window.alert("New Password must be different from Old Password");
        return;
    }

    var data2 = {
        oldPassword: $('#currentPass').val(),
        newPassword: $('#newPassword').val()
    }

    $.ajax({
        type: "POST",
        url: '/customers/changePassword',
        headers: { 'x-auth': window.localStorage.getItem("token")},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data2),
    })
    .done(function (data, textStatus, jqXHR) {
        window.location.replace("account.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 404) {
            $('#rxData').html("Server could not be reached!!!");    
        }
        else $('#rxData').html(JSON.stringify(jqXHR, null, 2));
    });

}

function cancelChange () {
    window.location.replace("account.html");
}

$(function () {
    $('#btnCancel').click(cancelChange);
    $('#btnChangePassword').click(changePassword);
});