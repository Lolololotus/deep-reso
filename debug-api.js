const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
    message: '테스트',
    lang: 'ko'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/analyze',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        fs.writeFileSync('api-result.txt', `STATUS: ${res.statusCode}\nBODY: ${body}`);
    });
});

req.on('error', (e) => {
    fs.writeFileSync('api-result.txt', `ERROR: ${e.message}`);
});

req.write(data);
req.end();
