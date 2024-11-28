import jwt from 'jsonwebtoken';

let todos = [];

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verify token using JWT_SECRET
  } catch (error) {
    return null; // Return null if token is invalid
  }
};

export default (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  // If no token is provided, return unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify the token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  // Handle GET request to fetch todos
  if (req.method === 'GET') {
    res.status(200).json(todos);
  }

  // Handle POST request to add a new todo
  else if (req.method === 'POST') {
    const { text, priority, dueDate } = req.body;
    if (text) {
      const newTodo = { id: Date.now(), text, priority, dueDate, completed: false };
      todos.push(newTodo);
      res.status(201).json(newTodo);
    } else {
      res.status(400).json({ error: 'Text is required' });
    }
  }

  // Handle PUT request to update a todo (e.g., mark as completed, edit)
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const { text, completed, priority, dueDate } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex !== -1) {
      todos[todoIndex] = { ...todos[todoIndex], text, completed, priority, dueDate };
      res.status(200).json(todos[todoIndex]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  }

  // Handle DELETE request to delete a todo
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex !== -1) {
      todos = todos.filter(todo => todo.id !== parseInt(id));
      res.status(200).json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
