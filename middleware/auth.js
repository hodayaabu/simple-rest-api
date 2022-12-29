const jwt = require('jsonwebtoken');
const config = require('config');

//Create function to auth a user by token
function auth(req, res, next) {
    const token = req.header('x-user-token');

    if (!token) {
        res.status(401).send('Access denied, no token provide');
        return;
    }

    try {
        const userInfo = jwt.verify(token, config.get("jwtKey"));
        req.user = userInfo;
        next();
    } catch (err) {
        res.status(401).send('Access denied, invalid token');
    }
}

module.exports = auth;