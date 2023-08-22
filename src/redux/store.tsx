import { configureStore } from '@reduxjs/toolkit';
import userNameReducer from './userNameSlice';
import loadingReducer from './loadingSlice';
import userImageReducer from './userImageSlice';

export const store = configureStore({
  reducer: {
    user: userNameReducer,
    loading: loadingReducer,
    userImg: userImageReducer,
  },
});