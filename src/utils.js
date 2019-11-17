const jwt = require('jsonwebtoken');

const JWT_SECRET = 'some-secret';

function getUserId(context) {
  const authroizationHeader = context.request.get('Authorization');

  if (authroizationHeader) {
    const token = authroizationHeader.replace('Bearer ', '');
    const { userId } = jwt.verify(token, JWT_SECRET);

    return userId;
  };

  throw new Error('Not authenticated');
}

module.exports = {
  JWT_SECRET,
  getUserId,
};