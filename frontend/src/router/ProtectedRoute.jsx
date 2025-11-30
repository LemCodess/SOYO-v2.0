import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * Protected Route Component
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ isLoggedIn, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
