!function(){
  var $def = function(scope, propName, propValue, writable){
    Object.defineProperty(scope, propName, {
      value: propValue,
      writable: writable || false
    });
  };
  var $defs = function(scope, propValues){
    for (var p in propValues){
      if (propValues.hasOwnProperty(p)){
        $def(scope, p, propValues[p]);
      }
    }
  };
  var $new = function(proto, overrides){
    var newObj = Object.create(proto);
    $defs(newObj, overrides);
    return newObj;
  };
  var $super = function(obj){
    return Object.getPrototypeOf(obj);
  };
  var $defProp = function(scope, propName, getter, setter){
    Object.defineProperty(scope, propName, {
      'get': getter,
      'set': setter
    })
  };

  var TYPE = {
    'ANY':       'any',
    'STRING':    typeof(''),
    'NUMBER':    typeof(0),
    'BOOLEAN':   typeof(true),
    'UNDEFINED': typeof(undefined),
    'FUNCTION':  typeof(anonymous),
    'OBJECT':    typeof({})
  };
  $def(Object, 'type', TYPE);

  $defs(Function.prototype, {
    '$class': function(classDef){
      if (this.hasOwnProperty('_class')){
        return;
      }
      defineClass(this, classDef || {});
      return this;
    },
    '$method': function(methodDef){
      if (!this._class || !(this._class instanceof Class)){
        this.$class();
        // throw new Error('need call $class before call $method');
      }
      if (!methodDef){
        throw new Error('expect function parameter');
      }
      if (methodDef instanceof Function){
        defineMethod(this._class, parseFunctionName(methodDef), methodDef);
      }
      else {
        defineMethod(this._class, methodDef.name, methodDef);
      }
      return this;
    },
    '$methods': function(methodsDef){
      if (!this._class || !(this._class instanceof Class)){
        this.$class();
        // throw new Error('need call $class before call $methods');
      }
      defineMethods(this._class, methodsDef);
      return this;
    },
    '$static': function(methodsDef){
      if (!this._class || !(this._class instanceof Class)){
        this.$class();
        // throw new Error('need call $class before call $methods');
      }
      defineMethods(this._class, methodsDef, true);
      return this;
    },
    '$property': function(propName, type, defaultValue){
      if (!this._class || !(this._class instanceof Class)){
        this.$class();
        // throw new Error('need call $class before call $methods');
      }
      defineProperty(this._class, propName, {
        type: type || TYPE.ANY,
        defaultValue: defaultValue || null
      });
      return this;
    },
    '$properties': function(propsDef){
      if (!this._class || !(this._class instanceof Class)){
        this.$class();
        // throw new Error('need call $class before call $methods');
      }
      defineProperties(this._class, propsDef);
    },
    '$def': function(defs){
      if (!this._class || !(this._class instanceof Class)){
        this.$class();
        // throw new Error('need call $class before call $methods');
      }
      var cls = this._class;
      for (var p in defs){
        if (defs.hasOwnProperty(p)){
          var v = defs[p];
          if (v && v instanceof Function){
            defineMethod(cls, p, v);
          } else {
            defineProperty(cls, p, v);
          }
        }
      }
    }
  });
  
  $def(Function, '$abstract', function(){
    throw new Error('Abstract function should be implemented first');
  });


  /**
   * @private define a class from a constructor function
   * will add a parameter _class to this function
   * @params {Function} fn
   * @params {string} classDef.name
   * @params {Function} classDef.superClass
   **/
  function defineClass(fn, classDef){
    var superInitMethod = classDef.superClass || Object;
    if (superInitMethod instanceof Function && superInitMethod._class === undefined){
      superInitMethod.$class();
    }

    $def(fn, '_class', new Class({
        'initMethod': fn,
        'name': classDef.className,
        'superClass': superInitMethod._class,
        'methods': classDef.methods,
        'properties': classDef.properties
      })
    );
  }


  /**
   * @private define a method to a class
   * @params {Class} cls
   * @params {string} methodName
   * @params {Function} methodDef.fn
   * @params {boolean} methodDef.isStatic
   **/
  function defineMethod(cls, methodName, methodDef, isStatic){
    var initMethod = cls.initMethod;
    var proto = initMethod.prototype;
    if (methodDef instanceof Function){
      methodDef = {
        fn: methodDef,
        name: methodName
      }
    } else {
      methodDef.name = methodName;
    }
    if (isStatic){
      methodDef.isStatic = isStatic;
    }
    var method = new Method(methodDef);

    cls.methods[method.name] = method;

    var target = method.isStatic ? initMethod : proto;
    $def(target, method.name, method.fn);
  }


  /**
   * @private define several methods to a class
   * @params {Class} cls
   * @params {Object} methodsDef {methodName: func}
   * @params {boolean} isStatic
   **/
  function defineMethods(cls, methodsDef, isStatic){
    if (methodsDef instanceof Array){
      methodsDef.forEach(function(methodsDef){
        defineMethod(cls, parseFunctionName(methodsDef), methodsDef, isStatic);
      });
    }
    else {
      for (var p in methodsDef){
        if (methodsDef.hasOwnProperty(p)){
          var fn = methodsDef[p];
          defineMethod(cls, p, fn, isStatic);
        }
      }
    }
  }

  /**
   * @private define a property to a class
   * @params {Class} cls
   * @params {string} propName
   * @params {string|Function} propDef.type
   * @params {any} propDef.defaultValue
   * @params {Function} propDef.getter
   * @params {Function} propDef.setter
   **/
  function defineProperty(cls, propName, propDef){
    var initMethod = cls.initMethod;
    var proto = initMethod.prototype;
    var defaultValue = propDef.defaultValue;
    if (!propDef.type && !defaultValue && !(propDef.getter || propDef.setter)){
      defaultValue = propDef;
      propDef = {
        name: propName,
        defaultValue : defaultValue
      };
    } else {
      propDef.name = propName;
    }
    var property = new Property(propDef);
    cls.properties[propName] = property;
    var internalName = '_' + propName;
    var getter = propDef.getter || function(){
      if (!this.hasOwnProperty(internalName)){
        $def(this, internalName, defaultValue, true);
      }
      return this[internalName];
    };
    var setter = propDef.setter || function(v){
      if (!property.validateValue(v)){
        throw new Error(property.name + ' value must be ' + property.getType() + '. Got ' + v);
      }
      if (this.hasOwnProperty(internalName)){
        this[internalName] = v;
      } else {
        $def(this, internalName, v, true);
      }
    }
    $defProp(proto, propName, getter, setter);
  }

  /**
   * @private define several property to a class
   * @params {Class} cls
   * @params {Object} propsDef {propName: propDef}
   **/
  function defineProperties(cls, propsDef){
    for (var p in propsDef){
      if (propsDef.hasOwnProperty(p)){
        var propDef = propsDef[p];
        defineProperty(cls, p, propDef);
      }
    }
  }

  function anonymous(){

  }

  /**
   * @private
   * @params {Function} func
   * @returns {string}
   **/
  function parseFunctionName(func){
    if (func.name){
      return func.name;
    }
    var funcName = func.toString().match(/^function\s*([^\s(]+)/);
    if (funcName.length > 0){
      return funcName[1];
    }
    return null;
  }

  function lookupSuper(object){
    var depth = object._callDepth || 1;
    do {
      object = $super(object);
      depth--;
    }
    while (depth > 0 && object.constructor !== Object);
    return $super(object);
  }

  function validateSimpleType(typeDef){
    var valid = false;
    for (var t in TYPE){
      if (TYPE.hasOwnProperty(t) && TYPE[t] == typeDef){
        valid = true;
      }
    }
    return valid;
  }


  /**
   * @class
   * @params {Function} classDef.initMethod
   * @params {string} classDef.className
   * @params {Class} classDef.superClass
   * @params {Object} classDef.methods
   * @params {Object} classDef.properties
   **/
  function Class(classDef){
    var initMethod = classDef.initMethod || anonymous;

    var cls = this;
    $defs(cls, {
      'initMethod': initMethod,
      'name': classDef.className || parseFunctionName(initMethod),
      'superClass': classDef.superClass || ObjectClass,
      'methods': {},
      'properties': {}
    });
    var superInitMethod = cls.superClass.initMethod;
    var proto = initMethod.prototype = $new(superInitMethod.prototype);

    $def(proto, '$class', initMethod);
    $def(proto, '$className', cls.name);
    $def(proto, '$superClass', superInitMethod);
    $def(proto, '$super', superInitMethod.prototype);
    $def(proto, '$callSuper', function(methodName){
      if (!this.hasOwnProperty('_callDepth')){
        $def(this, '_callDepth', 1, true);
      }
      var callDepth = this._callDepth;
      var superProto = lookupSuper(this);
      var args = Array.prototype.splice.call(arguments, 1, 1);
      var superMethod = superProto[methodName];
      if (!superMethod || !(superMethod instanceof Function)){
        throw new Error('cannot find method ' + methodName + ' in super class ')
      }
      try {
        this._callDepth++;
        superMethod.apply(this, args);
      } catch (e){
        throw e;
      } finally{
        this._callDepth = callDepth;
      }
    });
    $def(proto, '$initSuper', function(){
      if (!this.hasOwnProperty('_callDepth')){
        $def(this, '_callDepth', 1, true);
      }

      var callDepth = this._callDepth;
      var superProto = lookupSuper(this);
      try{
        this._callDepth++;
        superProto.constructor.apply(this, arguments);
      } catch (e){
        throw e;
      } finally {
        this._callDepth = callDepth;
      }
    });
    defineMethods(cls, classDef.methods);
    defineProperties(cls, classDef.properties);
    proto.constructor = initMethod;
  }


  $defs(Class.prototype, {
    'toString': function(){
      return 'class: ' + this.name;
    }
  });

  var ObjectClass = $new(Class.prototype, {
    'name': 'Object',
    'initMethod': Object,
    'superClass': null,
    'methods': {},
    'properties': {}
  });
  $def(Object, '_class', ObjectClass);


  /**
   * @class
   * @params {string} methodDef.name
   * @params {Function} methodDef.fn
   * @params {boolean} methodDef.isStatic
   **/
  function Method(methodDef){
    var fn = methodDef.fn;
    if (!fn || !(fn instanceof Function)){
      throw new Error('methodDef must has a function definition');
    }
    $defs(this, {
      'name': methodDef.name || parseFunctionName(fn),
      'fn': fn,
      'isStatic': methodDef.isStatic
    });
  }

  function Property(propDef){
    var typeDef = propDef.type;
    var simpleType = TYPE.OBJECT;
    var complexType = Object;

    var isComplexType = true;
    if (typeof typeDef == TYPE.STRING){
      simpleType = typeDef;
      if (typeDef != TYPE.OBJECT && typeDef != TYPE.FUNCTION){
        isComplexType = false;
      }
      if (!validateSimpleType(typeDef)){
        throw new Error('unknown type ' + typeDef);
      }
    } else if (typeof typeDef == TYPE.FUNCTION){
      if (!typeDef.hasOwnProperty('_class')){
        typeDef.$class();
      }
      complexType = typeDef;
      isComplexType = true;
    }

    $defs(this, {
      'name': propDef.name,
      'simpleType': simpleType,
      'complexType': complexType,
      'isComplexType': isComplexType,
      'defaultValue': propDef.defaultValue,
      'setter': propDef.setter,
      'getter': propDef.getter
    });
  }

  $defs(Property.prototype, {
    'validateValue': function(v){
      if (v === undefined || v === null){
        return true;
      }
      if (this.simpleType == TYPE.ANY){
        return true;
      }
      if (this.isComplexType){
        return v instanceof this.complexType;
      } else {
        return typeof v == this.simpleType;
      }
    },
    'getType': function(){
      return this.isComplexType ? this.complexType : this.simpleType;
    }
  });


}();


