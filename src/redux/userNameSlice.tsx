import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  displayName: string;
}

const initialState: UserState = {
  displayName: '',
};

const userNameSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
  },
});

export interface userNameSliceState {
  displayName: String;
}

export const { setDisplayName } = userNameSlice.actions;
export default userNameSlice.reducer;
