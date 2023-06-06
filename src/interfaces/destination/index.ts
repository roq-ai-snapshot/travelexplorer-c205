import { RecommendationInterface } from 'interfaces/recommendation';
import { UserDestinationInterface } from 'interfaces/user-destination';
import { UserFeedbackInterface } from 'interfaces/user-feedback';
import { TravelPlannerInterface } from 'interfaces/travel-planner';

export interface DestinationInterface {
  id?: string;
  name: string;
  description?: string;
  travel_planner_id: string;
  recommendation?: RecommendationInterface[];
  user_destination?: UserDestinationInterface[];
  user_feedback?: UserFeedbackInterface[];
  travel_planner?: TravelPlannerInterface;
  _count?: {
    recommendation?: number;
    user_destination?: number;
    user_feedback?: number;
  };
}
