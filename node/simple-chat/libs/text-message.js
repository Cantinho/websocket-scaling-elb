const MasterSlaveMessage = require('./master-slave-message.js');
function TextMessage(agent, id, workspace, text, broadcast) {
  var content = {
    'agent' : agent,
    'id' : id,
    'workspace' : workspace,
    'msg' : text,
    'broadcast' : broadcast
  }
  
  MasterSlaveMessage.call(this, 'text_message', content)
}

module.exports = TextMessage
