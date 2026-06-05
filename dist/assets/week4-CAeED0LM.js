var e=`Week 4 — Libraries`,t=`CS50P 2022 — Lecture 4`,n=`# Libraries: Extending Python's Capabilities

## Introduction

Libraries (also called modules) are collections of code written by others that you can use in your programs. Python comes with a standard library and thousands of third-party libraries available through package managers.

## Importing Modules

### Basic Import

Import an entire module:

\`\`\`python
import random
print(random.randint(1, 10))
\`\`\`

### From Import

Import specific items from a module:

\`\`\`python
from random import randint
print(randint(1, 10))
\`\`\`

### Aliasing

Give a module or item an alias:

\`\`\`python
import random as rnd
print(rnd.randint(1, 10))

from datetime import datetime as dt
now = dt.now()
\`\`\`

## The Standard Library

Python's standard library includes many useful modules.

### random

Generate random numbers and perform random operations:

\`\`\`python
import random

# Random integer in range
num = random.randint(1, 100)

# Random choice from a list
color = random.choice(["red", "green", "blue"])

# Random float between 0 and 1
value = random.random()

# Shuffle a list in place
cards = [1, 2, 3, 4, 5]
random.shuffle(cards)
\`\`\`

### sys

Access system-specific parameters and functions:

\`\`\`python
import sys

print(sys.argv)  # Command-line arguments
print(sys.version)  # Python version
sys.exit(0)  # Exit the program
\`\`\`

### statistics

Calculate statistical measures:

\`\`\`python
from statistics import mean, median, mode

scores = [85, 90, 92, 88, 90]
print(mean(scores))     # 89.0
print(median(scores))   # 90
print(mode(scores))     # 90
\`\`\`

### datetime

Work with dates and times:

\`\`\`python
from datetime import datetime, timedelta

# Current date and time
now = datetime.now()
print(now)  # 2024-06-03 14:30:00.123456

# Specific date
birthday = datetime(1990, 5, 15)

# Time differences
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)
\`\`\`

## Third-Party Libraries

Install third-party libraries using \`pip\` (Python package installer):

\`\`\`bash
pip install cowsay
pip install emoji
pip install requests
\`\`\`

### cowsay

Display text in a fun ASCII art cow:

\`\`\`python
import cowsay

cowsay.cow("Hello, World!")
\`\`\`

### emoji

Work with emojis:

\`\`\`python
import emoji

print(emoji.emojize(":thumbs_up:"))  # 👍
print(emoji.emojize(":rocket:"))     # 🚀
\`\`\`

### requests

Make HTTP requests to web APIs:

\`\`\`python
import requests

response = requests.get("https://api.github.com/users/github")
if response.status_code == 200:
    data = response.json()
    print(data["name"])  # GitHub
else:
    print("Error:", response.status_code)
\`\`\`

## Practical Example: Quote of the Day

\`\`\`python
import requests
import json
from datetime import datetime

def get_quote():
    try:
        response = requests.get("https://api.quotable.io/random")
        response.raise_for_status()
        quote = response.json()
        print(f'\\n"{quote["content"]}"')
        print(f"— {quote["author"]}\\n")
    except requests.RequestException:
        print("Unable to fetch quote")

get_quote()
\`\`\`

## Another Example: Random Event Generator

\`\`\`python
import random
from datetime import datetime, timedelta

def random_event():
    events = [
        "A solar eclipse",
        "A meteor shower",
        "Aurora borealis",
        "A lunar eclipse",
        "A comet sighting"
    ]
    
    event = random.choice(events)
    days_away = random.randint(1, 365)
    date = datetime.now() + timedelta(days=days_away)
    
    return f"{event} will occur on {date.strftime('%B %d, %Y')}"

print(random_event())
\`\`\`

## Creating Your Own Modules

You can create your own modules as Python files:

**math_utils.py**
\`\`\`python
def add(x, y):
    return x + y

def multiply(x, y):
    return x * y

PI = 3.14159
\`\`\`

**main.py**
\`\`\`python
import math_utils

result = math_utils.add(5, 3)
print(result)  # 8
print(math_utils.PI)  # 3.14159
\`\`\`

## Best Practices

1. **Import at the Top**: Place all import statements at the beginning of your file
2. **Be Specific**: Use \`from X import Y\` when you only need specific items
3. **Avoid Circular Imports**: Don't create modules that import each other
4. **Use Aliases Sparingly**: Only alias when the name is very long or ambiguous
5. **Check Documentation**: Read module documentation before using
6. **Handle Import Errors**: Use try-except for optional dependencies

## Summary

Libraries extend Python's functionality. The \`import\` statement loads modules, with options for specific imports and aliases. Python's standard library includes random, sys, statistics, and datetime for common tasks. Third-party libraries like requests extend capabilities for web APIs. Understanding how to use and create modules is essential for building complex applications.`,r=[{question:`How do you import a specific function from a module?`,options:[`A. import math.sqrt`,`B. from math import sqrt`,`C. import sqrt from math`,`D. using math.sqrt`],correct:1},{question:"What does `random.randint(1, 10)` do?",options:[`A. Returns a random float`,`B. Returns a random integer between 1 and 10`,`C. Returns a random number from 1 to 9`,`D. Shuffles a list`],correct:1},{question:`How do you install a third-party library?`,options:[`A. import pip library_name`,`B. pip install library_name`,`C. python install library_name`,`D. library_name.install()`],correct:1},{question:`Which module would you use to get the current date and time?`,options:[`A. time`,`B. clock`,`C. datetime`,`D. now`],correct:2}],i=`Week 4 introduced libraries as reusable code collections. You learned import syntax (basic import, from X import Y, aliasing), used standard library modules (random, sys, statistics, datetime) for common tasks, and explored third-party libraries (cowsay, emoji, requests) installed via pip. Creating your own modules allows organizing code into reusable files.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};