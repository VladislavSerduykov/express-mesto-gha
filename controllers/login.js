const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { UnauthorizedError } = require('../errors/errors');

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    });
}

module.exports = { login };
