import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, forgot, resetPassword, verify } from '../library/auth';

const router = Router();

router.get('/verify', passport.authenticate('jwt', { session: false }), verify);

router.post('/register', passport.authenticate('jwt', { session: false }), register);

router.post('/login', login);

router.post('/forgot', forgot);

router.post('/reset-password', resetPassword);

router.post('/logout', passport.authenticate('jwt', { session: false }), logout);

export default router;
