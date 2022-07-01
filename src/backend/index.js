const connectDatabase = require('./db/dbConnect').default;
const appRouter = require('./routes');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const { json } = require('express');
const app = require('express')();

const bootstrap = async () => {
  const mongoConnectionString = 'mongodb://localhost:27017';
  const mongoDBName = 'acs_assignment';
  await connectDatabase();

  //trust proxy if node js is behind proxy and if secure(line 26) is true  (for this assignment i'm use a proxy to redirect the rest api requests to this backend project. CHECK "vite.config.ts"(line 29) in frontend project)
  // app.set('trust proxy', 1);

  app.use(
    session({
      secret: 'site secret',
      saveUninitialized: true,
      cookie: {
        maxAge: 2592000000, // 30 days in milliseconds (30 * 24 * 60 * 60 * 1000)
        secure: false, // change this to true only if using https
      },
      // use mongo for storing session data
      store: MongoStore.create({
        mongoUrl: mongoConnectionString,
        dbName: mongoDBName,
      }),
    })
  );

  app.use(json());
  app.use((err, _, res, __) => {
    console.error(err);
    return res
      .status(500)
      .json({ statusCode: 500, message: 'Internal Server Error' });
  });

  app.use('/api', appRouter);

  app.listen(8000, () => console.log('Server is running on port 8000'));
};

bootstrap();
