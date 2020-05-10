const jwt = require('jsonwebtoken');

// To protect Routes
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decode;
        next();
    } catch(err) {
        return res.status(401).json({
            message: 'Authentication Failed! (JWT Verification Failed)'
        });
    }
}