const mongoose = require('mongoose');

let mongooseConnection = null;

connectDatabase = async () => {
  const mongoConnectionString = 'mongodb://localhost:27017';
  const mongoDBName = 'CET324_acs_ankit_nakarmi';

  mongooseConnection = await mongoose.connect(mongoConnectionString, {
    autoIndex: true,
    dbName: mongoDBName,
  });

  console.log('Connected database');

  return mongooseConnection;
};

module.exports = { default: connectDatabase, mongooseConnection };
