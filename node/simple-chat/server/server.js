const WebSocket = require('ws');

var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
        port: 8080
});

wss.on('connection', function connection(ws) {
    ws.room = [];
    ws.send("User Joined");

    ws.on('message', function(message) {
        message = JSON.parse(message);
        if (message.join) {
            ws.room.push(message.join);
        }
        if (message.room) {
            broadcastExceptSender(message);
        }
        if (message.msg) {
            console.log("Server got: " + message.msg);
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
        if ( client !== wss && client.readyState === WebSocket.OPEN && (client.room.indexOf(message.room) > -1 || message.room == 'all') ) {
            client.send(message.msg);
        }
    });
}

function broadcastExceptSender(message, sender) {
    wss.clients.forEach(function each(client) {
        if (sender == client) return
        if ( client !== sender && wss !== sender && client.readyState === WebSocket.OPEN && (client.room.indexOf(message.room) > -1 || message.room == 'all') ) {
            client.send(message.msg);
        }
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
