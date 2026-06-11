import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import Stories from './Stories';
import PropertyCard from './PropertyCard';
import { formatPriceIndian } from '../data';

const TRENDING_COUNT = 6;

export default function FeedView() {
  const {
    displayedProperties,
    allProperties,
    filters,
    recentlyViewed,
    setActiveModal,
    addRecentView,
    hasMore,
    loadMore,
    filteredCount,
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

  // Active filter detection — hide discovery sections when browsing filtered results
  const hasActiveFilters = !!(
    filters.search || filters.city || filters.priceRange || filters.priceMin || filters.priceMax ||
    (filters.propertyType && filters.propertyType.length) ||
    filters.bedrooms !== null && filters.bedrooms !== undefined ||
    (filters.amenities && filters.amenities.length) ||
    (filters.listingStatus && filters.listingStatus.length)
  );

  // Get recently viewed properties from context allProperties
  const recentProps = allProperties.filter(p => recentlyViewed.includes(p.id)).slice(0, 4);

  // Trending properties
  const trendingProps = allProperties.filter(p => p.trending).slice(0, TRENDING_COUNT);

  // Open House property (first property with open house)
  const openHouseProp = allProperties.find(p => p.openHouse);

  return (
    <div className="ig-feed-content">
      {/* Stories */}
      <section className="ig-stories-section">
        <Stories />
      </section>

      {/* Recently Viewed */}
      {!hasActiveFilters && recentProps.length > 0 && (
        <section className="ig-section">
          <div className="ig-section-header">
            <h2 className="ig-section-title">🕐 Recently Viewed</h2>
          </div>
          <div className="ig-feed-grid">
            {recentProps.map(prop => (
              <PropertyCard key={`recent-${prop.id}`} property={prop} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Properties */}
      {!hasActiveFilters && trendingProps.length > 0 && (
        <section className="ig-section">
          <div className="ig-section-header">
            <h2 className="ig-section-title">🔥 Trending Now</h2>
          </div>
          <div className="ig-feed-grid">
            {trendingProps.map(prop => (
              <PropertyCard key={`trending-${prop.id}`} property={prop} />
            ))}
          </div>
        </section>
      )}

      {/* Open House Banner */}
      {!hasActiveFilters && openHouseProp && (
        <section className="ig-open-house-banner">
          <div className="ohb-content">
            <div className="ohb-text">
              <span className="ohb-label">🏠 Open House Today</span>
              <h3>{openHouseProp.title}</h3>
              <p>{openHouseProp.location} • {formatPriceIndian(openHouseProp.price)}</p>
              <div className="ohb-countdown">
                Ends in {openHouseCountdown.hours}h {openHouseCountdown.minutes}m {openHouseCountdown.seconds}s
              </div>
            </div>
            <button
              className="ohb-btn"
              onClick={() => {
                addRecentView(openHouseProp.id);
                setActiveModal({ type: 'property', data: { propertyId: openHouseProp.id } });
              }}
            >
              View Property →
            </button>
          </div>
        </section>
      )}

      {/* All Properties Feed */}
      <section className="ig-section">
        <div className="ig-section-header">
          <h2 className="ig-section-title">
            {filters.search
              ? `🔍 Results for "${filters.search}"`
              : filters.city
                ? `📍 Properties in ${filters.city}`
                : '🏘️ All Properties'}
          </h2>
          <span className="ig-result-count">{filteredCount} {filteredCount === 1 ? 'listing' : 'listings'}</span>
        </div>

        {displayedProperties.length === 0 ? (
          <div className="ig-empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <div className="ig-feed-grid">
              {displayedProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
            {hasMore && (
              <div className="ig-load-more">
                <button className="ig-load-more-btn" onClick={loadMore}>
                  Load More Properties ↓
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}