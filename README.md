# Student Payments Dashboard

> A comprehensive web application for managing and monitoring student payment transactions with real-time status updates and analytics.

## 🎬 **LIVE DEMO**

<div align="center">

[![Watch Full Demo on YouTube](https://img.shields.io/badge/▶️_WATCH_FULL_DEMO-FF0000?style=for-the-badge&logo=youtube&logoColor=white&labelColor=282828&logoWidth=40)](https://youtu.be/3UHmsfEW3dQ)

<a href="https://youtu.be/3UHmsfEW3dQ">
  <img src="https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2021/06/youtube_hero_1200x675.jpg" alt="Student Payments Dashboard Demo" width="800" height="450" style="border-radius: 10px; border: 3px solid #FF0000;">
</a>

**[🔗 https://youtu.be/3UHmsfEW3dQ](https://youtu.be/3UHmsfEW3dQ)**

</div>

## 📸 Application Screenshots

### 🖼️ Key Application Screens

<div align="center">

![Login Screen](./assets/login-page.png)
*🔐 Secure authentication system*

---

![Registration Page](./assets/registration-page.png)
*📝 User account creation*

---

![Dashboard Overview](./assets/dashboard-overview.png)
*📊 Real-time analytics & stats*

---

![Payment Creation](./assets/payment-modal.png)
*💳 Intuitive payment form*

---

![Filter & Search](./assets/filter-search.png)
*🔍 Advanced filtering options*

</div>

---

## 🚀 Live Deployment

### Frontend
- **Live URL**: [https://student-payemnts-dasboard-frontend.vercel.app](https://student-payemnts-dasboard-frontend.vercel.app)
- **Status**: ✅ Active

### Backend API
- **Live URL**: [https://studentsdashboardbackend-dvbsd9cvdnhqgxa7.centralindia-01.azurewebsites.net](https://studentsdashboardbackend-dvbsd9cvdnhqgxa7.centralindia-01.azurewebsites.net)
- **Status**: ✅ Active
- **Health Check**: `/api/health`

---

## 📂 GitHub Repositories

### Frontend Repository
- **Repository**: [utkarshdev2411/Student_Payemnts_Dasboard_frontend](https://github.com/utkarshdev2411/Student_Payemnts_Dasboard_frontend)
- **Technology**: React.js + Vite
- **Deployment**: Vercel

### Backend Repository
- **Repository**: [utkarshdev2411/Student_Payemnts_Dasboard_backend](https://github.com/utkarshdev2411/Student_Payemnts_Dasboard_backend)
- **Technology**: Node.js + Express.js
- **Deployment**: Azure Web Services



---

## 📝 Project Overview

The Student Payments Dashboard is a modern, full-stack web application designed to streamline the management of student payment transactions. It provides real-time monitoring, comprehensive analytics, and seamless integration with external payment gateways.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based user authentication system
- 💳 **Payment Management** - Create and track payment requests
- 📊 **Real-time Analytics** - Live transaction statistics and insights
- 🔄 **Auto-refresh** - Automatic data updates every minute
- 📱 **Responsive Design** - Mobile-first, responsive user interface
- 🔍 **Advanced Filtering** - Filter transactions by status, date, school, etc.
- 📄 **Pagination** - Efficient data loading with pagination
- 🎯 **Status Tracking** - Real-time payment status updates via webhooks
- 📈 **Dashboard Stats** - Transaction success rates and volume metrics

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.9.1
- **Styling**: Tailwind CSS 4.1.13
- **HTTP Client**: Axios 1.12.2
- **Form Handling**: React Hook Form 7.62.0
- **Validation**: Joi 18.0.1

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.18.1
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.2
- **Validation**: Joi 18.0.1
- **CORS**: cors 2.8.5

### Development Tools
- **Frontend Dev Server**: Vite
- **Backend Dev Server**: Nodemon
- **Linting**: ESLint
- **Version Control**: Git

---

## 🚀 Project Setup Instructions

### Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas)
- **Git**

### Backend Setup

1. **Clone the backend repository**
   ```bash
   git clone https://github.com/utkarshdev2411/Student_Payemnts_Dasboard_backend.git
   cd Student_Payemnts_Dasboard_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/student_payments
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student_payments

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=8000
   NODE_ENV=development

   # Payment Gateway Configuration
   PG_KEY=your_payment_gateway_secret_key
   SCHOOL_ID=your_school_id

   # Webhook Configuration
   WEBHOOK_BASE_URL=http://localhost:8000
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The backend server will be available at `http://localhost:8000`

### Frontend Setup

1. **Clone the frontend repository**
   ```bash
   git clone https://github.com/utkarshdev2411/Student_Payemnts_Dasboard_frontend.git
   cd Student_Payemnts_Dasboard_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend application will be available at `http://localhost:5173`

---

## 🔐 Login Credentials

After setting up the project, you can use the following pre-configured accounts to access the dashboard:

### Default User Accounts

| Username | Password | Description |
|----------|----------|-------------|
| `admin` | `password123` | Main administrator account with full access |
| `school_admin` | `school123` | School administrator account |
| `test_user` | `test123` | Test user account for development |

### Usage Instructions

1. **Start the application** using the setup instructions above
2. **Navigate** to the frontend URL: `http://localhost:5173`
3. **Login** using any of the credentials above
4. **Access** the dashboard to view transactions, create payments, and manage data

### Creating New Users

You can also register new users by:
- Clicking "Register" on the login page
- Using the registration API endpoint: `POST /api/auth/register`

### Database Seeding

The project includes a seeder that creates:
- ✅ **3 user accounts** (listed above)
- ✅ **100 sample orders** with realistic student data
- ✅ **100 transaction records** with various payment statuses
- ✅ **Multiple school IDs** for testing filtering functionality

To seed the database:
```bash
cd Student_Payemnts_Dasboard_backend
npm run seed
```

To clear the database:
```bash
npm run seed:destroy
```

---

## 🏗️ Frontend Architecture

### Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── CheckStatusModal.jsx        # Modal for checking payment status
│   ├── CreatePaymentModal.jsx      # Modal for creating new payments
│   ├── DashboardStats.jsx          # Statistics display component
│   ├── FilterBar.jsx               # Transaction filtering interface
│   ├── NotificationContainer.jsx   # Global notifications container
│   ├── NotificationToast.jsx       # Individual toast notifications
│   ├── Pagination.jsx              # Pagination controls
│   ├── ProtectedRoute.jsx          # Route protection wrapper
│   ├── StatsCard.jsx               # Individual statistic card
│   └── TransactionTable.jsx        # Main transaction data table
├── context/              # React Context providers
│   ├── AuthContext.jsx             # Authentication state management
│   └── NotificationContext.jsx     # Notification system management
├── hooks/                # Custom React hooks
│   ├── useAuth.js                  # Authentication hook
│   ├── useNotification.js          # Notification hook
│   └── useTransactions.js          # Transaction data hook
├── pages/                # Page components
│   ├── Dashboard.jsx               # Main dashboard page
│   ├── Login.jsx                   # User login page
│   └── Register.jsx                # User registration page
├── api/                  # API integration
│   ├── client.js                   # Axios client configuration
│   └── endpoints.js                # API endpoint definitions
├── styles/               # CSS stylesheets
│   ├── animations.css              # Animation definitions
│   ├── auth.css                    # Authentication page styles
│   └── notifications.css           # Notification system styles
├── utils/                # Utility functions
├── constants/            # Application constants
│   └── notifications.js            # Notification type constants
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
```

### Page Flow and Navigation

#### 1. Authentication Flow
- **Route**: `/login` and `/register`
- **Components**: `Login.jsx`, `Register.jsx`
- **Purpose**: User authentication with JWT token management
- **Flow**: Login → Store JWT → Redirect to Dashboard

#### 2. Dashboard Flow
- **Route**: `/` (Protected)
- **Components**: `Dashboard.jsx` + multiple child components
- **Features**:
  - Real-time transaction monitoring
  - Advanced filtering and search
  - Payment creation
  - Statistical analytics
  - Auto-refresh capabilities

### State Management

#### Context Providers

1. **AuthContext**
   - Manages user authentication state
   - Handles login/logout operations
   - Provides user information across components

2. **NotificationContext**
   - Manages application-wide notifications
   - Supports multiple notification types (success, error, info, warning)
   - Auto-dismiss functionality

#### Custom Hooks

1. **useAuth**
   - Abstracts authentication logic
   - Provides login, logout, and user state
   - Handles token management

2. **useTransactions**
   - Manages transaction data fetching
   - Handles filtering, pagination, and sorting
   - Provides loading states

3. **useNotification**
   - Simplifies notification creation
   - Provides type-specific notification methods

### API Integration

The frontend communicates with the backend through a centralized API client:

```javascript
// API Client Configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic token attachment
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔧 Backend Architecture

### API Endpoint Structure

#### Authentication Endpoints

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| POST | `/api/auth/register` | Create new user account | None |
| POST | `/api/auth/login` | Authenticate user | None |

#### Payment Management Endpoints

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| POST | `/api/payments/create-payment` | Create new payment request | JWT Required |

#### Transaction Endpoints

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| GET | `/api/transactions` | Get all transactions (paginated) | JWT Required |
| GET | `/api/transactions/stats` | Get transaction statistics | JWT Required |
| GET | `/api/transactions/school/:schoolId` | Get school-specific transactions | JWT Required |
| GET | `/api/transactions/status/:collectId` | Check specific transaction status | JWT Required |

#### Webhook Endpoints

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| POST | `/api/webhook` | Receive payment gateway updates | None |
| GET | `/api/webhook/logs` | Get webhook logs (debugging) | JWT Required |

### Database Schema

#### User Model
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Model
```javascript
{
  _id: ObjectId (serves as collect_id),
  school_id: String (required),
  trustee_id: String,
  student_info: {
    name: String (required),
    id: String (required),
    email: String (required)
  },
  gateway_name: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### OrderStatus Model
```javascript
{
  collect_id: ObjectId (ref: Order, unique),
  order_amount: Number (required),
  transaction_amount: Number,
  payment_mode: String (enum),
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String (enum: pending, success, failed, cancelled, refunded),
  error_message: String,
  payment_time: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### WebhookLog Model
```javascript
{
  payload: Object (full webhook data),
  status: String (processed/failed),
  received_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Middleware Architecture

#### 1. Authentication Middleware
```javascript
// JWT token validation
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify JWT and attach user to request
};
```

#### 2. Validation Middleware
```javascript
// Joi schema validation
const validateCreatePayment = (req, res, next) => {
  const { error } = createPaymentSchema.validate(req.body);
  // Handle validation errors
};
```

#### 3. CORS Configuration
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://student-payemnts-dasboard-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
```

### Controller Logic

#### Payment Controller
- Creates payment requests
- Integrates with external payment gateway
- Generates JWT signatures for gateway communication
- Handles payment URL generation

#### Transaction Controller
- Aggregates order and status data
- Implements pagination and filtering
- Provides statistical calculations
- Handles real-time status checks

#### Webhook Controller
- Processes payment gateway callbacks
- Updates transaction statuses
- Logs all webhook events
- Handles payment completion flow

---

## 📊 Database Design & Architecture

### ER Diagram

```mermaid
erDiagram
    User ||--o{ Order : "creates"
    Order ||--|| OrderStatus : "has"
    Order ||--o{ WebhookLog : "generates"
    
    User {
        ObjectId _id PK
        string username UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    
    Order {
        ObjectId _id PK
        string school_id
        string trustee_id
        object student_info
        string gateway_name
        datetime createdAt
        datetime updatedAt
    }
    
    OrderStatus {
        ObjectId _id PK
        ObjectId collect_id FK
        number order_amount
        number transaction_amount
        string payment_mode
        string payment_details
        string bank_reference
        string payment_message
        string status
        string error_message
        datetime payment_time
        datetime createdAt
        datetime updatedAt
    }
    
    WebhookLog {
        ObjectId _id PK
        object payload
        string status
        datetime received_at
        datetime createdAt
        datetime updatedAt
    }
```

### Data Flow Architecture

```mermaid
graph TD
    A[Frontend Dashboard] -->|API Requests| B[Express Server]
    B -->|JWT Validation| C[Auth Middleware]
    C -->|Valid Request| D[Route Handler]
    D -->|Database Query| E[(MongoDB)]
    E -->|Query Result| D
    D -->|JSON Response| A
    
    F[Payment Gateway] -->|Webhook| G[Webhook Endpoint]
    G -->|Update Status| E
    G -->|Log Event| H[WebhookLog Collection]
    
    I[User] -->|Create Payment| A
    A -->|Payment Request| J[Payment Controller]
    J -->|Gateway API Call| F
    F -->|Payment URL| J
    J -->|Payment URL| A
    A -->|Redirect| F
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style E fill:#e8f5e8
    style F fill:#fff3e0
```

---

## 🔄 Frontend-Backend Communication Flow

### Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>DB: Validate user
    DB-->>B: User data
    B->>B: Generate JWT
    B-->>F: JWT token + user info
    F->>F: Store token in localStorage
    F-->>U: Redirect to dashboard
```

### Payment Creation Flow
```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant PG as Payment Gateway
    
    A->>F: Fill payment form
    F->>B: POST /api/payments/create-payment
    B->>DB: Create Order record
    B->>DB: Create OrderStatus record
    B->>PG: Create payment request
    PG-->>B: Payment URL
    B-->>F: Payment URL + collect_id
    F-->>A: Display payment link
```

### Real-time Status Updates Flow
```mermaid
sequenceDiagram
    participant S as Student
    participant PG as Payment Gateway
    participant B as Backend
    participant DB as Database
    participant F as Frontend
    
    S->>PG: Complete payment
    PG->>B: POST /api/webhook (status update)
    B->>DB: Update OrderStatus
    B->>DB: Log webhook event
    B-->>PG: 200 OK
    
    Note over F: Auto-refresh every 1 minute
    F->>B: GET /api/transactions
    B->>DB: Fetch updated transactions
    DB-->>B: Transaction data
    B-->>F: Updated transaction list
    F->>F: Update UI with new status
```

---

## 🔧 API Documentation

### Request/Response Examples

#### Authentication

**POST** `/api/auth/login`
```json
// Request
{
  "username": "admin",
  "password": "password123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "60d5ecb8b8b9c72a1c8e4567",
    "username": "admin"
  }
}
```

#### Create Payment

**POST** `/api/payments/create-payment`
```json
// Request
{
  "order_amount": "2000",
  "callback_url": "https://your-frontend.com/payment-status",
  "student_info": {
    "name": "John Doe",
    "id": "STU123",
    "email": "john.doe@example.com"
  }
}

// Response (200 OK)
{
  "payment_url": "https://payment.gateway.com/pay/xyz123",
  "collect_id": "60d5ecb8b8b9c72a1c8e4567"
}
```

#### Get Transactions

**GET** `/api/transactions?page=1&limit=10&status=success&sortBy=payment_time&order=desc`
```json
// Response (200 OK)
{
  "data": [
    {
      "collect_id": "60d5ecb8b8b9c72a1c8e4567",
      "student_name": "John Doe",
      "student_id": "STU123",
      "student_email": "john.doe@example.com",
      "school_id": "SCHOOL001",
      "order_amount": 2000,
      "transaction_amount": 2000,
      "status": "success",
      "payment_mode": "upi",
      "payment_time": "2024-01-15T10:30:00.000Z",
      "bank_reference": "UPI123456789",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "limit": 10
  }
}
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   ```

3. **Build Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

### Backend Deployment (Azure Web Services)

1. **Azure App Service Configuration**
   - Create new App Service
   - Configure Node.js runtime
   - Set up continuous deployment

2. **Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/production_db
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   PORT=80
   ```

3. **Database Setup**
   - MongoDB Atlas cluster
   - Production database configuration
   - Network access whitelist

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd Student_Payemnts_Dasboard_backend
npm test

# Frontend tests
cd Student_Payemnts_Dasboard_frontend
npm test
```

### Test Coverage

- Unit tests for controllers
- API endpoint testing
- Component testing
- Integration tests
- E2E testing scenarios

---

## 🤝 Contributing

1. **Fork the repositories**
2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit changes**
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request**

---



*Last updated: September 2025*