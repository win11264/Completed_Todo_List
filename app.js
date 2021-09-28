// const { sequelize } = require('./models');
// sequelize.sync({ force: true });

const express = require('express');
const cors = require('cors');
const listRoute = require('./routes/listRoute');
const authRoute = require('./routes/authRoute');

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
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: err.message });
  }
  res.status(500).json({ message: err.message });
});

app.listen(8003, () => console.log('server running on port 8003'));
