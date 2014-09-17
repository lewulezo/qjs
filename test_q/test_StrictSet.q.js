require("../q");
!function(){
  console.log('------ test StrictSet ------');
  var Set = require("../q/StrictSet.q.js");
  var s = new Set(function(o){
    return this.toString() == o.toString();
  });
  s.add(25);
  s.add(125);
  s.add(2);
  s.add('1');
  s.add('2');
  s.add('1');
  console.log(s.array);
  var i = s.iterator();
  while(i.hasNext()){
    console.log(i.next());
  }
  s.clear();
  console.assert(s.array.length === 0);
}();