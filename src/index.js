const express = require('express');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes/index');
const { connect } = require('./config/database');
const cors = require('cors');

const { PORT } = require('./config/serverConfig');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,          
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running' 
    });
});

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`);
    await connect();
    console.log('MongoDB connected');
});
