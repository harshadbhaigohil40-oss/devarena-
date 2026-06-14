require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Challenge = require('./models/Challenge');
  
  const search = 'Fundamentals';
  const filter = {};
  
  const searchTerms = search.split(/[\s,-]+/).filter(Boolean);
  if (searchTerms.length > 0) {
    const safeTerms = searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const searchRegex = new RegExp(safeTerms.join('|'), 'i');
    console.log("Regex:", searchRegex);
    
    filter.$or = [
      { title: searchRegex },
      { tags: searchRegex },
      { category: searchRegex },
      { description: searchRegex }
    ];
  }
  
  try {
    const count = await Challenge.countDocuments(filter);
    console.log("Count:", count);
  } catch(e) {
    console.error(e);
  }
  process.exit();
});
