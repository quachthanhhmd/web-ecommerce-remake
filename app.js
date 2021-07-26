require('dotenv').config()

const seKey = process.env.SESSION_SECRET

//DB
const connectDB = require('./config/db')

connectDB();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const session = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

const MongoDBStore = require('connect-mongodb-session')(session);
const indexRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const shopRouter = require('./routes/shop');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');


const buyer = require('./routes/buyer');
const Cart = require('./models/cart.model');
const User = require('./models/user.model');

const { initCart } = require('./services/cart.service');

const {
  getResource,
  findBrandPopular
} = require('./services/Product.service');

const helper = require('./helpers/hbsHelper');

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));





app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(logger('dev'));
app.use(flash());

app.use(cookieParser(seKey));
app.use(express.static('public'));


//handlebars setting
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: `${__dirname}/views/pages/`,
  partialsDir: `${__dirname}/views/partials/`,
  handlebars: allowInsecurePrototypeAccess(handlebars),
  helpers: {
    select: helper.select,
    times: helper.times,
    dateFormat: helper.dateFormat,
    incremented: helper.incremented,
    renderStar: helper.renderStar
  },
});

app.set('view engine', "hbs");
app.engine('.hbs', hbs.engine);
//--------------------------------------

app.use(
  session({
    secret: seKey,
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({ uri: process.env.MONGO_URL, collection: 'sessions' }),
    cookie: {
      maxAge: 7 * 86400 * 1000, // a session cookie will last for 7 days

    },

  }),
);

app.use(passport.initialize());
app.use(passport.session());


app.use(async (req, res, next) => {
  var cart = new Cart(req.session.cart ? req.session.cart : initCart);

  req.session.cart = cart;


  res.locals.session = req.session;


  (req.app.locals.allType === undefined) && (req.app.locals.allType = await getResource());
  (req.app.locals.popularBrand === undefined) && (req.app.locals.popularBrand = await findBrandPopular());

  req.app.locals.user = req.user || null;

  next();
});

app.use('/', indexRouter);
app.use('/buyer', buyer);
app.use('/user', usersRouter);
app.use('/shop', shopRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter)
//app.use('/login', loginRouter);
//app.use('/signup', signUpRouter);





// pass passport for configuration
require('./config/passport')(passport);






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;