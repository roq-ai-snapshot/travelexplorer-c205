import axios from 'axios';
import queryString from 'query-string';
import { UserFeedbackInterface } from 'interfaces/user-feedback';
import { GetQueryInterface } from '../../interfaces';

export const getUserFeedbacks = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-feedbacks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserFeedback = async (userFeedback: UserFeedbackInterface) => {
  const response = await axios.post('/api/user-feedbacks', userFeedback);
  return response.data;
};

export const updateUserFeedbackById = async (id: string, userFeedback: UserFeedbackInterface) => {
  const response = await axios.put(`/api/user-feedbacks/${id}`, userFeedback);
  return response.data;
};

export const getUserFeedbackById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-feedbacks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserFeedbackById = async (id: string) => {
  const response = await axios.delete(`/api/user-feedbacks/${id}`);
  return response.data;
};
