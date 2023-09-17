import { Router } from 'express';
import { createGroup, deleteGroupById, getAllGroups, getGroupById, patchGroupById } from '../../handlers/group';
import { addGroupMember, deleteGroupMember, getGroupMembers, patchGroupMember } from '../../handlers/members';
import { addGroupExpense, deleteGroupExpense, updateGroupExpense } from '../../handlers/expense';
import { getGroupHistory } from '../../handlers/history';

const router = Router();

// groups crud
/**
 * @openapi
 * /api/v1/groups/:
 *  get:
 *    tags:
 *      - Group
 *    description: Get groups list
 *    parameters:
 *    - in: query
 *      name: offset
 *      type: integer
 *      description: The number of items to skip before starting to collect the result set.
 *    - in: query
 *      name: limit
 *      type: integer
 *      description: The numbers of items to return.
 *    responses:
 *      200:
 *        description: Groups list
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                totalItems:
 *                  type: number
 *                items:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                      name:
 *                        type: string
 *                      background_color:
 *                        type: string
 *                        example: "#FFFFFF"
 *                      currency:
 *                        type: number
 *                      members_total:
 *                        type: number
 *                      total_spent:
 *                        type: number
 *                limit:
 *                  type: number
 *                totalPages:
 *                  type: number
 *                page:
 *                  type: number
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/', getAllGroups);
/**
 * @openapi
 * /api/v1/groups/{groupId}:
 *  get:
 *    tags:
 *      - Group
 *    description: Get group by ID
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *    responses:
 *      200:
 *        description: Group by ID
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  format: uuid
 *                name:
 *                  type: string
 *                background_color:
 *                  type: string
 *                  example: "#FFFFFF"
 *                currency:
 *                  type: string
 *                members:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                      name:
 *                        type: string
 *                      background_color:
 *                        type: string
 *                        example: "#FFFFFF"
 *                      avatar:
 *                        type: string
 *                membersTotal:
 *                  type: number
 *                total_spent:
 *                  type: number
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/:groupId', getGroupById);
/**
 * @openapi
 * /api/v1/groups/:
 *  post:
 *    tags:
 *      - Group
 *    description: Create group
 *    requestBody:
 *      description: Create group body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *              background_color:
 *                type: string
 *                example: "#FFFFFF"
 *                required: true
 *    responses:
 *      201:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.post('/', createGroup);
/**
 * @openapi
 * /api/v1/groups/{groupId}:
 *  patch:
 *    tags:
 *      - Group
 *    description: Update group by ID
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *    requestBody:
 *      description: Update group body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              background_color:
 *                type: string
 *                example: "#FFFFFF"
 *              currency:
 *                type: string
 *    responses:
 *      200:
 *        description: Group updated successfully
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.patch('/:groupId', patchGroupById);
/**
 * @openapi
 * /api/v1/groups/{groupId}:
 *  delete:
 *    tags:
 *      - Group
 *    description: Delete group by ID
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *    responses:
 *      204:
 *        description: Group was successfully deleted
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.delete('/:groupId', deleteGroupById);

// members crud
/**
 * @openapi
 * /{groupId}/members/:
 *  get:
 *    tags:
 *      - Member
 *    description: Get members of the group by ID
 *    parameters:
 *    - in: query
 *      name: offset
 *      type: integer
 *      description: The number of items to skip before starting to collect the result set.
 *    - in: query
 *      name: limit
 *      type: integer
 *      description: The numbers of items to return.
 *    - in: path
 *      name: groupId
 *      schema:
 *        type: number
 *      required: true
 *      description: Group ID
 *    responses:
 *      200:
 *        description: Members list
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                totalItems:
 *                  type: number
 *                items:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                      name:
 *                        type: string
 *                      background_color:
 *                        type: string
 *                        example: "#FFFFFF"
 *                      avatar:
 *                        type: string
 *                      total_spent:
 *                        type: number
 *                limit:
 *                  type: number
 *                totalPages:
 *                  type: number
 *                page:
 *                  type: number
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/:groupId/members', getGroupMembers);
/**
 * @openapi
 * /{groupId}/members/:
 *  post:
 *    tags:
 *      - Member
 *    description: Add member to the group
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *    requestBody:
 *      description: Add member to the group body
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *              background_color:
 *                type: string
 *                example: "#FFFFFF"
 *                required: true
 *              avatar:
 *                type: string
 *                format: binary
 *    responses:
 *      201:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.post('/:groupId/members', addGroupMember);
/**
 * @openapi
 * /{groupId}/members/{memberId}:
 *  patch:
 *    tags:
 *      - Member
 *    description: Update group by ID
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *      - in: path
 *        name: memberId
 *        schema:
 *          type: number
 *        required: true
 *        description: Member ID
 *    requestBody:
 *      description: Update member body
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              background_color:
 *                type: string
 *                example: "#FFFFFF"
 *              avatar:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Member updated successfully
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.patch('/:groupId/members/:memberId', patchGroupMember);
/**
 * @openapi
 * /{groupId}/members/{memberId}:
 *  delete:
 *    tags:
 *      - Member
 *    description: Delete member of the group by IDs
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *      - in: path
 *        name: memberId
 *        schema:
 *          type: number
 *        required: true
 *        description: Member ID
 *    responses:
 *      204:
 *        description: Member of the group was successfully deleted
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.delete('/:groupId/members/:memberId', deleteGroupMember);

// expenses crud
/**
 * @openapi
 * /{groupId}/expenses/:
 *  post:
 *    tags:
 *      - Expense
 *    description: Add expense to the group
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *    requestBody:
 *      description: Add expense to the group body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              memberId:
 *                type: string
 *                required: true
 *              amount:
 *                type: number
 *                required: true
 *              categoryId:
 *                type: string
 *                required: true
 *    responses:
 *      201:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.post('/:groupId/expenses', addGroupExpense);
/**
 * @openapi
 * /{groupId}/expenses/{expenseId}/:
 *  patch:
 *    tags:
 *      - Expense
 *    description: Update expense by ID
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *      - in: path
 *        name: expenseId
 *        schema:
 *          type: number
 *        required: true
 *        description: Expense ID
 *    requestBody:
 *      description: Update expense body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              memberId:
 *                type: string
 *              amount:
 *                type: number
 *              categoryId:
 *                type: string
 *    responses:
 *      200:
 *        description: Member updated successfully
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.patch('/:groupId/expenses/:expenseId', updateGroupExpense);
/**
 * @openapi
 * /{groupId}/expenses/{expenseId}/:
 *  delete:
 *    tags:
 *      - Expense
 *    description: Delete expenses by ID
 *    parameters:
 *      - in: path
 *        name: groupId
 *        schema:
 *          type: number
 *        required: true
 *        description: Group ID
 *      - in: path
 *        name: expenseId
 *        schema:
 *          type: number
 *        required: true
 *        description: Expense ID
 *    responses:
 *      204:
 *        description: Expense was successfully deleted
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.delete('/:groupId/expenses/:expenseId', deleteGroupExpense);

// history
/**
 * @openapi
 * /{groupId}/history/:
 *  get:
 *    tags:
 *      - History
 *    description: Get history list
 *    parameters:
 *    - in: query
 *      name: offset
 *      type: integer
 *      description: The number of items to skip before starting to collect the result set.
 *    - in: query
 *      name: limit
 *      type: integer
 *      description: The numbers of items to return.
 *    responses:
 *      200:
 *        description: Group history list
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                totalItems:
 *                  type: number
 *                items:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        format: uuid
 *                      name:
 *                        type: string
 *                      background_color:
 *                        type: string
 *                        example: "#FFFFFF"
 *                      total_spent:
 *                        type: number
 *                      avatar:
 *                        type: string
 *                      expenses:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              format: uuid
 *                            amount:
 *                              type: number
 *                            category:
 *                              type: object
 *                              properties:
 *                                _id:
 *                                  type: string
 *                                  format: uuid
 *                                name:
 *                                  type: string
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                limit:
 *                  type: number
 *                totalPages:
 *                  type: number
 *                page:
 *                  type: number
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/:groupId/history', getGroupHistory)

export default router;
