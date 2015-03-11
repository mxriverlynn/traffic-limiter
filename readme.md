# Traffic-Limiter

Rate limit the number of tasks that can be run at any time,
based on a task type. 

## Install

`npm install traffic-limiter --save`

## Basic Use

When creating a `Limiter`, you need to specify `type: limit`
configuration.

```js
var Limiter = require("traffic-limiter");

var limiter = new Limiter({
  foo: 1
});

limiter.run("foo", function(done){
  // this one runs right away
  console.log("doing some 'foo' work");
  setTimeout(function(){
    done();
  }, 3000);
});

limiter.run("foo", function(done){
  // won't run until previous task is done
  console.log("doing more 'foo' work");
  done();
});
```

### Update Limits

You can update the limits any time you want by calling the
`updateLimits` method.

```js
limiter.updateLimits({
  foo: 2
});
```

## Legal Junk

Traffic-Limiter is &copy;2015 Muted Solutions, LLC. All Rights Reserved.

Distributed under [MIT License](http://mutedsolutions.mit-license.org)
