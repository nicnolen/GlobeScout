import { placeResolvers } from './googleMapsResolvers';
import { weatherResolvers } from './weatherResolvers';
import { usersResolvers } from './usersResolvers';

export const resolvers = [placeResolvers, weatherResolvers, usersResolvers];
