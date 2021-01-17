const express = require('express');
const app = express();
const fs = require('fs');
const port = 8080;
const db = './names.json';

let users = [];

if (fs.existsSync(db)) {
    users = JSON.parse(fs.readFileSync(db, 'utf-8'));       
}

app.use((req, res, next) => {   
    
    if (req.headers['iknowyoursecret'] !== 'TheOwlsAreNotWhatTheySeem') {
        return res.end('Who are the owls?');
    }
    
    next();
});

app.post("/", (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.end("Wrong name");
    }

    const ip = req.ip;

    const users = { name, ip };
    users.push(users);

    fs.writeFile(db, JSON.stringify(users), err => {
        if (err) {
            throw err;
        }
    });

    res.send(`Hello, ${users.map(user => user.name).join(", ")}!`);
    return response.end();
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server running at port ${port}`);
});
