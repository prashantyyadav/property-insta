import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const NAV_TABS = [
  { id: 'feed', icon: 'home', label: 'Feed' },
  { id: 'reels', icon: 'play', label: 'Reels' },
  { id: 'mapView', icon: 'map', label: 'Map' },
  { id: 'saved', icon: 'bookmark', label: 'Saved' },
  { id: 'blog', icon: 'file-text', label: 'Blog' },
];

const TIER1_CITIES = [
  'All India',
  'Gurgaon',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Noida',
];

export default function Header() {
  const {
    currentView,
    setCurrentView,
    darkMode,
    toggleDarkMode,
    notifications,
    unreadCount,
    markNotifRead,
    filters,
    setFilters,
    sidebarOpen,
    toggleSidebar,
    setActiveModal,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [cityOpen, setCityOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const cityRef = useRef(null);

  // Close panels on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setFilters(prev => ({ ...prev, search: val }));
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <header className="ig-header" id="igHeader">
      <div className="ig-header-inner">
        {/* Logo */}
        <a className="ig-logo" onClick={() => setCurrentView('feed')}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
            <path d="M8 12h16v12H8z" fill="white" opacity="0.9" />
            <path d="M11 12v12M21 12v12M8 16h16" stroke="white" strokeWidth="1.5" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#E02D5C" />
                <stop offset="1" stopColor="#FF6B35" />
              </linearGradient>
            </defs>
          </svg>
          <span className="ig-logo-text">PropertyInsta</span>
        </a>

        {/* Nav Tabs */}
        <nav className="ig-nav-tabs">
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              className={`ig-nav-tab ${currentView === tab.id ? 'active' : ''}`}
              onClick={() => setCurrentView(tab.id)}
            >
              <svg className="ig-nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {tab.icon === 'home' && <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>}
                {tab.icon === 'play' && <polygon points="5 3 19 12 5 21 5 3" />}
                {tab.icon === 'map' && <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>}
                {tab.icon === 'bookmark' && <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />}
                {tab.icon === 'file-text' && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>}
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="ig-header-actions">
          {/* City Dropdown */}
          <div className="ig-city-dropdown" ref={cityRef}>
            <button
              className="ig-city-btn"
              onClick={() => { setCityOpen(!cityOpen); setSearchOpen(false); setNotifOpen(false); }}
              title="Select city"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{filters.city || 'All India'}</span>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {cityOpen && (
              <div className="ig-city-list">
                {TIER1_CITIES.map(city => (
                  <button
                    key={city}
                    className={`ig-city-option ${(filters.city === city || (!filters.city && city === 'All India')) ? 'active' : ''}`}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, city: city === 'All India' ? '' : city }));
                      setCityOpen(false);
                    }}
                  >
                    {city}
                    {((filters.city === city) || (!filters.city && city === 'All India')) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            className={`ig-icon-btn ig-filter-toggle ${sidebarOpen ? 'active' : ''}`}
            onClick={toggleSidebar}
            title="Filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>

          {/* Search */}
          <button
            className="ig-icon-btn"
            onClick={() => { setSearchOpen(!searchOpen); setNotifOpen(false); setCityOpen(false); }}
            title="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Notifications */}
          <button
            className="ig-icon-btn"
            id="notifBell"
            onClick={() => { setNotifOpen(!notifOpen); setSearchOpen(false); setCityOpen(false); }}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="ig-badge">{unreadCount}</span>}
          </button>

          {/* Dark Mode */}
          <button className="ig-icon-btn" onClick={toggleDarkMode} title="Toggle theme">
            {darkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Admin Panel */}
          <button
            className="ig-icon-btn"
            onClick={() => setActiveModal({ type: 'admin' })}
            title="Admin Panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>

          {/* Avatar */}
          <button className="ig-avatar-btn" title="Account">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
              alt="User avatar"
              width="32"
              height="32"
            />
          </button>
        </div>
      </div>

      {/* Search Panel */}
      <div
        ref={searchRef}
        className={`ig-search-panel ${searchOpen ? '' : 'hidden'}`}
        id="searchPanel"
      >
        <div className="ig-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by city, locality, project, or agent..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      </div>

      {/* Notifications Panel */}
      <div
        ref={notifRef}
        className={`ig-notif-panel ${notifOpen ? '' : 'hidden'}`}
        id="notifPanel"
      >
        <div className="notif-panel-header">
          <h4>Notifications</h4>
          {unreadCount > 0 && (
            <button className="notif-mark-read" onClick={() => notifications.forEach(n => markNotifRead(n.id))}>
              Mark all read
            </button>
          )}
        </div>
        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications yet</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'unread' : ''}`}
                onClick={() => markNotifRead(n.id)}
              >
                <div className="notif-icon">
                  {n.icon === 'fa-tag' && '💰'}
                  {n.icon === 'fa-home' && '🏠'}
                  {n.icon === 'fa-calendar-check' && '📅'}
                  {n.icon === 'fa-user-check' && '👤'}
                  {n.icon === 'fa-balance-scale' && '⚖️'}
                </div>
                <div className="notif-content">
                  <p className="notif-text">{n.text}</p>
                  <span className="notif-time">{n.time}</span>
                </div>
                {!n.read && <span className="notif-dot" />}
              </div>
            ))
          )}
        </div>
      </div>
    </header>
  );
}