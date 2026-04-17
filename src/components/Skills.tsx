import { useState, useEffect } from 'react';
import { Brain, Database, BarChart2, Code2, Server, Layers, Loader2 } from 'lucide-react';

const API_URL = 'https://backend-37sm.onrender.com/api';

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

interface SkillCategory {
  icon: React.ReactNode;
  label: string;
  color: string;
  description: string;
  skills: Skill[];
}

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; description: string }> = {
  'Expertise Mathématique et Statistique': {
    icon: <Brain className="w-5 h-5" />,
    color: 'cyan',
    description: "C'est le socle du métier. Il s'agit de comprendre ce qui se passe sous le capot des algorithmes. Statistiques descriptives et inférentielles, algèbre linéaire, calcul et probabilités pour modéliser l'incertitude."
  },
  'Programmation et Ingénierie des Données': {
    icon: <Database className="w-5 h-5" />,
    color: 'sky',
    description: "La capacité à transformer une idée en un outil fonctionnel. Python, R, SQL, Pandas, NumPy, écosystème Big Data (Spark, Hadoop), et Web Scraping."
  },
  'Machine Learning et Modélisation': {
    icon: <Layers className="w-5 h-5" />,
    color: 'blue',
    description: "La partie Intelligence Artificielle du métier. Apprentissage supervisé/non-supervisé, Deep Learning avec TensorFlow/PyTorch, et NLP pour le traitement du langage."
  },
  'Communication et Business Intelligence': {
    icon: <BarChart2 className="w-5 h-5" />,
    color: 'teal',
    description: "Savoir traduire les chiffres en décisions stratégiques. Data Visualization avec Matplotlib/Seaborn/Tableau, storytelling de données, et connaissance métier du secteur."
  },
  'Autre': {
    icon: <Code2 className="w-5 h-5" />,
    color: 'gray',
    description: "Autres compétences techniques et outils non spécifiques à la Data Science."
  },
};

const colorMap: Record<string, string> = {
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  sky: 'bg-sky-500',
  gray: 'bg-gray-500',
};

const iconColorMap: Record<string, string> = {
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  gray: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API_URL}/skills`);
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des compétences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Grouper les compétences par catégorie
  const categories: SkillCategory[] = Object.entries(
    skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>)
  ).map(([label, skills]) => {
    const config = categoryConfig[label] || { icon: <Brain className="w-5 h-5" />, color: 'cyan', description: '' };
    return {
      icon: config.icon,
      label,
      color: config.color,
      description: config.description,
      skills,
    };
  });

  // Extraire tous les outils uniques
  const tools = Array.from(new Set(skills.map(s => s.name)));

  if (loading) {
    return (
      <section id="skills" className="bg-gray-950 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="bg-gray-950 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">Ce que j'utilise</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">Compétences techniques</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Une sélection d'outils et frameworks que j'utilise quotidiennement pour construire des produits de données évolutifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2 rounded-lg border ${iconColorMap[cat.color]}`}>
                  {cat.icon}
                </div>
                <h3 className="text-white font-bold">{cat.label}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{cat.description}</p>
              <div className="space-y-3">
                {cat.skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorMap[cat.color]} transition-all duration-700`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm mb-5 uppercase tracking-widest">Stack technique en un coup d'œil</p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <span
                key={tool}
                className="bg-gray-900 border border-gray-800 text-gray-300 text-sm font-medium px-4 py-2 rounded-full hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-200 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
