# FixItNow 🔧 — Backend API

**Your Trusted Home Service Platform**

A backend REST API for a home services marketplace where customers can book qualified technicians for services like plumbing, electrical work, cleaning, and painting.

---

## 📋 Project Overview

FixItNow connects customers with verified technicians for home services. Customers can browse services, book technicians, make secure payments, and leave reviews. Technicians manage their profiles, availability, and bookings. Admins oversee the entire platform.

---

## 👥 Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|------------------|
| **Customer** | Users who book home services | Browse services, book technicians, track bookings, make payments, leave reviews |
| **Technician** | Service professionals | Create profile, set availability, manage bookings, complete jobs |
| **Admin** | Platform moderators | Manage users, oversee bookings, manage service categories |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| PostgreSQL + Prisma | Database and ORM |
| JWT | Authentication |
| Stripe | Payment processing |
| Zod | Input validation |
| bcryptjs | Password hashing |

---

## ✨ Features

### Public
- Browse all available services and technicians
- Search and filter by category, price, and rating
- View technician profiles with reviews

### Customer
- Register and login
- Book a technician for a specific service
- Make secure payments via Stripe
- Track booking status in real time
- Leave reviews after job completion

### Technician
- Create and update service profile
- Set availability
- Accept or decline bookings
- Mark jobs as in-progress or completed

### Admin
- View and manage all users (ban/unban)
- View all bookings across the platform
- Manage service categories

---

## 🗄️ Database Design

The database consists of 7 core models:

- **User** — stores account info, authentication details, and role
- **TechnicianProfile** — technician-specific details (linked 1:1 to User)
- **Category** — service categories (Plumbing, Electrical, Cleaning, etc.)
- **Service** — specific services offered by technicians
- **Booking** — job bookings between customers and technicians
- **Payment** — payment transactions (Stripe integration)
- **Review** — customer reviews for completed bookings

**Booking status flow:**
```
REQUESTED → ACCEPTED / DECLINED → PAID → IN_PROGRESS → COMPLETED
```
Customers may cancel a booking at any point before it reaches `IN_PROGRESS`.

---

## 🔗 Live Links

| Resource | Link |
|----------|------|
| **Live API** | `[PENDING — will be added after deployment]` |
| **API Documentation (Postman)** | `[PENDING — will be added after export]` |
| **Demo Video** | `[PENDING — will be added]` |

---

## 🔑 Admin Credentials

```
Email: admin@fixitnow.com
Password: Admin123456
```

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone hhttps://github.com/chinaakther05/fixitnow-backend
cd fixitnow-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory (see `.env.example` for reference):
```env
PORT=5000
APP_URL=http://localhost:5000/
DATABASE_URL=your_postgresql_connection_string
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_test_secret_key
```

### 4. Run database migrations
```bash
npx prisma migrate dev
```

### 5. Seed the database (creates admin user and categories)
```bash
npx prisma db seed
```

### 6. Start the development server
```bash
npm run dev
```

The API will be running at `http://localhost:5000`

---

## 📚 API Endpoints Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Register a new user (customer/technician) |
| POST | `/api/auth/login` | Login and receive a JWT token |

### Services & Technicians (Public)
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/categories` | Get all service categories |
| GET | `/api/services` | Get all services with filters |
| GET | `/api/technicians/:id` | Get technician profile with reviews |

### Bookings
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings` | Get the current user's bookings |

### Payments
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/payments/create` | Create a Stripe payment session |
| GET | `/api/payments/confirm` | Confirm payment status |
| GET | `/api/payments` | Get payment history |

### Reviews
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/reviews` | Submit a review after job completion |

### Admin
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status (ban/unban) |
| GET | `/api/admin/bookings` | Get all bookings |
| POST | `/api/admin/categories` | Create a new service category |

> Full details for all endpoints, request bodies, and response formats are available in the Postman documentation linked above.

---

## 🔒 Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descriptive error message",
  "errorDetails": "Additional error context"
}
```

---

## 📄 License

This project was built as an educational backend assignment.