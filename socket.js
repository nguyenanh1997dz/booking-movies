const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('A client connected');
    // Do something when a client is connected
    socket.emit('welcomeMessage', { message: 'Xin chào! Chúng tôi rất vui khi bạn đã ghé thăm trang web của chúng tôi.' });
});

server.listen(PORT, () => {
    console.log(`Socket server is running on port ${PORT}`);
});
