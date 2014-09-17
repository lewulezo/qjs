!function(){
  require("./Class.q.js");
  require("./Math.q.js");
  
  Object.defineProperties(Math, {
    uuid: {
      value: function uuid(length){
        if (length < 8){
          throw new Error('length must greater than 8');
        }
        var uuid = [];
        var prefix = Math.toHex(Date.now());
        var len = prefix.length;
        if (len > length - 4){
          prefix = prefix.substring(len - length + 4);
          len = prefix.length;
        }
        uuid.push(prefix);
        for (;len < length; len++){
          uuid.push(Math.toHex(Math.randomInt(0, 16)));
        }
        return uuid.join('');
      }
    },
    toHex: {
      value: function toHex(decimal){
       return decimal.toString(16);
      }
    },
    toNumber: {
      value: function toNumber(hex){
        return parseInt(hex, 16);
      }
    },
    randomInt: {
      value: function randomInt(min, range){
        min = min || 0;
        range = range || 1;
        return min + Math.floor(Math.random() * range);
      }
    }
  });
}();