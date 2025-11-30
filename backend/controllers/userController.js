const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' }); // Expires in 3 days
};

// Login user authentication with token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password); // Assuming the User model has a static login method
        const token = createToken(user._id); // Generate JWT token with the user's _id
        
        // Send back userId along with the token and other data
        res.status(200).json({
            userId: user._id,   // Add the userId explicitly
            email: user.email,  // Include email for convenience if needed
            userName: user.name, // Add userName if you need it
            token,               // Send the JWT token
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Sign up user
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received signup request:', req.body); // Log the incoming request data

    try {
        const user = await User.signup(name, email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, user, token });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture 

            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

const getStoryById = async (req, res) => {
    try {
      const story = await Story.findById(req.params.id); 
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      res.json(story); 
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = { signupUser, loginUser, getUserProfile, getStoryById };
