// Registry
// --------

function Registry(defaultValue){
  this._defaultValue = defaultValue;
  this._values = Object.create(null);
}

// Registry Members
// ----------------

Registry.prototype.register = function(name, value){
  this._values[name] = value;
};

Registry.prototype.unRegister = function(name){
  delete this._values[name];
};

Registry.prototype.get = function(name){
  var value;
  if (this.hasValue(name)){
    value = this._values[name];
  } else {
    value = this._defaultValue;
  }
  return value;
};

Registry.prototype.getOrCreate = function(name, defaultValue){
  var value = this.get(name);

  if (value === undefined){
    value = defaultValue;
    this.register(name, value);
  }

  return value;
};

Registry.prototype.forEach = function(cb){
  var that = this;
  var keys = Object.keys(this._values);
  keys.forEach(function(key){
    var data = {
      key: key,
      value: that._values[key]
    };
    cb(data);
  });
};

Registry.prototype.hasValue = function(name){
  var hasValue = Object.prototype.hasOwnProperty.call(this._values, name);
  return hasValue;
};

// Exports
// -------

module.exports = Registry;
