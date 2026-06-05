var e=`Week 4 — Learning`,t=`CS50 AI 2024 — Lecture 4`,n=`# Learning: Machine Learning Fundamentals

## Introduction

Machine learning enables computers to learn patterns from data without explicit programming. Supervised learning trains on labeled data to predict outcomes for new inputs.

## Supervised Learning

Supervised learning maps inputs to labeled outputs using training data.

### Regression

Predicts continuous values:

\`\`\`python
from sklearn.linear_model import LinearRegression

X = [[1], [2], [3], [4], [5]]
y = [2, 4, 5, 4, 5]

model = LinearRegression()
model.fit(X, y)

prediction = model.predict([[6]])
print(prediction)  # [5.2]
\`\`\`

### Classification

Predicts categorical labels:

\`\`\`python
from sklearn.tree import DecisionTreeClassifier

X = [[1, 2], [2, 3], [3, 1], [4, 3]]
y = [0, 0, 1, 1]

model = DecisionTreeClassifier()
model.fit(X, y)

prediction = model.predict([[2, 2]])
print(prediction)  # [0]
\`\`\`

## k-Nearest Neighbors (kNN)

Classifies by majority vote of k nearest neighbors:

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier

X_train = [[1, 2], [2, 3], [3, 1], [4, 3]]
y_train = [0, 0, 1, 1]

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

X_test = [[2, 2]]
prediction = model.predict(X_test)
print(prediction)  # Prediction based on 3 nearest neighbors
\`\`\`

**Properties**:
- Simple and intuitive
- No training phase (lazy learner)
- Can be slow for prediction
- Sensitive to irrelevant features

## Perceptron

Simple linear classifier:

\`\`\`python
from sklearn.linear_model import Perceptron

X = [[1, 2], [2, 3], [3, 1], [4, 3]]
y = [0, 0, 1, 1]

model = Perceptron()
model.fit(X, y)

prediction = model.predict([[2, 2]])
print(prediction)
\`\`\`

Perceptron algorithm:

\`\`\`python
def perceptron(X, y, epochs=100, learning_rate=0.1):
    """Simple perceptron learning algorithm."""
    weights = [0] * len(X[0])
    bias = 0
    
    for epoch in range(epochs):
        for x_i, y_i in zip(X, y):
            # Prediction
            prediction = sum(w * x for w, x in zip(weights, x_i)) + bias
            prediction = 1 if prediction > 0 else 0
            
            # Update weights
            error = y_i - prediction
            for j in range(len(weights)):
                weights[j] += learning_rate * error * x_i[j]
            bias += learning_rate * error
    
    return weights, bias
\`\`\`

## Support Vector Machines (SVM)

Finds optimal separating hyperplane:

\`\`\`python
from sklearn.svm import SVC

X = [[1, 2], [2, 3], [3, 1], [4, 3]]
y = [0, 0, 1, 1]

model = SVC(kernel='linear')
model.fit(X, y)

prediction = model.predict([[2.5, 2.5]])
print(prediction)
\`\`\`

Kernels enable non-linear classification:
- \`linear\`: Linear decision boundary
- \`poly\`: Polynomial decision boundary
- \`rbf\`: Radial basis function (complex boundaries)

## Decision Trees

Hierarchical structure of decisions:

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn import tree

X = [[1, 2], [2, 3], [3, 1], [4, 3]]
y = [0, 0, 1, 1]

model = DecisionTreeClassifier(max_depth=2)
model.fit(X, y)

# Visualize tree
tree.plot_tree(model, feature_names=['X1', 'X2'])
\`\`\`

**Properties**:
- Interpretable and easy to understand
- Can overfit easily
- No input scaling needed

## Overfitting and Regularization

Overfitting occurs when model memorizes training data instead of learning patterns.

### Regularization

Add penalty for complexity:

\`\`\`python
from sklearn.linear_model import LogisticRegression

# L2 regularization (Ridge)
model = LogisticRegression(penalty='l2', C=1.0)

# L1 regularization (Lasso)
model = LogisticRegression(penalty='l1', solver='liblinear')

# No regularization
model = LogisticRegression(penalty=None)
\`\`\`

### Cross-Validation

Evaluate model on different data splits:

\`\`\`python
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier

X = [[1, 2], [2, 3], [3, 1], [4, 3], [5, 2], [6, 1]]
y = [0, 0, 1, 1, 0, 1]

model = DecisionTreeClassifier()
scores = cross_val_score(model, X, y, cv=3)  # 3-fold cross-validation
print(scores.mean())  # Average score
\`\`\`

k-fold cross-validation:
1. Divide data into k parts
2. Train on k-1 parts, test on remaining
3. Repeat k times
4. Average results

## Ensemble Methods

Combine multiple models for better predictions.

### Random Forest

Average predictions from multiple decision trees:

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

X = [[1, 2], [2, 3], [3, 1], [4, 3]]
y = [0, 0, 1, 1]

model = RandomForestClassifier(n_estimators=10)
model.fit(X, y)

prediction = model.predict([[2.5, 2.5]])
print(prediction)
\`\`\`

### Gradient Boosting

Sequentially build trees to correct previous errors:

\`\`\`python
from sklearn.ensemble import GradientBoostingClassifier

X = [[1, 2], [2, 3], [3, 1], [4, 3]]
y = [0, 0, 1, 1]

model = GradientBoostingClassifier(n_estimators=100)
model.fit(X, y)

prediction = model.predict([[2.5, 2.5]])
print(prediction)
\`\`\`

## Practical Example: Iris Classification

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

# Load data
iris = load_iris()
X = iris.data
y = iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2%}")

# Feature importance
for i, importance in enumerate(model.feature_importances_):
    print(f"{iris.feature_names[i]}: {importance:.4f}")
\`\`\`

## Evaluation Metrics

### Accuracy
Proportion of correct predictions:

\`\`\`
Accuracy = (TP + TN) / (TP + TN + FP + FN)
\`\`\`

### Precision and Recall

\`\`\`
Precision = TP / (TP + FP)  # Of predictions correct?
Recall = TP / (TP + FN)     # Of actual correct found?
\`\`\`

### F1 Score
Harmonic mean of precision and recall:

\`\`\`
F1 = 2 * (Precision * Recall) / (Precision + Recall)
\`\`\`

## Summary

Supervised learning trains on labeled data to predict new examples. Regression predicts continuous values, classification predicts categories. kNN classifies by neighbor voting. Perceptron performs linear classification. SVM finds optimal separating hyperplanes. Decision trees create interpretable models. Overfitting occurs when models memorize rather than generalize; cross-validation and regularization prevent this. Ensemble methods combine multiple models for better predictions. Proper evaluation using accuracy, precision, recall, and F1 score ensures model reliability.`,r=[{question:`What is the main difference between regression and classification?`,options:[`A. Regression uses numbers, classification uses text`,`B. Regression predicts continuous values, classification predicts categories`,`C. Regression is faster than classification`,`D. They are equivalent`],correct:1},{question:`How does k-Nearest Neighbors classify new data?`,options:[`A. Calculates distance to all points`,`B. Uses k nearest neighbors' majority vote`,`C. Finds average of k nearest`,`D. Uses weighted sum`],correct:1},{question:`What is overfitting?`,options:[`A. Model fits perfectly`,`B. Model memorizes training data instead of learning patterns`,`C. Model is too simple`,`D. Model uses wrong features`],correct:1},{question:`What does cross-validation do?`,options:[`A. Trains multiple models`,`B. Validates on different data splits`,`C. Increases training accuracy`,`D. Compares model types`],correct:1}],i=`Week 4 introduced supervised learning for predicting labeled outcomes. Regression predicts continuous values while classification predicts categories. kNN classifies by neighbor voting, perceptron performs linear classification, SVM finds optimal hyperplanes, and decision trees create interpretable hierarchies. Overfitting occurs when models memorize data; cross-validation and regularization prevent this. Ensemble methods (random forest, gradient boosting) combine multiple models for better predictions. Proper evaluation using accuracy, precision, recall, and F1 score ensures reliability.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};