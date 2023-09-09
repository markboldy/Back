import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/facebook:
 *  get:
 *    tags:
 *      - Authentication via Third party services
 *    description: Authenticate to the application using Facebook OAuth 2.0
 *    responses:
 *      301:
 *        description: Redirect to the page to authenticate via facebook
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  }),
);

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    // console.log(req.user);
    const token = req.user.generateJWT();
    res.header('x-auth-token', token);
    res.redirect(clientUrl);
  },
);

export default router;
