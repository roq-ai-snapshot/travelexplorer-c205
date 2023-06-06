import { UserInterface } from 'interfaces/user';
import { DestinationInterface } from 'interfaces/destination';

export interface UserFeedbackInterface {
  id?: string;
  rating: number;
  comment?: string;
  user_id: string;
  destination_id: string;

  user?: UserInterface;
  destination?: DestinationInterface;
  _count?: {};
}
