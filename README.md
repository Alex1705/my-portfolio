# Мій IT-Портфоліо на Azure Static Web Apps

[cite_start]Цей проєкт створено в межах лабораторної роботи №2 з дисципліни «Хмарні технології та сервіси» (ВК3). 

## 🌐 Посилання на сайт
[ВСТАВТЕ ВАШЕ ПОСИЛАННЯ ВІД AZURE ТУТ]

## 🏗️ Архітектура проєкту (Mermaid)
[cite_start]Проєкт використовує модель PaaS (Platform as a Service) для автоматизації розгортання. 
```mermaid
graph LR
    A[Розробник] -->|git push| B[GitHub Repository]
    B -->|trigger| C[GitHub Actions]
    C -->|build & deploy| D[Azure Static Web Apps]
    D -->|CDN| E[Браузер користувача]
    D -->|serverless| F[Azure Functions /api/about]
    F -->|JSON| E

http://googleusercontent.com/immersive_entry_chip/0
