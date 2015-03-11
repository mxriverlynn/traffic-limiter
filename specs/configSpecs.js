var Limiter = require("../limiter");

describe("configuration", function(){
  var limiter;
  var type = "some type";
  var limit = 2;
  var config = {};
  config[type] = limit;

  describe("when updating limit config with a non-object", function(){
    var tasks;

    beforeEach(function(){
      tasks = [];
      limiter = new Limiter(config);
    });

    it("should not throw an error", function(){
      expect(function(){
        limiter.updateLimits();
      }).not.toThrow();
    });
  });

  describe("when updating a limit config to a larger number", function(){
    var tasks;

    beforeEach(function(){
      var d1;

      tasks = [];
      limiter = new Limiter(config);

      limiter.run(type, function(done){
        tasks.push(1);
      });

      limiter.run(type, function(done){
        tasks.push(2);
      });

      limiter.run(type, function(done){
        tasks.push(3);
      });

      var updateConfig = {};
      updateConfig[type] = 3;
      limiter.updateLimits(updateConfig);
    });

    it("should kick off the next available task", function(){
      expect(tasks.length).toBe(3);
      expect(tasks[2]).toBe(3);
    });
  });

  describe("when updating a limit config to a smaller number", function(){
    var tasks;

    beforeEach(function(){
      var d1;

      tasks = [];
      limiter = new Limiter(config);

      limiter.run(type, function(done){
        tasks.push(1);
      });

      var updateConfig = {};
      updateConfig[type] = 1;
      limiter.updateLimits(updateConfig);

      limiter.run(type, function(done){
        tasks.push(2);
      });

      limiter.run(type, function(done){
        tasks.push(3);
      });
    });

    it("should wait for tasks to complete before kicking off more", function(){
      expect(tasks.length).toBe(1);
    });
  });

});
