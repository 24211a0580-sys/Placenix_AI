// ── INTEGRATIONS CONFIG ──
const AUTH_CONFIG = {
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    },
    emailjs: {
        publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
        serviceId: "YOUR_SERVICE_ID",
        templateId: "YOUR_TEMPLATE_ID"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // PERSISTENCE: Check for user-defined keys from Admin Dashboard
    const savedKeys = JSON.parse(localStorage.getItem('placenix_keys') || '{}');
    if (savedKeys.firebase) {
        Object.assign(AUTH_CONFIG.firebase, savedKeys.firebase);
    }
    if (savedKeys.emailjs) {
        Object.assign(AUTH_CONFIG.emailjs, savedKeys.emailjs);
    }

    // Initialize Firebase
    if (typeof firebase !== 'undefined' && AUTH_CONFIG.firebase.apiKey !== "YOUR_FIREBASE_API_KEY") {
        firebase.initializeApp(AUTH_CONFIG.firebase);
    }
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && AUTH_CONFIG.emailjs.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
        emailjs.init(AUTH_CONFIG.emailjs.publicKey);
    }

    // Generate scattered micro dots
    const decoContainer = document.querySelector('.login-bg-deco');
    if (decoContainer) {
        const colors = ['#CAFF00', '#FF4ECD', '#00C2FF', '#FFFFFF'];
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'login-micro-dot';
            dot.style.background = colors[Math.floor(Math.random() * colors.length)];
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.animationDelay = `${Math.random() * 4}s`;
            decoContainer.appendChild(dot);
        }
    }
});

let currentMethod = 'email'; // 'email' or 'mobile'
let resendTimer = null;
let sessionOTP = null; // Stores the active code for verification
let sessionTarget = null; // Stores the email/mobile targeted 

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
    toast.innerHTML = msg; // Support HTML for links
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
window.showToast = showToast;

function openLogin() {
    const overlay = document.getElementById('loginOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('active');
        overlay.classList.remove('closing');
        resetToWelcome();
    }, 10);
}

function closeLogin() {
    const overlay = document.getElementById('loginOverlay');
    overlay.classList.add('closing');
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

// Ensure global accessibility for button clicks across files
window.openLogin = openLogin;
window.closeLogin = closeLogin;

function switchView(viewId) {
    document.querySelectorAll('.login-view').forEach(v => v.classList.remove('active-view'));
    document.getElementById(viewId).classList.add('active-view');
}

function switchTab(tabType) {
    document.querySelectorAll('.login-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (tabType === 'LOGIN') {
        document.getElementById('tab-login-btn').classList.add('active');
        resetToWelcome();
    } else {
        document.getElementById('tab-signup-btn').classList.add('active');
        switchView('view-signup');
    }
}

function resetToWelcome() {
    switchView('view-welcome');
}

function showEmailFlow() {
    currentMethod = 'email';
    switchView('view-email');
}

function showMobileFlow() {
    currentMethod = 'mobile';
    switchView('view-mobile');
}

function handleGoogleAuth() {
    if (typeof firebase === 'undefined') {
        alert("Firebase SDK not loaded. Please check your internet connection.");
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            showSuccess(user.displayName || "Explorer");
        }).catch((error) => {
            console.error("Auth Error:", error);
            if (error.code === 'auth/popup-closed-by-user') return;
            alert("Auth failed: " + error.message);
        });
}

/* Validation Utilities */
function validateEmailFormat(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateMobileFormat(mobile) {
    return /^\d{10}$/.test(mobile);
}

function validateField(inputElement, type) {
    const val = inputElement.value.trim();
    let isValid = false;
    let errorMsg = '';

    if (type === 'email') {
        isValid = validateEmailFormat(val);
        errorMsg = 'Please enter a valid email address';
    } else if (type === 'mobile') {
        isValid = validateMobileFormat(val);
        errorMsg = 'Please enter a valid 10-digit number';
    } else if (type === 'name') {
        isValid = val.length >= 3;
        errorMsg = 'Name must be at least 3 characters';
    } else if (type === 'password') {
        isValid = val.length >= 8;
        errorMsg = 'Password must be at least 8 characters';
        updatePasswordStrength(val);
    }

    const parent = inputElement.closest('.login-input-wrapper');
    const errorSpan = parent.querySelector('.login-error-text');
    
    if (val.length === 0) {
        inputElement.classList.remove('valid', 'error');
        if (errorSpan) errorSpan.style.display = 'none';
        return false;
    }

    if (isValid) {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        if (errorSpan) errorSpan.style.display = 'none';
        return true;
    } else {
        inputElement.classList.remove('valid');
        // trigger reflow to restart animation
        inputElement.classList.remove('error');
        void inputElement.offsetWidth; 
        inputElement.classList.add('error');
        
        if (errorSpan) {
            errorSpan.innerText = errorMsg;
            errorSpan.style.display = 'block';
        }
        return false;
    }
}

function attachValidationListeners() {
    const emailInput = document.getElementById('login-email-in');
    if(emailInput) emailInput.addEventListener('blur', (e) => validateField(e.target, 'email'));

    const mobileInput = document.getElementById('login-mobile-in');
    if(mobileInput) mobileInput.addEventListener('blur', (e) => validateField(e.target, 'mobile'));

    const signupName = document.getElementById('signup-name');
    if(signupName) signupName.addEventListener('blur', (e) => validateField(e.target, 'name'));

    const signupEmail = document.getElementById('signup-email');
    if(signupEmail) signupEmail.addEventListener('blur', (e) => validateField(e.target, 'email'));

    const signupMobile = document.getElementById('signup-mobile');
    if(signupMobile) signupMobile.addEventListener('blur', (e) => validateField(e.target, 'mobile'));

    const signupPwd = document.getElementById('signup-pwd');
    if(signupPwd) {
        signupPwd.addEventListener('input', (e) => updatePasswordStrength(e.target.value));
        signupPwd.addEventListener('blur', (e) => validateField(e.target, 'password'));
    }
}

function updatePasswordStrength(pwd) {
    const bars = document.querySelectorAll('.login-pwd-bar');
    bars.forEach(b => b.className = 'login-pwd-bar');

    if (pwd.length === 0) return;

    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    if (strength === 1 || pwd.length < 8) {
        bars[0].classList.add('weak');
    } else if (strength === 2) {
        bars[0].classList.add('medium');
        bars[1].classList.add('medium');
    } else if (strength >= 3) {
        bars[0].classList.add('strong');
        bars[1].classList.add('strong');
        bars[2].classList.add('strong');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

/* OTP FLOW */
async function sendOTP(btnElement) {
    const isEmail = currentMethod === 'email';
    const inputId = isEmail ? 'login-email-in' : 'login-mobile-in';
    const input = document.getElementById(inputId);
    
    if (!validateField(input, isEmail ? 'email' : 'mobile')) return;

    btnElement.classList.add('loading');
    btnElement.disabled = true;
    const originalText = btnElement.innerText;
    btnElement.innerHTML = '<div class="login-loading-spinner"></div> Sending...';

    const contactVal = input.value;
    sessionTarget = contactVal;

    try {
        if (isEmail) {
            if (window.AuthService) {
                const res = await window.AuthService.sendOTP(contactVal);
                if (res._dev_otp) {
                    // DEV ONLY
                    showToast(`🔧 Backend Dev OTP: <b>${res._dev_otp}</b>`, 'info');
                } else {
                    showToast(`📧 OTP sent successfully to ${contactVal}`, 'success');
                }
            }
        } else {
            showToast(`📱 SMS not implemented in backend yet. Use Email.`, 'warning');
            btnElement.classList.remove('loading');
            btnElement.disabled = false;
            btnElement.innerText = originalText;
            return;
        }
        finalizeOTPSending(btnElement, originalText, isEmail, contactVal);
    } catch (err) {
        showToast(err.message, 'error');
        btnElement.classList.remove('loading');
        btnElement.disabled = false;
        btnElement.innerText = originalText;
    }
}

function finalizeOTPSending(btnElement, originalText, isEmail, contactVal) {
    btnElement.classList.remove('loading');
    btnElement.disabled = false;
    btnElement.innerText = originalText;
    
    document.getElementById('otp-sent-to').innerText = isEmail ? contactVal : `+91 ******${contactVal.slice(-4)}`;
    
    switchView('view-otp');
    setupOTPBoxes();
    startResendTimer();
}

function setupOTPBoxes() {
    const boxes = document.querySelectorAll('.login-otp-box');
    boxes.forEach(box => box.value = '');
    document.getElementById('otp-verify-btn').disabled = true;
    boxes[0].focus();

    boxes.forEach((box, index) => {
        // Prevent multiple listener bindings
        const newBox = box.cloneNode(true);
        box.parentNode.replaceChild(newBox, box);
        
        newBox.addEventListener('input', function() {
            if (this.value.length > 1) this.value = this.value.slice(0, 1);
            if (this.value.length === 1) {
                if (index < 3) document.querySelectorAll('.login-otp-box')[index + 1].focus();
            }
            checkOTPComplete();
        });

        newBox.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                document.querySelectorAll('.login-otp-box')[index - 1].focus();
            }
        });
    });
}

function checkOTPComplete() {
    const boxes = document.querySelectorAll('.login-otp-box');
    let complete = true;
    let code = '';
    boxes.forEach(b => {
        if (!b.value) complete = false;
        code += b.value;
    });
    const btn = document.getElementById('otp-verify-btn');
    btn.disabled = !complete;
    btn.dataset.code = code;
}

async function verifyOTP() {
    const btn = document.getElementById('otp-verify-btn');
    const code = btn.dataset.code;
    const container = document.getElementById('otp-box-container');
    
    btn.disabled = true;
    btn.innerHTML = '<div class="login-loading-spinner"></div> Verifying...';

    try {
        if (window.AuthService) {
            const res = await window.AuthService.verifyOTP(sessionTarget, code);
            container.classList.remove('error');
            document.getElementById('otp-error-msg').style.display = 'none';
            showSuccess(res.user.name || sessionTarget.split('@')[0]);
        }
    } catch (err) {
        container.classList.remove('error');
        void container.offsetWidth;
        container.classList.add('error');
        document.getElementById('otp-error-msg').style.display = 'block';
        document.getElementById('otp-error-msg').innerText = err.message || "Invalid OTP";
        btn.disabled = false;
        btn.innerText = 'VERIFY & LOGIN';
    }
}

function startResendTimer() {
    let seconds = 45;
    const timerElem = document.getElementById('resend-timer');
    const linkElem = document.getElementById('resend-link');
    
    clearInterval(resendTimer);
    linkElem.classList.remove('active');
    
    resendTimer = setInterval(() => {
        seconds--;
        timerElem.innerText = `Resend in 0:${seconds < 10 ? '0' : ''}${seconds}`;
        if (seconds <= 0) {
            clearInterval(resendTimer);
            timerElem.innerText = '';
            linkElem.classList.add('active');
        }
    }, 1000);
}

function resendOTP() {
    const linkElem = document.getElementById('resend-link');
    if (!linkElem.classList.contains('active')) return;
    
    alert("New OTP sent via test module: 1234");
    startResendTimer();
}

/* SIGNUP FLOW */
async function handleSignup() {
    const terms = document.getElementById('signup-terms');
    const termsGroup = document.getElementById('terms-group');
    
    if (!terms.checked) {
        termsGroup.classList.remove('error');
        void termsGroup.offsetWidth;
        termsGroup.classList.add('error');
        return;
    }
    termsGroup.classList.remove('error');

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const mobile = document.getElementById('signup-mobile').value;
    const password = document.getElementById('signup-pwd').value;
    const college = document.getElementById('signup-college')?.value || '';
    const branch = document.getElementById('signup-branch')?.value || '';
    const year = document.getElementById('signup-year')?.value || '';

    if (!name || !email || !password) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    const btn = document.getElementById('signup-submit-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerHTML = '<div class="login-loading-spinner"></div> Creating account...';

    try {
        if (window.AuthService) {
            const res = await window.AuthService.signup({ name, email, mobile, college, branch, year, password });
            showSuccess(res.user.name);
        }
    } catch (err) {
        showToast(err.message, 'error');
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const termsCb = document.getElementById('signup-terms');
    if (termsCb) {
        termsCb.addEventListener('change', (e) => {
            document.getElementById('signup-submit-btn').disabled = !e.target.checked;
        });
    }
    attachValidationListeners();
});

/* SUCCESS STATE */
function showSuccess(userName) {
    switchView('view-success');
    document.getElementById('success-name').innerText = `Welcome to PlaceNix.ai, ${userName}!`;
    
    // PERSISTENCE: Save user to localStorage
    localStorage.setItem('placenix_user', JSON.stringify({
        name: userName,
        loginTime: new Date().toISOString()
    }));
    
    // Generate confetti
    const view = document.getElementById('view-success');
    for (let i = 0; i < 20; i++) {
        const conf = document.createElement('div');
        conf.className = 'login-confetti';
        const colors = ['#CAFF00', '#FF4ECD', '#00C2FF', '#FFFFFF'];
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random spread
        const tx = (Math.random() - 0.5) * 400;
        const ty = (Math.random() - 0.5) * 400;
        conf.style.setProperty('--tx', `${tx}px`);
        conf.style.setProperty('--ty', `${ty}px`);
        
        view.appendChild(conf);
    }

    // Start progress bar redirect
    setTimeout(() => {
        document.getElementById('success-progress').style.width = '100%';
    }, 100);

    setTimeout(() => {
        closeLogin();
        // Redirect logic below
        // window.location.href = 'dashboard.html';
        const toastContainer = document.getElementById('toastContainer');
        if (toastContainer && typeof showToast === 'function') {
            showToast('Redirecting to Dashboard...');
        } else {
            console.log("Redirect to dashboard triggered.");
            window.location.href = "dashboard.html"; 
        }
    }, 2600);
}
