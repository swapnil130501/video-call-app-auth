const mongoose = require('mongoose');

const connect = async () => {
    await mongoose.connect('mongodb://127.0.0.1/video-call-app');
};

module.exports = { connect };
