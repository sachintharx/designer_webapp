const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchTasks = async () => {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) {
    throw new Error("Failed to load tasks");
  }
  return res.json();
};

export const submitRequest = async (taskId, formData) => {
  const res = await fetch(`${API_BASE}/submissions/${taskId}`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Submission failed");
  }

  return res.json();
};

export const loginAdmin = async (payload) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  return res.json();
};

export const createTask = async (payload, token) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Task creation failed");
  }

  return res.json();
};

export const fetchSubmissions = async (token) => {
  const res = await fetch(`${API_BASE}/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to load submissions");
  }

  return res.json();
};

export const deleteSubmission = async (id, token) => {
  const res = await fetch(`${API_BASE}/submissions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Submission deletion failed');
  }
  return res.json();
};

export const deleteSubmissions = async (ids, token) => {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ids })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Submissions deletion failed');
  }
  return res.json();
};

export const deleteAllSubmissions = async (token) => {
  const res = await fetch(`${API_BASE}/submissions?all=true`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Deleting all submissions failed');
  }
  return res.json();
};

export const updateTask = async (taskId, payload, token) => {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Task update failed");
  }

  return res.json();
};

export const deleteTask = async (taskId, token) => {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Task deletion failed");
  }

  return res.json();
};
