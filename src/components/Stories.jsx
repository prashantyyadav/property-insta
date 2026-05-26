import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { propertyStories } from '../data';

export default function Stories() {
  const { setActiveModal } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const openStory = (index) => {
    setActiveModal({ type: 'story', data: { index } });
  };

  return (
    <div className="ig-stories">
      <div className="ig-stories-inner">
        {propertyStories.map((story, idx) => (
          <div
            key={story.id}
            className={`ig-story ${idx === 0 ? 'ig-story-add' : ''}`}
            onClick={() => openStory(idx)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className={`ig-story-ring ${hoveredIdx === idx ? 'hovered' : ''}`}>
              {idx === 0 ? (
                <div className="ig-story-avatar add-story">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              ) : (
                <img
                  className="ig-story-avatar"
                  src={story.image}
                  alt={story.label}
                  loading="lazy"
                />
              )}
            </div>
            <span className="ig-story-label">{idx === 0 ? 'Your Story' : story.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}