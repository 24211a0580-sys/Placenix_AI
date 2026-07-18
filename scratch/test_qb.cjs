// scratch/test_qb.cjs
const fs = require('fs');
const path = require('path');

// Mock window and document
const window = {
  AuthService: {
    isAuthenticated: () => false
  }
};
global.window = window;
global.document = {
  addEventListener: () => {},
  getElementById: (id) => {
    return {
      innerHTML: '',
      textContent: '',
      classList: {
        add: () => {},
        remove: () => {}
      }
    };
  },
  querySelectorAll: () => []
};
global.localStorage = {
  getItem: () => '[]',
  setItem: () => {}
};

// Load questionBankData.js
const dataCode = fs.readFileSync(path.join(__dirname, '../js/questionBankData.js'), 'utf8');
eval(dataCode); // executes and sets window.QUESTION_BANK_DATA

// Load questionBankLogic.js
const logicCode = fs.readFileSync(path.join(__dirname, '../js/questionBankLogic.js'), 'utf8');
eval(logicCode);

// Mock fetch
global.fetch = async (url) => {
  return {
    ok: true,
    json: async () => {
      // Return mock questions
      return window.QUESTION_BANK_DATA.questions;
    }
  };
};

// Load questionBankUI.js
const uiCode = fs.readFileSync(path.join(__dirname, '../js/questionBankUI.js'), 'utf8') + '\nwindow.state = state;';

// Define a test runner
async function runTest() {
  try {
    eval(uiCode);
    console.log('Successfully parsed questionBankUI.js code!');
    
    // Call enrichQuestionData
    if (typeof enrichQuestionData === 'function') {
      await enrichQuestionData();
      console.log('Successfully ran enrichQuestionData()!');
      console.log('Total questions enriched:', window.state.allQuestions.length);
      console.log('Enriched sample question companies:', window.state.allQuestions[0].companies);
      console.log('Enriched sample question companyId:', window.state.allQuestions[0].companyId);
      console.log('Enriched sample question companyName:', window.state.allQuestions[0].companyName);
    } else {
      console.error('enrichQuestionData is not a function');
    }
  } catch (err) {
    console.error('CRASH DETECTED during execution:', err);
  }
}

runTest();
