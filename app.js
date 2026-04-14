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
    { key: 'name',      label: '👤 Ім’я'},
    { key: 'email',     label: '📧 Email'},
    { key: 'specialty', label: '🎓 Спеціальність'},
    { key: 'labs_done', label: '✅ Лабораторних виконано'},
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
