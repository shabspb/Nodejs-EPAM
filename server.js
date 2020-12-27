const http = require('http');

const port = 8080;

const server = http.createServer((req, res) => {
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello, EPAM!</h1>');
});

server.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server running at port ${port}`);
});