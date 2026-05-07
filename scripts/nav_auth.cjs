const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, '..', 'style.css');
let style = fs.readFileSync(stylePath, 'utf8');

if (!style.includes('.auth-user-profile')) {
    style += `
/* Auth User Profile Navbar */
.auth-user-profile {
    display: none;
    align-items: center;
    gap: 12px;
    background: rgba(202, 255, 0, 0.1);
    padding: 6px 16px 6px 6px;
    border-radius: 30px;
    border: 1px solid rgba(202, 255, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.auth-user-profile:hover {
    background: rgba(202, 255, 0, 0.15);
    transform: translateY(-1px);
}

.auth-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--lime);
    color: var(--dark-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 14px;
}

.auth-user-name {
    color: var(--white);
    font-size: 0.9rem;
    font-weight: 600;
}

.auth-logout-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0 4px;
    transition: color 0.2s;
}

.auth-logout-btn:hover {
    color: var(--pink);
}

.login-btn-container.logged-in .nav-cta {
    display: none !important;
}
.login-btn-container.logged-in .auth-user-profile {
    display: flex;
}
`;
    fs.writeFileSync(stylePath, style);
}

// Update script.js to check auth status on load
const scriptPath = path.join(__dirname, '..', 'script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

if (!script.includes('updateAuthUI')) {
    script += `
// Auth UI Update
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

function updateAuthUI() {
    if (typeof window.AuthService !== 'undefined' && window.AuthService.isAuthenticated()) {
        const user = window.AuthService.getUser();
        if (user) {
            document.querySelectorAll('.login-btn-container').forEach(container => {
                container.classList.add('logged-in');
                
                // Add user profile UI if it doesn't exist yet
                if (!container.querySelector('.auth-user-profile')) {
                    const profileDiv = document.createElement('div');
                    profileDiv.className = 'auth-user-profile';
                    
                    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    
                    profileDiv.innerHTML = \`
                        <div class="auth-user-avatar">\${initials}</div>
                        <div class="auth-user-name">\${user.name.split(' ')[0]}</div>
                        <button class="auth-logout-btn" title="Logout" onclick="window.AuthService.logout()">⎋</button>
                    \`;
                    container.appendChild(profileDiv);
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
        updateAuthUI();
    };
}
`;
    fs.writeFileSync(scriptPath, script);
}

console.log('Added navbar logged in state styles and logic.');
