// auth.js
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import cfg from './jwt-config';
import users from './users';

const params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, (payload, done) => {
  const user = users.find(u => u.id === payload.id);

  if (user) {
    return done(null, {
      id: user.id,
    });
  }

  return done(new Error('User not found'), null);
});

passport.use(strategy);

export default {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', cfg.jwtSession),
};
