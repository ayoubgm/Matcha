const router = require('express').Router();
const tagController = require('../controllers/tag.controller');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 *
 * tags:
 *   name: Tags
 *   description: All about /api/tags
 */

router.get('/list', tagController.tagsList );

module.exports = router;

/**
 * @swagger
 * /api/tags/list:
 *   get:
 *     summary: Load tags list
 *     description: get informations about tags
 *     tags:
 *       - Tags
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Successfull operation or not
 *                 data:
 *                   type: array
 *                   description: array of tags
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the tag
 *                       name:
 *                         type: string
 *                         description: name of the tag
 *               example:
 *                 success: true,
 *                 data:
 *                   - id: 1
 *                     name: "42"
 *                   - id: 2
 *                     name: "1337"
 *                   - id: 3
 *                     name: "cats"
 *                   - id: 4
 *                     name: "dogs"
 *                   - id: 5
 *                     name: "books"
 *                   - id: 6
 *                     name: "-42"
 *                      
 */