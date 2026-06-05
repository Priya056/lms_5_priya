var e=`Week 6 — Language`,t=`CS50 AI 2024 — Lecture 6`,n=`# Natural Language Processing: Understanding Language

## Introduction

Natural Language Processing (NLP) enables machines to understand and generate human language. It encompasses tasks from text classification to translation to dialogue.

## Tokenization

Break text into individual tokens (words, subwords, characters):

\`\`\`python
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize

text = "Hello, world! How are you?"

# Word tokenization
words = word_tokenize(text)
print(words)  # ['Hello', ',', 'world', '!', 'How', 'are', 'you', '?']

# Sentence tokenization
sentences = sent_tokenize(text)
print(sentences)  # ['Hello, world!', 'How are you?']
\`\`\`

## N-grams

N-grams are sequences of n consecutive tokens:

\`\`\`python
from nltk.util import ngrams

words = ['I', 'love', 'machine', 'learning']

bigrams = list(ngrams(words, 2))
print(bigrams)  # [('I', 'love'), ('love', 'machine'), ('machine', 'learning')]

trigrams = list(ngrams(words, 3))
print(trigrams)  # [('I', 'love', 'machine'), ('love', 'machine', 'learning')]
\`\`\`

N-gram language models predict next word based on previous n-1 words.

## Bag of Words

Represent text as word frequencies:

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer

corpus = [
    'I love machine learning',
    'Machine learning is great',
    'I love Python'
]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus)
print(X.toarray())
# [[1, 1, 0, 1, 0, 1],
#  [0, 1, 1, 0, 1, 1],
#  [1, 1, 0, 0, 0, 1]]
\`\`\`

Simple but loses word order and context.

## TF-IDF (Term Frequency-Inverse Document Frequency)

Weights words by importance:

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(corpus)
print(X.toarray())
\`\`\`

Formula:
\`\`\`
TF-IDF(term, doc) = TF(term, doc) * IDF(term)
IDF(term) = log(N / n_docs_with_term)
\`\`\`

## Word Embeddings

Represent words as dense vectors capturing semantic meaning.

### Word2Vec

Skip-gram model predicts context from target word:

\`\`\`python
from gensim.models import Word2Vec

sentences = [
    ['machine', 'learning', 'is', 'powerful'],
    ['deep', 'learning', 'uses', 'neural', 'networks']
]

model = Word2Vec(sentences, vector_size=100, window=3, min_count=1)

# Get word vector
vector = model.wv['learning']
print(vector.shape)  # (100,)

# Find similar words
similar = model.wv.most_similar('learning', topn=3)
print(similar)

# Perform analogies
result = model.wv.most_similar(positive=['king', 'woman'], negative=['man'])
print(result)  # Should be close to 'queen'
\`\`\`

### GloVe

Combines matrix factorization with word co-occurrence statistics.

## Transformer Architecture

Transformers revolutionized NLP through self-attention:

\`\`\`
Self-Attention(Q, K, V) = softmax(QK^T / √d) V
\`\`\`

Where Q (query), K (key), V (value) are learned projections.

## BERT (Bidirectional Encoder Representations from Transformers)

Bidirectional pre-training on masked language modeling:

\`\`\`python
from transformers import AutoTokenizer, AutoModel

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

text = "Machine learning is fascinating"
inputs = tokenizer(text, return_tensors="pt")
outputs = model(**inputs)

# Get token embeddings
token_embeddings = outputs.last_hidden_state
print(token_embeddings.shape)  # (1, num_tokens, 768)
\`\`\`

BERT is pre-trained on masked language modeling (MLM) and next sentence prediction (NSP).

## GPT (Generative Pre-trained Transformer)

Unidirectional language model for text generation:

\`\`\`python
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import torch

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

prompt = "Once upon a time"
input_ids = tokenizer.encode(prompt, return_tensors="pt")

output = model.generate(input_ids, max_length=50)
text = tokenizer.decode(output[0])
print(text)
\`\`\`

## Attention Mechanism

Attention computes weighted sum of values based on query-key similarity:

\`\`\`python
import torch
import torch.nn as nn

class AttentionLayer(nn.Module):
    def __init__(self, hidden_dim):
        super().__init__()
        self.query = nn.Linear(hidden_dim, hidden_dim)
        self.key = nn.Linear(hidden_dim, hidden_dim)
        self.value = nn.Linear(hidden_dim, hidden_dim)
    
    def forward(self, x):
        Q = self.query(x)  # (batch, seq_len, hidden_dim)
        K = self.key(x)
        V = self.value(x)
        
        # Compute attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (K.shape[-1] ** 0.5)
        weights = torch.softmax(scores, dim=-1)
        
        # Apply attention to values
        output = torch.matmul(weights, V)
        return output
\`\`\`

## Practical Example: Sentiment Analysis

\`\`\`python
from transformers import pipeline

# Zero-shot sentiment classification
classifier = pipeline("sentiment-analysis")

texts = [
    "I love this product!",
    "This is terrible",
    "It's okay, nothing special"
]

for text in texts:
    result = classifier(text)
    print(f"{text}: {result}")
\`\`\`

## Language Models

Autoregressive models predict next token given previous tokens:

\`\`\`python
def language_model_prediction(model, context, num_predictions=10):
    """Generate text from language model."""
    output = context
    
    for _ in range(num_predictions):
        # Predict next token
        next_token_probs = model(output)
        next_token = sample_from_distribution(next_token_probs)
        output.append(next_token)
    
    return output
\`\`\`

## Sequence-to-Sequence Models

Translate input sequences to output sequences:

\`\`\`python
from transformers import MarianMTModel, MarianTokenizer

model_name = "Helsinki-NLP/Opus-MT-en-es"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

text = "Good morning"
inputs = tokenizer(text, return_tensors="pt")
outputs = model.generate(**inputs)
translation = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(translation)  # "Buenos días"
\`\`\`

## Practical Example: Named Entity Recognition

\`\`\`python
from transformers import pipeline

ner = pipeline("ner")

text = "Apple Inc. was founded by Steve Jobs in Cupertino, California."
entities = ner(text)

for entity in entities:
    print(f"{entity['word']}: {entity['entity']}")
\`\`\`

## Text Classification

\`\`\`python
from transformers import pipeline

classifier = pipeline("zero-shot-classification")

text = "The film was amazing"
candidate_labels = ["positive", "negative", "neutral"]

result = classifier(text, candidate_labels)
print(result)
# {'sequence': ..., 'labels': ['positive', 'neutral', 'negative'], 
#  'scores': [0.97, 0.02, 0.01]}
\`\`\`

## Summary

NLP processes text through tokenization and representation. Bag-of-words and TF-IDF provide simple representations. Word embeddings (Word2Vec, GloVe) capture semantic meaning in dense vectors. Transformers revolutionized NLP through self-attention mechanism. BERT provides bidirectional pre-trained representations. GPT enables text generation. Attention mechanisms weight importance of different words. Pre-trained models from libraries like Hugging Face enable practical NLP tasks from classification to translation.`,r=[{question:`What is tokenization in NLP?`,options:[`A. Converting text to lowercase`,`B. Breaking text into individual tokens (words, subwords)`,`C. Removing punctuation`,`D. Counting word frequency`],correct:1},{question:`What is the main benefit of word embeddings over bag-of-words?`,options:[`A. Smaller file size`,`B. Captures semantic meaning in continuous space`,`C. Faster training`,`D. No preprocessing needed`],correct:1},{question:`What is the key innovation of the Transformer architecture?`,options:[`A. Recurrent connections`,`B. Self-attention mechanism`,`C. Convolutional layers`,`D. Dropout regularization`],correct:1},{question:`What is the difference between BERT and GPT?`,options:[`A. BERT is faster`,`B. BERT is bidirectional, GPT is unidirectional`,`C. GPT is for classification only`,`D. No significant difference`],correct:1}],i=`Week 6 covered Natural Language Processing for understanding language. Tokenization breaks text into tokens. Bag-of-words and TF-IDF provide simple representations. Word embeddings (Word2Vec, GloVe) capture semantic meaning. Transformers use self-attention for powerful representations. BERT provides bidirectional pre-training. GPT enables text generation. These techniques power applications from sentiment analysis to machine translation to dialogue systems.`,a={title:e,source:t,content:n,quiz:r,summary:i};export{n as content,a as default,r as quiz,t as source,i as summary,e as title};