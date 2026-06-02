import { useContext } from "react";
import { TaskContext } from "../context/TaskContext.jsx";

const AnalyticsPanel = () => {
  const { stats } = useContext(TaskContext);

  const {
    totalRecords = 0,
    completedRecords = 0,
    pendingRecords = 0,
    priorityWise = { low: 0, medium: 0, high: 0 },
    completionRate = 0,
  } = stats || {};

  return (
    <div className="analytics-section">
      {/* Dynamic Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card glassmorphism-card">
          <div className="summary-label">Total Sourced Tasks</div>
          <div className="summary-value color-gradient-cyan">{totalRecords}</div>
        </div>

        <div className="summary-card glassmorphism-card">
          <div className="summary-label">Completed Tasks</div>
          <div className="summary-value color-gradient-green">{completedRecords}</div>
        </div>

        <div className="summary-card glassmorphism-card">
          <div className="summary-label">Pending Reviews</div>
          <div className="summary-value color-gradient-yellow">{pendingRecords}</div>
        </div>

        <div className="summary-card glassmorphism-card">
          <div className="summary-label">Task Completion Rate</div>
          <div className="summary-value color-gradient-pink">{completionRate}%</div>
        </div>
      </div>

      {/* Progress Bars and Priority Grouping */}
      <div className="analytics-details glassmorphism-card">
        <h3>Task Completion Progress</h3>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>

        <div className="priority-grouping">
          <h3>Priority Allocation</h3>
          <div className="priority-meters">
            <div className="priority-meter-row">
              <span className="meter-label">High Priority</span>
              <div className="meter-track">
                <div
                  className="meter-fill priority-high"
                  style={{
                    width: `${totalRecords > 0 ? (priorityWise.high / totalRecords) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="meter-value">{priorityWise.high}</span>
            </div>

            <div className="priority-meter-row">
              <span className="meter-label">Medium Priority</span>
              <div className="meter-track">
                <div
                  className="meter-fill priority-medium"
                  style={{
                    width: `${totalRecords > 0 ? (priorityWise.medium / totalRecords) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="meter-value">{priorityWise.medium}</span>
            </div>

            <div className="priority-meter-row">
              <span className="meter-label">Low Priority</span>
              <div className="meter-track">
                <div
                  className="meter-fill priority-low"
                  style={{
                    width: `${totalRecords > 0 ? (priorityWise.low / totalRecords) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="meter-value">{priorityWise.low}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
