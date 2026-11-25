# Employee Management System (MERN)

A multi-company Employee Management System built with Node.js, Express, MongoDB (Mongoose), React, Redux Toolkit, and React Router.

## Features

### Backend (`EMS_Backend`)
- JWT-based authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/companies`)
- Multi-company data isolation across 4 companies (`COMP_A`, `COMP_B`, `COMP_C`, `COMP_D`)
- Employee CRUD REST API (`/api/employees`)
- Search by employee name or employee code
- Filter by department and status (`active` / `inactive`)
- Sorting (`createdAt`, `name`, `employee_code`, `salary`, `joining_date`, etc.)
- Pagination with `limit` capped between `1` and `50` (default `10`)
- Request validation and centralized error handling (`400`, `401`, `404`, `409`, `500`)
- Compound unique indexes on `{ company_id, employee_code }` and `{ company_id, email }`, plus indexes on frequently queried fields

### Frontend (`EMS_Frontend`)
- Authentication pages (`/login`, `/register`) with company selection
- Protected dashboard route (`/dashboard`) using React Router
- State management with Redux Toolkit (`authSlice`, `employeeSlice`)
- Employee listing table with debounced search, department/status filters, sorting, and pagination
- Validated Add / Edit Employee modal with submit lock to prevent duplicate submissions
- Delete confirmation modal, loading spinner, and success/error alert banners

## Project Structure

```text
Employee-Management-System/
├── EMS_Backend/
│   ├── config/
│   │   ├── companies.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── employeeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validateEmployee.js
│   ├── models/
│   │   ├── employee.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── employeeRoutes.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── EMS_Frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── constants.js
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/harsh-solanki-code/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Backend Setup
```bash
cd EMS_Backend
npm install
```

Create a `.env` file in `EMS_Backend` (refer to `.env.example`):
```env
PORT=3085
MONGODB_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../EMS_Frontend
npm install
```

Create a `.env` file in `EMS_Frontend` (refer to `.env.example`):
```env
VITE_API_URL=http://localhost:3085/api
```

Start the frontend dev server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

### Auth
- `GET /api/auth/companies` - List available companies
- `POST /api/auth/register` - Register a new user under a company
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current authenticated user (Protected)

### Employees (Protected - Bearer Token Required)
- `GET /api/employees` - List employees with `search`, `department`, `status`, `sortBy`, `sortOrder`, `page`, `limit`
- `GET /api/employees/:id` - Get single employee by ID
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Full update of an employee
- `PATCH /api/employees/:id` - Partial update of an employee
- `DELETE /api/employees/:id` - Delete an employee
