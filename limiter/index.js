var Registry = require("./registry");
var Counter = require("./counter");
var Queue = require("./queue");

// Limiter
// ----------

function Limiter(config){
  this._counters = new Registry();
  this._queues = new Registry();

  this.updateLimits(config);
}

// Public Methods
// --------------

Limiter.prototype.run = function(type, cb){
  var counter = this._getCounter(type);

  if (counter.isAtLimit) {
    this._queueForLater(type, cb);
  } else {
    this._runTask(type, cb);
  }
};

Limiter.prototype.updateLimits = function(config){
  var isObject = (typeof config === "object");
  if (!isObject){ return; }

  var that = this;

  Object.keys(config).forEach(function(type){
    var limit = config[type];

    var counter = new Counter(limit);
    that._counters.register(type, counter);

    var queue = new Queue();
    that._queues.register(type, queue);
  });
};

Limiter.prototype.inProgress = function(type){
  var counter = this._getCounter(type);
  return counter.inProgress;
};

Limiter.prototype.complete = function(type){
  var counter = this._getCounter(type);
  counter.decrement();

  this._checkQueue(type);
};

// Private API
// -----------

Limiter.prototype._runTask = function(type, cb){
  var that = this;

  var counter = this._getCounter(type);
  counter.increment();

  function done(){
    that.complete(type);
  }

  cb(done);
};

Limiter.prototype._queueForLater = function(type, cb){
  var queue = this._getQueue(type);
  queue.push(cb);
};

Limiter.prototype._checkQueue = function(type){
  var queue = this._getQueue(type);
  var task = queue.next();
  if (task){
    this._runTask(type, task);
  }
};

Limiter.prototype._getCounter = function(type){
  return this._counters.get(type);
};

Limiter.prototype._getQueue = function(type){
  return this._queues.get(type);
};

// Exports
// -------

module.exports = Limiter;
