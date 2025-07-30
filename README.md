# Padel Brackets — MVP (mobile-first PWA)

## Запуск через Docker

```bash
git clone <repo-url>
cd project-root
docker-compose up --build
```

### Установка зависимостей без Docker

```bash
# Frontend
cd frontend && npm install
# Backend
cd ../backend && npm install
```

### Подключение к PostgreSQL

- **Host:** `db` (или `localhost` при прямом подключении)
- **Port:** `5432`
- **User:** `user`
- **Password:** `password`
- **Database:** `tournament_db`

Простое веб-приложение для быстрых мини-турниров по паделу: создайте турнир на N человек, сгенерируйте сетку, отмечайте счёт и получайте победителя. Идеально для корпоративных встреч, дней рождения и игры «компанией».

---

## ✨ MVP-возможности

- Создание турнира за 30 секунд (без регистрации): название + кол-во игроков.
- Код для присоединения (join code) и QR для быстрой отправки участникам.
- Добавление участников по именам/никам (вручную или вставкой списком).
- Автогенерация **сеток Single Elimination** с учётом BYE при неполной сетке.
- Случайная или фиксированная посевка (seeding).
- Ввод результата матча (быстрый «Победил X» или подробный счёт по сетам).
- Автопродвижение победителей по сетке вплоть до финала.
- Экран «Победитель турнира» и стр. результатов (share-friendly).
- Режим ведущего: **host PIN** для изменения данных и подтверждения результатов.
- Публичный просмотр турнира по ссылке/коду.
- Mobile-first UI, работает в браузере без установки.

> Не входит в MVP: пары/дубль, групповая стадия (круговой турнир), ELO-рейтинг, интеграции со Slack/календарями, push-уведомления, оффлайн-режим. Эти пункты заложены в roadmap.

---

## 🧭 Пользовательские сценарии (User Stories)

1. **Создатель турнира** может создать турнир, получить join-code/QR и отправить друзьям.
2. **Участник** может зайти по коду/QR и добавить своё имя (или ведущий добавляет всех).
3. **Ведущий** (знает host PIN) может:
   - сгенерировать сетку (рандом/по посеву),
   - фиксировать и править результаты,
   - досрочно закрыть турнир.
4. **Любой зритель** может открыть публичную страницу и видеть актуальную сетку и результаты.

---

## 🧱 Нефункциональные требования

- **Mobile-first**: TTI < 2.5s на мобильном 4G; интерактивность без лагов.
- **Простота входа**: без аккаунтов; доступ по join-code.
- **Консистентность данных**: атомарная запись результатов матча; защита от гонок.
- **Безопасность**: host PIN хранится как хэш; join-code — криптослучайный токен.
- **Масштабируемость**: до 5–10k параллельных турниров без деградации.
- **Надёжность**: автосохранения, защита от двойной отправки форм.
- **Логи**: аудит изменений результата матча.

---

## 🗺️ Архитектура (MVP)

- **Frontend**: Next.js (App Router) + React, TailwindCSS, PWA-манифест (позже — SW).
- **Backend API**: встроенные API-роуты Next.js (Node 18+), REST.
- **База**: PostgreSQL (прод) / SQLite (локально) через **Prisma ORM**.
- **Кэш/блокировки**: на MVP можно без Redis; при росте — добавить.
- **Деплой**: Vercel (FE+API) + PostgreSQL (Railway/Neon/Render).
- **CI/CD**: GitHub Actions (lint, test, migrate, deploy).
- **Мониторинг**: Vercel Analytics + простые server logs.

---

## 🗂 ER-диаграмма (Mermaid)

```mermaid
erDiagram
  TOURNAMENT ||--o{ PARTICIPANT : has
  TOURNAMENT ||--o{ MATCH : contains
  PARTICIPANT ||--o{ MATCH : "as P1/P2"
  MATCH }o--|| PARTICIPANT : winner

  TOURNAMENT {
    uuid id PK
    text name
    text join_code UNIQUE
    text host_pin_hash
    text format  "SINGLE_ELIMINATION"
    int  max_players
    int  best_of    "1 or 3 (default 1)"
    int  games_to_win "default 6"
    bool advantage   "default true"
    int  tiebreak_to "default 7"
    text status  "DRAFT|READY|IN_PROGRESS|COMPLETED"
    timestamptz created_at
  }

  PARTICIPANT {
    uuid id PK
    uuid tournament_id FK
    text name
    int  seed
    timestamptz created_at
  }

  MATCH {
    uuid id PK
    uuid tournament_id FK
    int  round          "1=Final, 2=Semi, etc."
    int  match_no       "ordinal within round"
    uuid participant1_id
    uuid participant2_id
    uuid winner_id
    jsonb score         "[{p1:6,p2:4},...]"
    text status         "PENDING|IN_PROGRESS|COMPLETED|BYE"
    uuid next_match_id  "nullable"
    int  next_match_slot "1 or 2"
  }
