
---

# 🔐 Auth API — `/api/v1/auth`

All routes below are prefixed with

> **`/api/v1/auth`**

JWT tokens are **issued and verified by the backend system**,
while the **campus SSO only verifies login credentials** (returns true/false).
The **refresh token** is stored securely in an **HttpOnly cookie** (not accessible from JavaScript).

---

## 1. Login

**Method:** `POST /api/v1/auth/login`

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
  "token": "jwt-access-token",
  "user": {
    "id": "abc123",
    "name": "Dafahan",
    "email": "dafahan@example.com",
    "role": "user"
  }
}
```

> **Frontend note:**
>
> * The access token should be stored in memory or localStorage for short-term use.
> * The refresh token is **automatically stored in an HttpOnly cookie** by the backend (`Set-Cookie` header).
> * The cookie will be sent automatically by the browser when calling `/refresh`.

---

## 2. Get Current User

**Method:** `GET /api/v1/auth/me`

### Header

```
Authorization: Bearer <access_token>
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
Authorization: Bearer <access_token>
```

### Expected Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

> The backend should also **delete the refresh token cookie**
> (by setting it expired using `withoutCookie('refresh_token')`).

---

## 4. Refresh Token

**Method:** `POST /api/v1/auth/refresh`

> The frontend does **not** need to send any JSON body —
> the `refresh_token` is read automatically from the secure cookie.

### Expected Response

```json
{
  "success": true,
  "token": "new-access-token"
}
```

> **Backend behavior:**
>
> * Validate the refresh token from the cookie.
> * Issue a new short-lived access token.
> * Rotate and re-set a new refresh token cookie.

---

## 📋 Summary Table

|  # | Method | Endpoint               | Description                            | Auth Required |
| -: | :----: | :--------------------- | :------------------------------------- | :-----------: |
|  1 |  POST  | `/api/v1/auth/login`   | Login via SSO & get access token       |       ❌       |
|  2 |   GET  | `/api/v1/auth/me`      | Get current logged-in user             |       ✅       |
|  3 |  POST  | `/api/v1/auth/logout`  | Logout and delete refresh token cookie |       ✅       |
|  4 |  POST  | `/api/v1/auth/refresh` | Refresh access token using cookie      |       ❌       |

---

## ⚙️ Notes for Backend Developers

* **JWT is handled by the backend**, not by the campus SSO.

  * The backend calls the **SSO API** to validate `username` + `password`.
  * On success, it issues its own **JWT access token** and **refresh token**.
* **Access token:** short-lived (e.g., 15 minutes), returned in JSON.
* **Refresh token:** long-lived (e.g., 7 days), stored in `HttpOnly`, `Secure` cookie.
* **Logout:** must clear or blacklist the refresh token.
* **Protected routes** (`/me`, `/logout`) must use middleware like `auth:api`.
* All responses must follow this structure:

```json
{
  "success": true | false,
  "message": "string",
  "data": {}
}
```

---

