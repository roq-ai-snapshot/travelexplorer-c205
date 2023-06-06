import { UserRecommendationInterface } from 'interfaces/user-recommendation';
import { DestinationInterface } from 'interfaces/destination';

export interface RecommendationInterface {
  id?: string;
  title: string;
  description?: string;
  destination_id: string;
  user_recommendation?: UserRecommendationInterface[];
  destination?: DestinationInterface;
  _count?: {
    user_recommendation?: number;
  };
}
