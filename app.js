const flash = require("connect-flash");
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3
const app = express();
const port = process.env.PORT || 3000;

// Set up SQLite Database (persistent)
const db = new sqlite3.Database('./wishlist.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create users and wishlist tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return done(err);
      if (!row) return done(null, false, { message: 'Incorrect username.' });
      
      bcrypt.compare(password, row.password, (err, res) => {
        if (err) return done(err);
        if (res) {
          return done(null, row);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    done(err, row);
  });
});

// Middleware setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware to expose flash messages to templates
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Authentication middlewares
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    db.all('SELECT * FROM wishlist_items WHERE user_id = ?', [req.user.id], (err, rows) => {
      if (err) return res.status(500).send('Error retrieving wishlist items');
      res.render('index', { wishlistItems: rows, user: req.user });
    });
  } else {
    res.redirect('/login');
  }
});

// Register Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    return res.send('Passwords do not match');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.send('Error hashing password');
    
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword, function(err) {
      if (err) return res.status(500).send('Error registering user');
      res.redirect('/login');
    });
  });
});

// Login Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Wishlist Routes
app.get('/add', isAuthenticated, (req, res) => {
  res.render('add');
});

app.post('/add', isAuthenticated, (req, res) => {
  const { name, description } = req.body;
  const stmt = db.prepare('INSERT INTO wishlist_items (name, description, user_id) VALUES (?, ?, ?)');
  stmt.run(name, description, req.user.id, (err) => {
    if (err) return res.status(500).send('Error adding item');
    res.redirect('/');
  });
});

app.get('/update/:id', isAuthenticated, (req, res) => {
  const itemId = req.params.id;
  db.get('SELECT * FROM wishlist_items WHERE id = ? AND user_id = ?', [itemId, req.user.id], (err, row) => {
    if (err) return res.status(500).send('Error fetching item');
    if (!row) return res.status(404).send('Item not found or unauthorized');
    res.render('update', { item: row });
  });
});

app.post('/update/:id', isAuthenticated, (req, res) => {
  const { name, description } = req.body;
  const itemId = req.params.id;
  const stmt = db.prepare('UPDATE wishlist_items SET name = ?, description = ? WHERE id = ? AND user_id = ?');
  stmt.run(name, description, itemId, req.user.id, (err) => {
    if (err) return res.status(500).send('Error updating item');
    res.redirect('/');
  });
});

app.get('/delete/:id', isAuthenticated, (req, res) => {
  const itemId = req.params.id;
  const stmt = db.prepare('DELETE FROM wishlist_items WHERE id = ? AND user_id = ?');
  stmt.run(itemId, req.user.id, (err) => {
    if (err) return res.status(500).send('Error deleting item');
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

