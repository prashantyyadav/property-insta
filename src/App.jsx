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
  const { currentView, darkMode, dbDiag, allProperties } = useApp();

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

  // DIAGNOSTIC: show Supabase connection state
  const diagBg = dbDiag.status === 'success' ? '#059669' : dbDiag.status === 'error' || dbDiag.status === 'exception' ? '#dc2626' : dbDiag.status === 'connecting' ? '#d97706' : '#6b7280';

  return (
    <div className={`app-root ${darkMode ? 'dark' : ''}`}>
      {/* DIAGNOSTIC BANNER */}
      <div style={{
        background: diagBg, color: '#fff', padding: '8px 16px', fontSize: '12px',
        fontFamily: 'monospace', textAlign: 'center', position: 'sticky', top: 0, zIndex: 9999,
        display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap'
      }}>
        <span>STATUS: <b>{dbDiag.status}</b></span>
        <span>URL: {dbDiag.url || '—'}</span>
        <span>RAW: <b>{dbDiag.raw}</b></span>
        <span>MAPPED: <b>{dbDiag.mapped}</b></span>
        <span>MERGED: <b>{dbDiag.merged}</b></span>
        <span>TOTAL: <b>{allProperties.length}</b></span>
        {dbDiag.error && <span style={{color:'#fca5a5'}}>ERR: {dbDiag.error}</span>}
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
