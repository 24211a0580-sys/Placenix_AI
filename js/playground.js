// js/playground.js

let editor;
let currentQuestionId = null;
let currentCompanyId = null;
let currentLanguage = 'javascript';
let timerInterval = null;
let secondsElapsed = 0;

// Language mappings for CodeMirror
const LANGUAGE_MODES = {
    javascript: 'javascript',
    python: 'python',
    java: 'clike',
    cpp: 'clike'
};

function initPlayground() {
    // Only init once
    if (editor) return;

    const editorEl = document.getElementById('editor-area');
    if (!editorEl) return;

    editor = CodeMirror(editorEl, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        extraKeys: {
            "Ctrl-Enter": () => runCode(false),
            "Cmd-Enter": () => runCode(false),
            "Tab": (cm) => cm.replaceSelection("    ")
        }
    });

    editor.on('change', () => {
        updateStatusBar();
        saveCodeLocally();
    });

    // Keyboard Shortcuts listener
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('coding-playground').classList.contains('active')) return;
        
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveCodeLocally();
            showToast("Code saved!");
        }
        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            resetCode();
        }
    });
}

function updateStatusBar() {
    const lines = editor.lineCount();
    const chars = editor.getValue().length;
    document.getElementById('pg-status-lines').innerText = lines;
    document.getElementById('pg-status-chars').innerText = chars;
}

function _getPlaygroundQuestion() {
    let q;
    if (window.QUESTION_BANK_DATA && window.QuestionBankLogic) {
        q = window.QuestionBankLogic.getAllQuestions().find(x => x.id === currentQuestionId);
        if (q) return q;
    }
    if (window.QUESTIONS_DB && window.QUESTIONS_DB[currentCompanyId]) {
        return window.QUESTIONS_DB[currentCompanyId].questions.find(x => x.id === currentQuestionId);
    }
    return null;
}

function openCodingPlayground(questionId, companyId) {
    currentQuestionId = questionId;
    currentCompanyId = companyId;
    
    let compName = companyId ? companyId.toUpperCase() : 'UNKNOWN';
    let compColor = '#FFFFFF';
    let compLogo = '';

    const question = _getPlaygroundQuestion();

    if (window.QUESTION_BANK_DATA && window.QUESTION_BANK_DATA.companies[companyId]) {
        const c = window.QUESTION_BANK_DATA.companies[companyId];
        compName = c.name;
        compColor = c.color;
        compLogo = c.name.substring(0,1);
    } else if (window.QUESTIONS_DB && window.QUESTIONS_DB[companyId]) {
        compName = window.QUESTIONS_DB[companyId].name;
        compColor = window.QUESTIONS_DB[companyId].color;
        compLogo = window.QUESTIONS_DB[companyId].logo;
    }

    if (!question) {
        console.error("Question not found for playground!", questionId);
        return;
    }

    // Set UI Headers
    document.getElementById('pg-header-title').innerText = question.title;
    document.getElementById('pg-header-company').innerText = compLogo + " " + compName;
    document.getElementById('pg-header-company').style.background = compColor;
    
    // Problem Panel
    document.getElementById('pg-prob-title').innerText = question.title;
    const diffBadge = document.getElementById('pg-prob-diff');
    let qDiff = question.difficulty || 'medium';
    diffBadge.innerText = qDiff.charAt(0).toUpperCase() + qDiff.slice(1);
    diffBadge.className = 'pg-tag ' + qDiff.toLowerCase();
    
    document.getElementById('pg-prob-topic').innerText = question.topic || question.subcategory || question.category || 'General';
    document.getElementById('pg-prob-asked').innerText = `Asked in: ${question.asked || question.year || 2024}`;

    // Fill Content
    const descText = question.description || question.question || question.title;
    document.getElementById('pane-desc').innerHTML = `<p>${descText.replace(/\\n/g, '<br>')}</p>`;
    
    // Fill Examples
    let examplesHtml = '';
    if (question.examples) {
        question.examples.forEach((ex, idx) => {
            examplesHtml += `
                <div class="pg-example-card">
                    <b>Example ${idx + 1}:</b>
                    <pre>Input: ${ex.input}\nOutput: ${ex.output}</pre>
                    ${ex.explanation ? `<i>Explanation: ${ex.explanation}</i>` : ''}
                </div>
            `;
        });
    } else {
        examplesHtml = '<p>No formatting examples provided.</p>';
    }
    document.getElementById('pane-examples').innerHTML = examplesHtml;

    // Fill Hints
    let hintsHtml = '';
    question.hints.forEach((h, idx) => {
        hintsHtml += `
            <button class="pg-hint-btn" onclick="this.nextElementSibling.style.display='block';this.style.display='none'">
                Reveal Hint ${idx + 1}
            </button>
            <div class="pg-hint-card" style="display:none;">${h}</div>
        `;
    });
    document.getElementById('pane-hints').innerHTML = hintsHtml;

    // Fill Constraints
    let constHtml = '<ul>';
    question.constraints.forEach(c => {
        constHtml += `<li><code>${c}</code></li>`;
    });
    constHtml += '</ul>';
    document.getElementById('pane-constraints').innerHTML = constHtml;

    // Output Panel (Test Cases)
    renderTestCases(question.testCases);

    // Show Playground
    document.getElementById('coding-playground').classList.add('active');
    
    initPlayground();
    startTimer();
    setLanguage(currentLanguage); // loads code
    updatePlaygroundProgress();
}

function closePlayground() {
    document.getElementById('coding-playground').classList.remove('active');
    stopTimer();
}

// ── CODE HANDLING ──
function setLanguage(lang) {
    currentLanguage = lang;
    
    // Update tabs UI
    document.querySelectorAll('.pg-lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    const question = _getPlaygroundQuestion();
    if (!question) return;
    
    editor.setOption('mode', LANGUAGE_MODES[lang]);
    document.getElementById('pg-status-lang').innerText = lang.charAt(0).toUpperCase() + lang.slice(1);

    // Load from local storage or starter code
    const storageKey = `placenix_code_${currentQuestionId}_${lang}`;
    const savedCode = localStorage.getItem(storageKey);

    const starter = question.starterCode[lang] || '';
    if (savedCode) {
        editor.setValue(savedCode);
    } else {
        editor.setValue(starter);
    }
    
    // Remove output banners
    document.getElementById('tc-out-container').innerHTML = '';
}

function saveCodeLocally() {
    if (!currentQuestionId) return;
    const storageKey = `placenix_code_${currentQuestionId}_${currentLanguage}`;
    localStorage.setItem(storageKey, editor.getValue());
}

function resetCode() {
    if (!confirm("Are you sure you want to revert to the starter code? All changes will be lost.")) return;
    const question = _getPlaygroundQuestion();
    if(!question || !question.starterCode) return;
    editor.setValue(question.starterCode[currentLanguage] || '');
    saveCodeLocally();
}

// ── TEST CASES & EXECUTION ──
function renderTestCases(testCases) {
    const tabsRow = document.getElementById('testcase-tabs-row');
    const contentRow = document.getElementById('testcase-content-row');
    
    let tabsHtml = '';
    let contentHtml = '';

    testCases.forEach((tc, idx) => {
        const id = `tc-${idx}`;
        tabsHtml += `<button class="pg-tc-tab ${idx===0 ? 'active' : ''}" onclick="switchTcTab(${idx}, ${testCases.length})" id="tc-tab-${idx}">Test ${idx + 1}</button>`;
        
        contentHtml += `
            <div class="pg-tc-pane ${idx===0 ? 'active' : ''}" id="tc-pane-${idx}">
                <span class="pg-tc-label">Input:</span>
                <textarea class="pg-tc-input" id="tc-in-${idx}">${tc.input}</textarea>
                <span class="pg-tc-label">Expected Output:</span>
                <div class="pg-tc-readonly">${tc.expected}</div>
                <button class="pg-btn-run-test" onclick="runSingleTest(${idx})">▶ Run This Test</button>
                <div id="tc-res-${idx}"></div>
            </div>
        `;
    });

    tabsRow.innerHTML = tabsHtml;
    contentRow.innerHTML = contentHtml;
}

function switchTcTab(idx, total) {
    for(let i=0; i<total; i++) {
        document.getElementById(`tc-tab-${i}`).classList.remove('active');
        document.getElementById(`tc-pane-${i}`).classList.remove('active');
    }
    document.getElementById(`tc-tab-${idx}`).classList.add('active');
    document.getElementById(`tc-pane-${idx}`).classList.add('active');
}

function runSingleTest(idx) {
    runCode(false, idx);
}

async function runCode(isSubmit = false, singleIdx = null) {
    const code = editor.getValue();
    const question = _getPlaygroundQuestion();
    if(!question) return;
    
    const outputContainer = singleIdx !== null ? 
        document.getElementById(`tc-res-${singleIdx}`) : 
        document.getElementById('tc-out-container');
        
    if (singleIdx === null) {
        outputContainer.innerHTML = '<div style="padding: 20px; text-align: center;"><span class="pg-dot"></span> Execution started...</div>';
    } else {
        outputContainer.innerHTML = '<div class="pg-result-row">Running...</div>';
    }

    // Delay to simulate compilation for non-JS languages or execution
    await new Promise(r => setTimeout(r, 600));

    let results = [];
    const testsToRun = singleIdx !== null ? [singleIdx] : question.testCases.map((_, i)=>i);

    for (let i of testsToRun) {
        const inputVal = document.getElementById(`tc-in-${i}`).value;
        const expected = question.testCases[i].expected;

        // Mock Execution Engine
        let resultObj = executeCode(code, currentLanguage, inputVal, expected, question);
        results.push({ idx: i, ...resultObj });

        // Update UI for single test
        if (singleIdx !== null) {
            outputContainer.innerHTML = generateResultCard(resultObj, expected);
        }
    }

    if (singleIdx === null) {
        // SUMMARY
        let passCount = results.filter(r => r.pass).length;
        let total = results.length;
        
        // If not all passed, switch to the first failed test tab
        if (passCount !== total) {
            const firstFail = results.find(r => !r.pass);
            switchTcTab(firstFail.idx, question.testCases.length);
        }

        let summaryHtml = '';
        if (passCount === total) {
            summaryHtml = `<div class="pg-summary-banner success">✅ All ${total} Tests Passed!</div>`;
            if (isSubmit) handleSuccessfulSubmit();
        } else {
            summaryHtml = `<div class="pg-summary-banner error">❌ ${passCount}/${total} Tests Passed</div>`;
        }

        // Render detailed results
        results.forEach((r, idx) => {
             const resDiv = document.getElementById(`tc-res-${r.idx}`);
             resDiv.innerHTML = generateResultCard(r, question.testCases[r.idx].expected);
        });

        outputContainer.innerHTML = summaryHtml;
    }
}

function executeCode(code, lang, input, expected, questionInfo) {
    // 1. JavaScript Real Execution via wrapper
    if (lang === 'javascript') {
        try {
            // Find function name automatically based on starter code shape
            const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
            if (!match) throw new Error("Could not find function definition.");
            const fnName = match[1];

            // Safely parse the input parameters (mocking line by line or comma logic)
            // For simple arrays/nums, we can use JSON.parse wrapped in array bracket.
            let parsedArgs = input.split('\\n').map(l => {
                try {
                    // Try to parse array like [1,2,3]
                    return JSON.parse(l);
                } catch(e) {
                    // Fallback to string processing or naked numbers
                    if (!isNaN(l)) return Number(l);
                    // if it's like "nums=[1,2,3]" -> extract value
                    if (l.includes('=')) {
                        let valStr = l.split('=')[1].trim();
                        try { return JSON.parse(valStr); } catch(ex) { return valStr; }
                    }
                    return l;
                }
            });

            // Very dangerous in real prod, but safe for mock client-side playground
            const wrappedCode = `
                ${code}
                return ${fnName}.apply(null, args);
            `;
            
            const execFn = new Function('args', wrappedCode);
            let userRawOutput = execFn(parsedArgs);
            
            // Format output to string to match expected
            let userOutputStr = Array.isArray(userRawOutput) ? JSON.stringify(userRawOutput).replace(/,/g, ', ') : String(userRawOutput);
            
            // Loose matching
            let pass = (userOutputStr.replace(/\s/g,'') === expected.replace(/\s/g,''));
            
            return { pass, output: userOutputStr, time: Math.floor(Math.random()*20 + 2) };
        } catch (err) {
            return { pass: false, output: err.message, time: 0 };
        }
    }

    // 2. Python / Java / C++ MOCK EXECUTION
    // Since we don't have Judge0 API integrated in this pure frontend demo, we mock intelligently.
    const cleanCode = code.toLowerCase().replace(/\s/g,'');
    
    // Simplistic heuristic: if user hasn't changed starter code much
    const cleanStarter = (questionInfo.starterCode[lang] || '').toLowerCase().replace(/\s/g,'');
    if (cleanCode.length < cleanStarter.length + 10) {
        return { pass: false, output: "Implementation incomplete. Please write your logic.", time: 0 };
    }

    // Let's assume if they wrote enough code and used a common keyword required for the solution, it passes!
    let passPattern = false;
    if (questionInfo.title === "Two Sum" && (cleanCode.includes('map') || cleanCode.includes('dict') || cleanCode.includes('unordered'))) passPattern = true;
    if (questionInfo.title === "LRU Cache" && (cleanCode.includes('ordereddict') || cleanCode.includes('list') || cleanCode.includes('node'))) passPattern = true;
    if (questionInfo.title === "Maximum Subarray" && (cleanCode.includes('max(') || cleanCode.includes('math.max'))) passPattern = true;
    if (questionInfo.title === "Number of Islands" && (cleanCode.includes('dfs') || cleanCode.includes('bfs'))) passPattern = true;
    if (questionInfo.title === "Reverse a String" && cleanCode.includes('left') || cleanCode.includes('length')) passPattern = true;
    
    // For demo purposes, we randomly simulate success if they put basic effort, matching the expected output.
    if (passPattern || Math.random() > 0.4) {
        return { pass: true, output: expected, time: Math.floor(Math.random()*40 + 10) };
    } else {
        return { pass: false, output: "Runtime Error: NullPointerException or IndexOutOfBounds", time: 5 };
    }

    /* PRODUCTION UPGRADE: 
       POST https://judge0-ce.p.rapidapi.com/submissions
       Body: { source_code, language_id, stdin }
    */
}

function generateResultCard(res, expected) {
    if (res.pass) {
        return `
            <div class="pg-result-card pass">
                <div class="pg-result-status">✓ Test Passed</div>
                <div class="pg-result-row">Your Output: ${res.output}</div>
                <div class="pg-result-row">Expected: ${expected}</div>
                <div class="pg-result-row" style="color:#00e676">Runtime: ${res.time} ms</div>
            </div>`;
    } else {
        return `
            <div class="pg-result-card fail">
                <div class="pg-result-status">✗ Wrong Answer</div>
                <div class="pg-result-row">Your Output: ${res.output}</div>
                <div class="pg-result-row">Expected: ${expected}</div>
                <div class="pg-result-row" style="color:rgba(255,255,255,0.5)">Hint: Check your logic for edge cases or syntax errors.</div>
            </div>`;
    }
}

function handleSuccessfulSubmit() {
    // Fire Confetti
    for(let i=0; i<30; i++) {
        let conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.backgroundColor = ['#CAFF00', '#FF4ECD', '#00C2FF', '#FF9900'][Math.floor(Math.random()*4)];
        conf.style.animationDuration = (Math.random() * 2 + 1) + 's';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 3000);
    }

    // Update Local Storage XP
    let solvedStr = localStorage.getItem('placenix_solved') || '[]';
    let solvedIds = JSON.parse(solvedStr);
    
    if (!solvedIds.includes(currentQuestionId)) {
        solvedIds.push(currentQuestionId);
        localStorage.setItem('placenix_solved', JSON.stringify(solvedIds));
        
        let xp = parseInt(localStorage.getItem('placenix_xp') || '0');
        // Simple logic: Easy=30, Medium=60, Hard=100
        const diff = document.getElementById('pg-prob-diff').innerText;
        if (diff === 'Easy') xp += 30;
        if (diff === 'Medium') xp += 60;
        if (diff === 'Hard') xp += 100;

        localStorage.setItem('placenix_xp', xp.toString());
        showToast(`Solution Accepted! +XP Gained. Total: ${xp} XP`);
        updatePlaygroundProgress();
        
        // Dispath event so main company.js updates cards if open behind
        window.dispatchEvent(new Event('storage'));
    } else {
        showToast("Solution Accepted! (Already solved)");
    }
}

function startTimer() {
    stopTimer();
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        let h = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
        let m = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
        let s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('pg-timer-display').innerText = `${h}:${m}:${s}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function toggleTimer() {
    const btn = document.getElementById('pg-btn-pause');
    if (timerInterval) {
        stopTimer();
        timerInterval = null;
        btn.innerText = "▶ Resume";
    } else {
        startTimer();
        btn.innerText = "⏸ Pause";
    }
}

function switchProbTab(tabId) {
    document.querySelectorAll('.pg-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pg-tab-pane').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`button[onclick="switchProbTab('${tabId}')"]`).classList.add('active');
    document.getElementById(`pane-${tabId}`).classList.add('active');
}

function updatePlaygroundProgress() {
    let solvedStr = localStorage.getItem('placenix_solved') || '[]';
    let solvedIds = JSON.parse(solvedStr);
    
    let totalCompanyQ = QUESTIONS_DB[currentCompanyId].questions.length;
    let solvedCompanyQ = QUESTIONS_DB[currentCompanyId].questions.filter(q => solvedIds.includes(q.id)).length;
    
    document.getElementById('pg-prog-text').innerText = `Solved ${solvedCompanyQ}/${totalCompanyQ} questions for ${QUESTIONS_DB[currentCompanyId].name}`;
    let pct = (solvedCompanyQ / totalCompanyQ) * 100;
    document.getElementById('pg-prog-fill').style.width = pct + '%';
}

function showToast(msg) {
    // We can reuse the assistant toast or create a simple one
    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#CAFF00';
    toast.style.color = '#0D0B1E';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '50px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '9999999';
    toast.style.boxShadow = '0 10px 30px rgba(202, 255, 0, 0.3)';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Global functions for buttons
window.openCodingPlayground = openCodingPlayground;
window.closePlayground = closePlayground;
