// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";

interface Project { id: number; name: string; description?: string; created_at?: string; }
interface Collaborator { id: number; username: string; first_name?: string; last_name?: string; email?: string; }

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProjects = await axios.get<Project[]>("/projects/");
        setProjects(resProjects.data.slice(0,6));
        const resCollabs = await axios.get<Collaborator[]>("/collaborators/");
        setCollaborators(resCollabs.data.slice(0,6));
      } catch(err){ console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if(loading) return <div className="flex justify-center items-center h-full"><p>Cargando...</p></div>;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-emerald-700">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen de tus proyectos y colaboradores.</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-start">
          <span className="text-sm opacity-80">Proyectos</span>
          <span className="text-3xl font-bold mt-2">{projects.length}</span>
        </div>
        <div className="bg-emerald-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-start">
          <span className="text-sm opacity-80">Colaboradores</span>
          <span className="text-3xl font-bold mt-2">{collaborators.length}</span>
        </div>
        <div className="bg-emerald-600 text-white rounded-xl p-6 flex flex-col items-start shadow-lg">
          <span className="text-sm opacity-80">Diagramas</span>
          <span className="text-3xl font-bold mt-2">--</span>
        </div>
      </div>

      {/* Proyectos recientes */}
      <div>
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Proyectos recientes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p=>(
            <div key={p.id} className="bg-white rounded-2xl shadow-lg border-l-4 border-emerald-600 p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-emerald-700">{p.name}</h3>
                <p className="text-gray-600 mt-2">{p.description || "Sin descripción"}</p>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Link to={`/projects/${p.id}`} className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Ver</Link>
                <Link to={`/projects/${p.id}/edit`} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">Editar</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colaboradores recientes */}
      <div>
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Colaboradores recientes</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {collaborators.map(c=>(
            <div key={c.id} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 border-l-4 border-emerald-600 hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                {c.first_name?.[0] || c.username[0]}{c.last_name?.[0] || ""}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-emerald-700">{c.username}</span>
                <span className="text-gray-500 text-sm">{c.email || "Sin email"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
