import { useState } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { TattooManager } from './TattooManager';
import { FlashManager } from './FlashManager';
import { ProductManager } from './ProductManager';
import { EventManager } from './EventManager';
import { ReviewManager} from './ReviewManager';
import { ContentManager } from './ContentManager';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('tattoos');

  if (!isOpen) return null;

  const tabs = [
    { id: 'tattoos', label: 'Galerie', emoji: '🎨' },
    { id: 'flashes', label: 'Flashs', emoji: '⚡' },
    { id: 'products', label: 'Boutique', emoji: '🛍️' },
    { id: 'events', label: 'Événements', emoji: '📅' },
    { id: 'reviews', label: 'Avis', emoji: '⭐' },
    { id: 'content', label: 'Contenu', emoji: '📝' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'tattoos':
        return <TattooManager />;
      case 'flashes':
        return <FlashManager />;
      case 'products':
        return <ProductManager />;
      case 'events':
        return <EventManager />;
      case 'reviews':
        return <ReviewManager />;
      case 'content':
        return <ContentManager />;
      default:
        return <TattooManager />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-hidden">
      <div className="h-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-pink-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg animate-float">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Admin Kawaii
              </h1>
              <p className="text-sm font-handwritten text-pink-500">Gère ton univers magique</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-pink-600" />
          </button>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          <div className="w-64 bg-white border-r-2 border-pink-100 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-xl">{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
              <Heart className="w-8 h-8 text-pink-400 fill-pink-400 mx-auto mb-2 animate-bounce-slow" />
              <p className="text-sm text-center font-handwritten text-pink-600">
                Créé avec amour
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
