!function(){
  require("../q");
  var StringBuilder = require('../q/StringBuilder.q.js');
  console.log('------ test StringBuilder -------');
  var sb = new StringBuilder(1112);
  sb.append(12444);
  sb.insert(3, 'ddd');
  console.assert(sb.toString() , '111ddd212444');
  
  
}();