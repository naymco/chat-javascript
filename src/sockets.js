module.exports = function (io) {

    let users = {};

    io.on('connection', socket => {
        console.log('new user conected');

        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false);

            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateusers();
            }

        });

        socket.on('send message', (data, cb) => {
            var msg = data.trim();

            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                var index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error! Please enter a valid user D:');
                    }
                } else {
                    cb('Error! Please enter your message. D:');
                }
            } else {
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }


        });

        socket.on('disconnect', (data) => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateusers();
        });

        function updateusers() {
            io.sockets.emit('usernames', Object.keys(users));

        }

    });
}