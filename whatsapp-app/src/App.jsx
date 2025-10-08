import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import { setUser } from './Slice/authSlice';
import SignIn from './Components/Auth/SignIn.jsx';
import SignUp from './Components/Auth/SignUp.jsx';
import HomePage from './Components/Chat/HomePage.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser);
      
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        };
        console.log('Dispatching user:', userData);
        dispatch(setUser(userData));
      } else {
        // User is signed out
        console.log('Dispatching null user (signed out)');
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, [dispatch]);

  console.log('Current Redux user state:', user);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/signin" 
            element={!user ? <SignIn /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <SignUp /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={user ? <HomePage /> : <Navigate to="/signin" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;