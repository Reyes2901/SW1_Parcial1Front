// src/components/CollaboratorsList.tsx
import React, { useEffect, useState } from "react";
import { getCollaborators, addCollaborator, removeCollaborator, getProject, User } from "../api/projects";

type Props = {
  projectId: number;
  // opcionally showAddById: if true allow adding by user_id (number) as well
  showAddById?: boolean;
  // show controls only if current user is owner or has permissions
  canManage?: boolean;
};

const CollaboratorsList: React.FC<Props> = ({ projectId, showAddById = false, canManage = true }) => {
  const [collabs, setCollabs] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newUserId, setNewUserId] = useState<string>("");

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // prefer the collaborators endpoint; fallback handled internally
      const list = await getCollaborators(projectId);
      setCollabs(list ?? []);
    } catch (err: any) {
      // fallback: try to get full project and read collaborators
      try {
        const p = await getProject(projectId);
        setCollabs(p.collaborators ?? []);
      } catch (err2: any) {
        setError("No se pudieron obtener colaboradores.");
        console.error("Collaborators refresh error:", err, err2);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleAddByUsername = async () => {
    if (!newUsername.trim()) return setError("Ingresa un username.");
    setBusy(true);
    setError(null);
    try {
      await addCollaborator(projectId, { username: newUsername.trim() });
      setNewUsername("");
      await refresh();
    } catch (err: any) {
      console.error("Add collaborator username error:", err);
      setError(err?.response?.data ? JSON.stringify(err.response.data) : err?.message || "Error al agregar colaborador");
    } finally {
      setBusy(false);
    }
  };

  const handleAddById = async () => {
    if (!newUserId.trim()) return setError("Ingresa un user id.");
    const userIdNum = parseInt(newUserId, 10);
    if (isNaN(userIdNum)) return setError("ID inválida.");
    setBusy(true);
    setError(null);
    try {
      await addCollaborator(projectId, { user_id: userIdNum });
      setNewUserId("");
      await refresh();
    } catch (err: any) {
      console.error("Add collaborator id error:", err);
      setError(err?.response?.data ? JSON.stringify(err.response.data) : err?.message || "Error al agregar colaborador");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (username: string, userId?: number) => {
    if (!window.confirm(`Quitar colaborador ${username}?`)) return;
    setBusy(true);
    setError(null);
    try {
      // try by username first; pass user_id as fallback
      await removeCollaborator(projectId, { username, user_id: userId });
      await refresh();
    } catch (err: any) {
      console.error("Remove collaborator error:", err);
      setError(err?.response?.data ? JSON.stringify(err.response.data) : err?.message || "Error al quitar colaborador");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 8, border: "1px solid #eee", borderRadius: 6 }}>
      <h4>Colaboradores</h4>

      {loading ? (
        <p>Cargando colaboradores...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {collabs.length === 0 ? <p>No hay colaboradores.</p> : (
            <ul>
              {collabs.map((c) => (
                // key unique: id + username
                <li key={`${c.id}-${c.username}`}>
                  {c.username}
                  {canManage && (
                    <button
                      onClick={() => handleRemove(c.username, c.id)}
                      disabled={busy}
                      style={{ marginLeft: 8 }}
                    >
                      Quitar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {canManage && (
        <div style={{ marginTop: 12 }}>
          <div>
            <input
              placeholder="Agregar por username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={busy}
            />
            <button onClick={handleAddByUsername} disabled={busy || !newUsername.trim()} style={{ marginLeft: 8 }}>
              {busy ? "Procesando..." : "Agregar"}
            </button>
          </div>

          {showAddById && (
            <div style={{ marginTop: 8 }}>
              <input
                placeholder="Agregar por user id"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                disabled={busy}
              />
              <button onClick={handleAddById} disabled={busy || !newUserId.trim()} style={{ marginLeft: 8 }}>
                {busy ? "Procesando..." : "Agregar por ID"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaboratorsList;
