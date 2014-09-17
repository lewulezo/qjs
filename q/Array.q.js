/**
 * User: lingy
 * Date: 9/4/2014
 * Time: 6:08 PM
 * @module Array.q.js
 */
require("./Class.q.js");
require("./Object.q.js");

!function () {
  
  function find(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  }
  
  
  function findIndex(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  }


  function seek(obj, fn, startIndex){
    var array = this;
    if (array === null) {
      throw new TypeError('Array.prototype.seek called on null or undefined');
    }
    if (obj === null || obj === undefined){
      return -1;
    }
    startIndex = startIndex || 0;
    fn = fn || obj.$equals || function(o){return this == o};
    
    var index = -1;
    for (var i = startIndex; i < array.length; i++){
      if (fn.call(obj, array[i])){
        index = i;
        break;
      }
    }
    return index;
  }
  
  function clear(){
    this.splice(0, this.length);
  }
  
  function $clone(){
    return this.map(function(value){
      return value.$clone();
    });
  }
  
  function $hashcode(){
    return '[' + this.toString() + ']';
  }

  // Array.$class();
  Array.$methods([seek, find, findIndex, clear, $clone, $hashcode]);

}();

