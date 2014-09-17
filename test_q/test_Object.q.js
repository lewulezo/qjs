require('../q');
!function(){
  console.log('------ test Object ------');
  var a = {a:1};
  console.log("value:" + a.$hashcode());
  function Clock(name){
    this.name = name;
    this.currentTime = new Date();
  }
  Clock.$class({
    properties:{
      'name': {type: Object.type.STRING},
      'currentTime': {type: Date}
    },
    methods:{
      now: function(){
        return this.currentTime.now();
      }
    }
  });
  var c = new Clock('Ring!!!');
  console.log('c.hash:' + c.$hashcode());
}();