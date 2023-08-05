require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { handleError } = require('./middlewares/handleError');

const { routes } = require('./routes/route');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to database on ${DB_URL}`);
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.log(err);
  });

app.use(limiter);

app.use(helmet());

app.use('*', express.json());

app.use(routes);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
