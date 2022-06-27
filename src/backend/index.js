const mongoose = require('mongoose');

const app = require('express')();

const bootstrap = async () => {
  await mongoose
    .connect('mongodb://localhost:27017', {
      dbName: 'acs_assignment',
    })
    .then(() => console.log('Connected database'));

  app.listen(8000, () => console.log('Server is runnning on port 8000'));
};

bootstrap();
