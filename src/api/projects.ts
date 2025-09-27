// src/api/projects.ts
import { api } from "./auth";

export const getProjects = async () => {
  const res = await api.get("/projects/");
  return res.data;
};
