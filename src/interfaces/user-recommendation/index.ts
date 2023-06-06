import { UserInterface } from 'interfaces/user';
import { RecommendationInterface } from 'interfaces/recommendation';

export interface UserRecommendationInterface {
  id?: string;
  user_id: string;
  recommendation_id: string;

  user?: UserInterface;
  recommendation?: RecommendationInterface;
  _count?: {};
}
