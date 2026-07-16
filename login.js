// ── PlaceNix Quick Profile System ──
// No passwords, no OTPs. Just name + what you're studying.

/* ════ PROFILE HELPERS ════ */
function getProfile() {
    try {
        return JSON.parse(localStorage.getItem('placenix_user') || 'null');
    } catch {
        return null;
    }
}

function saveProfile(data) {
    localStorage.setItem('placenix_user', JSON.stringify({
        ...data,
        joinedAt: new Date().toISOString()
    }));
}

/* ════ OVERLAY OPEN / CLOSE ════ */
function openLogin() {
    const profile = getProfile();
    if (profile && profile.name) {
        // Already has a profile — just greet and go to dashboard
        showToast(`👋 Welcome back, ${profile.name}!`, 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
        return;
    }

    const overlay = document.getElementById('loginOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('active');
        overlay.classList.remove('closing');
    }, 10);
    // Focus the name input
    setTimeout(() => {
        const nameInput = document.getElementById('onboard-name');
        if (nameInput) nameInput.focus();
    }, 150);
}

function closeLogin() {
    const overlay = document.getElementById('loginOverlay');
    if (!overlay) return;
    overlay.classList.add('closing');
    overlay.classList.remove('active');
    setTimeout(() => { overlay.style.display = 'none'; }, 350);
}

window.openLogin = openLogin;
window.closeLogin = closeLogin;

/* ════ ONBOARDING SUBMIT ════ */
function handleOnboard(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('onboard-name');
    const branchSelect = document.getElementById('onboard-branch');
    const yearSelect = document.getElementById('onboard-year');
    const collegeInput = document.getElementById('onboard-college');
    const btn = document.getElementById('onboard-submit-btn');

    const name = nameInput?.value.trim();
    const branch = branchSelect?.value;
    const year = yearSelect?.value;
    const college = collegeInput?.value.trim() || '';

    // Validation
    if (!name || name.length < 2) {
        shakeInput(nameInput);
        showToast('Please enter your name (at least 2 characters)', 'error');
        return;
    }
    if (!branch) {
        shakeInput(branchSelect);
        showToast('Please select your branch', 'error');
        return;
    }
    if (!year) {
        shakeInput(yearSelect);
        showToast('Please select your year', 'error');
        return;
    }

    // Animate button
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<div class="login-loading-spinner"></div> Setting up...';
    }

    // Save profile
    saveProfile({ name, branch, year, college });

    // Show success after short delay
    setTimeout(() => {
        showOnboardSuccess(name);
    }, 600);
}
window.handleOnboard = handleOnboard;

function shakeInput(el) {
    if (!el) return;
    el.classList.remove('input-shake');
    void el.offsetWidth;
    el.classList.add('input-shake');
    setTimeout(() => el.classList.remove('input-shake'), 500);
}

function showOnboardSuccess(name) {
    const card = document.querySelector('.login-card-container');
    if (!card) return;

    card.innerHTML = `
      <div class="onboard-success">
        <div class="onboard-success-icon">🚀</div>
        <div class="login-heading">You're all set, ${name}!</div>
        <div class="login-subheading">Taking you to your personalised dashboard…</div>
        <div class="onboard-progress-wrap">
          <div class="onboard-progress-bar" id="onboard-prog"></div>
        </div>
      </div>
    `;

    // Animate progress bar
    setTimeout(() => {
        const bar = document.getElementById('onboard-prog');
        if (bar) bar.style.width = '100%';
    }, 80);

    setTimeout(() => {
        closeLogin();
        showToast(`Welcome to PlaceNix.ai, ${name}! 🎉`);
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
    }, 2200);
}

/* ════ TOAST SYSTEM ════ */
function showToast(msg, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-red' : type === 'warning' ? 'toast-amber' : type === 'info' ? 'toast-blue' : ''}`;
    toast.innerHTML = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
window.showToast = showToast;

/* ════ NAVBAR USER BADGE ════ */
function renderUserBadge() {
    const profile = getProfile();
    const ctaBtn = document.querySelector('.nav-cta');
    if (!ctaBtn) return;

    if (profile && profile.name) {
        const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        ctaBtn.outerHTML = `
          <div class="nav-user-badge" id="navUserBadge" title="Your profile">
            <div class="nav-user-avatar">${initials}</div>
            <span class="nav-user-name">${profile.name.split(' ')[0]}</span>
            <div class="nav-user-menu" id="navUserMenu">
              <div class="num-item"><span>👤</span> ${profile.name}</div>
              <div class="num-item"><span>📚</span> ${profile.branch || ''} · ${profile.year || ''}</div>
              ${profile.college ? `<div class="num-item"><span>🎓</span> ${profile.college}</div>` : ''}
              <div class="num-divider"></div>
              <a class="num-item num-link" href="dashboard.html"><span>📊</span> Dashboard</a>
              <div class="num-item num-danger" onclick="logoutUser()"><span>🚪</span> Clear Profile</div>
            </div>
          </div>`;

        // Toggle menu on click
        setTimeout(() => {
            const badge = document.getElementById('navUserBadge');
            if (badge) {
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    badge.classList.toggle('open');
                });
                document.addEventListener('click', () => badge.classList.remove('open'));
            }
        }, 0);
    }
}

function logoutUser() {
    localStorage.removeItem('placenix_user');
    showToast('Profile cleared. See you again! 👋');
    setTimeout(() => { window.location.reload(); }, 1000);
}
window.logoutUser = logoutUser;

/* ════ BOOT ════ */
document.addEventListener('DOMContentLoaded', () => {
    renderUserBadge();

    // Attach form submit handler
    const form = document.getElementById('onboard-form');
    if (form) {
        form.addEventListener('submit', handleOnboard);
    }
    const submitBtn = document.getElementById('onboard-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleOnboard);
    }

    // Auto-open on first visit (no profile yet)
    const profile = getProfile();
    if (!profile) {
        setTimeout(() => openLogin(), 1200);
    }
});
