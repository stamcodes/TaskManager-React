interface ViewToggleProps {
  currentView: "kanban" | "table";
  onViewChange: (view: "kanban" | "table") => void;
}

export const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "20px 0px",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          border: "1px solid #e2e8f0",
        }}
      >
        {/*Kanban Button*/}
        <button
          onClick={() => onViewChange("kanban")}
          style={{
            padding: "8px 16px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            backgroundColor:
              currentView === "kanban" ? "#ffffff" : "transparent",
            color: currentView === "kanban" ? "#0f172a" : "#64748b",
          }}
        >
          Kanban board
        </button>

        {/*zTable Button*/}
        <button
          onClick={() => onViewChange("table")}
          style={{
            padding: "8px 16px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            backgroundColor:
              currentView === "table" ? "#ffffff" : "transparent",
            color: currentView === "table" ? "#0f172a" : "#64748b",
          }}
        >
          Table view
        </button>
      </div>
    </div>
  );
};
