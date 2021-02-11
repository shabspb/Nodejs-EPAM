const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 8080;
const secret = {
  phrase: 'TheOwlsAreNotWhatTheySeem',
};

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true ,  useUnifiedTopology: true });
const UserSchema = mongoose.Schema({ name: String, password: String, jwt: String });
const User = mongoose.model('Users', UserSchema);

const bearerStrategy = new BearerStrategy((token, done) => {
  User.findOne({ token: token }).exec().then((user) => {
    if (!user) {
      done('Error');
    }
    else {
      done(null, user);
    }
  });
});

const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  (username, password, done) => {
    User.find({ username: username, password: password }).exec().then((users) => {
      if (!users) {
        done('Error');
      }
      else {
        done(null, users[0]);
      }
    });
  }
);

passport.use('local', localStrategy);

passport.use('bearer', bearerStrategy);

passport.serializeUser((user, done) => {
  const token = jwt.sign(
    { username: user.name },
    secret.phrase,
    { expiresIn: '48h' },
  );
  User.updateOne({ username: user.name }, { token: token }, (err, updatedUser) => {
    done(null, updatedUser);
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(bodyParser.json());

app.use(passport.initialize());

app.post('/token', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}));

app.get('/name', passport.authenticate('bearer', { session: false }), (req, res) => {
  console.log(`User ${req.user.name}, yo!`);
  res.end();
});

app.listen(port, (err) => {
  if (err) {
    return console.log('The exception is: ', err);
  }
  console.log(`Server is listening on ${port}`);
  User.find({}, (err, users) => {
    console.log("In the room now: ", users.map(user => `${user.name} ${user.jwt}`).join('\n'));
  });
});