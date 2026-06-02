import { describe, it, expect } from "vitest";
import { formatDate, calculateProgress, validateTaskForm } from "./helpers.js";

describe("Helper Utility Functions", () => {
  describe("formatDate", () => {
    it("should format valid dates to YYYY-MM-DD", () => {
      expect(formatDate("2026-06-02T13:02:23.000Z")).toBe("2026-06-02");
      expect(formatDate(new Date(Date.UTC(2026, 5, 2)))).toBe("2026-06-02");
    });

    it("should handle null or undefined input gracefully", () => {
      expect(formatDate(null)).toBe("No due date");
      expect(formatDate(undefined)).toBe("No due date");
    });

    it("should identify invalid date strings", () => {
      expect(formatDate("invalid-date-string")).toBe("Invalid date");
    });
  });

  describe("calculateProgress", () => {
    it("should compute accurate completion rates", () => {
      expect(calculateProgress(5, 10)).toBe(50.0);
      expect(calculateProgress(1, 3)).toBe(33.3);
      expect(calculateProgress(0, 5)).toBe(0.0);
    });

    it("should return 0 when total is 0 or negative", () => {
      expect(calculateProgress(5, 0)).toBe(0.0);
      expect(calculateProgress(5, -10)).toBe(0.0);
    });
  });

  describe("validateTaskForm", () => {
    it("should return empty errors object for valid fields", () => {
      const errors = validateTaskForm("T-101", "Setup MERN App");
      expect(errors).toEqual({});
    });

    it("should flag missing taskId", () => {
      const errors = validateTaskForm("", "Setup MERN App");
      expect(errors.taskId).toBeDefined();
      expect(errors.taskId).toBe("Task ID is required");
    });

    it("should flag missing title", () => {
      const errors = validateTaskForm("T-101", "");
      expect(errors.title).toBeDefined();
      expect(errors.title).toBe("Title is required");
    });

    it("should flag title that is too short", () => {
      const errors = validateTaskForm("T-101", "Ab");
      expect(errors.title).toBeDefined();
      expect(errors.title).toContain("at least 3 characters");
    });
  });
});
