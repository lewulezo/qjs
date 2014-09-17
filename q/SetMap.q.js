!function(){
  require("./Class.q.js");
  var Map = require("./Map.q.js");
  var Set = require("./StrictSet.q.js");
  
  function Entry(key, value, equalsFn){
    this.key = key;
    this.value = value;
    this.equalsFn = equalsFn;
  }
  
  Entry.$def({
    key: {type: Object.type.ANY},
    value: {type: Object.type.ANY},
    keyEqualsFn: {type: Function},
    $equals: function(that){
      if (typeof this.keyEqualsFn == Object.type.FUNCTION){
        return this.keyEqualsFn.call(this.key, that.key);
      } else if (this.key && typeof this.key.$equals == Object.type.Function){
        return this.key.$equals(that.key);
      } else {
        return this.key === that.key;
      }
    }
  });
  
  function SetMap(equalsFn){
    this.equalsFn = equalsFn;
    this.entries = new Set(Entry);
  }
  
  SetMap.$class({
    superClass: Map,
    properties: {
      entries: Set,
      keys: {
        getter: function(){
          var keys = [];
          var entryIter = this.entries.iterator();
          while (entryIter.hasNext()){
            keys.push(entryIter.next().key);
          }
          return keys;
        }
      },
      values: {
        getter: function(){
          var values = [];
          var entryIter = this.entries.iterator();
          while (entryIter.hasNext()){
            values.push(entryIter.next().value);
          }
          return values;
        }
      }
    },
    methods: {
      'put': function(key, value){
        var entry = new Entry(key, value, this.equalsFn);
        this.entries.add(entry);
      },
      'get': function(key){
        var entry = new Entry(key, null, this.equalsFn);
        return this.entries.get(entry).value;
      },
      'remove': function(key){
        var entry = new Entry(key, null, this.equalsFn);
        this.entries.remove(entry);
      },
      'containsKey': function(key){
        var entry = new Entry(key, null, this.equalsFn);
        return this.entries.exists(entry);  
      },
      'keyIterator': Function.$abstract,
      'clear': function(){
        this.entries.clear();
      }
    }
  });
  
  module.exports = SetMap;
  
}();


!function(){
  console.log('------ test SetMap ------');
  var Map = module.exports;
  var m = new Map(function(o){
    return this.a == o.a;
  });
  var m2 = new Map();
  var k1 = {a:1};
  var k2 = {a:2};
  var k3 = {a:1};
  m.put(k1, {b:1,c:2});
  m.put(k2, {b:1,c:2});
  m.put(k3, {b:2,c:3});
  m2.put(k1, {b:1,c:2});
  m2.put(k2, {b:1,c:2});
  m2.put(k3, {b:2,c:3});
  console.log(m.keys);
  console.log(m.values);
  console.log(m2.keys);
  console.log(m2.values);
  m.clear();
  console.log(m.keys);
  console.log(m.values);
  console.log(m2.keys);
  console.log(m2.values);

}();