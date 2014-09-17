/**
 * User: lingy
 * Date: 9/4/14
 * Time: 5:32 PM
 * @module ArrayIterator
 */
require('./Class.q.js');

!function () {
  function ArrayIterator(array){
    this.arr = array.slice();
  }
  ArrayIterator.$class();
  ArrayIterator.$def({
    arr: {type: Array},
    currentIndex: {type: Object.type.NUMBER, defaultValue: 0},
    next: function(){
      return this.arr[this.currentIndex++];
    },
    prev: function(){
      return this.arr[this.currentIndex--];
    },
    hasPrev: function(){
      return this.currentIndex > 0;
    },
    hasNext: function(){
      return this.currentIndex < this.arr.length;
    }
  });

  module.exports = ArrayIterator;
}();


