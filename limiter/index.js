var Registry = require("./registry");
var Queue = require("./queue");

// Limiter
// ----------

function Limiter(config){
  this._queues = new Registry();
  this.updateLimits(config);
}

// Primary API
// -----------

Limiter.prototype.run = function(type, cb){
  var queue = this._getQueue(type);
  queue.push(cb);
  this._checkQueue(type);
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

    that._checkQueue(type);
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

    that._checkQueue(type);
  });
};

Limiter.prototype.inProgress = function(type){
  var queue = this._getQueue(type);
  return queue.inProgress;
};

Limiter.prototype.complete = function(type){
  var queue = this._getQueue(type);
  queue.decrement();
  this._checkQueue(type);
};

// Private API
// -----------

Limiter.prototype._runTask = function(type, cb){
  var that = this;

  var queue = this._getQueue(type);
  queue.increment();

  function done(){
    that.complete(type);
  }

  cb(done);
};

Limiter.prototype._checkQueue = function(type){
  var queue = this._getQueue(type);

  if (queue.isAtLimit){
    return;
  }

  var task = queue.next();
  if (task){
    this._runTask(type, task);
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
