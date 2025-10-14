Here’s your updated **API documentation** — all endpoints are now under the prefix `/api/v1/auth`, and I’ve clarified that **JWT is issued and verified by your backend** (not the campus SSO).

---

# 🔐 Auth API — `/api/v1/auth`

All routes below are prefixed with

> **`/api/v1/auth`**

JWT tokens are **generated and validated by the backend system**, while the campus SSO only verifies user credentials (returns true/false).

---

## 1. Login

**Method:** `POST /api/v1/auth/login`

### Request

```json
{
  "npm": "2267051001",
  "password": "12345678"
}
```

### Expected Response

```json
{
  "success": true,
  "token": "jwt-token-string",
  "refreshToken": "refresh-token-string",
  "user": {
    "id": "abc123",
    "name": "Dafahan",
    "email": "dafahan@example.com",
    "role": "user"
  }
}
```

> **Frontend note:**
> Store the `token` in **localStorage** or send it in the `Authorization` header on future requests.
> The token is **issued by the backend**, not by the SSO.

---

## 2. Get Current User

**Method:** `GET /api/v1/auth/me`

### Header

```
Authorization: Bearer <token>
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Dafahan",
    "email": "dafahan@example.com",
    "role": "user"
  }
}
```

---

## 3. Logout

**Method:** `POST /api/v1/auth/logout`

### Header

```
Authorization: Bearer <token>
```

### Expected Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 4. Refresh Token

**Method:** `POST /api/v1/auth/refresh`

### Request

```json
{
  "refreshToken": "refresh-token-string"
}
```

### Expected Response

```json
{
  "success": true,
  "token": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

## 5. Forgot Password

**Method:** `POST /api/v1/auth/forgot-password`

### Request

```json
{
  "email": "dafahan@example.com"
}
```

### Expected Response

```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

## 6. Reset Password

**Method:** `POST /api/v1/auth/reset-password`

### Request

```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

### Expected Response

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 7. Verify SSO Credentials (optional internal endpoint)

**Method:** `POST /api/v1/auth/verify-sso`

> Used internally by the backend to validate username/password against the campus SSO.
> This endpoint **does not issue JWTs**, it only checks credentials.

### Request

```json
{
  "username": "2267051001",
  "password": "12345678"
}
```

### Expected Response

```json
{
  "success": true,
  "verified": true
}
```

---

## 📋 Summary Table

|  # | Method | Endpoint                       | Description                        | Auth Required |
| -: | :----: | :----------------------------- | :--------------------------------- | :-----------: |
|  1 |  POST  | `/api/v1/auth/login`           | Login & get JWT token              |       ❌       |
|  2 |   GET  | `/api/v1/auth/me`              | Get current logged-in user         |       ✅       |
|  3 |  POST  | `/api/v1/auth/logout`          | Logout and invalidate token        |       ✅       |
|  4 |  POST  | `/api/v1/auth/refresh`         | Refresh access token               |       ❌       |
|  5 |  POST  | `/api/v1/auth/forgot-password` | Request password reset email       |       ❌       |
|  6 |  POST  | `/api/v1/auth/reset-password`  | Reset user password                |       ❌       |
|  7 |  POST  | `/api/v1/auth/verify-sso`      | Verify credentials with campus SSO |       ❌       |

---

## ⚙️ Notes for Backend Developers

* **JWT is handled by your backend**, not by the campus SSO.

  * The backend calls the campus SSO for credential verification only.
  * On success, the backend issues its own **JWT access** and **refresh tokens**.
* All protected routes (`/me`, `/logout`) should use **auth:api** or equivalent middleware.
* All responses must follow the standard format:

```json
{
  "success": true | false,
  "message": "string",
  "data": {}
}
```

* **Base path:**
  All endpoints are served under `/api/v1/auth`

