const fs = require('fs');
let content = fs.readFileSync('package.json', 'utf8');

// Replace the bad format
content = content.replace(
  /"dev": "concurrently "npm run dev:frontend" "npm run dev:backend"",/g,
  '"dev": "concurrently \\"npm run dev:frontend\\" \\"npm run dev:backend\\"",'
);

fs.writeFileSync('package.json', content);
