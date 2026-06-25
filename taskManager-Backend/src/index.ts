import express from "express";
import dotenv from "dotenv";
import taskRouter from "../controllers/taskController";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", taskRouter);

// //Test route to see if the dB is being fetched or not.
// app.get("/api/test-db", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM tasks;");
//     res.status(200).json({
//       sucess: true,
//       message: "successfully connected to pgadmin",
//       totalTasks: result.rowCount,
//       data: result.rows,
//     });
//   } catch (error) {
//     console.error("Database test error: ", error);
//     res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//       error: String(error),
//     });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
