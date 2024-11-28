import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  // Fetch todos from API or Local Storage
  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      try {
        const response = await axios.get('/api/todos', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token with the request
          },
        });
        setTodos(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized, token may be expired or invalid');
        } else {
          console.error('Error fetching todos:', error);
        }
      }
    };

    fetchTodos();
  }, []);

  // Store todos in Local Storage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const newTodoItem = { text: newTodo, priority, dueDate, completed: false };
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('/api/todos', newTodoItem, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTodos([...todos, response.data]);
          setNewTodo('');
          setPriority('');
          setDueDate('');
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
    }
  };

  // Toggle completion status
  const handleToggleCompleted = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const todoToUpdate = todos.find(todo => todo.id === id);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
        await axios.put(`/api/todos?id=${id}`, updatedTodo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  // Edit todo text
  const handleEditTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const updatedTodo = { id, text: editText, priority, dueDate };
        const response = await axios.put(`/api/todos?id=${id}`, updatedTodo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
        setEditTodoId(null);
        setEditText('');
        setPriority('');
        setDueDate('');
      } catch (error) {
        console.error('Error editing todo:', error);
      }
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete(`/api/todos?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return filter === 'completed' ? todo.completed : !todo.completed;
  });

  // Sort todos
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.text.localeCompare(b.text);
    } else {
      return b.text.localeCompare(a.text);
    }
  });

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTodos([]); // Clear todos after logout
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  };

  const inputContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    width: '60%',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '10px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c63ff',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#5a54e6',
  };

  const ulStyle = {
    listStyleType: 'none',
    paddingLeft: '0',
  };

  const liStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    margin: '8px 0',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const deleteButtonStyle = {
    backgroundColor: '#ff5c5c',
  };

  const deleteButtonHoverStyle = {
    backgroundColor: '#e04e4e',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Todo List</h1>

      {/* Login / Logout Button */}
      {!isLoggedIn ? (
        <button onClick={() => window.location.href = '/login'} style={buttonStyle}>
          Login
        </button>
      ) : (
        <button onClick={handleLogout} style={buttonStyle}>
          Logout
        </button>
      )}

      {/* Add new todo input */}
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={handleAddTodo}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Add Todo
        </button>
      </div>

      {/* Filter and Sort Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <select onChange={(e) => setFilter(e.target.value)} style={{ padding: '10px' }}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '10px' }}>
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </select>
      </div>

      {/* Todo List */}
      <ul style={ulStyle}>
        {sortedTodos.map(todo => (
          <li key={todo.id} style={liStyle}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo.id)}
            />
            {editTodoId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit your todo"
                  style={inputStyle}
                />
                <button onClick={() => handleEditTodo(todo.id)} style={buttonStyle}>Save</button>
              </div>
            ) : (
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text} {todo.priority && `(Priority: ${todo.priority})`} {todo.dueDate && `(Due: ${todo.dueDate})`}
              </span>
            )}
            <button
              onClick={() => setEditTodoId(todo.id)}
              style={buttonStyle}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              style={deleteButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = deleteButtonHoverStyle.backgroundColor}
              onMouseOut={(e) => e.target.style.backgroundColor = deleteButtonStyle.backgroundColor}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
