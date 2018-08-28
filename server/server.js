const path = require('path');
const express = require('express'); // Express internally uses built in node module http for creating web server
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 9900;
const publicPath = path.join(__dirname , '../public');

const app = express();
const server = http.createServer(app);  // Configuring express to work with http (module)

/**
 *  Configuring server to use / work with socketIO
 * 
 *  With this (Importing socket.io) we also got access to sockets javascript library to work with socketio on client
 * 
 *  We got access to route which accepts incomming connections - accepts websocket connection
 * 
 *  Web Sockets are very much persistent technology i.e. both client & server keep connection open as long as
 *  both of them want to.
 * 
 *  "io" represents a group of sockets and receives the currently connected socket as the argument to its callback 
 *  while socket just represents a single connection. 
 * 
*/
const io = socketIO(server);            
io.on('connection' , (socket) => {  // "socket" similar to the one created in index.html about users connected to server
 
    // console.log(`Welcome User...How are you today`);


    socket.on('disconnect' , () => {

        console.log(`Goodbye User...Nice to have you here today`);

    });

    // socket.emit('newEmail' , {

    //     "from":"server@example.com",
    //     "text":"Welcome Aboard User..."

    // });

    // socket.on('createEmail' , (email) => {

    //     console.log('Email Created...' , email);

    // })


    // socket.emit('newMessage' , {
    //     "from": "server@gmail.com",
    //     "text": "Hello New User...Welcome",
    //     "createdAt":1535443583
    // })


    socket.on('createMessage' , (message) => {

        console.log(`Message created...` , message);

        io.emit('newMessage' , {
            "from":message.from,
            "text":message.text,
            "createdAt": new Date().getTime()
        })

    })


    socket.emit('newMessage' , {
        "from": "Admin",
        "text": "Welcome user to our chat app..."
    })

    socket.broadcast.emit('newMessage' , {
        "from": "Admin",
        "text": "New user has joined the chat room..."
    })

})

app.use(express.static(publicPath));

// When we call app.listen, internally it only calls http.createServer just like "http.createServer(app)"
// So http (as in module) always work behind the scene
server.listen(PORT , () => {

    console.log(`Chat Server Fired Up @${PORT}...`);

})