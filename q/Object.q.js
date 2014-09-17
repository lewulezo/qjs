require("./Class.q.js");

!function(){
  Object.$methods([
    function $equals(that){
      return this === that;
    },
    function $hashcode(){
      var hashcodes = [];
      var p, v;
      if (this.$class){
        var properties = this.$class._class.properties;
        for (var propName in properties){
          if (!properties.hasOwnProperty(propName)){
            continue;
          }
          var prop = properties[propName];
          if (prop.getter || prop.setter){
            continue;
          }
          p = '_' + prop.name;
          v = this[p];
          if (typeof v.$hashcode === Object.type.FUNCTION){
            hashcodes.push(v.$hashcode());
          } else {
            hashcodes.push(v.toString());
          }
        }
      }
      for (p in this){
        if (this.hasOwnProperty(p)){
          v = this[p];
          if (typeof v.$hashcode === Object.type.FUNCTION){
              hashcodes.push(v);
          } else {
            hashcodes.push(v.toString);
          }
        }
      }
      return hashcodes.join();
    },
    function $clone(deep){
      var that = Object.create(Object.getPrototypeOf(this));
      var p, v;
      if (this.$class){
        var properties = this.$class._class.properties;
        for (var propName in properties){
          if (!properties.hasOwnProperty(propName)){
            continue;
          }
          var prop = properties[propName];
          if (prop.getter || prop.setter){
            continue;
          }
          p = '_' + prop.name;
          v = this[p];
          if (deep){
            v = v.$clone(true);
          }
          that[p] = v;
        }
      }
      for (p in this){
        if (this.hasOwnProperty(p)){
          v = this[p];
          if (deep){
            v = v.$clone(true);
          }
          that[p] = this[p];
        }
      }
      return that;
    }
  ]);
  
  
  
  function simpleHashcode(){
    return this.toString();
  }
  
  String.$methods({
    '$hashcode': simpleHashcode
  });
  Date.$methods({
    '$hashcode': simpleHashcode
  });
  Number.$methods({
    '$hashcode': simpleHashcode
  });
  Boolean.$methods({
    '$hashcode': simpleHashcode
  });
  Function.$methods({
    '$hashcode': simpleHashcode
  });
  
}();


