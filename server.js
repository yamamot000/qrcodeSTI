const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketIo(server);

app.get('/join-queue', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/queue.html'));
});
io.on('connection', (socket) => {
    console.log('A client connected');
    socket.on('customer-scanned', (data) => {
        console.log('Customer scanned:', data);
        io.emit('update-queue', data);
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
