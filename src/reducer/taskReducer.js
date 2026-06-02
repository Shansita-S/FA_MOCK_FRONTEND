export const taskInitialState = {
  tasks: [],
  loading: false,
  error: null,
  stats: {
    totalRecords: 0,
    completedRecords: 0,
    pendingRecords: 0,
    priorityWise: { low: 0, medium: 0, high: 0 },
    completionRate: 0,
  },
  filters: {
    status: "",
    priority: "",
  },
  search: "",
  syncing: false,
  syncResult: null,
  selectedTask: null,
};

export const taskReducer = (state = taskInitialState, action) => {
  switch (action.type) {
    case "FETCH_TASKS_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_TASKS_SUCCESS":
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        error: null,
      };
    case "FETCH_TASKS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "ADD_TASK_SUCCESS":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case "UPDATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
        selectedTask: state.selectedTask?._id === action.payload._id ? action.payload : state.selectedTask,
      };
    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };
    case "SYNC_START":
      return {
        ...state,
        syncing: true,
        syncResult: null,
      };
    case "SYNC_SUCCESS":
      return {
        ...state,
        syncing: false,
        syncResult: action.payload,
      };
    case "SYNC_FAILURE":
      return {
        ...state,
        syncing: false,
        error: action.payload,
      };
    case "SET_SELECTED_TASK":
      return {
        ...state,
        selectedTask: action.payload,
      };
    case "CLEAR_SYNC_RESULT":
      return {
        ...state,
        syncResult: null,
      };
    default:
      return state;
  }
};
