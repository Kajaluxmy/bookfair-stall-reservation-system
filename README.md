# Bookfair Stall Reservation System

A full-stack, real-time web application designed to manage bookfair stall reservations for both vendors and administrators.

This system supports stall booking, manual payment submission, admin approval workflows, QR-based event access, refund handling, real-time notifications, and machine learning based genre prediction.

---

## System Overview

The Bookfair Stall Reservation System enables vendors to book stalls for events while allowing administrators to manage approvals, payments, analytics, and vendor activities.

The system ensures:

- Secure authentication and role-based access
- Real-time stall availability updates
- Manual payment verification
- QR code-based event validation
- Deadline-based cancellation rules
- Machine learning driven genre recommendations

---

## Vendor / Customer Features

### Stall Booking

- Book up to 3 stalls per event
- Cannot book more than 3 events at the same time
- Real-time interactive stall map
- Automatic total cost calculation

---

### Advance Payment

- 10 percent advance payment required
- Manual payment submission without online gateway
- Booking initially marked as Pending Approval
- Admin must approve participation

---

### Email and QR Code

Vendors receive:

- Booking confirmation email
- QR code for event access
- Status update emails such as Approved, Rejected, Refunded, or Cancelled

QR code is used for entry validation during the event.

---

### Cancellation and Refund Policy

- Refund allowed only if cancellation is requested more than 7 days before the event
- Countdown timer shown in My Reservations
- Cancel button hidden after deadline

When vendor cancels:

- Booking marked as Cancelled
- Admin processes refund manually
- Vendor receives refund confirmation email

---

### Machine Learning Based Genre Prediction

The system includes a Python based machine learning module that:

- Analyzes historical vendor booking data
- Evaluates genre popularity
- Predicts best performing genres
- Suggests optimal genre categories during booking

#### Machine Learning Model Details

- Algorithm: Supervised learning such as Logistic Regression or Decision Tree
- Input Features:
  - Vendor booking history
  - Past selected genres
  - Event type
  - Genre popularity metrics
- Output:
  - Ranked genre recommendations
  - Probability score per genre

The machine learning service is integrated via REST API between Spring Boot and Python.

---

## Admin Features

### Dashboard

- Total events
- Total vendors
- Total bookings
- Revenue overview
- Pending approvals
- Refund requests
- Real-time activity notifications

---

### Event Management

- Create events
- Update event details
- Delete events
- Configure stall layouts
- Block specific stalls
- Set cancellation deadlines

---

### Vendor Management

- View vendor profiles
- View vendor booking details
- Approve or reject participation
- Process refunds
- Remove vendors if necessary

---

### Site Settings

- Configure payment rules
- Manage refund policies
- Manage email templates
- Update system configurations

---

### Analytics and Reports

- Genre popularity analysis
- Participation statistics
- Revenue tracking
- Refund statistics
- Vendor activity monitoring
- Machine learning based recommendation insights

---

## Technology Stack

### Frontend
- React using Vite
- Tailwind CSS
- WebSocket for real-time updates

### Backend
- Spring Boot
- JWT authentication
- Role-based access control
- REST APIs
- WebSocket integration

### Machine Learning
- Python
- Scikit-learn
- REST API integration

### Database
- MySQL
- Transaction-safe booking logic
- Foreign key constraints

### Tools and Services
- Email notification service
- QR code generation
- Postman for API testing

---

## Workflow

1. Vendor registers or logs in  
2. Browse available events  
3. Select up to 3 stalls  
4. Submit 10 percent advance payment details  
5. Booking marked as Pending Approval  
6. Admin reviews and approves or rejects  
7. Vendor receives QR code  
8. Vendor may cancel before deadline which is 7 days prior  
9. Admin processes refund if applicable  

---

## Real-Time Features

The system uses WebSockets to ensure:

- Live stall availability updates
- Instant booking status changes
- Real-time notification counts
- Live admin dashboard updates

No page refresh required.

---

## Security Features

- JWT-based authentication
- Password hashing
- Role-based endpoint protection
- Server-side deadline validation
- Input validation and sanitization
- Prevention of duplicate stall bookings

---

## Project Scope

This system is suitable for:

- Book fairs
- Trade exhibitions
- Academic events
- Vendor markets
- Stall-based reservation systems

---

## Conclusion

The Bookfair Stall Reservation System is a scalable and secure platform that combines:

- Full-stack web development
- Real-time system architecture
- Manual payment verification workflow
- Administrative approval control
- Machine learning based genre prediction

It is suitable for both academic final-year projects and real-world deployment.
