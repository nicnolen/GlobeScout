import { Router } from 'express';
import passport from 'passport';
import { toggle2fa, toggle2faMethod, email2faCode, validate2fa } from '../library/2fa';

const router = Router();

router.patch('/toggle-2fa', passport.authenticate('jwt', { session: false }), toggle2fa);

router.patch('/toggle-2fa-method', passport.authenticate('jwt', { session: false }), toggle2faMethod);

router.post('/email-2fa-code', passport.authenticate('jwt', { session: false }), email2faCode);

router.post('/validate-2fa', passport.authenticate('jwt', { session: false }), validate2fa);

export default router;
