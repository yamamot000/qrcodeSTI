let cashierQueue = 1;
let registrarQueue = 1;
let frontDeskQueue = 1;

// Generates QR Code to be scanned by the customer
// Links are unique based on location, queue number, and timestamp
function generateQRCode(elementId, location, queueNumber) {
    const now = new Date();
    // Changes time to UNIX time. Making it numbers only on the timestamp
    const timestamp = Math.floor(now.getTime() / 1000)
    const formattedTimestamp = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const qrCodeURL = `https://yamamot000.github.io/qrcodeSTI/public/queue.html?location=${location}&queue=${queueNumber}&timestamp=${timestamp}`;
    document.getElementById(elementId).innerHTML = '';
    new QRCode(document.getElementById(elementId), {
        text: qrCodeURL,
        width: 150,
        height: 150
    });
    document.getElementById(`${elementId}-queue-number`).innerText = queueNumber;
    document.getElementById(`${elementId}-timestamp`).innerText = formattedTimestamp;
    console.log(`QR Code generated for: ${qrCodeURL}`);
}

// Master function that calls the generateQRCodes function 3 times
function refreshQRCodes() {
    generateQRCode('cashier', 'cashier', cashierQueue);
    generateQRCode('registrar', 'registrar', registrarQueue);
    generateQRCode('front-desk', 'front-desk', frontDeskQueue);
}

// Generates a new queue number when QR code is scanned.
function updateQueueNumbers(location, newQueueNumber) {
    if (location === 'cashier') {
        cashierQueue = newQueueNumber;
        document.getElementById('cashier-queue-number').textContent = cashierQueue;
        generateQRCode('cashier', 'cashier', cashierQueue);
    } else if (location === 'registrar') {
        registrarQueue = newQueueNumber;
        document.getElementById('registrar-queue-number').textContent = registrarQueue;
        generateQRCode('registrar', 'registrar', registrarQueue);
    } else if (location === 'front-desk') {
        frontDeskQueue = newQueueNumber;
        document.getElementById('front-desk-queue-number').textContent = frontDeskQueue;
        generateQRCode('front-desk', 'front-desk', frontDeskQueue);
    }
}

const socket = new WebSocket('ws://localhost:3000');

// Event that triggers when a QR is scanned
async function onQRCodeScan(location) {
    const data = { location: location };
    socket.send('customer-scanned', data);
}

// Socket EventListener
socket.addEventListener('message', function (event) {
    const customerData = JSON.parse(event.data);
    console.log('Customer data received:', customerData);
    updateQueueNumbers(customerData.location, customerData.queueNumber);
    console.log(customerData.queueNumber);
    const list = document.getElementById('scanned-customers');
    const listItem = document.createElement('li');
    listItem.textContent = `Customer joined: Location: ${customerData.location}, Queue: ${customerData.queueNumber}, Time: ${customerData.timestamp}`;
    list.appendChild(listItem);
});
function simulateScan(location) {
    onQRCodeScan(location);
}
function simulateAllScans() {
    onQRCodeScan('cashier');
    onQRCodeScan('registrar');
    onQRCodeScan('front-desk');
}
setInterval(refreshQRCodes, 30000);
window.onload = refreshQRCodes;
simulateAllScans();
