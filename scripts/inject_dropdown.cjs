const fs = require('fs');
const path = require('path');

// 1. Inject CSS
const stylePath = path.join(__dirname, '..', 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

if (!css.includes('.nav-dropdown')) {
    css += '\n\n/* Dropdown Nav Styles */\n';
    css += '.nav-dropdown { position: relative; display: inline-block; padding: 10px 0; } \n';
    css += '.dropdown-content { position: absolute; top: 100%; left: -20px; background: rgba(26, 19, 82, 0.95); backdrop-filter: blur(10px); min-width: 180px; border-radius: 12px; box-shadow: var(--shadow-glow); border: 1px solid rgba(202,255,0,0.1); padding: 10px 0; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s ease; z-index: 9999; display: flex; flex-direction: column; }\n';
    css += '.nav-dropdown:hover .dropdown-content { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }\n';
    css += '.nav-dropdown .dropdown-content a { padding: 10px 20px !important; font-size: 0.8rem !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; color: var(--white) !important; transition: background 0.2s, color 0.2s !important; white-space: nowrap !important; display: block !important; margin: 0 !important; }\n';
    css += '.nav-dropdown .dropdown-content a::after { display: none !important; } \n';
    css += '.nav-dropdown .dropdown-content a:hover { background: rgba(202, 255, 0, 0.1) !important; color: var(--lime) !important; padding-left: 24px !important; text-decoration: none !important; }\n';
    css += '.dropdown-content::before { content: ""; position: absolute; top: -20px; left: 0; right: 0; height: 20px; }\n';
    fs.writeFileSync(stylePath, css);
    console.log('Appended CSS successfully');
}

// 2. Inject HTML dropdowns
const files = ['index.html', 'company.html', 'dashboard.html', 'questionbank.html', 'resume.html', 'interview.html', 'feedback.html'];

const repCompany1 = `<li><a href="company.html">Companies</a></li>`;
const repCompany2 = `<li><a href="company.html" class="active">Companies</a></li>`;
const repCompany3 = `<li><a href="company.html">Company Prep</a></li>`;

const repQbank1 = `<li><a href="questionbank.html">Question Bank</a></li>`;
const repQbank2 = `<li><a href="questionbank.html" class="active">Question Bank</a></li>`;
const repQbank3 = `<li><a href="questionbank.html">Questions</a></li>`;

const newCompanyDropdown = (isActive) => `                <li class="nav-dropdown">
                    <a href="company.html" ${isActive ? 'class="active"' : ''}>Companies</a>
                    <div class="dropdown-content">
                        <a href="company.html?c=amazon">Amazon</a>
                        <a href="company.html?c=google">Google</a>
                        <a href="company.html?c=microsoft">Microsoft</a>
                        <a href="company.html?c=meta">Meta</a>
                        <a href="company.html?c=tcs">TCS</a>
                        <a href="company.html?c=infosys">Infosys</a>
                        <a href="company.html?c=zoho">Zoho</a>
                    </div>
                </li>`;

const newQbankDropdown = (isActive) => `                <li class="nav-dropdown">
                    <a href="questionbank.html" ${isActive ? 'class="active"' : ''}>Question Bank</a>
                    <div class="dropdown-content">
                        <a href="questionbank.html?c=all">All Questions</a>
                        <a href="questionbank.html?c=amazon">Amazon Questions</a>
                        <a href="questionbank.html?c=google">Google Questions</a>
                        <a href="questionbank.html?c=tcs">TCS Questions</a>
                        <a href="questionbank.html?topic=dsa">DSA Practice</a>
                        <a href="questionbank.html?topic=aptitude">Aptitude</a>
                    </div>
                </li>`;

files.forEach(f => {
    const fullPath = path.join(__dirname, '..', f);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Companies replacement
    if (content.includes(repCompany1)) { content = content.replace(repCompany1, newCompanyDropdown(false)); changed = true; }
    else if (content.includes(repCompany2)) { content = content.replace(repCompany2, newCompanyDropdown(true)); changed = true; }
    else if (content.includes(repCompany3)) { content = content.replace(repCompany3, newCompanyDropdown(false)); changed = true; }

    // QBank replacement
    if (content.includes(repQbank1)) { content = content.replace(repQbank1, newQbankDropdown(false)); changed = true; }
    else if (content.includes(repQbank2)) { content = content.replace(repQbank2, newQbankDropdown(true)); changed = true; }
    else if (content.includes(repQbank3)) { content = content.replace(repQbank3, newQbankDropdown(false)); changed = true; }

    if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated HTML in ${f}`);
    }
});
