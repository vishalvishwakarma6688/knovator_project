# Artha Job Importer – Full Stack (MERN) Assignment

This project is a **scalable job importing system** built with the MERN stack. It fetches job listings from multiple external XML APIs, queues them using Redis and Bull, imports them into MongoDB, and provides a web UI to view import history and track job sync operations.

---

## Features

- ✅ Fetch jobs from multiple external **XML job feeds**
- ✅ Convert XML to JSON using `xml2js`
- ✅ Queue jobs using **Bull + Redis** for background processing
- ✅ Import/update jobs in MongoDB using **Mongoose**
- ✅ Track detailed **import history logs**
- ✅ View import logs in a clean **Next.js (App Router)** Admin UI
- ✅ Hourly job sync via `setInterval`
- ✅ Clean, modular code with separation of concerns

---

## Tech Stack

| Layer       | Tech                         |
|-------------|------------------------------|
| Frontend    | Next.js (App Router)         |
| Backend     | Express.js (Node.js)         |
| Database    | MongoDB + Mongoose           |
| Queue       | Bull + Redis                 |
| XML Parser  | xml2js                       |
| Styling     | Tailwind CSS                 |
| Logging     | MongoDB `import_logs`        |

---

├── client # Frontend (Next.js)
│ └── app/import-history/page.js
├── server # Backend (Express.js)
│ ├── models # Mongoose schemas
│ ├── services # XML fetch + parsing
│ ├── queues # Bull job queue
│ ├── routes # API endpoints
│ ├── index.js # Starts API + fetch logic
│ └── worker.js # Background job processor
├── docs/architecture.md
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/artha-job-importer.git
cd artha-job-importer


## Project Structure


## Backend Setup
cd server
npm install

## Backend Setup create .env file
MONGO_URI=mongodb://localhost:27017/artha-job-board
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

## start server
node index.js  # Runs server and schedules hourly fetch

## Start Worker Process
cd server
node worker.js


## Frontend Setup
cd client
npm install
npm run dev

Visit: http://localhost:3000/import-history