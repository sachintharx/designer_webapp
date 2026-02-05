import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask, fetchSubmissions, fetchTasks, updateTask, deleteTask, deleteSubmission, deleteSubmissions, deleteAllSubmissions } from "../api.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetUnit, setBudgetUnit] = useState("k");
  const [deadlineAmount, setDeadlineAmount] = useState("");
  const [deadlineUnit, setDeadlineUnit] = useState("weeks");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }

    Promise.all([fetchTasks(), fetchSubmissions(token)])
      .then(([taskData, submissionData]) => {
        setTasks(taskData);
        setSubmissions(submissionData);
      })
      .catch((error) => {
        setStatus({ type: "error", message: error.message });
      });
  }, [navigate, token]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    const formData = new FormData(event.target);

    const budgetMin = formData.get("budgetMin");
    const budgetMax = formData.get("budgetMax");
    const budgetUnitVal = formData.get("budgetUnit");
    const deadlineVal = formData.get("deadlineAmount");
    const deadlineUnitVal = formData.get("deadlineUnit");

    const budget = budgetMin && budgetMax 
      ? `$${budgetMin}${budgetUnitVal} - $${budgetMax}${budgetUnitVal}` 
      : "";
    const deadline = deadlineVal ? `${deadlineVal} ${deadlineUnitVal}` : "";

    const payload = {
      title: formData.get("title"),
      brief: formData.get("brief"),
      budget,
      deadline,
      status: formData.get("status")
    };

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, payload, token);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setEditingTask(null);
        setStatus({ type: "success", message: "Task updated." });
      } else {
        const created = await createTask(payload, token);
        setTasks((prev) => [created, ...prev]);
        setStatus({ type: "success", message: "Task posted." });
      }
      event.target.reset();
      setBudgetAmount("");
      setBudgetUnit("k");
      setDeadlineAmount("");
      setDeadlineUnit("weeks");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setStatus({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;

    try {
      await deleteTask(taskId, token);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setStatus({ type: "success", message: "Task deleted." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const toggleSelectSubmission = (id) => {
    setSelectedSubmissions((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDeleteSelected = async () => {
    if (selectedSubmissions.length === 0) return;
    if (!confirm(`Delete ${selectedSubmissions.length} selected submissions?`)) return;
    try {
      await deleteSubmissions(selectedSubmissions, token);
      setSubmissions((prev) => prev.filter((s) => !selectedSubmissions.includes(s._id)));
      setSelectedSubmissions([]);
      setStatus({ type: "success", message: "Selected submissions removed." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Delete ALL submissions? This cannot be undone.")) return;
    try {
      await deleteAllSubmissions(token);
      setSubmissions([]);
      setSelectedSubmissions([]);
      setStatus({ type: "success", message: "All submissions removed." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDeleteSingleSubmission = async (id) => {
    if (!confirm("Delete this submission?")) return;
    try {
      await deleteSubmission(id, token);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setSelectedSubmissions((prev) => prev.filter((x) => x !== id));
      setStatus({ type: "success", message: "Submission removed." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setStatus({ type: "", message: "" });
  };

  // helpers to extract numeric parts when editing existing tasks
  const parseBudget = (budgetStr) => {
    if (!budgetStr) return { min: "", max: "", unit: "k" };
    // match formats like "$2k - $4k" or "$2 - $4"
    const m = budgetStr.match(/\$(\d+(?:\.\d+)?)([km]?)\s*-\s*\$(\d+(?:\.\d+)?)([km]?)/i);
    if (m) return { min: m[1], max: m[3], unit: (m[2] || m[4] || "k") };
    return { min: "", max: "", unit: "k" };
  };

  const parseDeadline = (deadlineStr) => {
    if (!deadlineStr) return { amount: "", unit: "weeks" };
    const m = deadlineStr.match(/(\d+)\s*(days|weeks|months)/i);
    if (m) return { amount: m[1], unit: m[2] };
    return { amount: "", unit: "weeks" };
  };

  const budgetParsed = parseBudget(editingTask?.budget);
  const deadlineParsed = parseDeadline(editingTask?.deadline);

  return (
    <section className="page">
      <div className="admin-layout">
        <div className="form-card">
          <div className="form-header">
            <h1>{editingTask ? "Edit task" : "Post a new task"}</h1>
            {editingTask && (
              <button className="cancel-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleCreate}>
            <label>
              Title
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={editingTask?.title || ""}
                key={editingTask?._id || "new"}
              />
            </label>
            <label>
              Brief
              <textarea 
                name="brief" 
                rows="4" 
                required 
                defaultValue={editingTask?.brief || ""}
                key={editingTask?._id || "new"}
              />
            </label>
            <div className="input-group">
              <label>
                Budget range
                <div className="compound-input">
                  <span className="input-prefix">$</span>
                  <input 
                    name="budgetMin" 
                    type="number" 
                    placeholder="2" 
                    defaultValue={editingTask ? budgetParsed.min : ""}
                    step="0.1"
                  />
                  <select name="budgetUnit" defaultValue={editingTask ? budgetParsed.unit : "k"}>
                    <option value="k">k</option>
                    <option value="m">m</option>
                  </select>
                  <span className="input-separator">to</span>
                  <span className="input-prefix">$</span>
                  <input 
                    name="budgetMax" 
                    type="number" 
                    placeholder="4" 
                    defaultValue={editingTask ? budgetParsed.max : ""}
                    step="0.1"
                  />
                  <select name="budgetUnit" defaultValue={editingTask ? budgetParsed.unit : "k"}>
                    <option value="k">k</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </label>
            </div>
            <div className="input-group">
              <label>
                Deadline
                <div className="compound-input">
                  <input 
                    name="deadlineAmount" 
                    type="number" 
                    placeholder="2" 
                    defaultValue={editingTask ? deadlineParsed.amount : ""}
                    min="1"
                  />
                   <select name="deadlineUnit" defaultValue={editingTask ? deadlineParsed.unit : "weeks"}>
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </select>
                </div>
              </label>
            </div>
            <label>
              Status
              <select 
                name="status" 
                defaultValue={editingTask?.status || "open"}
                key={editingTask?._id || "new"}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <button className="primary-button" type="submit">
              {editingTask ? "Update task" : "Publish task"}
            </button>
          </form>
          {status.message && (
            <p className={`status ${status.type}`}>{status.message}</p>
          )}
        </div>

        <div className="panel">
          <div className="submissions-header-row">
            <h2>Recent submissions</h2>
            <div className="submissions-actions">
              <button className="secondary-chip" onClick={handleDeleteSelected} disabled={selectedSubmissions.length===0}>
                Delete selected
              </button>
              <button className="secondary-chip danger" onClick={handleDeleteAll}>
                Delete all
              </button>
            </div>
          </div>
          {submissions.length === 0 && (
            <p className="status">No submissions yet.</p>
          )}
          <div className="submission-list">
            {submissions.map((submission) => (
              <div key={submission._id} className="submission-card enhanced">
                <div className="submission-header">
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <input type="checkbox" checked={selectedSubmissions.includes(submission._id)} onChange={() => toggleSelectSubmission(submission._id)} />
                    <div>
                      <h3>{submission.name}</h3>
                      <div className="submission-meta">
                        <span>📧 {submission.email}</span>
                        <span>📱 {submission.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <span className={`experience-badge ${submission.experienceLevel}`}>
                      {submission.experienceLevel}
                    </span>
                    <button className="action-button delete" onClick={() => handleDeleteSingleSubmission(submission._id)} title="Delete submission">🗑️</button>
                  </div>
                </div>
                
                <div className="submission-details">
                  <div className="detail-row">
                    <span className="detail-label">Task:</span>
                    <span className="detail-value">{submission.taskId?.title || "Unknown"}</span>
                  </div>
                  {submission.portfolioUrl && (
                    <div className="detail-row">
                      <span className="detail-label">Portfolio:</span>
                      <a href={submission.portfolioUrl} target="_blank" rel="noreferrer" className="detail-link">
                        View portfolio →
                      </a>
                    </div>
                  )}
                  {submission.skills && (
                    <div className="detail-row">
                      <span className="detail-label">Skills:</span>
                      <span className="detail-value">{submission.skills}</span>
                    </div>
                  )}
                  {submission.rateExpectation && (
                    <div className="detail-row">
                      <span className="detail-label">Rate:</span>
                      <span className="detail-value">{submission.rateExpectation}</span>
                    </div>
                  )}
                </div>

                {submission.message && (
                  <div className="submission-message">
                    <span className="detail-label">Message:</span>
                    <p>{submission.message}</p>
                  </div>
                )}

                <div className="submission-samples">
                  {submission.sampleLink && (
                    <a href={submission.sampleLink} target="_blank" rel="noreferrer" className="sample-link">
                      🔗 Sample link
                    </a>
                  )}
                  {submission.sampleFilePath && (
                    <a
                      href={`http://localhost:5000${submission.sampleFilePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="sample-link"
                    >
                      📎 Sample file
                    </a>
                  )}
                </div>
                
                <div className="submission-footer">
                  <span className="submission-date">
                    Submitted {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>All tasks</h2>
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card compact has-actions">
              <div>
                <h3>{task.title}</h3>
                <p>{task.brief}</p>
                <div className="task-meta">
                  <span>Budget: {task.budget || "Flexible"}</span>
                  <span>Deadline: {task.deadline || "Open"}</span>
                </div>
                <span className={`pill pill-${task.status}`}>{task.status}</span>
              </div>
              <div className="task-actions">
                <button 
                  className="action-button edit" 
                  onClick={() => handleEdit(task)}
                  title="Edit task"
                >
                  ✏️ Edit
                </button>
                <button 
                  className="action-button delete" 
                  onClick={() => handleDelete(task._id)}
                  title="Delete task"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
