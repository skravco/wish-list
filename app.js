const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;

// Dummy in-memory database for users and wishlist items
let users = [];
let wishlistItems = [];

// Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      if (res) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  }
));

passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => {
  const user = users.find(u => u.username === username);
  done(null, user);
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

// Authentication middlewares
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { wishlistItems, user: req.user });
});

// Register Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  // Basic validation
  if (password !== confirmPassword) {
    return res.send('Passwords do not match');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.send('Error hashing password');
    
    users.push({ username, password: hashedPassword });
    res.redirect('/login');
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
  wishlistItems.push({ id: Date.now(), name, description, user: req.user.username });
  res.redirect('/');
});

app.get('/update/:id', isAuthenticated, (req, res) => {
  const item = wishlistItems.find(i => i.id == req.params.id && i.user === req.user.username);
  if (item) {
    res.render('update', { item });
  } else {
    res.status(404).send('Item not found or unauthorized access');
  }
});

app.post('/update/:id', isAuthenticated, (req, res) => {
  const { name, description } = req.body;
  const item = wishlistItems.find(i => i.id == req.params.id && i.user === req.user.username);
  if (item) {
    item.name = name;
    item.description = description;
  }
  res.redirect('/');
});

app.get('/delete/:id', isAuthenticated, (req, res) => {
  const itemIndex = wishlistItems.findIndex(i => i.id == req.params.id && i.user === req.user.username);
  if (itemIndex !== -1) {
    wishlistItems.splice(itemIndex, 1);
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

