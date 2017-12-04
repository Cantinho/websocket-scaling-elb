const MasterSlaveMessage = require('../libs/master-slave-message.js');
const Connect = require('../libs/connect.js');
const TextMessage = require('../libs/text-message.js');

var generic = new MasterSlaveMessage("command", "content");
var connect = new Connect("samirtf", "0000011111", "room");
var textMessage = new TextMessage("samirtf", "0000011111", "room", "ola", false);

console.log('msm message: ' + JSON.stringify(generic));
console.log('connect message: ' + JSON.stringify(connect));
console.log('text message: ' + JSON.stringify(textMessage));

const WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer({
        port: 8080
});

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

wss.on('connection', function connection(ws) {
  ws.workspace = [];
  ws.send("User Joined");

  ws.on('message', function(data) {
    if(data !== undefined && IsJsonString(data)) {
      message = JSON.parse(data);  
      if (message.command === 'connect') {
        ws.workspace.push(message.content.workspace)
        console.log("Server got connect message: " + JSON.stringify(message.content));
      }
      if (message.command === 'text_message') {
        console.log("Server got text message: " + JSON.stringify(message.content));
        console.log("Server is broadcasting except to sender: " + JSON.stringify(message.content));
        broadcastExceptSender(message, ws);
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
    console.log(er);
  })

  ws.on('close', function() {
    console.log('Connection closed')
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
    console.log('broadcasting to client:' + client)
    // Broadcast to everyone else.
    if (client !== sender && client.readyState === WebSocket.OPEN && (client.workspace.indexOf(message.content.workspace) > -1 || message.content.workspace == 'all')) {
      client.send(JSON.stringify(message));
      console.log('broadcast sent');
    }
    //if ( client !== wss && client.readyState === WebSocket.OPEN && (client.workspace.indexOf(message.content.workspace) > -1 || message.content.workspace == 'all') ) {
    //  client.send(JSON.stringify(message));
    //  console.log('broadcast sent');
    //}
  });
}

// Broadcast to all.
/*
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log('received: %s', data);
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.send('something');
});

*/
