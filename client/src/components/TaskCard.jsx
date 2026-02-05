import { Link } from "react-router-dom";

const TaskCard = ({ task }) => {
  return (
    <article className="task-card-modern">
      <div className="task-card-accent"></div>
      <div className="task-status-badge">
        <span className={`status-dot status-${task.status}`}></span>
        <span className="status-text">{task.status}</span>
      </div>
      
      <div className="task-card-content">
        <div className="task-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7C3 5.89543 3.89543 5 5 5H9C10.1046 5 11 5.89543 11 7V11C11 12.1046 10.1046 13 9 13H5C3.89543 13 3 12.1046 3 11V7Z" fill="url(#gradient1)"/>
            <path d="M13 7C13 5.89543 13.8954 5 15 5H19C20.1046 5 21 5.89543 21 7V11C21 12.1046 20.1046 13 19 13H15C13.8954 13 13 12.1046 13 11V7Z" fill="url(#gradient2)"/>
            <path d="M3 17C3 15.8954 3.89543 15 5 15H9C10.1046 15 11 15.8954 11 17V19C11 20.1046 10.1046 21 9 21H5C3.89543 21 3 20.1046 3 19V17Z" fill="url(#gradient3)"/>
            <path d="M13 17C13 15.8954 13.8954 15 15 15H19C20.1046 15 21 15.8954 21 17V19C21 20.1046 20.1046 21 19 21H15C13.8954 21 13 20.1046 13 19V17Z" fill="url(#gradient4)"/>
            <defs>
              <linearGradient id="gradient1" x1="7" y1="5" x2="7" y2="13" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb"/>
                <stop offset="1" stopColor="#0ea5e9"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="17" y1="5" x2="17" y2="13" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb"/>
                <stop offset="1" stopColor="#0ea5e9"/>
              </linearGradient>
              <linearGradient id="gradient3" x1="7" y1="15" x2="7" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb"/>
                <stop offset="1" stopColor="#0ea5e9"/>
              </linearGradient>
              <linearGradient id="gradient4" x1="17" y1="15" x2="17" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb"/>
                <stop offset="1" stopColor="#0ea5e9"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <h3 className="task-title">{task.title}</h3>
        <p className="task-brief">{task.brief}</p>
        
        <div className="task-details">
          <div className="detail-item">
            <svg className="detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
            </svg>
            <span className="detail-label">Deadline</span>
            <span className="detail-value">{task.deadline || "Flexible"}</span>
          </div>
          
          <div className="task-divider"></div>
          
          <div className="detail-item">
            <svg className="detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
              <path d="M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.44-.82-1.91-2.66-2.23V5h-1.75v1.26c-2.6.56-2.62 2.85-2.62 2.96 0 2.27 2.25 2.91 3.35 3.31 1.58.56 2.28 1.07 2.28 2.03 0 1.13-1.05 1.61-1.98 1.61-1.82 0-2.34-1.87-2.4-2.09l-1.66.67c.63 2.19 2.28 2.78 2.9 2.96V19h1.75v-1.24c.4-.09 2.9-.59 2.9-3.22 0-1.39-.61-2.61-3.76-3.44z" fill="currentColor"/>
            </svg>
            <span className="detail-label">Budget</span>
            <span className="detail-value">{task.budget || "Negotiable"}</span>
          </div>
        </div>
      </div>
      
      <Link className="task-action-btn" to={`/tasks/${task._id}`}>
        <span>View Details</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </article>
  );
};

export default TaskCard;
