import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import Stories from './Stories';
import PropertyCard from './PropertyCard';
import { allProperties, formatPriceIndian } from '../data';

const TRENDING_COUNT = 6;

export default function FeedView() {
  const {
    displayedProperties,
    filters,
    recentlyViewed,
    setActiveModal,
    addRecentView,
    hasMore,
    loadMore,
  } = useApp();

  const [openHouseCountdown, setOpenHouseCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Open house countdown (ends at 6 PM today)
  const updateCountdown = useCallback(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(18, 0, 0, 0);
    if (now > end) end.setDate(end.getDate() + 1);

    const diff = end - now;
    setOpenHouseCountdown({
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    });
  }, []);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  // Get recently viewed properties
  const recentProps = allProperties.filter(p => recentlyViewed.includes(p.id)).slice(0, 4);

  // Trending properties
  const trendingProps = allProperties.filter(p => p.trending).slice(0, TRENDING_COUNT);

  // Open House property (first property with open house)
  const openHouseProp = allProperties.find(p => p.openHouse);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div id="feedView" className="active-view">
      {/* Stories Bar */}
      <Stories />

      {/* Trending Section */}
      {trendingProps.length > 0 && (
        <div className="ig-trending-section" id="trendingSection">
          <div className="ig-section-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            <h3>Trending Now</h3>
          </div>
          <div className="ig-trending-grid">
            {trendingProps.map(prop => (
              <div
                key={prop.id}
                className="ig-trending-card"
                onClick={() => {
                  addRecentView(prop.id);
                  setActiveModal({ type: 'property', data: { propertyId: prop.id } });
                }}
              >
                <div className="ig-trending-img-wrap">
                  <img src={prop.media?.[0]} alt={prop.title} loading="lazy" />
                  <span className="ig-trending-price">{formatPriceIndian(prop.price)}</span>
                </div>
                <div className="ig-trending-info">
                  <span className="ig-trending-title">{prop.title}</span>
                  <span className="ig-trending-loc">{prop.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open House Banner */}
      {openHouseProp && (
        <div className="ig-openhouse-section" id="openHouseSection">
          <div className="ig-section-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <h3>Open House Today</h3>
          </div>
          <div className="openhouse-banner"
            onClick={() => {
              addRecentView(openHouseProp.id);
              setActiveModal({ type: 'property', data: { propertyId: openHouseProp.id } });
            }}
          >
            <div className="openhouse-media">
              <img src={openHouseProp.media?.[0]} alt={openHouseProp.title} loading="lazy" />
              <span className="openhouse-label">Open House</span>
            </div>
            <div className="openhouse-info">
              <h4>{openHouseProp.title}</h4>
              <p>{openHouseProp.location} • {openHouseProp.bedrooms} BHK • {formatPriceIndian(openHouseProp.price)}</p>
              <div className="openhouse-countdown" id="openHouseCountdown">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>Closes in {pad(openHouseCountdown.hours)}:{pad(openHouseCountdown.minutes)}:{pad(openHouseCountdown.seconds)}</span>
              </div>
              <button className="openhouse-schedule-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal({ type: 'tour', data: { propertyId: openHouseProp.id } });
                }}
              >
                Schedule Visit →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Feed Grid */}
      <div className="ig-section-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
        <h3>{filters.search ? `Results for "${filters.search}"` : 'All Properties'}</h3>
        <span className="ig-result-count">{displayedProperties.length} properties</span>
      </div>

      <div className="ig-feed-grid">
        {displayedProperties.length === 0 ? (
          <div className="ig-empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          displayedProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="ig-load-more">
          <button className="ig-load-more-btn" onClick={loadMore}>
            Load More Properties
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>
      )}

      {/* Recently Viewed */}
      {recentProps.length > 0 && (
        <div className="ig-recent-section" id="recentSection">
          <div className="ig-section-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <h3>Recently Viewed</h3>
          </div>
          <div className="ig-trending-grid">
            {recentProps.map(prop => (
              <div
                key={prop.id}
                className="ig-trending-card"
                onClick={() => {
                  addRecentView(prop.id);
                  setActiveModal({ type: 'property', data: { propertyId: prop.id } });
                }}
              >
                <div className="ig-trending-img-wrap">
                  <img src={prop.media?.[0]} alt={prop.title} loading="lazy" />
                  <span className="ig-trending-price">{formatPriceIndian(prop.price)}</span>
                </div>
                <div className="ig-trending-info">
                  <span className="ig-trending-title">{prop.title}</span>
                  <span className="ig-trending-loc">{prop.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}