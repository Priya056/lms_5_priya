var e=`Week 0 — Search`,t=`CS50 AI 2024 — Lecture 0`,n=`# Search: Finding Solutions Algorithmically

## Introduction to Search Problems

Search problems are fundamental to artificial intelligence. We define a problem by its state space (all possible configurations), actions available in each state, a transition model (how actions move between states), a goal test, and a path cost.

## The Search Framework

### Problem Components

- **Initial State**: Where we start
- **State Space**: All possible states we can reach
- **Actions**: What we can do from each state
- **Transition Model**: Result of performing an action
- **Goal Test**: How to recognize a solution
- **Path Cost**: Cost of transitions (usually per step)

Example: Maze solving
- Initial State: Start position
- State Space: Every position in the maze
- Actions: Move up, down, left, right
- Transition Model: New position after moving
- Goal Test: Reached the exit
- Path Cost: 1 per move

## Uninformed Search

Uninformed searches have no information about how close a state is to the goal.

### Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking:

\`\`\`python
def dfs(start, goal):
    stack = [start]
    visited = set()
    
    while stack:
        node = stack.pop()
        if node == goal:
            return True
        if node in visited:
            continue
        visited.add(node)
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                stack.append(neighbor)
    
    return False
\`\`\`

**Properties**:
- Complete: No (may not find goal if search space is infinite)
- Optimal: No (doesn't consider path cost)
- Time: O(V + E) where V is vertices, E is edges
- Space: O(h) where h is height

### Breadth-First Search (BFS)

BFS explores all neighbors at current distance before moving further:

\`\`\`python
from collections import deque

def bfs(start, goal):
    queue = deque([start])
    visited = {start}
    
    while queue:
        node = queue.popleft()
        if node == goal:
            return True
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return False
\`\`\`

**Properties**:
- Complete: Yes (if branching factor is finite)
- Optimal: Yes (if all costs are equal)
- Time: O(b^d) where b is branching factor, d is depth
- Space: O(b^d)

## Informed Search

Informed searches use heuristics to guide the search toward the goal.

### Greedy Best-First Search

Always expands the node with the lowest heuristic value:

\`\`\`python
import heapq

def greedy_best_first(start, goal, heuristic):
    heap = [(heuristic(start), start)]
    visited = set()
    
    while heap:
        _, node = heapq.heappop(heap)
        if node == goal:
            return True
        if node in visited:
            continue
        visited.add(node)
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                heapq.heappush(heap, (heuristic(neighbor), neighbor))
    
    return False
\`\`\`

**Properties**:
- Complete: No (may get stuck in local minima)
- Optimal: No
- Time: O(b^m) where m is depth of solution
- Space: O(b^m)

### A* Search

A* combines actual cost from start with heuristic estimate to goal:

\`\`\`python
def a_star(start, goal, heuristic):
    heap = [(0 + heuristic(start), 0, start)]
    visited = set()
    
    while heap:
        _, cost, node = heapq.heappop(heap)
        if node == goal:
            return True
        if node in visited:
            continue
        visited.add(node)
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                new_cost = cost + 1
                priority = new_cost + heuristic(neighbor)
                heapq.heappush(heap, (priority, new_cost, neighbor))
    
    return False
\`\`\`

**Properties**:
- Complete: Yes (with finite branching)
- Optimal: Yes (if heuristic is admissible)
- Time: Depends on heuristic quality
- Space: O(b^d)

## Heuristics

Heuristics estimate the cost from current state to goal. A good heuristic guides search efficiently without overestimating.

### Admissible Heuristics

Never overestimate actual cost to goal:

\`\`\`python
# Example: Manhattan distance for grid
def manhattan_distance(current, goal):
    return abs(current[0] - goal[0]) + abs(current[1] - goal[1])

# Example: Euclidean distance
def euclidean_distance(current, goal):
    return ((current[0] - goal[0])**2 + (current[1] - goal[1])**2)**0.5
\`\`\`

## Adversarial Search: Minimax

For game-playing, minimax assumes two players with opposite goals:

\`\`\`python
def minimax(position, depth, is_maximizing):
    if depth == 0 or is_terminal(position):
        return evaluate(position)
    
    if is_maximizing:
        max_eval = float('-inf')
        for move in get_moves(position):
            new_position = apply_move(position, move)
            eval = minimax(new_position, depth - 1, False)
            max_eval = max(max_eval, eval)
        return max_eval
    else:
        min_eval = float('inf')
        for move in get_moves(position):
            new_position = apply_move(position, move)
            eval = minimax(new_position, depth - 1, True)
            min_eval = min(min_eval, eval)
        return min_eval
\`\`\`

### Alpha-Beta Pruning

Optimize minimax by pruning branches that can't affect outcome:

\`\`\`python
def minimax_alpha_beta(position, depth, alpha, beta, is_maximizing):
    if depth == 0 or is_terminal(position):
        return evaluate(position)
    
    if is_maximizing:
        for move in get_moves(position):
            new_position = apply_move(position, move)
            eval = minimax_alpha_beta(new_position, depth - 1, alpha, beta, False)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break  # Beta cutoff
        return alpha
    else:
        for move in get_moves(position):
            new_position = apply_move(position, move)
            eval = minimax_alpha_beta(new_position, depth - 1, alpha, beta, True)
            beta = min(beta, eval)
            if beta <= alpha:
                break  # Alpha cutoff
        return beta
\`\`\`

## Practical Example: Solving a Maze

\`\`\`python
from collections import deque

def solve_maze(maze, start, end):
    """Find shortest path through maze using BFS."""
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        (row, col), path = queue.popleft()
        
        if (row, col) == end:
            return path
        
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_row, new_col = row + dr, col + dc
            
            if (0 <= new_row < len(maze) and
                0 <= new_col < len(maze[0]) and
                maze[new_row][new_col] == 0 and
                (new_row, new_col) not in visited):
                
                visited.add((new_row, new_col))
                queue.append(((new_row, new_col), path + [(new_row, new_col)]))
    
    return None
\`\`\`

## Summary

Search problems involve finding paths through state spaces from initial to goal states. Uninformed searches (DFS, BFS) explore systematically without knowledge of goal location. BFS guarantees shortest path but uses more memory than DFS. Informed searches use heuristics to guide exploration efficiently. A* combines actual cost and heuristic estimates and is optimal with admissible heuristics. Minimax with alpha-beta pruning optimizes adversarial search for games.`,r=[{question:`Which search algorithm guarantees the shortest path?`,options:[`A. DFS`,`B. BFS`,`C. Greedy best-first`,`D. Depth-limited`],correct:1},{question:`What does an admissible heuristic never do?`,options:[`A. Overestimate cost to goal`,`B. Underestimate cost to goal`,`C. Return zero`,`D. Use domain knowledge`],correct:0},{question:`What is the time complexity of BFS?`,options:[`A. O(V + E)`,`B. O(b^d)`,`C. O(n log n)`,`D. O(1)`],correct:1},{question:`How does alpha-beta pruning improve minimax?`,options:[`A. Changes game evaluation`,`B. Eliminates branches that can't affect outcome`,`C. Guarantees better moves`,`D. Reduces game tree depth`],correct:1}],i=`Week 0 introduced search algorithms fundamental to AI. Uninformed searches (DFS, BFS) explore without goal knowledge; BFS guarantees shortest paths but uses more space. Informed searches use heuristics to guide exploration efficiently. A* combines actual cost and heuristic estimates and is optimal with admissible heuristics. Minimax with alpha-beta pruning optimizes adversarial search for games. Understanding these algorithms is essential for solving complex problems in AI.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};