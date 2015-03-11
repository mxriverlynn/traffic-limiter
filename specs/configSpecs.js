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

});
