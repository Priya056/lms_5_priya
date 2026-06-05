var e=`Week 5 — Unit Tests`,t=`CS50P 2022 — Lecture 5`,n=`# Unit Tests: Ensuring Code Quality

## Introduction

Unit tests are small, automated tests that verify your code works correctly. They're essential for catching bugs early, enabling refactoring with confidence, and documenting expected behavior.

## Why Test?

- **Catch Bugs Early**: Find issues before deployment
- **Enable Refactoring**: Change code safely when tests verify behavior
- **Document Behavior**: Tests show how code should be used
- **Build Confidence**: Know your code works as intended
- **Improve Design**: Writing testable code leads to better design

## pytest Framework

pytest is Python's most popular testing framework. Install it with:

\`\`\`bash
pip install pytest
\`\`\`

## Test Files and Naming

Test files should follow the naming convention \`test_*.py\` or \`*_test.py\`:

- \`test_calculator.py\`
- \`math_test.py\`

## Assert Statements

The \`assert\` statement checks if a condition is \`True\`. If it's \`False\`, an \`AssertionError\` is raised:

\`\`\`python
assert 5 == 5  # Passes
assert 5 == 3  # Fails with AssertionError
assert 5 > 3   # Passes
assert True    # Passes
\`\`\`

## Writing Tests

Test functions should start with \`test_\` and describe what they test:

**calculator.py**
\`\`\`python
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y
\`\`\`

**test_calculator.py**
\`\`\`python
from calculator import add, subtract, multiply

def test_add():
    assert add(5, 3) == 8
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_subtract():
    assert subtract(10, 3) == 7
    assert subtract(5, 5) == 0
    assert subtract(0, 5) == -5

def test_multiply():
    assert multiply(4, 5) == 20
    assert multiply(-2, 3) == -6
    assert multiply(0, 100) == 0
\`\`\`

## Running Tests

Run tests with:

\`\`\`bash
pytest test_calculator.py
\`\`\`

Output:
\`\`\`
test_calculator.py::test_add PASSED
test_calculator.py::test_subtract PASSED
test_calculator.py::test_multiply PASSED
\`\`\`

## Testing Edge Cases

Edge cases are boundary conditions and unusual inputs. Always test them:

\`\`\`python
def test_divide():
    assert divide(10, 2) == 5
    assert divide(5, 2) == 2.5
    assert divide(-10, 2) == -5
    # Edge case: zero divisor
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)
\`\`\`

## Testing Exceptions

Use \`pytest.raises()\` to verify exceptions are raised:

\`\`\`python
import pytest
from calculator import divide

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)
\`\`\`

## Testing Multiple Scenarios

### Parameterized Tests

Test multiple inputs with one test function:

\`\`\`python
import pytest
from calculator import add

@pytest.mark.parametrize("x,y,expected", [
    (5, 3, 8),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300)
])
def test_add_multiple(x, y, expected):
    assert add(x, y) == expected
\`\`\`

## Example: Testing a Student Class

**student.py**
\`\`\`python
class Student:
    def __init__(self, name, grade):
        if not name:
            raise ValueError("Name cannot be empty")
        if not 0 <= grade <= 100:
            raise ValueError("Grade must be between 0 and 100")
        self.name = name
        self.grade = grade
    
    def is_passing(self):
        return self.grade >= 60
\`\`\`

**test_student.py**
\`\`\`python
import pytest
from student import Student

def test_valid_student():
    student = Student("Alice", 85)
    assert student.name == "Alice"
    assert student.grade == 85

def test_student_is_passing():
    student = Student("Bob", 70)
    assert student.is_passing()
    
def test_student_not_passing():
    student = Student("Charlie", 50)
    assert not student.is_passing()

def test_invalid_name():
    with pytest.raises(ValueError):
        Student("", 80)

def test_invalid_grade():
    with pytest.raises(ValueError):
        Student("Dave", 150)
    
    with pytest.raises(ValueError):
        Student("Eve", -10)
\`\`\`

## Best Practices

1. **Test One Thing**: Each test should verify one behavior
2. **Use Descriptive Names**: \`test_add_positive_numbers\` is better than \`test1\`
3. **Follow Arrange-Act-Assert**: Set up data, perform action, check result
4. **Test Edge Cases**: Zero, negative numbers, empty values, etc.
5. **Test Exceptions**: Verify error handling
6. **Keep Tests Fast**: Tests should run quickly
7. **Don't Test Libraries**: Trust that standard libraries work
8. **Use Clear Assertions**: Make it obvious what's being tested

## Arrange-Act-Assert Pattern

\`\`\`python
def test_calculate_gpa():
    # Arrange - Set up test data
    grades = [90, 85, 95]
    
    # Act - Perform the action
    gpa = calculate_gpa(grades)
    
    # Assert - Check the result
    assert gpa == 90.0
\`\`\`

## Summary

Unit tests ensure code quality and correctness. Test files follow naming conventions (\`test_*.py\`) and contain functions starting with \`test_\`. The \`assert\` statement verifies conditions, and \`pytest.raises()\` tests exception handling. Edge cases must be tested thoroughly, and parameterized tests reduce code duplication. Following best practices like the Arrange-Act-Assert pattern leads to reliable, maintainable tests.`,r=[{question:`What naming convention should test files follow?`,options:[`A. file_test.py`,`B. test_file.py or file_test.py`,`C. testing_file.py`,`D. _test_file.py`],correct:1},{question:`How do you verify that an exception is raised in pytest?`,options:[`A. try/except`,`B. pytest.raises()`,`C. pytest.error()`,`D. assert raises()`],correct:1},{question:"What does the `assert` statement do when the condition is False?",options:[`A. Continues execution`,`B. Prints a warning`,`C. Raises AssertionError`,`D. Exits the program`],correct:2},{question:`Which pattern is recommended for structuring tests?`,options:[`A. Act-Arrange-Assert`,`B. Assert-Arrange-Act`,`C. Arrange-Act-Assert`,`D. Test-Run-Verify`],correct:2}],i="Week 5 covered unit testing with pytest to ensure code quality. Test files follow naming conventions (`test_*.py`), and test functions start with `test_`. The `assert` statement verifies conditions, while `pytest.raises()` tests exception handling. Parameterized tests handle multiple scenarios efficiently. Best practices include testing edge cases, following Arrange-Act-Assert pattern, and using descriptive test names.",a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};