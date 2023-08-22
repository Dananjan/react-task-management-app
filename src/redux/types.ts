import { userNameSliceState } from './userNameSlice';
import { LoadingSliceState } from './loadingSlice';
import { userImageSliceState } from './userImageSlice';

export interface RootState {
  user:userNameSliceState;
  loading: LoadingSliceState;
  userImg: userImageSliceState;
}
