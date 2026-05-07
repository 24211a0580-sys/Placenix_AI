const fs = require('fs');

const content = fs.readFileSync('package.json', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"dev": "concurrently')) {
        lines[i] = '    "dev": "concurrently \\"npm run dev:frontend\\" \\"npm run dev:backend\\"",';
    }
}

fs.writeFileSync('package.json', lines.join('\n'));
console.log('Fixed package.json');
