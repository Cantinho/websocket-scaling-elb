const MasterSlaveMessage = require('./master-slave-message.js');
function Connect(agent, id, workspace) {
  var content = {
    'agent' : agent,
    'id' : id,
    'workspace' : workspace
  }
  
  MasterSlaveMessage.call(this, 'connect', content)
}

module.exports = Connect
