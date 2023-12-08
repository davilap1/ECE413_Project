$(function () {
    $('#btnRemove').click(removeDevice);

    $.ajax({
        url: '/customers/editDevice',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        if (Array.isArray(data) && data.length > 0) {
            // Iterate over each element in the array
            data.forEach(function (item) {
                if (item.device) {
                    const deviceName = item.device;
                    deviceName.forEach(function (devName){
                        $('#deviceList').append('<option>' + devName + '</option>');
                    });
                    // Append the extracted deviceName to the <select> element
                } else {
                    console.error("Invalid data format or missing 'device' property for an item.");
                }
            });
        } else {
            console.error("Invalid data format or empty array.");
        }
    })    
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});

function submitForm() {
    const deviceName = document.getElementById('deviceName').value.trim();
    console.log('User input:', deviceName);

    // Check if the input is not empty and not already in the deviceList
    if (deviceName !== '' && !isDeviceInList(deviceName)) {
        $('#deviceList').append('<option>' + deviceName + '</option>');
        var data3 = {
            newDevice: deviceName
        }
    
        $.ajax({
            type: "POST",
            url: '/customers/addDevice',
            headers: { 'x-auth': window.localStorage.getItem("token")},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data3),
        })
        .done(function (data, textStatus, jqXHR) {
            window.alert('Device successfully added.');
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 404) {
                window.alert("Server could not be reached!!!");    
            }
            else if (jqXHR.status == 401) {
                window.alert("Token Issue");
            }
            else window.alert("Something bad happened");
        });
    } else {
        window.alert('Invalid or duplicate device name.');
    }
}

// Function to check if the deviceName is already in the deviceList
function isDeviceInList(deviceName) {
    return $('#deviceList option').filter(function () {
        return this.value === deviceName;
    }).length > 0;
}

function removeDevice () {
    // Check if there is more than one option in the dropdown
    if ($('#deviceList option').length > 1) {
        // Check if an option is selected
        const selectedDevice = $('#deviceList').val();
        if (selectedDevice) {
            // Remove the selected option
            $('#deviceList option:selected').remove();
            $.ajax({
                type: "POST",
                url: '/customers/removeDevice',
                headers: { 'x-auth': window.localStorage.getItem("token")},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({deviceToRemove: selectedDevice}),
            })
            .done(function (data, textStatus, jqXHR) {
                window.alert('Device successfully removed.');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 404) {
                    window.alert("Server could not be reached!!!");    
                }
                else if (jqXHR.status == 401) {
                    window.alert("Token Issue");
                }
                else window.alert("Something bad happened");
            });
        } else {
            window.alert('No device selected.');
        }
    } else {
        window.alert('Only one device is present. Cannot remove.');
    }
}
