// app.js — отримує дані про студента з Azure Functions API

async function loadApiData() {
  const box = document.getElementById('api-result');
  box.textContent = 'Завантаження...';

  try {
    // Запит до Azure Functions (папка /api/about)
    const response = await fetch('/api/about');

    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }

    const data = await response.json();

    // Відображаємо дані у вигляді красивої картки
        renderStudentCard(box, data);

  } catch (error) {
    box.textContent = 'Помилка: ' + error.message;
    box.style.color = '#e74c3c';
  }
}

// Відображає дані з API у вигляді структурованої картки
function renderStudentCard(container, data) {
  const fields = [
    { key: 'name',      label: '👤 Name'},
    { key: 'email',     label: '📧 Email'},
    { key: 'specialty', label: '🎓 Specialty'},
    { key: 'labs_done', label: '✅ Labs'},
    { key: 'platform',  label: '☁️ Platform'},
  ];
  const skillsHtml = (data.skills || []).map(s => `<span class="api-tag">${s}</span>`).join('');
  let html = fields.map(f => `
    <div class="info-row">
      <span class="label">${f.label}</span>
      <span class="value">${data[f.key]}</span>
    </div>`).join('');
  html += `<div class="info-row"><span class="label">💪 Skills</span><div class="skills-tags">${skillsHtml}</div></div>`;
  html += `<p class="api-timestamp">🕑 Оновлено: ${data.deployed_at}</p>`;
  container.innerHTML = html;
}
async function loadSkills() {
  const container = document.getElementById('skills-container');

  try {
    const response = await fetch('/api/skills');
    const data     = await response.json();

    container.innerHTML = '';

    data.skills.forEach(skill => {
      const item = document.createElement('div');
      item.className = 'skill-item';
      item.innerHTML = `
        <div class="skill-label">
          <span>${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar" data-level="${skill.level}"></div>
        </div>
      `;
      container.appendChild(item);
    });

    // Анімація — затримка щоб CSS transition спрацював
    setTimeout(() => {
      document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = bar.dataset.level + '%';
      });
    }, 100);

  } catch (error) {
    container.textContent = 'Помилка завантаження навичок';
  }
}
// Логіка перемикача теми
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

// Перевірка збереженої теми
if (currentTheme) {
    document.body.classList.toggle('dark', currentTheme === 'dark');
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Функція обробки натискання
function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Завантажуємо дані автоматично при відкритті сторінки
loadApiData();
loadSkills();

// ════════════════════════════════════════════════════════════
// ЛАБ. №4 — ЗАВДАННЯ A: Dashboard відгуків
// ════════════════════════════════════════════════════════════
 
// ── Лічильник символів у textarea ───────────────────────────
const feedbackText = document.getElementById('feedback-text');
const charCount    = document.getElementById('char-count');
feedbackText.addEventListener('input', () => {
  charCount.textContent = feedbackText.value.length;
});
 
// ── Надіслати відгук → POST /api/feedback ───────────────────
async function submitFeedback() {
  const text   = feedbackText.value.trim();
  const course = document.getElementById('feedback-course').value;
  const author = document.getElementById('feedback-author').value.trim() || 'Анонімно';
 
  // Валідація
  if (!text) {
    feedbackText.style.borderColor = '#e53e3e';
    feedbackText.focus();
    return;
  }
  feedbackText.style.borderColor = '';
 
  // UI — стан завантаження
  const btn   = document.getElementById('feedback-submit-btn');
  const label = document.getElementById('submit-label');
  btn.disabled  = true;
  label.textContent = '⏳ Аналізую...';
 
  try {
    const res  = await fetch('/api/feedback', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ text, course, author }),
    });
 
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
 
    // Показати результат аналізу
    showAnalysisResult(data);
 
    // Очистити форму
    feedbackText.value    = '';
    charCount.textContent = '0';
    document.getElementById('feedback-author').value = '';
 
    // Оновити статистику
    loadStats();
 
  } catch (err) {
    showError('feedback-result', `Помилка: ${err.message}. Перевірте що API задеплоєний.`);
  } finally {
    btn.disabled      = false;
    label.textContent = 'Надіслати відгук';
  }
}
 
// ── Відобразити результат аналізу AI Language ────────────────
function showAnalysisResult(data) {
  const resultEl = document.getElementById('feedback-result');
  resultEl.classList.remove('hidden');
 
  // Тональність — бейдж з кольором
  const sentimentEl  = document.getElementById('result-sentiment');
  const sentimentMap = {
    positive: { label: '😊 Позитивний', cls: 'positive' },
    neutral : { label: '😐 Нейтральний', cls: 'neutral'  },
    negative: { label: '😟 Негативний',  cls: 'negative' },
  };
  const s = sentimentMap[data.sentiment] || { label: data.sentiment, cls: 'neutral' };
  sentimentEl.textContent = s.label;
  sentimentEl.className   = `sentiment-badge ${s.cls}`;
 
  // Confidence bars
  const confEl = document.getElementById('result-confidence');
  const conf   = data.confidence || {};
  confEl.innerHTML = ['positive', 'neutral', 'negative'].map(key => {
    const pct   = Math.round((conf[key] || 0) * 100);
    const label = { positive: 'Позитив', neutral: 'Нейтраль', negative: 'Негатив' }[key];
    return `
      <div class="conf-row">
        <span class="conf-label">${label}</span>
        <div class="conf-bar-wrap">
          <div class="conf-bar ${key}" style="width: ${pct}%"></div>
        </div>
        <span class="conf-pct">${pct}%</span>
      </div>`;
  }).join('');
 
  // Ключові фрази
  const phrasesEl = document.getElementById('result-phrases');
  const phrases   = data.key_phrases || [];
  if (phrases.length) {
    phrasesEl.innerHTML = phrases
      .map(p => `<span class="phrase-tag">${p}</span>`)
      .join('');
  } else {
    phrasesEl.innerHTML = '<span class="no-phrases">Ключових фраз не виявлено</span>';
  }
 
  // Плавна прокрутка до результату
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
 
// ── Завантажити статистику → GET /api/stats ──────────────────
async function loadStats() {
  const statsEl = document.getElementById('stats-content');
  statsEl.innerHTML = '<div class="stats-loading">⏳ Завантаження статистики...</div>';
 
  try {
    const res  = await fetch('/api/stats');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
 
    renderStats(data);
  } catch (err) {
    statsEl.innerHTML = `<div class="stats-loading">❌ Помилка: ${err.message}</div>`;
  }
}
 
// ── Відобразити статистику ───────────────────────────────────
function renderStats(data) {
  const statsEl = document.getElementById('stats-content');
  const total   = data.total || 0;
 
  if (total === 0) {
    statsEl.innerHTML = '<div class="stats-loading">📭 Відгуків ще немає. Будьте першим!</div>';
    return;
  }
 
  const pos = data.positive || 0;
  const neu = data.neutral  || 0;
  const neg = data.negative || 0;
 
  // Відсотки для кругової діаграми (CSS conic-gradient)
  const posP = total ? Math.round(pos / total * 100) : 0;
  const neuP = total ? Math.round(neu / total * 100) : 0;
  const negP = 100 - posP - neuP;
 
  // Топ фрази
  const phrases = (data.top_phrases || []).slice(0, 8);
  const phrasesHtml = phrases.length
    ? phrases.map(p => `<span class="phrase-tag">${p}</span>`).join('')
    : '<span class="no-phrases">Немає даних</span>';
 
  // Останні відгуки
  const recent = (data.recent || []).slice(0, 3);
  const recentHtml = recent.map(r => {
    const sMap = { positive: '😊', neutral: '😐', negative: '😟' };
    const icon = sMap[r.sentiment] || '💬';
    const date = r.created_at ? new Date(r.created_at).toLocaleDateString('uk-UA') : '';
    return `
      <div class="recent-item ${r.sentiment || 'neutral'}">
        <div class="recent-header">
          <span>${icon} ${r.author || 'Анонімно'}</span>
          <span class="recent-meta">${r.course || ''} · ${date}</span>
        </div>
        <p class="recent-text">${escapeHtml(r.text || '')}</p>
      </div>`;
  }).join('');
 
  statsEl.innerHTML = `
    <!-- Загальні лічильники -->
    <div class="stats-counters">
      <div class="counter-card total">
        <span class="counter-num">${total}</span>
        <span class="counter-label">Всього відгуків</span>
      </div>
      <div class="counter-card positive">
        <span class="counter-num">${pos}</span>
        <span class="counter-label">😊 Позитивних</span>
      </div>
      <div class="counter-card neutral">
        <span class="counter-num">${neu}</span>
        <span class="counter-label">😐 Нейтральних</span>
      </div>
      <div class="counter-card negative">
        <span class="counter-num">${neg}</span>
        <span class="counter-label">😟 Негативних</span>
      </div>
    </div>
 
    <!-- Кругова діаграма -->
    <div class="chart-row">
      <div class="donut-wrap">
        <div class="donut" style="
          background: conic-gradient(
            #48bb78 0% ${posP}%,
            #ecc94b ${posP}% ${posP + neuP}%,
            #fc8181 ${posP + neuP}% 100%
          );
        "></div>
        <div class="donut-center">${total}<br><small>відгуків</small></div>
      </div>
      <div class="donut-legend">
        <div class="legend-row"><span class="legend-dot positive"></span>Позитивні — ${posP}%</div>
        <div class="legend-row"><span class="legend-dot neutral"></span>Нейтральні — ${neuP}%</div>
        <div class="legend-row"><span class="legend-dot negative"></span>Негативні — ${negP}%</div>
      </div>
    </div>
 
    <!-- Топ ключових фраз -->
    <div class="stats-block">
      <h4 class="stats-block-title">🔑 Топ ключових тем</h4>
      <div class="phrases-list">${phrasesHtml}</div>
    </div>
 
    <!-- Останні відгуки -->
    ${recentHtml ? `
    <div class="stats-block">
      <h4 class="stats-block-title">🕐 Останні відгуки</h4>
      ${recentHtml}
    </div>` : ''}
  `;
}
 
// ── Допоміжна: екранування HTML ─────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
 
// ── Допоміжна: показати помилку у блоці ─────────────────────
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.remove('hidden');
  el.innerHTML = `<div class="stats-loading">❌ ${message}</div>`;
}
 
// ── Завантажуємо статистику при відкритті сторінки ──────────
loadStats();