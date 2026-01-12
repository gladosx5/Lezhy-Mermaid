import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Flashes } from './pages/Flashes';
import { Availability } from './pages/Availability';
import { Events } from './pages/Events';
import { Contact } from './pages/Contact';
import { Shop } from './pages/Shop';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const renderPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={onNavigate} />;
      case 'about':
        return <About />;
      case 'gallery':
        return <Gallery />;
      case 'flashes':
        return <Flashes />;
      case 'availability':
        return <Availability />;
      case 'events':
        return <Events />;
      case 'contact':
        return <Contact />;
      case 'shop':
        return <Shop />;
      default:
        return <Home onNavigate={onNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1">
          {renderPage({ onNavigate: setCurrentPage })}
        </main>
        <Footer onOpenAdminLogin={() => setIsLoginOpen(true)} />
        <AdminLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <AdminPanel currentPage={currentPage} />
      </div>
    </AuthProvider>
  );
}

export default App;
