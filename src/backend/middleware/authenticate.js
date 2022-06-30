const userModel = require('../models/user');

const authenticate = async (req, res, next) => {
  const userId = req.session?.userId;

  if (!userId)
    return res.status(401).json({
      statusCode: 401,
      message: 'User not authenticated',
    });

  const user = await userModel.findById(req.session.userId);

  if (!user) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Invalid Session',
    });
  }

  req.user = user;

  next();
};

module.exports = authenticate;
