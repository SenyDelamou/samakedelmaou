import { useState, useEffect } from 'react';
import { Loader2, FolderOpen, X, Github, ExternalLink, Tag } from 'lucide-react';
import { api, type Project } from '../lib/api';
import ProjectCard from './ProjectCard';

const categories = ['Tous', 'Machine Learning', 'NLP', 'Visualisation de données', 'Vision par ordinateur'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = activeCategory === 'Tous'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="bg-gray-950 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">Ce que j'ai construit</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">Projets en vedette</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Une sélection de projets réels couvrant la modélisation prédictive, le NLP, la vision par ordinateur et le dashboarding.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <FolderOpen className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">Aucun projet trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal pour les détails du projet */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {selectedProject.image_url && (
                <div className="md:w-1/2 p-6 flex-shrink-0">
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-64 md:h-full object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="md:w-1/2 p-6 overflow-y-auto flex-1">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                    <Tag className="w-3 h-3" />
                    {selectedProject.category}
                  </span>
                </div>

                <p className="text-gray-300 text-base mb-6 leading-relaxed">{selectedProject.description}</p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Technologies utilisées</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools.map((tool) => (
                      <span
                        key={tool}
                        className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-md font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white font-medium transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    Voir le code
                  </a>
                  {selectedProject.demo_url && (
                    <a
                      href={selectedProject.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                    >
                      Démo en direct
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
