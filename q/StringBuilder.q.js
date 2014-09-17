!function(){
  require("./Class.q.js");
  require("./Array.q.js");
  
  function StringBuilder(str){
    this.buffer = [];
    this.length = 0;
    this.append(str);
  }
  
  
  StringBuilder.$class({
    properties: {
      buffer: {type: Array},
      length: {type: Object.type.NUMBER}
    },
    methods: {
      append: function(str){
        if (str === null || str === undefined){
          return;
        }
        str = str.toString();
        this.buffer.push(str);
        this.length += str.length;
      },
      clear: function(){
        this.buffer.clear();
        this.length = 0;
      },
      toString: function(){
        return this.buffer.join('');
      },
      insert: function(offset, str){
        if (offset > this.length){
          throw new Error('offset greater than length: ' + offset + ', length is ' + this.length);
        }
        var bufferIndex = 0;
        var bufferOffset = 0;
        var currentOffset = 0;
        this.buffer.some(function(bufferedStr, index, buffer){
          if (currentOffset + bufferedStr.length > offset){
            bufferIndex = index;
            bufferOffset = offset - currentOffset;
            return true;
          }
          currentOffset += bufferedStr.length;
        });
        var oldBufferItem = this.buffer[bufferIndex];
        var preBufferItem = oldBufferItem.substring(0, bufferOffset);
        var nextBufferItem = oldBufferItem.substring(bufferOffset);
        this.buffer.splice(bufferIndex, 1, preBufferItem, str, nextBufferItem);
      }
    }
  });
  

  
  module.exports = StringBuilder;
  
}();