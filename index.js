const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;



server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/public/user.html');
});

app.get('/rooms', (req, res) => {
    res.sendFile(__dirname + '/public/rooms.html');
});

app.get('/login1', (req, res) => {
    res.sendFile(__dirname + '/public/login1.html');
});


// tech namespace 
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);

        db.getChats(data.room).then( val => {
            // console.log(val);
            tech.to(socket.id).emit('historyChats',val);

            tech.in(data.room).emit('singleMessage', `${data.user} joined ${data.room} room!`);
        });

        db.checkUser(data.user).then(value => {
            if(value == true){
                db.insertUser();
            }
        });

       
    });

    socket.on('message', (data) => {
        console.log(`message ${data.msg}`);

        var message = {
            user: data.user,
            room: data.room,
            msg: data.msg
        };

        let insert = db.insertChats(message);
        tech.in(data.room).emit('message', message);
    });

    socket.on('disconnect', () => {
        tech.emit('singleMessage', 'user disconnected');
    })
});