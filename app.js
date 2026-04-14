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

// Завантажуємо дані автоматично при відкритті сторінки
loadApiData();
