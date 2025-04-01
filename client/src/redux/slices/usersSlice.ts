import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../types/users';
import * as usersReducers from '../reducers/usersReducers';

const initialState: UserState = {
    user: null,
};

const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: usersReducers,
});

// define actions
export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
