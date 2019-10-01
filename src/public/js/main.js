$(function () {
    const socket = io();

    // obtain DOM element from the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obtain DOM element from the nicknameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');
    const $users = $('#usernames');

    $nickForm.submit((e) => {
        e.preventDefault();

        socket.emit('new user', $nickname.val(), (data) => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                               <div class="alert alert-danger">
                                   That username already exits.
                               </div>
                           `);
            }
            $nickname.val('');
        });
    });

    // events
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), (data) => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message', (data) => {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });

    socket.on('usernames', (data) => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fa fa-user mr-2" aria-hidden="true"></i>${data[i]}</p>`;
        }
        $users.html(html);
    });

    socket.on('whisper', (data) => {
        $chat.append(`<p class="whisper"><b>${data.nick} says:</b> ${data.msg}</p>`);
    });

});