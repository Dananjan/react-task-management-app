//App.tsx
import React, { useEffect, useState } from 'react';
import Login from './components/pages/login-register/Login';
import Register from './components/pages/login-register/Register';
import Dashboard from './components/pages/dashboard/Dashboard';
import UpdateProfile from './components/pages/update-profile/UpdateProfile';
import PasswordReset from './components/pages/password-reset/PasswordReset';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import LoadingSpinner from './components/loading-spinner/LoadingSpinner';
import { reSendVerificationMail } from './services/userService';
import './App.css';


const App: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendVerificationEmail = async () => {
    try {
      reSendVerificationMail();
    } catch (error) {
      //console.log(error);
      //alert('Failed to send verification email. Please try again.');
    }
  };

  if(isLoading){
     return(
      <div className='loading-spinner'>
         <LoadingSpinner />
      </div>
    );
  }

  if (user && !user.emailVerified) {
    return (
      <div>
        <h2>Email Verification Required</h2>
        <p>Please verify your email address before accessing the dashboard.</p>
        <button onClick={handleSendVerificationEmail}>Resend Verification Email</button>
      </div>
    );
  }

  return (
    <Router>
      <LoadingSpinner />
      {user && user.emailVerified && <Header />}
      {user && user.emailVerified && <Sidebar />}
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route
          path="/register"
          element={user && user.emailVerified ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/login"
          element={user && user.emailVerified ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user && user.emailVerified ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/updateprofile"
          element={user && user.emailVerified ? <UpdateProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/passwordreset"
          element={user && user.emailVerified ? <PasswordReset /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;