// function addDevice() {
//     try {
//         const deviceName = prompt('Enter the device name:');
//         window.alert(deviceName);
//         // Check if the entered deviceName is not empty
//         $('#deviceList').append('<option>hello</option>')
//         if (deviceName !== null && deviceName.trim() !== '') {
//             $('#deviceList').append('<option>' + deviceName + '</option>')
//             //     $('<option>', {
//             //     value: deviceName,
//             //     text: deviceName
//             // }));
//         } else {
//             console.log("Invalid or empty device name entered.");
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//     }
// }

function removeDevice () {
    // Check if there is more than one option in the dropdown
    if ($('#deviceList option').length > 1) {
        // Check if an option is selected
        const selectedDevice = $('#deviceList').val();
        if (selectedDevice) {
            // Remove the selected option
            $('#deviceList option:selected').remove();
            window.alert('Selected device removed: ' + selectedDevice);
        } else {
            window.alert('No device selected.');
        }
    } else {
        window.alert('Only one device is present. Cannot remove.');
    }
}

$(function () {
    //$('#btnAdd').click(addDevice);
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

function submitForm() {
    const deviceName = document.getElementById('deviceName').value.trim();
    console.log('User input:', deviceName);

    // Check if the input is not empty and not already in the deviceList
    if (deviceName !== '' && !isDeviceInList(deviceName)) {
        $('#deviceList').append('<option>' + deviceName + '</option>');
        window.alert('Device successfully added.');
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
