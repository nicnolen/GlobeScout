import { PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../types/users';
import { UserData } from '../../../../types/users';

export const setUser = (state: UserState, action: PayloadAction<UserData>) => {
    state.user = action.payload;
};
