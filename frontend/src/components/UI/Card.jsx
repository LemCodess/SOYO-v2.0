import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable ? 'card-hoverable' : '',
    clickable ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
