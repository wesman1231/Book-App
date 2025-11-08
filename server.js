require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./Backend/routes/authRoutes');
const bookshelfRoutes = require('./Backend/routes/bookshelfRoutes');
const requireLogin = require('./Backend/middleware/requireLogin');
const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');

const app = express();   // <-- create app first
const port = process.env.PORT || 3000;

// ✅ Trust proxy for HTTPS behind Railway
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://yourreadingcorner.com',
    'https://book-app-production-343e.up.railway.app'
  ],
  credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Static files
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/scripts', express.static(path.join(__dirname, '/scripts')));

// Routes
app.use('/', authRoutes);
app.use('/', bookshelfRoutes);

// Page Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/html', 'index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '/html', 'sign-up.html')));
app.get('/verify', (req, res) => res.sendFile(path.join(__dirname, '/html', 'verify-email.html')));
app.get('/home', requireLogin, (req, res) => res.sendFile(path.join(__dirname, '/html', 'home.html')));
app.get('/bookshelf', requireLogin, (req, res) => res.sendFile(path.join(__dirname, '/html', 'your-bookshelf.html')));
app.get('/your-favorite-authors', requireLogin, (req, res) => res.sendFile(path.join(__dirname, '/html', 'your-favorite-authors.html')));
app.get('/find-new-books', requireLogin, (req, res) => res.sendFile(path.join(__dirname, '/html', 'find-new-books.html')));
app.get('/forgot-password', (req, res) => res.sendFile(path.join(__dirname, '/html', 'forgot-password.html')));
app.get('/changePassword', (req, res) => res.sendFile(path.join(__dirname, '/html', 'change-password.html')));

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server live at https://book-app-production-343e.up.railway.app`);
});
