var e=`Week 7 — Regular Expressions`,t=`CS50P 2022 — Lecture 7`,n=`# Regular Expressions: Pattern Matching

## Introduction

Regular expressions (regex) are patterns used to match and manipulate text. They allow sophisticated text searching and replacement without complex string parsing logic.

## The re Module

Python's \`re\` module provides regular expression functionality:

\`\`\`python
import re
\`\`\`

## Basic Pattern Matching

### re.search()

Search for the first match of a pattern:

\`\`\`python
import re

text = "Hello, World!"
if re.search("World", text):
    print("Match found")
\`\`\`

Returns a match object if found, \`None\` otherwise.

### re.match()

Match at the beginning of a string:

\`\`\`python
import re

text = "Hello, World"
if re.match("Hello", text):
    print("Match found at start")
\`\`\`

### re.fullmatch()

Match the entire string:

\`\`\`python
import re

text = "123"
if re.fullmatch(r"\\d{3}", text):
    print("Exact match of 3 digits")
\`\`\`

## Basic Patterns

### Literal Characters

Match exact text:

\`\`\`python
re.search("cat", "The cat is here")  # Match
\`\`\`

### Dot (.)

Matches any single character except newline:

\`\`\`python
re.search(r"c.t", "cat")  # Match
re.search(r"c.t", "cut")  # Match
re.search(r"c.t", "cot")  # Match
\`\`\`

### Asterisk (*)

Matches zero or more of the preceding element:

\`\`\`python
re.search(r"ca*t", "ct")    # Match (0 a's)
re.search(r"ca*t", "cat")   # Match (1 a)
re.search(r"ca*t", "caat")  # Match (2 a's)
\`\`\`

### Plus (+)

Matches one or more of the preceding element:

\`\`\`python
re.search(r"ca+t", "ct")    # No match
re.search(r"ca+t", "cat")   # Match
re.search(r"ca+t", "caat")  # Match
\`\`\`

### Question Mark (?)

Matches zero or one of the preceding element:

\`\`\`python
re.search(r"ca?t", "ct")    # Match
re.search(r"ca?t", "cat")   # Match
re.search(r"ca?t", "caat")  # No match
\`\`\`

### Character Classes ([])

Match any character inside the brackets:

\`\`\`python
re.search(r"[aeiou]", "hello")     # Match
re.search(r"[0-9]", "abc123")      # Match
re.search(r"[a-z]", "ABC")         # No match
re.search(r"[^0-9]", "abc")        # Match (negation)
\`\`\`

### Caret (^) and Dollar ($)

Match start and end of string:

\`\`\`python
re.search(r"^Hello", "Hello, World")  # Match
re.search(r"World$", "Hello, World")  # Match
re.search(r"^World", "Hello, World")  # No match
\`\`\`

## Shorthand Character Classes

- \`\\d\` - Any digit (0-9)
- \`\\D\` - Any non-digit
- \`\\w\` - Any word character (letters, digits, underscore)
- \`\\W\` - Any non-word character
- \`\\s\` - Any whitespace (space, tab, newline)
- \`\\S\` - Any non-whitespace

\`\`\`python
re.search(r"\\d{3}-\\d{4}", "555-1234")  # Match phone number
re.search(r"\\w+", "Hello_123")         # Match
re.search(r"\\S+", "Hello World")       # Match "Hello"
\`\`\`

## Substitution

### re.sub()

Replace all matches:

\`\`\`python
import re

text = "The cat and the dog"
result = re.sub(r"cat", "dog", text)
print(result)  # "The dog and the dog"
\`\`\`

Limit replacements:

\`\`\`python
result = re.sub(r"the", "a", text, count=1)
print(result)  # "a cat and the dog"
\`\`\`

## Groups and Capturing

Use parentheses to create groups:

\`\`\`python
import re

text = "John Doe"
match = re.search(r"(\\w+) (\\w+)", text)
if match:
    print(match.group(0))  # "John Doe" (entire match)
    print(match.group(1))  # "John" (first group)
    print(match.group(2))  # "Doe" (second group)
\`\`\`

## Flags

### re.IGNORECASE (re.I)

Case-insensitive matching:

\`\`\`python
re.search(r"hello", "HELLO", re.IGNORECASE)  # Match
re.search(r"hello", "HELLO", re.I)           # Match
\`\`\`

### re.MULTILINE (re.M)

Make \`^\` and \`$\` match at line boundaries:

\`\`\`python
text = "line1\\nline2\\nline3"
re.search(r"^line2", text)                # No match
re.search(r"^line2", text, re.MULTILINE)  # Match
\`\`\`

## Practical Examples

### Validating Email

\`\`\`python
import re

def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    return bool(re.fullmatch(pattern, email))

print(is_valid_email("alice@example.com"))  # True
print(is_valid_email("invalid.email"))       # False
\`\`\`

### Extracting Phone Numbers

\`\`\`python
import re

text = "Call me at 555-123-4567 or 555.987.6543"
phones = re.findall(r"\\d{3}[-.]?\\d{3}[-.]?\\d{4}", text)
print(phones)  # ['555-123-4567', '555.987.6543']
\`\`\`

### Cleaning Text

\`\`\`python
import re

text = "  Hello   World  \\n  Test  "
# Remove extra whitespace
clean = re.sub(r"\\s+", " ", text).strip()
print(repr(clean))  # 'Hello World Test'
\`\`\`

### Parsing URLs

\`\`\`python
import re

url = "https://www.example.com/path?query=value"
match = re.search(r"https?://([a-zA-Z0-9.-]+)(/.*)", url)
if match:
    domain = match.group(1)
    path = match.group(2)
    print(f"Domain: {domain}")
    print(f"Path: {path}")
\`\`\`

## Common Patterns

| Pattern | Purpose |
|---------|----------|
| \`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\` | Email validation |
| \`^\\d{3}-?\\d{3}-?\\d{4}$\` | US phone number |
| \`^\\d{4}-\\d{2}-\\d{2}$\` | Date (YYYY-MM-DD) |
| \`^[A-Z][a-z]*$\` | Capitalized word |
| \`^https?://\` | HTTP/HTTPS URL |

## Best Practices

1. **Use Raw Strings**: Use \`r"pattern"\` to avoid escaping issues
2. **Test Patterns**: Use regex testers online
3. **Keep It Simple**: Overly complex regex is hard to maintain
4. **Use re.compile()**: For repeated use, compile patterns
5. **Document Patterns**: Comment what your regex does
6. **Use VERBOSE Flag**: For complex patterns, use \`re.VERBOSE\` and comments

## Summary

Regular expressions provide powerful pattern matching. Basic patterns use literal characters, wildcards (.), quantifiers (*, +, ?), and character classes ([]). Anchors (^, $) match string boundaries. Shortcuts (\\d, \\w, \\s) simplify common patterns. \`re.search()\`, \`re.match()\`, and \`re.fullmatch()\` find patterns, while \`re.sub()\` performs substitution. Groups capture portions of matches, and flags enable case-insensitive and multiline matching.`,r=[{question:`Which regex pattern matches any digit?`,options:[`A. \\D`,`B. \\d`,`C. [0-9]`,`D. Both B and C`],correct:3},{question:"What does the `+` quantifier match?",options:[`A. Zero or more`,`B. One or more`,`C. Zero or one`,`D. Exactly one`],correct:1},{question:"What is the difference between `re.search()` and `re.match()`?",options:[`A. No difference`,`B. re.match searches anywhere, re.search matches from start`,`C. re.search searches anywhere, re.match only at start`,`D. re.search replaces, re.match finds`],correct:2},{question:`Which flag makes regex matching case-insensitive?`,options:[`A. re.IGNORE`,`B. re.CASE`,`C. re.IGNORECASE`,`D. re.INSENSITIVE`],correct:2}],i="Week 7 introduced regular expressions for pattern matching in text. The `re` module provides `re.search()`, `re.match()`, and `re.fullmatch()` for finding patterns, and `re.sub()` for replacement. Basic patterns include literals, wildcards (.), quantifiers (*, +, ?), and character classes ([]). Anchors (^, $) mark string boundaries, while shortcuts (\\d, \\w, \\s) simplify common patterns. Groups capture matched portions, and flags enable case-insensitive and multiline matching.",a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};