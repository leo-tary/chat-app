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
            sentAt: sentAt
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
        sentAt
    })

    $('#messages').append(html);
    scrollToBottom();
})


$('#message-form').on('submit' , function (e) {

    e.preventDefault();
    let messageTextBox = $("[name=message]");
    socket.emit('createMessage' , {
        "from":"User",
        "text":messageTextBox.val()
    } , function (acknowledgement) {

        // console.log('Response ' , acknowledgement);
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