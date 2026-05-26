import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { allProperties, formatPriceIndian } from '../data';

export default function SavedView() {
  const {
    savedIds,
    toggleSave,
    addRecentView,
    setActiveModal,
    setCurrentView,
  } = useApp();

  const [sortBy, setSortBy] = useState('newest');

  const savedProperties = allProperties
    .filter(p => savedIds.includes(p.id))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return b.id - a.id;
    });

  const grouped = savedProperties.reduce((acc, prop) => {
    const loc = prop.location || 'Other';
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(prop);
    return acc;
  }, {});

  const shareWishlist = () => {
    const text = savedProperties
      .map(p => `${p.title} - ${formatPriceIndian(p.price)} (${p.location})`)
      .join('\n');
    if (navigator.share) {
      navigator.share({ title: 'My Property Wishlist', text });
    } else {
      navigator.clipboard?.writeText(text);
      alert('Wishlist copied to clipboard!');
    }
  };

  return (
    <div id="savedView" className="">
      <div className="ig-saved-header">
        <h3>Saved Properties</h3>
        <div className="ig-saved-actions">
          <span className="ig-saved-count">{savedProperties.length} saved</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Recently Saved</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          {savedProperties.length > 0 && (
            <button className="ig-saved-share-btn" onClick={shareWishlist}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              Share Wishlist
            </button>
          )}
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <div className="ig-empty-state" style={{ padding: '4rem 2rem' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
          <h3>No saved properties yet</h3>
          <p>Tap the bookmark icon on any property to save it here</p>
          <button className="ig-browse-btn" onClick={() => setCurrentView('feed')}>
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="ig-saved-list">
          {Object.entries(grouped).map(([location, props]) => (
            <div key={location} className="ig-saved-group">
              <h4 className="ig-saved-location">{location}</h4>
              <div className="ig-feed-grid">
                {props.map(prop => (
                  <div key={prop.id} className="ig-saved-card">
                    <div
                      className="ig-card-media"
                      onClick={() => {
                        addRecentView(prop.id);
                        setActiveModal({ type: 'property', data: { propertyId: prop.id } });
                      }}
                    >
                      <img src={prop.media?.[0]} alt={prop.title} loading="lazy" />
                      <button
                        className="card-save-btn saved"
                        onClick={(e) => { e.stopPropagation(); toggleSave(prop.id); }}
                        title="Remove from saved"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                      </button>
                      <div className="ig-card-overlay-info">
                        <span className="ig-card-price">{formatPriceIndian(prop.price)}</span>
                      </div>
                    </div>
                    <div className="ig-card-body">
                      <h3 className="ig-card-title">{prop.title}</h3>
                      <p className="ig-card-location">{prop.location}</p>
                      <div className="ig-card-stats">
                        {prop.bedrooms && <span>{prop.bedrooms} BHK</span>}
                        {prop.area && <span>{prop.area} sq.ft</span>}
                        {prop.bathrooms && <span>{prop.bathrooms} Bath</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}