import { RootState } from '../store';
import { UserData } from '../../types/users';

export const selectUser = (state: RootState): UserData => state.users.user;
