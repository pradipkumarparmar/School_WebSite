# 🏫 ધોતા પેકેન્દ્ર સ્કૂલ — School Website

A full-stack responsive and animated school website for sharing events, notices, and information with the public, plus an admin panel for content management.

**Tech Stack:** React (Vite) + Node.js/Express + MySQL

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v16 or higher | [nodejs.org](https://nodejs.org) |
| **MySQL** | v8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| **npm** | v8+ | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Clone or Navigate to The Project

```bash
cd d:\Learning\Resume
```

### Step 2: Set Up MySQL Database

1. **Open MySQL client** (MySQL Workbench, command line, or phpMyAdmin)

2. **Run the schema file** to create the database and tables:
   ```bash
   mysql -u root -p < server/schema.sql
   ```
   Or open `server/schema.sql` in MySQL Workbench and execute it.

3. This creates:
   - `dhota_school` database
   - `admins` table (admin users)
   - `events` table (school events)
   - `notices` table (school notices)
   - `gallery` table (photo gallery)
   - `contacts` table (contact form submissions)

### Step 3: Configure Backend

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Edit the `.env` file** with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=dhota_school
   JWT_SECRET=dhota_school_secret_key_2024_secure
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Seed the database** (creates admin user + sample data):
   ```bash
   npm run seed
   ```
   This creates:
   - Admin user: `username: admin`, `password: admin123`
   - Sample events, notices, and gallery items

5. **Start the server:**
   ```bash
   npm start
   ```
   Server runs at `http://localhost:5000`

### Step 4: Set Up Frontend

1. **Open a new terminal** and navigate to client folder:
   ```bash
   cd d:\Learning\Resume\client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

### Step 5: Access the Website

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Public Website (Homepage) |
| `http://localhost:5173/events` | Events Page |
| `http://localhost:5173/notices` | Notices Page |
| `http://localhost:5173/gallery` | Gallery Page |
| `http://localhost:5173/about` | About Page |
| `http://localhost:5173/contact` | Contact Page |
| `http://localhost:5173/admin/login` | Admin Login |
| `http://localhost:5173/admin` | Admin Dashboard |

---

## 📁 Project Structure

```
├── server/                     # Backend (Node.js + Express)
│   ├── server.js               # Express entry point
│   ├── db.js                   # MySQL connection pool
│   ├── seed.js                 # Database seeder
│   ├── schema.sql              # MySQL schema
│   ├── .env                    # Environment variables
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   └── routes/
│       ├── auth.js             # Login API
│       ├── events.js           # Events CRUD
│       ├── notices.js          # Notices CRUD
│       ├── gallery.js          # Gallery CRUD
│       └── contacts.js         # Contacts + Stats
│
├── client/                     # Frontend (React + Vite)
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # App with routing
│       ├── index.css           # Global styles + animations
│       ├── components/
│       │   ├── Navbar.jsx      # Responsive navigation
│       │   ├── Footer.jsx      # Site footer
│       │   └── AdminSidebar.jsx # Admin sidebar nav
│       ├── pages/
│       │   ├── Home.jsx        # Homepage
│       │   ├── Events.jsx      # Events listing
│       │   ├── Notices.jsx     # Notices listing
│       │   ├── Gallery.jsx     # Photo gallery
│       │   ├── About.jsx       # About page
│       │   └── Contact.jsx     # Contact form
│       └── admin/
│           ├── Login.jsx       # Admin login
│           ├── Dashboard.jsx   # Dashboard stats
│           ├── ManageEvents.jsx
│           ├── ManageNotices.jsx
│           ├── ManageGallery.jsx
│           └── ManageContacts.jsx
│
└── README.md                   # This file
```

---

## 🔧 How to Use

### Public Website
- **Homepage**: Animated hero section, latest events, recent notices
- **Events**: Browse all school events with images and details
- **Notices**: View notices with priority levels (urgent, high, medium, low)
- **Gallery**: Photo gallery with category filters and lightbox
- **About**: School information, statistics, facilities
- **Contact**: Submit enquiries via contact form

### Admin Panel
1. Go to `/admin/login`
2. Login with: `username: admin`, `password: admin123`
3. **Dashboard**: View site statistics
4. **Manage Events**: Create, edit, delete events
5. **Manage Notices**: Create, edit, delete notices with priority
6. **Manage Gallery**: Add/delete gallery images
7. **Messages**: View and manage contact form submissions

---

## 🌐 Deployment Guide

### Option 1: VPS Deployment (DigitalOcean, AWS EC2, etc.)

1. **Set up server** (Ubuntu):
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install MySQL
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```

2. **Upload project** to server using Git or SCP

3. **Set up the database**:
   ```bash
   mysql -u root -p < server/schema.sql
   node server/seed.js
   ```

4. **Build frontend**:
   ```bash
   cd client && npm install && npm run build
   ```

5. **Configure server to serve built frontend** — add to `server.js`:
   ```js
   app.use(express.static(path.join(__dirname, '../client/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
   });
   ```

6. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name dhota-school
   pm2 save
   ```

7. **Set up Nginx** as reverse proxy:
   ```nginx
   server {
       server_name yourdomain.com;
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Railway + Vercel (Free Tier)

1. **Deploy Backend to Railway** (railway.app):
   - Connect your GitHub repo
   - Add MySQL service
   - Set environment variables
   - Deploy `server/` directory

2. **Deploy Frontend to Vercel** (vercel.com):
   - Connect your GitHub repo
   - Set root directory to `client/`
   - Add environment variable: `VITE_API_URL=your-railway-url`

### Option 3: Docker

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: dhota_school
    volumes:
      - ./server/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "3306:3306"

  server:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: dhota_school

  client:
    build: ./client
    ports:
      - "3000:3000"
```

---

## 🎨 Features

- ✅ **Responsive Design** — Works on mobile, tablet, and desktop
- ✅ **Dark Theme** — Premium dark gradient with glassmorphism
- ✅ **Animations** — Fade-in, slide, scale, float, and particle effects
- ✅ **Admin Panel** — Full CRUD for events, notices, gallery
- ✅ **JWT Auth** — Secure admin authentication
- ✅ **Gujarati Support** — Noto Sans Gujarati font for native text
- ✅ **Contact Form** — Public visitors can send messages
- ✅ **Gallery Lightbox** — Click-to-zoom image viewer
- ✅ **Priority Notices** — Urgent/High/Medium/Low levels
- ✅ **Category Filters** — Gallery filtering by category

---

## 🔐 Default Admin Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ **Important**: Change the default password after first login in production!

---

## 📞 Support

For any issues or questions about this website, contact the school administration.
