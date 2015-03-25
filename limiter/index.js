var Registry = require("./registry");
var Queue = require("./queue");
var Tickets = require("./tickets");

// Limiter
// ----------

function Limiter(config){
  this._queues = new Registry();
  this.updateLimits(config);
}

// Primary API
// -----------

Limiter.prototype.run = function(type, cb){
  var ticket = Tickets.get(type, cb);

  var queue = this._getQueue(type);
  queue.push(ticket);
  this._checkQueue(queue);

  return ticket;
};

Limiter.prototype.complete = function(ticket){
  if (!ticket) { return; }
  var queue = this._getQueue(ticket.type);
  queue.complete(ticket);
  this._checkQueue(queue);
};

Limiter.prototype.hasWork = function(type, ticket){
  var queue = this._getQueue(type);
  if (!queue){
    return false;
  }

  var hasWork = queue.hasWork(ticket.id);
  return hasWork;
};

// Configuration API
// -----------------

Limiter.prototype.updateLimits = function(config){
  var isObject = (typeof config === "object");
  if (!isObject){ return; }

  var that = this;

  Object.keys(config).forEach(function(type){
    var limit = config[type];

    var queue = that._getQueue(type);
    queue.setLimit(limit);

    that._checkQueue(queue);
  });
};

Limiter.prototype.updateInProgress = function(config){
  var isObject = (typeof config === "object");
  if (!isObject){ return; }

  var that = this;

  Object.keys(config).forEach(function(type){
    var inProgressCount = config[type];

    var queue = that._getQueue(type);
    queue.setInProgress(inProgressCount);

    that._checkQueue(queue);
  });
};

Limiter.prototype.inProgress = function(type){
  var queue = this._getQueue(type);
  return queue.inProgress;
};

// Private API
// -----------

Limiter.prototype._runTask = function(queue, ticket){
  var that = this;
  queue.increment();

  function done(){
    that.complete(ticket);
  }

  ticket.work(done);
};

Limiter.prototype._checkQueue = function(queue){
  if (queue.isAtLimit){
    return;
  }

  var ticket = queue.next();
  if (ticket){
    this._runTask(queue, ticket);
  }
};

Limiter.prototype._getQueue = function(type){
  var queue;

  if (this._queues.hasValue(type)){
    queue = this._queues.get(type);
  } else {
    queue = new Queue();
    this._queues.register(type, queue);
  }

  return queue;
};

// Exports
// -------

module.exports = Limiter;
