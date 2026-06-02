/**
 * Formats a date string or object into a human-readable YYYY-MM-DD string.
 * @param {Date|string} dateVal - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return "No due date";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "Invalid date";
  
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the task completion percentage.
 * @param {number} completed - Number of completed tasks
 * @param {number} total - Total number of tasks
 * @returns {number} - Completion percentage rounded to 1 decimal place
 */
export const calculateProgress = (completed, total) => {
  if (!total || total <= 0) return 0;
  const rate = (completed / total) * 100;
  return parseFloat(rate.toFixed(1));
};

/**
 * Validates a task's form inputs.
 * @param {string} taskId - Unique task identifier
 * @param {string} title - Task title
 * @returns {object} - Object containing validation errors
 */
export const validateTaskForm = (taskId, title) => {
  const errors = {};
  if (!taskId || !taskId.trim()) {
    errors.taskId = "Task ID is required";
  }
  if (!title || !title.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters long";
  }
  return errors;
};
