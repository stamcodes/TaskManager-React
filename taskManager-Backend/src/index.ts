import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import taskRoutes from "../routes/taskRoutes";

dotenv.config();

const app = express();
//Cors Middleware

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

//Swagger initialization docs
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Task Manager REST API documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  },
  apis: [__dirname + "/../docs/taskDocs.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
