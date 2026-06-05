export const courses = [
  {
    id: 'cs50p',
    title: "CS50's Introduction to Programming with Python",
    shortTitle: 'CS50 Python',
    description: "Harvard's introduction to programming using Python. Learn the art of programming using Python — a popular language for general-purpose programming, data science, web development, and more.",
    icon: '🐍',
    totalWeeks: 10,
    totalProblems: 15,
    color: '#22c55e',
  },
  {
    id: 'cs50ai',
    title: "CS50's Introduction to Artificial Intelligence with Python",
    shortTitle: 'CS50 AI',
    description: "Explore the concepts and algorithms at the foundation of modern artificial intelligence — from graph search algorithms to machine learning to large language models.",
    icon: '🤖',
    totalWeeks: 7,
    totalProblems: 12,
    color: '#8b5cf6',
  },
];

export const weekLabels = {
  cs50p: [
    'Functions, Variables',
    'Conditionals',
    'Loops',
    'Exceptions',
    'Libraries',
    'Unit Tests',
    'File I/O',
    'Regular Expressions',
    'Object-Oriented Programming',
    'Et Cetera',
  ],
  cs50ai: [
    'Search',
    'Knowledge',
    'Uncertainty',
    'Optimization',
    'Learning',
    'Neural Networks',
    'Language',
  ],
};
