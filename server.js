const express = require('express');
const connectDB = require('./config/db')

const app = express();
const PORT = process.env.PORT || 5000;

// connect database
connectDB()

// Initialize middleware-to get data from User.js req.body
app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
  res.send('API running');
});

// Define routes. yung /api/users e yung sa http un
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
