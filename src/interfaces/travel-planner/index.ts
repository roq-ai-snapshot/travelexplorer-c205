import { DestinationInterface } from 'interfaces/destination';
import { UserInterface } from 'interfaces/user';

export interface TravelPlannerInterface {
  id?: string;
  name: string;
  user_id: string;
  destination?: DestinationInterface[];
  user?: UserInterface;
  _count?: {
    destination?: number;
  };
}
