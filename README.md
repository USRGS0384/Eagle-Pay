📌 Eagle Pay - Backend
🚀 Eagle Pay is a mobile money transfer system designed to facilitate secure and efficient financial transactions for individuals, businesses, NGOs, and institutions. This backend is built using Node.js, Express, MongoDB, and Redis to handle user authentication, deposits, withdrawals, transfers, commissions, and tax deductions.

📜 Table of Contents
📌 Eagle Pay - Backend
📜 Table of Contents
🚀 Features
📂 Project Structure
🛠️ Technologies Used
📦 Installation
⚙️ Environment Variables
🛠️ Running the Server
🔐 API Authentication
📡 API Endpoints
✅ Testing
📝 License
🚀 Features
✔️ User Authentication (Signup, Login, Logout)
✔️ Transaction Management (Deposit, Withdraw, Transfer, Balance Check)
✔️ Institution & Business Accounts (Schools, NGOs, Universities, Companies)
✔️ Commission & Tax Calculation (Automated deductions)
✔️ Notifications (Email & SMS Alerts)
✔️ Secure API with JWT Authentication
✔️ Optimized Performance with Redis Caching & MongoDB Indexing
✔️ Queue-based background processing (Bull for async jobs)

📂 Project Structure
bash
Copy
Edit
Eagle-Pay/
│── backend/
│   ├── src/
│   │   ├── config/            # Configuration files (db, redis, dotenv)
│   │   ├── controllers/       # Business logic for requests
│   │   ├── middleware/        # Authentication & error handling middleware
│   │   ├── models/            # Mongoose database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # External services (email, notifications, payments)
│   │   ├── utils/             # Helper functions (tax calculator, password hasher)
│   │   ├── app.js             # Express app setup
│   │   ├── server.js          # Server entry point
│   ├── package.json           # Dependencies and scripts
│   ├── .env                   # Environment variables
│   ├── .gitignore             # Ignore unnecessary files
│   ├── README.md              # Documentation
🛠️ Technologies Used
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Cache & Queue: Redis, Bull
Authentication: JWT, bcrypt
API Testing: Postman
Security: Helmet, CORS, Rate limiting
Logging: Winston
📦 Installation
1️⃣ Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/eaglepay-backend.git
cd eaglepay-backend
2️⃣ Install dependencies

bash
Copy
Edit
npm install
⚙️ Environment Variables
Create a .env file in the root directory and add the following:

env
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/eaglepaydb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
EMAIL_SERVICE_API=your_email_service_api
SMS_SERVICE_API=your_sms_service_api
🛠️ Running the Server
Start the backend server using:

bash
Copy
Edit
npm start
For development with nodemon:

bash
Copy
Edit
npm run dev
🔐 API Authentication
All protected routes require a Bearer Token in the request headers. Example:

json
Copy
Edit
{
  "Authorization": "Bearer your_jwt_token"
}
📡 API Endpoints
Endpoint	Method	Description	Auth Required
/api/auth/register	POST	Register a new user	❌ No
/api/auth/login	POST	User login & JWT token generation	❌ No
/api/auth/logout	POST	Logout & clear session	✅ Yes
/api/account/deposit	POST	Deposit money to wallet	✅ Yes
/api/account/withdraw	POST	Withdraw funds	✅ Yes
/api/account/transfer	POST	Transfer money to another account	✅ Yes
/api/account/balance	GET	Check account balance	✅ Yes
/api/transactions/history	GET	Get transaction history	✅ Yes
/api/institutions/register	POST	Register an institution	✅ Yes
✅ Testing
1️⃣ Run unit tests

bash
Copy
Edit
npm test
2️⃣ Test with Postman
Import the Postman Collection (available in the repo).

📝 License
This project is licensed under the MIT License.
