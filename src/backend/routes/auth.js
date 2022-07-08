const { Router } = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');
const checkCaptcha = require('../middleware/checkCaptcha');

const router = Router();

router.post('/login', checkCaptcha, async (req, res) => {
  console.time('auth');

  const body = req.body;
  const user = await userModel.findOne({ email: body.email });

  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    return res.status(401).json({
      statusCode: 401,
      message: `Email or Password is invalid.\nRemaining attempts: ${limiter.remainingPoints}`,
    });
  }

  const { password, oldPasswords, ...result } = user.toObject();

  req.session.userId = user._id;

  console.timeEnd('auth');

  // reset attempts
  await loginAttemptLimiter.delete(`${ip}-login-attempt`);
  return res.json(result);
});

router.get('/profile', authenticate, async (req, res) => {
  const { password, oldPasswords, ...result } = req.user.toObject();

  return res.json(result);
});

router.post('/logout', authenticate, async (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;

    return res.json({
      message: 'Successful logged out',
    });
  });
});

module.exports = router;
