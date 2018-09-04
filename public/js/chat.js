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

let messageTextBox = $("[name=message]");
let typeInfo = $("#type-info");
let timeout;
let chatObject = $.deparam(window.location.search);

/**
 * 
 * "location" is the global object provided by the browser which contains quite a bit of information 
 * as hostname , path , port , search params(query string) etc.
 * 
 *  Above properties can be fetched using:- window.location.<property_name> i.e. window.location.search or
 *  window.location.path etc.
 * 
 */

// Here in callback we don't have access to socket as we are registering an event on socket
socket.on('connect', function () {


    socket.on("updateUsers" , function(users) {

        console.log(users);
        let ol = $('<ol></ol>');

        users.forEach(function(user) {
            ol.append($('<li></li>').text(user));
        })

        $('#users').html(ol);
    });

    // emitting "custom" join event (this'll serve to join a particular room)

    socket.emit('join' , chatObject , function(error , chatroom) {

        // Things to do--
        // 1) Encrypt user & chat room names so that it cannot be forged
        // 2) Add more validations on strings & objects (validation.js)
        // 3) Display proper names when "user" sends a message  - Done

        if(error){          // this should be handled on client side (using Ajax)
            alert(error);
            window.location.href = '/';
        }else{
            let groupName = $('#group-name');
            groupName.text(chatroom + ' Groupies');
            console.log('Welcome to apna chat...');
        }

    })

})

socket.on('disconnect', function () {

    
    console.log(`Goodbye Server...Nice to work today`);

})

// So this is more like listening to event emitted at server's end

socket.on('newMessage' , function (message) {
    // console.log(message);

    let sentAt = moment(message.createdAt).format("MMM Do YYYY h:mm a");

    let template = $('#message-template').html();   // Pull out the html for the specific ID
    let html = Mustache.render(template , {
            text: message.text,
            from: message.from,
            sentAt: sentAt,
            status: "Delivered"
    });                                             // render the template data
      
    $('#messages').append(html);                    // append the template to the specific ID
    scrollToBottom();
})


socket.on('newGeoLocationMessage' , function (message) {

    // console.log(message);

    let sentAt = moment(message.createdAt).format("MMM Do YYYY h:mm a");
    let mapSrc = `${message.mapsUrl} ${message.latitude} , ${message.longitude}${message.mapsParams}${message.MAPS_API_KEY}`;

    let template = $("#location-template").html();
    let html = Mustache.render(template , {
        from: message.from,
        url: message.hoverUrl,
        mapSrc,
        sentAt,
        status: "Delivered"
    })

    $('#messages').append(html);
    scrollToBottom();
})

messageTextBox.bind("keydown" , () => {

    clearTimeout(timeout);
    socket.emit("start-typing");
})

socket.on("typing" , function(userObj) {

    typeInfo.text(`${userObj.username} is typing...`);

})



messageTextBox.bind("keyup" , () => {

    timeout = setTimeout(() => {

        socket.emit("stop-typing");

    }, 300)

})

socket.on("no-typing" , function(userObj) {

    typeInfo.text('');

})

$('#message-form').on('submit' , function (e) {

    e.preventDefault();
    socket.emit('createMessage' , {
        "text":messageTextBox.val()
    } , function (acknowledgement) {

        console.log('Response ' , acknowledgement);
        // let messageDisplay = $('#message-status');
        // if(acknowledgement.messageStatus == "sent") {
        //     messageDisplay.text("sent");
        // }
        messageTextBox.val('');

    })

})

let getLocation = $("#send-location");
getLocation.on("click" , function () {

    let locator = $("#send-location");
    locator.text("Sharing Location...").attr("disabled", "disabled");

    // let locator = document.getElementById('location-info');
    // locator.innerHTML = "<p>Locating...</p>";    
    if(!navigator.geolocation){

        // locator.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        locator.removeAttr("disabled");
        return;

    }else{
        navigator.geolocation.getCurrentPosition(function(position) {

            locator.text("Share Location").removeAttr("disabled");
            // locator.innerHTML = "";
            socket.emit('createGeoLocation' , {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })

        } , function() {
            
            console.log('Message Delivered...');
            // locator.innerHTML = "<p>Unable to fetch location</p>";
            // return;
        })

    }

})


/**
 * 
 * Lots happening here...
 * 
 */

function scrollToBottom(){

    const messages = $('#messages');
    const newMessage = messages.children("li:last-child");

    const clientHeight = messages.prop('clientHeight');   // cross-browser way to get the height - replacement for jQuery
    const scrollTop =   messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();    // this takes account of all padding / margin we have added
    const lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }

}