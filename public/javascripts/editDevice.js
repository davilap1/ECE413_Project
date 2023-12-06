function addDevice () {
    const deviceName = prompt('Enter the device name:');
    console.log(deviceName);

    var data1 = {
        deviceName: $('#deviceName').val(),
    }

    $.ajax({
        url: '/customers/addDevice',
        method: 'POST',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: JSON.stringify(data1),
    })
    .done(function (data, textStatus, jqXHR) {
        console.log("Work please!");
        console.log(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("FAIL");
        // window.location.replace("display.html");
    });
}

function removeDevice () {
    console.log("REMOVE");
}

$(function () {
    $('#btnAdd').click(addDevice);
    $('#btnRemove').click(removeDevice);

    $.ajax({
        url: '/customers/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        console.log(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});