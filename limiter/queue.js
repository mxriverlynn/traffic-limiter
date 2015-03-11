function Queue(values){
  this.values = (values || []).slice(0);
}

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

module.exports = Queue;
