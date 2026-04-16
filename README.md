# Student Management System - Full Stack

Build with FastAPI (Backend) and React + Vite (Frontend).

## Prerequisites
- Node.js & npm
- Python 3.10+
- PostgreSQL (already configured in backend)

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Features
- **Authentication**: Secure JWT-based login and registration.
- **Role-Based Access**: 
  - **Admin**: Can view, add, and delete student records.
  - **Student**: Can view and update their own profile.
- **Premium UI**: Dark mode, Inter/Outfit typography, Glassmorphism design.
- **API Interceptors**: Automatically attaches JWT to protected requests.

## Scalability Note
For high-scale production, we would:
- Move to **Microservices** by separating Auth and Student services.
- Implement **Redis Caching** for frequently accessed student lists.
- Add **Load Balancers** (Nginx) to distribute traffic.
- Use **Docker Compose** for containerized deployment.
- Use **WebSockets** for real-time status updates on student records.
