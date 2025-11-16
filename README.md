# Code4Web - Design Template Marketplace

A modern web application where admins can upload design templates and users can purchase them.

## Features

- **Admin Dashboard**: Upload, edit, and manage design templates
- **User Marketplace**: Browse and purchase premium templates
- **Purchase Management**: Users can view and download their purchased templates
- **Modern UI**: Beautiful, responsive design built with React and Tailwind CSS
- **Authentication**: Secure login system with JWT tokens

## Admin Login

Default admin credentials:
- **Email**: `admin@code4web.com`
- **Password**: `admin123`

You can change these by setting environment variables:
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here

# Admin Credentials (optional - defaults provided)
ADMIN_EMAIL=admin@code4web.com
ADMIN_PASSWORD=admin123
```

### 3. Database Setup

Run the SQL scripts in the `db/` directory to set up your database:

1. `db/users.sql` - Creates users table
2. `db/templates.sql` - Creates templates and purchases tables

### 4. Start Development Server

```bash
npm run dev
```

This will start:
- API server on `http://localhost:3000`
- Vite dev server on `http://localhost:5173`

## Project Structure

```
├── api/                 # API endpoints
│   ├── _lib/           # Shared utilities
│   ├── login.js       # Login endpoint
│   ├── register.js    # Registration endpoint
│   ├── templates.js   # Template management
│   ├── purchases.js   # Purchase management
│   └── stats.js       # Admin statistics
├── db/                 # Database schemas
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   └── App.jsx        # Main app router
└── server/             # Development server
```

## Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/marketplace` - Browse templates (public)

### Protected Routes (Users)
- `/dashboard` - User dashboard
- `/dashboard/purchases` - User's purchased templates

### Protected Routes (Admin)
- `/admin` - Admin dashboard with template management

## API Endpoints

### Authentication
- `POST /api/login` - User/Admin login
- `POST /api/register` - User registration
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Templates
- `GET /api/templates` - List all templates (public)
- `POST /api/templates` - Create template (admin only)
- `GET /api/templates/:id` - Get single template
- `PUT /api/templates/:id` - Update template (admin only)
- `DELETE /api/templates/:id` - Delete template (admin only)

### Purchases
- `GET /api/purchases` - Get user's purchases
- `POST /api/purchases` - Purchase a template

### Statistics
- `GET /api/stats` - Get admin statistics

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express-style API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **Build Tool**: Vite

## License

MIT

