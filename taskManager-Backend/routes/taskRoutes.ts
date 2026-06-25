import express from "express";
import {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  editTaskStatus,
} from "../controllers/taskController";

const router = express.Router();

router.get("/api/getTasks", getTasks);
router.post("/api/createTask", createTask);
router.put("/api/editTask/:id", editTask);
router.delete("/api/deleteTask/:id", deleteTask);
router.patch("/api/editStatusOfTask/:id", editTaskStatus);

export default router;
