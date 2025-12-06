import React from 'react';
import './Input.css';

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const inputWrapperClasses = [
    'input-wrapper',
    fullWidth ? 'input-full' : '',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={inputWrapperClasses}>
      {label && <label className="input-label">{label}</label>}

      <div className="input-container">
        {leftIcon && <span className="input-icon-left">{leftIcon}</span>}

        <input
          className={`input ${leftIcon ? 'input-with-left-icon' : ''} ${rightIcon ? 'input-with-right-icon' : ''}`}
          {...props}
        />

        {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
      </div>

      {error && <p className="input-error-text">{error}</p>}
      {!error && helperText && <p className="input-helper-text">{helperText}</p>}
    </div>
  );
};

export default Input;
