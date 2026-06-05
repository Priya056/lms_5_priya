var e=`Week 2 — Uncertainty`,t=`CS50 AI 2024 — Lecture 2`,n=`# Dealing with Uncertainty Using Probability

## Introduction to Probability

Many real-world situations involve uncertainty. Probability theory provides a framework for representing and reasoning about uncertain information.

## Basic Probability Concepts

### Sample Space and Events

The sample space Ω is the set of all possible outcomes:
- Rolling a die: Ω = {1, 2, 3, 4, 5, 6}
- Coin flip: Ω = {Heads, Tails}

An event is a subset of the sample space.

### Probability

Probability P(X) is a number between 0 and 1:
- P(X) = 0: Event never occurs
- P(X) = 1: Event always occurs
- 0 < P(X) < 1: Uncertain outcome

### Axioms of Probability

1. All probabilities are non-negative: P(X) ≥ 0
2. Probability of sample space is 1: P(Ω) = 1
3. For disjoint events: P(A ∪ B) = P(A) + P(B)

## Joint Probability

Joint probability P(X, Y) represents the probability of two events occurring together.

Example: Weather and mood
\`\`\`
P(Weather, Mood):
               Sunny  Rainy
Happy          0.6    0.2
Sad            0.1    0.1
\`\`\`

All entries sum to 1.

## Marginal Probability

Marginal probability is the probability of one variable, regardless of others:

\`\`\`
P(Sunny) = P(Sunny, Happy) + P(Sunny, Sad) = 0.6 + 0.1 = 0.7
P(Happy) = P(Sunny, Happy) + P(Rainy, Happy) = 0.6 + 0.2 = 0.8
\`\`\`

## Conditional Probability

Conditional probability P(X | Y) is the probability of X given we know Y:

\`\`\`
P(X | Y) = P(X, Y) / P(Y)
\`\`\`

Example: Probability of being happy given it's sunny:

\`\`\`
P(Happy | Sunny) = P(Happy, Sunny) / P(Sunny) = 0.6 / 0.7 ≈ 0.857
\`\`\`

## Bayes' Rule

Bayes' rule relates conditional probabilities:

\`\`\`
P(X | Y) = P(Y | X) * P(X) / P(Y)
\`\`\`

Where:
- P(X | Y): Posterior probability (what we want)
- P(Y | X): Likelihood
- P(X): Prior probability
- P(Y): Evidence

Example: Medical test
\`\`\`
P(Disease | Positive) = P(Positive | Disease) * P(Disease) / P(Positive)
\`\`\`

### Naive Bayes

Assuming conditional independence:

\`\`\`
P(X | Y₁, Y₂, ..., Yₙ) ∝ P(X) * P(Y₁|X) * P(Y₂|X) * ... * P(Yₙ|X)
\`\`\`

## Bayesian Networks

Bayesian networks represent conditional dependencies as directed acyclic graphs:

\`\`\`python
class BayesianNetwork:
    def __init__(self):
        self.nodes = {}
        self.edges = []
    
    def add_variable(self, name, parents, cpt):
        """Add variable with conditional probability table (CPT).
        
        CPT: Dictionary mapping parent assignments to probability distributions
        """
        self.nodes[name] = {
            "parents": parents,
            "cpt": cpt
        }
    
    def joint_probability(self, assignment):
        """Calculate P(X₁=x₁, X₂=x₂, ...) using chain rule."""
        probability = 1.0
        for variable, value in assignment.items():
            parents = self.nodes[variable]["parents"]
            parent_assignment = {p: assignment[p] for p in parents}
            probability *= self.nodes[variable]["cpt"][parent_assignment][value]
        return probability
\`\`\`

## Inference in Bayesian Networks

### Exact Inference: Enumeration

Calculate probability by enumerating all consistent assignments:

\`\`\`python
def inference_by_enumeration(network, query_var, observed):
    """Calculate P(Query | Observed)."""
    all_vars = set(network.nodes.keys())
    hidden_vars = all_vars - set(observed.keys()) - {query_var}
    
    numerator = 0
    for hidden_assignment in all_assignments(hidden_vars):
        full_assignment = {**observed, **hidden_assignment}
        for value in network.nodes[query_var]["cpt"]:
            full_assignment[query_var] = value
            numerator += network.joint_probability(full_assignment)
    
    denominator = 0
    for value in network.nodes[query_var]["cpt"]:
        observed[query_var] = value
        for hidden_assignment in all_assignments(hidden_vars):
            full_assignment = {**observed, **hidden_assignment}
            denominator += network.joint_probability(full_assignment)
    
    return numerator / denominator
\`\`\`

### Approximate Inference: Sampling

Estimate probabilities through random sampling:

\`\`\`python
def likelihood_weighting(network, query_var, observed, num_samples=10000):
    """Estimate P(Query | Observed) using likelihood weighting."""
    weights = {value: 0 for value in network.nodes[query_var]["cpt"]}
    
    for _ in range(num_samples):
        sample, weight = sample_with_observed(network, observed)
        weights[sample[query_var]] += weight
    
    total = sum(weights.values())
    return {value: weight / total for value, weight in weights.items()}
\`\`\`

## Sampling

Sampling algorithms generate random assignments from probability distributions.

### Rejection Sampling

Sample until we get a consistent assignment:

\`\`\`python
def rejection_sampling(network, query_var, observed, num_samples=10000):
    """Estimate P(Query | Observed) using rejection sampling."""
    counts = {}
    accepted = 0
    
    for _ in range(num_samples):
        sample = random_assignment(network)
        
        # Reject if inconsistent with observed
        if all(sample[var] == val for var, val in observed.items()):
            value = sample[query_var]
            counts[value] = counts.get(value, 0) + 1
            accepted += 1
    
    # Normalize
    total = sum(counts.values())
    return {value: count / total for value, count in counts.items()}
\`\`\`

## Markov Chains

Markov chains model sequences where future state depends only on current state:

\`\`\`
P(Xₜ | X₁, X₂, ..., Xₜ₋₁) = P(Xₜ | Xₜ₋₁)
\`\`\`

Represented by transition matrix T:

\`\`\`
T[i][j] = P(Xₜ = j | Xₜ₋₁ = i)
\`\`\`

Example: Weather transitions
\`\`\`
           Sunny  Rainy
Sunny      0.8    0.2
Rainy      0.3    0.7
\`\`\`

## Hidden Markov Models (HMM)

HMMs have hidden states and observable outputs:

\`\`\`python
class HiddenMarkovModel:
    def __init__(self, states, observations, transitions, emissions, initial):
        self.states = states
        self.observations = observations
        self.transitions = transitions  # P(Xₜ | Xₜ₋₁)
        self.emissions = emissions      # P(Eₜ | Xₜ)
        self.initial = initial          # P(X₁)
    
    def forward(self, observations):
        """Forward algorithm: compute probability of observations."""
        forward_probs = {state: self.initial[state] for state in self.states}
        
        for obs in observations:
            new_forward_probs = {}
            for state in self.states:
                prob = 0
                for prev_state in self.states:
                    prob += forward_probs[prev_state] * self.transitions[prev_state][state]
                prob *= self.emissions[state][obs]
                new_forward_probs[state] = prob
            forward_probs = new_forward_probs
        
        return sum(forward_probs.values())
\`\`\`

## Practical Example: Spam Detection

\`\`\`python
class SpamClassifier:
    def __init__(self):
        self.spam_words = {}
        self.ham_words = {}
        self.p_spam = 0.5
    
    def train(self, spam_emails, ham_emails):
        """Train classifier using naive Bayes."""
        self.p_spam = len(spam_emails) / (len(spam_emails) + len(ham_emails))
        
        for email in spam_emails:
            for word in email.split():
                self.spam_words[word] = self.spam_words.get(word, 0) + 1
        
        for email in ham_emails:
            for word in email.split():
                self.ham_words[word] = self.ham_words.get(word, 0) + 1
    
    def classify(self, email):
        """Classify email as spam or ham."""
        p_spam = self.p_spam
        p_ham = 1 - self.p_spam
        
        for word in email.split():
            p_word_given_spam = (self.spam_words.get(word, 0) + 1) / sum(self.spam_words.values())
            p_word_given_ham = (self.ham_words.get(word, 0) + 1) / sum(self.ham_words.values())
            
            p_spam *= p_word_given_spam
            p_ham *= p_word_given_ham
        
        return "Spam" if p_spam > p_ham else "Ham"
\`\`\`

## Summary

Probability theory provides a framework for reasoning under uncertainty. Conditional probability and Bayes' rule relate different probability distributions. Bayesian networks represent conditional dependencies graphically. Exact inference through enumeration and approximate inference through sampling enable prediction in probabilistic models. Markov chains and Hidden Markov Models model sequential data. These tools power applications from medical diagnosis to spam filtering.`,r=[{question:`What is the formula for conditional probability P(X | Y)?`,options:[`A. P(X) + P(Y)`,`B. P(X, Y) / P(Y)`,`C. P(X) * P(Y)`,`D. P(Y | X)`],correct:1},{question:`What does Bayes' rule calculate?`,options:[`A. P(Y | X)`,`B. P(X | Y)`,`C. P(X, Y)`,`D. P(X) + P(Y)`],correct:1},{question:`What assumption does Naive Bayes make?`,options:[`A. Events are always dependent`,`B. Features are conditionally independent given class`,`C. All features have same weight`,`D. No dependencies exist`],correct:1},{question:`What is the key property of Markov chains?`,options:[`A. Future depends on entire history`,`B. Future depends only on current state`,`C. States are always independent`,`D. Time is discrete`],correct:1}],i=[{front:`What is the formula for Bayes' rule?`,back:`P(X | Y) = P(Y | X) * P(X) / P(Y). This relates the posterior probability P(X|Y) to the likelihood P(Y|X), prior P(X), and evidence P(Y). It's fundamental for updating beliefs based on new evidence.`},{front:`What is a joint probability distribution?`,back:`A joint probability distribution P(X, Y) specifies the probability of all possible combinations of values for multiple variables. All entries must sum to 1, and it contains complete information about the variables' relationship.`},{front:`What is the key assumption of Naive Bayes?`,back:`Naive Bayes assumes that features are conditionally independent given the class. This simplification allows computing P(Features|Class) as a product of individual feature probabilities, making the algorithm tractable even with many features.`},{front:`What is a Bayesian network?`,back:`A Bayesian network is a directed acyclic graph where nodes represent random variables and edges represent conditional dependencies. Each node has a conditional probability table (CPT) specifying its distribution given parent values.`},{front:`What is the Markov property?`,back:`The Markov property states that the future state depends only on the current state, not the entire history: P(Xt | X1, X2, ..., Xt-1) = P(Xt | Xt-1). This memoryless property enables efficient modeling of sequential data.`},{front:`How do Hidden Markov Models differ from regular Markov chains?`,back:`HMMs have hidden states that we cannot directly observe and observable outputs that we can see. The hidden state evolves according to transition probabilities, and each state generates observations according to emission probabilities.`},{front:`What is the difference between marginal and conditional probability?`,back:`Marginal probability P(X) is the probability of X regardless of other variables, calculated by summing over all values of other variables. Conditional probability P(X|Y) is the probability of X given we know Y's value.`},{front:`What problem does rejection sampling solve in Bayesian networks?`,back:`Rejection sampling estimates probabilities by sampling random assignments and keeping only those consistent with observed evidence. It provides approximate inference when exact inference through enumeration becomes computationally expensive.`}],a=`Week 2 introduced probability theory for reasoning under uncertainty. Conditional probability and Bayes' rule relate probability distributions. Bayesian networks represent conditional dependencies graphically. Exact inference through enumeration and approximate inference through sampling enable prediction. Markov chains model sequential dependencies where future state depends only on current state. Hidden Markov Models combine hidden states with observable outputs. These probabilistic models power applications from medical diagnosis to speech recognition.`,o={title:e,source:t,content:n,quiz:r,flashcards:i,summary:a};export{n as content,o as default,i as flashcards,r as quiz,t as source,a as summary,e as title};