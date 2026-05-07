const fs = require('fs');
const path = require('path');

const loginJsPath = path.join(__dirname, '..', 'login.js');
let loginJs = fs.readFileSync(loginJsPath, 'utf8');

// 1. Replace the mock `sendOTP` with the real one
const sendOTPMock = `function sendOTP(btnElement) {
    const isEmail = currentMethod === 'email';
    const inputId = isEmail ? 'login-email-in' : 'login-mobile-in';
    const input = document.getElementById(inputId);
    
    if (!validateField(input, isEmail ? 'email' : 'mobile')) return;

    btnElement.classList.add('loading');
    btnElement.disabled = true;
    const originalText = btnElement.innerText;
    btnElement.innerHTML = '<div class="login-loading-spinner"></div> Sending...';

    const contactVal = input.value;
    
    // Generate 4-digit OTP
    sessionOTP = Math.floor(1000 + Math.random() * 9000).toString();
    sessionTarget = contactVal;

    // Real Email delivery via EmailJS
    if (isEmail && typeof emailjs !== 'undefined') {
        const isConfigured = AUTH_CONFIG.emailjs.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY" && 
                            AUTH_CONFIG.emailjs.serviceId !== "YOUR_SERVICE_ID";

        if (!isConfigured) {
            console.warn("EmailJS not configured. Using PlaceNix Simulator.");
            showToast(\`🚀 [SIMULATOR] OTP for \${contactVal}: <b>\${sessionOTP}</b>\`, 'info');
            setTimeout(() => {
                showToast('💡 Configure real EmailJS in <a href="admin.html" style="color:var(--lime);text-decoration:underline">Admin Settings</a>', 'warning');
            }, 1000);
            finalizeOTPSending(btnElement, originalText, isEmail, contactVal);
            return;
        }

        const templateParams = {
            to_name: contactVal.split('@')[0],
            to_email: contactVal,
            otp_code: sessionOTP
        };

        emailjs.send(AUTH_CONFIG.emailjs.serviceId, AUTH_CONFIG.emailjs.templateId, templateParams)
            .then(() => {
                showToast(\`📧 OTP sent successfully to \${contactVal}\`, 'success');
                finalizeOTPSending(btnElement, originalText, isEmail, contactVal);
            }, (error) => {
                console.error('EmailJS Error:', error);
                showToast(\`⚠️ EmailJS Failed. Using Simulator OTP: <b>\${sessionOTP}</b>\`, 'warning');
                finalizeOTPSending(btnElement, originalText, isEmail, contactVal);
            });
    } else {
        // Mock mobile or fallback
        setTimeout(() => {
            showToast(\`📱 [SIMULATOR] SMS Code to \${contactVal}: <b>\${sessionOTP}</b>\`, 'info');
            finalizeOTPSending(btnElement, originalText, isEmail, contactVal);
        }, 1500);
    }
}`;

const sendOTPReal = `async function sendOTP(btnElement) {
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
                    showToast(\`🔧 Backend Dev OTP: <b>\${res._dev_otp}</b>\`, 'info');
                } else {
                    showToast(\`📧 OTP sent successfully to \${contactVal}\`, 'success');
                }
            }
        } else {
            showToast(\`📱 SMS not implemented in backend yet. Use Email.\`, 'warning');
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
}`;

loginJs = loginJs.replace(sendOTPMock, sendOTPReal);


// 2. Replace the mock verifyOTP with the real one
const verifyOTPMock = `function verifyOTP() {
    const btn = document.getElementById('otp-verify-btn');
    const code = btn.dataset.code;
    const container = document.getElementById('otp-box-container');
    
    // Check against session code (default 1234 if and only if not set)
    const targetCode = sessionOTP || '1234';

    if (code !== targetCode) {
        container.classList.remove('error');
        void container.offsetWidth;
        container.classList.add('error');
        document.getElementById('otp-error-msg').style.display = 'block';
        document.getElementById('otp-error-msg').innerText = "Invalid OTP. Please check your mail.";
    } else {
        container.classList.remove('error');
        document.getElementById('otp-error-msg').style.display = 'none';
        showSuccess(sessionTarget ? sessionTarget.split('@')[0] : "Candidate");
    }
}`;

const verifyOTPReal = `async function verifyOTP() {
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
}`;

loginJs = loginJs.replace(verifyOTPMock, verifyOTPReal);


// 3. Replace handleSignup with the real one
const handleSignupMock = `function handleSignup() {
    const terms = document.getElementById('signup-terms');
    const termsGroup = document.getElementById('terms-group');
    
    if (!terms.checked) {
        termsGroup.classList.remove('error');
        void termsGroup.offsetWidth;
        termsGroup.classList.add('error');
        return;
    }
    termsGroup.classList.remove('error');

    const btn = document.getElementById('signup-submit-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerHTML = '<div class="login-loading-spinner"></div> Creating account...';

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.innerText = originalText;
        
        const name = document.getElementById('signup-name').value || "Student";
        showSuccess(name);
    }, 2000);
}`;

const handleSignupReal = `async function handleSignup() {
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
            const res = await window.AuthService.signup({ name, email, mobile, password });
            showSuccess(res.user.name);
        }
    } catch (err) {
        showToast(err.message, 'error');
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.innerText = originalText;
    }
}`;

loginJs = loginJs.replace(handleSignupMock, handleSignupReal);


// 4. Also import auth.js before login.js in all HTML files
const htmlFiles = [
    'index.html', 'dashboard.html', 'questionbank.html', 'interview.html', 'company.html', 'resume.html'
];
for (const file of htmlFiles) {
    const htmlPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(htmlPath)) continue;
    let html = fs.readFileSync(htmlPath, 'utf8');
    if (html.includes('login.js') && !html.includes('auth.js')) {
        html = html.replace('<script src="login.js"></script>', '<script src="js/auth.js"></script>\n    <script src="login.js"></script>');
        fs.writeFileSync(htmlPath, html);
    }
}

fs.writeFileSync(loginJsPath, loginJs);
console.log('Successfully wired backend auth to frontend!');
