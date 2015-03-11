// Counter
// -------

function Counter(limit){
  this.inProgress = 0;
  this.limit = limit;
  this.isAtLimit = false;
}

// Public API
// ----------

Counter.prototype.increment = function(){
  this.inProgress += 1;

  this._checkLimit();
};

Counter.prototype.decrement = function(){
  var inProgress = this.inProgress;
  if (inProgress > 0){
    inProgress -= 1;
  }

  this.inProgress = inProgress;

  this._checkLimit();
};

// Private API
// -----------

Counter.prototype._checkLimit = function(){
  this.isAtLimit = (this.inProgress >= this.limit);
};

// Exports 
// -------
module.exports = Counter;
