const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./src/config/db');
const userRoutes = require('./src/routes/user.route')

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(morgan('dev'));
app.get('/', (req, res) => {
    res.send('Welcome to my ClassSignupAndLogin API');
});

app.use('/api/v1/user', userRoutes)

app.listen(port, ()=> {
    connectDb();
    console.log(`Server is running on port ${port}`);
})