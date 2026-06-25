// import { useEffect } from "react";
// import {
//   getTasks,
//   createTask,
//   editTask,
//   editTaskStatus,
//   deleteTask,
// } from "./api/tasks";

// function App() {
//   useEffect(() => {
//     const testAllEndpoints = async () => {
//       console.log("STARTING RAW SQL ENDPOINT TESTS...");

//       try {
//         // 1. TEST GET ALL TASKS
//         console.log("--- Testing GET Tasks ---");
//         const tasks = await getTasks();
//         console.log(" GET SUCCESS. Current tasks in DB:", tasks);

//         // 2. TEST CREATE TASK
//         console.log("--- Testing POST Create Task ---");
//         const newDoc = await createTask({
//           title: "Test Deadline Task",
//           description: "Testing raw SQL pool connections",
//           status: "pending",
//           created_by: 1, // Ensure this ID exists in your users table if you have a foreign key!
//         });
//         console.log("POST SUCCESS. Created task:", newDoc);
//         const newTaskId = newDoc.task.id; // Grabs the ID of the task we just created

//         // 3. TEST EDIT TASK TEXT
//         console.log(`--- Testing PUT Edit Task for ID: ${newTaskId} ---`);
//         const updatedDoc = await editTask(newTaskId, {
//           title: "Updated Title via Frontend Test",
//           description: "This text was modified by App.tsx",
//           status: "pending",
//         });
//         console.log("PUT SUCCESS. Updated row data:", updatedDoc);

//         // 4. TEST EDIT TASK STATUS (PATCH)
//         console.log(`--- Testing PATCH Status for ID: ${newTaskId} ---`);
//         const patchedDoc = await editTaskStatus(newTaskId, "completed");
//         console.log("PATCH SUCCESS. New status data:", patchedDoc);

//         // 5. TEST DELETE TASK
//         console.log(`--- Testing DELETE for ID: ${newTaskId} ---`);
//         const deleteResult = await deleteTask(newTaskId);
//         console.log("DELETE SUCCESS. Result message:", deleteResult);

//         console.log("ALL 5 RAW SQL ENDPOINTS ARE WORKING PERFECTLY!");
//       } catch (error: any) {
//         console.error("TEST FAILED! Look at the error details below:");
//         if (error.response) {
//           console.error(
//             `Backend returned status ${error.response.status}:`,
//             error.response.data,
//           );
//         } else {
//           console.error("Network/Connection error:", error.message);
//         }
//       }
//     };

//     testAllEndpoints();
//   }, []);

//   return (
//     <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
//       <h1>Running Backend Integration Tests...</h1>
//       <p>
//         Right-click this screen, click <strong>Inspect</strong>, and open the{" "}
//         <strong>Console</strong> tab to watch your raw SQL queries fire!
//       </p>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import { ViewToggle } from "./components/ViewToggle";
import { getTasks, editTaskStatus, type Task } from "./api/tasks";

function App() {
  const [view, setView] = useState<"kanban" | "table">("table"); // State controlling active layout
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch your data from raw SQL backend on page load
  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error("Failed to load tasks", err);
      });
  }, []);

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await editTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t,
        ),
      );
      console.log(`Success: Task ${taskId} updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Tasks Manager</h1>

      {/* Controller switch goes here */}
      <ViewToggle currentView={view} onViewChange={setView} />

      <div>
        {view === "table" ? (
          <div>
            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                No tasks available. Add a task to show the table view.
              </div>
            ) : (
              //If the tasks table isnt empty.
              <div style={{ border: "1px solid black", overflowX: "auto" }}>
                <table
                  style={{ fontSize: "14px", textAlign: "left", width: "100%" }}
                >
                  <thead
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "2px solid black",
                    }}
                  >
                    <tr>
                      <th style={{ padding: "10px" }}>ID</th>
                      <th style={{ padding: "10px" }}>Title</th>
                      <th style={{ padding: "10px" }}>Description</th>
                      <th style={{ padding: "10px" }}>Status</th>
                      <th style={{ padding: "10px" }}>Created By ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>{task.description}</td>

                        <td style={{ padding: "10px" }}>
                          <select
                            value={task.status.toLowerCase()} // Forces match with backend lowercase naming values
                            onChange={(e) =>
                              handleStatusChange(task.id, e.target.value)
                            }
                            style={{
                              padding: "6px 12px",
                              border: "1px solid #cbd5e1",
                              backgroundColor: "#ffffff",
                              color: "#0f172a",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="complete">Complete</option>
                          </select>
                        </td>

                        <td style={{ padding: "10px" }}>
                          {task.created_by_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>PLACEHOLDER FOR KANBAN STYLE</div>
        )}
      </div>
    </div>
  );
}
export default App;
