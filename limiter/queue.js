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

module.exports = Queue;
