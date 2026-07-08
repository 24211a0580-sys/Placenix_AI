/* ==========================================================
   PlaceNix.ai — Interactions
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll effect ── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ── Mobile menu toggle ── */
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            const spans = toggle.querySelectorAll('span');
            const isOpen = links.classList.contains('open');
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
            spans[1].style.opacity = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
        });
    }

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (links) links.classList.remove('open');
            }
        });
    });

    /* ── Parallax blobs on mouse move (desktop only) ── */
    if (window.matchMedia('(min-width:769px)').matches) {
        const blobs = document.querySelectorAll('.blob');
        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - .5) * 2;
            const y = (e.clientY / window.innerHeight - .5) * 2;
            blobs.forEach((blob, i) => {
                const factor = (i + 1) * 12;
                blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    /* ── AUTH GUARD REDIRECT HANDLER ── */
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
        const checkOpen = setInterval(() => {
            if (typeof window.openLogin === 'function') {
                window.openLogin();
                clearInterval(checkOpen);
            }
        }, 100);
        setTimeout(() => clearInterval(checkOpen), 3000);
    }
});

function updateAuthUI() {
    if (typeof window.AuthService !== 'undefined' && window.AuthService.isAuthenticated()) {
        const user = window.AuthService.getUser();
        if (user) {
            const navCtrs = document.querySelectorAll('.nav-inner');
            navCtrs.forEach(nav => {
                const cta = nav.querySelector('.nav-cta');
                if (cta) cta.style.display = 'none';
                
                // Add user profile UI if it doesn't exist yet
                if (!nav.querySelector('.auth-user-profile')) {
                    const profileDiv = document.createElement('div');
                    profileDiv.className = 'auth-user-profile';
                    profileDiv.style.display = 'flex';
                    
                    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    
                    profileDiv.innerHTML = `
                        <div class="auth-user-avatar">${initials}</div>
                        <div class="auth-user-name">${user.name.split(' ')[0]}</div>
                        <button class="auth-logout-btn" title="Logout" onclick="window.AuthService.logout()">⎋</button>
                    `;
                    nav.appendChild(profileDiv);
                }
            });
            
            // Auto close login modal if it's open
            if (typeof closeLogin === 'function') closeLogin();
        }
    }
}

// Initial UI check
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Auth Success Interceptor — wraps showSuccess after all modules have loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.showSuccess !== 'undefined') {
        const originalShowSuccess = window.showSuccess;
        window.showSuccess = function(userName) {
            originalShowSuccess(userName);
            setTimeout(updateAuthUI, 100);
        };
    }
});
