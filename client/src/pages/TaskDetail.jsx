import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTasks, submitRequest } from "../api.js";

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        const found = data.find((item) => item._id === id);
        setTask(found || null);
      })
      .catch(() => {
        setTask(null);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData(event.target);
    
    // Add selected skills as comma-separated string
    formData.set("skills", selectedSkills.join(", "));

    try {
      await submitRequest(id, formData);
      event.target.reset();
      setFileName("");
      setCharCount(0);
      setSelectedSkills([]);
      setCustomSkill("");
      setStatus({ type: "success", message: "Request sent successfully. We'll contact you soon!" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: "error", message: "File size must be less than 5MB" });
        e.target.value = "";
        setFileName("");
      } else {
        setFileName(file.name);
        setStatus({ type: "", message: "" });
      }
    }
  };

  const handleMessageChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  if (!task) {
    return (
      <section className="page">
        <p className="status">Task not found.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Design task</p>
          <h1>{task.title}</h1>
          <p className="hero-copy">{task.brief}</p>
        </div>
        <div className="detail-meta">
          <span>Budget: {task.budget || "Flexible"}</span>
          <span>Deadline: {task.deadline || "Open"}</span>
          <span>Status: {task.status}</span>
        </div>
      </div>

      <form className="form-card modern-form" onSubmit={handleSubmit}>
        <h2>Request this task</h2>
        <p className="form-subtitle">Fill in your details to submit your application</p>
        
        <div className="form-section">
          <h3 className="section-label">Personal Information</h3>
          <div className="form-grid">
            <label className="floating-label">
              <input name="name" type="text" required placeholder="" />
              <span>Full name *</span>
            </label>
            <label className="floating-label">
              <input name="email" type="email" required placeholder="" />
              <span>Email address *</span>
            </label>
          </div>
          <div className="form-grid">
            <label className="floating-label">
              <input name="phone" type="tel" required placeholder="" pattern="[0-9+\-\s()]+" />
              <span>Phone number *</span>
            </label>
            <label className="floating-label">
              <input name="portfolioUrl" type="url" placeholder="" />
              <span>Portfolio URL</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-label">Professional Details</h3>
          <label>
            Experience level *
            <select name="experienceLevel" required defaultValue="">
              <option value="" disabled>Select your experience</option>
              <option value="beginner">Beginner (0-2 years)</option>
              <option value="intermediate">Intermediate (2-5 years)</option>
              <option value="expert">Expert (5-10 years)</option>
              <option value="senior">Senior (10+ years)</option>
            </select>
          </label>
          
          <div className="skills-section">
            <label className="skills-label">Skills & Specializations</label>
            <p className="field-hint">Select all that apply or add custom skills</p>
            <div className="skills-grid">
              {["UI/UX Design", "Branding", "Illustration", "Web Design", "Mobile Design", "Graphic Design", "Motion Design", "3D Design"].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-chip ${selectedSkills.includes(skill) ? "selected" : ""}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {selectedSkills.includes(skill) && <span className="check">✓</span>}
                  {skill}
                </button>
              ))}
            </div>
            <div className="custom-skill-input">
              <input
                type="text"
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
              />
              <button type="button" className="add-skill-btn" onClick={addCustomSkill}>
                + Add
              </button>
            </div>
            {selectedSkills.length > 0 && (
              <div className="selected-skills">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="selected-skill-tag">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rate-section">
            <label>Rate expectation</label>
            <p className="field-hint">Choose your preferred rate structure</p>
            <div className="rate-options">
              <label className="rate-option">
                <input type="radio" name="rateType" value="hourly" defaultChecked />
                <span>Hourly Rate</span>
              </label>
              <label className="rate-option">
                <input type="radio" name="rateType" value="project" />
                <span>Project Rate</span>
              </label>
            </div>
            <select name="rateExpectation" defaultValue="">
              <option value="" disabled>Select rate range</option>
              <optgroup label="Hourly Rates">
                <option value="$20-$40/hr">$20-$40/hr</option>
                <option value="$40-$60/hr">$40-$60/hr</option>
                <option value="$60-$80/hr">$60-$80/hr</option>
                <option value="$80-$100/hr">$80-$100/hr</option>
                <option value="$100+/hr">$100+/hr</option>
              </optgroup>
              <optgroup label="Project Rates">
                <option value="$500-$1k">$500-$1k per project</option>
                <option value="$1k-$2k">$1k-$2k per project</option>
                <option value="$2k-$5k">$2k-$5k per project</option>
                <option value="$5k-$10k">$5k-$10k per project</option>
                <option value="$10k+">$10k+ per project</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-label">Work Samples</h3>
          <label className="floating-label">
            <input name="sampleLink" type="url" placeholder="" />
            <span>Sample work link (Behance, Dribbble, etc.)</span>
          </label>
          <label className="file-upload-label">
            Upload sample work (max 5MB)
            <div className="file-upload-area">
              <input 
                name="sampleFile" 
                type="file" 
                accept="image/*,.pdf,.zip" 
                onChange={handleFileChange}
                id="file-input"
              />
              <div className="file-upload-content">
                <span className="upload-icon">📁</span>
                <p>{fileName || "Click to browse or drag & drop"}</p>
                <span className="file-hint">PNG, JPG, PDF, ZIP up to 5MB</span>
              </div>
            </div>
          </label>
        </div>

        <div className="form-section">
          <h3 className="section-label">Additional Details</h3>
          <label className="textarea-label">
            About your approach
            <textarea
              name="message"
              rows="6"
              placeholder="Tell us about your design process, timeline, and why you're a good fit for this project..."
              maxLength="1000"
              onChange={handleMessageChange}
            />
            <span className="char-count">{charCount}/1000</span>
          </label>
        </div>

        <button className="primary-button large" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              🚀 Submit application
            </>
          )}
        </button>
        
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            <span className="alert-icon">{status.type === "success" ? "✅" : "⚠️"}</span>
            {status.message}
          </div>
        )}
      </form>
    </section>
  );
};

export default TaskDetail;
