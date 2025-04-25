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
## Video Demonstration 
**Link:https://teams.microsoft.com/l/meetingrecap?driveId=b%21eYpthG79n02aNFrwXfsgkN7aoYhwNK9MvObaBJsJjP1kOFKZ8B-6Ravo0SdG97YA&driveItemId=01RZC7KT5RRNSPIJNT7BEI4TYRQ5HHLDSI&sitePath=https%3A%2F%2Fmresult-my.sharepoint.com%2F%3Av%3A%2Fp%2Fsanjay_r%2FEbGLZPQls_hIjk8Rh051jkgBx36UmzXQcvpNcLAWBBbkGg&fileUrl=https%3A%2F%2Fmresult-my.sharepoint.com%2F%3Av%3A%2Fp%2Fsanjay_r%2FEbGLZPQls_hIjk8Rh051jkgBx36UmzXQcvpNcLAWBBbkGg&iCalUid=040000008200e00074c5b7101a82e0080000000060765fd3a7b5db0100000000000000001000000056ece2077ff4f447af79e1b1ceba3334&threadId=19%3Ameeting_ZGU2OTkwODItN2E4MC00ZWQ3LTg0OTUtNjY1NjE4YzlmNGY1%40thread.v2&organizerId=f2d8e7db-c8f3-428f-b223-23a57af114a3&tenantId=50381707-2c5c-4612-9aad-5f66f950e629&callId=ab3234ff-725d-430c-b7d1-a285b963bed5&threadType=Meeting&meetingType=Scheduled&subType=RecapSharingLink_RecapChiclet**


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


