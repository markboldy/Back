import 'dotenv/config';
import express from 'express';
import https from 'https';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import cors from 'cors';

import routes from './routes';
import swaggerDocs from './swagger';
import connect from './db';

const app = express();

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/public/images', express.static(join(__dirname, '../public/images')));

app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/facebookStrategy');
require('./services/googleStrategy');
require('./services/localStrategy');

const isProduction = process.env.NODE_ENV === 'production';

// Use Routes
app.use('/', routes);

// Serve static assets if in production
if (isProduction) {
  // Set static folder
  // nginx will handle this
  // app.use(express.static(join(__dirname, '../../build')));

  // app.get('*', (req, res) => {
  //   // index is in /src so 2 folders up
  //   res.sendFile(resolve(__dirname, '../..', 'build', 'index.html'));
  // });

  const port = process.env.PORT || "80";
  app.listen(port, async () => {
    console.log(`Server started on port ${port}`)

    await connect();
  });
} else {
  const port = process.env.PORT || "80";

  const httpsOptions = {
    key: readFileSync(resolve(__dirname, '../security/cert.key')),
    cert: readFileSync(resolve(__dirname, '../security/cert.pem')),
  };

  https.createServer(httpsOptions, app).listen(port, async () => {
    console.log(`App is running at https://localhost:${port}`);

    await connect();
    swaggerDocs(app, port);
  });
}
