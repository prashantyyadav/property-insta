import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeedView from './components/FeedView';
import FilterSidebar from './components/FilterSidebar';
import ReelsView from './components/ReelsView';
import MapView from './components/MapView';
import SavedView from './components/SavedView';
import BlogView from './components/BlogView';
import Modals from './components/Modals';
import Footer, { MobileNav, ChatWidget } from './components/Footer';
import './styles/styles.scss';

function AppLayout() {
  const { currentView, darkMode, dbStatus, dbMsg } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return (
          <div className="ig-main-layout">
            <FilterSidebar />
            <main className="ig-feed">
              <FeedView />
            </main>
          </div>
        );
      case 'reels':
        return <ReelsView />;
      case 'mapView':
        return <MapView />;
      case 'saved':
        return <SavedView />;
      case 'blog':
        return <BlogView />;
      default:
        return (
          <div className="ig-main-layout">
            <FilterSidebar />
            <main className="ig-feed">
              <FeedView />
            </main>
          </div>
        );
    }
  };

  return (
    <div className={`app-root ${darkMode ? 'dark' : ''}`}>
      {/* Debug: Supabase connection status */}
      <div style={{
        background: dbStatus === 'connected' ? '#d4edda' : dbStatus === 'error' ? '#f8d7da' : dbStatus === 'connecting' ? '#fff3cd' : '#e2e3e5',
        color: dbStatus === 'connected' ? '#155724' : dbStatus === 'error' ? '#721c24' : dbStatus === 'connecting' ? '#856404' : '#383d41',
        padding: '4px 16px',
        fontSize: '12px',
        textAlign: 'center',
        fontFamily: 'monospace',
        position: 'relative',
        zIndex: 9999,
      }}>
        DB: <strong>{dbStatus}</strong> — {dbMsg}
      </div>
      <Header />
      {currentView === 'feed' && <HeroBanner />}
      {renderView()}
      <Footer />
      <MobileNav />
      <ChatWidget />
      <Modals />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </AuthProvider>
  );
}
