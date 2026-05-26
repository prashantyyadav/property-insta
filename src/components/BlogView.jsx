import { useState } from 'react';
import { blogPosts } from '../data';

export default function BlogView() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(blogPosts.map(p => p.category).filter(Boolean))];

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <div id="blogView" className="">
      <div className="ig-blog-header">
        <h3>Property Insights & Blog</h3>
        <p>Expert advice, market trends, and home buying guides</p>
        <div className="ig-blog-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`ig-blog-cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {selectedPost ? (
        <div className="ig-blog-detail">
          <button className="ig-back-btn" onClick={() => setSelectedPost(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back to articles
          </button>
          <article className="ig-blog-article">
            <img
              className="ig-blog-hero-img"
              src={selectedPost.image}
              alt={selectedPost.title}
            />
            <div className="ig-blog-article-meta">
              <span className="ig-blog-article-cat">{selectedPost.category}</span>
              <span>{selectedPost.date}</span>
              <span>{selectedPost.readTime}</span>
            </div>
            <h1 className="ig-blog-article-title">{selectedPost.title}</h1>
            <div className="ig-blog-article-author">
              <img
                src={selectedPost.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'}
                alt={selectedPost.author}
                width="40"
                height="40"
              />
              <div>
                <strong>{selectedPost.author}</strong>
                <span>Property Expert</span>
              </div>
            </div>
            <div className="ig-blog-article-content">
              {selectedPost.content?.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {selectedPost.tags && (
                <div className="ig-blog-article-tags">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="ig-blog-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      ) : (
        <div className="ig-blog-grid">
          {filtered.length === 0 ? (
            <div className="ig-empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              <h3>No articles found</h3>
            </div>
          ) : (
            filtered.map(post => (
              <article
                key={post.id}
                className="ig-blog-card"
                onClick={() => setSelectedPost(post)}
              >
                <div className="ig-blog-card-img-wrap">
                  <img src={post.image} alt={post.title} loading="lazy" />
                  {post.category && <span className="ig-blog-card-cat">{post.category}</span>}
                </div>
                <div className="ig-blog-card-body">
                  <div className="ig-blog-card-meta">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4>{post.title}</h4>
                  <p className="ig-blog-card-excerpt">{post.excerpt}</p>
                  <div className="ig-blog-card-author">
                    <img
                      src={post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face'}
                      alt={post.author}
                      width="24"
                      height="24"
                    />
                    <span>{post.author}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}