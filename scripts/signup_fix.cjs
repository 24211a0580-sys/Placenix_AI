const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'login.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Add IDs
html = html.replace(
  '<input type="text" class="login-input" placeholder="Your college / university">',
  '<input type="text" class="login-input" id="signup-college" placeholder="Your college / university">'
);

html = html.replace(
  '<select class="login-input" style="padding-left:16px;">\\n            <option value="" disabled selected>Branch</option>',
  '<select class="login-input" id="signup-branch" style="padding-left:16px;">\\n            <option value="" disabled selected>Branch</option>'
);

html = html.replace(
  '<select class="login-input" style="padding-left:16px;">\\n            <option value="" disabled selected>Year</option>',
  '<select class="login-input" id="signup-year" style="padding-left:16px;">\\n            <option value="" disabled selected>Year</option>'
);

fs.writeFileSync(htmlPath, html);

const jsPath = path.join(__dirname, '..', 'login.js');
let loginJs = fs.readFileSync(jsPath, 'utf8');

const oldHandleSignup = `    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const mobile = document.getElementById('signup-mobile').value;
    const password = document.getElementById('signup-pwd').value;`;

const newHandleSignup = `    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const mobile = document.getElementById('signup-mobile').value;
    const password = document.getElementById('signup-pwd').value;
    const college = document.getElementById('signup-college')?.value || '';
    const branch = document.getElementById('signup-branch')?.value || '';
    const year = document.getElementById('signup-year')?.value || '';`;

loginJs = loginJs.replace(oldHandleSignup, newHandleSignup);

const oldCall = `const res = await window.AuthService.signup({ name, email, mobile, password });`;
const newCall = `const res = await window.AuthService.signup({ name, email, mobile, college, branch, year, password });`;

loginJs = loginJs.replace(oldCall, newCall);

fs.writeFileSync(jsPath, loginJs);

console.log('Fixed IDs and signup logic!');
