const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Middleware
app.use(express.json());

// CORS middleware - pozwala na żądania z przeglądarki
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure tasks.json exists
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read tasks from file
function readTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return data.trim() === '' ? [] : JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
}

// Helper function to write tasks to file
function writeTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing tasks file:', error);
    return false;
  }
}

// Helper function to generate next ID
function getNextId(tasks) {
  if (tasks.length === 0) return 1;
  const maxId = Math.max(...tasks.map(task => task.id));
  return maxId + 1;
}

// GET /
app.get('/', (req, res) => {
  res.json({
    message: 'TODO List API',
    endpoints: {
      'GET /health': 'Check API status',
      'GET /tasks': 'Get all tasks',
      'POST /tasks': 'Create a new task',
      'PUT /tasks/:id': 'Update a task'
    }
  });
});

// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// GET /tasks
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  // Validation
  if (!title) {
    return res.status(400).json({
      error: 'Title is required'
    });
  }

  const tasks = readTasks();
  const newTask = {
    id: getNextId(tasks),
    title: title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  if (writeTasks(tasks)) {
    res.status(201).json(newTask);
  } else {
    res.status(500).json({
      error: 'Failed to save task'
    });
  }
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Task not found',
      id: taskId
    });
  }

  // Update task
  const updatedTask = {
    ...tasks[taskIndex],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;

  if (writeTasks(tasks)) {
    res.json(updatedTask);
  } else {
    res.status(500).json({
      error: 'Failed to update task'
    });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

