# API Documentation - Student Management System

This document outlines the available REST API endpoints for the Student Management System.

**Base URL**: `http://localhost:8000/api/v1`

---

## 🔐 Authentication Endpoints

### 1. Register User
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "admin" | "student"
}
```
- **Description**: Creates a new user record for authentication.

### 2. Login
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Description**: Returns a JWT Access Token. Store this token in the header of protected requests as `Authorization: Bearer <token>`.

---

## 🎓 Student Endpoints

### 3. Create Student (Admin Only)
- **Endpoint**: `/students/`
- **Method**: `POST`
- **Access**: Admin Token Required
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "course": "Physics",
  "year": 2
}
```
- **Description**: Creates a student profile linked to a user. **Note**: If the user doesn't exist yet, it's automatically created with default password `student123`.

### 4. Get All Students (Admin Only)
- **Endpoint**: `/students/get-students`
- **Method**: `GET`
- **Access**: Admin Token Required
- **Description**: Returns list of all registered student records.

### 5. Get My Profile (Student Only)
- **Endpoint**: `/students/me`
- **Method**: `GET`
- **Access**: Student Token Required
- **Description**: Returns the student profile of the currently logged-in user.

### 6. Update My Profile (Student/Admin)
- **Endpoint**: `/students/me`
- **Method**: `PUT`
- **Access**: Token Required
- **Request Body**:
```json
{
  "name": "Jane NewName",
  "course": "Astrophysics",
  "year": 3
}
```
- **Description**: Updates the profile information for the current user.

### 7. Delete Student (Admin Only)
- **Endpoint**: `/students/{id}`
- **Method**: `DELETE`
- **Access**: Admin Token Required
- **Description**: Permanently removes a student record from the database.

---

## 🛠️ API Best Practices
- **Versioning**: All API paths are prefixed with `/api/v1` to ensure future compatibility.
- **Security**: 
    - JWT (JSON Web Tokens) used for all protected routes.
    - Password hashing via Bcrypt.
- **Errors**: Standard HTTP status codes are used:
    - `200 OK`: Success
    - `201 Created`: Success (Creation)
    - `401 Unauthorized`: No/Invalid Token
    - `422 Unprocessable Content`: Validation Error
    - `404 Not Found`: Resource does not exist
