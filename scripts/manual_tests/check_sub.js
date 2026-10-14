require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');
const Submission = require('./server/models/Submission');
const Challenge = require('./server/models/Challenge');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/devarena', { useNewUrlParser: true, useUnifiedTopology: true });
  const sub = await Submission.findOne().sort({submittedAt: -1}).populate('challengeId');
  if (sub) {
    console.log('Challenge:', sub.challengeId.title);
    console.log('Language:', sub.language);
    console.log('Status:', sub.status);
    console.log('Code:', sub.code);
    console.log('Results:', JSON.stringify(sub.testResults, null, 2));
  } else {
    console.log('No submissions');
  }
  process.exit();
}
check();
