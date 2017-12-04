const MasterSlaveMessage = require('./master-slave-message.js');
function TextMessage(agent, id, workspace, msg, broadcast) {
  var content = {
    'agent' : agent,
    'id' : id,
    'workspace' : workspace,
    'msg' : msg,
    'broadcast' : broadcast
  }
  
  MasterSlaveMessage.call(this, 'text_message', content)
}

module.exports = TextMessage
