const search = 'HTML CSS';
const searchTerms = search.split(/[\s,-]+/).filter(Boolean);
const safeTerms = searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
console.log(safeTerms);
const searchRegex = new RegExp(safeTerms.join('|'), 'i');
console.log(searchRegex);
