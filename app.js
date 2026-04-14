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

    // Відображаємо JSON красиво (з відступами)
    box.textContent = JSON.stringify(data, null, 2);

  } catch (error) {
    box.textContent = 'Помилка: ' + error.message;
    box.style.color = '#e74c3c';
  }
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
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Зберігаємо вибір [cite: 137]
}

// Перевірка збереженої теми при завантаженні
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark'); 
  document.getElementById('api-result').classList.add('dark');
}
// Запускаємо разом з іншими функціями
loadSkills();
// Завантажуємо дані автоматично при відкритті сторінки
loadApiData();
