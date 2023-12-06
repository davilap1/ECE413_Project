function addDevice () {
    const deviceName = prompt('Enter the device name:');
    console.log("ADD");
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
        console.log("Work please!");
        console.log(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});