const express = require('express');
const UserController = require('../../controllers/user-controller');
const router = express.Router();

router.post(
    '/signup', 
    UserController.create
);
router.post(
    '/signin',
    UserController.signIn
);

router.get(
    '/isAuthenticated',
    UserController.isAuthenticated,
);

router.patch(
    '/user/update/:id', 
    UserController.updateUser
);

router.delete(
    '/user/delete/:id', 
    UserController.deleteUser
);

router.get(
    '/user/:id',
    UserController.fetchUser
);

router.get(
    '/users',
    UserController.fetchAllUsers
);

module.exports = router;