require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const SkillTree = require('./models/SkillTree');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const tree = await SkillTree.findOne({ name: 'Algorithm Mastery' });
  console.log(JSON.stringify(tree.nodes.map(n => n.title), null, 2));
  process.exit(0);
}
check();
