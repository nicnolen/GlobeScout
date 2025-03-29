import { Router } from 'express';
import passport from 'passport';
import {
    register,
    login,
    logout,
    forgot,
    resetPassword,
    verify,
    validate2fa,
    toggle2fa,
    toggle2faMethod,
} from '../library/auth';

const router = Router();

router.get('/verify', passport.authenticate('jwt', { session: false }), verify);

router.post('/register', passport.authenticate('jwt', { session: false }), register);

router.post('/login', login);

router.post('/validate-2fa', passport.authenticate('jwt', { session: false }), validate2fa);

router.post('/forgot', forgot);

router.post('/logout', logout);

router.put('/reset-password', resetPassword);

router.patch('/toggle-2fa', passport.authenticate('jwt', { session: false }), toggle2fa);

router.patch('/toggle-2fa-method', passport.authenticate('jwt', { session: false }), toggle2faMethod);

export default router;
