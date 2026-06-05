var e=`Week 3 — Optimization`,t=`CS50 AI 2024 — Lecture 3`,n=`# Optimization: Finding the Best Solution

## Introduction

Optimization problems seek to find the best solution from a set of candidates. Whether maximizing profit, minimizing cost, or satisfying constraints, optimization is central to AI.

## Local Search

Local search algorithms explore neighbors of current solution, moving to better solutions.

### Hill Climbing

Always move to the steepest uphill neighbor:

\`\`\`python
def hill_climbing(initial_state):
    """Hill climbing optimization."""
    current = initial_state
    
    while True:
        # Find best neighbor
        neighbors = get_neighbors(current)
        neighbor_values = [value(n) for n in neighbors]
        best_neighbor = neighbors[neighbor_values.index(max(neighbor_values))]
        
        # Stop if no improvement
        if value(best_neighbor) <= value(current):
            return current
        
        current = best_neighbor
\`\`\`

**Properties**:
- Local optimum: Gets stuck in local maxima
- Incomplete: May not find global optimum
- Time: Linear in state space
- Space: Constant

### Steepest Ascent Hill Climbing

Variation that considers all neighbors:

\`\`\`python
def steepest_ascent(initial_state):
    """Find neighbor with highest value."""
    current = initial_state
    
    while True:
        neighbors = get_neighbors(current)
        if not neighbors:
            return current
        
        best = max(neighbors, key=value)
        if value(best) <= value(current):
            return current
        
        current = best
\`\`\`

### Sideways Movement

Allow moves to equally valued neighbors to escape plateaus:

\`\`\`python
def hill_climbing_with_sideways(initial_state, max_sideways=100):
    """Allow sideways moves up to max_sideways."""
    current = initial_state
    sideways_count = 0
    
    while True:
        neighbors = get_neighbors(current)
        best = max(neighbors, key=value)
        
        if value(best) > value(current):
            current = best
            sideways_count = 0
        elif value(best) == value(current) and sideways_count < max_sideways:
            current = best
            sideways_count += 1
        else:
            return current
\`\`\`

## Simulated Annealing

Allows moves to worse solutions with decreasing probability:

\`\`\`python
import math
import random

def simulated_annealing(initial_state, schedule):
    """Simulated annealing optimization."""
    current = initial_state
    
    for t in range(1, 1000):
        temperature = schedule(t)
        if temperature == 0:
            return current
        
        # Select random neighbor
        neighbor = random_neighbor(current)
        delta_e = value(neighbor) - value(current)
        
        # Always accept better solution
        if delta_e > 0:
            current = neighbor
        # Accept worse with probability
        elif random.random() < math.exp(delta_e / temperature):
            current = neighbor
    
    return current
\`\`\`

Schedule function determines temperature over time:

\`\`\`python
def linear_schedule(t):
    """Linear temperature schedule."""
    return max(0, 1000 - t)

def exponential_schedule(t):
    """Exponential temperature schedule."""
    return 1000 * (0.99 ** t)
\`\`\`

## Constraint Satisfaction Problems (CSP)

CSPs consist of:
- **Variables**: X₁, X₂, ..., Xₙ
- **Domains**: D₁, D₂, ..., Dₙ (possible values for each)
- **Constraints**: Restrictions on variable assignments

Example: Graph coloring
- Variables: Each node
- Domains: {Red, Green, Blue}
- Constraints: Adjacent nodes have different colors

### Backtracking Search

Systematically try assignments, backtracking when conflicts arise:

\`\`\`python
def backtrack(assignment, csp):
    """CSP backtracking search."""
    if is_complete(assignment, csp):
        return assignment
    
    # Select unassigned variable
    var = select_unassigned_variable(assignment, csp)
    
    for value in order_domain_values(var, assignment, csp):
        if is_consistent(var, value, assignment, csp):
            # Make assignment
            assignment[var] = value
            result = backtrack(assignment, csp)
            
            # If successful, return
            if result is not None:
                return result
            
            # Backtrack
            del assignment[var]
    
    return None
\`\`\`

### Arc Consistency (AC-3)

Reduce domain sizes before search:

\`\`\`python
def ac3(csp):
    """AC-3 constraint satisfaction algorithm."""
    queue = [(Xi, Xj) for Xi in csp.variables for Xj in csp.neighbors[Xi]]
    
    while queue:
        Xi, Xj = queue.pop(0)
        
        if revise(csp, Xi, Xj):
            if len(csp.domains[Xi]) == 0:
                return False  # No solution possible
            
            for Xk in csp.neighbors[Xi]:
                if Xk != Xj:
                    queue.append((Xk, Xi))
    
    return True

def revise(csp, Xi, Xj):
    """Remove values from Xi domain inconsistent with Xj."""
    revised = False
    
    for x in csp.domains[Xi][:]:
        if not any(csp.constraints_satisfied(Xi, x, Xj, y) for y in csp.domains[Xj]):
            csp.domains[Xi].remove(x)
            revised = True
    
    return revised
\`\`\`

### Variable and Value Ordering

Improve search efficiency through smart choices:

\`\`\`python
def minimum_remaining_values(assignment, csp):
    """Select variable with smallest domain (MRV heuristic)."""
    return min([v for v in csp.variables if v not in assignment],
               key=lambda v: len(csp.domains[v]))

def least_constraining_value(var, assignment, csp):
    """Order values by how many constraints they impose."""
    return sorted(csp.domains[var],
                  key=lambda value: count_conflicts(var, value, assignment, csp))
\`\`\`

## Linear Programming

Optimize linear objective function subject to linear constraints:

\`\`\`
Maximize: 3x + 2y
Subject to:
  x + y ≤ 4
  x ≤ 2
  y ≤ 3
  x, y ≥ 0
\`\`\`

Using scipy:

\`\`\`python
from scipy.optimize import linprog

# Minimize -3x - 2y (equivalent to maximizing 3x + 2y)
c = [-3, -2]

# Inequality constraints: A_ub @ x <= b_ub
A_ub = [[1, 1], [1, 0], [0, 1]]
b_ub = [4, 2, 3]

# Bounds for variables
x_bounds = (0, None)
y_bounds = (0, None)

result = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=[x_bounds, y_bounds])
print(result.fun)  # Optimal value
print(result.x)    # Optimal solution
\`\`\`

## Practical Example: TSP (Traveling Salesman)

\`\`\`python
import random
import math

def distance(city1, city2):
    """Euclidean distance between cities."""
    return math.sqrt((city1[0] - city2[0])**2 + (city1[1] - city2[1])**2)

def tour_length(tour, cities):
    """Calculate total tour distance."""
    length = 0
    for i in range(len(tour)):
        length += distance(cities[tour[i]], cities[tour[(i + 1) % len(tour)]])
    return length

def nearest_neighbor(cities):
    """Greedy nearest neighbor heuristic."""
    unvisited = set(range(len(cities)))
    current = 0
    tour = [current]
    unvisited.remove(current)
    
    while unvisited:
        nearest = min(unvisited, key=lambda city: distance(cities[current], cities[city]))
        tour.append(nearest)
        unvisited.remove(nearest)
        current = nearest
    
    return tour
\`\`\`

## Summary

Local search algorithms explore neighbors seeking improvement. Hill climbing moves to steepest uphill neighbor but gets stuck in local optima. Simulated annealing accepts worse solutions with decreasing probability to escape local optima. Constraint satisfaction problems use backtracking with pruning (arc consistency) and smart variable/value ordering. Linear programming optimizes linear objectives under linear constraints. These techniques solve diverse optimization problems from scheduling to routing.`,r=[{question:`What is the main limitation of hill climbing?`,options:[`A. Too slow`,`B. Gets stuck in local optima`,`C. Uses too much memory`,`D. Can't handle complex problems`],correct:1},{question:`How does simulated annealing escape local optima?`,options:[`A. Always moves uphill`,`B. Accepts worse solutions with decreasing probability`,`C. Random restart`,`D. Uses multiple climbers`],correct:1},{question:`What does the AC-3 algorithm do?`,options:[`A. Finds optimal tour`,`B. Enforces arc consistency in CSP`,`C. Calculates heuristics`,`D. Schedules variables`],correct:1},{question:`What does MRV heuristic select?`,options:[`A. Value with most constraints`,`B. Variable with smallest domain`,`C. Variable with most constraints`,`D. Most recent variable`],correct:1}],i=`Week 3 covered optimization techniques for finding best solutions. Local search algorithms (hill climbing, simulated annealing) explore neighbors, with simulated annealing accepting worse solutions to escape local optima. Constraint satisfaction problems use backtracking with arc consistency and smart ordering heuristics. Linear programming optimizes linear objectives under linear constraints. These techniques solve diverse problems from scheduling to routing to traveling salesman problem.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};