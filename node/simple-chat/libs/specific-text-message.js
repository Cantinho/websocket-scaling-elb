const MasterSlaveMessage = require('./master-slave-message.js');
function SpecificTextMessage(agent, id, workspace, msg, broadcast) {
  var content = {
    'agent' : agent,
    'id' : id,
    'workspace' : workspace,
    'msg' : msg,
    'dst' : dst,
    'broadcast' : broadcast
  }
  
  MasterSlaveMessage.call(this, 'specific_text_message', content)
}

module.exports = SpecificTextMessage
