const MasterSlaveMessage = require('./master-slave-message.js');
function TextMessage(agent, id, workspace, agent_dst, msg, broadcast) {
  var content = {
    'agent' : agent,
    'id' : id,
    'workspace' : workspace,
    'agent_dst' : agent_dst,
    'msg' : msg,
    'broadcast' : broadcast
  }
  
  MasterSlaveMessage.call(this, 'text_message', content)
}

module.exports = TextMessage
