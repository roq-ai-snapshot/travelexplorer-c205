import * as yup from 'yup';
import { userRecommendationValidationSchema } from 'validationSchema/user-recommendations';

export const recommendationValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  destination_id: yup.string().nullable().required(),
  user_recommendation: yup.array().of(userRecommendationValidationSchema),
});
