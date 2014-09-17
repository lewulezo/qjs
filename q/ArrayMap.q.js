/**
 * User: lingy
 * Date: 9/4/2014
 * Time: 5:13 PM
 * @module ArrayMap.q.js
 */

require('./Class.q.js');
require('./Array.q.js');

!function () {
  var ArrayIterator =require('./ArrayIterator.q.js');
  var Map = require('./Map.q.js');
  
  function ArrayMap(equalsFn){
    this.$initSuper(equalsFn);
    this.keys = [];
    this.values = [];
  }

  ArrayMap.$class({
    superClass: Map,
    properties: {
      "keys": {type: Array,},
      "values": {type: Array},
    },
    methods: {
      'put': function(key, value){
        var i = this.keys.seek(key, this.equalsFn);
        if (i == -1){
          this.keys.splice(i, 0, key);
          this.values.splice(i, 0, value);
        } else {
          this.values[i] = value;
        }
      },
      'get': function(key){
        var i = this.keys.seek(key, this.equalsFn);
        if (i == -1){
          return null;
        } else {
          return this.values[i];
        }
      },
      'remove': function(key){
        var i = this.keys.seek(key, this.equalsFn);
        if (i != -1){
          this.keys.splice(i, 1);
          this.values.splice(i, 1);
        }
      },
      'containsKey': function(key){
        return this.keys.seek(key, this.equalsFn) != -1;
      },
      'keyIterator': function(){
        return new ArrayIterator(this.keys);
      },
      'clear': function(){
        this.keys.clear();
        this.values.clear();
      },
      'size': function(){
        return this.keys.length;
      }
    }
  });


  module.exports = ArrayMap;
}();


!function(){
  console.log('------ test ArrayMap ------');
  var Map = module.exports;
  var m = new Map(function(o){
    return this.a == o.a;
  });
  var m2 = new Map();
  var k1 = {a:1};
  var k2 = {a:2};
  var k3 = {a:1};
  m.put(k1, {b:1,c:2});
  m.put(k2, {b:1,c:2});
  m.put(k3, {b:2,c:3});
  m2.put(k1, {b:1,c:2});
  m2.put(k2, {b:1,c:2});
  m2.put(k3, {b:2,c:3});
  console.log(m.keys);
  console.log(m.values);
  console.log(m2.keys);
  console.log(m2.values);
  m.clear();
  console.log(m.keys);
  console.log(m.values);
  console.log(m2.keys);
  console.log(m2.values);
  
}();