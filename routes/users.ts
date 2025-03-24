import { Router } from 'express';
import passport from 'passport';
import { getCurrentUser } from '../library/users';

const router = Router();

router.get('/user', passport.authenticate('jwt', { session: false }), getCurrentUser);

export default router;
