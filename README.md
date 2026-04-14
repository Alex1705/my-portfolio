🚀 Мій IT-Портфоліо на Azure Static Web Apps

Цей проєкт виконано в межах лабораторної роботи №2 з дисципліни «Хмарні технології та сервіси» (ВК3).

🌐 Живий сайт

Відкрити портфоліо - https://polite-rock-014971703.7.azurestaticapps.net/

🏗️ Архітектура (Mermaid)

Проєкт реалізує сучасний підхід PaaS та Serverless, де інфраструктурою повністю керує Azure.

graph LR
    A[Розробник] -->|git push| B[GitHub Repository]
    B -->|trigger| C[GitHub Actions]
    C -->|build & deploy| D[Azure Static Web Apps]
    D -->|CDN| E[Браузер користувача]
    D -->|serverless| F[Azure Functions /api/about]
    F -->|JSON| E


🛠️ Виконані завдання

CI/CD Pipeline: Налаштовано автоматичне розгортання через GitHub Actions.

Azure Functions: Створено API endpoint на Python.

Додатково (A): Додано другий API /api/skills та прогрес-бари.

Додатково (B): Реалізовано перемикач темної/світлої теми зі збереженням у localStorage.

Додатково (C): Створено цей професійний файл документації.

© 2026 | ОНУ ім. І.І. Мечникова