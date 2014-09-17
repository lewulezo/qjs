!function(){
  
  Number.$methods([
    function toFixedString(length){
      if (!length || isNaN(length)){
        throw new Error('length must be valid integer');
      }
      var str = this.toString();
      if (str.length > length){
        return str.substring(str.length - length);
      } else {
        return String(Math.pow(10, length) + this).substring(1);
      }
    }
  ]);
}();