var Limiter = require("../limiter");

describe("rate limit based on type", function(){
  var type = "some type";
  var limit = 2;
  var config = {};
  config[type] = limit;

  describe("when a limit is set to zero (0)", function(){
    var limiter, tasks;

    beforeEach(function(){
      tasks = [];
      var config = {};
      config[type] = 0;
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

    it("should not run any tasks", function(){
      expect(limiter.inProgress(type)).toBe(0);
      expect(tasks.length).toBe(0);
    });

  });

  describe("when a limit is set below zero (0)", function(){
    var limiter, tasks;

    beforeEach(function(){
      tasks = [];
      var config = {};
      config[type] = -1;
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

    it("should run all tasks", function(){
      expect(limiter.inProgress(type)).toBe(3);
      expect(tasks.length).toBe(3);
    });

  });

  describe("when more tasks are run than are allowed by the type", function(){
    var limiter, tasks;

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

    it("should run as many tasks as are allowed", function(){
      expect(tasks[0]).toBe(1);
      expect(tasks[1]).toBe(2);
    });

    it("should stop running tasks when it reaches the limit", function(){
      expect(limiter.inProgress(type)).toBe(2);
      expect(tasks.length).toBe(2);
    });

  });

  describe("when tasks are queues up for later work, and the in progress count drops below the limit", function(){
    var limiter, tasks;

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

  describe("when a specified ticket is completed", function(){
    var limiter, tasks;

    beforeEach(function(){
      var d1;

      tasks = [];
      limiter = new Limiter(config);

      var ticket = limiter.run(type, function(done){
        tasks.push(1);
      });

      limiter.run(type, function(done){
        tasks.push(2);
      });

      limiter.run(type, function(done){
        tasks.push(3);
      });

      limiter.complete(ticket);
    });

    it("should run the next available task", function(){
      expect(tasks.length).toBe(3);
      expect(tasks[2]).toBe(3);
    });
  });

  describe("when a ticket for work that is not yet running is completed", function(){
    var limiter, ticket;

    beforeEach(function(){
      var d1;

      config[type] = 0;
      limiter = new Limiter(config);

      limiter.run(type, function(done){});
      limiter.run(type, function(done){});
      ticket = limiter.run(type, function(done){});

      limiter.complete(ticket);
    });

    it("should remove the work from the queue", function(){
      var hasTicket = limiter.hasWork(type, ticket);
      expect(hasTicket).toBe(false);
    });
  });


  describe("when the in-progress count for a type is manually set, and tasks are run", function(){
    var limiter, tasks;

    beforeEach(function(){
      var d1;

      tasks = [];
      config[type] = 2;
      limiter = new Limiter(config);

      var updateConfig = {};
      updateConfig[type] = 1;
      limiter.updateInProgress(updateConfig);

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

    it("should include the manual in-progress update when determine how many steps can run now", function(){
      expect(tasks.length).toBe(1);
    });
  });

});
