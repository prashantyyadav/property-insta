import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { allReels, formatPriceIndian } from '../data';

const REEL_CATEGORIES = ['All', 'Luxury', 'Premium', 'Family', 'Budget', 'Commercial'];

export default function ReelsView() {
  const {
    activeReelCategory,
    setActiveReelCategory,
    savedIds,
    toggleSave,
    likedIds,
    toggleLike,
    setActiveModal,
    addRecentView,
  } = useApp();

  const [toast, setToast] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const toastTimer = useRef(null);

  const filteredReels = activeReelCategory === 'All'
    ? allReels
    : allReels.filter(r => r.category === activeReelCategory);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  // Scroll-snap observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const slides = container.children;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const slideTop = slide.offsetTop;
        const slideBottom = slideTop + slide.clientHeight;

        if (scrollTop >= slideTop - containerHeight / 3 && scrollTop < slideBottom - containerHeight / 3) {
          if (activeIndex !== i) {
            setActiveIndex(i);
          }
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // Play/pause videos based on active index
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, video]) => {
      if (!video) return;
      if (Number(idx) === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  const handleVideoRef = useCallback((idx) => (el) => {
    if (el) videoRefs.current[idx] = el;
  }, []);

  const handleContact = (reelIdx, e) => {
    e.stopPropagation();
    const reel = filteredReels[reelIdx];
    if (reel) {
      addRecentView(reel.propertyId);
      setActiveModal({ type: 'property', data: { propertyId: reel.propertyId } });
    }
  };

  return (
    <div id="reelsView" className="">
      {/* Category Header */}
      <div className="ig-reels-header reels-header-overlay">
        <div className="ig-reel-chips">
          {REEL_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`ig-reel-chip ${activeReelCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveReelCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="ig-reel-progress-dots">
          {filteredReels.map((_, i) => (
            <div
              key={i}
              className={`ig-reel-progress-dot ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'watched' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="ig-toast show" id="reelToast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          {toast}
        </div>
      )}

      {/* Reels Container */}
      <div className="ig-reels-container" ref={containerRef}>
        {filteredReels.length === 0 ? (
          <div className="ig-empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            <h3>No reels in this category</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          filteredReels.map((reel, idx) => {
            const isSaved = savedIds.includes(reel.propertyId);
            const isLiked = likedIds.includes(reel.propertyId);

            return (
              <div key={reel.id} className="ig-reel-slide">
                {/* Video */}
                <video
                  ref={handleVideoRef(idx)}
                  className="ig-reel-video"
                  src={reel.videoUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />

                {/* Overlay */}
                <div className="ig-reel-overlay">
                  {/* Property Info */}
                  <div className="ig-reel-info">
                    <h3 className="ig-reel-title">{reel.title}</h3>
                    <p className="ig-reel-location">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {reel.location}
                    </p>
                    <div className="ig-reel-price-row">
                      <span className="ig-reel-price">{formatPriceIndian(reel.price)}</span>
                      {reel.bedrooms && <span className="ig-reel-spec">{reel.bedrooms} BHK</span>}
                      {reel.area && <span className="ig-reel-spec">{reel.area} sq.ft</span>}
                    </div>
                    {reel.description && (
                      <p className="ig-reel-desc">{reel.description}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="ig-reel-actions">
                    <button
                      className={`ig-reel-action-btn ${isLiked ? 'reel-liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(reel.propertyId);
                        showToast(isLiked ? 'Removed from likes' : 'Added to likes ❤️');
                      }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                      <span>{reel.likes || 0}</span>
                    </button>

                    <button
                      className={`ig-reel-action-btn ${isSaved ? 'reel-saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(reel.propertyId);
                        showToast(isSaved ? 'Removed from saved' : 'Saved ✓');
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                    </button>

                    <button
                      className="ig-reel-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(window.location.href);
                        showToast('Link copied! 📋');
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                    </button>

                    <button
                      className="ig-reel-action-btn"
                      onClick={(e) => handleContact(idx, e)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                    </button>

                    {/* Agent Avatar */}
                    <div className="ig-reel-agent-avatar">
                      <img
                        src={reel.agentAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'}
                        alt="Agent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}