const http = require('http');

const data = JSON.stringify({
  name: "Test", phone: "123", date: "2026-08-16", time: "10:00", transaction_id: "1234"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/public/booking',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
