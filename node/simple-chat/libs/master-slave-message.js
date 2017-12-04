
// Constructor
function MasterSlaveMessage(command, content) {
  // Private
  this.command = command;
  this.content = [content];
};

MasterSlaveMessage.prototype.copy = function() {  
    // return new Person(this.name); // just as bad
    return new this.constructor(this.name);
}; 

MasterSlaveMessage.prototype.serialize = function() {
  var data = {
    'command' : this.command,
    'content' : this.content
  }
  return JSON.stringify(data);
}

module.exports = MasterSlaveMessage
