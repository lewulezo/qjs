require("./Class.q.js");

!function(){

  var Set = require("./Set.q.js");

  function StrictSet(type){
    if (typeof type != Object.type.STRING && !(type instanceof Function)){
      throw new Error('type should be string or function !!');
    }
    this.type = type;
    this.$callSuper();
  }

  StrictSet.$class({
    superClass: Set,
    properties: {
      type: Object.type.ANY
    },
    methods: {
      add: function(obj){
        if (!validateType(this.type, obj)){
          throw new Error('value must be ' + this.type + '. Got ' + obj);
        }
        this.$super.add.call(this, obj);
      }
    }
  })
  
  function validateType(type, obj){
    if (type == Object.type.ANY){
      return true;
    }
    if (typeof type == Object.type.STRING){
      return typeof obj == type;
    } else {
      return obj instanceof type;
    }
  }
  
  module.exports = StrictSet;
  
}();

