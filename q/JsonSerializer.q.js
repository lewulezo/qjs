!function(){
  require('./Class.q.js');
  require("./Math.q.js");
  var StringBuilder = require('./StringBuilder.q.js');
  var Map = require('./ArrayMap.q.js');
  
  function JsonSerializer(){
    
  }
  
  JsonSerializer.$class();
  JsonSerializer.$static({
    serialize : toJson
  });

  
  function toJson(value){
    var objects = new Map();
    variableToJson(value, objects);
    return objects;
  }
  
  function variableToJson(variable, objectMap){
    var type = typeof variable;
    var v = variable;
    var json;
    switch (type) {
    case 'string': 
      json = '"' + v + '"'; 
      break;
    case 'boolean': 
    case 'number':
      json = v; 
      break;
    case 'object':
      json = objectToJson(v, objectMap);
      break;
    }
    return json;
  }
  
  function objectToJson(obj, objectMap){
    if (objectMap.containsKey(obj)){
      return objectMap.get(obj).id;
    }
    var objectId = '#' + Math.uuid(16);
    var objectItem = {id: objectId, 'class': obj.$className};

    objectMap.put(obj, objectItem);
    
    var json = new StringBuilder();
    var props = getProperties(obj);
    json.append('{');
    var propOutput = [];
    for (var p in props){
      var propStr = new StringBuilder();
      propStr.append('"' + p + '":');
      propStr.append(variableToJson(props[p], objectMap));
      propOutput.push(propStr.toString());
    }
    json.append(propOutput.join(','));
    json.append('}');

    objectItem.json = json.toString();
    return objectId;
  }
  
  
  function getProperties(obj){
    var props = {};
    for (var p in obj){
      if (obj.hasOwnProperty(p)){
        props[p] = obj[p];
      }
    }
    if (obj.$class){
      var properties = obj.$class._class.properties;
      for (var propName in properties){
        if (!properties.hasOwnProperty(propName)){
          continue;
        }
        var prop = properties[propName];
        if (prop.getter || prop.setter){
          continue;
        }
        p = '_' + prop.name;
        props[p] = obj[p];
      }
    }
    return props;
  }
  
  module.exports = JsonSerializer;
}();



var a = {v:3};
var b = {v:4};
a.b = b;
b.a = a;
var JsonSerializer = module.exports;
console.log(JsonSerializer.serialize(a).values);