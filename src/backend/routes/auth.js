const { Router } = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');
const checkCaptcha = require('../middleware/checkCaptcha');
const rateLimitGenerator = require('../middleware/rateLimiter');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const { MongoClient } = require('mongodb');

const router = Router();

const mongoConnectionString = 'mongodb://localhost:27017';
const mongoDBName = 'acs_assignment';

const loginAttemptLimitOptions = {
  storeClient: MongoClient.connect(mongoConnectionString),
  points: 5, // 5 attempts
  duration: 15 * 60, // per 15 seconds by IP
  blockDuration: 30 * 60, // block for 30 mins
  dbName: mongoDBName,
  tableName: 'rate_limit',
};

const loginAttemptLimiter = new RateLimiterMongo(loginAttemptLimitOptions);

router.post('/login', rateLimitGenerator(), checkCaptcha, async (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  loginAttemptLimiter
    .consume(`${ip}-login-attempt`, 1)
    .then(async (limiter) => {
      console.time('auth');

      const body = req.body;
      const user = await userModel.findOne({ email: body.email });

      if (!user || !bcrypt.compareSync(body.password, user.password)) {
        return res.status(401).json({
          statusCode: 401,
          message: `Email or Password is invalid. Remaining attempts: ${limiter.remainingPoints}`,
        });
      }

      const { password, oldPasswords, ...result } = user.toObject();

      req.session.userId = user._id;

      console.timeEnd('auth');
      await loginAttemptLimiter.delete(`${ip}-login-attempt`);
      return res.json(result);
    })
    .catch(() => {
      return res.status(429).json({
        status: 429,
        message:
          'Too many failed login attempts. Please try again after 30 mins.',
      });
    });
});

router.get('/profile', rateLimitGenerator(), authenticate, async (req, res) => {
  const { password, oldPasswords, ...result } = req.user.toObject();

  return res.json(result);
});

router.post('/logout', rateLimitGenerator(), authenticate, async (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;

    return res.json({
      message: 'Successful logged out',
    });
  });
});

module.exports = router;
