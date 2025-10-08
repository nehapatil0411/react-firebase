import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../../Slice/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(signOutUser());
  };

  return (
    <div className="header">
      <h1>💬 ChatApp</h1>
      <div className="user-info">
        <span>Welcome, {user?.displayName}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;