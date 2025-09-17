const { User } = require('../models');
const { generateToken } = require('../config/jwt');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: 'Username already exists'
      });
    }

    // Create new user (password will be hashed automatically by the model)
    const user = new User({
      username,
      password
    });

    await user.save();

    console.log(`[INFO] New user registered: ${username}`);

    res.status(201).json({
      userId: user._id,
      username: user.username,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('[ERROR] Registration error:', error);
    res.status(500).json({
      message: 'Internal server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      username: user.username
    });

    console.log(`[INFO] User logged in: ${username}`);

    res.status(200).json({
      token,
      user: {
        userId: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('[ERROR] Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login'
    });
  }
};

module.exports = {
  register,
  login
};