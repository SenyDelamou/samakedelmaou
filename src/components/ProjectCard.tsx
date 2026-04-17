import { Github, ExternalLink, Tag } from 'lucide-react';
import type { Project } from '../lib/api';

const categoryColors: Record<string, string> = {
  'Machine Learning': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'NLP': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Visualisation de données': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'Vision par ordinateur': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const categoryStyle = categoryColors[project.category] ?? 'bg-gray-700/20 text-gray-400 border-gray-700/30';

  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
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
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${categoryStyle}`}>
            <Tag className="w-3 h-3" />
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-md font-medium"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white font-medium transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            Voir le code
          </a>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 ml-auto"
            >
              Démo en direct
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
