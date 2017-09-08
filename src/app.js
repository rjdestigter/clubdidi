/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import path from 'path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import flash from 'express-flash';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import jwt from 'jwt-simple';
import { printSchema } from 'graphql';

import redis from './redis';
import passport from './passport';
import schema from './schema';
import DataLoaders from './DataLoaders';
import accountRoutes from './routes/account';
import auth from './auth';
import users from './users';
import cfg from './jwt-config';

const app = express();

app.set('trust proxy', 'loopback');

app.use(auth.initialize());

app.use(
  cors({
    origin(origin, cb) {
      const whitelist = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : [];
      cb(null, whitelist.includes(origin));
    },
    credentials: true,
  }),
);

app.use(compression());
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/token', (req, res) => {
  console.log(req.body);
  if (req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.email, password);
    const user = users.find(u => u.email === email && u.password === password);
    console.log('User', user);
    if (user) {
      const payload = {
        id: user.id,
      };
      const token = jwt.encode(payload, cfg.jwtSecret);
      console.log('Token', token);
      res.json({
        token,
      });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

// app.use(
//   session({
//     store: new (connectRedis(session))({ client: redis }),
//     name: 'sid',
//     resave: true,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//   }),
// );
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

// app.use(accountRoutes);

app.get('/graphql/schema', (req, res) => {
  res.type('text/plain').send(printSchema(schema));
});

app.use(
  '/graphql',
  auth.authenticate(),
  expressGraphQL(req => ({
    schema,
    context: {
      t: req.t,
      user: req.user,
      ...DataLoaders.create(),
    },
    graphiql: process.env.NODE_ENV !== 'production',
    pretty: process.env.NODE_ENV !== 'production',
    formatError: error => ({
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
    }),
  })),
);

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
