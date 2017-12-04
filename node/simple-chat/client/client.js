const Connect = require('../libs/connect.js');
const TextMessage = require('../libs/text-message.js');

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

var workspace = args[0];
var agent = args[1];
var id = args[2];

process.stdin.on('data', function(message) {
  message = message.trim();
  var textMessage = new TextMessage(agent, id, workspace, message, false);
  ws.send(JSON.stringify(textMessage), console.log.bind(null, 'Sent : ', JSON.stringify(textMessage)));
  //ws.message(JSON.stringify(data), console.log.bind(null, 'Sent : ', message));
  //ws.broadcast(JSON.stringify(data), channel, console.log.bind(null, 'Sent : ', message));
});

/** Join a room */
WebSocket.prototype.message = function (msg) {
    this.send(JSON.stringify({ msg : msg }));
};

/** Broadcast message to room */
WebSocket.prototype.broadcast = function (msg, workspace, callback) {
    workspace = workspace === undefined ? 'all' : workspace;
    this.send(JSON.stringify({ workspace:workspace, msg:msg }), callback);
};

/** Join a room */
WebSocket.prototype.join = function (workspace) {
    this.send(JSON.stringify({ join : workspace }));
};

ws.on('open', function() {
  // For WebSocket clients only
  console.log("Connected to server");
  //ws.join(workspace);
  var connect = new Connect(agent, id, workspace);
  ws.send(JSON.stringify(connect));
  console.log("Agent " + agent + " is joining to workspace {" + workspace + "}");
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
  console.log('Received: ' + message);
  if(IsJsonString(message)) {
    var jsonMsg = JSON.parse(message);
    if(jsonMsg.content.agent !== agent && jsonMsg.command) {
      console.log('Receiving'); 
      if (jsonMsg.command === 'connect') {
        console.log('Connect message received from ' + jsonMsg.content.agent + ':' + jsonMsg.content.workspace);
      }
      if (jsonMsg.command === 'text_message') {
        console.log('Text message received from ' + jsonMsg.content.agent + ':' + jsonMsg.content.msg);
      }
    } else {
      console.log('Failing'); 
    }
  } else {
     console.log('False');
  }
  
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
