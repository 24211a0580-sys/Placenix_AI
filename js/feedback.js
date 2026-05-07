// js/feedback.js

const FB_STATE = {
  step: 1,
  totalSteps: 6,
  data: {
    overall: null, // 1-5
    nps: null, // 0-10
    features: {}, // key: star out of 5
    love: [],
    improve: [],
    priority: [],
    personal: { name: '', college: '', year: '', branch: '', status: '', company: '', placedHelped: '', publicShare: false, email: '' }
  }
};

// ── MODAL TOGGLE & STEPS ──
function openFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    renderStep();
  }
}

function closeFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function renderStep() {
  // Update Dots
  const dots = document.querySelectorAll('.fb-dot');
  dots.forEach((dot, idx) => {
    dot.className = 'fb-dot'; // reset
    if (idx + 1 === FB_STATE.step) dot.classList.add('active');
    else if (idx + 1 < FB_STATE.step) dot.classList.add('completed');
  });

  // Update label
  const label = document.getElementById('fb-step-label');
  if (label) label.textContent = `Step ${FB_STATE.step} of ${FB_STATE.totalSteps - 1}`;
  if (FB_STATE.step === 6) {
    if(label) label.textContent = "Final Review";
    document.querySelector('.fb-progress-row').style.display = 'none';
  } else {
    document.querySelector('.fb-progress-row').style.display = 'flex';
  }

  // Update Panes
  document.querySelectorAll('.fb-step').forEach(step => step.classList.remove('active'));
  const currentPane = document.getElementById(`fb-step-${FB_STATE.step}`);
  if (currentPane) currentPane.classList.add('active');

  // Update Timeline (Desktop Full Page)
  const tls = document.querySelectorAll('.tl-item');
  tls.forEach((tl, idx) => {
    tl.classList.remove('active', 'completed');
    if (idx + 1 === FB_STATE.step) tl.classList.add('active');
    else if (idx + 1 < FB_STATE.step) tl.classList.add('completed');
  });

  // Hook Step 6 Render if reaching summary
  if (FB_STATE.step === 6) renderSummary();
  validateStep();
}

function nextStep() {
  if (FB_STATE.step < FB_STATE.totalSteps) {
    FB_STATE.step++;
    renderStep();
  }
}

function prevStep() {
  if (FB_STATE.step > 1) {
    FB_STATE.step--;
    renderStep();
  }
}

function goToStep(n) {
  FB_STATE.step = n;
  renderStep();
}

function validateStep() {
  const nextBtn = document.getElementById(`btn-next-${FB_STATE.step}`);
  if (!nextBtn) return;
  
  let valid = true;
  if (FB_STATE.step === 1) {
    valid = (FB_STATE.data.overall !== null);
  }
  nextBtn.disabled = !valid;
}

// ── STEP 1: EMOJI & NPS ──
function selectEmoji(val) {
  FB_STATE.data.overall = val;
  document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`.emoji-btn[data-val="${val}"]`).classList.add('selected');
  validateStep();
}

function selectNps(val) {
  FB_STATE.data.nps = val;
  document.querySelectorAll('.nps-btn').forEach(btn => {
    btn.classList.remove('selected');
    btn.style.background = '';
  });
  
  const btn = document.querySelector(`.nps-btn[data-nps="${val}"]`);
  btn.classList.add('selected');
  
  // Inject proper color dynamically
  if (val <= 6) btn.style.background = `rgba(239, 68, 68, ${0.4 + (val*0.1)})`; // red shades
  else if (val <= 8) btn.style.background = `var(--fb-amber)`;
  else btn.style.background = `var(--fb-lime)`;
}

// ── STEP 2: STARS ──
function setupStars() {
  document.querySelectorAll('.feature-rating-row').forEach(row => {
    const fId = row.dataset.feature;
    const stars = row.querySelectorAll('.f-star');
    
    stars.forEach(star => {
      // Hover preview
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.star);
        stars.forEach(s => {
          if (parseInt(s.dataset.star) <= val) s.style.color = "var(--fb-lime)";
          else s.style.color = "";
        });
      });
      // Click set
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.star);
        FB_STATE.data.features[fId] = val;
        
        stars.forEach(s => {
          s.classList.remove('filled', 'pop');
          if (parseInt(s.dataset.star) <= val) {
            s.classList.add('filled');
            s.style.color = ""; // reset inline
            // trigger reflow pop animation
            void s.offsetWidth; 
            s.classList.add('pop');
          }
        });
        
        // Show comment icon
        row.querySelector('.f-comment-btn').classList.add('visible');
      });
    });
    
    // Reset on mouseleave
    row.querySelector('.f-stars').addEventListener('mouseleave', () => {
      const selectedVal = FB_STATE.data.features[fId] || 0;
      stars.forEach(s => {
        s.style.color = ""; // clear hover colors
        if (parseInt(s.dataset.star) <= selectedVal) s.classList.add('filled');
        else s.classList.remove('filled');
      });
    });
  });
}

function toggleFeatureComment(btn) {
  const area = btn.closest('.feature-rating-row').querySelector('.f-comment-area');
  area.classList.toggle('open');
}

// ── STEP 3 & 4: CHIPS & DRAG ──
function toggleChip(chip, type) {
  const val = chip.dataset.val;
  
  if (type === 'love') {
    if (FB_STATE.data.love.includes(val)) {
      FB_STATE.data.love = FB_STATE.data.love.filter(v => v !== val);
      chip.classList.remove('selected-lime');
      chip.textContent = chip.textContent.replace('✓ ', '');
    } else {
      FB_STATE.data.love.push(val);
      chip.classList.add('selected-lime');
      chip.textContent = '✓ ' + chip.textContent;
    }
  } 
  else if (type === 'improve') {
    if (FB_STATE.data.improve.includes(val)) {
      FB_STATE.data.improve = FB_STATE.data.improve.filter(v => v !== val);
      chip.classList.remove('selected-pink');
      chip.textContent = chip.textContent.replace('✓ ', '');
    } else {
      // Limit to 5 max
      if (FB_STATE.data.improve.length >= 5) {
        showToast("Maximum 5 improvements selectable", "warning");
        return;
      }
      FB_STATE.data.improve.push(val);
      chip.classList.add('selected-pink');
      chip.textContent = '✓ ' + chip.textContent;
    }
    checkPriorityRanking();
  }
}

function checkPriorityRanking() {
  const rankBox = document.getElementById('priority-ranking-box');
  if(!rankBox) return;
  
  if (FB_STATE.data.improve.length >= 3) {
    rankBox.classList.add('active');
    renderDraggableChips();
  } else {
    rankBox.classList.remove('active');
  }
}

function renderDraggableChips() {
  const source = document.getElementById('drag-source');
  if(!source) return;
  source.innerHTML = '';
  
  FB_STATE.data.improve.forEach(imp => {
    const el = document.createElement('div');
    el.className = 'draggable-chip';
    el.draggable = true;
    el.textContent = imp;
    el.id = 'drag-' + imp.replace(/\s+/g, '-');
    el.addEventListener('dragstart', dragStart);
    source.appendChild(el);
  });
}

function dragStart(e) { e.dataTransfer.setData('text/plain', e.target.id); }
function allowDrop(e) { e.preventDefault(); e.target.closest('.pr-slot').classList.add('drag-over'); }
function dragLeave(e) { e.target.closest('.pr-slot').classList.remove('drag-over'); }
function drop(e, priorityLevel) {
  e.preventDefault();
  const slot = e.target.closest('.pr-slot');
  slot.classList.remove('drag-over');
  
  const id = e.dataTransfer.getData('text');
  const chip = document.getElementById(id);
  if (!chip) return;
  
  // Replace existing if any
  const existing = slot.querySelector('.draggable-chip');
  if (existing) {
    document.getElementById('drag-source').appendChild(existing); 
  }
  
  slot.querySelector('.pr-empty-text').style.display = 'none';
  slot.appendChild(chip);
  
  // Track ranking
  FB_STATE.data.priority[priorityLevel - 1] = chip.textContent;
}

// ── STEP 5: CONDITIONAL ──
function selectYear(btn, val) {
  document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  FB_STATE.data.personal.year = val;
}

function selectStatus(btn, val) {
  document.querySelectorAll('.status-card').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  FB_STATE.data.personal.status = val;
  
  const pane = document.getElementById('placed-pane');
  if (val === 'placed') {
    pane.classList.add('active');
  } else {
    pane.classList.remove('active');
  }
}

// ── STEP 6: SUMMARY & SUBMIT ──
function renderSummary() {
  const sum = document.getElementById('summary-content');
  if (!sum) return;
  
  const d = FB_STATE.data;
  
  // Map emoji
  const eMap = {1:'😞 Very Bad', 2:'😐 Not Good', 3:'🙂 Okay', 4:'😊 Good', 5:'🤩 Love It!'};
  
  sum.innerHTML = `
    <div class="sum-row">
      <div class="sum-left">
        <div class="sum-label">Overall Experience</div>
        <div class="sum-val">${eMap[d.overall] || 'Not rated'} <span style="color:var(--fb-text-dim)">· NPS: ${d.nps!==null?d.nps:'-'}</span></div>
      </div>
      <button class="btn-edit" onclick="goToStep(1)">Edit ✎</button>
    </div>
    
    <div class="sum-row">
      <div class="sum-left">
        <div class="sum-label">Things you Love</div>
        <div class="sum-val">${d.love.length ? d.love.join(', ') : 'Nothing selected'}</div>
      </div>
      <button class="btn-edit" onclick="goToStep(3)">Edit ✎</button>
    </div>
    
    <div class="sum-row">
      <div class="sum-left">
        <div class="sum-label">To Improve</div>
        <div class="sum-val">${d.improve.length ? d.improve.join(', ') : 'Nothing selected'}</div>
        ${d.priority[0] ? `<div class="text-sm text-pink mt-1">Priority: ${d.priority[0]}</div>` : ''}
      </div>
      <button class="btn-edit" onclick="goToStep(4)">Edit ✎</button>
    </div>
  `;
}

function submitFeedback() {
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Submitting...`;
  
  // Simulate API delay
  setTimeout(() => {
    // Hide all steps, show success state
    document.querySelectorAll('.fb-step').forEach(s => s.classList.remove('active'));
    document.querySelector('.fb-header').style.display = 'none';
    document.querySelector('.fb-progress-row').style.display = 'none';
    
    const succ = document.getElementById('success-state');
    succ.classList.add('active');
    
    // Confetti
    fireConfetti();
    
    // XP Toast
    setTimeout(() => {
      showToast("+50 XP — Thanks for giving feedback! ⚡");
    }, 1000);
    
    // Customize message based on rating
    const msg = document.getElementById('succ-dynamic-msg');
    const acts = document.getElementById('succ-actions');
    if (FB_STATE.data.overall >= 4) {
      msg.innerHTML = "We're absolutely thrilled! <br>Share PlaceNix.ai with your friends →";
      acts.innerHTML = `
        <button class="social-btn btn-wa">WhatsApp 💚</button>
        <button class="social-btn btn-li">LinkedIn 💼</button>
      `;
    } else if (FB_STATE.data.overall <= 2) {
      msg.innerHTML = "We're truly sorry about your experience.<br>Please tell us directly what went wrong.";
      acts.innerHTML = `<button class="social-btn btn-contact" style="margin:0 auto">Contact Us →</button>`;
    } else {
      msg.innerHTML = "Thanks for the honest feedback!<br>We're actively working on your suggestions.";
    }
    
  }, 1500);
}

function fireConfetti() {
  const succ = document.getElementById('success-state');
  const colors = ['#CAFF00', '#FF4ECD', '#00C2FF', '#FFFFFF'];
  
  for(let i=0; i<30; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random trajectories
    const tx = (Math.random() - 0.5) * 300 + 'px';
    const ty = (Math.random() - 0.5) * 300 + 'px';
    const rot = Math.random() * 360 + 'deg';
    
    c.style.setProperty('--tx', tx);
    c.style.setProperty('--ty', ty);
    c.style.setProperty('--rot', rot);
    
    c.style.left = '50%';
    c.style.top = '100px';
    c.style.animation = `confettiFly 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
    
    succ.appendChild(c);
    
    // Cleanup
    setTimeout(()=> c.remove(), 1200);
  }
}

// ── KANBAN & POST-PRACTICE ──
function voteFeature(btn) {
  if (btn.classList.contains('voted')) return;
  btn.classList.add('voted');
  btn.innerHTML = 'Voted ✓';
  // simple +1 float animation logic could go here
  showToast("Vote recorded!");
}

function closeBanner() {
  const banner = document.getElementById('post-practice-banner');
  if(banner) banner.classList.remove('slide-down');
}

function rateQuick(val) {
  closeBanner();
  showToast("Thanks! ✓");
  if (val <= 3) {
    setTimeout(openFeedbackModal, 1000);
  }
}

function showToast(msg, type="info") {
  const existing = document.querySelector('.xp-toast');
  if (existing) existing.remove();
  
  const t = document.createElement('div');
  t.className = 'xp-toast';
  t.textContent = msg;
  if(type === 'warning') { t.style.background = 'var(--fb-amber)'; t.style.color = '#fff'; }
  document.body.appendChild(t);
  
  // force reflow
  void t.offsetWidth;
  t.classList.add('show');
  
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(()=> t.remove(), 400);
  }, 3000);
}

const FEEDBACK_MODAL_HTML = `
<!-- FLOATING FEEDBACK BUTTON -->
<div id="feedback-float" style="position:fixed; bottom:32px; left:32px; z-index:9998">
  <button onclick="openFeedbackModal()" class="feedback-float-btn">💬 Give Feedback</button>
</div>

<!-- FEEDBACK MODAL OVERLAY -->
<div id="feedback-modal" class="feedback-modal-overlay">
  <div class="feedback-modal-card">
    <div class="fb-close-btn" onclick="closeFeedbackModal()">×</div>
    <div class="fb-header">
        <span class="fb-brand">PlaceNix.ai</span>
        <h2 class="fb-title">SHARE YOUR FEEDBACK</h2>
        <p class="fb-subtitle">Your feedback shapes how we improve. Every response is reviewed by our team.</p>
    </div>
    
    <div class="fb-progress-row">
        <div class="fb-dot active"></div><div class="fb-dot"></div><div class="fb-dot"></div><div class="fb-dot"></div><div class="fb-dot"></div>
    </div>
    <div class="fb-step-label" id="fb-step-label">Step 1 of 5</div>

    <div class="fb-step-container">
        <!-- STEP 1 -->
        <div class="fb-step active" id="fb-step-1">
            <div class="step-heading">How would you rate PlaceNix.ai overall?</div>
            <div class="emoji-row">
                <div class="emoji-btn" data-val="1" onclick="selectEmoji(1)"><div class="emoji-icon">😞</div><div class="emoji-label">Very Bad</div></div>
                <div class="emoji-btn" data-val="2" onclick="selectEmoji(2)"><div class="emoji-icon">😐</div><div class="emoji-label">Not Good</div></div>
                <div class="emoji-btn" data-val="3" onclick="selectEmoji(3)"><div class="emoji-icon">🙂</div><div class="emoji-label">Okay</div></div>
                <div class="emoji-btn" data-val="4" onclick="selectEmoji(4)"><div class="emoji-icon">😊</div><div class="emoji-label">Good</div></div>
                <div class="emoji-btn" data-val="5" onclick="selectEmoji(5)"><div class="emoji-icon">🤩</div><div class="emoji-label">Love It!</div></div>
            </div>
            <div class="fb-divider"></div>
            <div class="nps-q">How likely are you to recommend PlaceNix.ai?</div>
            <div class="nps-row">
                <button class="nps-btn" data-nps="0" onclick="selectNps(0)">0</button>
                <button class="nps-btn" data-nps="1" onclick="selectNps(1)">1</button>
                <button class="nps-btn" data-nps="2" onclick="selectNps(2)">2</button>
                <button class="nps-btn" data-nps="3" onclick="selectNps(3)">3</button>
                <button class="nps-btn" data-nps="4" onclick="selectNps(4)">4</button>
                <button class="nps-btn" data-nps="5" onclick="selectNps(5)">5</button>
                <button class="nps-btn" data-nps="6" onclick="selectNps(6)">6</button>
                <button class="nps-btn" data-nps="7" onclick="selectNps(7)">7</button>
                <button class="nps-btn" data-nps="8" onclick="selectNps(8)">8</button>
                <button class="nps-btn" data-nps="9" onclick="selectNps(9)">9</button>
                <button class="nps-btn" data-nps="10" onclick="selectNps(10)">10</button>
            </div>
            <div class="nps-labels"><span>Not likely</span><span>Definitely!</span></div>
            <div class="fb-actions"><button class="btn-next" id="btn-next-1" onclick="nextStep()" disabled>NEXT STEP →</button></div>
        </div>

        <!-- STEP 2 -->
        <div class="fb-step" id="fb-step-2">
            <div class="step-heading">Rate each feature of PlaceNix.ai</div>
            <div class="step-sub">Click stars to rate each feature</div>
            <!-- Dynamic Feature Rows inserted via loop or explicit -->
            <div class="feature-rating-row" data-feature="resume">
                <div class="f-name">📄 Resume Analysis</div>
                <div style="display:flex; align-items:center;">
                    <div class="f-stars"><div class="f-star" data-star="1">★</div><div class="f-star" data-star="2">★</div><div class="f-star" data-star="3">★</div><div class="f-star" data-star="4">★</div><div class="f-star" data-star="5">★</div></div>
                    <button class="f-comment-btn" onclick="toggleFeatureComment(this)">💬</button>
                </div>
                <textarea class="fb-textarea f-comment-area" placeholder="What do you think about Resume Analysis?"></textarea>
            </div>
            <div class="feature-rating-row" data-feature="company">
                <div class="f-name">🏢 Company Prep</div>
                <div style="display:flex; align-items:center;">
                    <div class="f-stars"><div class="f-star" data-star="1">★</div><div class="f-star" data-star="2">★</div><div class="f-star" data-star="3">★</div><div class="f-star" data-star="4">★</div><div class="f-star" data-star="5">★</div></div>
                    <button class="f-comment-btn" onclick="toggleFeatureComment(this)">💬</button>
                </div>
                <textarea class="fb-textarea f-comment-area" placeholder="What do you think about Company Prep?"></textarea>
            </div>
            <div class="feature-rating-row" data-feature="mock">
                <div class="f-name">🤖 Mock Interview Simulator</div>
                <div style="display:flex; align-items:center;">
                    <div class="f-stars"><div class="f-star" data-star="1">★</div><div class="f-star" data-star="2">★</div><div class="f-star" data-star="3">★</div><div class="f-star" data-star="4">★</div><div class="f-star" data-star="5">★</div></div>
                    <button class="f-comment-btn" onclick="toggleFeatureComment(this)">💬</button>
                </div>
                <textarea class="fb-textarea f-comment-area" placeholder="What do you think about the Mock Interview Simulator?"></textarea>
            </div>
            <div class="feature-rating-row" data-feature="qbank">
                <div class="f-name">📚 Question Bank</div>
                <div style="display:flex; align-items:center;">
                    <div class="f-stars"><div class="f-star" data-star="1">★</div><div class="f-star" data-star="2">★</div><div class="f-star" data-star="3">★</div><div class="f-star" data-star="4">★</div><div class="f-star" data-star="5">★</div></div>
                    <button class="f-comment-btn" onclick="toggleFeatureComment(this)">💬</button>
                </div>
                <textarea class="fb-textarea f-comment-area" placeholder="What do you think about the Question Bank?"></textarea>
            </div>
            
            <div class="fb-actions">
                <button class="btn-back" onclick="prevStep()">← BACK</button>
                <button class="btn-next" onclick="nextStep()">NEXT →</button>
            </div>
        </div>

        <!-- STEP 3 -->
        <div class="fb-step" id="fb-step-3">
            <div class="step-heading">What do you love most?</div>
            <div class="chip-container">
                <div class="fb-chip" data-val="Company questions" onclick="toggleChip(this, 'love')">Company questions</div>
                <div class="fb-chip" data-val="Resume feedback" onclick="toggleChip(this, 'love')">Resume feedback</div>
                <div class="fb-chip" data-val="Mock interview" onclick="toggleChip(this, 'love')">Mock interview</div>
                <div class="fb-chip" data-val="UI design" onclick="toggleChip(this, 'love')">UI design</div>
                <div class="fb-chip" data-val="Progress checking" onclick="toggleChip(this, 'love')">Progress tracking</div>
                <div class="fb-chip" data-val="AI explanations" onclick="toggleChip(this, 'love')">AI explanations</div>
                <div class="fb-chip" data-val="Multiple languages" onclick="toggleChip(this, 'love')">Multi language</div>
                <div class="fb-chip" data-val="Free to use" onclick="toggleChip(this, 'love')">Free to use</div>
            </div>
            <div class="fb-input-group">
                <textarea class="fb-textarea" placeholder="Anything else you love? (optional)"></textarea>
            </div>
            <div class="fb-actions">
                <button class="btn-back" onclick="prevStep()">← BACK</button>
                <button class="btn-next" onclick="nextStep()">NEXT →</button>
            </div>
        </div>

        <!-- STEP 4 -->
        <div class="fb-step" id="fb-step-4">
            <div class="step-heading">What should we improve or add?</div>
            <div class="chip-container">
                <div class="fb-chip" data-val="Video explanations" onclick="toggleChip(this, 'improve')">Video explanations</div>
                <div class="fb-chip" data-val="Group practice" onclick="toggleChip(this, 'improve')">Group practice</div>
                <div class="fb-chip" data-val="Study roadmaps" onclick="toggleChip(this, 'improve')">Study roadmaps</div>
                <div class="fb-chip" data-val="Better coding IDE" onclick="toggleChip(this, 'improve')">Better coding IDE</div>
                <div class="fb-chip" data-val="Faster speed" onclick="toggleChip(this, 'improve')">Faster speed</div>
                <div class="fb-chip" data-val="More companies" onclick="toggleChip(this, 'improve')">More companies</div>
                <div class="fb-chip" data-val="Mobile App" onclick="toggleChip(this, 'improve')">Mobile App</div>
                <div class="fb-chip" data-val="Live contests" onclick="toggleChip(this, 'improve')">Live contests</div>
            </div>
            <div class="priority-ranking" id="priority-ranking-box">
                <div class="step-sub text-white font-bold" style="text-align:left; margin-bottom:10px;">Drag to rank your top priorities:</div>
                <div id="drag-source" style="margin-bottom:16px; min-height: 40px; display:flex; gap:8px; flex-wrap:wrap"></div>
                <div class="pr-slot" ondragover="allowDrop(event)" ondrop="drop(event, 1)" ondragleave="dragLeave(event)"><span class="pr-medal">🥇</span> <span class="pr-empty-text">1st Priority [Drag here]</span></div>
                <div class="pr-slot" ondragover="allowDrop(event)" ondrop="drop(event, 2)" ondragleave="dragLeave(event)"><span class="pr-medal">🥈</span> <span class="pr-empty-text">2nd Priority [Drag here]</span></div>
                <div class="pr-slot" ondragover="allowDrop(event)" ondrop="drop(event, 3)" ondragleave="dragLeave(event)"><span class="pr-medal">🥉</span> <span class="pr-empty-text">3rd Priority [Drag here]</span></div>
            </div>
            
            <div class="fb-actions">
                <button class="btn-back" onclick="prevStep()">← BACK</button>
                <button class="btn-next" onclick="nextStep()">NEXT →</button>
            </div>
        </div>

        <!-- STEP 5 -->
        <div class="fb-step" id="fb-step-5">
            <div class="step-heading">Tell us about yourself</div>
            <div class="step-sub">All fields are optional</div>
            
            <div class="fb-input-group fb-input-icon"><i>👤</i><input type="text" class="fb-input" placeholder="Full Name"></div>
            <div class="fb-input-group fb-input-icon"><i>🎓</i><input type="text" class="fb-input" placeholder="College / University"></div>
            
            <div class="fb-input-group">
                <label class="fb-label">Year of Study</label>
                <div class="year-pill-row">
                    <div class="year-pill" onclick="selectYear(this, '1st')">1st Year</div>
                    <div class="year-pill" onclick="selectYear(this, '2nd')">2nd Year</div>
                    <div class="year-pill" onclick="selectYear(this, '3rd')">3rd Year</div>
                    <div class="year-pill" onclick="selectYear(this, '4th')">Final Year</div>
                    <div class="year-pill" onclick="selectYear(this, 'pg')">Post Grad</div>
                </div>
            </div>

            <div class="fb-input-group">
                <label class="fb-label">Placement Status</label>
                <div class="status-grid">
                    <div class="status-card" onclick="selectStatus(this, 'active')"><div class="status-icon">🎯</div><div class="status-text">Actively Preparing</div></div>
                    <div class="status-card" onclick="selectStatus(this, 'placed')"><div class="status-icon">🎉</div><div class="status-text">Already Placed!</div></div>
                    <div class="status-card" onclick="selectStatus(this, 'not_started')"><div class="status-icon">📚</div><div class="status-text">Not Yet Started</div></div>
                    <div class="status-card" onclick="selectStatus(this, 'working')"><div class="status-icon">💼</div><div class="status-text">Working Professional</div></div>
                </div>
            </div>
            
            <div class="conditional-pane" id="placed-pane">
                <label class="fb-label">Congratulations! 🎉 Which company?</label>
                <input type="text" class="fb-input" style="margin-bottom:12px;">
                <label class="fb-checkbox"><input type="checkbox"> I'm okay with sharing my success story publicly</label>
            </div>
            
            <div class="fb-actions">
                <button class="btn-back" onclick="prevStep()">← BACK</button>
                <button class="btn-next" onclick="nextStep()">NEXT →</button>
            </div>
        </div>

        <!-- STEP 6 -->
        <div class="fb-step" id="fb-step-6">
            <div class="step-heading">Final Review</div>
            <div class="summary-card" id="summary-content"></div>
            <div class="fb-input-group">
                <label class="fb-checkbox"><input type="checkbox" checked> Notify me when my feedback is implemented</label>
            </div>
            <div class="fb-actions">
                <button class="btn-back" onclick="prevStep()">← BACK</button>
                <button class="btn-submit" id="submit-btn" onclick="submitFeedback()">SUBMIT FEEDBACK →</button>
            </div>
        </div>

        <!-- SUCCESS STATE -->
        <div class="success-state" id="success-state">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" stroke="#10B981" stroke-width="3" fill="none" stroke-dasharray="226" stroke-dashoffset="226" style="animation: drawCircle 0.6s ease forwards"/>
                    <path d="M22 40 L34 52 L58 28" stroke="#10B981" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="60" style="animation: drawTick 0.4s ease 0.5s forwards"/>
                </svg>
            </div>
            <div class="success-msg">Thank you! 🙏</div>
            <div class="success-sub" id="succ-dynamic-msg"></div>
            <div class="social-btns" id="succ-actions"></div>
            <div class="fb-actions" style="margin-top:20px;">
                <button class="btn-back" onclick="closeFeedbackModal()">Close</button>
                <a href="dashboard.html" class="btn-submit" style="text-decoration:none; display:flex">Go to Dashboard</a>
            </div>
        </div>
    </div>
  </div>
</div>
`;

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Only inject if not already on the dedicated feedback page
    if (!document.getElementById('feedback-modal') && !window.location.pathname.includes('feedback.html')) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = FEEDBACK_MODAL_HTML;
        document.body.appendChild(wrapper);
    }

    setupStars();
    
    // Show banner dynamically on certain pages just for demo
    if(window.location.pathname.includes('interview.html') || window.location.pathname.includes('company.html')) {
        const bannerContainer = document.createElement('div');
        bannerContainer.innerHTML = `
            <div id="post-practice-banner">
                <div>
                    <div class="banner-title">How was your practice session?</div>
                    <div class="banner-emojis" style="margin-top:8px;">
                        <div class="banner-emoji" onclick="rateQuick(1)">😞</div>
                        <div class="banner-emoji" onclick="rateQuick(2)">😐</div>
                        <div class="banner-emoji" onclick="rateQuick(3)">🙂</div>
                        <div class="banner-emoji" onclick="rateQuick(4)">😊</div>
                        <div class="banner-emoji" onclick="rateQuick(5)">🤩</div>
                    </div>
                </div>
                <button class="banner-skip" onclick="closeBanner()">Skip</button>
            </div>
        `;
        document.body.appendChild(bannerContainer);
        
        setTimeout(() => { 
            const b = document.getElementById('post-practice-banner');
            if(b) b.classList.add('slide-down'); 
        }, 15000); // show 15s after load for demo
    }
});
