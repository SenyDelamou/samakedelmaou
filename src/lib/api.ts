const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  github_url: string;
  demo_url: string | null;
  image_url: string | null;
  category: string;
  created_at: string;
}

export interface Message {
  name: string;
  email: string;
  message: string;
}

export const api = {
  // Récupérer tous les projets
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des projets');
    return response.json();
  },

  // Récupérer un projet par ID
  getProject: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du projet');
    return response.json();
  },

  // Envoyer un message de contact
  sendMessage: async (message: Message): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');
    return response.json();
  },
};
