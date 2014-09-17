!function(){
  require("../q");
  console.log('------ test Number -------');
  var n = 1112;
  console.assert(n.toFixedString(3), '112');
  console.assert(n.toFixedString(4), '1112');
  console.assert(n.toFixedString(5), '01112');
  console.assert(n.toFixedString(6), '001112');
  
  
}();