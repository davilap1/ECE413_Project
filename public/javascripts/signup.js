// public/javasciprts/signup.js

function signup() {
    // data validation
    let re1 = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if ($('#email').val() === "" || !(re1.test($('#email').val()))) {
        window.alert("invalid email!");
        return;
    }
    // let re = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/;
    // if (!(re.test($('#password').val())) || $('#password').val() === "") {
    //     window.alert("8 characters length\n2 letters in Upper Case\n1 special character (!@#$*)\n2 numerals (0-9)\n3 letters in Lower Case");
    //     return;
    // }
    if ($('#password').val().length < 10 || $('#password').val().length > 20) {
        // errorString += "<li>Password must be between 10 and 20 characters.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must be between 10 and 20 characters.");
        return;
    }
    if (!(/[a-z]/.test($('#password').val()))) {
        // errorString += "<li>Password must contain at least one lowercase character.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must contain at least one lowercase character.");
        return;
    }
    if (!(/[A-Z]/.test($('#password').val()))) {
        // errorString += "<li>Password must contain at least one uppercase character.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must contain at least one uppercase character.");
        return;
    }
    if (!(/[0-9]/.test($('#password').val()))) {
        // errorString += "<li>Password must contain at least one digit.</li>";
        // divElement.style.setProperty("display", "block");
        // inputs[2].classList.add("inputError");
        window.alert("Password must contain at least one digit.");
        return;
    }
    if ($('#deviceName').val() === "") {
        window.alert("Users must register at least one device to their account.");
        return;
    }
    let txdata = {
        email: $('#email').val(),
        password: $('#password').val(),
        deviceName: $('#deviceName').val()
        
    };

    $.ajax({
        url: '/customers/signUp',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
        if (data.success) {
            // after 1 second, move to "login.html"
            setTimeout(function(){
                window.location = "login.html";
            }, 1000);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 404) {
            $('#rxData').html("Server could not be reached!!!");    
        }
        else $('#rxData').html(JSON.stringify(jqXHR, null, 2));
    });
}



$(function () {
    $('#btnSignUp').click(signup);
});