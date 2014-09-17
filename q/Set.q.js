/**
 * User: lingy
 * Date: 9/4/2014
 * Time: 3:39 PM
 * @module Set.q.js
 */
require('./Class.q.js');
require("./Array.q.js");


!function () {
  var ArrayIterator = require('./ArrayIterator.q.js');
  
  function Set(){
    this.equalsFn = null;
    this.array = [];
  }
  Set.$class();
  Set.$def({
    array: {type: Array},
    equalsFn: {type: Function},
    add: function(obj){
      if (this.exists(obj)){
        return false;
      }
      this.array.push(obj);
      this.array.sort();
      return true;
    },
    addAll: function(iterable){
      if (iterable && iterable.iterator){
        var iterator = iterable.iterator();
        while(iterator.hasNext()){
          this.add(iterator.next());
        }
      }
    },
    remove: function(obj){
      var i = this.array.seek(obj, this.equalsFn);
      if (i == -1){
        return false;
      }
      this.array.splice(i, 1);
      return true;
    },
    exists: function(obj){
      return this.array.seek(obj, this.equalsFn) != -1;
    },
    iterator: function(){
      return new ArrayIterator(this.array);
    },
    size: function(){
      return this.array.length;
    },
    clear: function(){
      this.array.clear();
    }
  });
  module.exports = Set;
}();


