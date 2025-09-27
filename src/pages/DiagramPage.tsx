import React, { useEffect, useState } from 'react';
import { createDiagram, deleteDiagram, getDiagrams, updateDiagram } from '../api/diagrams';

const DiagramPage: React.FC = () => {
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchDiagrams = async () => {
    const data = await getDiagrams();
    setDiagrams(data);
  };

  useEffect(() => {
    fetchDiagrams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        await updateDiagram(editingId, { title, content });
    } else {
        await createDiagram({ title, content });
    }
    setTitle('');
    setContent('');
    setEditingId(null);
    fetchDiagrams();
  };

  const handleEdit = (d: any) => {
    setEditingId(d.id);
    setTitle(d.title);
    setContent(d.content);
  };

  const handleDelete = async (id: number) => {
    await deleteDiagram(id);
    fetchDiagrams();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Diagramas</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Contenido" required />
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <ul>
        {diagrams.map(d => (
          <li key={d.id}>
            {d.title}
            <button onClick={() => handleEdit(d)}>Editar</button>
            <button onClick={() => handleDelete(d.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiagramPage;
