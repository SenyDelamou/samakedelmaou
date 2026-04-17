import { Tag } from 'lucide-react';
import type { Project } from '../lib/api';

const categoryColors: Record<string, string> = {
  'Machine Learning': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'NLP': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Visualisation de données': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'Vision par ordinateur': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const categoryStyle = categoryColors[project.category] ?? 'bg-gray-700/20 text-gray-400 border-gray-700/30';

  return (
    <div
      onClick={onClick}
      className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 flex flex-col"
    >
      <div className="relative h-36 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url || ''}
            alt={project.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-2 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded bg-cyan-400"
                  style={{ opacity: Math.random() * 0.8 + 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryStyle}`}>
            <Tag className="w-3 h-3" />
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-bold text-sm mb-2 group-hover:text-cyan-400 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {project.description}
        </p>
        <p className="text-cyan-400 text-xs font-medium group-hover:underline">
          Voir les détails →
        </p>
      </div>
    </div>
  );
}
