/** 
     *  a) Open & maintaining web socket connection (two-way communication i.e. Server -> Client & Client -> Server)
     *  b) It all happen based on events i.e. events can be emitted either from client / server
     *      or client / server can listen to events
     *  c) "connect" event exists on client (thanks to socket.io library) where we can do anything when "connect"
     *      event is emitted.
     *  d) Removed ES6 version => (fat arrow) as some browser versions (safari / firefox) may crash the app
     *
*/
const socket = io();

// Here in callback we don't have access to socket as we are registering an event on socket
socket.on('connect', function () {

    console.log(`Hello Server...I am good today`);

    // Q) Why socket.emit within socket.on? We can also place this block outside of socket.io?

    // socket.emit('createEmail' , {
    //     "to":"server@example.com",
    //     "text":"Hello Server...I am registered now..."
    // })

})

socket.on('disconnect', function () {

    console.log(`Goodbye Server...Nice to work today`);

})

// So basically this is more like listening to event emitted at server's end
// socket.on('newEmail' , function (email) {

//     console.log('You have got the mail...', email);

// });


socket.emit('createMessage' , {
    "to":"server@example.com",
    "text":"Thank You Server..."
})

socket.on('newMessage' , function (message) {
    console.log(`New message has arrived...` , message);
})