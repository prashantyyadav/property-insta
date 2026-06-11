import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const FOLLOWS = [
  { id: 1, name: 'DLF Limited', type: 'Builder', followers: '128K', following: true, icon: '🏗️' },
  { id: 2, name: 'Godrej Properties', type: 'Builder', followers: '94K', following: true, icon: '🏢' },
  { id: 3, name: 'Sector 77 SPR', type: 'Locality', followers: '42K', following: false, icon: '📍' },
  { id: 4, name: 'M3M Antalya Hills', type: 'Project', followers: '18K', following: false, icon: '🏘️' },
];

const FEED = [
  { id: 1, author: 'DLF Limited', avatar: '🏗️', time: '2h ago', text: 'DLF Privana West Phase 2 now open for bookings! 4 BHK luxury residences on SPR with possession by 2029. 🏠', likes: 342, comments: 28, type: 'Builder Update' },
  { id: 2, author: 'Ankit (Resident)', avatar: '👤', time: '5h ago', text: 'Moved into Godrej Aristocrat last month. Construction quality is excellent, amenities as promised. Highly recommend! ⭐⭐⭐⭐⭐', likes: 156, comments: 19, type: 'Review' },
  { id: 3, author: 'NCR Realty News', avatar: '📰', time: '1d ago', text: 'Dwarka Expressway fully operational — property prices in adjacent sectors up 22% YoY. Best time for end-users to lock in.', likes: 89, comments: 12, type: 'News' },
];

const REVIEWS = [
  { project: 'DLF Privana South', rating: 4.6, count: 142, highlights: ['Premium quality', 'On-time delivery', 'Great amenities'] },
  { project: 'Godrej Aristocrat', rating: 4.7, count: 98, highlights: ['Excellent build', 'Responsive builder', 'Good location'] },
  { project: 'M3M Antalya Hills', rating: 4.2, count: 67, highlights: ['Value for money', 'Minor delays', 'Nice clubhouse'] },
];

export default function SocialView() {
  const toast = useToast();
  const [tab, setTab] = useState('feed');
  const [follows, setFollows] = useState(FOLLOWS);
  const [feed, setFeed] = useState(FEED);
  const [liked, setLiked] = useState({});

  const toggleFollow = (id) => {
    setFollows(prev => prev.map(f => f.id === id ? { ...f, following: !f.following } : f));
    const f = follows.find(x => x.id === id);
    toast(`${f.following ? 'Unfollowed' : 'Following'} ${f.name}`, f.following ? 'info' : 'success');
  };

  const like = (id) => {
    if (liked[id]) return;
    setLiked(prev => ({ ...prev, [id]: true }));
    setFeed(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">💬</div>
        <div><h1>RE Social Network</h1><p>Follow builders, projects & localities — share reviews, news & insights</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="os-tabs">
        {[['feed', '📰 Feed'], ['following', '👥 Following'], ['reviews', '⭐ Reviews']].map(([t, l]) => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {feed.map(post => (
            <div key={post.id} className="social-post">
              <div className="social-post-head">
                <div className="social-avatar">{post.avatar}</div>
                <div><h4>{post.author}</h4><span>{post.time} · {post.type}</span></div>
              </div>
              <p className="social-post-text">{post.text}</p>
              <div className="social-post-actions">
                <button className={liked[post.id] ? 'liked' : ''} onClick={() => like(post.id)}>❤️ {post.likes}</button>
                <button onClick={() => toast('Comments opened', 'info')}>💬 {post.comments}</button>
                <button onClick={() => toast('Post shared', 'success')}>↗️ Share</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'following' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {follows.map(f => (
            <div key={f.id} className="rental-req-row">
              <span className="rrr-icon">{f.icon}</span>
              <div className="rrr-body"><h4>{f.name}</h4><span>{f.type} · {f.followers} followers</span></div>
              <button className={f.following ? 'os-btn-outline small' : 'os-btn-primary small'} onClick={() => toggleFollow(f.id)}>
                {f.following ? 'Following ✓' : '+ Follow'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="social-review-card">
              <div className="src-head">
                <h4>{r.project}</h4>
                <span className="src-rating">⭐ {r.rating} <small>({r.count} reviews)</small></span>
              </div>
              <div className="src-highlights">
                {r.highlights.map((h, j) => <span key={j} className="idp-zone-chip">{h}</span>)}
              </div>
              <button className="os-btn-outline small" style={{ marginTop: 10 }} onClick={() => toast(`Writing review for ${r.project}`, 'info')}>Write a Review</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
