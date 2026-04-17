import { useState } from 'react';
import { LayoutDashboard, MessageSquare, FolderKanban, LogOut, Users, Zap } from 'lucide-react';
import ProjectsAdmin from './ProjectsAdmin';
import MessagesAdmin from './MessagesAdmin';
import SkillsAdmin from './SkillsAdmin';

type AdminView = 'dashboard' | 'projects' | 'messages' | 'skills';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md">
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
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h1 className="text-xl font-bold text-white mb-8">Delamou</h1>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </button>
          
          <button
            onClick={() => setActiveView('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'projects'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            Projets
          </button>
          
          <button
            onClick={() => setActiveView('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'messages'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>
          
          <button
            onClick={() => setActiveView('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'skills'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Zap className="w-5 h-5" />
            Compétences
          </button>
        </nav>

        <div className="absolute bottom-6 left-6">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeView === 'dashboard' && <DashboardHome />}
        {activeView === 'projects' && <ProjectsAdmin />}
        {activeView === 'messages' && <MessagesAdmin />}
        {activeView === 'skills' && <SkillsAdmin />}
      </div>
    </div>
  );
}

function DashboardHome() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <FolderKanban className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">4</span>
          </div>
          <p className="text-gray-400">Projets</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">0</span>
          </div>
          <p className="text-gray-400">Messages</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">--</span>
          </div>
          <p className="text-gray-400">Visiteurs</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 p-4 rounded-lg hover:bg-cyan-500/20 transition-colors">
            <FolderKanban className="w-6 h-6 mb-2" />
            <span className="font-medium">Ajouter un projet</span>
          </button>
          <button className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg hover:bg-blue-500/20 transition-colors">
            <MessageSquare className="w-6 h-6 mb-2" />
            <span className="font-medium">Voir les messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
