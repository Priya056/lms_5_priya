var e=`Week 0 — Functions, Variables`,t=`CS50P 2022 — Lecture 0`,n=`# Functions, Variables, and Basic Data Types

## Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability. It emphasizes code clarity and allows you to write programs with fewer lines of code compared to other languages like C or Java.

## Functions

Functions are reusable blocks of code that perform specific tasks. They help organize code, reduce repetition, and make programs easier to maintain and test.

### Defining Functions

To define a function in Python, use the \`def\` keyword followed by the function name and parentheses:

\`\`\`python
def greet():
    print("Hello, World!")

greet()  # Call the function
\`\`\`

### Functions with Arguments

Functions can accept arguments (parameters) that allow you to pass data into them:

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Output: Hello, Alice!
greet("Bob")    # Output: Hello, Bob!
\`\`\`

You can have multiple arguments:

\`\`\`python
def add(x, y):
    print(x + y)

add(5, 3)  # Output: 8
\`\`\`

### Return Values

Functions can return values using the \`return\` keyword:

\`\`\`python
def add(x, y):
    return x + y

result = add(5, 3)
print(result)  # Output: 8
\`\`\`

The \`return\` statement stops the function execution and sends the result back to the caller.

## Variables

Variables are containers for storing data values. In Python, you don't need to declare the type of a variable—Python infers it automatically.

\`\`\`python
name = "Alice"
age = 30
gpa = 3.9
is_student = True
\`\`\`

## Data Types

### String (str)

Strings represent text and are enclosed in single or double quotes:

\`\`\`python
message = "Hello, World!"
greeting = 'How are you?'
\`\`\`

### Integer (int)

Integers are whole numbers without decimal points:

\`\`\`python
age = 25
count = -10
zero = 0
\`\`\`

### Float

Floats represent decimal numbers:

\`\`\`python
height = 5.9
pi = 3.14159
\`\`\`

### Boolean (bool)

Booleans represent \`True\` or \`False\` values:

\`\`\`python
is_active = True
is_admin = False
\`\`\`

## Built-in Functions

### print()

The \`print()\` function outputs text to the console:

\`\`\`python
print("Hello, World!")
print(5)
print(3.14)
\`\`\`

### input()

The \`input()\` function reads text from the user:

\`\`\`python
name = input("What is your name? ")
print(f"Hello, {name}!")
\`\`\`

Note: \`input()\` always returns a string, even if the user enters numbers.

### Type Conversion Functions

**str()** - Convert to string:

\`\`\`python
num = 42
text = str(num)  # "42"
\`\`\`

**int()** - Convert to integer:

\`\`\`python
text = "42"
num = int(text)  # 42
\`\`\`

**float()** - Convert to float:

\`\`\`python
text = "3.14"
num = float(text)  # 3.14
\`\`\`

### type()

The \`type()\` function tells you the data type of a variable:

\`\`\`python
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("hello"))   # <class 'str'>
print(type(True))      # <class 'bool'>
\`\`\`

## F-Strings (Formatted String Literals)

F-strings allow you to embed expressions inside strings for cleaner formatting:

\`\`\`python
name = "Alice"
age = 30
print(f"My name is {name} and I am {age} years old.")

x = 10
y = 20
print(f"The sum of {x} and {y} is {x + y}")
\`\`\`

F-strings are more readable and efficient than older string formatting methods.

## Comments

Comments are notes in your code that Python ignores. Use \`#\` for single-line comments:

\`\`\`python
# This is a comment
name = "Alice"  # Assign a name

# For multiple lines, use multiple # symbols
# or use triple quotes for documentation
"""
This is a multi-line comment or docstring.
It can span multiple lines and is often used
to document functions and modules.
"""
\`\`\`

## Complete Example

Here's a complete program that uses functions, variables, and user input:

\`\`\`python
def calculate_greeting(name, age):
    """Return a greeting with the person's name and age."""
    return f"Hello, {name}! You are {age} years old."

# Get user input
user_name = input("Enter your name: ")
user_age = input("Enter your age: ")

# Convert age to integer
user_age = int(user_age)

# Call function and display result
greeting = calculate_greeting(user_name, user_age)
print(greeting)
\`\`\`

## Summary

In this week, you learned the fundamentals of Python:
- How to define and call functions
- How to use variables to store data
- The basic data types: strings, integers, floats, and booleans
- How to use built-in functions like \`print()\`, \`input()\`, and type conversion functions
- How to use f-strings for clean string formatting
- How to write comments to document your code

These concepts form the foundation for all Python programming you'll do.`,r=[{question:"What does the `return` keyword do in a function?",options:[`A. Stops the program`,`B. Sends a value back to the caller`,`C. Prints output to the console`,`D. Loops through the function`],correct:1},{question:"What is the data type of the result of `input()`?",options:[`A. Integer`,`B. Float`,`C. String`,`D. Boolean`],correct:2},{question:`Which function converts a string to an integer?`,options:[`A. str()`,`B. float()`,`C. int()`,`D. type()`],correct:2},{question:"What will `print(type(3.14))` output?",options:[`A. <class 'int'>`,`B. <class 'float'>`,`C. <class 'str'>`,`D. float`],correct:1}],i=`Week 0 introduced the basics of Python programming: defining functions with arguments and return values, using variables to store data, understanding core data types (str, int, float, bool), and using built-in functions like print(), input(), and type conversion. F-strings provide elegant string formatting, and comments help document code for readability.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};