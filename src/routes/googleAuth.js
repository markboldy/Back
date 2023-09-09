import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/google:
 *  get:
 *    tags:
 *      - Authentication via Third party services
 *    description: Authenticate to the application using Google OAuth 2.0
 *    responses:
 *      301:
 *        description: Redirect to the page to authenticate via google
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const token = req.user.generateJWT();
    res.header('x-auth-token', token);
    res.redirect(clientUrl);
  },
);

export default router;
