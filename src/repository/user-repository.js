const User = require('../models/user'); // Import the Mongoose User model

class UserRepository {
    async create(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw error;
        }
    }

    async destroy(userId) {
        try {
            await User.findByIdAndDelete(userId);
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw error;
        }
    }

    async getById(userId) {
        try {
            const user = await User.findById(userId).select('email id');
            return user;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw error;
        }
    }

    async getAll() {
        try {
            const users = await User.find().select('email id');
            return users;
        } catch (error) {
            console.error('Something went wrong in the repository layer:', error);
            throw error;
        }
    }

    async update(userId, data) {
        try {
            const user = await User.findByIdAndUpdate(userId, data, {
                new: true, // Return the updated document
                runValidators: true, // Validate the data before updating
            });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw error;
        }
    }

    async getByEmail(userEmail) {
        try {
            const user = await User.findOne({ email: userEmail });
            return user;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw error;
        }
    }
}

module.exports = UserRepository;
