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
  const { currentView, darkMode, allProperties, dbReady } = useApp();

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
      {/* DIAGNOSTIC — will be removed once issue is resolved */}
      <div style={{background:'#1a1a2e',color:'#fff',padding:'6px 16px',fontSize:'12px',display:'flex',gap:'16px',justifyContent:'center',fontFamily:'monospace'}}>
        <span>DB: <b style={{color: dbReady ? '#4ade80' : '#f87171'}}>{dbReady ? 'CONNECTED' : 'WAITING'}</b></span>
        <span>PROPS: <b>{allProperties.length}</b></span>
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
