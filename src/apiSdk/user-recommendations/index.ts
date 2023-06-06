import axios from 'axios';
import queryString from 'query-string';
import { UserRecommendationInterface } from 'interfaces/user-recommendation';
import { GetQueryInterface } from '../../interfaces';

export const getUserRecommendations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-recommendations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserRecommendation = async (userRecommendation: UserRecommendationInterface) => {
  const response = await axios.post('/api/user-recommendations', userRecommendation);
  return response.data;
};

export const updateUserRecommendationById = async (id: string, userRecommendation: UserRecommendationInterface) => {
  const response = await axios.put(`/api/user-recommendations/${id}`, userRecommendation);
  return response.data;
};

export const getUserRecommendationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-recommendations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserRecommendationById = async (id: string) => {
  const response = await axios.delete(`/api/user-recommendations/${id}`);
  return response.data;
};
