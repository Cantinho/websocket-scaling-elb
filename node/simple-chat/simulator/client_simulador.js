const Connect = require('../libs/connect.js');
const TextMessage = require('../libs/text-message.js');
var parallel = require('run-parallel');

var WebSocket = require('ws');
var host = "ws://localhost:8080";

var args = process.argv.slice(2);

const workspace_size = args[0];
const agents_by_workspace = args[1];

const sockets = new Array(agents_by_workspace * workspace_size);
const workspaces = new Array(agents_by_workspace * workspace_size);

const masters = new Array(workspace_size);

var connection_counter = sockets.length + masters.length;

/** Checks is a string is a string JSON string */
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/** Calculates a random int from interval [min, max[. */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

/** Creates a websocket from a host, an agent, an id and a workspace */
function createSocket(host, agent, id, workspace) {
  var ws = new WebSocket(host,{
    path: '/',
    port: 8080, // default is 80
    origin: 'Master-Slave',
    keepAlive: 60,
    headers:{ some:'header', 'ultimate-question':42 } // websocket headers to be used e.g. for auth (default is none)
  });
  ws.agent = agent;
  ws.workspace = workspace;
  ws.id = id;

  ws.on('open', function() {
    // For WebSocket clients only
    console.log("Connected to server");
    //ws.join(workspace);
    var connect = new Connect(ws.agent, ws.id, ws.workspace);
    ws.send(JSON.stringify(connect));
    console.log("Agent " + agent + " is joining to workspace {" + workspace + "}");
  });

  ws.on('message', function(message) {
    console.log('Received: ' + message);
    if(message === "User Joined") {
      connection_counter--;
    }
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
  
  return ws;
}

console.log("Begin - Creating client sockets...\n");
/** Initializes all required websocket clients */
var current_workspace = 0;
for (i = 0; i < sockets.length; i++) {
  sockets[i] = createSocket(host, "agent_"+i, "id_"+i, "workspace_"+current_workspace);
  workspaces[i] = current_workspace;
  if(i != 0 && i%agents_by_workspace == 0) {
    current_workspace++;
  }
}
console.log("End - Creating client sockets...\n");

console.log("Begin - Creating master socket...\n");
/** Initializes all required websocket clients */
for (i = 0; i < masters.length; i++) {
  masters[i] = createSocket(host, "master", "master_id", "workspace_"+i);
  console.log("Creating master socket...\n");
}
console.log("End - Creating master socket...\n");

/** Sends a message to specific websocket */
function sendMessage(ws, agent, id, workspace, agent_dst, message, broadcast) {
  const textMessage = new TextMessage(agent, id, workspace, agent_dst, message, broadcast);
  ws.send(JSON.stringify(textMessage), console.log.bind(null, 'Sent : ', JSON.stringify(textMessage)));
}


/** Inits a connection test */
function init() {
  while(connection_counter > 0) {
    // Wait for all connections to have been established.
    console.log();
  }
  var i = 10;
  while(i--) {
    console.log("sending text message " + i + "...\n");
    const min = 0;
    const max = agents_by_workspace * workspace_size;
    const index = randomIntFromInterval(min, max);
    
    const ws = sockets[index];
    const agent_dst = "master";
    const message = "[" + randomIntFromInterval(0, 1000000) + "]";
    const broadcast = false;
    sendMessage(ws, ws.agent, ws.id, ws.workspace, agent_dst, message, broadcast);
    console.log("Message sent: " + ws.agent + " " + ws.id + " " + ws.workspace + " " + agent_dst + " " + message + " " + broadcast );
  }
}

console.log("Begin - init...\n");

parallel([init()
],
// optional callback
function (err, results) {
  // the results array will equal ['one','two'] even though
  // the second function had a shorter timeout.
})
console.log("End - init...\n");

