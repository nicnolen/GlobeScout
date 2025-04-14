import { PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserData } from '../../types/users';

export const setUser = (state: UserState, action: PayloadAction<UserData>) => {
    state.user = action.payload;
};
