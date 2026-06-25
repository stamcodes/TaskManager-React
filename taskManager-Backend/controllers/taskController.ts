import express, { Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import pool from "../config/db";

const router = express.Router();

router.use(express.json());

// Define Swagger Configuration file.
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Get Tasks API",
      version: "1.0.0",
      description: "Get method API to get the list of all tasks",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  },
  //Path to the API docs ( where JSDocs comments are located)
  apis: [__dirname + "/taskController.ts"],
};

// Initiate Swagger JSDoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

//Serve the interactive Swagger UI page at /api-docs.
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

router.get("/api/getTasks", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tasks;");

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Tasks list not found",
      });
    }
    //If successfully found rows.
    res.status(200).json(result.rows);

    //else catch block to throw error
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//API#2: Create TASK ENDPOINT
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

router.post("/api/createTask", async (req: Request, res: Response) => {
  const { title, description, status, created_by } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required fields" });
  }

  try {
    const text =
      "INSERT INTO tasks (title, description, status, created_by_id) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [title, description, status, created_by];
    const result = await pool.query(text, values);

    res.status(201).json({
      message: "Task created successfully",
      task: result.rows[0],
    });
  } catch (error) {
    const err = error as any;
    console.error("Database query error:", err.stack);

    if (err.code === "23505") {
      return res.status(409).json({ error: "Task already exists." });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// TO UPDATE TASKS LIST USING SWAGGER!

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

router.put("/api/editTask/:id", async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id as string);

    if (isNaN(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }

    const { title, description, status, assigned_by_id } = req.body;

    // CHECKING BY ID IF TASK EXIST
    const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    // 2. UPDATING VIA ID
    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, status = $3 
       WHERE id = $4
       RETURNING *`,
      [title, description, status, taskId],
    );

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    const err = error as any;
    console.error("Edit task error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update task." });
  }
});

// TO DELETE TASKS

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

router.delete("/api/deleteTask/:id", async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id as string);

    if (isNaN(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }

    //Check to see if ID exists
    const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    //If exists, run query to delete
    await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);

    return res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    const err = error as any;
    console.error("Delete task error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete task" });
  }
});

//To update task status

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

router.patch(
  "/api/editStatusOfTask/:id",
  async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id as string);

      if (isNaN(taskId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid task ID." });
      }

      const { status } = req.body;

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "Status is required." });
      }

      // Check if task exists
      const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
        taskId,
      ]);

      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found." });
      }

      // Update only the status
      const result = await pool.query(
        `UPDATE tasks SET status = $1 WHERE id = $2::int RETURNING *`,
        [status, taskId],
      );

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      const err = error as any;
      console.error("Patch task error:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update task status." });
    }
  },
);

export default router;
