/** 
     * 
     *  Fun Facts:-
     * 
     *  a) Open & maintaining web socket connection (two-way communication i.e. Server -> Client & Client -> Server)
     *  b) It all happen based on events i.e. events can be emitted either from client / server
     *      or client / server can listen to events
     *  c) "connect" event exists on client (thanks to socket.io library) where we can do anything when "connect"
     *      event is emitted.
     *  d) Removed ES6 version => (fat arrow) as some browser versions (safari / firefox) may crash the app
     *  e) "location" is the global object provided by the browser which contains quite a bit of information
     *      as hostname , path , port , search params(query string) etc.
     *  f) Above properties can be fetched using:- window.location.<property_name> i.e. window.location.search or
     *      window.location.path etc.   
     *
*/
const socket = io();

let messageTextBox = $("[name=message]");
let typeInfo = $("#type-info");
let timeout;
let chatObject = $.deparam(window.location.search);
let getLocation = $("#send-location");

/**
 *  
 *  Connect event handling when client-server are connected i.e. when new user joins the chat room
 *  Here in callback we don't have access to socket as we are registering an event on socket
 * 
 */


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

        if(error){          // this should be handled on client side (using Ajax)
            alert(error);
            window.location.href = '/';
        }else{
            let groupName = $('#group-name');
            groupName.text(chatroom + ' Groupies');
        }

    })

})

socket.on('disconnect', function () {

    
    console.log(`Goodbye Server...Nice to work today`);

})


// So this is more like listening to event emitted at server's end

socket.on('newMessage' , function (message) {

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


/**
 * 
 *  keyup & keydown events when user types something on frontend.
 *  All the other connected users within the chat room are being informed about the same
 * 
 */

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

/**
 * 
 *  A new event (text message) is emitted when user Gabs It
 *  Server listens the same event and responds by emitting it to all the users within the Chat Room
 * 
 */

$('#message-form').on('submit' , function (e) {

    e.preventDefault();
    socket.emit('createMessage' , {
        "text":messageTextBox.val()
    } , function (acknowledgement) {

        messageTextBox.val('');

    })

})

/**
 * 
 *  A new event (Geo Location) is emitted by the user who wants to share his/her location
 *  Server listens the same event and responds by emitting it to all the users within the Chat Room
 * 
 */

getLocation.on("click" , function () {

    let locator = $("#send-location");
    locator.text("Sharing Location...").attr("disabled", "disabled");

    if(!navigator.geolocation){

        locator.removeAttr("disabled");
        return;

    }else{
        navigator.geolocation.getCurrentPosition(function(position) {

            locator.text("Share Location").removeAttr("disabled");
            socket.emit('createGeoLocation' , {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })

        } , function() {
            
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