var { User } = require('../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-authe');
  User.findByToken(token)
    .then(foundUser => {
      if (!foundUser) {
        return Promise.reject();
      }
      req.user = foundUser;
      req.token = token;
      next();
    })
    .catch(e => res.status(403).send())
};

module.exports = { authenticate };