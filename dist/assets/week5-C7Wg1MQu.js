var e=`Week 5 — Neural Networks`,t=`CS50 AI 2024 — Lecture 5`,n=`# Neural Networks: Deep Learning Foundations

## Introduction

Neural networks are inspired by biological neurons and can learn complex non-linear relationships. Deep learning uses multiple layers to extract hierarchical features.

## Artificial Neurons

An artificial neuron performs a weighted sum followed by non-linearity:

\`\`\`
z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
a = σ(z)
\`\`\`

Where w are weights, b is bias, and σ is activation function.

## Activation Functions

### Sigmoid

Squashes output to (0, 1):

\`\`\`
σ(z) = 1 / (1 + e^(-z))
\`\`\`

### ReLU (Rectified Linear Unit)

Identity for positive values, zero for negative:

\`\`\`
ReLU(z) = max(0, z)
\`\`\`

Most popular in hidden layers.

### Tanh

Squashes output to (-1, 1):

\`\`\`
tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))
\`\`\`

### Softmax

For multi-class output, converts to probability distribution:

\`\`\`
softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ
\`\`\`

## Neural Network Architecture

\`\`\`python
from tensorflow import keras
from tensorflow.keras import layers

# Create sequential model
model = keras.Sequential([
    layers.Input(shape=(784,)),  # Input layer
    layers.Dense(128, activation='relu'),  # Hidden layer 1
    layers.Dense(64, activation='relu'),   # Hidden layer 2
    layers.Dense(10, activation='softmax') # Output layer (10 classes)
])
\`\`\`

Layers transform inputs through learned weights and biases.

## Backpropagation

Backpropagation computes gradients of loss with respect to weights:

\`\`\`python
def backpropagation(network, x, y, learning_rate=0.1):
    """Simplified backpropagation."""
    # Forward pass
    activations = [x]
    z_values = []
    
    for layer in network:
        z = layer.compute_z(activations[-1])
        a = layer.activation(z)
        z_values.append(z)
        activations.append(a)
    
    # Backward pass
    delta = compute_output_delta(activations[-1], y, z_values[-1])
    
    for i in range(len(network) - 1, 0, -1):
        delta = network[i].weight.T @ delta * network[i-1].activation_derivative(z_values[i-1])
        network[i].weight -= learning_rate * delta @ activations[i-1].T
        network[i].bias -= learning_rate * delta
\`\`\`

## Gradient Descent

Iteratively update weights in direction of steepest descent:

\`\`\`python
# Batch gradient descent (all data)
for epoch in range(epochs):
    predictions = model.predict(X)
    gradients = compute_gradients(predictions, y)
    weights -= learning_rate * gradients

# Stochastic gradient descent (one sample)
for epoch in range(epochs):
    for x_i, y_i in zip(X, y):
        prediction = model.predict(x_i)
        gradients = compute_gradients(prediction, y_i)
        weights -= learning_rate * gradients

# Mini-batch gradient descent (compromise)
for epoch in range(epochs):
    for batch in create_minibatches(X, y, batch_size=32):
        predictions = model.predict(batch.X)
        gradients = compute_gradients(predictions, batch.y)
        weights -= learning_rate * gradients
\`\`\`

## Deep Neural Networks

Multiple hidden layers enable learning complex patterns:

\`\`\`python
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout

model = Sequential([
    Dense(256, activation='relu', input_shape=(784,)),
    Dropout(0.2),  # Regularization
    Dense(128, activation='relu'),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train, y_train, epochs=20, batch_size=128, validation_split=0.1)
\`\`\`

## Convolutional Neural Networks (CNN)

CNNs excel at image processing through local connections and shared weights:

\`\`\`python
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
\`\`\`

### Convolutional Layers

Apply filters across input to detect features:

\`\`\`
Output size = (Input - Filter + 2*Padding) / Stride + 1
\`\`\`

### Pooling Layers

Reduce spatial dimensions:

\`\`\`python
# Max pooling: take maximum
# Average pooling: take average
MaxPooling2D((2, 2))  # 2x2 pool, stride 2
\`\`\`

## Recurrent Neural Networks (RNN)

RNNs process sequences by maintaining state:

\`\`\`python
from tensorflow.keras import Sequential
from tensorflow.keras.layers import LSTM, Dense

model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(sequence_length, feature_dim)),
    LSTM(64),
    Dense(32, activation='relu'),
    Dense(1)  # Prediction
])
\`\`\`

### Long Short-Term Memory (LSTM)

LSTMs overcome vanishing gradient problem:

\`\`\`
Forget gate: fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf)
Input gate: iₜ = σ(Wᵢ·[hₜ₋₁, xₜ] + bᵢ)
Candidate: C̃ₜ = tanh(Wc·[hₜ₋₁, xₜ] + bc)
Cell state: Cₜ = fₜ * Cₜ₋₁ + iₜ * C̃ₜ
Output gate: oₜ = σ(Wₒ·[hₜ₋₁, xₜ] + bₒ)
Hidden: hₜ = oₜ * tanh(Cₜ)
\`\`\`

## Loss Functions

### Mean Squared Error (Regression)

\`\`\`
MSE = (1/n) * Σ(yᵢ - ŷᵢ)²
\`\`\`

### Cross-Entropy (Classification)

\`\`\`
CE = -Σᵢ yᵢ * log(ŷᵢ)
\`\`\`

## Regularization Techniques

### Dropout

Randomly deactivate neurons during training:

\`\`\`python
from tensorflow.keras.layers import Dropout

model = Sequential([
    Dense(128, activation='relu'),
    Dropout(0.5),  # 50% dropout
    Dense(64, activation='relu'),
    Dropout(0.5),
    Dense(10, activation='softmax')
])
\`\`\`

### Early Stopping

Stop training when validation loss stops improving:

\`\`\`python
from tensorflow.keras.callbacks import EarlyStopping

callback = EarlyStopping(monitor='val_loss', patience=5)
model.fit(X_train, y_train, epochs=100, callbacks=[callback], validation_split=0.2)
\`\`\`

## Practical Example: MNIST Classification

\`\`\`python
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout

# Load data
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()
X_train = X_train.astype('float32') / 255
X_test = X_test.astype('float32') / 255

y_train = tf.keras.utils.to_categorical(y_train, 10)
y_test = tf.keras.utils.to_categorical(y_test, 10)

# Build model
model = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(512, activation='relu'),
    Dropout(0.2),
    Dense(256, activation='relu'),
    Dropout(0.2),
    Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train
model.fit(X_train, y_train, epochs=10, batch_size=128, validation_split=0.1)

# Evaluate
accuracy = model.evaluate(X_test, y_test)[1]
print(f"Test Accuracy: {accuracy:.4f}")
\`\`\`

## Summary

Neural networks combine weighted inputs with non-linear activations. Backpropagation computes gradients for learning. Gradient descent updates weights iteratively. CNNs excel at image processing through convolution and pooling. RNNs process sequences maintaining state, with LSTMs overcoming vanishing gradients. Proper loss functions, regularization (dropout, early stopping), and architecture design enable effective deep learning. Understanding these fundamentals is essential for modern AI applications.`,r=[{question:`What does a ReLU activation function do?`,options:[`A. Squashes to (0, 1)`,`B. Returns max(0, z)`,`C. Applies sigmoid`,`D. Normalizes input`],correct:1},{question:`What is backpropagation?`,options:[`A. Forward pass through network`,`B. Computing gradients of loss with respect to weights`,`C. Training data preprocessing`,`D. Model validation`],correct:1},{question:`What is the purpose of dropout in neural networks?`,options:[`A. Remove layers`,`B. Randomly deactivate neurons to prevent overfitting`,`C. Increase learning rate`,`D. Speed up training`],correct:1},{question:`What is an LSTM layer used for?`,options:[`A. Image processing`,`B. Processing sequences while addressing vanishing gradients`,`C. Classification only`,`D. Dimensionality reduction`],correct:1}],i=`Week 5 covered neural networks for deep learning. Artificial neurons combine weighted inputs with activation functions. Backpropagation computes gradients for efficient learning. Gradient descent updates weights iteratively. CNNs use convolution and pooling for image processing. RNNs process sequences maintaining state, with LSTMs overcoming vanishing gradient problems. Regularization techniques (dropout, early stopping) prevent overfitting. Understanding architectures and training procedures enables building effective deep learning models.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};