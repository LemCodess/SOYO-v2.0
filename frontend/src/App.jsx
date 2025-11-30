import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Writing from './pages/Writing/Writing';
import Chapters from './pages/Chapters/Chapters';
import Story from './pages/Story/Story';
import ProtectedRoute from './router/ProtectedRoute';

import './App.css';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data && response.data.user) {
            const { username } = response.data.user;
            setName(username);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <Router>
      <div className='app'>
        {/* Navbar appears on all pages */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <Switch>
          {/* Public Routes */}
          <Route path="/" exact>
            <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={name} />
          </Route>

          <Route path="/login" exact>
            {isLoggedIn ? (
              <Redirect to="/" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setName={setName} />
            )}
          </Route>

          <Route path="/signup" exact>
            {isLoggedIn ? (
              <Redirect to="/" />
            ) : (
              <SignUpForm setIsLoggedIn={setIsLoggedIn} setName={setName} />
            )}
          </Route>

          <Route path="/story/:id" exact>
            <Story />
          </Route>

          {/* Protected Routes */}
          <ProtectedRoute
            path="/write"
            exact
            isLoggedIn={isLoggedIn}
            component={Writing}
          />

          <ProtectedRoute
            path="/profile"
            exact
            isLoggedIn={isLoggedIn}
            component={Profile}
            setIsLoggedIn={setIsLoggedIn}
            name={name}
          />

          <ProtectedRoute
            path="/chapters"
            exact
            isLoggedIn={isLoggedIn}
            component={Chapters}
            setIsLoggedIn={setIsLoggedIn}
            name={name}
          />

          {/* Redirect old /home route to / for backwards compatibility */}
          <Route path="/home">
            <Redirect to="/" />
          </Route>

          {/* Redirect old /writing route to /write for backwards compatibility */}
          <Route path="/writing">
            <Redirect to="/write" />
          </Route>

          {/* Redirect old /stories/:id route to /story/:id for backwards compatibility */}
          <Route path="/stories/:id">
            {({ match }) => <Redirect to={`/story/${match.params.id}`} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
