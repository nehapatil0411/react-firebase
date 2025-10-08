import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slice/authSlice';
import chatReducer from '../Slice/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});