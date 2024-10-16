const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the queue confirmation page
app.get('/join-queue', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/queue.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/favicon.ico', (req, res) => res.status(204));