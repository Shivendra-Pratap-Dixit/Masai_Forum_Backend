const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');
require("dotenv").config()
const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

       
        const decoded = jwt.verify(token,process.env.Secretkey);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = authMiddleware;
