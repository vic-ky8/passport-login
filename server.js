const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const ejs= require ('ejs');
//const ejsLint = require('ejs-lint');
//const dotenv = require("dotenv").config();
const app = express();
//require("dotenv").config();
// Passport Config
require('./config/passport.js')(passport);

// DB Config
const db = require('./config/keys.js').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

/*mongoose.connect(process.env.mongoURI, {useNewUrlParser:true});
    
const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open',()=>console.log ('db connected'));
*/
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
