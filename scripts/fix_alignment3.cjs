const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, '..', 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

// FIX 1: Increase feat-title min-height to accommodate 2-line wrapping
// 1.3rem * 1.2 line-height * 2 lines = 3.12rem, round up to 3.4rem
css = css.replace('min-height: 3.2rem;', 'min-height: 3.4rem;');

// FIX 2: The dropdown needs padding on the parent for hover zone
// Currently padding: 0 removes the hover zone entirely
css = css.replace(
    '.nav-dropdown { position: relative; display: flex; align-items: center; padding: 0; }',
    '.nav-dropdown { position: relative; display: flex; align-items: center; padding: 8px 0; }'
);

// FIX 3: dropdown-content top needs to account for parent padding
// Currently top: 100% but parent has no height buffer since it's flex
// Add a larger top offset for dropdown to appear below the text
css = css.replace(
    'top: 100%; left: -20px;',
    'top: calc(100% + 2px); left: -20px;'
);

fs.writeFileSync(stylePath, css);
console.log('Final alignment + dropdown fixes applied!');
