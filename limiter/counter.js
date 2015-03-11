// Counter
// -------

function Counter(limit){
  this.inProgress = 0;
  this.limit = limit;
  this._checkLimit();
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

Counter.prototype.setLimit = function(limit){
  this.limit = limit;
  this._checkLimit();
};

Counter.prototype.setInProgress = function(inProgress){
  this.inProgress = inProgress;
  this._checkLimit();
};

// Private API
// -----------

Counter.prototype._checkLimit = function(){
  if (this.limit < 0){
    this.isAtLimit = false;
  } else {
    this.isAtLimit = (this.inProgress >= this.limit);
  }
};

// Exports 
// -------
module.exports = Counter;
