

---

## 1 Login

**Method:** `POST /login`

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
  "user": {
    "id": "abc123",
    "name": "Dafahan",
    "email": "dafahan@example.com"
  }
}
```

> **Frontend note:** token ini akan disimpan di `localStorage` atau `Authorization` header.

---

## 2 Get Current User

**Method:** `GET /me`

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

## 3 Logout

**Method:** `POST /logout`

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

## 4 Refresh Token

**Method:** `POST /refresh`

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

## 5 Forgot Password

**Method:** `POST /forgot-password`

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

## 6 Reset Password

**Method:** `POST /reset-password`

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


## 📋 Summary Table

|  # | Method | Endpoint           | Description                  | Auth Required |
| -: | :----: | :----------------- | :--------------------------- | :-----------: |
|  1 |  POST  | `/login`           | Login & get token            |       ❌       |
|  2 |   GET  | `/me`              | Get current user             |       ✅       |
|  3 |  POST  | `/logout`          | Logout user                  |       ✅       |
|  4 |  POST  | `/refresh`         | Refresh access token         |       ❌       |
|  5 |  POST  | `/forgot-password` | Request password reset email |       ❌       |
|  6 |  POST  | `/reset-password`  | Reset password               |       ❌       |

---

## ⚙️ Notes for Backend Dev

* Semua response pakai struktur standar:

  ```json
  {
    "success": true/false,
    "message": "string",
    "data": {}
  }
  ```
* Token: gunakan **JWT** (Bearer Token)
* Gunakan middleware auth untuk `/me` & `/logout`
* Base path semua di bawah `/api/v1/auth`

---

