import React, { useState, useEffect } from 'react';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import StoryCard from '../../components/StoryCard/StoryCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import './Home.css';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/stories/published', { headers });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setStories(result);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Filter stories
  const getFilteredStories = () => {
    let filtered = [...stories];

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((story) =>
        stripHtml(story.topicName).toLowerCase().includes(lowerQuery) ||
        stripHtml(story.description).toLowerCase().includes(lowerQuery) ||
        story.category.toLowerCase().includes(lowerQuery) ||
        (story.userId?.name && story.userId.name.toLowerCase().includes(lowerQuery))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((story) => story.category === selectedCategory);
    }

    // Language filter
    if (selectedLanguage !== 'All') {
      filtered = filtered.filter((story) => story.language === selectedLanguage);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title-asc':
          return stripHtml(a.topicName).localeCompare(stripHtml(b.topicName));
        case 'title-desc':
          return stripHtml(b.topicName).localeCompare(stripHtml(a.topicName));
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredStories = getFilteredStories();

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLanguage('All');
    setSortBy('newest');
  };

  return (
    <div className="home-page">
      <HeroBanner isLoggedIn={isLoggedIn} />

      <div className="home-content" id="stories-section">
        <FilterSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        <main className="home-main">
          <div className="stories-header">
            <h2 className="stories-title">
              {selectedCategory !== 'All' ? `${selectedCategory} Stories` : 'All Stories'}
            </h2>
            <p className="stories-count">
              {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
            </p>
          </div>

          {loading ? (
            <div className="stories-loading">
              <div className="loading-spinner"></div>
              <p>Loading stories...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="stories-empty">
              <div className="empty-icon">📚</div>
              <h3>No stories found</h3>
              <p>
                {searchQuery || selectedCategory !== 'All' || selectedLanguage !== 'All'
                  ? 'Try adjusting your filters'
                  : 'Be the first to share a story!'}
              </p>
              {!isLoggedIn && (
                <button
                  className="empty-cta"
                  onClick={() => (window.location.href = '/signup')}
                >
                  Join Now to Write
                </button>
              )}
            </div>
          ) : (
            <div className="stories-grid">
              {filteredStories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
