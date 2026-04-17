import { useState, useEffect } from 'react';
import { Loader2, FolderOpen } from 'lucide-react';
import { api, type Project } from '../lib/api';
import ProjectCard from './ProjectCard';

const categories = ['Tous', 'Machine Learning', 'NLP', 'Visualisation de données', 'Vision par ordinateur'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');

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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
