const http = require('http');
const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

//settings

app.set('port', process.env.PORT || 3000);


require('./sockets')(io);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
server.listen(app.get('port'), '0.0.0.0', () => {
    console.log('Server on port:', app.get('port'));
});