import { Github, Linkedin, Download, ArrowDown, Eye, X, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Hero() {
  const [projectCount, setProjectCount] = useState(0);
  const [cvUrl, setCvUrl] = useState('/cv.pdf');
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  useEffect(() => {
    // ... (fetch stats remains same)
    const fetchStats = async () => {
      try {
        const [projRes, cvRes] = await Promise.all([
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/auth/cv`)
        ]);

        if (projRes.ok) {
          const projects = await projRes.json();
          setProjectCount(projects.length);
        }

        if (cvRes.ok) {
          const data = await cvRes.json();
          setCvUrl(data.cv_url || '/cv.pdf');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchStats();
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '48px 48px'}} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Disponible pour travailler
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4">
            Samaké
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              DELAMOU
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
            Étudiant en informatique L3 à l'Université de Labé, passionné par la data.
            Je me spécialise dans l'analyse de données, le Machine Learning et la visualisation de données
            pour transformer les informations en décisions éclairées.
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <a
              href="#projects"
              className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-7 py-3 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              Voir les projets
            </a>
            <button
              onClick={() => setIsCvModalOpen(true)}
              className="flex items-center gap-2 border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-semibold px-7 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              CV
            </button>
          </div>

          {/* CV Modal */}
          {isCvModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="relative w-full max-w-5xl h-[90vh] bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Visionneuse de CV Sécurisée</h3>
                      <p className="text-xs text-gray-500">Capture d'écran et copie désactivées pour protéger les données.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={cvUrl}
                      download="CV_Samake_DELAMOU.pdf"
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-sm font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </a>
                    <button
                      onClick={() => setIsCvModalOpen(false)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content - The CV Viewer */}
                <div className="flex-1 relative overflow-hidden bg-gray-800 select-none group" 
                     onContextMenu={(e) => e.preventDefault()}
                >
                  {/* Extreme Protection Overlay - Blurs when cursor leaves or window loses focus */}
                  <div className="absolute inset-0 z-50 pointer-events-none transition-all duration-300 backdrop-blur-0 group-hover:backdrop-blur-0 backdrop-blur-3xl bg-gray-950/20 flex items-center justify-center opacity-0 group-hover:opacity-0 opacity-100">
                     <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 text-center">
                        <ShieldAlert className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-bounce" />
                        <p className="text-white font-bold">Document Protégé</p>
                        <p className="text-gray-400 text-sm">Survolez pour visualiser</p>
                     </div>
                  </div>

                  {/* Moving Watermark */}
                  <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full flex flex-wrap gap-20 opacity-[0.05] rotate-[-35deg] scale-150">
                      {[...Array(20)].map((_, i) => (
                        <span key={i} className="text-white font-black text-2xl whitespace-nowrap">
                          CONFIDENTIAL - {new Date().toLocaleDateString()} - {new Date().toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* The CV Iframe */}
                  <iframe
                    src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none pointer-events-auto filter grayscale-[0.2]"
                    title="Curriculum Vitae"
                  />
                  
                  {/* Anti-print protection - CSS that hides content when printing */}
                  <style>{`
                    @media print {
                      body { display: none !important; }
                    }
                  `}</style>

                  {/* Floating protection message */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-950/80 px-4 py-2 rounded-full border border-gray-800 text-gray-400 text-xs flex items-center gap-2 z-20">
                    <ShieldAlert className="w-3 h-3 text-cyan-500" />
                    Protection Anti-Capture Activée
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-5 mt-10 justify-center md:justify-start">
            <a href="https://github.com/Delamou1234" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors duration-200">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/samake-delamou" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors duration-200">
              <Linkedin className="w-5 h-5" />
            </a>
            <div className="h-px w-16 bg-gray-700" />
            <span className="text-gray-600 text-sm">@SamakeDelamou</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-2xl" />
            <div className="relative w-full h-full rounded-full border-2 border-cyan-500/20 overflow-hidden bg-gray-900 flex items-center justify-center">
              <img
                src="/profile.jpg"
                alt="Samaké DELAMOU"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-2 shadow-xl">
              <p className="text-xs text-gray-500">Expérience</p>
              <p className="text-white font-bold text-lg">3+ Years</p>
            </div>
            <div className="absolute -top-4 -left-4 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-2 shadow-xl">
              <p className="text-xs text-gray-500">Projets</p>
              <p className="text-white font-bold text-lg">{projectCount}</p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#skills"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-cyan-400 transition-colors animate-bounce"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
}
