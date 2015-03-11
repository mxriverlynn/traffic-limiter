var Limiter = require("../limiter");

describe("rate limit based on type", function(){
  var limiter;
  var type = "some type";
  var limit = 2;
  var config = {};
  config[type] = limit;

  describe("when more tasks are run than are allowed by the type", function(){
    var tasks;

    beforeEach(function(){
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
    });

    it("should run as many tasks as are configured", function(){
      expect(tasks[0]).toBe(1);
      expect(tasks[1]).toBe(2);
    });

    it("should stop running tasks when it reaches the limit", function(){
      expect(limiter.inProgress(type)).toBe(2);
      expect(tasks.length).toBe(2);
    });

  });

  describe("when tasks are queues up for later work, and the in progress count drops below the limit", function(){
    var tasks;

    beforeEach(function(){
      var d1;

      tasks = [];
      limiter = new Limiter(config);

      limiter.run(type, function(done){
        d1 = done;
        tasks.push(1);
      });

      limiter.run(type, function(done){
        tasks.push(2);
      });

      limiter.run(type, function(done){
        tasks.push(3);
      });

      d1();
    });


    it("should run the next available task", function(){
      expect(tasks.length).toBe(3);
      expect(tasks[2]).toBe(3);
    });
  });

});
