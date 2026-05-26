import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { allProperties, formatPriceIndian } from '../data';

export default function MapView() {
  const { addRecentView, setActiveModal } = useApp();
  const [mapFilter, setMapFilter] = useState('all');
  const [selectedProp, setSelectedProp] = useState(null);

  const filtered = allProperties.filter(p => {
    if (mapFilter === 'all') return true;
    if (mapFilter === 'luxury') return p.price >= 10000000;
    if (mapFilter === 'affordable') return p.price < 5000000;
    return p.type === mapFilter;
  });

  return (
    <div id="mapView" className="">
      <div className="ig-map-header">
        <h3>Property Map</h3>
        <div className="ig-map-controls">
          <select
            value={mapFilter}
            onChange={(e) => setMapFilter(e.target.value)}
          >
            <option value="all">All Properties</option>
            <option value="luxury">Luxury (₹1Cr+)</option>
            <option value="affordable">{'Affordable (<₹50L)'}</option>
            <option value="Apartment">Apartments</option>
            <option value="Villa">Villas</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      <div id="mapContainer" className="ig-map-container">
        <div className="ig-map-placeholder">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <p>Map View</p>
          <span className="map-hint">Showing {filtered.length} properties across major cities</span>
        </div>

        {/* Property Pins */}
        <div className="ig-map-pins">
          {filtered.map((prop, idx) => {
            const top = 25 + (idx % 5) * 15 + Math.random() * 5;
            const left = 10 + (idx % 6) * 15 + Math.random() * 5;
            return (
              <div
                key={prop.id}
                className={`ig-map-pin ${selectedProp === prop.id ? 'selected' : ''}`}
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => setSelectedProp(selectedProp === prop.id ? null : prop.id)}
              >
                <span className="ig-map-pin-dot" />
                {selectedProp === prop.id && (
                  <div className="ig-map-pin-card">
                    <img src={prop.media?.[0]} alt={prop.title} />
                    <div className="ig-map-pin-info">
                      <strong>{prop.title}</strong>
                      <span>{formatPriceIndian(prop.price)}</span>
                      <button
                        className="map-view-detail-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addRecentView(prop.id);
                          setActiveModal({ type: 'property', data: { propertyId: prop.id } });
                        }}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}