const mongoose = require('mongoose');

let mongooseConnection = null;

connectDatabase = async () => {
  const mongoConnectionString = 'mongodb://localhost:27017';
  const mongoDBName = 'acs_assignment';

  mongooseConnection = await mongoose.connect(mongoConnectionString, {
    autoIndex: true,
    dbName: mongoDBName,
  });

  console.log('Connected database');

  return mongooseConnection;
};

module.exports = { default: connectDatabase, mongooseConnection };
