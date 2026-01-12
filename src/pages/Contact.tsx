import { useState, useEffect } from 'react';
import { Mail, Instagram, Send, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DecorativeSection } from '../components/DecorativeSection';
import { MagicButton } from '../components/MagicButton';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', 'contact');

    if (data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <DecorativeSection
      decorations={[
        { type: 'emoji', emoji: '💌', position: { top: '5%', left: '4%' }, size: 'md', opacity: 0.07, delay: 0 },
        { type: 'emoji', emoji: '✨', position: { top: '20%', right: '6%' }, size: 'sm', opacity: 0.08, delay: 1 },
        { type: 'heart', position: { bottom: '15%', left: '8%' }, size: 'sm', opacity: 0.09, delay: 2 },
        { type: 'emoji', emoji: '🌸', position: { bottom: '30%', right: '4%' }, size: 'md', opacity: 0.06, delay: 1.5 },
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20 texture-grain">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4 animate-float-gentle">
              <Heart className="w-5 h-5 text-pink-400 fill-pink-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Restons en contact</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 text-shadow-glow">
              {content.title || 'Contact'}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              {content.description || 'Envoyez-moi votre projet et je vous répondrai dans les meilleurs délais!'}
            </p>
            <p className="handwritten text-pink-500 text-xl animate-float-gentle">
              J'ai hâte de lire ton projet
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 card-kawaii relative overflow-hidden">
              <div className="absolute top-3 right-3 text-3xl opacity-10 animate-float-slow">💌</div>
              <div className="absolute bottom-3 left-3 text-2xl opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>✨</div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">Envoyez-moi un message</h2>

              {submitSuccess && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 flex items-center space-x-3 animate-float-gentle">
                  <Heart className="w-6 h-6 text-green-500 fill-green-500 animate-pulse" />
                  <p className="text-green-700 font-medium">Message envoyé avec succès! Je vous répondrai bientôt</p>
                </div>
              )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre projet de tatouage
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez-moi votre projet: style souhaité, emplacement, taille, inspirations..."
                />
              </div>

              <MagicButton
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                icon={Send}
                className="w-full"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}
              </MagicButton>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl shadow-2xl p-8 text-white card-kawaii relative overflow-hidden">
              <div className="absolute top-2 right-2 text-3xl opacity-20 animate-float-slow">✨</div>
              <Instagram className="w-12 h-12 mb-4 animate-float-gentle" />
              <h3 className="text-2xl font-bold mb-2 relative">Instagram</h3>
              <p className="text-white/90 mb-6">
                Suivez-moi sur Instagram pour voir mes dernières créations et rester informé des disponibilités!
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-pink-600 px-6 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Suivre @lezhymermaid
              </a>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 card-kawaii relative overflow-hidden">
              <div className="absolute top-2 right-2 text-3xl opacity-10 animate-float-slow">💌</div>
              <Mail className="w-12 h-12 text-purple-400 mb-4 animate-float-gentle" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 relative">Email</h3>
              <p className="text-gray-600 mb-4">
                Vous préférez m'écrire directement par email?
              </p>
              <a
                href="mailto:contact@lezhymermaid.com"
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
              >
                contact@lezhymermaid.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-pink-200 p-8 card-kawaii relative overflow-hidden">
              <div className="absolute bottom-2 right-2 text-4xl opacity-10 animate-float-slow">🌸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative">Informations importantes</h3>
              <ul className="space-y-3 text-gray-600 relative">
                <li className="flex items-center space-x-2">
                  <span className="text-pink-400">✨</span>
                  <span>Je réponds généralement sous 48h</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-pink-400">💖</span>
                  <span>Soyez précis dans votre description</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-pink-400">🎨</span>
                  <span>Les références visuelles sont les bienvenues</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-pink-400">📅</span>
                  <span>Pensez à consulter mes disponibilités</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </DecorativeSection>
  );
}
