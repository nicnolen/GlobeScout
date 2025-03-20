import { Router } from 'express';
import { register, login, logout } from '../library/users';
import { refreshAccessToken } from '../utils/auth';

const router = Router();

// 🔹 Register a new user
router.post('/register', register);

// 🔹 Log in a user
router.post('/login', login);

// 🔹 Log out a user
router.post('/logout', logout);

// 🔹 Refresh access token
router.post('/refresh', refreshAccessToken);

export default router;
