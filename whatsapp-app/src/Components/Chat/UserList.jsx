import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUser } from '../../Slice/chatSlice';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, selectedUser } = useSelector(state => state.chat);
  const currentUser = useSelector(state => state.auth.user);
  const [usersInitialized, setUsersInitialized] = useState(false);

  // Automatic sample users create karein
  const createSampleUsers = async (currentUserId) => {
    if (usersInitialized) return;
    
    const sampleUsers = [
      {
        uid: 'sample_user_1',
        displayName: 'Alice Johnson',
        email: 'alice@example.com',
        createdAt: new Date()
      },
      {
        uid: 'sample_user_2', 
        displayName: 'Bob Smith',
        email: 'bob@example.com',
        createdAt: new Date()
      },
      {
        uid: 'sample_user_3',
        displayName: 'Carol Davis',
        email: 'carol@example.com',
        createdAt: new Date()
      },
      {
        uid: 'sample_user_4',
        displayName: 'David Wilson',
        email: 'david@example.com', 
        createdAt: new Date()
      },
      {
        uid: 'sample_user_5',
        displayName: 'Eva Brown',
        email: 'eva@example.com',
        createdAt: new Date()
      }
    ];

    try {
      let usersCreated = 0;
      
      for (const user of sampleUsers) {
        // Only create if doesn't exist and not current user
        if (user.uid !== currentUserId) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDocs(collection(db, 'users'));
          const existingUsers = userDoc.docs.map(doc => doc.id);
          
          if (!existingUsers.includes(user.uid)) {
            await setDoc(userRef, user);
            usersCreated++;
            console.log(`✅ Created sample user: ${user.displayName}`);
          }
        }
      }
      
      if (usersCreated > 0) {
        console.log(`✅ ${usersCreated} sample users created successfully`);
      }
      
      setUsersInitialized(true);
    } catch (error) {
      console.log('Sample users setup completed or error:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log('🔄 Setting up users for:', currentUser.email);
      
      // Sample users create karo
      createSampleUsers(currentUser.uid);
      
      // Real-time users fetch karo
      dispatch(fetchUsers(currentUser.uid));
      
      // Har 30 second baad refresh karo
      const interval = setInterval(() => {
        dispatch(fetchUsers(currentUser.uid));
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, currentUser]);

  const handleUserSelect = (user) => {
    dispatch(selectUser(user));
  };

  // User avatar ka first letter show karein
  const getAvatarLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // User ka background color determine karein
  const getAvatarColor = (userId) => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Chats</h3>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {users.length} users online
        </span>
      </div>
      
      <div className="users-container">
        {users.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ fontSize: '48px' }}>👥</div>
            <div>Loading users...</div>
            <div style={{ fontSize: '12px' }}>Creating sample users</div>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.uid}
              className={`user-item ${selectedUser?.uid === user.uid ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <div 
                className="user-avatar" 
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: getAvatarColor(user.uid),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}
              >
                {getAvatarLetter(user.displayName)}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name" style={{
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '14px',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.displayName}
                </div>
                <div className="user-email" style={{
                  color: '#666',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.email}
                </div>
                <div style={{
                  color: '#888',
                  fontSize: '10px',
                  marginTop: '2px'
                }}>
                  Click to chat
                </div>
              </div>
              
              {/* Online indicator */}
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4CAF50',
                marginLeft: '8px'
              }}></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;