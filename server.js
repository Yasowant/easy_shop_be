const express = require('express');

const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utiles/db');

app.use(
  cors({
    origin: ['https://easy-shop-fe-ixtv.vercel.app'], // Ensure only the deployed frontend URL is added
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Ensure cookies are allowed across origins
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));

const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log(`Server is running on port ${port}`));
