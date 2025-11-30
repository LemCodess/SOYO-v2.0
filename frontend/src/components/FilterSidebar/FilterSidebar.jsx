import React from 'react';
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
      <div className="filter-section">
        <h3 className="filter-title">Search</h3>
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search stories, authors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Category</h3>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Language</h3>
        <div className="filter-options">
          {languages.map((language) => (
            <button
              key={language}
              className={`filter-option ${selectedLanguage === language ? 'active' : ''}`}
              onClick={() => onLanguageChange(language)}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Sort By</h3>
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

      <button className="filter-clear-btn" onClick={onClearFilters}>
        Clear All Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
