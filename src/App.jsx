import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { ToastProvider } from './hooks/useToast';
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
import OSDashboard from './components/os/OSDashboard';
import TrustLayer from './components/os/TrustLayer';
import PropertyPassport from './components/os/PropertyPassport';
import TransactionLayer from './components/os/TransactionLayer';
import CRMView from './components/os/CRMView';
import ChannelPartnerView from './components/os/ChannelPartnerView';
import AICopilotView from './components/os/AICopilotView';
import FinancingView from './components/os/FinancingView';
import LegalView from './components/os/LegalView';
import InfraView from './components/os/InfraView';
import DataCloudView from './components/os/DataCloudView';
import InvestmentView from './components/os/InvestmentView';
import RentalView from './components/os/RentalView';
import LocalCommerceView from './components/os/LocalCommerceView';
import SocialView from './components/os/SocialView';
import GovIntView from './components/os/GovIntView';
import AIExchangeView from './components/os/AIExchangeView';
import './styles/styles.scss';

function AppLayout() {
  const { currentView, darkMode } = useApp();

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
      case 'reels': return <ReelsView />;
      case 'mapView': return <MapView />;
      case 'saved': return <SavedView />;
      case 'blog': return <BlogView />;
      // OS Modules
      case 'os': return <div className="os-page-wrap"><OSDashboard /></div>;
      case 'trust': return <div className="os-page-wrap"><TrustLayer /></div>;
      case 'passport': return <div className="os-page-wrap"><PropertyPassport /></div>;
      case 'transaction': return <div className="os-page-wrap"><TransactionLayer /></div>;
      case 'crm': return <div className="os-page-wrap"><CRMView /></div>;
      case 'channelpartner': return <div className="os-page-wrap"><ChannelPartnerView /></div>;
      case 'copilot': return <div className="os-page-wrap"><AICopilotView /></div>;
      case 'financing': return <div className="os-page-wrap"><FinancingView /></div>;
      case 'legal': return <div className="os-page-wrap"><LegalView /></div>;
      case 'infra': return <div className="os-page-wrap"><InfraView /></div>;
      case 'datacloud': return <div className="os-page-wrap"><DataCloudView /></div>;
      case 'investment': return <div className="os-page-wrap"><InvestmentView /></div>;
      case 'rental': return <div className="os-page-wrap"><RentalView /></div>;
      case 'commerce': return <div className="os-page-wrap"><LocalCommerceView /></div>;
      case 'social': return <div className="os-page-wrap"><SocialView /></div>;
      case 'govint': return <div className="os-page-wrap"><GovIntView /></div>;
      case 'aiexchange': return <div className="os-page-wrap"><AIExchangeView /></div>;
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

  const isOsView = !['feed', 'reels', 'mapView', 'saved', 'blog'].includes(currentView);

  return (
    <div className={`app-root ${darkMode ? 'dark' : ''}`}>
      <Header />
      {currentView === 'feed' && <HeroBanner />}
      {renderView()}
      {!isOsView && <Footer />}
      <MobileNav />
      <ChatWidget />
      <Modals />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <AppProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </AppProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
