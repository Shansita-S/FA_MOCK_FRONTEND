import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login, error, loading, isAuthenticated, clearError } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }
    clearError();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!username.trim() || !password.trim()) {
      setValidationError("Username and password are required");
      return;
    }

    const result = await login(username.trim(), password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glassmorphism-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">✔</span>
            <h2>TaskSync Pro</h2>
          </div>
          <p>MERN Full Stack Assessment Dashboard</p>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {validationError && <div className="error-banner">{validationError}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. password123"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Authenticating Session..." : "Log In"}
          </button>
        </form>

        <div className="login-footer">
          <p>Seeded Admin Credentials: <strong>admin</strong> / <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
