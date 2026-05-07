import fetch from 'node-fetch';

async function testResume() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
  });
  
  const loginData = await loginRes.json();
  if (!loginData.token) {
      console.log('Login failed (expected if test user not created). Trying signup...');
      const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' })
      });
      const signupData = await signupRes.json();
      loginData.token = signupData.token;
  }

  console.log('Testing Resume Analysis...');
  const res = await fetch('http://localhost:3000/api/resume/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`
    },
    body: JSON.stringify({
      text: 'Experience: Software Engineer at Google for 5 years. Skills: React, Node.js, Python.',
      filename: 'my_resume.pdf'
    })
  });

  const data = await res.json();
  console.log('Analysis Result:', JSON.stringify(data, null, 2));

  console.log('Testing History...');
  const historyRes = await fetch('http://localhost:3000/api/resume/history', {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  const history = await historyRes.json();
  console.log('History Items:', history.length);
}

testResume();
