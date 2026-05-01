# 🚀 AppHub

## 🌐 Live

🔗 [View Live App](https://app-hub-wheat.vercel.app)

## 🧠 About

Job searching across multiple platforms quickly becomes chaotic.
AppHub is a job search management tool that centralizes vacancies, applications, and tracking into a single structured workflow.
The project was inspired by my own experience — I built it as a tool I actively use during my job search.

---

## ✨ Features

- Secure authentication (JWT access & refresh tokens)
- User profile management
- Job aggregation and scraping from multiple sources
- Structured transformation of raw job data into a normalized format
- Job filtering and sorting based on relevance and user preferences
- Application tracking system
  - Convert jobs into applications
  - Track status (applied, interview, rejected, etc.)
  - Add personal notes per application
- Manual application creation for external platforms
- Fully responsive UI for all devices

---

## ⚙️ Tech Stack
### Frontend
- React
- TypeScript
- Vite
### Backend
- Node.js
- Express
### Database
- PostgreSQL
### Background Processing
- Bull (job queue)
- Redis (caching + async jobs)

---

## 🏗 Architecture

- REST API built with Express
- Stateless authentication using JWT (access + refresh flow)
- Job → Application lifecycle management
- Async job processing pipeline (Bull + Redis + Worker)
- PostgreSQL for persistent structured data
- Redis for caching and queue handling
- Worker service for background tasks (job parsing, processing)

---

## 🚀 Deployment

- Vercel — frontend hosting
- Railway — backend, PostgreSQL, Redis, and worker services
- Docker — used for local development (Redis + worker setup)

---

## 🧪 Key Challenges

- Designing a full-stack system from scratch (idea → architecture → implementation → deployment)
- Structuring scalable data models for job → application lifecycle
- Handling deployment differences between local and production environments (CORS, environment variables, API URLs)
- Managing a multi-service architecture (frontend, backend, worker, database, queue)
- Optimizing database queries for large datasets of scraped jobs
- Building a reliable async processing pipeline using Bull + Redis

---

## 🔮 Future Improvements

- Add unit and integration tests (auth, scraping, application flows)
- Dockerize full production setup for easier deployment and consistency
- Add analytics dashboard for job search progress and success tracking
- Implement real-time notifications for application updates
- Improve job matching and ranking algorithm
- Add role-based access control (RBAC)

---

## 👨‍💻 Author

**Stanislav Borychevskyi** — Full Stack Developer  
Focused on building scalable web applications, backend systems, and real-world problem-solving tools.

- GitHub: https://github.com/sborichevskyi
- LinkedIn: https://www.linkedin.com/in/stanislav-borychevskyi-b84b16317/
