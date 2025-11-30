import React, { Suspense, lazy } from 'react';

// Lazy load ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

// Lazy load Quill CSS
const loadQuillStyles = () => {
  import('react-quill/dist/quill.snow.css');
};

/**
 * Lazy-loaded ReactQuill wrapper with loading fallback
 */
const LazyQuill = ({ value, onChange, placeholder, readOnly, theme, modules, ...props }) => {
  // Load styles on mount
  React.useEffect(() => {
    loadQuillStyles();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="quill-loader">
          <div className="spinner"></div>
          <p>Loading editor...</p>
        </div>
      }
    >
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        theme={theme || 'snow'}
        modules={modules}
        {...props}
      />
    </Suspense>
  );
};

export default LazyQuill;
