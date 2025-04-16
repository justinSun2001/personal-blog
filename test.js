function Person(name) {
  this.name = name;
}

// 构造函数 Person 的 prototype 属性指向原型对象
Person.prototype.sayHello = function () {
  console.log(`Hello, ${this.name}!`);
};

function Student(name, grade) {
  Person.call(this, name); // 继承属性
  this.grade = grade;
}

// 继承方法：将 Student.prototype 的原型指向 Person.prototype
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student; // 修正 constructor 指向

Student.prototype.study = function () {
  console.log(`${this.name} is studying.`);
};

const student = new Student("Bob", 10);
student.sayHello(); // 继承自 Person.prototype
student.study(); // 自身方法
