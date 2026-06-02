import { createContext, useReducer, useEffect, useCallback, useContext } from "react";
import { taskReducer, taskInitialState } from "../reducer/taskReducer.js";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

export const TaskContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, taskInitialState);
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all tasks based on current filters/search
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch({ type: "FETCH_TASKS_START" });
    try {
      const { status, priority } = state.filters;
      const { search } = state;

      let url = `${API_BASE_URL}/tasks`;
      const params = {};

      if (search) {
        url = `${API_BASE_URL}/tasks/search`;
        params.q = search;
      } else {
        if (status) params.status = status;
        if (priority) params.priority = priority;
      }

      const response = await axios.get(url, { params });
      dispatch({
        type: "FETCH_TASKS_SUCCESS",
        payload: response.data.data || [],
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tasks";
      dispatch({ type: "FETCH_TASKS_FAILURE", payload: message });
    }
  }, [state.filters, state.search, isAuthenticated]);

  // Fetch analytics stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      dispatch({
        type: "SET_STATS",
        payload: response.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error.message);
    }
  }, [isAuthenticated]);

  // Load initial tasks & stats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchStats();
    }
  }, [fetchTasks, fetchStats, isAuthenticated]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      dispatch({
        type: "ADD_TASK_SUCCESS",
        payload: response.data.data,
      });
      fetchStats(); // Update dashboard counts
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create task";
      return { success: false, message };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
      dispatch({
        type: "UPDATE_TASK_SUCCESS",
        payload: response.data.data,
      });
      fetchStats(); // Update dashboard counts
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update task";
      return { success: false, message };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      dispatch({
        type: "DELETE_TASK_SUCCESS",
        payload: id,
      });
      fetchStats(); // Update dashboard counts
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task";
      return { success: false, message };
    }
  };

  // Sync Task from NVD
  const syncTasks = async () => {
    dispatch({ type: "SYNC_START" });
    try {
      const response = await axios.post(`${API_BASE_URL}/sync`);
      dispatch({
        type: "SYNC_SUCCESS",
        payload: response.data,
      });
      // Refresh tasks and stats
      fetchTasks();
      fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Sync pipeline failed";
      dispatch({ type: "SYNC_FAILURE", payload: message });
      return { success: false, message };
    }
  };

  // Update specific filter values
  const setFilters = (updates) => {
    dispatch({ type: "SET_FILTERS", payload: updates });
  };

  // Update search query term
  const setSearch = (query) => {
    dispatch({ type: "SET_SEARCH", payload: query });
  };

  // Toggle selected task for modals/detail view
  const setSelectedTask = (task) => {
    dispatch({ type: "SET_SELECTED_TASK", payload: task });
  };

  // Reset sync message banner
  const clearSyncResult = () => {
    dispatch({ type: "CLEAR_SYNC_RESULT" });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        stats: state.stats,
        filters: state.filters,
        search: state.search,
        syncing: state.syncing,
        syncResult: state.syncResult,
        selectedTask: state.selectedTask,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
        syncTasks,
        setFilters,
        setSearch,
        setSelectedTask,
        clearSyncResult,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
