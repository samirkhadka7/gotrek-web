# Hike Hub - Web Development Backend

Hike Hub is a comprehensive web application designed for hiking enthusiasts. It provides a platform for users to discover trails, join hiking groups, track their activities, and connect with other hikers. The backend is built with Node.js and Express, and it offers a robust REST API to support a client-facing application.

## Features

* **User Authentication:** Secure user registration and login with JWT-based authentication.
* **Google OAuth:** Users can also sign up or log in using their Google accounts.
* **Trail Management:** Admins can create, read, update, and delete hiking trails. Users can view and search for trails with various filters.
* **Group Management:** Users can create and manage hiking groups, and other users can request to join these groups.
* **User Profile Management:** Users can view and update their profiles, including their hiking stats and profile picture.
* **Admin Dashboard:** A comprehensive admin dashboard to manage users, trails, and groups.
* **Payment Integration:** Supports payments through eSewa for subscriptions.
* **AI Chatbot:** An intelligent chatbot powered by Google's Generative AI to assist users with their queries about trails and groups.
* **Real-time Chat:** Real-time chat functionality within hiking groups using Socket.io.
* **Checklist Generator:** A tool to generate hiking checklists based on experience, duration, and weather conditions.
* **Analytics:** Provides analytics on user growth, revenue, and hiking activities.

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT), Passport.js for Google OAuth
* **Real-time Communication:** Socket.IO
* **File Uploads:** Multer
* **AI:** Google Generative AI (Gemini)
* **Testing:** Jest, Supertest
* **Environment Variables:** dotenv

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB
* npm (or yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/amanch3/hike_hub_web_development_backend.git](https://github.com/amanch3/hike_hub_web_development_backend.git)
    cd hike_hub_web_development_backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    SECRET=<your_jwt_secret>
    PORT=5050
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    API_URL=http://localhost:5050/api
    FRONTEND_URL=http://localhost:5173
    ESEWA_MERCHANT_CODE=<your_esewa_merchant_code>
    ESEWA_SECRET_KEY=<your_esewa_secret_key>
    GEMINI_API_KEY=<your_gemini_api_key>
    ```

### Running the Application

* **Development mode:**
    ```bash
    npm run dev
    ```
    This will start the server with nodemon, which automatically restarts the server on file changes.

* **Production mode:**
    ```bash
    npm start
    ```

* **Running tests:**
    ```bash
    npm test
    ```

## API Endpoints

A brief overview of the available API endpoints:

* `POST /api/auth/register`: Register a new user.
* `POST /api/auth/login`: Log in an existing user.
* `GET /api/trail`: Get a list of all trails.
* `POST /api/trail/create`: Create a new trail (admin only).
* `GET /api/group`: Get a list of all groups.
* `POST /api/group/create`: Create a new group.
* `GET /api/user`: Get a list of all users (admin only).
* `POST /api/v1/chatbot/query`: Interact with the AI chatbot.

For a detailed list of all endpoints, please refer to the `routers` directory.

## Folder Structure
hike_hub_web_development_backend/
├── config/
│   └── db.js               # Database connection
├── controllers/
│   ├── admin/              # Controllers for admin-specific actions
│   ├── userManagement.js   # User registration and login
│   ├── ...                 # Other controller files
├── data/
│   └── checklistData.js    # Data for the checklist generator
├── middlewares/
│   ├── auth.middleware.js  # Authentication and authorization
│   ├── fileUpload.js       # File upload handling
│   └── ...                 # Other middleware
├── models/
│   ├── user.model.js       # User schema
│   ├── trail.model.js      # Trail schema
│   ├── group.model.js      # Group schema
│   └── ...                 # Other Mongoose models
├── routers/
│   ├── admin/              # Routers for admin-specific endpoints
│   ├── auth.routers.js     # Authentication routes
│   └── ...                 # Other route files
├── test/
│   └── ...                 # Test files
├── uploads/                # Directory for uploaded files
├── utils/
│   └── ...                 # Utility functions
├── .gitignore
├── index.js                # Main application entry point
├── package.json
└── README.md
