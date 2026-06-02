import { describe, it, expect } from "vitest";
import { taskReducer, taskInitialState } from "./taskReducer.js";

describe("Task Reducer State Transitions", () => {
  it("should return the initial state by default", () => {
    expect(taskReducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(taskInitialState);
  });

  it("should handle FETCH_TASKS_START", () => {
    const action = { type: "FETCH_TASKS_START" };
    const nextState = taskReducer(taskInitialState, action);
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("should handle FETCH_TASKS_SUCCESS", () => {
    const mockTasks = [{ _id: "1", taskId: "T-101", title: "Task 1", status: "pending" }];
    const action = { type: "FETCH_TASKS_SUCCESS", payload: mockTasks };
    const nextState = taskReducer({ ...taskInitialState, loading: true }, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.tasks).toEqual(mockTasks);
  });

  it("should handle FETCH_TASKS_FAILURE", () => {
    const errorMsg = "Database error";
    const action = { type: "FETCH_TASKS_FAILURE", payload: errorMsg };
    const nextState = taskReducer({ ...taskInitialState, loading: true }, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMsg);
  });

  it("should handle ADD_TASK_SUCCESS", () => {
    const newTask = { _id: "2", taskId: "T-102", title: "New Task" };
    const action = { type: "ADD_TASK_SUCCESS", payload: newTask };
    const nextState = taskReducer({ ...taskInitialState, tasks: [] }, action);
    expect(nextState.tasks).toHaveLength(1);
    expect(nextState.tasks[0]).toEqual(newTask);
  });

  it("should handle UPDATE_TASK_SUCCESS", () => {
    const initialTasks = [
      { _id: "1", taskId: "T-101", title: "Task 1", status: "pending" },
      { _id: "2", taskId: "T-102", title: "Task 2", status: "pending" },
    ];
    const updatedTask = { _id: "2", taskId: "T-102", title: "Updated Task 2", status: "completed" };
    const action = { type: "UPDATE_TASK_SUCCESS", payload: updatedTask };
    const nextState = taskReducer({ ...taskInitialState, tasks: initialTasks }, action);
    expect(nextState.tasks[1]).toEqual(updatedTask);
  });

  it("should handle DELETE_TASK_SUCCESS", () => {
    const initialTasks = [
      { _id: "1", taskId: "T-101", title: "Task 1" },
      { _id: "2", taskId: "T-102", title: "Task 2" },
    ];
    const action = { type: "DELETE_TASK_SUCCESS", payload: "1" };
    const nextState = taskReducer({ ...taskInitialState, tasks: initialTasks }, action);
    expect(nextState.tasks).toHaveLength(1);
    expect(nextState.tasks[0]._id).toBe("2");
  });

  it("should handle SET_FILTERS", () => {
    const action = { type: "SET_FILTERS", payload: { status: "completed", priority: "high" } };
    const nextState = taskReducer(taskInitialState, action);
    expect(nextState.filters.status).toBe("completed");
    expect(nextState.filters.priority).toBe("high");
  });

  it("should handle SET_SEARCH", () => {
    const action = { type: "SET_SEARCH", payload: "meeting" };
    const nextState = taskReducer(taskInitialState, action);
    expect(nextState.search).toBe("meeting");
  });

  it("should handle SYNC_START", () => {
    const action = { type: "SYNC_START" };
    const nextState = taskReducer(taskInitialState, action);
    expect(nextState.syncing).toBe(true);
    expect(nextState.syncResult).toBeNull();
  });

  it("should handle SYNC_SUCCESS", () => {
    const syncRes = { success: true, totalFetched: 10, inserted: 8, duplicates: 1, rejected: 1 };
    const action = { type: "SYNC_SUCCESS", payload: syncRes };
    const nextState = taskReducer({ ...taskInitialState, syncing: true }, action);
    expect(nextState.syncing).toBe(false);
    expect(nextState.syncResult).toEqual(syncRes);
  });
});
