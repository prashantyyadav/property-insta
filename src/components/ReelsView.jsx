import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { formatPriceIndian } from '../data';

const REEL_CATEGORIES = ['All', 'Luxury', 'Premium', 'Family', 'Budget', 'Commercial'];

export default function ReelsView() {
  const {
    allReels,
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
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  // Scroll to active reel
  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.reel-item');
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.reel-item');
    const containerTop = containerRef.current.getBoundingClientRect().top;
    let closest = 0;
    let closestDist = Infinity;
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const dist = Math.abs(rect.top - containerTop - window.innerHeight * 0.3);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    if (closest !== activeIndex) {
      setActiveIndex(closest);
    }
  }, [activeIndex]);

  const handleLike = (reel) => {
    toggleLike(reel.id);
    showToast('❤️ Liked!');
  };

  const handleSave = (reel) => {
    toggleSave(reel.propertyId || reel.id);
    showToast(savedIds.includes(reel.propertyId || reel.id) ? '🔖 Removed' : '🔖 Saved!');
  };

  return (
    <div className="ig-reels-view">
      {/* Category Tabs */}
      <div className="ig-reels-tabs">
        {REEL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`ig-reels-tab ${activeReelCategory === cat ? 'active' : ''}`}
            onClick={() => { setActiveReelCategory(cat); setActiveIndex(0); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && <div className="reel-toast">{toast}</div>}

      {/* Reels Container */}
      <div
        ref={containerRef}
        className="ig-reels-container"
        onScroll={handleScroll}
      >
        {filteredReels.length === 0 ? (
          <div className="ig-empty-state">
            <h3>No reels in this category</h3>
          </div>
        ) : (
          filteredReels.map((reel, idx) => (
            <div
              key={reel.id}
              className={`reel-item ${idx === activeIndex ? 'active' : ''}`}
            >
              <video
                ref={el => (videoRefs.current[reel.id] = el)}
                src={reel.video}
                poster={reel.thumbnail}
                loop
                muted
                playsInline
                preload="metadata"
                onClick={() => {
                  const vid = videoRefs.current[reel.id];
                  if (vid) vid.paused ? vid.play() : vid.pause();
                }}
              />

              {/* Sidebar Actions */}
              <div className="reel-actions">
                <button className="reel-action-btn" onClick={() => handleLike(reel)}>
                  <span className="reel-action-icon">{likedIds.includes(reel.id) ? '❤️' : '🤍'}</span>
                  <span className="reel-action-count">{reel.likes || 0}</span>
                </button>
                <button className="reel-action-btn" onClick={() => handleSave(reel)}>
                  <span className="reel-action-icon">{savedIds.includes(reel.propertyId || reel.id) ? '🔖' : '🏷️'}</span>
                </button>
                <button
                  className="reel-action-btn"
                  onClick={() => {
                    addRecentView(reel.propertyId || reel.id);
                    setActiveModal({ type: 'property', data: { propertyId: reel.propertyId || reel.id } });
                  }}
                >
                  <span className="reel-action-icon">📋</span>
                  <span className="reel-action-count">Details</span>
                </button>
              </div>

              {/* Overlay Info */}
              <div className="reel-info">
                <h3 className="reel-info-title">{reel.title}</h3>
                <p className="reel-info-location">
                  📍 {reel.location}
                  {reel.builder && ` • ${reel.builder}`}
                </p>
                <p className="reel-info-price">{formatPriceIndian(reel.price)}</p>
                {reel.description && (
                  <p className="reel-info-desc">{reel.description.slice(0, 100)}...</p>
                )}
                <div className="reel-info-tags">
                  {reel.status && <span className="reel-tag status">{reel.status}</span>}
                  {reel.sqft && <span className="reel-tag">{reel.sqft} sq.ft</span>}
                  {reel.bedrooms && <span className="reel-tag">{reel.bedrooms} BHK</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}