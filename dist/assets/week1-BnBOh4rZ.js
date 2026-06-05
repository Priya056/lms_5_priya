var e=`Week 1 — Knowledge`,t=`CS50 AI 2024 — Lecture 1`,n=`# Knowledge Representation and Reasoning

## Introduction to Logic

Knowledge representation enables machines to represent facts about the world and reason about them. Propositional logic provides a formal system for representing and manipulating knowledge.

## Propositional Logic

Propositions are statements that are either true or false.

### Basic Propositions

\`\`\`
P: "It is raining"
Q: "The ground is wet"
\`\`\`

### Logical Operators

**Conjunction (AND, ∧)**
- P ∧ Q: "It is raining AND the ground is wet"
- True only if both are true

**Disjunction (OR, ∨)**
- P ∨ Q: "It is raining OR the ground is wet"
- True if at least one is true

**Negation (NOT, ¬)**
- ¬P: "It is NOT raining"
- Reverses truth value

**Implication (→)**
- P → Q: "If it is raining, then the ground is wet"
- False only when P is true and Q is false

**Biconditional (↔)**
- P ↔ Q: "It is raining if and only if the ground is wet"
- True when both have same truth value

## Models and Satisfiability

A model assigns truth values to propositions. A formula is:
- **Satisfiable**: True in at least one model
- **Unsatisfiable**: False in all models
- **Valid**: True in all models

## Inference and Entailment

A knowledge base (KB) entails a proposition (α) if α is true in all models where KB is true.

\`\`\`
KB ⊨ α (KB entails alpha)
\`\`\`

### Model Checking

Determine if KB entails α by checking all models:

\`\`\`python
def model_checking(kb, alpha):
    """Check if KB entails alpha."""
    for model in all_models:
        if evaluate(kb, model):
            if not evaluate(alpha, model):
                return False  # Counterexample found
    return True
\`\`\`

## Inference Rules

Inference rules derive new facts from existing knowledge.

### Modus Ponens

From P → Q and P, infer Q:

\`\`\`
P → Q
P
-------
Q
\`\`\`

Example:
\`\`\`
"If it rains, the ground is wet" → "The ground is wet"
"It rains"
---------
"The ground is wet"
\`\`\`

### Universal Instantiation

From ∀x P(x), infer P(a) for any specific object a.

## Conjunctive Normal Form (CNF)

CNF is a standard form where formulas are conjunctions of disjunctive clauses:

\`\`\`
(P₁ ∨ P₂ ∨ ¬P₃) ∧ (P₄ ∨ ¬P₅) ∧ (P₆)
\`\`\`

Each clause is a disjunction (OR) of literals, and clauses are connected by conjunction (AND).

Convert any formula to CNF:

\`\`\`python
def to_cnf(formula):
    """Convert formula to CNF."""
    # 1. Eliminate biconditionals: P ↔ Q becomes (P → Q) ∧ (Q → P)
    # 2. Eliminate implications: P → Q becomes ¬P ∨ Q
    # 3. Move negations inward (De Morgan's laws)
    # 4. Distribute OR over AND
    pass
\`\`\`

## Resolution

Resolution is an inference rule for CNF formulas:

From clauses (P ∨ α) and (¬P ∨ β), infer (α ∨ β).

Example:
\`\`\`
(Vampire ∨ Ghost) and (¬Vampire ∨ Werewolf)
-------
(Ghost ∨ Werewolf)
\`\`\`

## DPLL Algorithm

DPLL (Davis-Putnam-Logemann-Loveland) checks CNF satisfiability:

\`\`\`python
def dpll(clauses, assignments={}):
    """DPLL satisfiability algorithm."""
    # All clauses satisfied
    if all_satisfied(clauses, assignments):
        return assignments
    
    # Empty clause (unsatisfiable)
    if has_empty_clause(clauses, assignments):
        return None
    
    # Unit propagation: single literal clauses
    for literal in unit_clauses(clauses):
        return dpll(clauses, {**assignments, literal: True})
    
    # Pure literal elimination
    for literal in pure_literals(clauses):
        return dpll(clauses, {**assignments, literal: True})
    
    # Choose literal and try both assignments
    literal = choose_literal(clauses)
    
    # Try true
    result = dpll(clauses, {**assignments, literal: True})
    if result is not None:
        return result
    
    # Try false
    return dpll(clauses, {**assignments, literal: False})
\`\`\`

## Knowledge Bases

A knowledge base stores facts and rules:

\`\`\`python
class KnowledgeBase:
    def __init__(self):
        self.facts = set()
        self.rules = []
    
    def tell(self, fact):
        """Add fact to KB."""
        self.facts.add(fact)
    
    def add_rule(self, premise, conclusion):
        """Add rule: if premise then conclusion."""
        self.rules.append((premise, conclusion))
    
    def ask(self, query):
        """Query KB using forward chaining."""
        # Check if query is in facts
        if query in self.facts:
            return True
        
        # Try to derive query from rules
        for premise, conclusion in self.rules:
            if conclusion == query and self.ask(premise):
                return True
        
        return False
\`\`\`

## Practical Example: Puzzle Solving

\`\`\`python
def solve_puzzle():
    """
    There are three people: Alice, Bob, Charlie.
    Exactly one is a knight (always truthful),
    exactly one is a knave (always lies),
    exactly one is a normal person (random truth values).
    
    Alice says: "Bob is a knight."
    Bob says: "I am normal."
    Charlie says: "Alice is a knave."
    
    Who is who?
    """
    from itertools import permutations
    
    roles = ["Knight", "Knave", "Normal"]
    people = ["Alice", "Bob", "Charlie"]
    
    for perm in permutations(roles):
        assignment = dict(zip(people, perm))
        
        # Check consistency of statements
        alice_statement = assignment["Bob"] == "Knight"
        bob_statement = assignment["Bob"] == "Normal"
        charlie_statement = assignment["Alice"] == "Knave"
        
        if is_consistent(assignment, alice_statement, bob_statement, charlie_statement):
            return assignment
    
    return None
\`\`\`

## Summary

Knowledge representation uses propositional and predicate logic to formalize facts and rules. Model checking verifies inference by examining truth assignments. Inference rules like modus ponens derive new knowledge. CNF provides standard form for automated reasoning. Resolution is a powerful inference rule for CNF. DPLL efficiently checks satisfiability using unit propagation and pure literal elimination. Knowledge bases implement forward and backward chaining for query answering.`,r=[{question:`What does it mean for a KB to entail a proposition?`,options:[`A. The KB contains the proposition`,`B. The proposition is true in all models where KB is true`,`C. The proposition contradicts the KB`,`D. The proposition is a rule in the KB`],correct:1},{question:`What is the result of: 'If it rains, the ground is wet' AND 'It rains'?`,options:[`A. It doesn't rain`,`B. The ground is not wet`,`C. The ground is wet`,`D. Undetermined`],correct:2},{question:`What is the standard form for automated reasoning in logic?`,options:[`A. Disjunctive Normal Form`,`B. Conjunctive Normal Form`,`C. Negation Normal Form`,`D. Predicate Normal Form`],correct:1},{question:`What technique does DPLL use to simplify satisfiability checking?`,options:[`A. Model enumeration`,`B. Unit propagation and pure literal elimination`,`C. Random search`,`D. Depth-first traversal`],correct:1}],i=`Week 1 covered knowledge representation using propositional logic with operators (AND, OR, NOT, implication, biconditional). Model checking verifies KB entailment by examining truth assignments. Inference rules like modus ponens derive new knowledge. CNF provides standard form for automated reasoning. Resolution infers new clauses from CNF formulas. DPLL efficiently checks satisfiability using unit propagation and pure literal elimination. Knowledge bases implement query answering for logical inference.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};