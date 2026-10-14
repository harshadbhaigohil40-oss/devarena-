const vm = require('vm');
try {
  vm.runInNewContext('function reverseString(str) { return str.split(""); } reverseString(["h"]);');
} catch(e) {
  let msg = e.message || String(e);
  if (e.stack && e.stack.includes('evalmachine')) {
    const stackLines = e.stack.split('\n');
    const errIdx = stackLines.findIndex(l => l.includes(e.message));
    if (errIdx > 0) {
       const snippet = stackLines.slice(0, errIdx).join('\n').replace(/evalmachine\\.<anonymous>:/g, 'Line ');
       msg = `${e.name || 'Error'}: ${e.message}\n${snippet}`;
    }
  }
  console.log('--- NEW MSG ---');
  console.log(msg);
}
