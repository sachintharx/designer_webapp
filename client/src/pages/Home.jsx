import { useEffect, useState } from "react";
import { fetchTasks } from "../api.js";
import TaskCard from "../components/TaskCard.jsx";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchTasks()
      .then((data) => {
        if (isMounted) {
          setTasks(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-ambient" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>
        <div className="hero-left">
          <p className="eyebrow">DesignHub Platform</p>
          <h1>Connect creative talent with design opportunities.</h1>
          <p className="hero-copy">
            Browse curated design tasks, submit your portfolio samples, and showcase 
            your expertise. Where businesses find exceptional designers.
          </p>
          <div className="hero-actions">
            <span className="secondary-chip">Fast turnaround</span>
            <span className="secondary-chip">Curated talent</span>
            <span className="secondary-chip">Clear briefs</span>
          </div>
          <div className="stat-row">
            <div>
              <p className="stat-value">48h</p>
              <p className="stat-label">Avg. response</p>
            </div>
            <div>
              <p className="stat-value">120+</p>
              <p className="stat-label">Designer profiles</p>
            </div>
            <div>
              <p className="stat-value">4.9/5</p>
              <p className="stat-label">Client rating</p>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <p>AdSense placement</p>
          <div className="ad-slot">Your ad will appear here.</div>
        </div>
      </div>

      <div className="section-title">
        <h2>Open design tasks</h2>
        <p>Review the briefs and send your prework samples.</p>
      </div>

      {loading && <p className="status">Loading tasks...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
        {!loading && tasks.length === 0 && (
          <p className="status">No tasks posted yet.</p>
        )}
      </div>
    </section>
  );
};

export default Home;
