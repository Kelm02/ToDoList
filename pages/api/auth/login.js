// pages/api/auth/login.js
import jwt from 'jsonwebtoken';

// Mock user data for demonstration purposes
const users = [
  { email: 'test@example.com', password: 'password123' }, // Replace with actual user data
  { email: 'user@domain.com', password: 'password456' },
];

export default (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find((user) => user.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token in response
    res.status(200).json({ token });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
