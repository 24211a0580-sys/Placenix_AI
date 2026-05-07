const fs = require('fs');
const files = ['index.html', 'company.html', 'resume.html', 'dashboard.html', 'questionbank.html', 'interview.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // add css
    if (!content.includes('feedback.css')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/feedback.css">\n</head>');
    }
    
    // add js
    if (!content.includes('feedback.js')) {
        content = content.replace('</body>', '    <script src="js/feedback.js"></script>\n</body>');
    }
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
});
