// State management for Quiz
let quizState = { q1: null, q2: null, q3: null };

// Navigation routing engine
function navigateTo(pageId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.add('hidden'));

    // Show target section
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav button styles
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('bg-slate-800', 'text-white', 'border', 'border-slate-700');
            btn.classList.remove('text-slate-300');
        } else {
            btn.classList.remove('bg-slate-800', 'text-white', 'border', 'border-slate-700');
            btn.classList.add('text-slate-300');
        }
    });

    // Update URL hash without reload
    window.location.hash = pageId;
}

// Handle hash on initial load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
        navigateTo(hash);
    } else {
        navigateTo('index.html');
    }
    loadChecklistState();
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    menu.classList.toggle('hidden');
    if (menu.classList.contains('hidden')) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    }
}

// Scroll to quiz from hero
function scrollToQuiz() {
    const quiz = document.getElementById('quiz-section');
    if (quiz) {
        quiz.scrollIntoView({ behavior: 'smooth' });
    }
}

// Quiz Logic
function handleQuizAnswer(question, answer) {
    quizState[question] = answer;
    const q1El = document.getElementById('quiz-q1');
    const q2El = document.getElementById('quiz-q2');
    const q3El = document.getElementById('quiz-q3');
    const resultEl = document.getElementById('quiz-result');
    const progressBar = document.getElementById('quiz-progress');

    if (question === 'q1') {
        q1El.classList.add('hidden');
        q2El.classList.remove('hidden');
        progressBar.style.width = '66%';
    } else if (question === 'q2') {
        q2El.classList.add('hidden');
        q3El.classList.remove('hidden');
        progressBar.style.width = '100%';
    } else if (question === 'q3') {
        q3El.classList.add('hidden');
        resultEl.classList.remove('hidden');
        progressBar.style.width = '100%';
        computeQuizResult();
    }
}

function computeQuizResult() {
    const titleEl = document.getElementById('result-title');
    const descEl = document.getElementById('result-description');
    const iconEl = document.getElementById('result-icon');

    if (quizState.q1 === 'pod' || quizState.q1 === 'joint') {
        titleEl.textContent = "Probate Bypass Likely (Direct Transfer)";
        descEl.textContent = "Because the account features a Payable-on-Death beneficiary or a surviving joint owner, funds can generally be claimed directly without formal probate court administration.";
        iconEl.className = "fa-solid fa-circle-check";
    } else if (quizState.q2 === 'trust') {
        titleEl.textContent = "Revocable Living Trust Administration";
        descEl.textContent = "Since the bank account is titled in the name of a living trust, the successor trustee can assume control immediately upon presenting the trust certificate and death certificate.";
        iconEl.className = "fa-solid fa-vault";
    } else if (quizState.q3 === 'small') {
        titleEl.textContent = "Small Estate Affidavit Eligible";
        descEl.textContent = "Although sole-owned without beneficiaries, the total value appears low enough to qualify for your state's Small Estate Affidavit process, avoiding full formal probate court.";
        iconEl.className = "fa-solid fa-file-signature";
    } else {
        titleEl.textContent = "Formal Probate Administration Required";
        descEl.textContent = "Sole ownership, substantial liquid funds, and lack of beneficiaries mean you will likely need to petition the probate court to appoint an executor and issue Letters Testamentary.";
        iconEl.className = "fa-solid fa-scale-balanced";
    }
}

function resetQuiz() {
    quizState = { q1: null, q2: null, q3: null };
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-q1').classList.remove('hidden');
    document.getElementById('quiz-progress').style.width = '33%';
}

// Checklist persistent storage logic
function toggleChecklistItem(index) {
    const checkbox = document.getElementById('check-' + index);
    checkbox.checked = !checkbox.checked;
    updateChecklist();
}

function updateChecklist() {
    let completed = 0;
    const total = 6;
    let state = [];

    for (let i = 0; i < total; i++) {
        const cb = document.getElementById('check-' + i);
        if (cb && cb.checked) {
            completed++;
            state.push(true);
        } else {
            state.push(false);
        }
    }

    // Save to localStorage
    localStorage.setItem('heirAccess_checklist', JSON.stringify(state));

    // Update UI
    const pct = Math.round((completed / total) * 100);
    const textEl = document.getElementById('checklist-progress-text');
    const barEl = document.getElementById('checklist-progress-bar');
    if (textEl) textEl.textContent = `${completed} of ${total} Completed (${pct}%)`;
    if (barEl) barEl.style.width = `${pct}%`;
}

function loadChecklistState() {
    const saved = localStorage.getItem('heirAccess_checklist');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            for (let i = 0; i < state.length; i++) {
                const cb = document.getElementById('check-' + i);
                if (cb) {
                    cb.checked = state[i];
                }
            }
            updateChecklist();
        } catch (e) {
            console.error('Error loading checklist state', e);
        }
    }
}

function resetChecklist() {
    localStorage.removeItem('heirAccess_checklist');
    for (let i = 0; i < 6; i++) {
        const cb = document.getElementById('check-' + i);
        if (cb) cb.checked = false;
    }
    updateChecklist();
}

// FAQ Accordion Toggle
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// Glossary Search Filter
function filterGlossary() {
    const searchInput = document.getElementById('glossarySearch');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.glossary-item');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Deploy Modal Controls
function openDeployModal() {
    document.getElementById('deployModal').classList.remove('hidden');
}
function closeDeployModal() {
    document.getElementById('deployModal').classList.add('hidden');
}