import { useState } from 'react';
import { Send, Mail, Github, Linkedin, CheckCircle, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { api, type Message } from '../lib/api';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [form, setForm] = useState<Message>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.sendMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAiHelp = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    try {
      const prompt = form.message.trim()
        ? `Améliore et reformule ce message de contact de manière professionnelle et convaincante, en gardant le même sens. Retourne uniquement le message reformulé, sans guillemets ni explications : "${form.message}"`
        : `Rédige un message de contact professionnel pour un Data Scientist. Le message doit exprimer un intérêt pour une collaboration ou un projet lié à la data science. Retourne uniquement le message, sans guillemets ni explications.`;

      const response = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          setForm((prev) => ({ ...prev, message: data.response.trim() }));
        }
      }
    } catch (error) {
      console.error('Erreur aide IA:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-gray-950 py-28 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">Contactez-moi</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">Travaillons ensemble</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Un défi de données ? Vous cherchez un Data Scientist pour rejoindre votre équipe ?
            J'aimerais avoir de vos nouvelles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Connectons-nous</h3>
              <p className="text-gray-500 leading-relaxed">
                Que ce soit pour un projet freelance, une opportunité à temps plein, ou simplement une conversation
                sur les données — ma boîte de réception est toujours ouverte.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:samakedelamou858@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-200">
                  <Mail className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="text-gray-300 text-sm font-medium group-hover:text-cyan-400 transition-colors">samakedelamou858@gmail.com</p>
                </div>
              </a>

              <a
                href="https://github.com/Delamou1234"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-200">
                  <Github className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">GitHub</p>
                  <p className="text-gray-300 text-sm font-medium group-hover:text-cyan-400 transition-colors">github.com/Delamou1234</p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/samake-delamou"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-200">
                  <Linkedin className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">LinkedIn</p>
                  <p className="text-gray-300 text-sm font-medium group-hover:text-cyan-400 transition-colors">linkedin.com/in/samake-delamou</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jean@exemple.com"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Message
                  </label>
                  <button
                    type="button"
                    onClick={handleAiHelp}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Rédaction...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Aide IA
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Parlez-moi de votre projet ou opportunité... Cliquez sur Aide IA pour être assisté dans la rédaction."
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 resize-none"
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-3 bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-3 text-teal-400 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Message envoyé avec succès ! Je vous répondrai bientôt.
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Une erreur s'est produite. Veuillez réessayer.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/40 disabled:cursor-not-allowed text-gray-950 font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-sm">
          <p>2024 Samaké DELAMOU - Étudiant en informatique L3 à l'Université de Labé.</p>
          <div className="flex items-center gap-4">
            <p>Passionné par la data.</p>
            <a href="/admin" className="text-gray-700 hover:text-cyan-400 transition-colors">Admin</a>
          </div>
        </div>
      </div>
    </section>
  );
}
