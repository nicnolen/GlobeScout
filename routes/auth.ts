import { Router } from 'express';
import { register, login, logout } from '../library/auth';
import { refreshAccessToken, authenticateJWT, authorizeRole } from '../utils/auth';

const router = Router();

router.post('/register', authenticateJWT, authorizeRole(['admin']), register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', authenticateJWT, refreshAccessToken);

export default router;
