import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData(event.target);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      const { token } = await loginAdmin(payload);
      localStorage.setItem("adminToken", token);
      navigate("/admin/dashboard");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="form-card narrow modern-form">
        <div className="login-header">
          <div className="login-icon">🔒</div>
          <h1>Admin login</h1>
          <p className="hero-copy">Enter your credentials to access the dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="floating-label">
            <input name="email" type="email" required placeholder="" autoComplete="email" />
            <span>📧 Email address</span>
          </label>
          <label className="floating-label password-field">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="" 
              autoComplete="current-password"
            />
            <span>🔑 Password</span>
            <button 
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </label>
          <button className="primary-button large" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign in →"
            )}
          </button>
        </form>
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            <span className="alert-icon">{status.type === "success" ? "✅" : "⚠️"}</span>
            {status.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminLogin;
