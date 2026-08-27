# ORM Integrated Blog API

Backend API untuk aplikasi blog yang dibangun dengan Express.js, Prisma ORM, PostgreSQL, dan JWT Authentication.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Setup dan Instalasi](#setup-dan-instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [API Endpoints](#api-endpoints)
- [Controllers](#controllers)
- [Services](#services)
- [Error Handling](#error-handling)

---

## 🚀 Fitur Utama

- ✅ **Authentication & Authorization** - JWT-based authentication dengan password hashing
- ✅ **User Management** - Sign up, sign in, sign out, get profile
- ✅ **Blog Posts** - Create, read, update, delete, restore posts dengan soft delete
- ✅ **Tags Management** - Manage tags untuk blog posts
- ✅ **Task Management** - Create, read, update, delete, restore tasks dengan soft delete
- ✅ **Pagination & Filtering** - Support pagination dan filtering untuk GET endpoints
- ✅ **Soft Delete** - Data tidak benar-benar dihapus, hanya ditandai sebagai deleted
- ✅ **Request Validation** - Validasi input menggunakan Yup schema
- ✅ **Error Handling** - Centralized error handling di application level

---

## 🛠️ Tech Stack

| Technology | Version | Fungsi |
|-----------|---------|--------|
| Node.js | 18+ | Runtime environment |
| Express.js | 5.2.1 | Web framework |
| TypeScript | 5.9.3 | Programming language |
| Prisma | 7.8.0 | ORM |
| PostgreSQL | 12+ | Database |
| JWT | (jsonwebtoken) | Authentication |
| bcrypt | (bcrypt) | Password hashing |
| Yup | 1.7.1 | Schema validation |

---

## 📦 Prasyarat

Pastikan Anda telah menginstall:

- Node.js 18.x atau lebih tinggi
- npm atau yarn
- PostgreSQL 12 atau lebih tinggi
- Git (opsional)

---

## 🔧 Setup dan Instalasi

### 1. Clone Repository (Jika dari repo)

```bash
git clone <repository-url>
cd orm-integrated-blog-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run gen:dev

# Jalankan migration pertama kali
npm run mig:dev
```

### 4. Generate Prisma Client (Jika diperlukan)

```bash
npm run gen:dev
```

---

## 🔐 Konfigurasi Environment

Buat file `.env` di root direktori dengan konfigurasi berikut:

```env
# Application
APP_NAME="ORM Integrated Blog API"
APP_PORT=8000

# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host-pooler/database?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require&channel_binding=require"

# JWT Configuration
JWT_SECRET="a7f3b9e2c1d4f6a8e5b2c7d9f1a3e5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f"
JWT_EXPIRES_IN="1h"
```

### Penjelasan:
- **APP_NAME**: Nama aplikasi (untuk response welcome)
- **APP_PORT**: Port tempat server berjalan
- **DATABASE_URL**: Connection string dengan pooler untuk production
- **DIRECT_URL**: Connection string langsung untuk migration
- **JWT_SECRET**: Secret key untuk signing JWT token (minimal 32 karakter, gunakan alphanumeric SHA256)
- **JWT_EXPIRES_IN**: Durasi token validity (format: "1h", "24h", "7d", dll)

---

## 🚀 Menjalankan Aplikasi

### Mode Development (dengan hot reload)

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8000`

### Mode Production

```bash
# Build TypeScript ke JavaScript
npm run build

# Jalankan compiled code
npm start
```

---

## 🏗️ Arsitektur Aplikasi

### Struktur Direktori

```
src/
├── configs/              # Konfigurasi aplikasi
│   └── env.config.ts     # Environment variables
├── controllers/          # Business logic untuk setiap endpoint
│   ├── auth.controller.ts
│   ├── posts.controller.ts
│   └── tasks.controller.ts
├── services/             # Utility functions dan business logic
│   └── auth.service.ts   # Password hashing, JWT generation/verification
├── middlewares/          # Express middlewares
│   ├── authenticate.middleware.ts    # JWT verification
│   └── request-body-validation.middleware.ts  # Request validation
├── resources/            # Route definitions
│   ├── auth.resource.ts
│   ├── posts.resource.ts
│   └── tasks.resource.ts
├── validations/          # Yup validation schemas
│   ├── auth.schema.ts
│   ├── post.schema.ts
│   └── task.schema.ts
├── interfaces/           # TypeScript interfaces
│   ├── base-controller.interface.ts
│   └── token-payload.interface.ts
├── libs/                 # Library wrappers
│   ├── prisma.client.ts
│   ├── jwt.ts
│   ├── bcrypt.ts
│   └── yup.ts
├── routes/
│   └── api.route.ts      # Main API router
└── generated/
    └── prisma/           # Auto-generated Prisma types

app.ts                    # Express application setup
global.d.ts               # TypeScript global type definitions
prisma/
├── schema.prisma         # Database schema definition
└── migrations/           # Database migration files
```

### Alur Request

```
Client Request
    ↓
Express Middleware (json, urlencoded)
    ↓
API Router (/api)
    ↓
Resource Router (specific resource)
    ↓
Middleware (authenticate, validate)
    ↓
Controller (business logic)
    ↓
Service (utility functions)
    ↓
Prisma ORM → PostgreSQL
    ↓
Response to Client
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8000/api
```

---

### Authentication Endpoints

#### 1. Sign Up (Register)
```
POST /auth/sign-up
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (201 Created):
{
  "message": "User created successfully!"
}
```

#### 2. Sign In (Login)
```
POST /auth/sign-in
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (200 OK):
{
  "message": "User signed in successfully!",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "avatarUrl": null,
      "createdAt": "2026-06-30T10:00:00Z",
      "updatedAt": "2026-06-30T10:00:00Z",
      "deletedAt": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get My Profile
```
GET /auth/me
Authorization: Bearer <accessToken>

Response (200 OK):
{
  "message": "User retrieved successfully!",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "avatarUrl": null,
    "posts": [...],
    "tasks": [...],
    "createdAt": "2026-06-30T10:00:00Z",
    "updatedAt": "2026-06-30T10:00:00Z",
    "deletedAt": null
  }
}
```

#### 4. Sign Out
```
POST /auth/sign-out
Authorization: Bearer <accessToken>

Response (200 OK):
{
  "message": "User signed out successfully!"
}
```

---

### Posts Endpoints

#### 1. Get All Posts (with Pagination & Filtering)
```
GET /posts?page=1&limit=10&search=keyword&authorId=1&orderBy=asc
Authorization: Not required

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- search: Search in title (case-insensitive)
- authorId: Filter by author ID
- orderBy: Sort order (asc/desc, default: desc)

Response (200 OK):
{
  "message": "Posts retrieved successfully!",
  "data": [
    {
      "id": 1,
      "title": "My First Blog Post",
      "imageUrl": "https://example.com/image.jpg",
      "content": "This is the content of my first blog post...",
      "authorId": 1,
      "author": {
        "id": 1,
        "email": "user@example.com",
        "avatarUrl": null,
        "createdAt": "2026-06-30T10:00:00Z",
        "updatedAt": "2026-06-30T10:00:00Z",
        "deletedAt": null
      },
      "tags": [],
      "createdAt": "2026-06-30T11:00:00Z",
      "updatedAt": "2026-06-30T11:00:00Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "currentPage": 1,
    "limit": 10,
    "totalPages": 1,
    "totalPosts": 1
  }
}
```

#### 2. Get Post by ID
```
GET /posts/:id
Authorization: Not required

Response (200 OK):
{
  "message": "Post retrieved successfully!",
  "data": {
    "id": 1,
    "title": "My First Blog Post",
    "imageUrl": "https://example.com/image.jpg",
    "content": "This is the content of my first blog post...",
    "authorId": 1,
    "author": {...},
    "tags": [],
    "createdAt": "2026-06-30T11:00:00Z",
    "updatedAt": "2026-06-30T11:00:00Z",
    "deletedAt": null
  }
}
```

#### 3. Create Post
```
POST /posts
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "title": "My New Blog Post",
  "content": "This is a comprehensive blog post with meaningful content here...",
  "imageUrl": "https://example.com/image.jpg"
}

Response (201 Created):
{
  "message": "Post created successfully!"
}

Validation Rules:
- title: min 5, max 100 characters (required)
- content: min 20, max 1000 characters (required)
- imageUrl: valid URL format (optional)
- authorId: automatically set from req.user.id
```

#### 4. Update Post
```
PUT /posts/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "title": "Updated Title",
  "content": "Updated content with more information...",
  "imageUrl": "https://example.com/new-image.jpg"
}

Response (200 OK):
{
  "message": "Post updated successfully!",
  "data": {...}
}

Note: Only post author can update their own post
```

#### 5. Restore Soft Deleted Post
```
PATCH /posts/:id
Authorization: Bearer <accessToken>

Response (200 OK):
{
  "message": "Post restored successfully!",
  "data": {...}
}
```

#### 6. Delete Post (Soft Delete by default, Hard Delete with query param)
```
DELETE /posts/:id
Authorization: Bearer <accessToken>

Query Parameters:
- hard: true (optional, for permanent deletion)

Soft Delete (default):
DELETE /posts/1
Response (200 OK):
{
  "message": "Post soft deleted successfully!"
}

Hard Delete (permanent):
DELETE /posts/1?hard=true
Response (200 OK):
{
  "message": "Post permanently deleted successfully!"
}
```

---

### Tasks Endpoints

#### 1. Get All Tasks (with Pagination & Filtering)
```
GET /tasks?page=1&limit=10&search=keyword&userId=1&orderBy=asc
Authorization: Not required

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- search: Search in task name (case-insensitive)
- userId: Filter by user ID
- orderBy: Sort order (asc/desc, default: desc)

Response (200 OK):
{
  "message": "Tasks retrieved successfully!",
  "data": [
    {
      "id": 1,
      "name": "Complete project documentation",
      "userId": 1,
      "user": {
        "id": 1,
        "email": "user@example.com",
        "avatarUrl": null,
        "createdAt": "2026-06-30T10:00:00Z",
        "updatedAt": "2026-06-30T10:00:00Z",
        "deletedAt": null
      },
      "createdAt": "2026-06-30T12:00:00Z",
      "updatedAt": "2026-06-30T12:00:00Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "currentPage": 1,
    "limit": 10,
    "totalPages": 1,
    "totalTasks": 1
  }
}
```

#### 2. Get Task by ID
```
GET /tasks/:id
Authorization: Not required

Response (200 OK):
{
  "message": "Task retrieved successfully!",
  "data": {
    "id": 1,
    "name": "Complete project documentation",
    "userId": 1,
    "user": {...},
    "createdAt": "2026-06-30T12:00:00Z",
    "updatedAt": "2026-06-30T12:00:00Z",
    "deletedAt": null
  }
}
```

#### 3. Create Task
```
POST /tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "name": "Complete project documentation"
}

Response (201 Created):
{
  "message": "Task created successfully!"
}

Validation Rules:
- name: min 3, max 100 characters (required)
- userId: automatically set from req.user.id
```

#### 4. Update Task
```
PUT /tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "name": "Updated task name"
}

Response (200 OK):
{
  "message": "Task updated successfully!",
  "data": {...}
}
```

#### 5. Restore Soft Deleted Task
```
PATCH /tasks/:id
Authorization: Bearer <accessToken>

Response (200 OK):
{
  "message": "Task restored successfully!",
  "data": {...}
}
```

#### 6. Delete Task
```
DELETE /tasks/:id
Authorization: Bearer <accessToken>

Query Parameters:
- hard: true (optional, for permanent deletion)

Response (200 OK):
{
  "message": "Task soft deleted successfully!"
}

Hard Delete:
DELETE /tasks/:id?hard=true
Response (200 OK):
{
  "message": "Task permanently deleted successfully!"
}
```

---

### Tags Endpoints

#### Get All Tags
```
GET /tags
Authorization: Not required

Response (200 OK):
{
  "message": "Tags retrieved successfully!",
  "data": [
    {
      "id": 1,
      "name": "javascript",
      "createdAt": "2026-06-30T10:00:00Z",
      "updatedAt": "2026-06-30T10:00:00Z",
      "deletedAt": null
    }
  ]
}
```

---

## 🎮 Controllers

### AuthController (`src/controllers/auth.controller.ts`)

Object literal controller untuk menangani authentication logic.

**Methods:**
- `signUp()` - Register user baru dengan hashed password
- `signIn()` - Login dan return JWT accessToken
- `getMe()` - Get profile user yang authenticated
- `signOut()` - Logout user (token handling di client-side)

**Key Features:**
- Password hashing menggunakan bcrypt (10 salt rounds)
- JWT token generation dengan 1 jam expiry
- User data attachment ke req.user dari middleware

---

### PostsController (`src/controllers/posts.controller.ts`)

Implements `IBaseControllerSoftDelete` interface untuk CRUD operations pada Posts.

**Methods:**
- `getAll()` - Get posts dengan pagination, filtering, dan search
- `getById()` - Get post spesifik berdasarkan ID
- `create()` - Create post baru (authorId otomatis dari req.user.id)
- `update()` - Update post
- `delete()` - Soft delete atau hard delete post
- `restore()` - Restore soft deleted post

**Features:**
- Pagination dengan default limit 10
- Search functionality di field title
- Filter by authorId
- Include relation dengan author data (password excluded)
- Transaction handling untuk multiple queries
- Soft delete support

---

### TasksController (`src/controllers/tasks.controller.ts`)

Implements `IBaseControllerSoftDelete` interface untuk CRUD operations pada Tasks.

**Methods:**
- `getAll()` - Get tasks dengan pagination, filtering, dan search
- `getById()` - Get task spesifik berdasarkan ID
- `create()` - Create task baru (userId otomatis dari req.user.id)
- `update()` - Update task
- `delete()` - Soft delete atau hard delete task
- `restore()` - Restore soft deleted task

**Features:**
- Pagination dengan default limit 10
- Search functionality di field name
- Filter by userId
- Include relation dengan user data (password excluded)
- Soft delete support

---

## 🔧 Services

### AuthService (`src/services/auth.service.ts`)

Utility service untuk authentication operations.

**Methods:**

#### `hashPassword(password: string): Promise<string>`
```typescript
// Hash password dengan bcrypt (10 salt rounds)
const hashedPassword = await AuthService.hashPassword("plainTextPassword");
```

#### `comparePassword(password: string, hashedPassword: string): Promise<boolean>`
```typescript
// Compare plaintext password dengan hashed password
const isMatch = await AuthService.comparePassword("plainText", hashedPassword);
```

#### `generateAccessToken(user: Omit<User, "password">): string`
```typescript
// Generate JWT token dengan payload id dan email
// Expiry: 1 hour (configurable via JWT_EXPIRES_IN env)
const token = AuthService.generateAccessToken(user);
```

#### `verifyAccessToken(token: string): TokenPayload | null`
```typescript
// Verify dan decode JWT token
// Return null jika invalid atau expired
const payload = AuthService.verifyAccessToken(token);
```

---

## 🔒 Middleware

### authenticateMiddleware (`src/middlewares/authenticate.middleware.ts`)

Middleware untuk memverifikasi JWT token dan attach user ke req object.

**Proses:**
1. Extract token dari `Authorization: Bearer <token>` header
2. Verify token menggunakan `AuthService.verifyAccessToken()`
3. Fetch user dari database menggunakan decoded user id
4. Attach user ke `req.user` (tanpa password)
5. Lanjut ke next middleware/handler

**Usage:**
```typescript
// Di resource file
tasksResource.post(
  "/",
  authenticate,  // Middleware authentication
  requestBodyValidation(createTaskSchema),
  TasksController.create
);
```

### requestBodyValidationMiddleware (`src/middlewares/request-body-validation.middleware.ts`)

Middleware untuk validasi request body menggunakan Yup schema.

**Usage:**
```typescript
// Di resource file
postsResource.post(
  "/",
  authenticate,
  requestBodyValidation(createPostSchema),  // Validate body
  PostsController.create
);
```

---

## ⚠️ Error Handling

Aplikasi menggunakan centralized error handling di `app.ts`:

### Error Types yang Ditangani:

#### 1. Yup Validation Error (400 Bad Request)
```json
{
  "message": "Validasi request body gagal",
  "error": ["Email is required", "Password must be at least 8 characters"]
}
```

#### 2. Prisma Database Error (400 Bad Request)
```json
{
  "message": "Terjadi error pada database",
  "error": "Unique constraint failed on the fields: (`email`)"
}
```

#### 3. General Server Error (500 Internal Server Error)
```json
{
  "message": "Terjadi error pada server",
  "error": "Error message here"
}
```

#### 4. Not Found Error (404 Not Found)
```json
{
  "message": "Endpoint tidak ditemukan"
}
```

---

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "avatar_url" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP
);
```

### Post Table
```sql
CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "image_url" VARCHAR(255),
  "content" TEXT NOT NULL,
  "author_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP
);
```

### Task Table
```sql
CREATE TABLE "tasks" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP
);
```

### Tag Table
```sql
CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP
);
```

### Post-Tag Junction Table
```sql
CREATE TABLE "_post_to_tag" (
  "A" INTEGER NOT NULL REFERENCES "posts"("id"),
  "B" INTEGER NOT NULL REFERENCES "tags"("id"),
  UNIQUE("A", "B")
);
```

---

## 📚 Scripts Tersedia

```bash
# Development
npm run dev          # Run dengan hot reload (tsx watch)

# Build
npm run build        # Compile TypeScript to JavaScript

# Production
npm start            # Run compiled JavaScript

# Database
npm run gen:dev      # Generate Prisma Client
npm run db:studio    # Open Prisma Studio GUI
npm run mig:dev      # Create dan run migration
npm run mig:prod     # Deploy migration to production
```

---

## 🔄 Authentication Flow

```
1. User Registration (Sign Up)
   ├─ POST /auth/sign-up
   ├─ Validate input dengan Yup schema
   ├─ Hash password dengan bcrypt
   ├─ Create user di database
   └─ Return 201 Created

2. User Login (Sign In)
   ├─ POST /auth/sign-in
   ├─ Validate input
   ├─ Find user by email
   ├─ Compare password
   ├─ Generate JWT accessToken
   └─ Return token + user data

3. Authenticated Request
   ├─ Client send: Authorization: Bearer <token>
   ├─ Middleware verify token
   ├─ Fetch user dari database
   ├─ Attach user ke req.user
   └─ Proceed to controller

4. User Logout (Sign Out)
   ├─ POST /auth/sign-out
   ├─ Client delete token dari local storage
   └─ Server respond success
```

---

## 🚨 Important Notes

1. **Password Hashing**: Semua password di-hash dengan bcrypt sebelum disimpan ke database
2. **JWT Token**: Token valid selama 1 jam, perlu di-refresh setelahnya
3. **Soft Delete**: Data tidak benar-benar dihapus, hanya ditandai `deletedAt`
4. **userId/authorId**: Otomatis diambil dari `req.user.id`, tidak perlu dikirim dari request
5. **Pagination**: Default limit 10 item per page jika tidak spesifikasi
6. **CORS**: Tidak dikonfigurasi, perlu ditambahkan jika frontend berbeda domain

---

## 📝 Environment Setup Example

```env
# .env.development
APP_NAME="ORM Integrated Blog API Dev"
APP_PORT=8000
DATABASE_URL="postgresql://localhost/blog_dev"
DIRECT_URL="postgresql://localhost/blog_dev"
JWT_SECRET="dev_secret_key_change_in_production_32_chars_minimum"
JWT_EXPIRES_IN="1h"

# .env.production
APP_NAME="ORM Integrated Blog API"
APP_PORT=3000
DATABASE_URL="postgresql://user:pass@prod-host-pooler/db"
DIRECT_URL="postgresql://user:pass@prod-host/db"
JWT_SECRET="your_secure_production_secret_key_sha256_hash"
JWT_EXPIRES_IN="24h"
```

---

## 🤝 Contributing

Pastikan untuk:
1. Follow arsitektur yang sudah ada
2. Gunakan object literal untuk controller/service (bukan class)
3. Implement interface `IBaseController` atau `IBaseControllerSoftDelete`
4. Tambahkan Yup validation schema di `src/validations/`
5. Test semua endpoints sebelum push

---

## 📄 License

ISC

---

## 👨‍💻 Author

Purwadhika JCWDAH-026

---

## 🆘 Troubleshooting

### Error: "No authorization token provided"
- Pastikan menambahkan `Authorization: Bearer <token>` di header
- Token harus valid dan belum expired

### Error: "User not found"
- Email tidak terdaftar di database
- Pastikan sign up terlebih dahulu

### Error: "Invalid password"
- Password yang diinput tidak sesuai
- Case-sensitive

### Error: "JWT_SECRET is not defined"
- Pastikan `.env` file ada dan terisi `JWT_SECRET`
- Restart server setelah mengubah `.env`

### Database Connection Error
- Pastikan PostgreSQL running
- Check `DATABASE_URL` dan `DIRECT_URL` di `.env`
- Verify network connectivity ke database server

---

**Last Updated**: June 30, 2026
