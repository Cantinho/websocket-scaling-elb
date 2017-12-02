var WebSocket = require('ws');
var ws = new WebSocket("ws://localhost:8080");

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
  ws.send(JSON.stringify(data), console.log.bind(null, 'Sent : ', message));
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

