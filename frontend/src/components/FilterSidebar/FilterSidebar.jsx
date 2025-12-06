import React from 'react';
import Button from '../UI/Button';
import './FilterSidebar.css';

const FilterSidebar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  const categories = [
    'All',
    'Action',
    'Adventure',
    'Fanfiction',
    'Fantasy',
    'Horror',
    'Humor',
    'Mystery',
    'Poetry',
    'Romance',
    'Science fiction',
  ];

  const languages = ['All', 'English', 'Bangla'];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
  ];

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2 className="filter-sidebar-title">Filters</h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          Search
        </h3>
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search stories, authors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Category
        </h3>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
              {selectedCategory === category && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          Language
        </h3>
        <div className="filter-options filter-options-inline">
          {languages.map((language) => (
            <button
              key={language}
              className={`filter-option filter-option-chip ${selectedLanguage === language ? 'active' : ''}`}
              onClick={() => onLanguageChange(language)}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="21" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
          </svg>
          Sort By
        </h3>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={onClearFilters}
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        }
      >
        Clear All Filters
      </Button>
    </aside>
  );
};

export default FilterSidebar;
