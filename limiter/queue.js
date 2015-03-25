function Queue(limit){
  this.values = [];
  this.limit = limit;
  this.inProgress = 0;
}

// Queue API
// ---------

Queue.prototype.next = function(){
  return this.values.shift();
};

Queue.prototype.push = function(value){
  return this.values.push(value);
};

Queue.prototype.peek = function(){
  return this.values[0];
};

Queue.prototype.clone = function(){
  return this.values.slice(0);
};

Queue.prototype.findIndexByTicketId = function(ticketId){
  var ticket, idx;

  for(var i=0; i<this.values.length; i++){
    ticket = this.values[i];
    if (!ticket) { continue; }

    if (ticket.id === ticketId){
      idx = i;
      break;
    }
  }

  return idx;
};

Queue.prototype.removeTicketAt = function(idx){
  if (idx > -1){
    this.values.splice(idx, 1);
  }
};

Object.defineProperty(Queue.prototype, "length", {
  get: function(){
    return this.values.length;
  }
});

// Public API
// ----------

Object.defineProperty(Queue.prototype, "isAtLimit", {
  get: function(){
    var isAtLimit;

    if (this.limit < 0){
      isAtLimit = false;
    } else {
      isAtLimit = (this.inProgress >= this.limit);
    }

    return isAtLimit;
  }
});

Queue.prototype.complete = function(ticket){
  this.decrement();

  if (!ticket){ return; }

  var idx = this.findIndexByTicketId(ticket.id);
  this.removeTicketAt(idx);
};

Queue.prototype.increment = function(){
  this.inProgress += 1;
};

Queue.prototype.decrement = function(){
  this.inProgress =- 1;
  if (this.inProgress < 0){
    this.inProgress = 0;
  }
};

Queue.prototype.setLimit = function(limit){
  this.limit = limit;
};

Queue.prototype.setInProgress = function(inProgress){
  this.inProgress = inProgress;
};

Queue.prototype.hasWork = function(ticketId){
  var hasWork = false;

  this.values.forEach(function(ticket){
    if (ticket.id === ticketId){
      hasWork = true;
    }
  });

  return hasWork;
};

module.exports = Queue;
