import { Router } from 'express';
import { deleteCategory, getExpenseCategories, postNewCategory } from '../../handlers/expenseCategories';

const router = Router();

/**
 * @openapi
 * /api/v1/categories/:
 *  get:
 *    tags:
 *      - Expense category
 *    description: Get categories
 *    responses:
 *      200:
 *        description: Categories list
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                categories:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                      name:
 *                        type: string
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.get('/', getExpenseCategories);
/**
 * @openapi
 * /api/v1/categories/:
 *  post:
 *    tags:
 *      - Expense category
 *    description: Create expense category
 *    requestBody:
 *      description: Create expense category body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
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
router.post('/', postNewCategory);
/**
 * @openapi
 * /api/v1/categories/{id}:
 *  delete:
 *    tags:
 *      - Expense category
 *    description: Delete category by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *        required: true
 *        description: category ID
 *    responses:
 *      204:
 *        description: Category was successfully deleted
 *      401:
 *        $ref: '#/components/responses/401'
 *      500:
 *        $ref: '#/components/responses/500'
 */
router.delete('/:id', deleteCategory);

export default router;
