var e=`Week 3 — Exceptions`,t=`CS50P 2022 — Lecture 3`,n=`# Exceptions: Handling Errors Gracefully

## Introduction

Exceptions are errors that occur during program execution. Instead of letting your program crash, you can handle exceptions gracefully to provide better user experiences and recover from errors.

## Common Exception Types

### ValueError

Raised when a function receives an argument of the correct type but inappropriate value:

\`\`\`python
num = int("not a number")  # ValueError
\`\`\`

### TypeError

Raised when an operation or function is applied to an object of the wrong type:

\`\`\`python
result = "5" + 5  # TypeError
\`\`\`

### ZeroDivisionError

Raised when attempting to divide by zero:

\`\`\`python
result = 10 / 0  # ZeroDivisionError
\`\`\`

### IndexError

Raised when trying to access an index that doesn't exist:

\`\`\`python
fruits = ["apple", "banana"]
print(fruits[10])  # IndexError
\`\`\`

### KeyError

Raised when trying to access a dictionary key that doesn't exist:

\`\`\`python
person = {"name": "Alice"}
print(person["age"])  # KeyError
\`\`\`

## The try-except Block

Use \`try-except\` to catch and handle exceptions:

\`\`\`python
try:
    x = int(input("Enter a number: "))
    print(x / 2)
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
\`\`\`

You can have multiple \`except\` blocks for different exception types.

## Catching All Exceptions

You can catch any exception using a bare \`except\` clause:

\`\`\`python
try:
    x = int(input("Enter a number: "))
    print(x / 2)
except:
    print("An error occurred!")
\`\`\`

However, it's better practice to catch specific exceptions when possible.

## The else Clause

The \`else\` block runs if no exception occurs:

\`\`\`python
try:
    x = int(input("Enter a number: "))
except ValueError:
    print("That's not a valid number!")
else:
    print(f"You entered: {x}")
\`\`\`

## The finally Clause

The \`finally\` block runs regardless of whether an exception occurred:

\`\`\`python
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found!")
finally:
    file.close()  # Always executed
\`\`\`

This is useful for cleanup operations.

## The pass Statement

The \`pass\` statement does nothing; it's a placeholder:

\`\`\`python
try:
    x = int(input("Enter a number: "))
except ValueError:
    pass  # Silently ignore the error
\`\`\`

Use \`pass\` when you want to catch an exception but don't want to take any action.

## Raising Exceptions

You can raise exceptions manually using the \`raise\` keyword:

\`\`\`python
def divide(x, y):
    if y == 0:
        raise ZeroDivisionError("Cannot divide by zero!")
    return x / y

try:
    result = divide(10, 0)
except ZeroDivisionError as e:
    print(f"Error: {e}")
\`\`\`

### Raising Custom Exceptions

\`\`\`python
age = int(input("Enter your age: "))
if age < 0:
    raise ValueError("Age cannot be negative")
\`\`\`

## The as Keyword

Capture the exception object for more details:

\`\`\`python
try:
    x = int("not a number")
except ValueError as e:
    print(f"Error: {e}")
\`\`\`

The exception object can contain useful information about what went wrong.

## Practical Example: Safe Input

Here's a function that safely gets an integer from the user:

\`\`\`python
def get_positive_integer():
    while True:
        try:
            num = int(input("Enter a positive integer: "))
            if num <= 0:
                raise ValueError("Number must be positive")
            return num
        except ValueError as e:
            print(f"Invalid input: {e}. Try again.")

number = get_positive_integer()
print(f"You entered: {number}")
\`\`\`

## Another Example: Safe Division

\`\`\`python
def safe_divide(x, y):
    try:
        result = x / y
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    except TypeError:
        print("Error: Arguments must be numbers")
        return None
    finally:
        print("Division operation completed")

print(safe_divide(10, 2))  # 5.0
print(safe_divide(10, 0))  # Error message
\`\`\`

## Best Practices

1. **Be Specific**: Catch specific exceptions, not generic ones
2. **Use else**: Execute code that depends on the try block only in the else
3. **Use finally**: Cleanup resources in the finally block
4. **Provide Context**: Include helpful error messages
5. **Don't Swallow Errors**: Avoid silent failures with bare except
6. **Raise Meaningful Errors**: When raising exceptions, provide clear messages

## Summary

Exceptions are errors that occur during program execution. Using \`try-except\` blocks allows you to catch and handle specific exceptions gracefully. The \`else\` clause runs when no exception occurs, and \`finally\` ensures cleanup code always runs. You can raise custom exceptions and capture exception objects with \`as\` for detailed error information.`,r=[{question:"What type of exception is raised by `int('abc')`?",options:[`A. TypeError`,`B. ValueError`,`C. SyntaxError`,`D. NameError`],correct:1},{question:`Which block always executes regardless of exceptions?`,options:[`A. try`,`B. except`,`C. else`,`D. finally`],correct:3},{question:"What does the `pass` statement do?",options:[`A. Exits the program`,`B. Skips the current iteration`,`C. Does nothing (placeholder)`,`D. Passes an exception to the caller`],correct:2},{question:"How do you capture exception information with the `as` keyword?",options:[`A. except ValueError as e:`,`B. except (ValueError) as e:`,`C. except ValueError e:`,`D. catch ValueError as e:`],correct:0}],i=[{front:`What exception does int('abc') raise?`,back:`ValueError. This occurs when a function receives an argument of the correct type (string) but an inappropriate value (non-numeric).`},{front:`What is the purpose of a try-except block?`,back:`try-except allows you to handle errors gracefully. Code in try executes, and if an exception occurs, except catches it instead of crashing the program.`},{front:`What is the difference between except and finally?`,back:`except runs only if an exception occurs. finally always runs regardless of whether an exception occurred. Use finally for cleanup operations.`},{front:`What does the else clause do in exception handling?`,back:`else runs only if no exception occurred in the try block. Useful for code that depends on the try block succeeding.`},{front:`What is the pass statement used for?`,back:`pass is a placeholder that does nothing. Used when you catch an exception but want to ignore it silently. Example: except ValueError: pass`},{front:`How do you raise an exception manually?`,back:`Use the raise keyword followed by the exception. Example: raise ValueError('Age cannot be negative'). You can raise built-in or custom exceptions.`},{front:`What does the as keyword do in exception handling?`,back:`as captures the exception object for use in your code. Example: except ValueError as e: allows you to access error details via the variable e.`}],a=`Week 3 covered exception handling using try-except blocks to catch and handle errors gracefully. You learned about common exception types (ValueError, TypeError, ZeroDivisionError), using else for code that depends on the try block, finally for cleanup, and raising custom exceptions. Best practices include being specific about exceptions and providing helpful error messages.`,o={title:e,source:t,content:n,quiz:r,flashcards:i,summary:a};export{n as content,o as default,i as flashcards,r as quiz,t as source,a as summary,e as title};