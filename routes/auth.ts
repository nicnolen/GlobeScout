import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, forgot, resetPassword, verify, verify2fa, toggle2fa } from '../library/auth';

const router = Router();

router.get('/verify', passport.authenticate('jwt', { session: false }), verify);

router.post('/register', passport.authenticate('jwt', { session: false }), register);

router.post('/login', login);

router.post('/verify-2fa', passport.authenticate('jwt', { session: false }), verify2fa);

router.post('/forgot', forgot);

router.post('/logout', logout);

router.put('/reset-password', resetPassword);

router.patch('/toggle-2fa', passport.authenticate('jwt', { session: false }), toggle2fa);

export default router;
