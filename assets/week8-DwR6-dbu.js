var e=`Week 8 — Object-Oriented Programming`,t=`CS50P 2022 — Lecture 8`,n=`# Object-Oriented Programming: Organizing Code

## Introduction

Object-Oriented Programming (OOP) is a paradigm for organizing code into objects that combine data (attributes) and behavior (methods). It promotes code reuse, modularity, and scalability.

## Classes and Objects

A class is a blueprint for creating objects. An instance is a specific object created from a class.

### Defining a Class

\`\`\`python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
    def display_info(self):
        print(f"{self.name}: Grade {self.grade}")

# Create instances
alice = Student("Alice", 95)
bob = Student("Bob", 87)

alice.display_info()  # Alice: Grade 95
\`\`\`

## The \`__init__\` Method

The \`__init__\` method is a constructor that initializes new instances:

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

person = Person("Alice", 30)
\`\`\`

## The \`self\` Parameter

\`self\` refers to the current instance and must be the first parameter in methods:

\`\`\`python
class Cat:
    def __init__(self, name):
        self.name = name
    
    def meow(self):
        print(f"{self.name} says meow!")

cat = Cat("Whiskers")
cat.meow()  # Whiskers says meow!
\`\`\`

## Methods

Methods are functions defined inside a class:

\`\`\`python
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    
    def bark(self):
        print(f"{self.name} barks!")
    
    def get_info(self):
        return f"{self.name} is a {self.breed}"

dog = Dog("Rex", "Labrador")
dog.bark()            # Rex barks!
print(dog.get_info()) # Rex is a Labrador
\`\`\`

## Inheritance

Inheritance allows a class to inherit attributes and methods from another class:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    def speak(self):
        print(f"{self.name} barks")

class Cat(Animal):
    def speak(self):
        print(f"{self.name} meows")

dog = Dog("Rex")
cat = Cat("Whiskers")

dog.speak()  # Rex barks
cat.speak()  # Whiskers meows
\`\`\`

## The \`super()\` Function

Use \`super()\` to call methods from the parent class:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed
    
    def speak(self):
        super().speak()
        print(f"{self.name} also barks")

dog = Dog("Rex", "Labrador")
dog.speak()
# Output:
# Rex makes a sound
# Rex also barks
\`\`\`

## Magic Methods

### \`__str__\`

Define how an object is converted to a string:

\`\`\`python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    
    def __str__(self):
        return f"Student: {self.name} (Grade {self.grade})"

student = Student("Alice", 95)
print(student)  # Student: Alice (Grade 95)
\`\`\`

### \`__repr__\`

Define the official string representation:

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

point = Point(3, 4)
print(repr(point))  # Point(3, 4)
\`\`\`

## Properties

Use the \`@property\` decorator to create computed properties:

\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    @property
    def area(self):
        return self.width * self.height
    
    @property
    def perimeter(self):
        return 2 * (self.width + self.height)

rect = Rectangle(5, 3)
print(rect.area)       # 15
print(rect.perimeter)  # 16
\`\`\`

Properties can also have setters:

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

temp = Temperature(0)
print(temp.fahrenheit)  # 32.0
temp.celsius = 100
print(temp.fahrenheit)  # 212.0
\`\`\`

## Class Variables

Variables shared by all instances of a class:

\`\`\`python
class Counter:
    count = 0  # Class variable
    
    def __init__(self, name):
        self.name = name  # Instance variable
        Counter.count += 1
    
    @classmethod
    def get_count(cls):
        return cls.count

c1 = Counter("First")
c2 = Counter("Second")
c3 = Counter("Third")

print(Counter.get_count())  # 3
\`\`\`

## Practical Example: Bank Account

\`\`\`python
class BankAccount:
    def __init__(self, holder, balance=0):
        self.holder = holder
        self.balance = balance
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount
            return True
        return False
    
    def __str__(self):
        return f"{self.holder}: \${self.balance:.2f}"

account = BankAccount("Alice", 1000)
account.deposit(500)
print(account)  # Alice: $1500.00
account.withdraw(200)
print(account)  # Alice: $1300.00
\`\`\`

## Another Example: Shape Hierarchy

\`\`\`python
class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

shapes = [Circle(5), Rectangle(4, 6)]
for shape in shapes:
    print(f"Area: {shape.area():.2f}")
\`\`\`

## Best Practices

1. **Single Responsibility**: Each class should have one purpose
2. **DRY (Don't Repeat Yourself)**: Use inheritance for shared code
3. **Encapsulation**: Hide internal details with private attributes
4. **Use Properties**: For computed or controlled attributes
5. **Document Classes**: Include docstrings
6. **Name Classes**: Use descriptive, singular names
7. **Test Classes**: Write unit tests for your classes

## Summary

OOP organizes code into classes that combine data and behavior. Classes define the structure, and instances are individual objects. The \`__init__\` method initializes instances, while methods define behavior. Inheritance allows code reuse through class hierarchies. Magic methods like \`__str__\` and \`__repr__\` customize object representation. Properties using \`@property\` enable computed attributes. Class variables are shared across instances.`,r=[{question:"What does the `__init__` method do?",options:[`A. Defines the class structure`,`B. Initializes new instances`,`C. Deletes instances`,`D. Defines methods`],correct:1},{question:"What is the purpose of `self` in methods?",options:[`A. Define static methods`,`B. Access the current instance`,`C. Access class variables`,`D. Return values`],correct:1},{question:`Which keyword allows inheriting from another class?`,options:[`A. extends`,`B. inherits`,`C. parentheses after class name`,`D. super`],correct:2},{question:"What does the `@property` decorator do?",options:[`A. Creates a private method`,`B. Creates a computed attribute accessed like a property`,`C. Defines a class variable`,`D. Makes a method static`],correct:1}],i=[{front:`What does the __init__ method do?`,back:`__init__ is a constructor that initializes new instances of a class. It runs automatically when you create an object. Example: def __init__(self, name): self.name = name`},{front:`What is the purpose of self in methods?`,back:`self refers to the current instance and must be the first parameter in methods. It allows access to instance attributes. Example: self.name accesses the name attribute of the current object.`},{front:`How do you define inheritance?`,back:`Put the parent class name in parentheses after the class name: class Dog(Animal):. The child class inherits attributes and methods from the parent.`},{front:`What does the super() function do?`,back:`super() calls methods from the parent class. Common use: super().__init__() calls parent's constructor. Allows child classes to extend parent behavior without rewriting it.`},{front:`What does the @property decorator do?`,back:`@property allows you to define a method that's accessed like an attribute (without parentheses). Example: @property def area(self): return self.width * self.height`},{front:`What's the difference between __str__ and __repr__?`,back:`__str__ defines how str() displays the object (user-friendly). __repr__ defines the official representation (for developers). Example: print(obj) uses __str__, repr(obj) uses __repr__.`},{front:`What is the raise keyword used for?`,back:`raise is used to raise (throw) an exception. Example: if age < 0: raise ValueError('Age cannot be negative'). This signals that something went wrong.`},{front:`What's the difference between instance and class variables?`,back:`Instance variables are specific to each object (defined in __init__). Class variables are shared by all instances. Example: count = 0 (class), self.name = name (instance).`}],a="Week 8 introduced Object-Oriented Programming (OOP) for organizing code into classes and objects. Classes define structures with attributes and methods, using `__init__` for initialization. Inheritance enables code reuse through class hierarchies using parent and child classes. Magic methods (`__str__`, `__repr__`) customize object representation. The `@property` decorator creates computed attributes. Class variables are shared across instances, while instance variables are specific to each object.",o={title:e,source:t,content:n,quiz:r,flashcards:i,summary:a};export{n as content,o as default,i as flashcards,r as quiz,t as source,a as summary,e as title};