# Scalability Note

## Architecture Strategy

### 1. Vertical vs Horizontal Scaling
To handle increasing student records (millions) and concurrent admin users:
- **Load Balancing (Horizontal Scalability)**: We would deploy multiple instances of the FastAPI backend behind an Nginx load balancer to distribute the request load.
- **Horizontal Pod Autoscaling (K8s)**: Using Kubernetes to spin up more containers automatically based on CPU/RAM usage.

### 2. Caching Strategy
- **Redis Integration**: We could cache student lists (`GET /get-students`) with a short TTL (Time To Live). This reduces database hits for frequent read-heavy operations like dashboard loading.

### 3. Database Management
- **Read Replicas**: Separate the write-heavy ops (admin updates) from read-heavy (student profile fetching) by using database replication.
- **Indexing**: Adding BTREE indexes on `email` and `sub` columns in PostgreSQL to ensure O(1) or O(log N) lookup time.

### 4. Microservices Decomposition
As the system grows (e.g., adding Attendance, Fee Management, Grades), we would decompose this monolith into:
- **Auth Service**: Manages JWT, login/register exclusively.
- **Academic Service**: Manages Student profiles and courses.
- **Notification Service**: Sends email alerts/reminders via RabbitMQ or Kafka.

### 5. API Resilience
- **Rate Limiting**: Use Redis-based rate limiting on the `/login` and `/register` endpoints to prevent brute-force attacks.
- **Bulk Data Processing**: Use Celery (with Redis/RabbitMQ) for long-running batch student registration or report generation to keep the APIs responsive.
