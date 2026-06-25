//1. Get List of tasks

/**
 * @openapi
 * /api/getTasks:
 *   get:
 *     summary: Retrieve a list of all the tasks in the database
 *     description: Returns an array containing all relevant tasks from the PostgreSQL tasks table.
 *     responses:
 *       200:
 *         description: A successful response returning an array of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Setup Express Server"
 *                   description:
 *                     type: string
 *                     example: "Initialize project and install dependencies"
 *                   status:
 *                     type: string
 *                     example: "PENDING"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-06-24T16:00:00.000Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-06-24T16:05:00.000Z"
 *                   created_by:
 *                     type: integer
 *                     example: 1
 *                   assigned_by:
 *                     type: integer
 *                     example: 2
 *
 *       404:
 *         description: Not Found. The tasks resource or database table could not be located.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tasks list not found."
 *       500:
 *         description: Internal server error.
 */

//2: Create Task API
/**
 * @openapi
 * /api/createTask:
 *   post:
 *     summary: Create a new task
 *     description: Inserts a new task into the tasks table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Setup Express Server"
 *               description:
 *                 type: string
 *                 example: "Initialize project and install dependencies"
 *               status:
 *                 type: string
 *                 example: "PENDING"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               assigned_by:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task created successfully"
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Setup Express Server"
 *                     description:
 *                       type: string
 *                       example: "Initialize project and install dependencies"
 *                     status:
 *                       type: string
 *                       example: "PENDING"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-24T16:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-24T16:05:00.000Z"
 *                     created_by:
 *                       type: integer
 *                       example: 1
 *                     assigned_by:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Title and description are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Title and description are required fields"
 *       409:
 *         description: Task already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

//3. Update Task list using existing ID

/**
 * @openapi
 * /api/editTask/{id}:
 *   put:
 *     summary: Update an existing task by ID
 *     description: Updates the title, description, status, and assigned user of a task based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the task to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Task Title"
 *               description:
 *                 type: string
 *                 example: "Updated task description"
 *               status:
 *                 type: string
 *                 example: "IN_PROGRESS"
 *               assigned_by_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Updated Task Title"
 *                     description:
 *                       type: string
 *                       example: "Updated task description"
 *                     status:
 *                       type: string
 *                       example: "IN_PROGRESS"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-24T16:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-24T17:00:00.000Z"
 *                     created_by_id:
 *                       type: integer
 *                       example: 1
 *                     assigned_by_id:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid task ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid task ID."
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to update task."
 */

//4. Delete Tasks using ID
/**
 * @openapi
 * /api/deleteTask/{id}:
 *   delete:
 *     summary: Delete an existing task by ID
 *     description: Permanently removes a task from the system based on its unique database ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the task to delete.
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully."
 *       400:
 *         description: Invalid task ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid task ID."
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to delete task."
 */

//5.To update task status

/**
 * @openapi
 * /api/editStatusOfTask/{id}:
 *   patch:
 *     summary: Update the status of an existing task
 *     description: Updates only the status field of a specific task based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the task to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Task status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Updated Task Title"
 *                     description:
 *                       type: string
 *                       example: "Updated task description"
 *                     status:
 *                       type: string
 *                       example: "COMPLETED"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-24T16:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-24T17:00:00.000Z"
 *                     created_by_id:
 *                       type: integer
 *                       example: 1
 *                     assigned_by_id:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid task ID or missing status field.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Status is required."
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Task not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to update task status."
 */
