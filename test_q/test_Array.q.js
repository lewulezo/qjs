require('../q');
!function(){
  console.log('------ test Array -------');
  var arr = [{a:1}, {a:2}, {a:3}];
  console.assert(arr.seek({a:3}, function(o){
    return this.a == o.a;
  }) == 2);
  console.assert(arr.find(function(elem, ind, array){
    return elem.a == 2;
  }) == arr[1]);
  console.assert(arr.findIndex(function(elem, ind, array){
    return elem.a == 1;
  }) === 0);
  var arr2 = arr.$clone();
  arr2[0].a = 4;
  arr2.splice(2, 1);
  console.log(arr);
  console.log(arr2);
  
}();
