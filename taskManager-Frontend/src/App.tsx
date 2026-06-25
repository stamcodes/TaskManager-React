import { useEffect } from "react";
import {
  getTasks,
  createTask,
  editTask,
  editTaskStatus,
  deleteTask,
} from "./api/tasks";

function App() {
  useEffect(() => {
    const testAllEndpoints = async () => {
      console.log("🚀 STARTING RAW SQL ENDPOINT TESTS...");

      try {
        // 1. TEST GET ALL TASKS
        console.log("--- Testing GET Tasks ---");
        const tasks = await getTasks();
        console.log("✅ GET SUCCESS. Current tasks in DB:", tasks);

        // 2. TEST CREATE TASK
        console.log("--- Testing POST Create Task ---");
        const newDoc = await createTask({
          title: "Test Deadline Task",
          description: "Testing raw SQL pool connections",
          status: "pending",
          created_by: 1, // Ensure this ID exists in your users table if you have a foreign key!
        });
        console.log("✅ POST SUCCESS. Created task:", newDoc);
        const newTaskId = newDoc.task.id; // Grabs the ID of the task we just created

        // 3. TEST EDIT TASK TEXT
        console.log(`--- Testing PUT Edit Task for ID: ${newTaskId} ---`);
        const updatedDoc = await editTask(newTaskId, {
          title: "Updated Title via Frontend Test",
          description: "This text was modified by App.tsx",
          status: "pending",
        });
        console.log("✅ PUT SUCCESS. Updated row data:", updatedDoc);

        // 4. TEST EDIT TASK STATUS (PATCH)
        console.log(`--- Testing PATCH Status for ID: ${newTaskId} ---`);
        const patchedDoc = await editTaskStatus(newTaskId, "completed");
        console.log("✅ PATCH SUCCESS. New status data:", patchedDoc);

        // 5. TEST DELETE TASK
        console.log(`--- Testing DELETE for ID: ${newTaskId} ---`);
        const deleteResult = await deleteTask(newTaskId);
        console.log("✅ DELETE SUCCESS. Result message:", deleteResult);

        console.log("🎉 ALL 5 RAW SQL ENDPOINTS ARE WORKING PERFECTLY!");
      } catch (error: any) {
        console.error("❌ TEST FAILED! Look at the error details below:");
        if (error.response) {
          console.error(
            `Backend returned status ${error.response.status}:`,
            error.response.data,
          );
        } else {
          console.error("Network/Connection error:", error.message);
        }
      }
    };

    testAllEndpoints();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Running Backend Integration Tests...</h1>
      <p>
        Right-click this screen, click <strong>Inspect</strong>, and open the{" "}
        <strong>Console</strong> tab to watch your raw SQL queries fire!
      </p>
    </div>
  );
}

export default App;
