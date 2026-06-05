var e=`Week 9 — Et Cetera`,t=`CS50P 2022 — Lecture 9`,n=`# Et Cetera: Advanced Python Concepts

## Introduction

This week covers miscellaneous advanced topics that enhance Python programming: sets, comprehensions, lambda functions, type hints, and more.

## Sets

A set is an unordered collection of unique elements:

\`\`\`python
fruits = {"apple", "banana", "orange"}
print(len(fruits))  # 3
print("apple" in fruits)  # True
\`\`\`

### Set Operations

\`\`\`python
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

print(set1 & set2)      # {3, 4} - intersection
print(set1 | set2)      # {1, 2, 3, 4, 5, 6} - union
print(set1 - set2)      # {1, 2} - difference
print(set1 ^ set2)      # {1, 2, 5, 6} - symmetric difference
\`\`\`

### Set Methods

\`\`\`python
fruits = {"apple", "banana"}
fruits.add("orange")
fruits.remove("apple")
fruits.discard("grape")  # No error if not present
print(fruits)  # {"banana", "orange"}
\`\`\`

## Frozensets

Immutable sets that cannot be modified:

\`\`\`python
frozen = frozenset([1, 2, 3, 2, 1])
print(frozen)  # frozenset({1, 2, 3})
# frozen.add(4)  # Error: frozenset has no add method
\`\`\`

## Global Variables

Variables defined outside functions have global scope:

\`\`\`python
counter = 0  # Global variable

def increment():
    global counter
    counter += 1

increment()
print(counter)  # 1
\`\`\`

Use \`global\` keyword to modify global variables inside functions.

## Constants

By convention, constants are written in ALL_CAPS:

\`\`\`python
PI = 3.14159
MAX_SIZE = 100
DEFAULT_COLOR = "blue"
\`\`\`

They're not truly immutable in Python, but the convention signals they shouldn't be changed.

## Lambda Functions

Anonymous functions for simple, one-line operations:

\`\`\`python
square = lambda x: x ** 2
print(square(5))  # 25

add = lambda x, y: x + y
print(add(3, 4))  # 7
\`\`\`

Useful with functions like \`map()\` and \`filter()\`:

\`\`\`python
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]
\`\`\`

## List Comprehensions

Concise syntax for creating lists:

\`\`\`python
# Traditional way
numbers = []
for i in range(5):
    numbers.append(i ** 2)

# List comprehension
numbers = [i ** 2 for i in range(5)]
print(numbers)  # [0, 1, 4, 9, 16]
\`\`\`

With conditions:

\`\`\`python
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]
\`\`\`

Nested comprehensions:

\`\`\`python
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(matrix)  # [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
\`\`\`

## Dictionary Comprehensions

Create dictionaries efficiently:

\`\`\`python
numbers = [1, 2, 3, 4, 5]
squares = {x: x ** 2 for x in numbers}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
\`\`\`

With conditions:

\`\`\`python
words = ["apple", "banana", "cherry", "date"]
word_lengths = {word: len(word) for word in words if len(word) > 5}
print(word_lengths)  # {"banana": 6, "cherry": 6}
\`\`\`

## Type Hints

Annotate variable and function types for clarity and tooling:

\`\`\`python
def add(x: int, y: int) -> int:
    return x + y

def greet(name: str) -> str:
    return f"Hello, {name}!"

def process_list(items: list[int]) -> int:
    return sum(items)
\`\`\`

Type hints don't enforce types at runtime but help with code clarity and IDE support.

## Docstrings

Document functions and classes with docstrings:

\`\`\`python
def calculate_area(radius: float) -> float:
    """Calculate the area of a circle.
    
    Args:
        radius: The radius of the circle.
    
    Returns:
        The area of the circle.
    """
    return 3.14159 * radius ** 2
\`\`\`

Access docstrings:

\`\`\`python
print(calculate_area.__doc__)
\`\`\`

## argparse Module

Parse command-line arguments:

\`\`\`python
import argparse

parser = argparse.ArgumentParser(description="Calculate area of a circle")
parser.add_argument("radius", type=float, help="Radius of the circle")
parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")

args = parser.parse_args()
area = 3.14159 * args.radius ** 2

if args.verbose:
    print(f"Circle with radius {args.radius} has area {area}")
else:
    print(area)
\`\`\`

## Unpacking

Unpack sequences into variables:

\`\`\`python
coordinates = (3, 4)
x, y = coordinates
print(x, y)  # 3 4

a, *rest = [1, 2, 3, 4]
print(a)     # 1
print(rest)  # [2, 3, 4]
\`\`\`

## Generators

Generators yield values one at a time:

\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for i in countdown(5):
    print(i)  # 5, 4, 3, 2, 1
\`\`\`

Generators are memory-efficient for large sequences.

## Set and Dictionary Comprehensions Summary

\`\`\`python
# Set comprehension
unique_squares = {x ** 2 for x in [1, 2, 3, 3, 2, 1]}
print(unique_squares)  # {1, 4, 9}

# Dictionary comprehension
word_count = {word: len(word) for word in ["hello", "world"]}
print(word_count)  # {"hello": 5, "world": 5}
\`\`\`

## Practical Example: Data Processing

\`\`\`python
import argparse
from typing import List

def process_numbers(numbers: List[int]) -> dict:
    """Process a list of numbers and return statistics.
    
    Args:
        numbers: List of integers to process.
    
    Returns:
        Dictionary with statistics.
    """
    return {
        "count": len(numbers),
        "sum": sum(numbers),
        "average": sum(numbers) / len(numbers),
        "evens": [x for x in numbers if x % 2 == 0],
        "unique": set(numbers)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("numbers", type=int, nargs="+", help="Numbers to process")
    args = parser.parse_args()
    
    stats = process_numbers(args.numbers)
    print(f"Count: {stats['count']}")
    print(f"Sum: {stats['sum']}")
    print(f"Average: {stats['average']:.2f}")
\`\`\`

## Best Practices

1. **Use Sets for Uniqueness**: When you need unique elements
2. **Use Comprehensions**: More Pythonic than loops for transformations
3. **Type Hints Help**: Especially in teams and complex code
4. **Document Thoroughly**: Docstrings help future maintainers
5. **Use Generators**: For large sequences to save memory
6. **Follow PEP 8**: Adhere to Python style guidelines

## Summary

Advanced Python concepts include sets for unique collections and frozensets for immutability. Global variables and constants organize program state. Lambda functions provide inline anonymous functions. List/dict comprehensions offer concise syntax for transformations. Type hints document expected types. Docstrings explain functions and classes. The argparse module handles command-line arguments. Unpacking assigns sequences to variables. Generators yield values efficiently. These tools make Python code more concise and maintainable.`,r=[{question:`What is the difference between a set and a frozenset?`,options:[`A. No difference`,`B. Sets are mutable, frozensets are immutable`,`C. Sets store tuples, frozensets store lists`,`D. Frozensets are faster`],correct:1},{question:`What does a list comprehension do?`,options:[`A. Compresses lists`,`B. Creates a list using concise syntax`,`C. Counts items in a list`,`D. Sorts a list`],correct:1},{question:`What is a lambda function?`,options:[`A. A class method`,`B. An anonymous one-line function`,`C. A type of variable`,`D. A built-in error`],correct:1},{question:`What keyword allows modifying global variables inside a function?`,options:[`A. extern`,`B. public`,`C. global`,`D. nonlocal`],correct:2}],i=`Week 9 covered advanced Python concepts: sets for unique collections and frozensets for immutability, global variables and constants for program state, lambda functions for inline anonymous operations, list and dictionary comprehensions for concise transformations, type hints for documenting expected types, docstrings for documentation, argparse for command-line parsing, unpacking for assigning sequences, and generators for memory-efficient iteration. These tools enable more expressive and maintainable Python code.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};