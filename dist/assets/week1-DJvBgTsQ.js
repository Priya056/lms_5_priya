var e=`Week 1 — Conditionals`,t=`CS50P 2022 — Lecture 1`,n=`# Conditionals: Making Decisions in Code

## Introduction

Conditionals allow your program to make decisions and execute different code based on different conditions. They are fundamental to creating dynamic programs that respond to different inputs and situations.

## Boolean Expressions

Boolean expressions evaluate to either \`True\` or \`False\`. They form the basis of conditional logic.

### Comparison Operators

Comparison operators compare two values:

**Equal to (\`==\`)**
\`\`\`python
5 == 5      # True
5 == 3      # False
\`\`\`

**Not equal to (\`!=\`)**
\`\`\`python
5 != 3      # True
5 != 5      # False
\`\`\`

**Less than (\`<\`)**
\`\`\`python
3 < 5       # True
5 < 3       # False
\`\`\`

**Greater than (\`>\`)**
\`\`\`python
5 > 3       # True
3 > 5       # False
\`\`\`

**Less than or equal to (\`<=\`)**
\`\`\`python
5 <= 5      # True
5 <= 3      # False
\`\`\`

**Greater than or equal to (\`>=\`)**
\`\`\`python
5 >= 5      # True
5 >= 3      # True
\`\`\`

## The if Statement

The \`if\` statement executes a block of code if a condition is \`True\`:

\`\`\`python
age = 18
if age >= 18:
    print("You are an adult")
\`\`\`

Indentation matters! Code inside the \`if\` block must be indented.

## The if-else Statement

The \`else\` clause executes if the \`if\` condition is \`False\`:

\`\`\`python
age = 15
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
\`\`\`

## The if-elif-else Statement

Use \`elif\` (else if) for multiple conditions:

\`\`\`python
age = 13
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
elif age >= 5:
    print("Child")
else:
    print("Toddler")
\`\`\`

Python checks conditions top to bottom and stops at the first \`True\` condition.

## Boolean Operators

### and

Both conditions must be \`True\`:

\`\`\`python
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive")
\`\`\`

### or

At least one condition must be \`True\`:

\`\`\`python
day = "Saturday"

if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")
\`\`\`

### not

Reverses the boolean value:

\`\`\`python
raining = False

if not raining:
    print("Let's go outside")
\`\`\`

## Truthiness and Falsiness

In Python, certain values are considered "truthy" or "falsy" in boolean contexts:

**Falsy values:**
- \`False\`
- \`0\` (and \`0.0\`)
- Empty strings (\`""\`)
- Empty collections (empty lists, dictionaries, etc.)
- \`None\`

**Truthy values:**
- \`True\`
- Any non-zero number
- Non-empty strings
- Non-empty collections

Example:
\`\`\`python
name = ""

if name:
    print(f"Hello, {name}")
else:
    print("No name provided")  # This executes
\`\`\`

## Match Statements (Python 3.10+)

The \`match\` statement provides a cleaner way to handle multiple cases:

\`\`\`python
day = input("Enter a day: ")

match day:
    case "Monday":
        print("Start of the work week")
    case "Friday":
        print("Almost the weekend!")
    case "Saturday" | "Sunday":
        print("It's the weekend!")
    case _:
        print("Unknown day")
\`\`\`

The underscore \`_\` acts as a catch-all (default case).

## Nested Conditionals

You can nest conditionals inside other conditionals:

\`\`\`python
age = 25
has_license = True
has_insurance = True

if age >= 18:
    if has_license:
        if has_insurance:
            print("You can drive legally")
        else:
            print("Get insurance first")
    else:
        print("You need a license")
else:
    print("You're too young to drive")
\`\`\`

## Practical Example

Here's a program that determines a student's grade based on their score:

\`\`\`python
score = int(input("Enter your score: "))

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")

# Additional feedback
if grade in ["A", "B"]:
    print("Great job!")
elif grade in ["C", "D"]:
    print("You passed, but you can do better")
else:
    print("Please see your instructor")
\`\`\`

## Best Practices

1. Use clear, meaningful variable names
2. Keep conditions simple and readable
3. Use logical operators to combine conditions
4. Avoid deeply nested conditionals (refactor if needed)
5. Test all possible paths through your code

## Summary

Conditionals enable decision-making in programs through \`if\`, \`elif\`, and \`else\` statements. Boolean operators (\`and\`, \`or\`, \`not\`) allow combining conditions. Understanding truthiness/falsiness and modern \`match\` statements makes code more expressive and maintainable.`,r=[{question:"What is the output of: `if 5 >= 5: print('Yes') else: print('No')`?",options:[`A. Yes`,`B. No`,`C. Error`,`D. No output`],correct:0},{question:`Which of the following is a falsy value in Python?`,options:[`A. 1`,`B. "hello"`,`C. 0`,`D. True`],correct:2},{question:"What does the `and` operator require to return True?",options:[`A. Both conditions to be True`,`B. At least one condition to be True`,`C. The first condition to be True`,`D. The second condition to be False`],correct:0},{question:"In a match statement, what does the underscore `_` represent?",options:[`A. A variable name`,`B. A catch-all or default case`,`C. An optional case`,`D. No specific meaning`],correct:1}],i=[{front:`What is the difference between = and ==?`,back:`= is assignment (sets a variable to a value). == is comparison (checks if two values are equal). Example: x = 5 sets x. x == 5 checks if x equals 5.`},{front:`What does the and operator require to return True?`,back:`Both conditions must be True. Example: if age >= 18 and has_license: only executes if both conditions are True.`},{front:`What does the or operator require to return True?`,back:`At least one condition must be True. Example: if day == 'Saturday' or day == 'Sunday': executes if either condition is True.`},{front:`What is a falsy value in Python?`,back:`Values that evaluate to False in boolean contexts: False, 0, 0.0, empty string '', empty list [], empty dict {}, and None.`},{front:`What does not do?`,back:`The not operator reverses a boolean value. Example: not True returns False, not False returns True. Useful for negating conditions.`},{front:`What is the purpose of elif in conditionals?`,back:`elif (else if) allows you to check multiple conditions. Python evaluates them top to bottom and executes only the first True block.`},{front:`Explain a match statement with an example.`,back:`match compares a value against multiple cases. Example: match day: case 'Monday': ... The _ acts as a default case (catch-all).`},{front:`What is the difference between if-elif-else and match?`,back:`Both check conditions, but match is cleaner for comparing one value against many options. match is available in Python 3.10+.`}],a=`Week 1 covered conditionals using comparison operators (==, !=, <, >, <=, >=), boolean operators (and, or, not), and control flow statements (if, elif, else). You also learned about truthiness/falsiness in Python and the modern match statement for pattern matching. These tools enable programs to make decisions based on conditions.`,o={title:e,source:t,content:n,quiz:r,flashcards:i,summary:a};export{n as content,o as default,i as flashcards,r as quiz,t as source,a as summary,e as title};