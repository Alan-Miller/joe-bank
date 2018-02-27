require('dotenv').config();
const { PORT, SECRET, AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_CALLBACK_URL } = process.env;
const express = require('express')
    , session = require('express-session')
    , massive = require('massive')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0');
const app = express();

// let i = 1;
// setInterval(() => {
//   console.log("HELLO " + ++i)
// }, 1000)

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('\nREQ METHOD AND URL', req.method, req.url);
    // console.log('\nREQ HEADERS:', req.headers);
    // console.log('\nREQ SESSION', req.session);
    // console.log('\nSESSION', session);
    // console.log('\nREQ USER', req.user);
    next();
});

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

app.use((req, res, next) => {
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': true,
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'Content-Security-Policy': "default-src 'self' unsafe-inline devmountain.github.io"
  })
  next();
});

app.use(session({ // session config must come before other session initialization
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize()); // then initialize
app.use(passport.session()); // then call .session

massive(process.env.CONNECTION_STRING).then( db => {
  console.log('NO DB ERROR'); // if there is error, .then will not run and we won't see this
  // massive looks on root level for db folder, so putting the folder elsewhere is a problem
  // technically, it looks from wherever you run nodemon
  // console.log(db);
  app.set('db', db);
});

passport.use(new Auth0Strategy(
  {
    domain: AUTH_DOMAIN,
    clientID: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    callbackURL: AUTH_CALLBACK_URL
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // console.log('PROFILE', profile);
    // console.log('_JSON IDENTITIES', profile._json.identities);
    const db = app.get('db');
    db.find_user([ profile.identities[0].user_id ]) // find user_id value in profile obj
    .then( (user) => { // user is array of user objs found in database
      if (user[0]) return done(null, user[0].id); // Shannon object has id prop of 3
      else {
        const user = profile._json;
        db.create_user([ user.name, user.email, user.picture, user.identities[0].user_id ])
        .then(user => done(null, user[0].id));
      }
    });
    // done(null, profile); // Got rid of this because it will hit done() in the if or the else
  }
));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: 'http://localhost:3000/#/private', 
  failureRedirect: 'http://localhost:3000/', 
  // failureRedirect: '/auth', 
  failureFlash: true
})); // endpoint for callback to see if authenticated

app.get('/auth/me', (req, res) => {
  console.log('\nAUTH/ME req.user', req.user);
  console.log('\nAUTH/ME req.session.passport.user', req.session.passport.user);
  if (!req.user) res.status(404).send('User not found!');
  else res.status(200).send(req.user);
});

app.get('/auth/logout', (req, res) => {
  // req.logOut(); // logout method not needed because front end is hitting v2 logout endpoint, which forces logout
  res.redirect(302, 'http://localhost:3000/#/'); // first argument is status code, then URL for where to go
});

passport.serializeUser((id, done) => {
  // app.get('db').find_current_user([ id ]);
  done(null, id);
}); 
// called once when logged in; we passed id along

passport.deserializeUser((id, done) => {
      // console.log('\nDES ID', id);
  app.get('db').find_current_user([ id ])
  .then( user => done(null, user[0]));
  // done(null, id);
}); 
// called every time thereafter







app.listen(PORT, () => console.log(`Listening on ${PORT}`));