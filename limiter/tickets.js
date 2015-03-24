var uuid = require("node-uuid");

var Tickets = {

  get: function(type, cb){
    var ticket = {
      id: uuid.v1(),
      type: type,
      work: cb
    };
    return ticket;
  }

};

module.exports = Tickets;
