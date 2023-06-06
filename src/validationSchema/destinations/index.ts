import * as yup from 'yup';
import { recommendationValidationSchema } from 'validationSchema/recommendations';
import { userDestinationValidationSchema } from 'validationSchema/user-destinations';
import { userFeedbackValidationSchema } from 'validationSchema/user-feedbacks';

export const destinationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  travel_planner_id: yup.string().nullable().required(),
  recommendation: yup.array().of(recommendationValidationSchema),
  user_destination: yup.array().of(userDestinationValidationSchema),
  user_feedback: yup.array().of(userFeedbackValidationSchema),
});
