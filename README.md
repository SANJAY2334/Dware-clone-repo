# DWARE Dashboard Assessment

## Overview
The **DWARE Dashboard Assessment** is a professional web-based application that provides an interactive and user-friendly dashboard. The project follows a structured and maintainable architecture, ensuring scalability and efficiency. The authentication system is fully functional with login and signup flows, and users are redirected to the dashboard upon successful login.

## Features
- **Authentication System**: Login/Signup with redirection to the dashboard.
- **Dashboard**: A professional UI displaying key analytics and insights.
- **Query Designer**: Create, manage, and execute database queries.
- **Database Comparison**: Compare different databases and analyze differences.
- **Professional UI/UX**: Light-themed, modern design with Tailwind CSS.
- **Scalability**: Maintainable project structure for future enhancements.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (`>=16.x` recommended)
- MongoDB (Cloud/Local)

### Steps

1. **Clone the repository**  
   ```sh
   git clone https://github.com/your-repo/dware-dashboard.git
   cd dware-dashboard
   ```

2. **Install dependencies**  
   - Frontend:
     ```sh
     cd frontend
     npm install
     ```
   - Backend:
     ```sh
     cd backend
     npm install
     ```

3. **Set up environment variables**  
   - Create a `.env` file in the `backend` directory and add:  
     ```env
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_secret_key
     ```

4. **Run the development servers**  
   - Backend:
     ```sh
     cd backend
     npm run dev
     ```
   - Frontend:
     ```sh
     cd frontend
     npm run dev
     ```

## Usage
- Open `http://localhost:5173` (or the provided Vite dev URL) in your browser.
- Register/Login to access the dashboard.
- Use the Query Designer to create and test queries.
- Perform database comparisons and analyze results.

## Project Structure

```
dware-dashboard/
│── backend/                # Express server
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Entry point
│── frontend/               # React + Vite project
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Pages (Dashboard, Auth, etc.)
│   │   ├── context/        # Global state (Auth, Data)
│   │   ├── App.jsx         # Main app component
│   ├── vite.config.js      # Vite configuration
│── README.md               # Project documentation
│── package.json            # Dependencies and scripts
```

## Future Enhancements
- Real-time scheduling and notifications.
- AI-driven query suggestions.
- More integrations with external databases.

## License
This project is licensed under the MIT License.

---


