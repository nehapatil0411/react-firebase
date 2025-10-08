import React from 'react';
import Header from '../Layout/Header';
import UserList from './UserList';
import ChatArea from './ChatArea';

const HomePage = () => {
  return (
    <div className="app">
      <Header />
      <div className="home-container">
        <UserList />
        <ChatArea />
      </div>
    </div>
  );
}

export default HomePage;