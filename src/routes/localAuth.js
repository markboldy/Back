import { Router } from 'express';
import Joi from 'joi';

import User from '../models/User';
import requireLocalAuth from '../middleware/requireLocalAuth';
import { registerSchema } from '../services/validators';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *  post:
 *    tags:
 *      - Authentication
 *    description: Login to the application
 *    requestBody:
 *      description: Login body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Auth token and user
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/user'
 *                token:
 *                  type: string
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.post('/login', requireLocalAuth, (req, res) => {
  const token = req.user.generateJWT();
  const user = req.user.toJSON();
  res.json({ token, user });
});

/**
 * @openapi
 * /api/v1/auth/register:
 *  post:
 *    tags:
 *      - Authentication
 *    description: Register to the application
 *    requestBody:
 *      description: Register body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *              username:
 *                type: string
 *                required: true
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.post('/register', async (req, res, next) => {
  const { error } = Joi.validate(req.body, registerSchema);
  if (error) {
    return res.status(422).send({ message: error.details[0].message });
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ message: 'Email is in use' });
    }

    try {
      const newUser = await new User({
        provider: 'email',
        email,
        password,
        username,
        name,
        avatar: `avatar_placeholder.png`,
      });

      newUser.registerUser(newUser, (err, user) => {
        if (err) throw err;
        res.status(200).json({ message: 'Register success.' });
      });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200);
});

export default router;
