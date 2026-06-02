import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { TaskContext } from "../context/TaskContext.jsx";
import AnalyticsPanel from "../components/AnalyticsPanel.jsx";
import TaskForm from "../components/TaskForm.jsx";

const DashboardPage = () => {
  const { logout, user } = useContext(AuthContext);
  const {
    tasks,
    loading,
    error,
    filters,
    search,
    syncing,
    syncResult,
    setFilters,
    setSearch,
    syncTasks,
    deleteTask,
    updateTask,
    setSelectedTask,
    clearSyncResult,
  } = useContext(TaskContext);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearch]);

  const handleStatusToggle = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    await updateTask(task._id, { status: nextStatus });
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleSyncClick = async () => {
    clearSyncResult();
    await syncTasks();
  };

  const handleFilterChange = (field, value) => {
    setFilters({ [field]: value });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ status: "", priority: "" });
    clearSyncResult();
  };

  return (
    <div className="dashboard-container">
      {/* Navbar Header */}
      <header className="dashboard-header glassmorphism-card">
        <div className="header-brand">
          <span className="logo-icon">✔</span>
          <h1>TaskSync Dashboard</h1>
        </div>
        <div className="header-user-panel">
          <span className="user-greeting">
            Welcome, <strong>{user?.username || "Admin"}</strong>
          </span>
          <button onClick={logout} className="btn btn-danger btn-sm">
            Sign Out
          </button>
        </div>
      </header>

      {/* Sync Status Banner */}
      {syncResult && (
        <div className="sync-banner glassmorphism-card animate-fade-in">
          <div className="sync-banner-info">
            <span className="sync-badge">SYNC SUCCESSFUL</span>
            <div className="sync-stats-grid">
              <div>Fetched: <strong>{syncResult.totalFetched}</strong></div>
              <div>Inserted: <strong className="txt-success">{syncResult.inserted}</strong></div>
              <div>Duplicates: <strong className="txt-warning">{syncResult.duplicates}</strong></div>
              <div>Rejected: <strong className="txt-danger">{syncResult.rejected}</strong></div>
            </div>
          </div>
          <button onClick={clearSyncResult} className="close-banner">✕</button>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {/* Analytics Panel */}
      <AnalyticsPanel />

      {/* Control Actions & Filtering */}
      <div className="dashboard-controls glassmorphism-card">
        <div className="control-search">
          <input
            type="text"
            placeholder="Search tasks by keyword (e.g. CVE ID, title)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-filters">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            Reset Filters
          </button>
        </div>

        <div className="control-actions">
          <button
            onClick={handleSyncClick}
            className="btn btn-primary"
            disabled={syncing}
          >
            {syncing ? (
              <span className="sync-loader-wrapper">
                <span className="mini-spinner"></span> Synchronizing...
              </span>
            ) : (
              "Sync NVD Database"
            )}
          </button>
          
          <button
            onClick={handleAddClick}
            className="btn btn-success"
            data-testid="add-task-btn"
          >
            + Create Task
          </button>
        </div>
      </div>

      {/* Tasks Database Grid */}
      <div className="tasks-database glassmorphism-card">
        <div className="section-title-row">
          <h3>Persistent Tasks Database</h3>
          <span className="task-count-indicator">Showing {tasks.length} items</span>
        </div>

        {loading ? (
          <div className="table-loader">
            <div className="spinner"></div>
            <p>Loading synchronized database...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found in database.</p>
            <p className="subtext">
              Try hitting the <strong>Sync NVD Database</strong> button or manually adding a task.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th width="5%">Status</th>
                  <th width="15%">Task ID</th>
                  <th width="20%">Task Title</th>
                  <th width="35%">Description</th>
                  <th width="10%">Priority</th>
                  <th width="15%">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className={task.status === "completed" ? "row-completed" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => handleStatusToggle(task)}
                        className="task-checkbox"
                        title="Toggle task completion status"
                      />
                    </td>
                    <td>
                      <code className="task-id-code">{task.taskId}</code>
                    </td>
                    <td className="task-title-cell">
                      <strong>{task.title}</strong>
                    </td>
                    <td>
                      <p className="task-desc-truncate" title={task.description}>
                        {task.description || "No description provided"}
                      </p>
                    </td>
                    <td>
                      <span className={`priority-tag priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          onClick={() => handleEditClick(task)}
                          className="btn btn-warning btn-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="btn btn-danger btn-xs"
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

      {/* Edit/Add Overlay Form Modal */}
      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default DashboardPage;
