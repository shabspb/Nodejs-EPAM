const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8080;

mongoose.connect('mongodb://localhost:27017');
const UserSchema = mongoose.Schema({ name: String, ip: String });
const User = mongoose.model('Users', UserSchema);

app.use((req, res, next) => {  

  if (req.method !== 'POST') {    
    return res.send('Wrong method =(');
  }

  next();
});

app.use((req, res, next) => {   
    const { userName } = req.headers;
    const { userIp } = req.connection;

    if (req.headers['iknowyoursecret'] !== 'TheOwlsAreNotWhatTheySeem') {
        console.log('Bye!')
        return res.end('Who are the owls?');
    } else {        
        console.log(`Hi ${userName} with ${userIp} ip!`);
    }

  next();
});

app.post('/', (req, res)=> {
    const userName = req.query.name;
    const userIp = req.ip;    
   
    const user = new User({name: userName, ip: userIp});

    user.save((err, savedUser)=> {
        if (err) throw err;
        res.send(`Hello ${savedUser.name} with ${savedUser.ip}!`);       
    });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('The exception is: ', err);
  }
  console.log(`Server is listening on ${port}`);
  User.find({}, (err, users) => {
    console.log("In the room now: ", users.map(user => user.name).join(', '));
  });
});