var WebSocket = require('ws');
//var ws = new WebSocket();

var host = "ws://localhost:8080";
var WebSocket = require("ws");
var ws = new WebSocket(host,{
  path: '/',
  port: 8080, // default is 80
  origin: 'Master-Slave',
  keepAlive: 60,
  headers:{ some:'header', 'ultimate-question':42 } // websocket headers to be used e.g. for auth (default is none)
});

var args = process.argv.slice(2);

process.stdin.resume();
process.stdin.setEncoding('utf8');

//Pattern username_pattern = Pattern.compile("'(.*?)'");
//Pattern username_pattern = Pattern.compile("username:(.*?) ");
//Matcher matcher = username_pattern.matcher(mydata);
//if (matcher.find())
//{
//    System.out.println(matcher.group(1));
//}

var channel = args[0];
var username = args[1];

var data = 
{
  "channel" : channel,
  "username" : username,
  "message" : ""
}

process.stdin.on('data', function(message) {
  message = message.trim();
  data.message = message;
  //ws.message(JSON.stringify(data), console.log.bind(null, 'Sent : ', message));
  ws.broadcast(JSON.stringify(data), channel, console.log.bind(null, 'Sent : ', message));

});

/** Join a room */
WebSocket.prototype.message = function (msg) {
    this.send(JSON.stringify({ msg : msg }));
};

/** Broadcast message to room */
WebSocket.prototype.broadcast = function (msg, room, callback) {
    room = room === undefined ? 'all' : room;
    this.send(JSON.stringify({ room:room, msg:msg }), callback);
};

/** Join a room */
WebSocket.prototype.join = function (room) {
    this.send(JSON.stringify({ join : room }));
};

ws.on('open', function() {
  // For WebSocket clients only
  console.log("Connected to server");
  ws.join(channel);
  console.log("Joining to room {" + channel + "}");
});

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

ws.on('message', function(message) {
  if(IsJsonString(message)) {
    var jsonMsg = JSON.parse(message);
    if(jsonMsg.username !== username && jsonMsg.message) {
      console.log('Received: ' + jsonMsg.message);
    }
  } else {
     console.log('False');
  }
  //console.log('Received: ' + message);
});

ws.on('close', function() {
  console.log("Connection closed");
});

ws.on('handshake', function() {
  console.log("Handshake Success");
});

ws.on('ping', function() {
  console.log("Got a ping");
});

ws.on('pong', function() {
  console.log("Got a pong");
});

ws.on('rawData', function(msg) {
  console.log("RAW: " + msg);
});

ws.on('error', function(error) {
  console.log('Error: ' + error.code);
});
