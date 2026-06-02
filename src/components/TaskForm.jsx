import { useState, useEffect, useContext } from "react";
import { TaskContext } from "../context/TaskContext.jsx";

const TaskForm = ({ onClose }) => {
  const { selectedTask, createTask, updateTask } = useContext(TaskContext);
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTaskId(selectedTask.taskId || "");
      setTitle(selectedTask.title || "");
      setDescription(selectedTask.description || "");
      setStatus(selectedTask.status || "pending");
      setPriority(selectedTask.priority || "medium");
      if (selectedTask.dueDate) {
        setDueDate(new Date(selectedTask.dueDate).toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
    } else {
      // Auto-generate a unique ID for new manual tasks
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setTaskId(`TASK-${randNum}`);
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
      setDueDate("");
    }
    setErrors({});
  }, [selectedTask]);

  const validate = () => {
    const tempErrors = {};
    if (!taskId.trim()) tempErrors.taskId = "Task ID is required";
    if (!title.trim()) {
      tempErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      tempErrors.title = "Title must be at least 3 characters long";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const taskData = {
      taskId: taskId.trim(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || undefined,
    };

    let result;
    if (selectedTask) {
      result = await updateTask(selectedTask._id, taskData);
    } else {
      result = await createTask(taskData);
    }

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setErrors({ server: result.message });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glassmorphism-card animate-fade-in">
        <h2 className="modal-title">
          {selectedTask ? "Edit Task Details" : "Create New Task"}
        </h2>
        {errors.server && <div className="error-banner">{errors.server}</div>}
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="taskId">Task Identifier</label>
            <input
              type="text"
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              disabled={!!selectedTask}
              placeholder="e.g. TASK-9901 or CVE-2026-1234"
              className={errors.taskId ? "input-error" : ""}
            />
            {errors.taskId && <span className="error-text">{errors.taskId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task name"
              className={errors.title ? "input-error" : ""}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context (e.g., meeting notes, security vectors)"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="status">Current Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="priority">Priority Level</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              data-testid="submit-task-btn"
            >
              {loading ? "Saving..." : selectedTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
