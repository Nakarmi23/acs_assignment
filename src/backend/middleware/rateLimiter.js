const { mongooseConnection } = require('../db/dbConnect');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const { MongoClient } = require('mongodb');

const mongoConnectionString = 'mongodb://localhost:27017';
const mongoDBName = 'acs_assignment';

// should be able to implement rateLimit as a global middleware or for individual endpoint
const rateLimitGenerator = () => {
  const rateLimiter = new RateLimiterMongo({
    storeClient: MongoClient.connect(mongoConnectionString),
    points: 15, // 20 requests
    duration: 5, // per 5 seconds by IP
    blockDuration: 15 * 60, // block for 15 mins
    dbName: mongoDBName,
    tableName: 'rate_limit',
  });

  return (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    rateLimiter
      .consume(`${ip}-${req.originalUrl}`, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        return res.status(429).json({
          status: 429,
          message:
            "You've sent too many requests over a short period of time. Please try again after 15 mins.",
        });
      });
  };
};

module.exports = rateLimitGenerator;
