import React from 'react';
import './CategoryBadge.css';

const CategoryBadge = ({ category, size = 'small' }) => {
  return (
    <span className={`category-badge category-badge-${size}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
