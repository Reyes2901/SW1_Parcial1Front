// src/layouts/Layout.tsx
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getInitials = (user: any) => {
  if (!user) return "U";
  const name = (user.first_name || "") + " " + (user.last_name || "");
  if (name.trim()) {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return (user.username || "U").slice(0, 2).toUpperCase();
};

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const onResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = getInitials(user);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {initials}
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-700">Mi App</div>
              <div className="text-xs text-gray-500">v.dev</div>
            </div>
          </div>
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link to="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            Dashboard
          </Link>
          <Link to="/projects" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            Mis proyectos
          </Link>
          <Link to="/profile" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
            Mi perfil
          </Link>
          <hr className="my-2" />
          <button
            onClick={() => navigate("/projects/new")}
            className="w-full text-left px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            + Crear proyecto
          </button>
        </nav>

        <div className="mt-auto p-4 border-t flex flex-col gap-2">
          <button
            className="w-full px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => navigate("/profile")}
          >
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Salir
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Navbar fijo */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-20 md:left-64">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded hover:bg-gray-100 md:hidden"
              onClick={() => setSidebarOpen((s) => !s)}
            >
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>
            <h1 className="text-xl font-bold text-emerald-700">Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-sm text-gray-600">Hola, <b>{user?.username}</b></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
              {initials}
            </div>
          </div>
        </header>

        {/* Main content scrollable */}
        <main className="flex-1 pt-20 pb-6 px-4 md:px-6 lg:px-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
