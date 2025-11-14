# Smart India Hackathon (SIH) Portal

A comprehensive web application for managing the Smart India Hackathon (SIH) competition, including SPOC registration, team management, problem statement submission, and idea evaluation.

## 🚀 Features

### For Administrators
- Verify SPOC registrations
- Create and manage problem statements
- View all submissions
- Manage competition settings

### For SPOCs (Single Point of Contact)
- Register with nomination PDF upload
- Register teams from their institution
- View team submissions
- Track team progress

### For Team Leaders
- Browse available problem statements
- Submit ideas and abstracts
- View submission history
- Manage team information

### Public Features
- View all problem statements
- Browse competition guidelines
- Learn about the hackathon

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React** - UI framework
- **React Router** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd RSIH
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sih_db
DB_USER=your_db_user
DB_PASS=your_db_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

ADMIN_PASSWORD=yourpassword
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE sih_db;
```

Initialize the database tables:

```bash
cd backend
npm run init-db
```

This will:
- Create all required tables
- Add a default admin user:
  - Email: `your_email`
  - Password: `your_password`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📁 Project Structure

```
RSIH/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Database schema
│   ├── routes/          # API routes
│   ├── scripts/         # Database initialization scripts
│   ├── uploads/         # Uploaded files storage
│   └── index.js         # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── assets/      # Static assets
│   └── public/          # Public assets
│
└── README.md
```

## 🔐 Default Credentials

After running `npm run init-db`:

**Admin Account:**
- Email: `your_email`
- Password: `your_password`

⚠️ **Important:** Change the default admin password after first login!

## 📡 API Endpoints

### Public Endpoints
- `GET /api/public/ps` - Get all problem statements

### Authentication
- `POST /api/auth/register-spoc` - Register as SPOC
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register user

### Admin Routes (Protected)
- `GET /api/admin/spocs` - Get all SPOCs
- `PUT /api/admin/spoc/:id/verify` - Verify SPOC
- `GET /api/admin/ps` - Get all problem statements
- `POST /api/admin/ps` - Create problem statement
- `PUT /api/admin/ps/:id` - Update problem statement
- `DELETE /api/admin/ps/:id` - Delete problem statement
- `GET /api/admin/submissions` - Get all submissions

### SPOC Routes (Protected)
- `GET /api/spoc/college` - Get my college info
- `GET /api/spoc/teams` - Get my teams
- `POST /api/spoc/team` - Register new team
- `GET /api/spoc/team/:id/submission` - Check team submission

### Team Routes (Protected)
- `GET /api/team/team` - Get my team info
- `GET /api/team/ps` - Get open problem statements
- `POST /api/team/submit` - Submit idea
- `GET /api/team/submissions` - Get my submissions

## 🔑 User Roles

1. **ADMIN** - Full system access
2. **SPOC** - Institution representative (requires verification)
3. **TEAM_LEADER** - Team leader (can submit ideas)

## 📝 Usage Flow

1. **SPOC Registration**
   - SPOC registers with institution details and nomination PDF
   - Admin verifies the SPOC registration
   - Verified SPOC can register teams

2. **Team Registration**
   - SPOC registers teams from their institution
   - Each team gets a team leader account

3. **Problem Statement Selection**
   - Team leaders browse available problem statements
   - Select a problem statement

4. **Idea Submission**
   - Team leader submits idea with title and abstract
   - Submission is reviewed by admin

5. **Evaluation**
   - Admin reviews all submissions
   - Winners are selected

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- File upload validation
- SQL injection protection with parameterized queries

## 📦 Build for Production

### Backend
```bash
cd backend
npm install --production
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `.env` file has correct database credentials
- Verify database exists

### Port Already in Use
- Change `PORT` in backend `.env` file
- Update frontend `api.js` baseURL accordingly

### File Upload Issues
- Ensure `uploads` directories have write permissions
- Check file size limits (default: 10MB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- RSIH Development Team

## 🙏 Acknowledgments

- Smart India Hackathon (SIH) initiative
- All contributors and testers

---

**Note:** This is a project for managing the Smart India Hackathon competition. Make sure to configure environment variables and database settings before running in production.
