// src/api/projects.ts
import { api } from "./auth";

export type User = {
  id: number;
  username: string;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  owner: User;
  collaborators: User[];
  start_date?: string | null;
  created_at?: string;
};

// ---------- Projects CRUD ----------
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/projects/");
  return data;
};

export const getProject = async (id: number): Promise<Project> => {
  const { data } = await api.get(`/projects/${id}/`);
  return data;
};

export const createProject = async (payload: {
  name: string;
  description?: string;
  start_date?: string | null;
}): Promise<Project> => {
  const { data } = await api.post("/projects/", payload);
  return data;
};

export const updateProject = async (id: number, payload: any): Promise<Project> => {
  const { data } = await api.put(`/projects/${id}/`, payload);
  return data;
};

export const patchProject = async (id: number, payload: any): Promise<Project> => {
  const { data } = await api.patch(`/projects/${id}/`, payload);
  return data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}/`);
};

// ---------- Collaborators helpers ----------
// NOTE: Backends differ. We implement robust wrappers with fallbacks.

// Try GET /projects/{id}/collaborators/ first; if 405/404 fallback to project.collaborators
export const getCollaborators = async (projectId: number) => {
  const response = await api.get(`/projects/${projectId}/`);
  return response.data.collaborators; // <- suponiendo que el serializer devuelve un campo "collaborators"
};


// Add collaborator: prefer username body but allow a user_id variant.
// Attempt POST { username } first; if 400/405/404 try POST { user_id } (if numeric)
export const addCollaborator = async (projectId: number, payload: { username?: string; user_id?: number }) => {
  // Prefer username when provided
  if (payload.username) {
    try {
      const res = await api.post(`/projects/${projectId}/collaborators/`, { username: payload.username });
      return res.data;
    } catch (err: any) {
      // fallback to user_id if present
      if (payload.user_id) {
        const res2 = await api.post(`/projects/${projectId}/collaborators/`, { user_id: payload.user_id });
        return res2.data;
      }
      throw err;
    }
  } else if (payload.user_id) {
    const res = await api.post(`/projects/${projectId}/collaborators/`, { user_id: payload.user_id });
    return res.data;
  } else {
    throw new Error("addCollaborator requires username or user_id");
  }
};

// Remove collaborator: try delete by username path, then by id path (fallback)
export const removeCollaborator = async (projectId: number, identifier: { username?: string; user_id?: number }) => {
  // try username path first (string)
  if (identifier.username) {
    try {
      await api.delete(`/projects/${projectId}/collaborators/${encodeURIComponent(identifier.username)}/`);
      return;
    } catch (err: any) {
      // if method not allowed or not found, try by id (if available)
      if ((err?.response?.status === 405 || err?.response?.status === 404) && identifier.user_id) {
        await api.delete(`/projects/${projectId}/collaborators/${identifier.user_id}/`);
        return;
      }
      throw err;
    }
  }

  // else try user_id path
  if (identifier.user_id) {
    await api.delete(`/projects/${projectId}/collaborators/${identifier.user_id}/`);
    return;
  }

  // Last resort: try to find user_id from project and delete
  // (caller should pass either username or user_id; we avoid fetching here to keep function simple)
  throw new Error("removeCollaborator requires username or user_id");
};
