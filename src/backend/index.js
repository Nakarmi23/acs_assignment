const mongoose = require('mongoose');
const appRouter = require('./routes');
const { json } = require('express');
const app = require('express')();

const bootstrap = async () => {
  await mongoose
    .connect('mongodb://localhost:27017', {
      dbName: 'acs_assignment',
      autoIndex: true,
    })
    .then(() => console.log('Connected database'));

  app.use(json());
  app.use('/api', appRouter);

  app.listen(8000, () => console.log('Server is running on port 8000'));
};

bootstrap();