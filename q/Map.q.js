!function(){
  function Map(equalsFn){
    this.equalsFn = equalsFn;
  }
  
  Map.$class({
    properties: {
      equalsFn: {type: Function},
    }, 
    method: {
      'put': Function.$abstract,
      'get': Function.$abstract,
      'remove': Function.$abstract,
      'containsKey': Function.$abstract,
      'keyIterator': Function.$abstract,
      'clear': Function.$abstract,
      'size': Function.$abstract,
      'loadObject': function(object){
        for (var p in object){
          if (object.hasOwnProperty(p)){
            this.put(p, object[p]);
          }
        }
      }
    }
  });
  module.exports = Map;
}();