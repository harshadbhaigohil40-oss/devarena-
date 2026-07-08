require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const SkillTree = require('./models/SkillTree');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const trees = await SkillTree.find({});
  for (const tree of trees) {
    console.log(tree.name, "=>", tree.nodes.map(n => n.title).join(', '));
  }
  process.exit(0);
}
check();
