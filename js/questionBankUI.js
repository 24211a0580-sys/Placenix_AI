// State Object
const state = {
  filters: {
    companies: [],
    category: 'all',
    difficulty: 'all',
    type: 'all',
    search: '',
    sortBy: 'relevant' // relevant, newest, most_asked, easy_hard, hard_easy
  },
  view: 'grid', // 'grid' | 'list'
  page: 1,
  perPage: 20,
  activeTab: 'all', // 'all'|'saved'|'completed'|'needs'
  
  allQuestions: [],
  filteredQuestions: []
};

// LocalStorage arrays
let placenix_bookmarks = JSON.parse(localStorage.getItem('placenix_bookmarks') || '[]');
let placenix_solved = JSON.parse(localStorage.getItem('placenix_solved') || '[]');
// Format: [{id: 'amz_001', score: 100, date: '2024-03-28'}]

// Helper to map DB topics to our categories and types
async function enrichQuestionData() {
  const logic = window.QuestionBankLogic;
  if (!logic) {
    console.error("QuestionBankLogic not found!");
    return;
  }
  
  // Show loading state if needed
  const container = document.getElementById('qbMainContent');
  if (container) container.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Loading questions...</p></div>';

  const allQs = await logic.getAllQuestions();
  
  allQs.forEach(q => {
    // Add alias properties for UI compatibility
    q.pts = q.points; 
    let firstComp = q.companies && q.companies[0] ? q.companies[0] : 'amazon';
    if (firstComp === 'all') firstComp = 'amazon';
    
    const companiesData = window.QUESTION_BANK_DATA ? window.QUESTION_BANK_DATA.companies : {};
    const compSettings = companiesData[firstComp] || { name: firstComp.toUpperCase(), color: '#FFFFFF' };
    q.companyId = firstComp;
    q.companyName = compSettings.name;
    q.color = compSettings.color;
    
    // Map categories for UI 'filterCategory'
    const catMap = {
      'aptitude': 'Aptitude',
      'dsa': 'DSA',
      'technical': 'Technical',
      'behavioral': 'Behavioral',
      'hr': 'Behavioral'
    };
    q.filterCategory = catMap[q.category] || 'Technical';
    q.filterType = (q.type === 'coding') ? 'Coding' : 'Theory';
    
    // Capitalize difficulty
    q.difficultyLabel = (q.difficulty || 'medium').charAt(0).toUpperCase() + (q.difficulty || 'medium').slice(1);
  });
  
  state.allQuestions = allQs;
  state.filteredQuestions = [...allQs];
}

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  await enrichQuestionData();
  setupEventListeners();

  // Read URL Params for deep linking
  const urlParams = new URLSearchParams(window.location.search);
  const targetCompany = urlParams.get('c');
  const targetTopic = urlParams.get('topic');

  if (targetCompany && targetCompany !== 'all') {
      const pill = document.querySelector(`.qb-filter-pill[data-group="company"][data-value="${targetCompany}"]`);
      if (pill) {
          pill.click();
      } else {
          await applyFilters();
      }
  } else if (targetTopic) {
      const topicMap = {
          'aptitude': 'Aptitude',
          'dsa': 'DSA',
          'technical': 'Technical',
          'behavioral': 'Behavioral',
          'core cs': 'Core CS'
      };
      const mappedVal = topicMap[targetTopic.toLowerCase()] || targetTopic;
      const topicPill = document.querySelector(`.qb-filter-pill[data-group="category"][data-value="${mappedVal}"]`);
      if (topicPill) {
          topicPill.click();
      } else {
          await applyFilters();
      }
  } else {
      await applyFilters();
  }
});

function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('qbSearch');
  const clearBtn = document.getElementById('qbSearchClear');
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      state.filters.search = e.target.value.toLowerCase();
      await applyFilters();
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        searchInput.value = '';
        state.filters.search = '';
        await applyFilters();
      });
    }
  }

  // Filter Pills
  document.querySelectorAll('.qb-filter-pill').forEach(pill => {
    pill.addEventListener('click', async (e) => {
      const group = e.target.dataset.group;
      const value = e.target.dataset.value;
      
      if (group === 'company') {
        if (value === 'all') {
          state.filters.companies = [];
          document.querySelectorAll('[data-group="company"]').forEach(p => p.classList.remove('active'));
          e.target.classList.add('active');
        } else {
          document.querySelector('[data-group="company"][data-value="all"]').classList.remove('active');
          if (state.filters.companies.includes(value)) {
            state.filters.companies = state.filters.companies.filter(c => c !== value);
            e.target.classList.remove('active');
            if (state.filters.companies.length === 0) {
              document.querySelector('[data-group="company"][data-value="all"]').classList.add('active');
            }
          } else {
            state.filters.companies.push(value);
            e.target.classList.add('active');
          }
        }
      } else {
        // Single select groups
        state.filters[group] = value;
        document.querySelectorAll(`[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
      }
      await applyFilters();
    });
  });

  // Sort
  const sortSelect = document.getElementById('qbSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', async (e) => {
      state.filters.sortBy = e.target.value;
      await applyFilters();
    });
  }

  // Clear All
  const clearAll = document.getElementById('qbClearAll');
  if (clearAll) {
    clearAll.addEventListener('click', async () => {
      state.filters = { companies: [], category: 'all', difficulty: 'all', type: 'all', search: '', sortBy: 'relevant' };
      if(searchInput) searchInput.value = '';
      
      document.querySelectorAll('.qb-filter-pill').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('[data-value="all"]').forEach(p => p.classList.add('active'));
      await applyFilters();
    });
  }

  // View Toggle
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      viewBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.view = e.target.dataset.view;
      renderQuestions();
    });
  });

  // Tabs
  const tabs = document.querySelectorAll('.qb-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', async (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.activeTab = e.target.dataset.tab;
      await applyFilters();
    });
  });

  // Detail Panel Close
  const closeDetailBtn = document.getElementById('closeDetailBtn');
  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', closeDetail);
  }
}

async function applyFilters() {
  let mappedFilters = {
    companies: state.filters.companies,
    search: state.filters.search
  };

  if (state.filters.companies && state.filters.companies.length > 0) {
    mappedFilters.company = state.filters.companies.join(',');
  }
  
  const sortMap = {
    'most_asked': 'mostAsked',
    'easy_hard': 'easyFirst',
    'hard_easy': 'hardFirst',
    'relevant': 'relevant'
  };
  mappedFilters.sortBy = sortMap[state.filters.sortBy] || state.filters.sortBy;

  if (state.filters.category !== 'all') {
    const catMap = {'Aptitude':'aptitude', 'DSA':'dsa', 'Technical':'technical', 'Behavioral':'behavioral', 'Core CS':'technical'};
    mappedFilters.category = catMap[state.filters.category];
  }
  
  if (state.filters.difficulty !== 'all') {
    mappedFilters.difficulty = state.filters.difficulty.toLowerCase();
  }
  
  if (state.filters.type !== 'all') {
    mappedFilters.type = state.filters.type.toLowerCase();
  }

  // Show loading indicator
  const container = document.getElementById('qbMainContent');
  if (container) container.classList.add('loading-fade');

  // Use the logic engine to do the heavy lifting
  let res = await QuestionBankLogic.filterQuestions(mappedFilters);

  // Sync state with latest progress from server if possible
  const progress = await QuestionBankLogic.getUserProgress();
  // We need to update our local reference for badges
  // This is a bit redundant but ensures UI is reactive
  if (window.AuthService && window.AuthService.isAuthenticated()) {
      const profile = await window.AuthService.getProfile();
      if (profile && profile.progress) {
          placenix_solved = profile.progress.questions_solved.map(id => ({id}));
          placenix_bookmarks = profile.progress.bookmarks;
      }
  }

  // Apply UI specific state tabs (saved, completed, etc)
  if (state.activeTab === 'saved') {
    res = res.filter(q => placenix_bookmarks.includes(q.id));
  } else if (state.activeTab === 'completed') {
    const solvedIds = placenix_solved.map(s => typeof s==='string' ? s : s.id);
    res = res.filter(q => solvedIds.includes(q.id));
  } else if (state.activeTab === 'needs') {
    const needsIds = placenix_solved.filter(s => typeof s==='object' && s.score < 60).map(s => s.id);
    res = res.filter(q => needsIds.includes(q.id));
  }

  state.filteredQuestions = res;
  state.page = 1;
  document.getElementById('qbResultCount').textContent = `Showing ${res.length} questions`;
  renderQuestions();
  await updateProgressWidget();
  
  if (container) container.classList.remove('loading-fade');
}

function getDifficultyIcon(diff) {
  const d = (diff || '').toLowerCase();
  if (d === 'easy') return '🟢';
  if (d === 'medium') return '🟡';
  return '🔴';
}

function renderQuestions() {
  const container = document.getElementById('qbMainContent');
  if (!container) return;
  
  if (state.filteredQuestions.length === 0) {
    container.innerHTML = `
      <div class="qb-empty anim-up">
        <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
        <h3>No questions match your filters</h3>
        <p>Try removing some filters or search differently</p>
      </div>
    `;
    document.getElementById('qbPagination').innerHTML = '';
    return;
  }

  const start = (state.page - 1) * state.perPage;
  const end = start + state.perPage;
  const currentQs = state.filteredQuestions.slice(start, end);

  if (state.view === 'grid') {
    container.innerHTML = `<div class="qb-grid">${currentQs.map(q => createCardHTML(q)).join('')}</div>`;
  } else {
    container.innerHTML = `<div class="qb-list">${currentQs.map(q => createListHTML(q)).join('')}</div>`;
  }

  renderPagination();
}

function createCardHTML(q) {
  const isSolved = placenix_solved.some(s => s.id === q.id);
  const isBookmarked = placenix_bookmarks.includes(q.id);
  const diffIcon = getDifficultyIcon(q.difficulty);
  
  let solBadge = isSolved ? `<div class="badge-solved">✓ Solved</div>` : '';
  let bkmrk = `<button class="btn-bookmark ${isBookmarked?'bookmarked':''}" onclick="toggleBookmark('${q.id}', event)">🔖</button>`;

  return `
    <div class="qb-card anim-up ${isSolved ? 'solved' : ''}">
      <div class="card-top-right">
        ${solBadge}
        ${bkmrk}
      </div>
      <div class="card-companies">
        <span class="company-micro" style="border-bottom: 2px solid ${q.color}">${q.companyId.substring(0,3).toUpperCase()}</span>
      </div>
      <h3 class="card-title">${q.title}</h3>
      <div class="card-tags">
        <span class="card-tag">${diffIcon} ${q.difficultyLabel}</span>
        <span class="card-tag">${q.subcategory || q.filterCategory}</span>
      </div>
      <p class="card-preview">${(q.description || q.question || q.title).substring(0, 80)}...</p>
      
      <div class="card-footer">
        <div class="card-stats">
          <span>💎 ${q.pts} pts</span>
          <span>🔥 ${q.times_asked || q.timesAsked || 0}× asked</span>
        </div>
        <div class="card-actions">
          <button class="btn-detail" onclick="openDetail('${q.id}')">👁 View</button>
          <button class="btn-practice" onclick="practiceNow('${q.id}')">▶ Practice</button>
        </div>
      </div>
    </div>
  `;
}

function createListHTML(q) {
  const diffIcon = getDifficultyIcon(q.difficulty);
  return `
    <div class="qb-list-row anim-up">
      <div>${diffIcon}</div>
      <div class="font-bold">${q.title}</div>
      <div class="text-sm text-gray">${q.companyName}</div>
      <div class="text-sm text-gray">${q.subcategory || q.filterCategory}</div>
      <div class="text-sm text-lime">💎 ${q.pts}</div>
      <button class="btn-practice" style="padding:6px; font-size:12px;" onclick="practiceNow('${q.id}')">▶</button>
    </div>
  `;
}

function renderPagination() {
  const totalPages = Math.ceil(state.filteredQuestions.length / state.perPage);
  const pag = document.getElementById('qbPagination');
  if (!pag) return;

  if (totalPages <= 1) {
    pag.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" onclick="goToPage(${state.page - 1})" ${state.page===1?'disabled':''}>←</button>`;
  
  for(let i=1; i<=totalPages; i++) {
    if(i === 1 || i === totalPages || (i >= state.page-1 && i <= state.page+1)) {
      html += `<button class="page-btn ${i===state.page?'active':''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === state.page-2 || i === state.page+2) {
      html += `<span style="color:var(--qb-text-dim)">•••</span>`;
    }
  }

  html += `<button class="page-btn" onclick="goToPage(${state.page + 1})" ${state.page===totalPages?'disabled':''}>→</button>`;
  pag.innerHTML = html;
}

function goToPage(n) {
  const totalPages = Math.ceil(state.filteredQuestions.length / state.perPage);
  if(n < 1 || n > totalPages) return;
  state.page = n;
  renderQuestions();
  window.scrollTo({top: document.querySelector('.qb-filter-bar').offsetTop - 20, behavior: 'smooth'});
}

async function toggleBookmark(id, event) {
  if (event) event.stopPropagation();
  
  const isBookmarked = placenix_bookmarks.includes(id);
  
  if (window.AuthService && window.AuthService.isAuthenticated()) {
      try {
          await window.AuthService.toggleBookmark(id);
          if (isBookmarked) {
              placenix_bookmarks = placenix_bookmarks.filter(b => b !== id);
              showToast("Removed from saved list");
          } else {
              placenix_bookmarks.push(id);
              showToast("Saved to your list! 🔖");
          }
      } catch (e) {
          showToast("Failed to save bookmark", "warning");
          return;
      }
  } else {
      // Guest local storage
      if (isBookmarked) {
        placenix_bookmarks = placenix_bookmarks.filter(b => b !== id);
        showToast("Removed from saved list");
      } else {
        placenix_bookmarks.push(id);
        showToast("Saved to your list! 🔖");
      }
      localStorage.setItem('placenix_bookmarks', JSON.stringify(placenix_bookmarks));
  }
  
  if (state.activeTab === 'saved') await applyFilters(); 
  else renderQuestions(); 
}

function openDetail(id) {
  const q = state.allQuestions.find(x => x.id === id);
  if(!q) return;

  document.getElementById('dpTitle').textContent = q.title;
  document.getElementById('dpCompany').innerHTML = `<span style="color:${q.color}">${q.companyName}</span> Question`;
  document.getElementById('dpDiff').innerHTML = `${getDifficultyIcon(q.difficulty)} ${q.difficultyLabel}`;
  document.getElementById('dpDesc').textContent = q.description || q.question_text || q.question || q.title;
  
  // Tab switching inside detail
  document.querySelectorAll('.d-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.d-tab[data-target="dDesc"]').classList.add('active');
  document.querySelectorAll('.dp-tab-content').forEach(c => c.style.display = 'none');
  document.getElementById('dDesc').style.display = 'block';

  document.getElementById('dAnswerRaw').innerHTML = q.solution_code || q.solution ? `<pre style="background:var(--qb-bg); padding:1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.1); overflow-x:auto;">${q.solution_code || q.solution}</pre>` : 'No solution available yet.';
  document.getElementById('dAnswerRaw').style.display = 'none';
  document.getElementById('dAnswerLock').style.display = 'block';

  document.getElementById('qbDetailOverlay').classList.add('active');
  document.getElementById('qbDetailPanel').classList.add('active');
}

function closeDetail() {
  document.getElementById('qbDetailOverlay').classList.remove('active');
  document.getElementById('qbDetailPanel').classList.remove('active');
}

function showAnswerWarning() {
  document.getElementById('dAnswerLock').style.display = 'none';
  document.getElementById('dAnswerRaw').style.display = 'block';
  showToast("Score penalty applied for viewing answer.", "warning");
}

function switchDetailTab(target) {
  document.querySelectorAll('.d-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.d-tab[data-target="${target}"]`).classList.add('active');
  document.querySelectorAll('.dp-tab-content').forEach(c => c.style.display = 'none');
  document.getElementById(target).style.display = 'block';
}

async function updateProgressWidget() {
  const progress = await QuestionBankLogic.getUserProgress();
  const overallEl = document.getElementById('overallProgressText');
  if(overallEl) overallEl.textContent = `${progress.solved}/${progress.total} questions completed`;

  const overallFill = document.getElementById('overallProgressFill');
  if (overallFill) {
    overallFill.style.width = `${progress.percentage}%`;
  }

  const categories = [
    { id: 'aptitude', name: 'aptitude', varColor: 'var(--qb-lime)' },
    { id: 'dsa', name: 'dsa', varColor: 'var(--qb-blue)' },
    { id: 'technical', name: 'technical', varColor: 'var(--qb-pink)' },
    { id: 'behavioral', name: 'behavioral', varColor: 'var(--qb-green)' },
    { id: 'core', name: 'core', varColor: 'var(--qb-purple)' },
    { id: 'hr', name: 'hr', varColor: 'var(--qb-amber)' }
  ];

  categories.forEach(cat => {
    const dbCatName = cat.name === 'core' ? 'technical' : cat.name;
    const catData = progress.byCategory[dbCatName] || { solved: 0, total: 0 };
    const pct = catData.total === 0 ? 0 : Math.round((catData.solved / catData.total) * 100);

    const chartEl = document.getElementById(`donut-${cat.id}`);
    const valEl = document.getElementById(`donut-val-${cat.id}`);
    if (chartEl) {
      chartEl.style.background = `conic-gradient(${cat.varColor} ${pct}%, rgba(255,255,255,0.1) 0)`;
    }
    if (valEl) {
      valEl.textContent = `${pct}%`;
    }
  });
}

function showToast(msg, type="info") {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.bottom = '30px';
  t.style.left = '50%';
  t.style.transform = 'translateX(-50%) translateY(20px)';
  t.style.background = type === 'warning' ? 'var(--qb-amber)' : 'var(--qb-lime)';
  t.style.color = 'var(--qb-bg)';
  t.style.padding = '10px 20px';
  t.style.borderRadius = '20px';
  t.style.fontWeight = 'bold';
  t.style.zIndex = '9999';
  t.style.opacity = '0';
  t.style.transition = 'all 0.3s';
  document.body.appendChild(t);
  
  setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; }, 50);
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

function practiceNow(id) {
  // Save active question
  const realId = (id === 'current') ? localStorage.getItem('placenix_current_practice') : id;
  if (!realId) return;
  localStorage.setItem('placenix_current_practice', realId);
  
  closeDetail(); // Close detail panel if open
  
  if (typeof window.openCodingPlayground === 'function') {
    const q = state.allQuestions.find(x => x.id === realId);
    if (q) {
      window.openCodingPlayground(q.id, q.companies && q.companies.length > 0 ? q.companies[0] : q.companyId);
    }
  } else {
    // Fallback if playground.js isn't loaded
    window.location.href = 'company.html';
  }
}

// Ensure globally accessible
window.toggleBookmark = toggleBookmark;
window.openDetail = openDetail;
window.closeDetail = closeDetail;
window.goToPage = goToPage;
window.practiceNow = practiceNow;
window.switchDetailTab = switchDetailTab;
window.showAnswerWarning = showAnswerWarning;
