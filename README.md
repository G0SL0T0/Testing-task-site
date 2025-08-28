

# Site Scraper

Тестовое задание - Веб-скрапер с модификацией контента, который позволяет скачивать веб-страницы, вставлять ключевые слова и сохранять результаты локально.

![Демонстрация](https://imgur.com/SRA9qTb)

## Технологии

- **Бэкенд**: Node.js, TypeScript, Express, Cheerio, Axios
- **Фронтенд**: React, TypeScript, Vite
- **Сервер**: Nginx
- **Контейнеризация**: Docker, Alpine Linux

## 📋 Требования

- Docker (версия 20.10 или выше)
- Docker Compose (опционально)

## 🚀 Быстрый запуск

### С помощью Docker:

1. **Запуск одним кликом** (через Docker Desktop):
   - Откройте [Docker Hub](https://hub.docker.com/r/g0sl0t0/site-scraper)
   - Нажмите кнопку "Pull" или выполните команду:
   ```bash
   docker run -d -p 8008:8008 g0sl0t0/site-scraper:latest
   ```

2. **Откройте приложение**:
   - Перейдите по адресу: http://localhost:8008
   - Введите URL сайта и ключевое слово
   - Нажмите "Start Scraping"
   - Результат будет доступен по ссылке "View Scraped Site"

### С помощью Docker Compose:

1. Создайте файл `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     site-scraper:
       image: g0sl0t0/site-scraper:latest
       ports:
         - "8008:8008"
       volumes:
         - scraped-data:/usr/share/nginx/html/site
   volumes:
     scraped-data:
   ```

2. Запустите:
   ```bash
   docker-compose up -d
   ```

## 📖 Использование

### Через веб-интерфейс

1. Откройте http://localhost:8008
2. В форме введите:
   - **Website URL**: URL сайта для скрапинга (например, `https://example.com`)
   - **Keyword**: Ключевое слово для вставки (например, `TEST_KEYWORD`)
3. Нажмите кнопку "Start Scraping"
4. После завершения процесса:
   - Увидите сообщение об успешном выполнении
   - Нажмите на ссылку "View Scraped Site" для просмотра результата

### Через командную строку

```bash
# Запуск скрапера напрямую
docker exec -it site-scraper-container node /scrapper/dist/scraper.js --url https://example.com --keyword "TEST"

# Просмотр результатов
docker exec site-scraper-container ls -la /usr/share/nginx/html/site
```

## 📁 Структура проекта

```
├── src/                    # Исходный код скрапера
│   ├── scraper.ts         # Основной модуль скрапера
│   ├── server.ts          # API сервер
│   └── utils.ts           # Вспомогательные функции
├── frontend/              # Фронтенд приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   └── public/            # Статические файлы
├── nginx.conf            # Конфигурация Nginx
├── supervisord.conf      # Конфигурация Supervisor
├── Dockerfile            # Сборка Docker-образа
└── README.md             # Документация
```

## 🔧 Разработка

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/G0SL0T0/Testing-task-site.git
cd Testing-task-site
```

2. Установите зависимости:
```bash
npm install
cd frontend
npm install
cd ..
```

3. Запустите в режиме разработки:
```bash
# Запуск API сервера
npm run dev:server

# Запуск фронтенда (в другом терминале)
cd frontend
npm run dev
```

### Сборка проекта

```bash
# Сборка бэкенда
npm run build

# Сборка фронтенда
cd frontend
npm run build
cd ..

# Сборка Docker-образа
docker build -t site-scraper .
```

## 🐳 Публикация образа

### Сборка и публикация в Docker Hub

```bash
# Сборка образа
docker build -t g0sl0t0/site-scraper:latest .

# Вход в Docker Hub
docker login

# Публикация образа
docker push g0sl0t0/site-scraper:latest
```

### Создание тега

```bash
# Создание тега
git tag v1.0.0

# Публикация тега
git push origin v1.0.0
```

## 📞 Контакты

- GitHub: [G0SL0T0](https://github.com/G0SL0T0)
- Email: gosioto@yandex.ru

---

## 📦 Готовые образы

| Тег | Описание | Размер |
|-----|----------|-------|
| [`latest`](https://hub.docker.com/r/g0sl0t0/site-scraper) | Последняя стабильная версия | ![](https://img.shields.io/docker/image-size/g0sl0t0/site-scraper/latest) |
| [`v1.0.0`](https://hub.docker.com/r/g0sl0t0/site-scraper:v1.0.0) | Версия 1.0.0 | ![](https://img.shields.io/docker/image-size/g0sl0t0/site-scraper/v1.0.0) |

---
