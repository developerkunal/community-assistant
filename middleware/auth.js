const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //
    if (!token) {
        return res.status(401).json({
            msg: 'No Auth Token Found'
        });
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSec'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            msg: 'token is not valid'
        });
    }
}