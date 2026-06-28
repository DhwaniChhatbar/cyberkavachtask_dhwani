🛡️ CyberKavach

A full-stack event management + attendance + approval workflow system built for colleges, featuring role-based access, real-time updates, certificates, points system, and audit logging.

🚀 Features
👤 Authentication & Users
Register / Login system
Role-based access:
Student
Tech Coordinator
Faculty Coordinator
Content / Social Media Coordinator
Admin / Member
Secure JWT authentication
📅 Event Management
Create events (Tech Coordinator)
Multi-stage approval flow:
Draft → Faculty Review → Approved → Published
Update / Delete (restricted after approval)
Registration system for users
📍 Attendance System
Check-in / Check-out system
Team-based participation support
Duration tracking
Dashboard analytics:
Total attendance
Late entries
Early exits
Average duration
🧾 Requests Workflow
Multi-role approval chain:
Tech → Student → Faculty
Approve / Reject system
Timeline tracking
Real-time updates via Socket.IO
🏆 Points & Rewards
Assign points to users
Category-based scoring
Badge evaluation system
Points history tracking
🎓 Certificates
Auto/manual certificate generation
Unique certificate ID + SHA256 hash verification
Team & individual certificates
Verification endpoint
📊 Audit Logging
Full system activity tracking:
Events created / updated / published
Attendance actions
Requests approval/rejection
Points assigned
Central audit trail for transparency
🔔 Notifications & Real-time
Socket.IO integration
Live updates for:
Requests
Attendance
Event updates
In-app notifications system
🛠️ Tech Stack
Backend
Node.js
Express.js
MongoDB + Mongoose
Socket.IO
JWT Authentication
Frontend
React.js
Tailwind CSS
Axios
React Router
📁 Project Structure
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── utils/
 ├── middleware/
 └── server.js

frontend/
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── services/
 │   └── App.js
⚙️ Installation
1. Clone repo
git clone https://github.com/your-username/cyberkavach.git
cd cyberkavach
2. Backend setup
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=5000

Run backend:

npm run dev
3. Frontend setup
cd frontend
npm install
npm start
🔐 Authentication Flow
User registers with role + college details
JWT token generated on login
Token stored in localStorage
Protected routes validate token + role
📡 Real-time Features
Socket.IO used for:
Live attendance updates
Request status updates
Event changes
📊 API Highlights
Auth
POST /api/auth/register
POST /api/auth/login
Events
POST /events
GET /events
PUT /events/:id
DELETE /events/:id
Attendance
POST /attendance/checkin
POST /attendance/checkout
GET /attendance/event/:id
Requests
POST /requests
PUT /requests/:id/approve
PUT /requests/:id/reject
🧠 Key Concepts Used
Role-based access control (RBAC)
Multi-stage approval workflow
Audit logging system
Real-time event updates
Aggregation pipelines (MongoDB)
Secure authentication (JWT)
🎯 Future Improvements
Email notifications
Mobile app (React Native)
Advanced analytics dashboard
QR-based attendance
AI-based fraud detection in attendance
👨‍💻 Author

Built by Chhatbar Dhwani
