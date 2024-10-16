let cashierQueue = 1;
let registrarQueue = 1;
let frontDeskQueue = 1;

function generateQRCode(elementId, location, queueNumber) {
    // Get the current timestamp
    const now = new Date();
    const timestamp = now.toISOString();  // Still using ISO for data

    // Format the timestamp in a human-readable way (MM/DD/YYYY, HH:mm:ss AM/PM)
    const formattedTimestamp = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true  // Use 12-hour format
    });
    const qrCodeURL = `http://localhost:3000/join-queue?location=${location}&queue=${queueNumber}&timestamp=${timestamp}`;


    document.getElementById(elementId).innerHTML = '';


    new QRCode(document.getElementById(elementId), {
        text: qrCodeURL,
        width: 150,
        height: 150
    });

    // Update the queue number and timestamp displayed below the QR code
    document.getElementById(`${elementId}-queue-number`).innerText = queueNumber;
    document.getElementById(`${elementId}-timestamp`).innerText = formattedTimestamp;
    document.getElementById(elementId).addEventListener('scan', (event) => {
        onQRCodeScanned(event.data);
      });

    console.log(`QR Code generated for: ${qrCodeURL}`);

    function onQRCodeScanned(data) {
        // Assuming `data` contains the necessary information to join the queue
        fetch('http://localhost:3000/join-queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ queueData: data }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful join, e.g., display confirmation
            console.log('Successfully joined the queue:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
}

function updateQRCodes() {
    generateQRCode('cashier', 'cashier', cashierQueue);
    generateQRCode('registrar', 'registrar', registrarQueue);
    generateQRCode('front-desk', 'front-desk', frontDeskQueue);
}

// Automatically update the QR codes every 10 seconds
setInterval(updateQRCodes, 30000);

// Generate the QR codes when the page loads
window.onload = updateQRCodes;
