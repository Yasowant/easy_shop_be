const express = require('express');

const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utiles/db');

app.use(
  cors({
    origin: 'https://easy-shop-fe-ixtv.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ensure all needed methods are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Ensure these headers are allowed
    credentials: true, // Ensure credentials are allowed
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));

const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log(`Server is running on port ${port}`));
