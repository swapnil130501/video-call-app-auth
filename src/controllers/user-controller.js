const  UserService  = require('../services/user-service');

const userService = new UserService();

const create = async (req, res) => {
    try {
        const response = await userService.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });
        return res.status(201).json({
            data: response,
            message: 'Sucessfully created a new user',
            sucess: true,
            err: {}
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data: {},
            message: 'Something went wrong',
            sucess: false,
            err: error
        });
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await userService.signIn(email, password);

        const { accessToken, refreshToken } = response;
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,  
            secure: true, 
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({
            success: true,
            data: response,
            err: {},
            message: 'Successfully signed in'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error
        });
    }
}

async function generateRefreshToken(req, res) {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        const newAccessToken = await userService.refreshToken(refreshToken);

        return res.status(200).json({
            success: true,
            data: { accessToken: newAccessToken },
            message: "Successfully generated new access token",
        });

    } catch (error) {
        console.log("Error in refreshing token:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token",
            success: false,
        });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const token = req.header('x-access-token');
        const response = await userService.isAuthenticated(token);
        return res.status(200).json({
            success: true,
            data: response,
            err: {},
            message: 'User is authenticated and token is valid'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.deleteUser(req.params.id, token);
        return res.status(200).json({
            data: response,
            message: "Successfully deleted User",
            err: {},
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: "Cannot delete User",
            err: error,
            success: false
        });
    }
}

const updateUser = async (req, res) => {
    try {
        // const token = req.headers['x-access-token'];
        const response = await userService.updateUser(req.params.id, req.body);
        return res.status(200).json({
            data: response,
            message: "Successfully updated User",
            err: {},
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: "Cannot update User",
            err: error,
            success: false
        });
    }
}

const fetchUser = async (req, res) => {
    try {
        const response = await userService.getUser(req.params.id);
        const { email, id } = response; // Destructuring email and id from response
        return res.status(200).json({
            email, // Shorthand property name: equivalent to email: email
            id,    // Shorthand property name: equivalent to id: id
            message: "Successfully fetched the User",
            err: {},
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: "Cannot fetch the User",
            err: error,
            success: false
        });
    }
}


const fetchAllUsers = async (req, res) => {
    try {
        // const token = req.headers['x-access-token'];
        const response = await userService.getAllUsers();
        return res.status(200).json({
            data: response,
            message: "Successfully fetched the User",
            err: {},
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: "Cannot fetch the User",
            err: error,
            success: false
        });
    }
}

module.exports = {
    create,
    signIn,
    isAuthenticated,
    deleteUser,
    updateUser,
    fetchUser,
    fetchAllUsers,
    generateRefreshToken
}