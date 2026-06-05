var e=`Week 6 — File I/O`,t=`CS50P 2022 — Lecture 6`,n=`# File I/O: Reading and Writing Data

## Introduction

File I/O (Input/Output) enables programs to read data from files and write data to files. This is essential for persistent data storage and processing large datasets.

## Opening and Closing Files

Use the \`open()\` function to work with files:

\`\`\`python
file = open("data.txt", "r")  # Open for reading
# ... do something with the file
file.close()  # Close the file
\`\`\`

The second argument specifies the mode:
- \`"r"\` - Read (default)
- \`"w"\` - Write (creates or overwrites)
- \`"a"\` - Append (adds to the end)
- \`"x"\` - Create (fails if file exists)

## The with Statement

The \`with\` statement automatically closes files:

\`\`\`python
with open("data.txt", "r") as file:
    content = file.read()
# File is automatically closed
\`\`\`

This is the preferred way to handle files.

## Reading Files

### read()

Read the entire file as a single string:

\`\`\`python
with open("data.txt", "r") as file:
    content = file.read()
    print(content)
\`\`\`

### readline()

Read one line at a time:

\`\`\`python
with open("data.txt", "r") as file:
    line1 = file.readline()  # "First line\\n"
    line2 = file.readline()  # "Second line\\n"
\`\`\`

### readlines()

Read all lines as a list:

\`\`\`python
with open("data.txt", "r") as file:
    lines = file.readlines()
    # ['First line\\n', 'Second line\\n', 'Third line\\n']
\`\`\`

### Iterating Over Lines

Loop through a file line by line:

\`\`\`python
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip() removes newline
\`\`\`

## Writing to Files

### write()

Write a string to a file:

\`\`\`python
with open("output.txt", "w") as file:
    file.write("Hello, World!\\n")
    file.write("Second line\\n")
\`\`\`

### writelines()

Write multiple strings from a list:

\`\`\`python
lines = ["Line 1\\n", "Line 2\\n", "Line 3\\n"]
with open("output.txt", "w") as file:
    file.writelines(lines)
\`\`\`

## CSV Files

CSV (Comma-Separated Values) files store tabular data. Python's \`csv\` module makes working with them easy.

### csv.reader

Read CSV files:

\`\`\`python
import csv

with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)  # row is a list of values
\`\`\`

Example CSV file:
\`\`\`
Name,Age,City
Alice,30,New York
Bob,25,Los Angeles
\`\`\`

Output:
\`\`\`
['Name', 'Age', 'City']
['Alice', '30', 'New York']
['Bob', '25', 'Los Angeles']
\`\`\`

### csv.DictReader

Read CSV files as dictionaries:

\`\`\`python
import csv

with open("data.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row)  # row is a dictionary
\`\`\`

Output:
\`\`\`
{'Name': 'Alice', 'Age': '30', 'City': 'New York'}
{'Name': 'Bob', 'Age': '25', 'City': 'Los Angeles'}
\`\`\`

DictReader uses the first row as keys.

### csv.writer

Write to CSV files:

\`\`\`python
import csv

data = [
    ["Name", "Age", "City"],
    ["Alice", 30, "New York"],
    ["Bob", 25, "Los Angeles"]
]

with open("output.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(data)
\`\`\`

Note: Use \`newline=""\` to avoid extra blank lines.

## Practical Example: Student Database

**save_students.py**
\`\`\`python
import csv

def save_students_to_csv(students, filename):
    """Save student data to a CSV file."""
    with open(filename, "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["name", "id", "gpa"])
        writer.writeheader()
        writer.writerows(students)

students = [
    {"name": "Alice", "id": "001", "gpa": "3.9"},
    {"name": "Bob", "id": "002", "gpa": "3.5"},
    {"name": "Charlie", "id": "003", "gpa": "3.8"}
]

save_students_to_csv(students, "students.csv")
\`\`\`

**load_students.py**
\`\`\`python
import csv

def load_students_from_csv(filename):
    """Load student data from a CSV file."""
    students = []
    with open(filename, "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            students.append(row)
    return students

students = load_students_from_csv("students.csv")
for student in students:
    print(f"{student['name']} (ID: {student['id']})")
\`\`\`

## Another Example: Text Processing

\`\`\`python
def count_words_in_file(filename):
    """Count the total number of words in a file."""
    word_count = 0
    try:
        with open(filename, "r") as file:
            for line in file:
                words = line.split()
                word_count += len(words)
        return word_count
    except FileNotFoundError:
        print(f"Error: {filename} not found")
        return 0

count = count_words_in_file("document.txt")
print(f"Total words: {count}")
\`\`\`

## File Handling Best Practices

1. **Use with Statements**: Always use \`with\` for automatic file closing
2. **Handle Exceptions**: Catch \`FileNotFoundError\` and other errors
3. **Use Appropriate Modes**: Choose \`r\`, \`w\`, or \`a\` correctly
4. **Close Files**: If not using \`with\`, always call \`close()\`
5. **Strip Whitespace**: Use \`.strip()\` to remove newlines from lines
6. **Specify Newline**: Use \`newline=""\` for CSV files
7. **Use Context Managers**: \`with\` is cleaner than try/finally

## Summary

File I/O allows reading from and writing to files. The \`with\` statement ensures files are properly closed. Reading methods include \`read()\`, \`readline()\`, and \`readlines()\`, while writing uses \`write()\` and \`writelines()\`. The \`csv\` module handles tabular data with \`csv.reader\`, \`csv.DictReader\`, and \`csv.writer\`. Always use context managers and handle exceptions for robust file operations.`,r=[{question:`Which mode opens a file for reading?`,options:[`A. "w"`,`B. "r"`,`C. "a"`,`D. "x"`],correct:1},{question:"What does `csv.DictReader` return for each row?",options:[`A. A list of values`,`B. A dictionary`,`C. A tuple`,`D. A string`],correct:1},{question:`Which statement automatically closes files?`,options:[`A. try/except`,`B. if/else`,`C. with`,`D. for`],correct:2},{question:"What does `file.readlines()` return?",options:[`A. A single string`,`B. A dictionary`,`C. A list of lines`,`D. A file object`],correct:2}],i=[{front:`What are the file modes in Python's open() function?`,back:`"r" for reading (default), "w" for writing (creates/overwrites), "a" for appending (adds to end), "x" for creating (fails if exists). Example: open("file.txt", "r")`},{front:`Why use the with statement for file handling?`,back:`The with statement automatically closes the file, even if an error occurs. It's a context manager that ensures proper resource cleanup. Example: with open("file.txt") as f:`},{front:`What's the difference between read(), readline(), and readlines()?`,back:`read() returns entire file as one string. readline() returns one line at a time. readlines() returns all lines as a list. Each has different use cases depending on file size and processing needs.`},{front:`How do you iterate through a file line by line?`,back:`Use a for loop: for line in file: processes each line. Or use readline() in a loop. This is memory-efficient for large files. Use .strip() to remove newline characters.`},{front:`What does csv.DictReader return for each row?`,back:`csv.DictReader returns each row as a dictionary where column names are keys. The first row is automatically used as headers. Example: for row in reader: print(row['Name'])`},{front:`When writing CSV files, why use newline=""?`,back:`Using newline="" prevents extra blank lines between rows on Windows systems. CSV writers expect to control newline characters. Example: open("file.csv", "w", newline="")`},{front:`What exception should you catch for missing files?`,back:`Catch FileNotFoundError when a file doesn't exist. Example: except FileNotFoundError: print("File not found"). Other I/O exceptions include IOError for general I/O problems.`},{front:`What's the difference between write() and writelines()?`,back:`write() writes a single string. writelines() writes multiple strings from a list without adding newlines. Example: writelines(["Line 1\\\\n", "Line 2\\\\n"])`}],a="Week 6 covered file I/O operations for reading and writing data. The `with` statement ensures proper file handling. Reading methods (`read()`, `readline()`, `readlines()`) retrieve file contents, while `write()` and `writelines()` write data. The `csv` module handles tabular data with `csv.reader` (lists), `csv.DictReader` (dictionaries), and `csv.writer`. Proper exception handling and context managers are essential for robust file operations.",o={title:e,source:t,content:n,quiz:r,flashcards:i,summary:a};export{n as content,o as default,i as flashcards,r as quiz,t as source,a as summary,e as title};