#### MASTER-SLAVE CHAT PROTOCOL ####

1 - Only master user can create a channel.
2 - Slave users only can join in a channel if one was previously created by his master user.
3 - Slave users have to exit channel and close connection if master user is down or a X time long away.
4 - Slave users can be able to know if master user is connected yet.
5 - Slave user can send message only to his master user.
6 - Master users can send message to a specific user or send to all slave users in his channel.
7 - Only one master user must exist for each channel.




### CONNECTING ###

# How user to join in a channel?

//client.js

// set-up a connection between the client and the server
var socket = io.connect();

// let's assume that the user page, once rendered, knows what channel it wants to join
var channel = "abc123";

socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this channel
   socket.emit('channel', channel);
});

socket.on('message', function(data) {
   console.log('Incoming message:', data);
});

# How server to handle incoming join message for a channel?

//server.js

// attach Socket.io to our HTTP server
io = socketio.listen(server);

// handle incoming connections from users
io.sockets.on('connection', function(socket) {
    // once an user has connected, we expect to get a ping from them saying what channel they want to join
    socket.on('channel', function(channel) {
        socket.join(channel);
    });
});

// now, it's easy to send a message to just the users in a given channel
channel = "abc123";
io.sockets.in(channel).emit('message', 'what is going on, party people?');

// this message will NOT go to the user defined above
io.sockets.in('foobar').emit('message', 'anyone in this channel yet?');




### COMPLETE CONNECTING MESSAGE ###

# How user to join in a channel?

//client.js

// set-up a connection between the client and the server
var socket = io.connect();

// let's assume that the user page, once rendered, knows what channel it wants to join
var channel = "channel_commonwealth";
var username = "user_one"

var data = {
	"channel" : channel
	"username" : username,
}

socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this channel
   socket.emit('connect', data);
});

socket.on('message', function(data) {
   console.log('Incoming message:', data);
});

# How server to handle incoming join message for a channel?

//server.js

// attach Socket.io to our HTTP server
io = socketio.listen(server);

// handle incoming connections from users
io.sockets.on('connection', function(socket) {
    // once an user has connected, we expect to get a ping from them saying what channel they want to join
    socket.on('connect', function(data) {
        socket.join(data.channel);
    });
});

// now, it's easy to send a message to just the users in a given channel
channel = "abc123";
io.sockets.in(channel).emit('message', 'what is going on, party people?');

// this message will NOT go to the user defined above
io.sockets.in('foobar').emit('message', 'anyone in this channel yet?');



### ROOM ###

# How to join in a room in socket.io?

io.sockets.clients(someRoom).forEach(function(socket){
    socket.join(someRoom);
});

# How to delete a room in socket.io?

io.sockets.clients(someRoom).forEach(function(socket){
    socket.leave(someRoom);
});


### ALERTS - ROOM ###

Users can be in any number of room at once.
For those who wonder how to leave the previous room, if an active user joins (switches to) another room, try this:

//server.js

socket.on('room', function(room){
    if(socket.room)
        socket.leave(socket.room);

    socket.room = room;
    socket.join(room);
});



### TUTORIALS ###

# Socket IO
https://github.com/socketio/socket.io

# A simple example of setting-up dynamic "rooms" for socket.io clients to join
https://gist.github.com/crtr0/2896891

# Some util functionalities and how to detect and close broken connections.
https://github.com/websockets/ws#broadcast-example

# Rooms and namespaces - there's a lot of customizations like send message to a specific user.
http://stackabuse.com/node-js-websocket-examples-with-socket-io/


