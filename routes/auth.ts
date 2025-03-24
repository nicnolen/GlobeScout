import { Router } from 'express';
import passport from 'passport';
import { register, login, logout } from '../library/auth';
import { refreshAccessToken } from '../utils/authUtils';

const router = Router();

router.post('/register', passport.authenticate('jwt', { session: false }), register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', passport.authenticate('jwt', { session: false }), refreshAccessToken);

export default router;
