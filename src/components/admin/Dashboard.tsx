import { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, FolderKanban, LogOut, Zap, Download, Upload } from 'lucide-react';
import ProjectsAdmin from './ProjectsAdmin';
import MessagesAdmin from './MessagesAdmin';
import SkillsAdmin from './SkillsAdmin';

const API_URL = 'https://backend-37sm.onrender.com/api';

type AdminView = 'dashboard' | 'projects' | 'messages' | 'skills';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0 });

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn]);

  const fetchStats = async () => {
    try {
      const [projectsRes, messagesRes, skillsRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/messages`),
        fetch(`${API_URL}/skills`)
      ]);

      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const messages = messagesRes.ok ? await messagesRes.json() : [];
      const skills = skillsRes.ok ? await skillsRes.json() : [];

      setStats({
        projects: projects.length,
        messages: messages.length,
        skills: skills.length
      });
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Delamou</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && password === 'Delamou25@' && setIsLoggedIn(true)}
                placeholder="Entrez le mot de passe"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={() => password === 'Delamou25@' && setIsLoggedIn(true)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col sm:flex-row">
      {/* Sidebar - bottom bar on mobile, fixed side on desktop */}
      <div className="sm:w-64 bg-gray-900 border-t sm:border-t-0 sm:border-r border-gray-800 p-2 sm:p-6 fixed bottom-0 left-0 right-0 sm:fixed sm:top-0 sm:left-0 sm:right-auto sm:h-screen z-40 sm:z-auto">
        <h1 className="hidden sm:block text-xl font-bold text-white mb-8">Delamou</h1>

        <nav className="flex sm:flex-col justify-around sm:justify-start sm:space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-base ${
              activeView === 'dashboard'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </button>

          <button
            onClick={() => setActiveView('projects')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-base ${
              activeView === 'projects'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            <span className="hidden sm:inline">Projets</span>
          </button>

          <button
            onClick={() => setActiveView('messages')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-base ${
              activeView === 'messages'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Messages</span>
          </button>

          <button
            onClick={() => setActiveView('skills')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-base ${
              activeView === 'skills'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="hidden sm:inline">Compétences</span>
          </button>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 pb-20 sm:pb-8 sm:ml-64">
        {activeView === 'dashboard' && <DashboardHome stats={stats} onRefresh={fetchStats} />}
        {activeView === 'projects' && <ProjectsAdmin />}
        {activeView === 'messages' && <MessagesAdmin />}
        {activeView === 'skills' && <SkillsAdmin />}
      </div>
    </div>
  );
}

function DashboardHome({ stats, onRefresh }: { stats: { projects: number; messages: number; skills: number }, onRefresh: () => void }) {
  const handleExport = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const projects = await res.json();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "projects_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'exportation');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const response = await fetch(`${API_URL}/projects/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });

        if (response.ok) {
          alert('Importation réussie !');
          onRefresh();
        } else {
          alert('Erreur lors de l\'importation');
        }
      } catch (error) {
        console.error('Erreur import:', error);
        alert('Fichier JSON invalide');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Tableau de bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <FolderKanban className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">{stats.projects}</span>
          </div>
          <p className="text-gray-400">Projets</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{stats.messages}</span>
          </div>
          <p className="text-gray-400">Messages</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{stats.skills}</span>
          </div>
          <p className="text-gray-400">Compétences</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 p-4 rounded-lg hover:bg-cyan-500/20 transition-colors flex flex-col items-center text-center">
            <FolderKanban className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Ajouter un projet</span>
          </button>
          <button className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg hover:bg-blue-500/20 transition-colors flex flex-col items-center text-center">
            <MessageSquare className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Voir les messages</span>
          </button>
          <button 
            onClick={handleExport}
            className="bg-purple-500/10 border border-purple-500/20 text-purple-400 p-4 rounded-lg hover:bg-purple-500/20 transition-colors flex flex-col items-center text-center"
          >
            <Download className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Exporter Projets</span>
          </button>
          <label className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg hover:bg-green-500/20 transition-colors flex flex-col items-center text-center cursor-pointer">
            <Upload className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Importer Projets</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
