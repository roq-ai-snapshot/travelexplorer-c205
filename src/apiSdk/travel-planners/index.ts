import axios from 'axios';
import queryString from 'query-string';
import { TravelPlannerInterface } from 'interfaces/travel-planner';
import { GetQueryInterface } from '../../interfaces';

export const getTravelPlanners = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/travel-planners${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTravelPlanner = async (travelPlanner: TravelPlannerInterface) => {
  const response = await axios.post('/api/travel-planners', travelPlanner);
  return response.data;
};

export const updateTravelPlannerById = async (id: string, travelPlanner: TravelPlannerInterface) => {
  const response = await axios.put(`/api/travel-planners/${id}`, travelPlanner);
  return response.data;
};

export const getTravelPlannerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/travel-planners/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTravelPlannerById = async (id: string) => {
  const response = await axios.delete(`/api/travel-planners/${id}`);
  return response.data;
};
