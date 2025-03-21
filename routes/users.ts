import { Router } from 'express';
import { register, login, logout } from '../library/users';
import { refreshAccessToken } from '../utils/auth';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshAccessToken);

export default router;
