const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, '..', 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

// FIX 1: Nav links — add align-items center so all items sit on same baseline
css = css.replace(
    '.nav-links {\r\n    display: flex;\r\n    gap: 2.4rem;\r\n}',
    '.nav-links {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 2.4rem;\r\n}'
);
// Also try \n variant
css = css.replace(
    '.nav-links {\n    display: flex;\n    gap: 2.4rem;\n}',
    '.nav-links {\n    display: flex;\n    align-items: center;\n    gap: 2.4rem;\n}'
);

// FIX 2: Dropdown — remove extra padding, make it flex-aligned
css = css.replace(
    '.nav-dropdown { position: relative; display: inline-block; padding: 10px 0; }',
    '.nav-dropdown { position: relative; display: flex; align-items: center; padding: 0; }'
);

// FIX 3: feat-desc — add flex-grow so text block pushes arrow to bottom
css = css.replace(
    '.feat-desc {\r\n    font-size: 0.9rem;\r\n    color: rgba(255, 255, 255, 0.55);\r\n    line-height: 1.6;\r\n}',
    '.feat-desc {\r\n    font-size: 0.9rem;\r\n    color: rgba(255, 255, 255, 0.55);\r\n    line-height: 1.6;\r\n    flex: 1;\r\n}'
);
css = css.replace(
    '.feat-desc {\n    font-size: 0.9rem;\n    color: rgba(255, 255, 255, 0.55);\n    line-height: 1.6;\n}',
    '.feat-desc {\n    font-size: 0.9rem;\n    color: rgba(255, 255, 255, 0.55);\n    line-height: 1.6;\n    flex: 1;\n}'
);

// FIX 4: feat-arrow — make it always visible (opacity: 1) instead of hidden, so cards look complete
css = css.replace(
    '    opacity: 0;\r\n    transform: translateX(-8px);\r\n    transition: opacity 0.3s, transform 0.3s, background 0.3s;\r\n}',
    '    opacity: 0.6;\r\n    transform: translateX(0);\r\n    transition: opacity 0.3s, transform 0.3s, background 0.3s;\r\n}'
);
css = css.replace(
    '    opacity: 0;\n    transform: translateX(-8px);\n    transition: opacity 0.3s, transform 0.3s, background 0.3s;\n}',
    '    opacity: 0.6;\n    transform: translateX(0);\n    transition: opacity 0.3s, transform 0.3s, background 0.3s;\n}'
);

// FIX 5: feat-grid — force exactly 4 columns on desktop for uniform sizing
css = css.replace(
    'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
    'grid-template-columns: repeat(4, 1fr);'
);

// FIX 6: Reduce excessive hero subtitle bottom-margin
css = css.replace(
    '    margin-bottom: 2.2rem;\r\n}',
    '    margin-bottom: 1.4rem;\r\n}'
);
css = css.replace(
    '    margin-bottom: 2.2rem;\n}',
    '    margin-bottom: 1.4rem;\n}'
);

fs.writeFileSync(stylePath, css);
console.log('All alignment fixes applied!');

// Verify changes
const result = fs.readFileSync(stylePath, 'utf8');
console.log('nav-links align-items:', result.includes('align-items: center;\r\n    gap: 2.4rem') || result.includes('align-items: center;\n    gap: 2.4rem') ? 'FIXED' : 'NEEDS MANUAL CHECK');
console.log('nav-dropdown padding:', result.includes('padding: 0;') ? 'FIXED' : 'NEEDS MANUAL CHECK');
console.log('feat-desc flex:', result.includes('flex: 1;') ? 'FIXED' : 'NEEDS MANUAL CHECK');
console.log('feat-grid 4 cols:', result.includes('repeat(4, 1fr)') ? 'FIXED' : 'NEEDS MANUAL CHECK');
console.log('feat-arrow visible:', result.includes('opacity: 0.6;') ? 'FIXED' : 'NEEDS MANUAL CHECK');
