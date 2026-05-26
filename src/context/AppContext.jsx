import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { allProperties as staticProperties, allReels, formatPriceIndian } from '../data';

// Merge admin-managed properties from localStorage with static properties
// Transform raw admin properties into PropertyInsta-compatible format
function transformAdminProps(rawProps) {
  return rawProps.map(p => {
    const transformed = { ...p };
    transformed.media = transformed.images || [];
    transformed.bedrooms = transformed.beds;
    transformed.bathrooms = transformed.baths;
    transformed.area = transformed.sqft;
    transformed.trending = transformed.hot;
    transformed.agentAvatar = transformed.agent?.avatar || 'https://i.pravatar.cc/150?img=1';
    transformed.rera = !!(transformed.reraId);
    transformed.pricePerSqft = transformed.pricePerSqft || Math.round(transformed.price / transformed.sqft);
    transformed.possession = transformed.possessionStatus;
    transformed.verified = transformed.featured;
    transformed.badge = transformed.hot ? 'Hot Deal' : (transformed.featured ? 'Featured' : null);
    transformed.badgeType = transformed.hot ? 'hot' : (transformed.featured ? 'featured' : '');
    transformed.age = transformed.age || 'New';
    transformed.facing = transformed.facing || 'Not Set';
    transformed.parking = transformed.parking || (transformed.amenities?.includes('parking') ? 'Available' : 'None');
    transformed.openHouse = transformed.openHouse || (transformed.featured && !transformed.hot);
    transformed.mediaAspectRatio = transformed.mediaAspectRatio || '4/3';
    transformed.listingStatus = transformed.listingStatus || transformed.possessionStatus || 'Ready to Move';
    transformed.status = transformed.status === 'sale' ? 'For Sale' : transformed.status === 'rent' ? 'For Rent' : transformed.status;
    transformed.type = transformed.type ? transformed.type.charAt(0).toUpperCase() + transformed.type.slice(1) : 'Apartment';
    transformed.amenities = (transformed.amenities || []).map(a => {
      const amenityMap = { pool: 'Pool', gym: 'Gym', parking: 'Parking', garden: 'Garden', security: 'Security', smartHome: 'Smart Home' };
      return amenityMap[a] || (typeof a === 'string' ? a.charAt(0).toUpperCase() + a.slice(1) : a);
    });
    if (transformed.neighborhood && !Array.isArray(transformed.neighborhood)) {
      transformed.neighborhood = [
        transformed.neighborhood.schools ? `Schools: ${transformed.neighborhood.schools}` : null,
        transformed.neighborhood.transit ? `Transit: ${transformed.neighborhood.transit}` : null,
        transformed.neighborhood.walkScore ? `Walk Score: ${transformed.neighborhood.walkScore}/100` : null,
        transformed.neighborhood.crimeRate ? `Crime Rate: ${transformed.neighborhood.crimeRate}` : null,
      ].filter(Boolean);
    }
    if (!transformed.neighborhood || transformed.neighborhood.length === 0) {
      transformed.neighborhood = ['Schools: N/A', 'Transit: N/A', 'Walk Score: 0/100', 'Crime Rate: N/A'];
    }
    return transformed;
  });
}

// Merge admin properties from JSON file with static defaults
async function fetchMergedProperties() {
  let adminProps = [];
  try {
    const resp = await fetch('/admin-properties.json');
    if (resp.ok) {
      adminProps = await resp.json();
      adminProps = transformAdminProps(adminProps);
    }
  } catch (e) { /* file may not exist yet, use static defaults */ }

  const adminIds = new Set(adminProps.map(p => p.id));
  const merged = [...adminProps];
  staticProperties.forEach(sp => {
    if (!adminIds.has(sp.id)) {
      merged.push(sp);
    }
  });
  return merged;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // View management
  const [currentView, setCurrentView] = useState('feed');

  // Start with static properties, then fetch admin-managed ones from shared JSON file
  const [allProperties, setAllProperties] = useState(staticProperties);

  useEffect(() => {
    // Initial fetch
    fetchMergedProperties().then(props => setAllProperties(props));
    // Poll the shared JSON file every 3 seconds (written by admin Vite middleware)
    const interval = setInterval(() => {
      fetchMergedProperties().then(props => setAllProperties(props));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('propertyInsta_dark') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('propertyInsta_dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  // Filters
  const [filters, setFilters] = useState({
    search: '', city: '', priceRange: '', priceMin: '', priceMax: '',
    propertyType: [], bedrooms: null, amenities: [],
    listingStatus: [], sortBy: 'newest'
  });

  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  // Displayed properties (sorted/filtered)
  const [currentPage, setCurrentPage] = useState(1);
  const propsPerPage = 24;

  const sortProperties = useCallback((props) => {
    const sorted = [...props];
    switch (filters.sortBy) {
      case 'price_asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'newest': sorted.sort((a, b) => b.id - a.id); break;
      case 'popular': sorted.sort((a, b) => b.views - a.views); break;
      case 'area_desc': sorted.sort((a, b) => b.area - a.area); break;
      default: break;
    }
    return sorted;
  }, [filters.sortBy]);

  const filteredProperties = useMemo(() => {
    let result = [...allProperties];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    // City filter
    if (filters.city) {
      const cityQ = filters.city.toLowerCase();
      result = result.filter(p => {
        const loc = (p.location || '').toLowerCase();
        const builder = (p.builder || '').toLowerCase();
        const title = (p.title || '').toLowerCase();
        return loc.includes(cityQ) || builder.includes(cityQ) || title.includes(cityQ);
      });
    }
    // Price range preset filter
    if (filters.priceRange) {
      const priceRanges = {
        'Under ₹30L': [0, 3000000],
        '₹30L-60L': [3000000, 6000000],
        '₹60L-1Cr': [6000000, 10000000],
        '₹1Cr-2Cr': [10000000, 20000000],
        '₹2Cr-5Cr': [20000000, 50000000],
        '₹5Cr+': [50000000, Infinity],
      };
      const [min, max] = priceRanges[filters.priceRange] || [0, Infinity];
      result = result.filter(p => p.price >= min && p.price <= max);
    }
    // Manual price min/max filter
    const minPrice = filters.priceMin ? Number(filters.priceMin) : 0;
    const maxPrice = filters.priceMax ? Number(filters.priceMax) : Infinity;
    if (minPrice > 0) result = result.filter(p => p.price >= minPrice);
    if (maxPrice < Infinity) result = result.filter(p => p.price <= maxPrice);
    if (filters.propertyType.length) result = result.filter(p => filters.propertyType.includes(p.type));
    if (filters.bedrooms !== null) result = result.filter(p => p.bedrooms === filters.bedrooms);
    if (filters.amenities.length) result = result.filter(p => filters.amenities.every(a => p.amenities.includes(a)));
    if (filters.listingStatus.length) result = result.filter(p => filters.listingStatus.includes(p.listingStatus));
    return sortProperties(result);
  }, [filters, sortProperties]);

  const displayedProperties = useMemo(() => {
    return filteredProperties.slice(0, currentPage * propsPerPage);
  }, [filteredProperties, currentPage]);

  const loadMore = useCallback(() => {
    if (currentPage * propsPerPage < filteredProperties.length) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, filteredProperties.length]);

  const hasMore = currentPage * propsPerPage < filteredProperties.length;
  const filteredCount = filteredProperties.length;

  const toggleSearchPanel = useCallback(() => {
    const panel = document.querySelector('.ig-search-panel');
    if (panel) panel.classList.toggle('hidden');
  }, []);

  // Saved / liked
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('propertyInsta_saved') || '[]'); } catch { return []; }
  });
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    localStorage.setItem('propertyInsta_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = useCallback((id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('propertyInsta_recent') || '[]'); } catch { return []; }
  });

  const addRecentView = useCallback((propId) => {
    setRecentlyViewed(prev => {
      const updated = [propId, ...prev.filter(id => id !== propId)].slice(0, 8);
      localStorage.setItem('propertyInsta_recent', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Compare
  const [compareIds, setCompareIds] = useState([]);
  const toggleCompare = useCallback((id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Price drop alert: Skyline Tower down 5%", time: "10 min ago", icon: "fa-tag", read: false },
    { id: 2, text: "New property matching your search: Lakeside Retreat", time: "1 hour ago", icon: "fa-home", read: false },
    { id: 3, text: "Your scheduled tour for Penthouse Executive is confirmed", time: "3 hours ago", icon: "fa-calendar-check", read: false },
    { id: 4, text: "Sarah Kim accepted your connection request", time: "5 hours ago", icon: "fa-user-check", read: true },
    { id: 5, text: "Compare ready: 3 saved properties analyzed", time: "1 day ago", icon: "fa-balance-scale", read: true },
  ]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const markNotifRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  // Modal state
  const [activeModal, setActiveModal] = useState(null); // { type, data }
  const openModal = useCallback((type, data = null) => setActiveModal({ type, data }), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  // Reels
  const [activeReelCategory, setActiveReelCategory] = useState('All');

  const value = {
    currentView, setCurrentView,
    darkMode, toggleDarkMode,
    filters, setFilters,
    filteredProperties, displayedProperties,
    currentPage, loadMore, hasMore, filteredCount,
    savedIds, toggleSave,
    likedIds, toggleLike,
    recentlyViewed, addRecentView,
    compareIds, toggleCompare, setCompareIds,
    notifications, unreadCount, markNotifRead,
    activeModal, openModal, closeModal, setActiveModal,
    activeReelCategory, setActiveReelCategory,
    toggleSearchPanel,
    sidebarOpen, toggleSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;