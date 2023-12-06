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
        url: '/customers/editDevice',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        if (Array.isArray(data) && data.length > 0 && data[0].device) {
            const deviceName = data[0].device;

            // Append the extracted deviceName to the <select> element
            $('#deviceList').append($('<option>', {
                value: deviceName,
                text: deviceName
            }));
        } else {
            console.error("Invalid data format or missing 'device' property.");
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});