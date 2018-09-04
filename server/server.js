
// Loading native & external libraries

const path = require('path');
const express = require('express'); // Express internally uses built in node module "http" for creating web server
const http = require('http');
const socketIO = require('socket.io');
const _ = require('lodash');

// Loading custom libraries

const {generateMessages , showCurrentLocation} = require('./utils/generateMessage');
const {isValidString , isEmptyObject} = require('./utils/validation');
const {Users} = require('./utils/users');

const PORT = process.env.PORT || 9900;
const publicPath = path.join(__dirname , '../public');

const app = express();
const server = http.createServer(app);                  // Configuring express to work with http (module)
let users = new Users();                                // Instantiating Empty Users Object (array of objects)

// https://socket.io/docs/emit-cheatsheet/

/**
 * 
 *  Fun Facts:-
 * 
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
io.on('connection' , (socket) => {  // "socket" similar to the one created in index.js about users connected to server

    // console.log(`Welcome User...How are you today`);

    socket.on('join' , (chatObject , callback) => {

        let isUserExists = users.isUserExists(chatObject.name , chatObject.chatroom);

        if(isUserExists){

            callback("Yak Name already taken...");

        }else{

            if(isEmptyObject(chatObject) > 0){

                if(isValidString(chatObject.name) && isValidString(chatObject.chatroom)){
    
                    socket.join(chatObject.chatroom);
                    users.addUser(socket.id , chatObject.name , chatObject.chatroom);
    
                    io.to(chatObject.chatroom).emit('updateUsers' , users.getUsersInRoom(chatObject.chatroom));
    
                    // message only to user who has joined
                    socket.emit('newMessage' , generateMessages("Admin" , `Welcome ${_.upperFirst(chatObject.name)} to our chat app...`));
    
                    // message / broadcast everyone but the user who has joined
                    socket.broadcast.to(chatObject.chatroom).emit('newMessage' , generateMessages("Admin" , `${_.upperFirst(chatObject.name)} has joined the ${_.upperFirst(chatObject.chatroom)} chat ...`));
                    
                    callback(undefined , _.upperFirst(chatObject.chatroom));
    
                }else{
                    callback('Invalid name / chat room provided');
                }
    
            }else{
                callback('Empty details');
            }

        }



    })


    socket.on('disconnect' , () => {

        let user = users.removeUser(socket.id); // required because we need to have user-chat properties

        if(user){

            console.log(`Goodbye ${user.name}...Nice to have you here today`);
            io.to(user.room).emit('updateUsers' , users.getUsersInRoom(user.room));
            io.to(user.room).emit('newMessage' , generateMessages("Admin" , `${user.name} has left the ${user.room} room...`));

        }

    });


    // callback for "Server Acknowledgement"
    socket.on('createMessage' , (message , callback) => {

        let user = users.getUser(socket.id);

        if(user && isValidString(message.text)){

            callback({
                messageStatus: "sent"
            });
    
            io.to(user.room).emit('newMessage' , generateMessages(_.upperFirst(user.name) , message.text));

        }

    })


    socket.on('createGeoLocation' , (coords) => {

        let user = users.getUser(socket.id);

        if(user){

            io.to(user.room).emit('newGeoLocationMessage' , showCurrentLocation(_.upperFirst(user.name) , coords));
        }

    })



    socket.on("start-typing" , () => {

        let user = users.getUser(socket.id);    // this should be an array - work to do here

        if(user) {

            socket.broadcast.to(user.room).emit("typing" , {username: user.name});

        }
        
    })


    socket.on("stop-typing" , () => {

        let user = users.getUser(socket.id);

        setTimeout(() => {
            socket.broadcast.to(user.room).emit("no-typing" , {username: user.name});
        } , 800)
        

    })

})


app.use(express.static(publicPath));    // basically used express for this

// When we invoke app.listen, internally it only calls http.createServer just like "http.createServer(app)"
// So http (as in module) always work behind the scene

server.listen(PORT , () => {

    console.log(`Chat Server Fired Up @${PORT}...`);

})