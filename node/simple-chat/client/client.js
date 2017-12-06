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

var workspace = args[0] === undefined ? "all" : args[0] ;;
var agent = args[1] === undefined ? "agent" : args[1] ;
var id = args[2] === undefined ? "id" : args[2] ;

process.stdin.on('data', function(data) {
  const values = data.trim().split("::");
  const agent_dst = values[0];
  const broadcast = (values[1] == 'true');
  const message = values[2];
  const textMessage = new TextMessage(agent, id, workspace, agent_dst, message, broadcast);

  ws.send(JSON.stringify(textMessage), console.log.bind(null, 'Sent : ', JSON.stringify(textMessage)));
});

/** Join a room - unused */
WebSocket.prototype.message = function (msg) {
    this.send(JSON.stringify({ msg : msg }));
};

/** Broadcast message to room - unused */
WebSocket.prototype.broadcast = function (msg, workspace, callback) {
    workspace = workspace === undefined ? 'all' : workspace;
    this.send(JSON.stringify({ workspace:workspace, msg:msg }), callback);
};

/** Join a room - unused */
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
    const jsonMsg = JSON.parse(message);
    if(jsonMsg.content.agent !== agent && jsonMsg.command) {
      console.log('Receiving...');
      if (jsonMsg.command === 'connect') {
        console.log('Connect message received from ' + jsonMsg.content.agent + ':' + jsonMsg.content.workspace);
      }
      if (jsonMsg.command === 'text_message') {
        console.log('Text message received from ' + jsonMsg.content.agent + ':' + jsonMsg.content.msg);
      }
    } else {
      console.log('Failing'); 
    }
  }
  console.log('\n');
});

ws.on('close', function() {
  console.log("Connection closed\n");
});

ws.on('handshake', function() {
  console.log("Handshake Success\n");
});

ws.on('ping', function() {
  console.log("Got a ping\n");
});

ws.on('pong', function() {
  console.log("Got a pong\n");
});

ws.on('rawData', function(msg) {
  console.log("RAW: " + msg + "\n");
});

ws.on('error', function(error) {
  console.log('Error: ' + error.code + "\n");
});
