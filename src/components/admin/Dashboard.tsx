import { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, MessageSquare, FolderKanban, LogOut, Zap, Download, Upload, Plus, Settings, ShieldCheck, KeyRound } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import ProjectsAdmin from './ProjectsAdmin';
import MessagesAdmin from './MessagesAdmin';
import SkillsAdmin from './SkillsAdmin';

const API_URL = 'http://localhost:5000/api';

type AdminView = 'dashboard' | 'projects' | 'messages' | 'skills' | 'settings';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsLoggedIn(true);
        setFailedAttempts(0);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          await fetch(`${API_URL}/security/alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              attempts: newAttempts,
              userAgent: navigator.userAgent
            })
          });
          alert('Sécurité : Trop de tentatives échouées. Une alerte a été envoyée.');
        } else {
          alert(`Mot de passe incorrect. Tentatives restantes : ${3 - newAttempts}`);
        }
      }
    } catch (error) {
      console.error('Erreur login:', error);
      alert('Erreur de connexion au serveur');
    }
  };
  const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0 });
  const [fullData, setFullData] = useState<{ projects: any[], messages: any[], skills: any[] }>({
    projects: [],
    messages: [],
    skills: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn]);

  const fetchStats = async () => {
    setIsLoading(true);
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
      setFullData({ projects, messages, skills });
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex font-sans">
        {/* Left Side: Image (Visible on Desktop) */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <img 
            src="/login-bg.png" 
            alt="Admin Login Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/40 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Espace Admin</h1>
            <p className="text-xl text-gray-300 max-w-md">
              Gérez votre portfolio, vos messages et vos compétences en toute simplicité.
            </p>
          </div>
          <div className="absolute bottom-12 left-12 flex items-center gap-2 text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-sm font-medium uppercase tracking-widest">Système sécurisé</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-950">
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-700">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 md:hidden">
                 <h2 className="text-2xl font-bold text-cyan-400">D</h2>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenue</h2>
              <p className="text-gray-400">Veuillez entrer votre mot de passe pour accéder au tableau de bord.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-3">Mot de passe administrateur</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="••••••••"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transform active:scale-[0.98] transition-all"
                >
                  Déverrouiller
                </button>

                <div className="flex items-center justify-center pt-4">
                   <p className="text-gray-500 text-xs uppercase tracking-tighter">Accès restreint aux administrateurs autorisés</p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <a href="/" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors flex items-center justify-center md:justify-start gap-2">
                ← Retour au site public
              </a>
            </div>
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
            onClick={() => setActiveView('settings')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-base ${
              activeView === 'settings'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Paramètres</span>
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
        {activeView === 'dashboard' && <DashboardHome stats={stats} data={fullData} onRefresh={fetchStats} isLoading={isLoading} />}
        {activeView === 'projects' && <ProjectsAdmin />}
        {activeView === 'messages' && <MessagesAdmin />}
        {activeView === 'skills' && <SkillsAdmin />}
        {activeView === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}

function SettingsView() {
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setIsChanging(true);
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwords.old,
          newPassword: passwords.new
        })
      });

      if (response.ok) {
        alert('Mot de passe mis à jour avec succès !');
        setPasswords({ old: '', new: '', confirm: '' });
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      alert('Erreur de connexion au serveur');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-white mb-8">Paramètres de sécurité</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Changer le mot de passe admin</h3>
            <p className="text-gray-400 text-sm">Sécurisez l'accès à votre tableau de bord.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Ancien mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={passwords.old}
                  onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Mot de passe actuel"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Nouveau"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Confirmer le nouveau</label>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Confirmer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isChanging}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {isChanging ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CV Management */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Gestion du CV</h3>
            <p className="text-gray-400 text-sm">Définissez le lien vers votre CV (PDF ou lien externe).</p>
          </div>
        </div>

        <div className="p-6">
           <form onSubmit={async (e) => {
             e.preventDefault();
             const cv_url = (e.currentTarget.elements.namedItem('cv_url') as HTMLInputElement).value;
             const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
             
             try {
               const res = await fetch(`${API_URL}/auth/update-cv`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ password, cv_url })
               });
               if (res.ok) alert('CV mis à jour !');
               else alert('Erreur : Mot de passe incorrect');
             } catch (error) {
               alert('Erreur de connexion');
             }
           }} className="space-y-4">
             <div>
               <label className="block text-gray-400 text-sm font-medium mb-2">Lien du CV (URL ou /cv.pdf)</label>
               <input
                 name="cv_url"
                 type="text"
                 className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                 placeholder="https://drive.google.com/..."
               />
             </div>
             <div>
               <label className="block text-gray-400 text-sm font-medium mb-2">Mot de passe pour confirmer</label>
               <input
                 name="password"
                 type="password"
                 className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                 placeholder="••••••••"
               />
             </div>
             <button
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
             >
               Enregistrer le nouveau lien
             </button>
           </form>
        </div>
      </div>

      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4">
        <div className="text-blue-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-blue-400 font-bold mb-1">Astuce sécurité</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Utilisez un mot de passe fort combinant des lettres majuscules, minuscules, des chiffres et des caractères spéciaux. 
          </p>
        </div>
      </div>
    </div>
  );
}

interface DashboardHomeProps {
  stats: { projects: number; messages: number; skills: number };
  data: { projects: any[]; messages: any[]; skills: any[] };
  onRefresh: () => void;
  isLoading: boolean;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

function DashboardHome({ stats, data, onRefresh, isLoading }: DashboardHomeProps) {
  // Calcul des données pour les graphiques
  const projectStats = useMemo(() => {
    const categories: Record<string, number> = {};
    data.projects.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [data.projects]);

  const skillStats = useMemo(() => {
    const categories: Record<string, number> = {};
    data.skills.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [data.skills]);

  const messageTimeline = useMemo(() => {
    // Grouper les messages par date (7 derniers jours par exemple)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = data.messages.filter(m => m.createdAt?.startsWith(date)).length;
      return { 
        date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), 
        count 
      };
    });
  }, [data.messages]);

  const handleExport = async () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.projects, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "projects_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Erreur export:', error);
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
        }
      } catch (error) {
        alert('Erreur lors de l\'importation');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Tableau de bord</h2>
        <button 
          onClick={onRefresh}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="Actualiser les données"
        >
          <Zap className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <FolderKanban className="w-16 h-16 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Projets</p>
          <h3 className="text-4xl font-bold text-white mb-4">{stats.projects}</h3>
          <div className="flex items-center gap-2 text-cyan-400 text-sm">
            <span className="bg-cyan-500/10 px-2 py-0.5 rounded">+ {data.projects.filter(p => {
              const d = new Date(p.createdAt);
              const now = new Date();
              return d > new Date(now.setDate(now.getDate() - 30));
            }).length} ce mois</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-16 h-16 text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Messages Reçus</p>
          <h3 className="text-4xl font-bold text-white mb-4">{stats.messages}</h3>
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <span className="bg-blue-500/10 px-2 py-0.5 rounded">Activité récente</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Zap className="w-16 h-16 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Compétences</p>
          <h3 className="text-4xl font-bold text-white mb-4">{stats.skills}</h3>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <span className="bg-green-500/10 px-2 py-0.5 rounded">{skillStats.length} catégories</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects by Category */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h4 className="text-lg font-bold text-white mb-6">Projets par Catégorie</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Messages Activity */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h4 className="text-lg font-bold text-white mb-6">Activité des Messages (7 jours)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={messageTimeline}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Distribution */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h4 className="text-lg font-bold text-white mb-6">Répartition des Compétences</h4>
          <div className="h-64 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {skillStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2">
              {skillStats.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-gray-400">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h4 className="text-lg font-bold text-white mb-6">Actions rapides</h4>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-white transition-all group">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium">Nouveau projet</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-white transition-all group"
            >
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </div>
              <span className="font-medium">Exporter</span>
            </button>
            <label className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-white transition-all group cursor-pointer">
              <div className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <span className="font-medium">Importer</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
