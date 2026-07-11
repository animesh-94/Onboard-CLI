const fs = require('fs');
const file = 'src/pages/Docs.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/selection:bg-emerald-500\/30/g, 'selection:bg-white/20 selection:text-white');
content = content.replace(/bg-emerald-500\/10 text-emerald-400/g, 'bg-white/10 text-white');
content = content.replace(/hover:text-emerald-400/g, 'hover:text-white');
content = content.replace(/prose-a:text-emerald-400/g, 'prose-a:text-white');
fs.writeFileSync(file, content);
console.log('Done');
