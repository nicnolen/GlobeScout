import { GET_TOP_TEN_PLACES } from './googleMapsSchema';
import { GET_WEATHER } from './weatherSchema';
import { GET_USERS, EDIT_USERS } from './usersSchema';

export const typeDefs = [GET_TOP_TEN_PLACES, GET_WEATHER, GET_USERS, EDIT_USERS];
