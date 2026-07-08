const fs = require('fs');
const PDFDocument = require('pdfkit');

// Create a dummy PDF
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('dummy.pdf'));
doc.text('This is a test resume containing some skills like React, Node.js, and MongoDB. I have 5 years of experience in software engineering and I love building scalable backend systems.');
doc.end();

console.log('dummy.pdf created');
