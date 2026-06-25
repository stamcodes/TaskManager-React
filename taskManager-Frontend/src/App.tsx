import { useState, useEffect } from "react";
import { ViewToggle } from "./components/ViewToggle";
import { getTasks, editTaskStatus, type Task } from "./api/tasks";
import { Card, Select, Row, Col, Typography } from "antd";
import styled from "styled-components";

//Create a wrapper for Kanban

const KanbanColumnWrapper = styled.div`
  padding: 10px;
  min-height: 65vh;
  background: #f1f5f9;
`;

function App() {
  const [view, setView] = useState<"kanban" | "table">("table"); // State controlling active layout
  const [tasks, setTasks] = useState<Task[]>([]);

  //Columns variable initialization to match backend
  const columns = ["pending", "in progress", "blocked", "complete"];

  // Fetch data using raw SQL
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
          <Row gutter={10}>
            {columns.map((colName) => (
              <Col key={colName} span={6}>
                <KanbanColumnWrapper>
                  <Typography.Title
                    level={5}
                    style={{
                      textTransform: "capitalize",
                      marginBottom: "16px",
                    }}
                  >
                    {colName} (
                    {
                      tasks.filter((t) => t.status.toLowerCase() === colName)
                        .length
                    }
                    )
                  </Typography.Title>
                  {tasks
                    .filter((task) => task.status.toLowerCase() === colName)
                    .map((task) => (
                      <Card
                        key={task.id}
                        title={task.title}
                        style={{ borderRadius: "6px" }}
                        extra={
                          <Select
                            value={task.status.toLowerCase()}
                            style={{ width: 120 }}
                            onChange={(val) => handleStatusChange(task.id, val)}
                            // Refactored from Select.Option to options array parameter to address deprecation issue
                            options={[
                              { value: "pending", label: "Pending" },
                              { value: "in progress", label: "In Progress" },
                              { value: "blocked", label: "Blocked" },
                              { value: "complete", label: "Complete" },
                            ]}
                          />
                        }
                      >
                        <p
                          style={{
                            color: "#64748b",
                            fontSize: "13px",
                            margin: "0 0 10px 0",
                          }}
                        >
                          {task.description || "No description provided."}
                        </p>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          Created By ID: {task.created_by_id}
                        </div>
                      </Card>
                    ))}
                </KanbanColumnWrapper>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default App;
