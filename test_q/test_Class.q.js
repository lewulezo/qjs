require('../q');
!function(){
  console.log('------ test Class ------');
  
  function Person(name){
    console.log('construct person');
    this.name = name;
  }
  
  Person.$class({
    methods: {
      jump: function jump(times){
        console.log('person jump ' + times + " times");
      },
      laugh: function laugh(dur){
        console.log(this.$className + ' laugh for ' + dur + ' seconds');
      }
    },
    properties: {
      'name': {
        type: 'string',
        defaultValue: 'unknown'
      },
      'birthday': {
        type: Date
      },
      'value':{
        type: 'number'
      }
    }
  });
  
  // Person.$property('name', 'string', 'unknown');
  // Person.$property('birthday', Date);
  
  function Employee(name){
    console.log('construct employee');
    this.$initSuper(name);
  }
  
  Employee.$class({
    'superClass': Person
  });
  
  function Boss(name){
    console.log('construct boss');
    this.$initSuper(name);
  }
  Boss.$class({
    superClass: Employee
  });
  Boss.$def({
    value: 'unknown boss',
    jump: function jump(times){
      console.log('boss jump ' + times + ' times');
    }
  });
  
  //var p = new Person();
  var e = new Employee();
  var b = new Boss('Hellen');
  console.assert(b instanceof Person);
  console.assert(b instanceof Employee);
  b.$callSuper('jump', 1);
  b.jump(3);
  b.laugh(50);
  // b.birthday = '1970-01-01';
  console.log(b.name);
  // b.value = '3';
  e.value = 2;
}();
