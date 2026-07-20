const fs = require('fs');
const js = fs.readFileSync('../frontend/main.js', 'utf8');

const regex = /onclick="([a-zA-Z0-9_]+)\(/g;
let match;
const calledFuncs = new Set();
while ((match = regex.exec(js)) !== null) {
  calledFuncs.add(match[1]);
}

const missing = [];
for (let func of calledFuncs) {
  const isDefinedGlobal = js.includes(`window.${func} =`);
  const isDefinedLocal = js.includes(`function ${func}(`) || js.includes(`function ${func} (`);
  const isDefinedArrow = js.includes(`const ${func} =`) || js.includes(`let ${func} =`);
  if (!isDefinedGlobal && !isDefinedLocal && !isDefinedArrow) {
    missing.push(func);
  }
}

console.log("Missing functions:", missing);
