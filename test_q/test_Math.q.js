!function(){
  require("../q");
  console.log('------ test Math -------');
  console.log(Math.randomInt(100, 200));
  for (var i = 0; i < 100; i++){
    console.log(Math.uuid(16));
  }
}();