import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserImgState {
  displayImageUrl: string;
}

const initialState: UserImgState = {
  displayImageUrl: '',
};

const userImageSlice = createSlice({
  name: 'userImg',
  initialState,
  reducers: {
    setDisplayImageUrl: (state, action: PayloadAction<string>) => {
      state.displayImageUrl = action.payload;
    },
  },
});

export interface userImageSliceState {
    displayImageUrl: string;
}

export const { setDisplayImageUrl } = userImageSlice.actions;
export default userImageSlice.reducer;
