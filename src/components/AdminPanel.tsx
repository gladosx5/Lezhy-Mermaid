import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AdminDashboard } from './admin/AdminDashboard';

interface AdminPanelProps {
  currentPage: string;
}

export function AdminPanel({ currentPage }: AdminPanelProps) {
  const { isAdmin } = useAuth();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 animate-glow"
        >
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl p-4 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p className="text-sm font-medium text-gray-900 mb-2 font-handwritten">Mode Admin ✨</p>
          <p className="text-xs text-gray-600">Page: {currentPage}</p>
        </div>
      </div>

      <AdminDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
    </>
  );
}
