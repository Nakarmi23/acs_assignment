import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '../../model/user';

export interface AuthState {
  user: IUser | null;
  authState: 'loggedIn' | 'loggedOut' | 'uncertain';
}

const initialState = {
  user: null,
  authState: 'uncertain',
} as AuthState;

const counterSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveSessionUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.authState = 'loggedIn';
    },
    removeSessionUser(state) {
      state.user = null;
      state.authState = 'loggedOut';
    },
  },
});

export const { removeSessionUser, saveSessionUser } = counterSlice.actions;
export default counterSlice.reducer;
