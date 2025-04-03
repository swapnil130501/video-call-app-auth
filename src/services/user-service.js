const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { JWT_KEY } = require('../config/serverConfig');
const { REFRESH_TOKEN_SECRET } = require('../config/serverConfig');

const  UserRepository  = require('../repository/user-repository');

class UserService{
    constructor(){
        this.userRepository = new UserRepository();
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async deleteUser(userId, token){
        try {
            const user = await this.userRepository.getById(userId);
            if(!user){
                throw {error: 'User not found'};
            }
            let verificationResponse = this.verifyToken(token);
            if(!verificationResponse){
                throw {error: 'Token verification error'};
            }
            await this.userRepository.destroy(userId);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, data){
        try {
            const user = await this.userRepository.getById(userId);
            if(!user){
                throw {error: 'User not found'};
            }

            const response = await this.userRepository.update(userId, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const user = await this.userRepository.getById(userId);
        
            if (!user) {
                throw new Error('User not found');
            }

             return user;

        } catch (error) {
            throw error;
        }
    } 
    
    async getAllUsers() {
        try {
           
            const users = this.userRepository.getAll();
            return users;
             
        } catch (error) {
            throw error;
        }
    } 

    async signIn(email, plainPassword) {
        try {
            // step 1-> fetch the user using the email
            const user = await this.userRepository.getByEmail(email);
            // step 2-> compare incoming plain password with stored encrypted password
            const passwordsMatch = this.checkPassword(plainPassword, user.password);

            if(!passwordsMatch) {
                console.log("Password doesn't match");
                throw {error: 'Incorrect password'};
            }
            // step 3-> if passwords match then create a token and send it to the user
            const { accessToken, refreshToken } = this.createToken({ email: user.email, id: user.id });
            return { accessToken, refreshToken }; 
        } catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async refreshToken(oldRefreshToken) {
        try {
            const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);

            const user = this.userRepository.getById(decoded.userId);

            const newAccessToken = jwt.sign(
                { userId: user.id },
                JWT_KEY,
                { expiresIn: '15m' }
            );
            
            return newAccessToken;

        } catch (error) {
            console.log("Something went wrong in refresh token process", error);
            throw { error: "Invalid or expired refresh token" };
        }
    }

    async isAuthenticated(token) {
        try {
            const response = await this.verifyToken(token);
            if (!response) {
                return {
                    success: false,
                    data: null,
                    message: 'Invalid token',
                };
            }
    
            const user = await this.userRepository.getById(response.id);
            if (!user) {
                return {
                    success: false,
                    data: null,
                    message: 'No user with corresponding token exists',
                };
            }
    
            return {
                success: true,
                userId: user.id, // Return the user ID in the data field
                message: 'User is authenticated and token is valid',
            };
        } catch (error) {
            console.log('Something went wrong in authentication:', error.message);
            return {
                success: false,
                data: null,
                message: 'Internal server error during authentication',
            };
        }
    }

    createToken(user) {
        try {
            const accessToken = jwt.sign(
                { userId: user.id },
                JWT_KEY,
                { expiresIn: '1m' }
            );
    
            const refreshToken = jwt.sign(
                { userId: user.id },
                REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );
    
            return { accessToken, refreshToken };
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
        }
    }

    verifyToken(token, type = 'access') {
        try {
            const secret = type === 'access' ? JWT_KEY : REFRESH_TOKEN_SECRET;
            return jwt.verify(token, secret);
        } catch (error) {
            console.log("Something went wrong in token validation", error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password comparison");
            throw error;
        }
    }

}

module.exports = UserService;