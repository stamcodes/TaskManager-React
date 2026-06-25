import { Request, Response } from "express";
import pool from "../config/db";

//1. Get List of tasks from the dB
export const getTasks = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tasks;");

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Tasks list not found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//2. Create a task on the DB
export const createTask = async (req: Request, res: Response) => {
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

    res
      .status(201)
      .json({ message: "Task created successfully", task: result.rows[0] });
  } catch (error) {
    const err = error as any;
    console.error("Database query error:", err.stack);

    if (err.code === "23505") {
      return res.status(409).json({ error: "Task already exists." });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

//3. Edit existing task on the dB
export const editTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id as string);

    if (isNaN(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }

    const { title, description, status } = req.body;

    const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *`,
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
};

//4. Delete a given task using its ID
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id as string);

    if (isNaN(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }

    const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

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
};

//5. Edit a task status using ID
export const editTaskStatus = async (req: Request, res: Response) => {
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

    const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

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
};
