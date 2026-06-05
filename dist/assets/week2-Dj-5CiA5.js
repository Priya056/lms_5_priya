var e=`Week 2 — Loops`,t=`CS50P 2022 — Lecture 2`,n=`# Loops: Repetition in Code

## Introduction

Loops allow you to execute a block of code multiple times without writing it repeatedly. They are essential for processing collections of data and handling repetitive tasks efficiently.

## While Loops

A \`while\` loop repeats as long as a condition is \`True\`:

\`\`\`python
i = 0
while i < 5:
    print(i)
    i += 1
\`\`\`

Output:
\`\`\`
0
1
2
3
4
\`\`\`

### Important: Avoiding Infinite Loops

Make sure the condition eventually becomes \`False\`, or your program will loop forever:

\`\`\`python
# This is an infinite loop - don't run it!
# while True:
#     print("This will run forever")
\`\`\`

## For Loops

A \`for\` loop iterates over a sequence (like a list or range):

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

Output:
\`\`\`
0
1
2
3
4
\`\`\`

## The range() Function

The \`range()\` function generates a sequence of numbers:

**range(stop)** - Starts from 0 to stop-1:
\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4
\`\`\`

**range(start, stop)** - From start to stop-1:
\`\`\`python
for i in range(2, 5):
    print(i)  # 2, 3, 4
\`\`\`

**range(start, stop, step)** - With a step value:
\`\`\`python
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
\`\`\`

## Lists

A list is a collection of items in a specific order, enclosed in square brackets:

\`\`\`python
fruits = ["apple", "banana", "orange", "grape"]
print(fruits[0])      # apple
print(fruits[-1])     # grape (last item)
print(len(fruits))    # 4
\`\`\`

### Iterating Through Lists

\`\`\`python
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)
\`\`\`

You can also use the index:

\`\`\`python
for i in range(len(fruits)):
    print(fruits[i])
\`\`\`

## List Methods

### append()

Add an item to the end of a list:

\`\`\`python
fruits = ["apple", "banana"]
fruits.append("orange")
print(fruits)  # ["apple", "banana", "orange"]
\`\`\`

### pop()

Remove and return an item (default: last item):

\`\`\`python
fruits = ["apple", "banana", "orange"]
last = fruits.pop()
print(last)     # orange
print(fruits)   # ["apple", "banana"]
\`\`\`

### insert()

Insert an item at a specific position:

\`\`\`python
fruits = ["apple", "orange"]
fruits.insert(1, "banana")
print(fruits)  # ["apple", "banana", "orange"]
\`\`\`

### remove()

Remove the first occurrence of a value:

\`\`\`python
fruits = ["apple", "banana", "orange"]
fruits.remove("banana")
print(fruits)  # ["apple", "orange"]
\`\`\`

### sort()

Sort a list in place:

\`\`\`python
numbers = [3, 1, 4, 1, 5]
numbers.sort()
print(numbers)  # [1, 1, 3, 4, 5]
\`\`\`

## break and continue

### break

Exit the loop immediately:

\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4
\`\`\`

### continue

Skip the current iteration and move to the next:

\`\`\`python
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
\`\`\`

## enumerate()

The \`enumerate()\` function gives you both the index and value:

\`\`\`python
fruits = ["apple", "banana", "orange"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
\`\`\`

Output:
\`\`\`
0: apple
1: banana
2: orange
\`\`\`

You can start the index from any number:

\`\`\`python
for index, fruit in enumerate(fruits, start=1):
    print(f"{index}: {fruit}")
\`\`\`

Output:
\`\`\`
1: apple
2: banana
3: orange
\`\`\`

## Nested Loops

You can put loops inside loops:

\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})", end=" ")
    print()  # New line
\`\`\`

Output:
\`\`\`
(0, 0) (0, 1) (0, 2) 
(1, 0) (1, 1) (1, 2) 
(2, 0) (2, 1) (2, 2) 
\`\`\`

## Practical Example: Shopping List

\`\`\`python
shopping_list = []

while True:
    action = input("(A)dd, (R)emove, (S)how, (Q)uit: ").upper()
    
    if action == "A":
        item = input("Item to add: ")
        shopping_list.append(item)
    elif action == "R":
        if shopping_list:
            print("Items:", shopping_list)
            item = input("Item to remove: ")
            shopping_list.remove(item)
    elif action == "S":
        for i, item in enumerate(shopping_list, start=1):
            print(f"{i}. {item}")
    elif action == "Q":
        break
    else:
        print("Invalid action")
\`\`\`

## Summary

Loops enable repetitive code execution. \`while\` loops repeat based on a condition, while \`for\` loops iterate through sequences. Lists store multiple values, with useful methods like append(), pop(), and sort(). The \`enumerate()\` function provides both index and value during iteration, and \`break\`/\`continue\` control loop flow.`,r=[{question:"How many times will this loop execute? `for i in range(5):`",options:[`A. 4 times`,`B. 5 times`,`C. 6 times`,`D. Infinite times`],correct:1},{question:"What does `fruits.pop()` do?",options:[`A. Adds an item to the list`,`B. Removes the first item`,`C. Removes and returns the last item`,`D. Prints the list`],correct:2},{question:"What will `list(range(1, 5, 2))` produce?",options:[`A. [1, 2, 3, 4, 5]`,`B. [1, 3]`,`C. [1, 3, 5]`,`D. [0, 2, 4]`],correct:2},{question:`In the enumerate() function, what is returned?`,options:[`A. Only the index`,`B. Only the value`,`C. Both index and value as a tuple`,`D. Neither index nor value`],correct:2}],i="Week 2 introduced loops for repetition: `while` loops that continue based on conditions, and `for` loops that iterate through sequences. You learned the `range()` function for generating number sequences, list data structures with methods (append, pop, insert, remove, sort), and control statements (break, continue). The `enumerate()` function enables access to both index and value during iteration.",a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};