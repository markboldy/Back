import { Router } from 'express';

import { deleteUser, getAllUsers, getAuthUser, getUserByUserName, updateUser } from '../../handlers/user';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { upload } from '../../services/upload';

const router = Router();

/**
 * @openapi
 * /api/v1/users/:
 *  get:
 *    tags:
 *      - user
 *    description: Get users list
 *    responses:
 *      200:
 *        description: Users list
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/', requireJwtAuth, getAllUsers);
/**
 * @openapi
 * /api/v1/users/{userName}:
 *  get:
 *    tags:
 *      - user
 *    description: Get user by username
 *    parameters:
 *      - in: path
 *        name: userName
 *        schema:
 *          type: string
 *        required: true
 *        description: Username
 *    responses:
 *      200:
 *        description: User
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/user'
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/:username', requireJwtAuth, getUserByUserName);
router.get('/me', requireJwtAuth, getAuthUser);
/**
 * @openapi
 * /api/v1/users/{id}:
 *  patch:
 *    tags:
 *      - user
 *    description: Update user
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Update user
 *
 *    requestBody:
 *      description: Update user body
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              avatar:
 *                type: string
 *                format: binary
 *              name:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *          encoding:
 *            avatar:
 *              contentType: image/png, image/jpeg, image/jpg
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.patch('/:id', requireJwtAuth, upload.single('avatar'), updateUser);
/**
 * @openapi
 * /api/v1/users/{id}:
 *  delete:
 *    tags:
 *      - user
 *    description: Delete user
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Delete user
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.delete('/:id', requireJwtAuth, deleteUser);

export default router;
