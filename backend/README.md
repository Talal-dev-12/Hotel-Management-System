# 🏨 LuxuryStay Hospitality - Hotel Management System Backend

A production-ready, scalable backend API for Hotel Management System built with MERN Stack.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Manager, Receptionist, Housekeeping, Guest)
  - Secure password hashing with bcrypt
  - Token refresh mechanism

- **User Management**
  - CRUD operations for staff and guests
  - User activation/deactivation
  - Profile management

- **Room Management**
  - Room inventory management
  - Real-time availability tracking
  - Room status updates (Available, Occupied, Cleaning, Maintenance)
  - Room type categorization

- **Reservation & Booking**
  - Availability checking
  - Booking creation and management
  - Check-in/check-out workflow
  - Booking cancellation

- **Billing & Invoices**
  - Automated invoice generation
  - Multiple payment methods
  - Service charge tracking
  - Tax calculations

- **Housekeeping & Maintenance**
  - Task assignment and tracking
  - Priority-based task management
  - Real-time status updates

- **Feedback & Reviews**
  - Guest feedback collection
  - Rating system
  - Response management

- **Reports & Analytics**
  - Occupancy reports
  - Revenue analytics
  - Booking statistics
  - Dashboard summary

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── env.js             # Environment configuration
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Room.js            # Room model
│   │   ├── Reservation.js     # Reservation model
│   │   ├── Invoice.js         # Invoice model
│   │   ├── Task.js            # Task model
│   │   └── Feedback.js        # Feedback model
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roomController.js
│   │   ├── reservationController.js
│   │   ├── invoiceController.js
│   │   ├── taskController.js
│   │   ├── feedbackController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── invoiceRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── reportRoutes.js
│   ├── middlewares/
│   │   ├── auth.js            # Authentication middleware
│   │   ├── error.js           # Error handler
│   │   ├── asyncHandler.js    # Async wrapper
│   │   └── validate.js        # Validation middleware
│   ├── validations/
│   │   ├── authValidation.js
│   │   └── reservationValidation.js
│   ├── utils/
│   │   └── errorResponse.js   # Custom error class
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Guest",
  "phone": "1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Guest"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer 
```

### Rooms

#### Get All Rooms
```http
GET /api/rooms?page=1&limit=10&roomType=Suite&status=Available
```

#### Check Available Rooms
```http
GET /api/rooms/available?roomType=Deluxe
```

#### Create Room (Admin/Manager)
```http
POST /api/rooms
Authorization: Bearer 
Content-Type: application/json

{
  "roomNumber": "101",
  "roomType": "Suite",
  "price": 150,
  "floor": 1,
  "capacity": {
    "adults": 2,
    "children": 1
  },
  "amenities": ["WiFi", "TV", "AC"],
  "description": "Luxury suite with ocean view"
}
```

### Reservations

#### Check Availability
```http
POST /api/reservations/check-availability
Content-Type: application/json

{
  "checkInDate": "2025-02-01",
  "checkOutDate": "2025-02-05",
  "roomType": "Suite"
}
```

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer 
Content-Type: application/json

{
  "guestId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "roomId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "checkInDate": "2025-02-01",
  "checkOutDate": "2025-02-05",
  "numberOfGuests": {
    "adults": 2,
    "children": 1
  },
  "totalAmount": 600,
  "advancePayment": 200
}
```

#### Check-in Guest
```http
PUT /api/reservations/:id/check-in
Authorization: Bearer 
```

#### Check-out Guest
```http
PUT /api/reservations/:id/check-out
Authorization: Bearer 
```

### Invoices

#### Generate Invoice
```http
POST /api/invoices
Authorization: Bearer 
Content-Type: application/json

{
  "reservationId": "60f7b3b3b3b3b3b3b3b3b3b5",
  "serviceCharges": [
    {
      "serviceName": "Room Service",
      "amount": 50,
      "quantity": 2
    }
  ],
  "taxes": {
    "gst": 18,
    "serviceTax": 10
  },
  "discount": 20
}
```

### Tasks

#### Create Task
```http
POST /api/tasks
Authorization: Bearer 
Content-Type: application/json

{
  "roomId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "taskType": "Cleaning",
  "priority": "High",
  "assignedTo": "60f7b3b3b3b3b3b3b3b3b3b6",
  "description": "Deep cleaning required"
}
```

#### Get My Tasks (Housekeeping)
```http
GET /api/tasks/my-tasks?status=Pending
Authorization: Bearer 
```

### Feedback

#### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer 
Content-Type: application/json

{
  "reservationId": "60f7b3b3b3b3b3b3b3b3b3b5",
  "rating": {
    "overall": 5,
    "cleanliness": 5,
    "service": 4,
    "amenities": 5,
    "valueForMoney": 4
  },
  "comment": "Excellent stay!",
  "wouldRecommend": true
}
```

### Reports

#### Get Occupancy Report
```http
GET /api/reports/occupancy?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer 
```

#### Get Revenue Report
```http
GET /api/reports/revenue?startDate=2025-01-01&endDate=2025-01-31&groupBy=month
Authorization: Bearer 
```

#### Get Dashboard Summary
```http
GET /api/reports/dashboard
Authorization: Bearer 
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent DDoS attacks
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Input Validation** - Joi validation
- **Error Handling** - Centralized error management

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, all reports |
| **Manager** | Room management, reservations, staff tasks, reports |
| **Receptionist** | Reservations, check-in/out, invoices, room status |
| **Housekeeping** | View and update assigned tasks |
| **Guest** | View own bookings, submit feedback, view invoices |

## 🧪 Testing

```bash
# Run tests
npm test
```

## 📊 Performance

- Response time: < 2 seconds
- Supports concurrent connections
- Database indexing for fast queries
- Pagination for large datasets

## 🐛 Error Handling

All errors are handled centrally and return consistent JSON responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## 📝 Environment Variables

See `.env` file for all configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

LuxuryStay Hospitality Development Team

## 📞 Support

For support, email support@luxurystay.com or create an issue in the repository.