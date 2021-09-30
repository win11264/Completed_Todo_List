// const { sequelize } = require('./models');
// sequelize.sync({ force: true });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const listRoute = require('./routes/listRoute');
const authRoute = require('./routes/authRoute');
const errorController = require('./controllers/errorController');

const app = express();

// middleware cors: allow access cross origin sharing
app.use(cors());
app.use(express.json());

// list route
app.use('/lists', listRoute);
// authenticate route
app.use('/', authRoute);

// path not found handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'resource not found on this server' });
});

// error handling middleware
app.use(errorController);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server running on port ${port}`));
