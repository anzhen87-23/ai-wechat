# AnWeChat - API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <token>
```

Token is obtained from the `/api/auth/register` or `/api/auth/login` endpoints and stored in localStorage (web) or AsyncStorage (mobile).

---

## Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "phone": "13800138000",
  "email": "optional@email.com",
  "password": "yourpassword",
  "nickname": "Your Nickname"
}
```

One of `phone` or `email` is required. `password` and `nickname` are required.

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "phone": "13800138000",
    "email": null,
    "nickname": "Your Nickname",
    "wechatId": "wx7a3k9m2p",
    "avatarUrl": null,
    "signature": ""
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - User already exists

---

### POST /api/auth/login

Login with phone/email and password.

**Request Body:**
```json
{
  "phone": "13800138000",
  "password": "yourpassword"
}
```

**Response (200):** Same as register response.

**Error Responses:**
- `400` - Password is required
- `401` - User not found or invalid password

---

### GET /api/users/search

Search users by keyword (nickname, wechat_id, phone).

**Query Parameters:**
- `q` (required) - Search keyword

**Response (200):**
```json
[
  {
    "id": "uuid",
    "nickname": "UserName",
    "wechatId": "wx7a3k9m2p",
    "avatarUrl": null,
    "signature": ""
  }
]
```

---

### GET /api/users/:id

Get user information by ID.

**Response (200):** Same as search result item.
**Error:** `404` - User not found

---

### GET /api/users/:id/online

Check if a user is online (connected via Socket.IO).

**Response (200):**
```json
{ "online": true }
```

---

### GET /api/contacts

Get current user's contact list with last message preview.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "nickname": "FriendName",
    "wechatId": "wxfriend123",
    "avatarUrl": null,
    "signature": "",
    "lastMessage": "Hello!",
    "lastMessageTime": "2026-05-27T10:30:00.000Z",
    "unreadCount": 0
  }
]
```

---

### POST /api/contacts

Add a friend.

**Request Body:**
```json
{ "friendId": "user-uuid" }
```

**Response (200):** `{ "success": true }`
**Error:** `400` - Cannot add yourself, `404` - User not found, `409` - Already in contacts

---

### DELETE /api/contacts/:friendId

Remove a friend.

**Response (200):** `{ "success": true }`
**Error:** `404` - Contact not found

---

### GET /api/messages/:contactId

Get conversation history with a specific contact.

**Query Parameters:**
- `limit` (default: 50) - Number of messages to return
- `before` (optional) - ISO datetime to paginate from

**Response (200):**
```json
[
  {
    "id": 1,
    "senderId": "sender-uuid",
    "receiverId": "receiver-uuid",
    "content": "Hello!",
    "type": "text",
    "createdAt": "2026-05-27T10:30:00.000Z"
  }
]
```

Messages are returned in chronological order (oldest first).

---

### GET /api/profile

Get current authenticated user's profile.

**Response (200):**
```json
{
  "id": "uuid",
  "phone": "13800138000",
  "email": null,
  "nickname": "MyName",
  "wechatId": "wx7a3k9m2p",
  "avatarUrl": null,
  "signature": "Hello World",
  "createdAt": "2026-05-27T10:00:00.000Z"
}
```

---

### PUT /api/profile

Update current user's profile.

**Request Body:**
```json
{
  "nickname": "NewName",
  "signature": "New signature text"
}
```

Both fields are optional. Only provided fields will be updated.

**Response (200):** Updated user object (same as GET /api/profile without sensitive fields).

---

### GET /health

Health check endpoint.

**Response (200):**
```json
{
  "status": "ok",
  "onlineCount": 5
}
```
