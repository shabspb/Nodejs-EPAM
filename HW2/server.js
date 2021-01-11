const http = require('http');
const fs = require('fs');
const port = 8080;
const db = 'names.json';

let users = [];

if (fs.existsSync(db)) {
    users = JSON.parse(fs.readFileSync(db, 'utf-8'));    
}

const requestHandler = (req, res) => {
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    if (req.method === 'POST') {
        if (req.headers.iknowyoursecret === 'TheOwlsAreNotWhatTheySeem') {            
                users.push({name: req.headers.name, ip: req.connection.remoteAddress})
                fs.writeFile(db, JSON.stringify(users, null, ' '), err => {
                    if (err) {
                        throw err;
                    }
                });            
        } else {
            console.log('Who are the owls?');
        }
    }
    res.end();
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server running at port ${port}`);
});