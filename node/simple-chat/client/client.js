var WebSocket = require('ws');
var ws = new WebSocket("ws://localhost:8080");

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(message) {
  message = message.trim();
  ws.send(message, console.log.bind(null, 'Sent : ', message));
});

ws.on('message', function(message) {
  console.log('Received: ' + message);
});

ws.on('close', function(code) {
  console.log('Disconnected: ' + code);
});

ws.on('error', function(error) {
  console.log('Error: ' + error.code);
});

