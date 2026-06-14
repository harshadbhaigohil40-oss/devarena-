const http = require('http');
console.log('Fetching...');
http.get('http://localhost:5000/api/challenges?search=Fundamentals', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', data.slice(0, 100)); // Print first 100 chars
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
