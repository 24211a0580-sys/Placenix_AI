const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, '..', 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

// FIX 1: Ensure nav-links li items are all flex-aligned consistently
// The dropdown wrapper creates an extra layer, so we need <li> to also be flex-aligned
if (!css.includes('.nav-links li {')) {
    // Insert after .nav-links { block
    css = css.replace(
        '.nav-links a {',
        '.nav-links li {\n    display: flex;\n    align-items: center;\n}\n\n.nav-links a {'
    );
    console.log('Added .nav-links li alignment');
}

// FIX 2: Set feat-title min-height so all titles occupy same vertical space
// regardless of wrapping
if (!css.includes('.feat-title {')) {
    console.log('WARN: Could not find .feat-title to modify');
} else {
    // Add min-height to feat-title
    css = css.replace(
        /\.feat-title \{[^}]+\}/,
        match => match.replace('}', '    min-height: 3.2rem;\n    display: flex;\n    align-items: flex-start;\n}')
    );
    console.log('Added min-height to .feat-title');
}

// FIX 3: Ensure nav-dropdown > a has proper padding to match siblings
if (!css.includes('.nav-dropdown > a {')) {
    css += '\n.nav-dropdown > a { padding: 0; }\n';
    console.log('Added nav-dropdown > a padding fix');
}

fs.writeFileSync(stylePath, css);
console.log('Remaining alignment fixes applied!');
