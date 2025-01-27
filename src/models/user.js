const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT } = require('../config/serverConfig');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, SALT);
    next();
});

userSchema.methods.comparePassword = function compare(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.genJWT = function generate() {
    return jwt.sign({id: this._id, email: this.email}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}

const User = mongoose.model('User', userSchema);

export default User;