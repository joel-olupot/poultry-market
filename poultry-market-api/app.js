require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');

// routes
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const itemsRouter = require('./routes/items');
const profileRouter = require('./routes/profile');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const summaryRouter = require('./routes/summary');
const salesRouter = require('./routes/sales');
const statusRouter = require('./routes/status');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const authenticateUser = require('./middleware/authentication');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Logging middleware for debugging
// app.use((req, res, next) => {
//   console.log(`Request IP: ${req.ip}, Request URL: ${req.originalUrl}`);
//   next();
// });

app.get('/', (req, res) => {
  res.send('Products API');
});

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', authenticateUser, productsRouter);
app.use('/api/v1/items', itemsRouter);
app.use('/api/v1/profile', authenticateUser, profileRouter);
app.use('/api/v1/cart', authenticateUser, cartRouter);
app.use('/api/v1/order', authenticateUser, orderRouter);
app.use('/api/v1/orders/summary', authenticateUser, summaryRouter);
app.use('/api/v1/orders/sales', authenticateUser, salesRouter);
app.use('/api/v1/orders/status', authenticateUser, statusRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
