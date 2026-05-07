const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

// Replace the updateAuthUI implementation to be more robust
const newUpdateAuthUI = `
// Auth UI Update
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

function updateAuthUI() {
    if (typeof window.AuthService !== 'undefined' && window.AuthService.isAuthenticated()) {
        const user = window.AuthService.getUser();
        if (user) {
            const navCtrs = document.querySelectorAll('.nav-inner');
            navCtrs.forEach(nav => {
                const cta = nav.querySelector('.nav-cta');
                if (cta) cta.style.display = 'none';
                
                if (!nav.querySelector('.auth-user-profile')) {
                    const profileDiv = document.createElement('div');
                    profileDiv.className = 'auth-user-profile';
                    profileDiv.style.display = 'flex';
                    
                    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    
                    profileDiv.innerHTML = \`
                        <div class="auth-user-avatar">\${initials}</div>
                        <div class="auth-user-name">\${user.name.split(' ')[0]}</div>
                        <button class="auth-logout-btn" title="Logout" onclick="window.AuthService.logout()">⎋</button>
                    \`;
                    nav.appendChild(profileDiv);
                }
            });
            
            // Auto close login modal if it's open
            if (typeof closeLogin === 'function') closeLogin();
        }
    }
}

// We also need to listen for messages from auth success
const originalShowSuccess = window.showSuccess;
if (typeof originalShowSuccess !== 'undefined') {
    window.showSuccess = function(userName) {
        originalShowSuccess(userName);
        setTimeout(() => updateAuthUI(), 100);
    };
}
`;

// Replace the previous badly injected script block
script = script.replace(/\/\/ Auth UI Update[\s\S]*?(?=\n\n|$)/g, '');
script += newUpdateAuthUI;

fs.writeFileSync(scriptPath, script);
console.log('Fixed nav_auth logic');
