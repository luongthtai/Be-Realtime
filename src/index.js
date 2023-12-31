const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./db/database')
const accountRouter = require('./routers/account')
const userRouter = require('./routers/infouser');
const conversationRouter = require('./routers/conversation');
const messageRouter = require('./routers/message');
const accountController = require('./controllers/accountController');
const infouserController = require('./controllers/infouserController');
const messageController = require('./controllers/messageController');
const conversationController = require('./controllers/conversationController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'assets', 'images')))

db.connect((err) => {
    err ? console.log(err) : console.log('Connect success !!!')
})

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3001"
    }
});

const userAccess = []

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    // console.log(userAccess);

    socket.on('login', data => {
        userAccess.push(socket.id)
        accountController.loginSocket(socketIO, data)
    })

    socket.on('users', (data) => {
        infouserController.getUsers(socketIO, data)
    })

    //////// create conversation room
    socket.on('conversationRoom', (data) => {
        socket.join('conversations' + data)
    })

    //////// created chat room
    socket.on('chatRoom', (data) => {
        socket.join('chat' + data)
    })

    //====== check room 
    socket.on('checkRoom', (data) => {
        const isInRoom = socket.adapter.rooms.has(data) && socket.adapter.rooms.get(data).has(socket.id)

        socket.emit('roomCheckResult', isInRoom)
    })

    //////// get list user conversations
    socket.on('getListConversations', (data) => {
        conversationController.getConversationSocket(socketIO, data)
    })

    //////// get conversation
    socket.on('getConversationById', (data) => {
        conversationController.getConversationSocketItem(socketIO, data)
    })

    //Listens and logs the message to the console
    socket.on('message', (data) => {
        messageController.sendMessage(socketIO, data)
    });

    socket.on('logout', (data) => {
        socket.disconnect()

        accountController.logout(socket, data)
        infouserController.getUsers(socketIO, data)
    });
});

// app.use('/', (req, res) => {
//     res.send('Xin chao cac ban toi ung dung messages realtime cua Luong The Tai')
// })

app.use('/account', accountRouter)
app.use('/users', userRouter)
app.use('/conversations', conversationRouter)
app.use('/message', messageRouter)

const port = process.env.SERVER_PORT || 4000

http.listen(port, () => console.log(`http://localhost:${port}`));
