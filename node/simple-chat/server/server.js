const MasterSlaveMessage = require('../libs/master-slave-message.js');
const Connect = require('../libs/connect.js');
const TextMessage = require('../libs/text-message.js');

const WebSocket = require('ws');
const TreeMap = require("treemap-js");
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer({
        port: 8080
});

const users = new TreeMap();

var generic = new MasterSlaveMessage("command", "content");
var connect = new Connect("samirtf", "0000011111", "room");
var textMessage = new TextMessage("samirtf", "0000011111", "room", "darth vader", "ola", false);

//console.log('msm message: ' + JSON.stringify(generic));
//console.log('connect message: ' + JSON.stringify(connect));
//console.log('text message: ' + JSON.stringify(textMessage));



function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

wss.on('connection', function connection(ws) {
  console.log('connection');
  ws.workspace = [];
  ws.agent = "";
  ws.send("User Joined");

  ws.on('message', function(data) {
    if(data !== undefined && IsJsonString(data)) {
      message = JSON.parse(data);  
      if (message.command === 'connect') {
        ws.workspace.push(message.content.workspace);
        ws.agent = message.content.agent;
        users.set(message.content.agent, message.content.workspace)
        console.log("Server got connect message: " + JSON.stringify(message.content));
      }
      if (message.command === 'text_message') {
        console.log("Server got text message: " + JSON.stringify(message.content));       
        if(message.content.broadcast) {
          console.log("Server is broadcasting except to sender: " + JSON.stringify(message.content));
          broadcastExceptSender(message, ws);
        } else {
          console.log("Server is sending to specific user: " + JSON.stringify(message.content));
          sendToSpecificUser(message, ws);
        }
      }
      /*
      if (message.join) {
        ws.workspace.push(message.join);
      }
      if (message.workspace) {
        broadcastExceptSender(message);
      }
      if (message.msg) {
        console.log("Server got: " + message.msg);
      }
      */
    }
  });

  ws.on('error', function(er) {
    console.log(er + "\n");
  })

  ws.on('close', function() {
    console.log('Connection closed\n')
  })
});

function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if ( client !== wss && client.readyState === WebSocket.OPEN && (client.workspace.indexOf(message.content.workspace) > -1 || message.content.workspace == 'all') ) {
      client.send(JSON.stringify(message));
    }
  });
  
}

function broadcastExceptSender(message, sender) {
  wss.clients.forEach(function each(client) {
    if (sender == client) return;
    // Broadcast to everyone else.
    if (client !== sender && client.readyState === WebSocket.OPEN && (client.workspace.indexOf(message.content.workspace) > -1 || message.content.workspace == 'all')) {
      client.send(JSON.stringify(message));
      console.log('broadcast sent');
    }
  });
}

function sendToSpecificUser(message, sender) {
  const agent_dst = message.content.agent_dst;
  wss.clients.forEach(function each(client) {
    if (sender == client) return;
    // Broadcast to everyone else.
    if (client.agent === message.content.agent_dst && client.readyState === WebSocket.OPEN && (client.workspace.indexOf(message.content.workspace) > -1 || message.content.workspace == 'all')) {
      client.send(JSON.stringify(message));
      console.log('broadcast sent\n');
    }
  });
}

