const http = require('http');

const options = {
    hostname: 'localhost',
    port: 8080,
    method: 'POST',
    headers: {  
        'name': 'Vasilii',              
        'IKnowYourSecret': 'TheOwlsAreNotWhatTheySeem'
    }
};

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log(`The secret word is: ${options.headers.IKnowYourSecret}`)
    
    res.on('data', d => {
        process.stdout.write(d)
      });
});

req.on('error', error => {
    console.error(error);
});

req.write('data');
req.end();