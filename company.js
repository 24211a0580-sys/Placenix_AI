/* ==========================================================
   PlaceNix.ai — Company Interview Prep Interactions
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // We expect QUESTIONS_DB to be loaded globally from js/questionsDB.js
    if (!window.QUESTIONS_DB) {
        console.error("QUESTIONS_DB module not found! Ensure js/questionsDB.js loads before company.js.");
        return;
    }

    const DATA = window.QUESTIONS_DB;

    /* ══════════════════════════════════
       DOM REFS
       ══════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    const searchInput = document.getElementById('searchInput');
    const chips = document.querySelectorAll('.company-chip'); // We still use HTML chips but dynamic is better
    
    // Profile
    const profileName = document.getElementById('profileName');
    const profileBadge = document.getElementById('profileBadge');
    const profileMeta = document.getElementById('profileMeta');
    const timeline = document.getElementById('timeline');
    const questGrid = document.getElementById('questionsGrid');
    const simCompany = document.getElementById('simCompany');

    // Filters
    const qSearch = document.getElementById('qSearch');
    const diffFilter = document.getElementById('diffFilter');
    const topicFilter = document.getElementById('topicFilter');
    const stateFilter = document.getElementById('stateFilter');
    const filterCount = document.getElementById('filterCount');

    const urlParams = new URLSearchParams(window.location.search);
    let activeCompany = urlParams.get('c') || 'amazon';
    
    // Auto-select correct chip based on URL
    setTimeout(() => {
        const targetChip = document.querySelector(`.company-chip[data-company="${activeCompany}"]`);
        if (targetChip) {
            chips.forEach(c => c.classList.remove('active'));
            targetChip.classList.add('active');
        }
    }, 10);

    /* ── Navbar scroll ── */
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Mobile menu ── */
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            const spans = toggle.querySelectorAll('span');
            const isOpen = links.classList.contains('open');
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
            spans[1].style.opacity = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
        });
    }

    /* ══════════════════════════════════
       STATE & LOCAL STORAGE
       ══════════════════════════════════ */
    let solvedCache = new Set(JSON.parse(localStorage.getItem('placenix_solved') || '[]'));
    let bookmarkedCache = new Set(JSON.parse(localStorage.getItem('placenix_bookmarks') || '[]'));
    
    // Listen for storage changes from the playground overlay
    window.addEventListener('storage', () => {
        solvedCache = new Set(JSON.parse(localStorage.getItem('placenix_solved') || '[]'));
        bookmarkedCache = new Set(JSON.parse(localStorage.getItem('placenix_bookmarks') || '[]'));
        renderQuestions();
        updateCompanyProgress(activeCompany);
    });

    window.toggleBookmark = function(qId) {
        if (bookmarkedCache.has(qId)) {
            bookmarkedCache.delete(qId);
            showCompanyToast("Removed from practice list");
        } else {
            bookmarkedCache.add(qId);
            showCompanyToast("Added to your practice list ✓");
        }
        localStorage.setItem('placenix_bookmarks', JSON.stringify([...bookmarkedCache]));
        renderQuestions(); // Re-render to update icon
    };

    window.openSolutionModal = function(qId, cId) {
        const question = DATA[cId].questions.find(q => q.id === qId);
        if(!question) return;

        document.getElementById('sol-code-content').textContent = question.solution;
        document.getElementById('sol-code-block').classList.remove('active');
        document.getElementById('solution-modal').classList.add('active');
        
        // Expose reveal function
        window.revealSolution = function() {
            document.getElementById('sol-code-block').classList.add('active');
        };

        window.copySolution = function() {
            navigator.clipboard.writeText(question.solution);
            showCompanyToast("Solution copied to clipboard!");
        };
    };

    function showCompanyToast(msg) {
        let toast = document.createElement('div');
        toast.style.cssText = `position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#CAFF00; color:#0D0B1E; padding:12px 24px; border-radius:50px; font-weight:bold; z-index:9999999; box-shadow:0 10px 30px rgba(202,255,0,0.3); opacity:0; transition:opacity 0.3s;`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        requestAnimationFrame(()=> toast.style.opacity = '1');
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /* ══════════════════════════════════
       RENDER FUNCTIONS
       ══════════════════════════════════ */
    
    function updateCompanyProgress(key) {
        const d = DATA[key];
        let total = d.questions.length;
        let solved = d.questions.filter(q => solvedCache.has(q.id)).length;
        
        let headerDiv = document.querySelector('.profile-header');
        let progWrap = document.getElementById('dyn-prog-wrap');
        
        if (!progWrap) {
            progWrap = document.createElement('div');
            progWrap.id = 'dyn-prog-wrap';
            progWrap.className = 'company-progress-wrap';
            progWrap.innerHTML = `
                <span class="cp-text" id="cp-text"></span>
                <div class="cp-track"><div class="cp-fill" id="cp-fill"></div></div>
            `;
            headerDiv.appendChild(progWrap);
        }
        
        document.getElementById('cp-text').innerText = `Solved ${solved} / ${total} Questions`;
        document.getElementById('cp-fill').style.width = total === 0 ? '0%' : `${(solved/total)*100}%`;
    }

    function renderCompany(key) {
        const d = DATA[key];
        if (!d) return;
        activeCompany = key;

        /* Update header */
        profileName.textContent = d.name;
        profileBadge.textContent = d.type;
        profileBadge.className = 'profile-badge' + (d.type === 'Service Based' ? ' badge-service' : '');
        simCompany.textContent = d.name.toUpperCase();

        updateCompanyProgress(key);

        /* Timeline */
        timeline.innerHTML = d.rounds.map((r, i) => `
          <div class="tl-step" style="animation-delay:${.1 + i * .15}s">
            <span class="tl-dot"></span>
            <span class="tl-icon">📌</span>
            <h5 class="tl-name">Step ${i + 1}: ${r}</h5>
            <p class="tl-desc">Standard preparation phase.</p>
          </div>
        `).join('');

        /* Active chip */
        chips.forEach(c => c.classList.toggle('active', c.dataset.company === key));

        renderQuestions();

        /* Trigger fade-ins */
        requestAnimationFrame(() => {
            document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        });
    }

    function renderQuestions() {
        const d = DATA[activeCompany];
        if (!d) return;

        // Apply Filters
        const sq = qSearch.value.toLowerCase();
        const sDiff = diffFilter.value;
        const sTopic = topicFilter.value;
        const sState = stateFilter.value;

        let filtered = d.questions.filter(q => {
            let matchText = q.title.toLowerCase().includes(sq) || q.description.toLowerCase().includes(sq);
            let matchDiff = sDiff === 'All' || q.difficulty.toLowerCase() === sDiff.toLowerCase();
            
            let matchTopic = false;
            if (sTopic === 'All Topics') {
                matchTopic = true;
            } else if (sTopic === 'DP') {
                matchTopic = q.topic.toLowerCase().includes('dp') || q.topic.toLowerCase().includes('dynamic programming');
            } else if (sTopic === 'Graph') {
                matchTopic = q.topic.toLowerCase().includes('graph');
            } else {
                matchTopic = q.topic.toLowerCase().includes(sTopic.toLowerCase());
            }
            
            let matchState = true;
            if (sState === 'Solved') matchState = solvedCache.has(q.id);
            if (sState === 'Unsolved') matchState = !solvedCache.has(q.id);
            if (sState === 'Bookmarked') matchState = bookmarkedCache.has(q.id);

            return matchText && matchDiff && matchTopic && matchState;
        });

        filterCount.innerText = `Showing ${filtered.length} of ${d.questions.length} questions`;

        if (filtered.length === 0) {
            questGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No questions match your filters</h3>
                    <p>Try adjusting your search or clearing the dropdown filters.</p>
                </div>`;
            return;
        }

        questGrid.innerHTML = filtered.map((q, i) => {
            const isSolved = solvedCache.has(q.id);
            const isSaved = bookmarkedCache.has(q.id);
            return `
            <div class="q-card ${isSolved ? 'solved' : ''}" style="animation-delay:${.1 + i * .05}s">
                <div class="q-solved-badge">✓</div>
                <div class="q-tags">
                <span class="q-diff q-diff--${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                <span class="q-topic">${q.topic}</span>
                </div>
                <h4 class="q-title">${q.title}</h4>
                <p style="font-size:0.8rem; color:rgba(255,255,255,0.4); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${q.description}</p>
                
                <div class="q-actions">
                    <button class="q-btn-icon ${isSaved ? 'active' : ''}" title="Save to Practice List" onclick="toggleBookmark('${q.id}')">
                        ${isSaved ? '🔖' : '📑'}
                    </button>
                    <button class="q-btn-icon" title="View Solution" onclick="openSolutionModal('${q.id}', '${activeCompany}')">
                        👁
                    </button>
                    <button class="q-btn-practice" onclick="openCodingPlayground('${q.id}', '${activeCompany}')">
                        ▶ Practice
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }

    /* ── Company chip click ── */
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            renderCompany(chip.dataset.company);
        });
    });

    /* ── Search filter (Companies) ── */
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        chips.forEach(chip => {
            const name = chip.dataset.company;
            chip.classList.toggle('hidden', q.length > 0 && !name.includes(q));
        });
    });

    /* ── Question Filters Listeners ── */
    [qSearch, diffFilter, topicFilter, stateFilter].forEach(el => {
        el.addEventListener('input', renderQuestions);
        el.addEventListener('change', renderQuestions);
    });

    /* ── Initial render ── */
    renderCompany('amazon');

    /* ══════════════════════════════════
        SIMULATION LOGIC
        ══════════════════════════════════ */
     const simBtn = document.getElementById('simBtn');
     const simModal = document.getElementById('sim-modal');
     const simLoadingView = document.getElementById('sim-loading-view');
     const simResultView = document.getElementById('sim-result-view');
     const simTargetCompany = document.getElementById('sim-target-company');
     const simPercent = document.getElementById('sim-percent');
     const simProgCircle = document.getElementById('sim-prog-circle');
     const simProbBadge = document.getElementById('sim-prob-badge');
     const simFbText = document.getElementById('sim-fb-text');
     const simResultCompany = document.getElementById('sim-result-company');
 
     if (simBtn) {
         simBtn.addEventListener('click', runSimulation);
     }
 
     document.getElementById('closeSimModal')?.addEventListener('click', () => {
         simModal.classList.remove('active');
     });
 
     function runSimulation() {
         const companyData = DATA[activeCompany];
         if (!companyData) return;
 
         simTargetCompany.innerText = companyData.name;
         simResultCompany.innerText = `${companyData.name.toUpperCase()} SHORTLISTING`;
         
         // Initial View
         simModal.classList.add('active');
         simLoadingView.classList.add('active');
         simResultView.classList.remove('active');
 
         // Artificial Delay to "Analyze"
         setTimeout(() => {
             calculateAndShowResults(companyData);
         }, 2500);
     }
 
     function calculateAndShowResults(d) {
         const total = d.questions.length;
         const solved = d.questions.filter(q => solvedCache.has(q.id));
         const solvedCount = solved.length;
 
         // Algorithm: 
         // Base is 15% (luck/resume)
         // Each question adds weight based on difficulty
         let score = 15;
         solved.forEach(q => {
             if (q.difficulty.toLowerCase() === 'easy') score += 5;
             if (q.difficulty.toLowerCase() === 'medium') score += 12;
             if (q.difficulty.toLowerCase() === 'hard') score += 20;
         });
 
         // Cap at 98% (no one is 100% sure)
         let finalPercent = Math.min(score, 98);
         
         // UI Update
         simLoadingView.classList.remove('active');
         simResultView.classList.add('active');
 
         // Animated count
         let current = 0;
         const interval = setInterval(() => {
             if (current >= finalPercent) {
                 clearInterval(interval);
             } else {
                 current++;
                 simPercent.innerText = current;
                 // SVG circle offset (circumference ~ 283)
                 const offset = 283 - (current / 100) * 283;
                 simProgCircle.style.strokeDashoffset = offset;
             }
         }, 20);
 
         // Badge & Feedback
         if (finalPercent < 40) {
             simProbBadge.innerText = "Low Probability";
             simProbBadge.className = "sim-prob-badge low";
             simFbText.innerText = `Your profile needs more company-specific problem solving. Focus on the most frequent ${d.name} questions listed in the grid above.`;
         } else if (finalPercent < 75) {
             simProbBadge.innerText = "Moderate Probability";
             simProbBadge.className = "sim-prob-badge moderate";
             simFbText.innerText = "You have a decent standing, but competition is high. Solving 5+ more medium-level problems will significantly boost your profile rank.";
         } else {
             simProbBadge.innerText = "High Probability";
             simProbBadge.className = "sim-prob-badge high";
             simFbText.innerText = `Impressive! Your problem-solving record for ${d.name} puts you in the top 10% of candidates. Practice a few more Hard problems to maintain this edge.`;
         }
     }
 
    /* ── Intersection observer for fade-in elements ── */
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

});
