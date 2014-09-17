require('../q');

!function(){
  console.log('------- test ArrayIterator ------');
  var ArrayIterator = require('../q/ArrayIterator.q.js');
  var ai = new ArrayIterator([1,4,5,2,3]);
  while(ai.hasNext()){
    console.log(ai.next());
  }
}();