import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase/Firebase';

// Helper function - user ko Firestore me add/update kare
const addUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Naya user hai - create karo
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      console.log('✅ New user added to Firestore:', user.email);
    } else {
      // Existing user hai - update karo
      await setDoc(userRef, {
        lastLogin: new Date()
      }, { merge: true });
      console.log('✅ User updated in Firestore:', user.email);
    }
  } catch (error) {
    console.error('❌ Error adding user to Firestore:', error);
  }
};

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating account for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
        console.log('✅ Profile updated with display name');
      }
      
      // Firestore me user add karo
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName
      };
      
      await addUserToFirestore(userData);
      console.log('✅ Account created successfully!');
      
      return userData;
    } catch (error) {
      console.error('❌ Sign up error:', error.code, error.message);
      return rejectWithValue(error.message || 'Failed to create account');
    }
  }
);

export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔄 Signing in user:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Firestore me user update karo (last login)
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName
      };
      
      await addUserToFirestore(userData);
      console.log('✅ Sign in successful!');
      
      return userData;
    } catch (error) {
      console.error('❌ Sign in error:', error.code, error.message);
      
      let errorMessage = 'Failed to sign in';
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Baaki code same rahega...
export const signOutUser = createAsyncThunk(
  'auth/signOutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      console.error('Sign out error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign Out
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;