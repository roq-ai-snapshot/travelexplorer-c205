import axios from 'axios';
import queryString from 'query-string';
import { UserDestinationInterface } from 'interfaces/user-destination';
import { GetQueryInterface } from '../../interfaces';

export const getUserDestinations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-destinations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserDestination = async (userDestination: UserDestinationInterface) => {
  const response = await axios.post('/api/user-destinations', userDestination);
  return response.data;
};

export const updateUserDestinationById = async (id: string, userDestination: UserDestinationInterface) => {
  const response = await axios.put(`/api/user-destinations/${id}`, userDestination);
  return response.data;
};

export const getUserDestinationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-destinations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserDestinationById = async (id: string) => {
  const response = await axios.delete(`/api/user-destinations/${id}`);
  return response.data;
};
