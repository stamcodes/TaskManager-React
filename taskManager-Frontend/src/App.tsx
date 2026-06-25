import { useState, useEffect } from "react";
import { ViewToggle } from "./components/ViewToggle";
import {
  getTasks,
  editTaskStatus,
  createTask,
  editTask,
  deleteTask,
  type Task,
} from "./api/tasks";
import { Card, Select, Row, Col, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";

const KanbanColumnWrapper = styled.div`
  padding: 10px;
  min-height: 65vh;
  background: #f1f5f9;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 28px 32px;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

type ModalMode = "create" | "edit" | null;
interface ModalState {
  mode: ModalMode;
  taskId: number | null;
  title: string;
  description: string;
  status: string;
  createdBy: string;
}

const defaultModal: ModalState = {
  mode: null,
  taskId: null,
  title: "",
  description: "",
  status: "pending",
  createdBy: "",
};

function App() {
  const [view, setView] = useState<"kanban" | "table">("table");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modal, setModal] = useState<ModalState>(defaultModal);

  const columns = ["pending", "in progress", "blocked", "complete"];

  useEffect(() => {
    getTasks()
      .then((data) => setTasks(data))
      .catch((err) => console.error("Failed to load tasks", err));
  }, []);

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await editTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openCreateModal = () => {
    setModal({ ...defaultModal, mode: "create" });
  };

  const openEditModal = (task: Task) => {
    setModal({
      mode: "edit",
      taskId: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdBy: String(task.created_by_id),
    });
  };

  const closeModal = () => setModal(defaultModal);

  const handleModalSubmit = async () => {
    if (modal.mode === "create") {
      try {
        await createTask({
          title: modal.title,
          description: modal.description,
          status: modal.status,
          created_by: Number(modal.createdBy),
        });
        const refreshed = await getTasks();
        setTasks(refreshed);
        closeModal();
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    } else if (modal.mode === "edit" && modal.taskId !== null) {
      try {
        await editTask(modal.taskId, {
          title: modal.title,
          description: modal.description,
          status: modal.status,
        });
        const refreshed = await getTasks();
        setTasks(refreshed);
        closeModal();
      } catch (err) {
        console.error("Failed to edit task:", err);
      }
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Tasks Manager</h1>

      <ViewToggle currentView={view} onViewChange={setView} />
      {/* Modal */}
      {modal.mode !== null && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>
              {modal.mode === "create" ? "Add new task" : "Edit task"}
            </ModalTitle>

            <div
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#475569" }}>Title</span>
              <input
                value={modal.title}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter task title"
                style={{
                  padding: "8px 10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#475569" }}>
                Description
              </span>
              <textarea
                value={modal.description}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter task description"
                style={{
                  padding: "8px 10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                  minHeight: "80px",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#475569" }}>Status</span>
              <select
                value={modal.status}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, status: e.target.value }))
                }
                style={{
                  padding: "8px 10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  fontSize: "13px",
                  width: "100%",
                }}
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="complete">Complete</option>
              </select>
            </div>

            {modal.mode === "create" && (
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#475569" }}>
                  Created by (User ID)
                </span>
                <input
                  type="number"
                  value={modal.createdBy}
                  onChange={(e) =>
                    setModal((prev) => ({ ...prev, createdBy: e.target.value }))
                  }
                  placeholder="Enter user ID"
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    fontSize: "13px",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>
            )}

            <ModalActions>
              <button
                onClick={closeModal}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  background: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  background: "#0f172a",
                  color: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {modal.mode === "create" ? "Create task" : "Save changes"}
              </button>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      <div>
        {view === "table" ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "12px",
              }}
            >
              <button
                onClick={openCreateModal}
                style={{
                  padding: "8px 16px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                + Add new task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                No tasks available. Add a task to show the table view.
              </div>
            ) : (
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
                      <th style={{ padding: "10px" }}>Actions</th>
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
                        <td style={{ padding: "10px" }}>{task.id}</td>
                        <td style={{ padding: "10px" }}>{task.title}</td>
                        <td style={{ padding: "10px" }}>{task.description}</td>

                        <td style={{ padding: "10px" }}>
                          <select
                            value={task.status.toLowerCase()}
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

                        <td style={{ padding: "10px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => openEditModal(task)}
                              style={{
                                padding: "5px 12px",
                                fontSize: "12px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "4px",
                                background: "#fff",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              style={{
                                padding: "5px 12px",
                                fontSize: "12px",
                                border: "1px solid #fca5a5",
                                borderRadius: "4px",
                                background: "#fff",
                                color: "#dc2626",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              onClick={openCreateModal}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "8px 16px",
                background: "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              + Add new task
            </button>
            <Row gutter={10} style={{ paddingTop: "50px" }}>
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
                          style={{ borderRadius: "6px", marginBottom: "10px" }}
                          extra={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <EditOutlined
                                onClick={() => openEditModal(task)}
                                style={{
                                  fontSize: "15px",
                                  color: "#475569",
                                  cursor: "pointer",
                                }}
                              />
                              <DeleteOutlined
                                onClick={() => handleDelete(task.id)}
                                style={{
                                  fontSize: "15px",
                                  color: "#dc2626",
                                  cursor: "pointer",
                                }}
                              />
                              <Select
                                value={task.status.toLowerCase()}
                                style={{ width: 120 }}
                                onChange={(val) =>
                                  handleStatusChange(task.id, val)
                                }
                                options={[
                                  { value: "pending", label: "Pending" },
                                  {
                                    value: "in progress",
                                    label: "In Progress",
                                  },
                                  { value: "blocked", label: "Blocked" },
                                  { value: "complete", label: "Complete" },
                                ]}
                              />
                            </div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
