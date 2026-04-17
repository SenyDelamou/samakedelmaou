import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api, type Project } from '../../lib/api';

const API_URL = 'https://backend-37sm.onrender.com/api';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tools: '',
    github_url: '',
    demo_url: '',
    image_url: '',
    category: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      tools: '',
      github_url: '',
      demo_url: '',
      image_url: '',
      category: ''
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tools: project.tools.join(', '),
      github_url: project.github_url,
      demo_url: project.demo_url || '',
      image_url: project.image_url || '',
      category: project.category
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    try {
      await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE'
      });
      fetchProjects();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      tools: formData.tools.split(',').map(t => t.trim()).filter(t => t)
    };

    try {
      if (editingProject) {
        await fetch(`${API_URL}/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      } else {
        await fetch(`${API_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      }
      
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Gestion des projets</h2>
        <button
          onClick={handleCreate}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Nouveau projet</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Mobile: cartes */}
      <div className="sm:hidden space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-white font-semibold">{project.title}</p>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-300 p-2">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-xs inline-block mb-2">
              {project.category}
            </span>
            <p className="text-gray-400 text-sm">{project.tools.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Desktop: tableau */}
      <div className="hidden sm:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left text-gray-400 font-medium p-4">Titre</th>
              <th className="text-left text-gray-400 font-medium p-4">Catégorie</th>
              <th className="text-left text-gray-400 font-medium p-4">Outils</th>
              <th className="text-right text-gray-400 font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-gray-800">
                <td className="p-4 text-white">{project.title}</td>
                <td className="p-4">
                  <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-sm">
                    {project.category}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {project.tools.join(', ')}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-400 hover:text-blue-300 p-2 transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Outils (séparés par des virgules)</label>
                <input
                  type="text"
                  value={formData.tools}
                  onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Demo URL (optionnel)</label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Image URL (optionnel)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="NLP">NLP</option>
                  <option value="Visualisation de données">Visualisation de données</option>
                  <option value="Vision par ordinateur">Vision par ordinateur</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingProject ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
