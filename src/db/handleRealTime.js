const express = require('express');
const app = express();
const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3001"
    }
});

module.exports = socketIO